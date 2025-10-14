"""Agent session models for storing AI agent interactions"""

import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, Column, DateTime, Integer, String, Text, UniqueConstraint
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class SessionStatus(str, enum.Enum):
    """Status of an agent session"""

    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"


class MessageRole(str, enum.Enum):
    """Role of a message in an agent conversation"""

    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class AgentSession(Base):  # type: ignore[misc]
    """
    Represents a conversation or generation session with an AI agent.

    Stores metadata about the session including agent type, configuration,
    and session status. Individual messages are stored in AgentMessage.
    """

    __tablename__ = "agent_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )  # References Supabase auth.users
    agent_type = Column(String, nullable=False, index=True)  # e.g., "script_generator", "chat_assistant"

    # JSONB field for flexible agent-specific configuration
    # Examples: {"platform": "tiktok", "tone": "casual", "duration": 60}
    #          {"model": "claude-3-5-sonnet", "temperature": 0.7}
    metadata_ = Column(JSON)

    status: Mapped[SessionStatus] = mapped_column(SQLEnum(SessionStatus), nullable=False, default=SessionStatus.PENDING)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class AgentMessage(Base):  # type: ignore[misc]
    """
    Individual message within an agent session.

    Messages are ordered by sequence number and can represent:
    - User inputs (role=user)
    - Agent outputs (role=assistant) - may be buffered chunks for streaming
    - System messages (role=system)
    """

    __tablename__ = "agent_messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )  # FK to agent_sessions
    role: Mapped[MessageRole] = mapped_column(SQLEnum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    sequence = Column(Integer, nullable=False)  # Order within session (0, 1, 2, ...)

    # Optional metadata for message-specific information
    # Examples: {"tokens": 150, "model": "claude-3-5-sonnet", "finish_reason": "stop"}
    #          {"chunk_index": 5, "is_final": true}
    metadata_ = Column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    __table_args__ = (UniqueConstraint("session_id", "sequence", name="uq_session_sequence"),)
