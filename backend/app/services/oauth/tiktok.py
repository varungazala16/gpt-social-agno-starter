import secrets
from datetime import UTC, datetime, timedelta
from typing import Any, cast
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.models.social_account import Platform
from app.schemas.social_account import SocialAccountCreate


class TikTokOAuth:
    """TikTok OAuth 2.0 service for Web Login Kit with PKCE support"""

    AUTHORIZATION_URL = "https://www.tiktok.com/v2/auth/authorize/"
    TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/"
    SCOPES = [
        "user.info.basic",
        "user.info.stats",
        "user.info.profile",
        "video.list",
    ]
    STATE_LENGTH = 32

    def __init__(self) -> None:
        self.client_key = settings.TIKTOK_CLIENT_KEY
        self.client_secret = settings.TIKTOK_CLIENT_SECRET
        self.redirect_uri = settings.TIKTOK_REDIRECT_URI

    def generate_authorization_url(self, state: str | None = None) -> tuple[str, str]:
        """
        Generate TikTok OAuth authorization URL with PKCE

        Returns:
            tuple[str, str]: (authorization_url, state)
        """
        if not state:
            state = secrets.token_urlsafe(self.STATE_LENGTH)

        params = {
            "client_key": self.client_key,
            "scope": ",".join(self.SCOPES),
            "response_type": "code",
            "redirect_uri": self.redirect_uri,
            "state": state,
        }
        authorization_url = f"{self.AUTHORIZATION_URL}?{urlencode(params, safe=',')}"

        return authorization_url, state

    async def exchange_code_for_token(self, code: str, state: str) -> dict[str, Any]:
        """
        Exchange authorization code for access token

        Args:
            code: Authorization code from callback

        Returns:
            dict: Token response with access_token, refresh_token, etc.
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.TOKEN_URL,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "client_key": self.client_key,
                    "client_secret": self.client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": self.redirect_uri,
                },
            )

            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"TikTok token exchange failed: {response.text}",
                )

            return cast(dict[str, Any], response.json())

    async def refresh_access_token(self, refresh_token: str) -> dict[str, Any]:
        """
        Refresh access token using refresh token

        Args:
            refresh_token: Valid refresh token

        Returns:
            dict: New token response
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.TOKEN_URL,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "client_key": self.client_key,
                    "client_secret": self.client_secret,
                    "grant_type": "refresh_token",
                    "refresh_token": refresh_token,
                },
            )

            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"TikTok token refresh failed: {response.text}",
                )

            return cast(dict[str, Any], response.json())

    def create_social_account_from_tokens(
        self, token_response: dict[str, Any], user_info: dict[str, Any]
    ) -> SocialAccountCreate:
        """
        Create SocialAccountCreate object from TikTok API responses

        Args:
            token_response: Response from token exchange
            user_info: Response from user info API

        Returns:
            SocialAccountCreate: Ready to save to database
        """
        expires_in = token_response.get("expires_in", 60 * 60 * 24)  # Default 24h
        token_expires_at = datetime.now(UTC) + timedelta(seconds=expires_in)

        user_data = user_info.get("data", {}).get("user", {})

        return SocialAccountCreate(
            platform=Platform.TIKTOK,
            platform_user_id=user_data.get("open_id"),
            platform_username=user_data.get("username") or user_data.get("display_name"),
            access_token=token_response["access_token"],
            refresh_token=token_response.get("refresh_token"),
            token_expires_at=token_expires_at,
            scopes=token_response.get("scope", "").split(","),
            platform_metadata={
                "display_name": user_data.get("display_name"),
                "avatar_url": user_data.get("avatar_url"),
                "union_id": user_data.get("union_id"),
            },
        )
