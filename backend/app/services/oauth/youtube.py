import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.social_account import SocialAccountCreate


class YouTubeOAuth:
    """YouTube OAuth 2.0 service (via Google OAuth)"""

    AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    TOKEN_URL = "https://oauth2.googleapis.com/token"
    REVOKE_URL = "https://oauth2.googleapis.com/revoke"
    SCOPES = [
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube.upload",
    ]
    STATE_LENGTH = 32

    def __init__(self):
        self.client_id = settings.YOUTUBE_CLIENT_ID
        self.client_secret = settings.YOUTUBE_CLIENT_SECRET
        self.redirect_uri = settings.YOUTUBE_REDIRECT_URI

    def generate_authorization_url(self, state: Optional[str] = None) -> tuple[str, str]:
        """
        Generate YouTube OAuth authorization URL

        Returns:
            tuple[str, str]: (authorization_url, state)
        """
        if not state:
            state = secrets.token_urlsafe(self.STATE_LENGTH)

        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "scope": ",".join(self.SCOPES),
            "access_type": "offline",  # Get refresh token
            "state": state,
            "prompt": "consent",  # Force consent screen to get refresh token
        }

        authorization_url = f"{self.AUTHORIZATION_URL}?{urlencode(params)}"
        return authorization_url, state

    async def exchange_code_for_token(self, code: str) -> dict:
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
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": self.redirect_uri,
                },
            )

            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"YouTube token exchange failed: {response.text}",
                )

            return response.json()

    async def refresh_access_token(self, refresh_token: str) -> dict:
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
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "refresh_token": refresh_token,
                    "grant_type": "refresh_token",
                },
            )

            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"YouTube token refresh failed: {response.text}",
                )

            return response.json()

    async def revoke_token(self, token: str) -> None:
        """
        Revoke access token or refresh token

        Args:
            token: Token to revoke
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.REVOKE_URL,
                data={"token": token},
            )

            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"YouTube token revocation failed: {response.text}",
                )

    def create_social_account_from_tokens(
        self, token_response: dict, user_info: dict
    ) -> SocialAccountCreate:
        """
        Create SocialAccountCreate object from YouTube API responses

        Args:
            token_response: Response from token exchange
            user_info: Response from YouTube channel API

        Returns:
            SocialAccountCreate: Ready to save to database
        """
        expires_in = token_response.get("expires_in", 60 * 60)  # Default 1 hour
        token_expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

        snippet = user_info.get("items", [{}])[0].get("snippet", {})

        return SocialAccountCreate(
            platform="youtube",
            platform_user_id=user_info.get("items", [{}])[0].get("id"),
            platform_username=snippet.get("title"),
            access_token=token_response["access_token"],
            refresh_token=token_response.get("refresh_token"),
            token_expires_at=token_expires_at,
            scopes=token_response.get("scope", "").split(" "),
            platform_metadata={
                "custom_url": snippet.get("customUrl"),
                "thumbnail_url": snippet.get("thumbnails", {}).get("default", {}).get("url"),
                "description": snippet.get("description"),
            },
        )
