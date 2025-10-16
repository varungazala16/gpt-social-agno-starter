import logging
from typing import Optional
from uuid import UUID

from sqlalchemy import cast, select
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import Database
from app.core.types import SupabaseClient
from app.models.credit import CreditTransaction, UserCredit


class InsufficientCreditsError(Exception):
    """Raised when user doesn't have enough credits for an operation."""

    def __init__(self, required: int, available: int) -> None:
        self.required = required
        self.available = available
        super().__init__(f"Insufficient credits: required {required}, available {available}")


class CreditsService:
    """Service for managing user credits and transactions."""

    def __init__(self, db: AsyncSession, supabase_client: SupabaseClient) -> None:
        self.db = db
        self.supabase = supabase_client

    async def get_user_balance(self, user_id: str) -> int:
        """Get current credit balance for a user."""
        result = await self.db.execute(
            select(UserCredit.balance).where(UserCredit.user_id == cast(user_id, PG_UUID))
        )
        balance = result.scalar_one_or_none()
        return balance if balance is not None else 0

    async def get_or_create_user_credit(self, user_id: str) -> UserCredit:
        """Get existing user credit record or create one with default balance."""
        result = await self.db.execute(
            select(UserCredit).where(UserCredit.user_id == cast(user_id, PG_UUID))
        )
        user_credit = result.scalar_one_or_none()

        if user_credit is None:
            user_credit = UserCredit(user_id=user_id, balance=1000)
            self.db.add(user_credit)

            # Record initialization transaction
            transaction = CreditTransaction(
                user_id=user_id,
                amount=1000,
                balance_after=1000,
                transaction_type="initialize",
                description="Initial credit allocation",
            )
            self.db.add(transaction)
            await self.db.commit()
            await self.db.refresh(user_credit)

        return user_credit

    async def deduct_credits(self, user_id: str, amount: int, description: str | None = None) -> tuple[int, int]:
        """
        Deduct credits from user account.

        Returns:
            Tuple of (old_balance, new_balance)

        Raises:
            InsufficientCreditsError: If user doesn't have enough credits
        """
        user_credit = await self.get_or_create_user_credit(user_id)

        if user_credit.balance < amount:
            raise InsufficientCreditsError(amount, int(user_credit.balance))

        old_balance = int(user_credit.balance)
        new_balance = old_balance - amount

        # Update balance
        user_credit.balance = new_balance  # type: ignore[assignment]

        # Record transaction
        transaction = CreditTransaction(
            user_id=user_id,
            amount=-amount,  # Negative for deductions
            balance_after=new_balance,
            transaction_type="deduct",
            description=description,
        )
        self.db.add(transaction)

        await self.db.commit()

        logging.info(
            "Credits deducted",
            extra={
                "user_id": user_id,
                "amount": amount,
                "old_balance": old_balance,
                "new_balance": new_balance,
                "description": description,
            },
        )

        return old_balance, new_balance

    async def add_credits(self, user_id: str, amount: int, description: str | None = None) -> tuple[int, int]:
        """
        Add credits to user account.

        Returns:
            Tuple of (old_balance, new_balance)
        """
        user_credit = await self.get_or_create_user_credit(user_id)

        old_balance = int(user_credit.balance)
        new_balance = old_balance + amount

        # Update balance
        user_credit.balance = new_balance  # type: ignore[assignment]

        # Record transaction
        transaction = CreditTransaction(
            user_id=user_id,
            amount=amount,  # Positive for additions
            balance_after=new_balance,
            transaction_type="topup",
            description=description,
        )
        self.db.add(transaction)

        await self.db.commit()

        logging.info(
            "Credits added",
            extra={
                "user_id": user_id,
                "amount": amount,
                "old_balance": old_balance,
                "new_balance": new_balance,
                "description": description,
            },
        )

        return old_balance, new_balance
    
    async def get_user_transactions(
        self,
        user_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> list[CreditTransaction]:
        """Get user's credit transaction history."""
        result = await self.db.execute(
            select(CreditTransaction)
            .where(CreditTransaction.user_id == cast(user_id, PG_UUID))
            .order_by(CreditTransaction.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())


async def get_credits_service(db: Database, supabase_client: SupabaseClient) -> CreditsService:
    """Dependency to get credits service instance."""
    return CreditsService(db, supabase_client)
