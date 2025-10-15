"""Credits endpoints including test and balance."""

from fastapi import APIRouter

from app.core.auth import SupabaseClient, User, require_credits
from app.core.database import Database
from app.schemas.credit import CreditBalanceResponse
from app.services.credits import CreditsService

router = APIRouter()


@router.post("/test-insufficient-credits")
@require_credits(cost=1_000_000_000)  # 1 billion credits - always fails
async def test_insufficient_credits(
    current_user: User,
    db: Database,
    supabase_client: SupabaseClient,
) -> dict[str, str]:
    """
    Test endpoint that requires 1 billion credits - will always return 402 Payment Required.
    
    This is useful for testing the credits system behavior when users don't have enough credits.
    """
    return {
        "message": "This should never be returned since no user has 1 billion credits!",
        "user_id": current_user.id,
    }


@router.get("/balance", response_model=CreditBalanceResponse)
async def get_credit_balance(
    current_user: User,
    db: Database,
    supabase_client: SupabaseClient,
) -> CreditBalanceResponse:
    """Get current user's credit balance."""
    credits_service = CreditsService(db, supabase_client)
    balance = await credits_service.get_user_balance(current_user.id)
    
    return CreditBalanceResponse(
        user_id=current_user.id,
        balance=balance
    )


@router.post("/initialize", response_model=CreditBalanceResponse)
async def initialize_user_credits(
    current_user: User,
    db: Database,
    supabase_client: SupabaseClient,
) -> CreditBalanceResponse:
    """Initialize credits for a user if not already initialized"""
    credits_service = CreditsService(db, supabase_client)
    
    try:
        user_credit = await credits_service.get_or_create_user_credit(current_user.id)
        return CreditBalanceResponse(balance=user_credit.balance, user_id=current_user.id)
    except Exception as e:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initialize credits: {str(e)}"
        ) from e


@router.post("/test-small-operation")
@require_credits(cost=5)
async def test_small_operation(
    current_user: User,
    db: Database,
    supabase_client: SupabaseClient,
) -> dict[str, str]:
    """
    Test endpoint that requires 5 credits - should succeed for most users.
    
    This is useful for testing successful credit deduction.
    """
    return {
        "message": "Small operation completed successfully! 5 credits deducted.",
        "user_id": current_user.id,
        "operation": "test_small_operation"
    }
