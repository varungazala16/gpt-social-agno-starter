"""Agent API endpoints for AI-powered features"""

from typing import Any

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from app.core.auth import User
from app.schemas.agent import ScriptGenerationRequest, StreamChunk
from app.services.ai.script_generator import ScriptGeneratorAgent

router = APIRouter()


@router.post("/script/stream")
async def generate_script_stream(
    request: ScriptGenerationRequest,
) -> StreamingResponse:
    """
    Stream video script generation using Agno AI agent.

    Returns Server-Sent Events (SSE) stream with incremental script content.
    """
    try:
        agent = ScriptGeneratorAgent()

        def event_stream() -> Any:
            """Generate SSE stream from Agno agent responses"""
            try:
                # Get the stream from Agno (synchronous iterator)
                stream = agent.stream_script(
                    prompt=request.prompt,
                    platform=request.platform,
                    duration=request.duration,
                    tone=request.tone,
                )

                # Iterate through chunks synchronously
                for chunk in stream:
                    # Check for content in the chunk
                    if hasattr(chunk, "content") and chunk.content:
                        stream_chunk = StreamChunk(content=chunk.content, done=False)
                        yield f"data: {stream_chunk.model_dump_json()}\n\n"

                # Send completion signal
                completion_chunk = StreamChunk(content="", done=True)
                yield f"data: {completion_chunk.model_dump_json()}\n\n"

            except Exception as e:
                # Send error to client via SSE
                error_chunk = StreamChunk(content=str(e), done=True)
                yield f"data: {error_chunk.model_dump_json()}\n\n"

        return StreamingResponse(
            event_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",  # Disable nginx buffering for streaming
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Script generation failed: {str(e)}",
        ) from e


@router.post("/script")
async def generate_script_complete(
    current_user: User,
    request: ScriptGenerationRequest,
) -> dict[str, Any]:
    """
    Generate complete video script (non-streaming endpoint).

    Returns the full script in a single response.
    """
    try:
        agent = ScriptGeneratorAgent()

        response = await agent.generate_script(
            prompt=request.prompt,
            platform=request.platform,
            duration=request.duration,
            tone=request.tone,
        )

        return {
            "success": True,
            "script": response.content if hasattr(response, "content") else str(response),
            "platform": request.platform,
            "tone": request.tone,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Script generation failed: {str(e)}",
        ) from e
