from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, JSON, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import enum
import uuid

from app.core.database import Base


class Platform(str, enum.Enum):
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"


class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # References Supabase user
    platform = Column(SQLEnum(Platform), nullable=False)
    platform_user_id = Column(String, nullable=False)
    platform_username = Column(String)

    access_token = Column(String, nullable=False)  # TODO: Encrypt in production
    refresh_token = Column(String)  # TODO: Encrypt in production
    token_expires_at = Column(DateTime(timezone=True))
    scopes = Column(JSON)
    platform_metadata = Column(JSON)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint('user_id', 'platform', name='uq_user_platform'),
    )
