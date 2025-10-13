from typing import Literal

from pydantic import BaseModel, Field


class ScriptGenerationRequest(BaseModel):
    """Request model for video script generation"""

    prompt: str = Field(..., min_length=10, max_length=1000, description="Video concept or idea to generate script for")
    platform: Literal["tiktok", "instagram", "youtube"] = Field(
        default="tiktok", description="Target social media platform"
    )
    duration: int | None = Field(None, ge=15, le=180, description="Target video duration in seconds (15-180 seconds)")
    tone: Literal["casual", "professional", "humorous", "inspirational"] = Field(
        default="casual", description="Desired tone of the script"
    )


class StreamChunk(BaseModel):
    """Generic streaming response chunk for Agno agent responses"""

    content: str = Field(..., description="Incremental content from the agent")
    done: bool = Field(default=False, description="Whether generation is complete")
