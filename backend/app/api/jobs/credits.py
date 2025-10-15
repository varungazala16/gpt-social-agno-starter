"""Credits management job endpoints."""

import logging
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.credit import CreditTransaction, UserCredit

router = APIRouter()


@router.post("/monthly-credits-topup")
async def monthly_credits_topup(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Monthly job to top-up users with credits below 1000 back to 1000.
    
    This endpoint should be called by Cloud Scheduler on the first day of each month.
    It finds all users with balance < 1000 and tops them up to 1000 credits.
    """
    try:
        # Find all users with balance < 1000
        result = await db.execute(
            select(UserCredit).where(UserCredit.balance < 1000)
        )
        users_to_topup = list(result.scalars().all())
        
        if not users_to_topup:
            logging.info("Monthly top-up: No users need credit top-ups")
            return {
                "message": "No users needed top-ups",
                "users_processed": 0,
                "total_credits_added": 0,
                "timestamp": datetime.utcnow().isoformat(),
            }
        
        users_processed = 0
        total_credits_added = 0
        
        # Process each user that needs a top-up
        for user_credit in users_to_topup:
            old_balance = user_credit.balance
            credits_to_add = 1000 - old_balance
            new_balance = 1000
            
            # Update user balance to 1000
            user_credit.balance = new_balance
            
            # Create transaction record
            transaction = CreditTransaction(
                user_id=user_credit.user_id,
                amount=credits_to_add,
                balance_after=new_balance,
                transaction_type="topup",
                description="Monthly credit top-up"
            )
            db.add(transaction)
            
            users_processed += 1
            total_credits_added += credits_to_add
            
            logging.info(
                f"Monthly top-up: User {user_credit.user_id} topped up from {old_balance} to {new_balance} credits"
            )
        
        # Commit all changes
        await db.commit()
        
        logging.info(
            f"Monthly top-up completed: {users_processed} users processed, {total_credits_added} total credits added"
        )
        
        return {
            "message": "Monthly credit top-up completed successfully",
            "users_processed": users_processed,
            "total_credits_added": total_credits_added,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
    except Exception as e:
        await db.rollback()
        logging.error(f"Monthly top-up failed: {str(e)}", exc_info=True)
        raise