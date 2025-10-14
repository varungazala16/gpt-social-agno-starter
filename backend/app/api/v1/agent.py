"""Agent API endpoints for AI-powered features"""

import uuid

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from app.core.auth import User
from app.core.database import Database
from app.core.streaming import create_agent_stream
from app.models.agent_session import MessageRole
from app.schemas.agent import ScriptGenerationRequest
from app.services.agent_storage import AgentStorageService
from app.services.ai.script_generator import ScriptGeneratorAgent

router = APIRouter()


@router.post("/script/stream")
async def generate_script_stream(
    request: ScriptGenerationRequest,
    current_user: User,
    db: Database,
) -> StreamingResponse:
    """
    Stream video script generation using Agno AI agent.

    Returns Server-Sent Events (SSE) stream with incremental script content.
    Saves the session and messages to the database with buffered streaming.
    """
    try:
        agent = ScriptGeneratorAgent()
        storage = AgentStorageService(db)

        # Create session with metadata (excluding prompt)
        session = await storage.create_session(
            user_id=uuid.UUID(current_user.id),
            agent_type="script_generator",
            metadata={"platform": request.platform, "duration": request.duration, "tone": request.tone},
        )

        # Save user prompt as first message
        await storage.add_message(session_id=session.id, role=MessageRole.USER, content=request.prompt, sequence=0)

        # Create agent stream
        agent_stream = agent.stream_script_async(
            prompt=request.prompt,
            platform=request.platform,
            duration=request.duration,
            tone=request.tone,
        )

        return StreamingResponse(
            create_agent_stream(agent_stream, storage, session.id),
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
