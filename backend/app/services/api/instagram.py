import httpx
from fastapi import HTTPException, status


class InstagramAPIClient:
    """Instagram API client for content operations"""

    BASE_URL = "https://graph.instagram.com"

    def __init__(self, access_token: str):
        self.access_token = access_token

    async def get_user_info(self, fields: list[str] = None) -> dict:
        """
        Get Instagram user information

        Args:
            fields: List of fields to retrieve (id, username, account_type, media_count)

        Returns:
            dict: User profile information
        """
        if fields is None:
            fields = ["id", "username", "account_type", "media_count"]

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/me",
                params={
                    "fields": ",".join(fields),
                    "access_token": self.access_token,
                },
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Instagram user info fetch failed: {response.text}",
                )

            return response.json()

    async def get_media(
        self, limit: int = 25, fields: list[str] = None, after: str = None
    ) -> dict:
        """
        Get user's Instagram media

        Args:
            limit: Number of media items to return (max 25)
            fields: List of fields to retrieve
            after: Pagination cursor

        Returns:
            dict: Media list response
        """
        if fields is None:
            fields = [
                "id",
                "caption",
                "media_type",
                "media_url",
                "thumbnail_url",
                "permalink",
                "timestamp",
            ]

        params = {
            "fields": ",".join(fields),
            "access_token": self.access_token,
            "limit": min(limit, 25),
        }

        if after:
            params["after"] = after

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/me/media",
                params=params,
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Instagram media fetch failed: {response.text}",
                )

            return response.json()

    async def get_videos(
        self, limit: int = 25, after: str = None
    ) -> dict:
        """
        Get user's Instagram videos (short-form content only, filtered to VIDEO type)

        Args:
            limit: Number of videos to return (max 25)
            after: Pagination cursor

        Returns:
            dict: Video list response with only VIDEO media types
        """
        # First, get all media
        media_response = await self.get_media(
            limit=limit,
            fields=[
                "id",
                "caption",
                "media_type",
                "media_url",
                "thumbnail_url",
                "permalink",
                "timestamp",
            ],
            after=after
        )

        # Filter for VIDEO media type only
        videos = [
            item for item in media_response.get("data", [])
            if item.get("media_type") == "VIDEO"
        ]

        return {
            "data": videos,
            "paging": media_response.get("paging", {}),
        }

    async def get_media_insights(self, media_id: str, metrics: list[str] = None) -> dict:
        """
        Get insights for a specific media item

        Args:
            media_id: Instagram media ID
            metrics: List of metrics to retrieve (impressions, reach, engagement, saved, etc.)

        Returns:
            dict: Media insights
        """
        if metrics is None:
            metrics = ["impressions", "reach", "engagement"]

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/{media_id}/insights",
                params={
                    "metric": ",".join(metrics),
                    "access_token": self.access_token,
                },
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Instagram insights fetch failed: {response.text}",
                )

            return response.json()