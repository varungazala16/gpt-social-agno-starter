"""SSE streaming utilities for AI agents"""

import uuid
from collections.abc import AsyncIterator
from typing import Any

from app.models.agent_session import MessageRole
from app.schemas.agent import StreamChunk
from app.services.agent_storage import AgentStorageService


async def create_agent_stream(
    agent_stream: AsyncIterator[Any],
    storage: AgentStorageService,
    session_id: uuid.UUID,
    role: MessageRole = MessageRole.ASSISTANT,
) -> AsyncIterator[str]:
    """
    Generate SSE stream from agent responses with buffered storage.

    Args:
        agent_stream: Async iterator from agent (e.g., agent.stream_script_async())
        storage: AgentStorageService instance
        session_id: Session ID for storing messages
        role: Message role (defaults to ASSISTANT)

    Yields:
        SSE-formatted strings (data: {...})
    """
    saver = storage.create_streaming_saver(session_id, role)
    await saver.start()

    try:
        # Stream chunks from agent
        async for chunk in agent_stream:
            if hasattr(chunk, "content") and chunk.content:
                # Stream to client IMMEDIATELY
                stream_chunk = StreamChunk(content=chunk.content, done=False)
                yield f"data: {stream_chunk.model_dump_json()}\n\n"

                # Add to background saver
                await saver.add_chunk(chunk.content)

        # Wait for all background saves to complete
        await saver.finish()

        # Mark session as completed
        await storage.complete_session(session_id)

        # Send completion signal
        completion_chunk = StreamChunk(content="", done=True)
        yield f"data: {completion_chunk.model_dump_json()}\n\n"

    except Exception as e:
        # Wait for any pending saves before marking as failed
        await saver.finish()
        await storage.fail_session(session_id)

        # Send error to client via SSE
        error_chunk = StreamChunk(content=str(e), done=True)
        yield f"data: {error_chunk.model_dump_json()}\n\n"
