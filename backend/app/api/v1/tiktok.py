from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select, update
from uuid import UUID

from app.core.auth import User
from app.core.database import Database
from app.models.social_account import SocialAccount, Platform
from app.schemas.social_account import OAuthAuthorizeResponse, OAuthCallbackResponse, SocialAccountResponse
from app.services.oauth.tiktok import TikTokOAuth
from app.services.api.tiktok import TikTokAPIClient

router = APIRouter()


@router.get("/oauth2/authorize", response_model=OAuthAuthorizeResponse)
async def tiktok_authorize(current_user: User):
    """Initiate TikTok OAuth flow"""
    oauth = TikTokOAuth()
    print(f"[DEBUG] TikTok redirect_uri: {oauth.redirect_uri}")
    authorization_url, state = oauth.generate_authorization_url()
    print(f"[DEBUG] Authorization URL: {authorization_url}")

    # TODO: Store state in Redis/session for CSRF protection
    # https://www.tiktok.com/v2/auth/authorize/?client_key=sbaw947o3ugmdjide4&redirect_uri=https%3A%2F%2Fapi.scrollmark-staging.com%2Fv1%2Ftiktok%2Fcreator%2Foauth2%2Fcallback%2F&scope=user.info.basic,user.info.stats,user.info.profile,video.list&state=940c6e3d8fd71a2bbe2c805fec38a2f39a8df2e15abd7e61400c9a025029106d&response_type=code

    return OAuthAuthorizeResponse(
        authorization_url=authorization_url,
        state=state
    )


@router.get("/oauth2/callback", response_model=OAuthCallbackResponse)
async def tiktok_callback(
    current_user: User,
    db: Database,
    code: str = Query(..., description="Authorization code from TikTok"),
    state: str = Query(..., description="State parameter for CSRF protection"),
):
    """Handle TikTok OAuth callback"""

    # TODO: Verify state parameter against stored value

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
            select(SocialAccount).where(
                SocialAccount.user_id == UUID(current_user.id),
                SocialAccount.platform == Platform.TIKTOK
            )
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
            account = SocialAccount(
                user_id=UUID(current_user.id),
                **social_account_data.model_dump()
            )
            db.add(account)
            await db.commit()
            await db.refresh(account)

        return OAuthCallbackResponse(
            success=True,
            message="TikTok account connected successfully",
            account=SocialAccountResponse.model_validate(account)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"TikTok OAuth failed: {str(e)}"
        )


@router.get("/account", response_model=SocialAccountResponse)
async def get_tiktok_account(
    current_user: User,
    db: Database,
):
    """Get user's connected TikTok account"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id),
            SocialAccount.platform == Platform.TIKTOK
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No TikTok account connected"
        )

    return SocialAccountResponse.model_validate(account)


@router.delete("/account")
async def disconnect_tiktok(
    current_user: User,
    db: Database,
):
    """Disconnect TikTok account"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id),
            SocialAccount.platform == Platform.TIKTOK
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No TikTok account connected"
        )

    await db.delete(account)
    await db.commit()

    return {"success": True, "message": "TikTok account disconnected"}


@router.get("/videos")
async def get_tiktok_videos(
    current_user: User,
    db: Database,
    max_count: int = Query(20, ge=1, le=20),
    cursor: int = Query(0, ge=0),
):
    """Get user's TikTok videos"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id),
            SocialAccount.platform == Platform.TIKTOK
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No TikTok account connected"
        )

    api_client = TikTokAPIClient(account.access_token)
    videos = await api_client.get_videos(max_count=max_count, cursor=cursor)

    return videos
