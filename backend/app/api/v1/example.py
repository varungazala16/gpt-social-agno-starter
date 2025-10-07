from fastapi import APIRouter
from pydantic import BaseModel

from app.core.auth import User

router = APIRouter()


class MessageResponse(BaseModel):
    message: str
    user_id: str
    user_email: str


@router.get("/protected", response_model=MessageResponse)
async def protected_route(current_user: User) -> MessageResponse:
    """Example protected route that requires authentication"""
    return MessageResponse(
        message="This is a protected route!",
        user_id=current_user.id,
        user_email=current_user.email
    )
