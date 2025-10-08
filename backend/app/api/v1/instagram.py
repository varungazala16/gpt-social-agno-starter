from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select, update
from uuid import UUID

from app.core.auth import User
from app.core.database import Database
from app.models.social_account import SocialAccount, Platform
from app.schemas.social_account import OAuthAuthorizeResponse, OAuthCallbackResponse, SocialAccountResponse
from app.services.oauth.instagram import InstagramOAuth
from app.services.api.instagram import InstagramAPIClient

router = APIRouter()


@router.get("/oauth2/authorize", response_model=OAuthAuthorizeResponse)
async def instagram_authorize(current_user: User):
    """Initiate Instagram OAuth flow"""
    oauth = InstagramOAuth()
    authorization_url, state = oauth.generate_authorization_url()

    # TODO: Store state in Redis/session for CSRF protection

    return OAuthAuthorizeResponse(
        authorization_url=authorization_url,
        state=state
    )


@router.get("/oauth2/callback", response_model=OAuthCallbackResponse)
async def instagram_callback(
    current_user: User,
    db: Database,
    code: str = Query(..., description="Authorization code from Instagram"),
    state: str = Query(..., description="State parameter for CSRF protection"),
):
    """Handle Instagram OAuth callback"""

    # TODO: Verify state parameter against stored value

    oauth = InstagramOAuth()

    try:
        # Exchange code for short-lived token
        short_lived_token_response = await oauth.exchange_code_for_token(code)

        # Exchange for long-lived token (60 days)
        long_lived_token_response = await oauth.exchange_for_long_lived_token(
            short_lived_token_response["access_token"]
        )

        # Get user info
        api_client = InstagramAPIClient(long_lived_token_response["access_token"])
        user_info = await api_client.get_user_info()

        # Create social account object
        social_account_data = oauth.create_social_account_from_tokens(
            long_lived_token_response, user_info
        )

        # Check if account already exists
        result = await db.execute(
            select(SocialAccount).where(
                SocialAccount.user_id == UUID(current_user.id),
                SocialAccount.platform == Platform.INSTAGRAM
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
            message="Instagram account connected successfully",
            account=SocialAccountResponse.model_validate(account)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Instagram OAuth failed: {str(e)}"
        )


@router.get("/account", response_model=SocialAccountResponse)
async def get_instagram_account(
    current_user: User,
    db: Database,
):
    """Get user's connected Instagram account"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id),
            SocialAccount.platform == Platform.INSTAGRAM
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Instagram account connected"
        )

    return SocialAccountResponse.model_validate(account)


@router.delete("/account")
async def disconnect_instagram(
    current_user: User,
    db: Database,
):
    """Disconnect Instagram account"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id),
            SocialAccount.platform == Platform.INSTAGRAM
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Instagram account connected"
        )

    await db.delete(account)
    await db.commit()

    return {"success": True, "message": "Instagram account disconnected"}


@router.get("/media")
async def get_instagram_media(
    current_user: User,
    db: Database,
    limit: int = Query(25, ge=1, le=25),
    after: str = Query(None, description="Pagination cursor"),
):
    """Get user's Instagram media"""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.user_id == UUID(current_user.id),
            SocialAccount.platform == Platform.INSTAGRAM
        )
    )
    account = result.scalar_one_or_none()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Instagram account connected"
        )

    api_client = InstagramAPIClient(account.access_token)
    media = await api_client.get_media(limit=limit, after=after)

    return media