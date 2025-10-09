from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select, update

from app.core.auth import User
from app.core.database import Database
from app.models.social_account import Platform, SocialAccount
from app.schemas.social_account import OAuthAuthorizeResponse, OAuthCallbackResponse, SocialAccountResponse
from app.services.api.youtube import YouTubeAPIClient
from app.services.oauth.youtube import YouTubeOAuth

router = APIRouter()


@router.get("/oauth2/authorize", response_model=OAuthAuthorizeResponse)
async def youtube_authorize(current_user: User) -> OAuthAuthorizeResponse:
    """Initiate YouTube OAuth flow"""
    oauth = YouTubeOAuth()

    # Include user_id in state for callback
    state_data = f"{current_user.id}"
    authorization_url, state = oauth.generate_authorization_url(state=state_data)

    # TODO: Store state in Redis for CSRF protection and to verify in callback

    return OAuthAuthorizeResponse(authorization_url=authorization_url, state=state)


@router.get("/oauth2/callback", response_model=OAuthCallbackResponse)
async def youtube_callback(
    db: Database,
    code: str = Query(..., description="Authorization code from YouTube"),
    state: str = Query(..., description="State parameter for CSRF protection"),
) -> OAuthCallbackResponse:
    """Handle YouTube OAuth callback (public endpoint)"""

    # Extract user_id from state
    # TODO: Verify state parameter against stored value in Redis for CSRF protection
    try:
        user_id = UUID(state)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state parameter") from e

    oauth = YouTubeOAuth()

    try:
        # Exchange code for tokens
        token_response = await oauth.exchange_code_for_token(code)

        # Get channel info
        api_client = YouTubeAPIClient(token_response["access_token"])
        channel_info = await api_client.get_channel_info()

        # Create social account object
        social_account_data = oauth.create_social_account_from_tokens(token_response, channel_info)

        # Check if account already exists
        result = await db.execute(
            select(SocialAccount).where(SocialAccount.user_id == user_id, SocialAccount.platform == Platform.YOUTUBE)
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
            account = existing_account
        else:
            # Create new account
            account = SocialAccount(user_id=user_id, **social_account_data.model_dump())
            db.add(account)
            await db.commit()
            await db.refresh(account)

        return OAuthCallbackResponse(
            success=True,
            message="YouTube account connected successfully",
            account=SocialAccountResponse.model_validate(account),
        )

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"YouTube OAuth failed: {str(e)}") from e


@router.get("/account", response_model=SocialAccountResponse)
async def get_youtube_account(
    current_user: User,
    db: Database,
) -> SocialAccountResponse:
    """Get user's connected YouTube account"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id), SocialAccount.platform == Platform.YOUTUBE
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No YouTube account connected")

    return SocialAccountResponse.model_validate(account)


@router.delete("/account")
async def disconnect_youtube(
    current_user: User,
    db: Database,
) -> dict[str, Any]:
    """Disconnect YouTube account"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id), SocialAccount.platform == Platform.YOUTUBE
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No YouTube account connected")

    # Optionally revoke the token
    try:
        oauth = YouTubeOAuth()
        await oauth.revoke_token(str(account.access_token))
    except Exception:
        pass  # Continue even if revocation fails

    await db.delete(account)
    await db.commit()

    return {"success": True, "message": "YouTube account disconnected"}


@router.get("/videos")
async def get_youtube_videos(
    current_user: User,
    db: Database,
    max_results: int = Query(25, ge=1, le=50),
    page_token: str = Query(None, description="Pagination token"),
) -> dict[str, Any]:
    """Get user's YouTube Shorts (short-form videos only)"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id), SocialAccount.platform == Platform.YOUTUBE
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No YouTube account connected")

    api_client = YouTubeAPIClient(str(account.access_token))
    # Only return shorts (short-form content)
    shorts = await api_client.get_shorts(max_results=max_results, page_token=page_token)

    return shorts
