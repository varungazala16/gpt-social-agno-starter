"""Service for storing agent session data with buffered streaming support"""

import asyncio
import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent_session import AgentMessage, AgentSession, MessageRole, SessionStatus


class StreamBuffer:
    """
    Buffers streaming chunks and flushes to database at optimal intervals.

    Buffers until hitting 500 characters at sentence boundaries for optimal
    database write performance while maintaining semantic coherence.
    """

    def __init__(self, min_chars: int = 500, max_chars: int = 1000) -> None:
        self.buffer = ""
        self.min_chars = min_chars
        self.max_chars = max_chars

    def add(self, chunk: str) -> None:
        """Add content to buffer"""
        self.buffer += chunk

    def should_flush(self) -> bool:
        """
        Determine if buffer should be flushed to database.

        Flushes when:
        - Buffer exceeds max_chars (forced flush)
        - Buffer exceeds min_chars AND ends with sentence boundary
        """
        # Force flush if buffer is too large
        if len(self.buffer) >= self.max_chars:
            return True

        # Flush at sentence boundaries after min threshold
        if len(self.buffer) >= self.min_chars:
            stripped = self.buffer.rstrip()
            if stripped.endswith((".", "!", "?", "\n\n")):
                return True

        return False

    def get_content(self) -> str:
        """Get buffered content and clear buffer"""
        content = self.buffer
        self.buffer = ""
        return content

    def has_content(self) -> bool:
        """Check if buffer has any content"""
        return len(self.buffer) > 0


class StreamingSaver:
    """
    Background saver for streaming agent responses.

    Handles buffered, non-blocking database writes during streaming.
    Accumulates chunks and periodically flushes to database without blocking the stream.
    """

    def __init__(self, storage: "AgentStorageService", session_id: uuid.UUID, role: MessageRole) -> None:
        self.storage = storage
        self.session_id = session_id
        self.role = role
        self.buffer = StreamBuffer(min_chars=500, max_chars=1000)
        self.sequence = 1  # Start at 1, assuming user message is 0
        self._save_task: asyncio.Task[None] | None = None
        self._queue: asyncio.Queue[str | None] = asyncio.Queue()
        self._running = True

    async def start(self) -> None:
        """Start the background save task"""
        self._save_task = asyncio.create_task(self._background_saver())

    async def add_chunk(self, chunk: str) -> None:
        """Add a chunk to be saved (non-blocking)"""
        await self._queue.put(chunk)

    async def finish(self) -> None:
        """Signal completion and wait for all saves to finish"""
        self._running = False
        await self._queue.put(None)  # Sentinel value
        if self._save_task:
            await self._save_task

    async def _background_saver(self) -> None:
        """Background task that processes chunks and saves to database"""
        try:
            while self._running or not self._queue.empty():
                try:
                    # Get chunk with timeout to allow checking _running flag
                    chunk = await asyncio.wait_for(self._queue.get(), timeout=0.1)

                    if chunk is None:  # Sentinel value
                        break

                    # Add to buffer
                    self.buffer.add(chunk)

                    # Flush if threshold reached
                    if self.buffer.should_flush():
                        await self._flush_buffer()

                except TimeoutError:
                    continue

            # Final flush
            if self.buffer.has_content():
                await self._flush_buffer(is_final=True)

        except Exception as e:
            # Log error but don't crash
            print(f"Error in background saver: {e}")

    async def _flush_buffer(self, is_final: bool = False) -> None:
        """Flush buffer content to database"""
        if not self.buffer.has_content():
            return

        content = self.buffer.get_content()
        metadata = {"is_final": True} if is_final else None

        await self.storage.add_message(
            session_id=self.session_id,
            role=self.role,
            content=content,
            sequence=self.sequence,
            metadata=metadata,
        )
        self.sequence += 1


class AgentStorageService:
    """Service for managing agent session storage"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    def create_streaming_saver(
        self, session_id: uuid.UUID, role: MessageRole = MessageRole.ASSISTANT
    ) -> StreamingSaver:
        """
        Create a streaming saver for background database writes.

        Usage:
            saver = storage.create_streaming_saver(session.id)
            await saver.start()

            for chunk in stream:
                await saver.add_chunk(chunk.content)  # Non-blocking
                yield chunk  # Stream to client

            await saver.finish()  # Wait for all saves to complete
        """
        return StreamingSaver(self, session_id, role)

    async def create_session(
        self, user_id: uuid.UUID, agent_type: str, metadata: dict[str, Any] | None = None
    ) -> AgentSession:
        """
        Create a new agent session.

        Args:
            user_id: UUID of the user
            agent_type: Type of agent (e.g., "script_generator")
            metadata: Optional metadata dict (e.g., {"platform": "tiktok", "tone": "casual"})
        """
        session = AgentSession(
            user_id=user_id, agent_type=agent_type, metadata_=metadata or {}, status=SessionStatus.ACTIVE
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def add_message(
        self,
        session_id: uuid.UUID,
        role: MessageRole,
        content: str,
        sequence: int,
        metadata: dict[str, Any] | None = None,
    ) -> AgentMessage:
        """
        Add a message to a session.

        Args:
            session_id: UUID of the session
            role: Message role (user, assistant, system)
            content: Message content
            sequence: Sequence number in the session
            metadata: Optional metadata dict
        """
        message = AgentMessage(session_id=session_id, role=role, content=content, sequence=sequence, metadata_=metadata)
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def get_next_sequence(self, session_id: uuid.UUID) -> int:
        """Get the next sequence number for a session"""
        result = await self.db.execute(
            select(AgentMessage.sequence)
            .where(AgentMessage.session_id == session_id)
            .order_by(AgentMessage.sequence.desc())
            .limit(1)
        )
        last_sequence = result.scalar_one_or_none()
        return 0 if last_sequence is None else last_sequence + 1

    async def complete_session(self, session_id: uuid.UUID) -> None:
        """Mark a session as completed"""
        result = await self.db.execute(select(AgentSession).where(AgentSession.id == session_id))
        session = result.scalar_one_or_none()
        if session:
            session.status = SessionStatus.COMPLETED
            session.completed_at = datetime.now(UTC)
            await self.db.commit()

    async def fail_session(self, session_id: uuid.UUID) -> None:
        """Mark a session as failed"""
        result = await self.db.execute(select(AgentSession).where(AgentSession.id == session_id))
        session = result.scalar_one_or_none()
        if session:
            session.status = SessionStatus.FAILED
            await self.db.commit()

    async def get_session_messages(self, session_id: uuid.UUID) -> list[AgentMessage]:
        """Get all messages for a session in sequence order"""
        result = await self.db.execute(
            select(AgentMessage).where(AgentMessage.session_id == session_id).order_by(AgentMessage.sequence)
        )
        return list(result.scalars().all())

    async def get_user_sessions(
        self, user_id: uuid.UUID, agent_type: str | None = None, limit: int = 10
    ) -> list[AgentSession]:
        """
        Get recent sessions for a user.

        Args:
            user_id: UUID of the user
            agent_type: Optional filter by agent type
            limit: Maximum number of sessions to return
        """
        query = select(AgentSession).where(AgentSession.user_id == user_id)

        if agent_type:
            query = query.where(AgentSession.agent_type == agent_type)

        query = query.order_by(AgentSession.created_at.desc()).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())
