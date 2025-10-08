from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.models.social_account import Platform


class SocialAccountBase(BaseModel):
    platform: Platform
    platform_user_id: str
    platform_username: Optional[str] = None
    scopes: Optional[list[str]] = None
    platform_metadata: Optional[dict] = None


class SocialAccountCreate(SocialAccountBase):
    access_token: str
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None


class SocialAccountResponse(SocialAccountBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    token_expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OAuthCallbackResponse(BaseModel):
    success: bool
    message: str
    account: Optional[SocialAccountResponse] = None


class OAuthAuthorizeResponse(BaseModel):
    authorization_url: str
    state: str


class SocialAccountListResponse(BaseModel):
    accounts: list[SocialAccountResponse]
    total: int