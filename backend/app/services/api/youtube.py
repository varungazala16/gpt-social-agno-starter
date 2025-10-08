import httpx
from fastapi import HTTPException, status


class YouTubeAPIClient:
    """YouTube API client for content operations"""

    BASE_URL = "https://www.googleapis.com/youtube/v3"

    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {"Authorization": f"Bearer {access_token}"}

    async def get_channel_info(self, part: list[str] = None) -> dict:
        """
        Get YouTube channel information

        Args:
            part: List of parts to retrieve (snippet, contentDetails, statistics, etc.)

        Returns:
            dict: Channel information
        """
        if part is None:
            part = ["snippet", "contentDetails", "statistics"]

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/channels",
                headers=self.headers,
                params={
                    "part": ",".join(part),
                    "mine": "true",
                },
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"YouTube channel info fetch failed: {response.text}",
                )

            return response.json()

    async def get_videos(
        self,
        max_results: int = 25,
        page_token: str = None,
        part: list[str] = None,
    ) -> dict:
        """
        Get user's YouTube videos

        Args:
            max_results: Maximum number of videos to return (1-50)
            page_token: Pagination token
            part: List of parts to retrieve

        Returns:
            dict: Video list response
        """
        if part is None:
            part = ["snippet", "contentDetails", "statistics"]

        # First, get the uploads playlist ID
        channel_info = await self.get_channel_info(part=["contentDetails"])
        uploads_playlist_id = (
            channel_info.get("items", [{}])[0]
            .get("contentDetails", {})
            .get("relatedPlaylists", {})
            .get("uploads")
        )

        if not uploads_playlist_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Could not find uploads playlist",
            )

        params = {
            "part": ",".join(part),
            "playlistId": uploads_playlist_id,
            "maxResults": min(max_results, 50),
        }

        if page_token:
            params["pageToken"] = page_token

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/playlistItems",
                headers=self.headers,
                params=params,
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"YouTube videos fetch failed: {response.text}",
                )

            return response.json()

    async def get_video_analytics(self, video_id: str, metrics: list[str] = None) -> dict:
        """
        Get analytics for a specific video

        Args:
            video_id: YouTube video ID
            metrics: List of metrics to retrieve (views, likes, comments, etc.)

        Returns:
            dict: Video analytics
        """
        if metrics is None:
            metrics = ["views", "likes", "comments", "shares"]

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/videos",
                headers=self.headers,
                params={
                    "part": "statistics",
                    "id": video_id,
                },
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"YouTube video analytics fetch failed: {response.text}",
                )

            return response.json()