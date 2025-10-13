import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, Column, DateTime, String, UniqueConstraint
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy_utils import EncryptedType
from sqlalchemy_utils.types.encrypted.encrypted_type import AesEngine

from app.core.config import settings
from app.core.database import Base


class Platform(str, enum.Enum):
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"


class SocialAccount(Base):  # type: ignore[misc]
    __tablename__ = "social_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # References Supabase user
    platform: Mapped[Platform] = mapped_column(SQLEnum(Platform), nullable=False)
    platform_user_id = Column(String, nullable=False)
    platform_username = Column(String)

    access_token = Column(
        EncryptedType(String, key=settings.SQLALCHEMY_ENCRYPTION_KEY, engine=AesEngine),
        nullable=False,
    )
    refresh_token = Column(EncryptedType(String, key=settings.SQLALCHEMY_ENCRYPTION_KEY, engine=AesEngine))
    token_expires_at = Column(DateTime(timezone=True))
    scopes = Column(JSON)
    platform_metadata = Column(JSON)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    __table_args__ = (UniqueConstraint("user_id", "platform", name="uq_user_platform"),)
