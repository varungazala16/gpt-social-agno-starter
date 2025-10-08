from fastapi import APIRouter
from sqlalchemy import select
from uuid import UUID

from app.core.auth import User
from app.core.database import Database
from app.models.social_account import SocialAccount
from app.schemas.social_account import SocialAccountListResponse, SocialAccountResponse

router = APIRouter()


@router.get("", response_model=SocialAccountListResponse)
async def list_connections(
    current_user: User,
    db: Database,
):
    """List all connected social accounts for the current user"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id)
        )
    )
    accounts = result.scalars().all()

    return SocialAccountListResponse(
        accounts=[SocialAccountResponse.model_validate(account) for account in accounts],
        total=len(accounts)
    )