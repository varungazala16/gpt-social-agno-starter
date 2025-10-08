import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.social_account import SocialAccountCreate


class InstagramOAuth:
    """Instagram OAuth 2.0 service (via Facebook Graph API)"""

    AUTHORIZATION_URL = "https://api.instagram.com/oauth/authorize"
    TOKEN_URL = "https://api.instagram.com/oauth/access_token"
    LONG_LIVED_TOKEN_URL = "https://graph.instagram.com/access_token"
    SCOPES = [ # TODO(ennsharma)
        "user_profile",
        "user_media",
        "instagram_business_basic",
        "instagram_business_manage_insights",
    ]
    STATE_LENGTH = 32

    def __init__(self):
        self.client_id = settings.INSTAGRAM_CLIENT_ID
        self.client_secret = settings.INSTAGRAM_CLIENT_SECRET
        self.redirect_uri = settings.INSTAGRAM_REDIRECT_URI

    def generate_authorization_url(self, state: Optional[str] = None) -> tuple[str, str]:
        """
        Generate Instagram OAuth authorization URL

        Returns:
            tuple[str, str]: (authorization_url, state)
        """
        if not state:
            state = secrets.token_urlsafe(self.STATE_LENGTH)

        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": ",".join(self.SCOPES),
            "response_type": "code",
            "state": state,
        }

        authorization_url = f"{self.AUTHORIZATION_URL}?{urlencode(params)}"
        return authorization_url, state

    async def exchange_code_for_token(self, code: str) -> dict:
        """
        Exchange authorization code for short-lived access token

        Args:
            code: Authorization code from callback

        Returns:
            dict: Token response with access_token, user_id, etc.
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.TOKEN_URL,
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "grant_type": "authorization_code",
                    "redirect_uri": self.redirect_uri,
                    "code": code,
                },
            )

            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Instagram token exchange failed: {response.text}",
                )

            return response.json()

    async def exchange_for_long_lived_token(self, short_lived_token: str) -> dict:
        """
        Exchange short-lived token for long-lived token (60 days)

        Args:
            short_lived_token: Short-lived access token

        Returns:
            dict: Long-lived token response
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.LONG_LIVED_TOKEN_URL,
                params={
                    "grant_type": "ig_exchange_token",
                    "client_secret": self.client_secret,
                    "access_token": short_lived_token,
                },
            )

            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Instagram long-lived token exchange failed: {response.text}",
                )

            return response.json()

    async def refresh_access_token(self, access_token: str) -> dict:
        """
        Refresh long-lived token (before it expires)

        Args:
            access_token: Current long-lived access token

        Returns:
            dict: Refreshed token response
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.LONG_LIVED_TOKEN_URL,
                params={
                    "grant_type": "ig_refresh_token",
                    "access_token": access_token,
                },
            )

            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Instagram token refresh failed: {response.text}",
                )

            return response.json()

    def create_social_account_from_tokens(
        self, token_response: dict, user_info: dict
    ) -> SocialAccountCreate:
        """
        Create SocialAccountCreate object from Instagram API responses

        Args:
            token_response: Response from token exchange
            user_info: Response from user info API

        Returns:
            SocialAccountCreate: Ready to save to database
        """
        expires_in = token_response.get("expires_in", 60 * 60 * 24 * 60)  # Default 60 days
        token_expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

        return SocialAccountCreate(
            platform="instagram",
            platform_user_id=token_response.get("user_id") or user_info.get("id"),
            platform_username=user_info.get("username"),
            access_token=token_response["access_token"],
            refresh_token=None,  # Instagram uses token refresh, not refresh_token
            token_expires_at=token_expires_at,
            scopes=None,
            platform_metadata={
                "account_type": user_info.get("account_type"),
                "media_count": user_info.get("media_count"),
            },
        )
