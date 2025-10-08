import httpx
from fastapi import HTTPException, status


class TikTokAPIClient:
    """TikTok API client for content operations"""

    BASE_URL = "https://open.tiktokapis.com/v2"

    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {"Authorization": f"Bearer {access_token}"}

    async def get_user_info(self, fields: list[str] = None) -> dict:
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

            return response.json()

    async def get_videos(
        self, max_count: int = 20, cursor: int = 0, fields: list[str] = None
    ) -> dict:
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
            fields = ["id", "title", "video_description", "duration", "cover_image_url", "view_count"]

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/video/list/",
                headers=self.headers,
                json={
                    "max_count": min(max_count, 20),
                    "cursor": cursor,
                    "fields": fields,
                },
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"TikTok video list fetch failed: {response.text}",
                )

            return response.json()