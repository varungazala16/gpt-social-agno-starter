from typing import Any, cast

import httpx
from fastapi import HTTPException, status


class TikTokAPIClient:
    """TikTok API client for content operations"""

    BASE_URL = "https://open.tiktokapis.com/v2"

    def __init__(self, access_token: str) -> None:
        self.access_token = access_token
        self.headers = {"Authorization": f"Bearer {access_token}"}

    async def get_user_info(self, fields: list[str] | None = None) -> dict[str, Any]:
        """
        Get TikTok user information

        Args:
            fields: List of fields to retrieve (open_id, union_id, avatar_url, display_name, username, etc.)

        Returns:
            dict: User profile information
        """
        if fields is None:
            fields = ["open_id", "union_id", "avatar_url", "display_name", "username"]

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/user/info/",
                headers=self.headers,
                params={"fields": ",".join(fields)},
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"TikTok user info fetch failed: {response.text}",
                )

            return cast(dict[str, Any], response.json())

    async def get_videos(self, max_count: int = 20, cursor: int = 0, fields: list[str] | None = None) -> dict[str, Any]:
        """
        Get user's TikTok videos

        Args:
            max_count: Maximum number of videos to return (1-20)
            cursor: Pagination cursor
            fields: List of fields to retrieve

        Returns:
            dict: Video list response
        """
        if fields is None:
            fields = [
                "id",
                "create_time",
                "cover_image_url",
                "share_url",
                "video_description",
                "duration",
                "height",
                "width",
                "title",
                "embed_html",
                "embed_link",
                "like_count",
                "comment_count",
                "share_count",
                "view_count",
            ]

        # Build URL with fields in query string
        url = f"{self.BASE_URL}/video/list/?fields={','.join(fields)}"

        # Prepare form data payload
        data = {}
        if cursor:
            data["cursor"] = cursor

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=self.headers,
                data=data,
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"TikTok video list fetch failed: {response.text}",
                )

            return cast(dict[str, Any], response.json())
