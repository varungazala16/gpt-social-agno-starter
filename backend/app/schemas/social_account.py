from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel

from app.models.social_account import Platform


class SocialAccountBase(BaseModel):
    platform: Platform
    platform_user_id: str
    platform_username: str | None = None
    scopes: list[str] | None = None
    platform_metadata: dict[str, Any] | None = None


class SocialAccountCreate(SocialAccountBase):
    access_token: str
    refresh_token: str | None = None
    token_expires_at: datetime | None = None


class SocialAccountResponse(SocialAccountBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    token_expires_at: datetime | None = None

    class Config:
        from_attributes = True


class OAuthCallbackResponse(BaseModel):
    success: bool
    message: str
    account: SocialAccountResponse | None = None


class OAuthAuthorizeResponse(BaseModel):
    authorization_url: str
    state: str


class SocialAccountListResponse(BaseModel):
    accounts: list[SocialAccountResponse]
    total: int
