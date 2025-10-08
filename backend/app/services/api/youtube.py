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
            part = ["snippet", "contentDetails"]

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

    async def get_shorts(
        self,
        max_results: int = 25,
        page_token: str = None,
    ) -> dict:
        """
        Get user's YouTube Shorts (videos with duration <= 60 seconds)

        Args:
            max_results: Maximum number of shorts to return (1-50)
            page_token: Pagination token

        Returns:
            dict: Shorts list response
        """
        # Get all videos first
        videos_response = await self.get_videos(
            max_results=max_results,
            page_token=page_token,
            part=["snippet", "contentDetails"]
        )

        # Filter for shorts (duration <= 60 seconds)
        shorts = []
        for item in videos_response.get("items", []):
            video_id = item.get("snippet", {}).get("resourceId", {}).get("videoId")

            if video_id:
                # Get video details to check duration
                async with httpx.AsyncClient() as client:
                    video_response = await client.get(
                        f"{self.BASE_URL}/videos",
                        headers=self.headers,
                        params={
                            "part": "contentDetails,snippet,statistics",
                            "id": video_id,
                        },
                    )

                    if video_response.status_code == 200:
                        video_data = video_response.json()
                        for video in video_data.get("items", []):
                            duration = video.get("contentDetails", {}).get("duration", "")
                            # Parse ISO 8601 duration (e.g., PT1M30S = 1 minute 30 seconds)
                            # For simplicity, check if it's likely a short (no hours, <= 60 seconds)
                            if "H" not in duration and self._is_short_duration(duration):
                                shorts.append(video)

        return {
            "items": shorts,
            "pageInfo": videos_response.get("pageInfo", {}),
            "nextPageToken": videos_response.get("nextPageToken"),
        }

    def _is_short_duration(self, duration: str) -> bool:
        """
        Check if ISO 8601 duration represents a short video (<= 60 seconds)

        Args:
            duration: ISO 8601 duration string (e.g., PT1M30S, PT45S)

        Returns:
            bool: True if duration is <= 60 seconds
        """
        import re

        # Parse ISO 8601 duration
        match = re.match(r'PT(?:(\d+)M)?(?:(\d+)S)?', duration)
        if not match:
            return False

        minutes = int(match.group(1) or 0)
        seconds = int(match.group(2) or 0)
        total_seconds = minutes * 60 + seconds

        return total_seconds <= 60

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