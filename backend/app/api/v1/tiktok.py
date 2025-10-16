from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select, update

from app.core.auth import User
from app.core.config import settings
from app.core.database import Database
from app.models.social_account import Platform, SocialAccount
from app.schemas.social_account import OAuthAuthorizeResponse, SocialAccountResponse
from app.services.api.tiktok import TikTokAPIClient
from app.services.oauth.tiktok import TikTokOAuth

router = APIRouter()


@router.get("/oauth2/authorize", response_model=OAuthAuthorizeResponse)
async def tiktok_authorize(current_user: User) -> OAuthAuthorizeResponse:
    """Initiate TikTok OAuth flow"""
    oauth = TikTokOAuth()

    # Include user_id in state for callback
    state_data = f"{current_user.id}"
    authorization_url, state = oauth.generate_authorization_url(state=state_data)

    # TODO: Store state in Redis for CSRF protection and to verify in callback

    return OAuthAuthorizeResponse(authorization_url=authorization_url, state=state)


@router.get("/oauth2/callback", response_class=RedirectResponse)
async def tiktok_callback(
    db: Database,
    code: str = Query(..., description="Authorization code from TikTok"),
    state: str = Query(..., description="State parameter for CSRF protection"),
) -> RedirectResponse:
    """Handle TikTok OAuth callback (public endpoint)"""

    # Extract user_id from state
    # TODO: Verify state parameter against stored value in Redis for CSRF protection
    try:
        user_id = UUID(state)
    except ValueError:
        # Redirect to settings with error parameter
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/settings?error=invalid_state",
            status_code=status.HTTP_303_SEE_OTHER,
        )

    oauth = TikTokOAuth()

    try:
        # Exchange code for tokens
        token_response = await oauth.exchange_code_for_token(code, state)

        # Get user info
        api_client = TikTokAPIClient(token_response["access_token"])
        user_info = await api_client.get_user_info()

        # Create social account object
        social_account_data = oauth.create_social_account_from_tokens(token_response, user_info)

        # Check if account already exists
        result = await db.execute(
            select(SocialAccount).where(SocialAccount.user_id == user_id, SocialAccount.platform == Platform.TIKTOK)
        )
        existing_account = result.scalar_one_or_none()

        if existing_account:
            # Update existing account
            await db.execute(
                update(SocialAccount)
                .where(SocialAccount.id == existing_account.id)
                .values(
                    platform_user_id=social_account_data.platform_user_id,
                    platform_username=social_account_data.platform_username,
                    access_token=social_account_data.access_token,
                    refresh_token=social_account_data.refresh_token,
                    token_expires_at=social_account_data.token_expires_at,
                    scopes=social_account_data.scopes,
                    platform_metadata=social_account_data.platform_metadata,
                )
            )
            await db.commit()
            await db.refresh(existing_account)
        else:
            # Create new account
            account = SocialAccount(user_id=user_id, **social_account_data.model_dump())
            db.add(account)
            await db.commit()

        # Redirect back to settings page with success
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/settings?connected=tiktok",
            status_code=status.HTTP_303_SEE_OTHER,
        )

    except Exception as e:
        # Redirect to settings with error parameter
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/settings?error=tiktok_failed&message={str(e)}",
            status_code=status.HTTP_303_SEE_OTHER,
        )


@router.get("/account", response_model=SocialAccountResponse)
async def get_tiktok_account(
    current_user: User,
    db: Database,
) -> SocialAccountResponse:
    """Get user's connected TikTok account"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id), SocialAccount.platform == Platform.TIKTOK
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No TikTok account connected")

    return SocialAccountResponse.model_validate(account)


@router.delete("/account")
async def disconnect_tiktok(
    current_user: User,
    db: Database,
) -> dict[str, Any]:
    """Disconnect TikTok account"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id), SocialAccount.platform == Platform.TIKTOK
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No TikTok account connected")

    await db.delete(account)
    await db.commit()

    return {"success": True, "message": "TikTok account disconnected"}


@router.get("/videos")
async def get_tiktok_videos(
    current_user: User,
    db: Database,
    max_count: int = Query(20, ge=1, le=20),
    cursor: int = Query(0, ge=0),
) -> dict[str, Any]:
    """Get user's TikTok videos"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id), SocialAccount.platform == Platform.TIKTOK
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No TikTok account connected")

    api_client = TikTokAPIClient(str(account.access_token))
    videos = await api_client.get_videos(max_count=max_count, cursor=cursor)

    return videos
