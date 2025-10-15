"""Notification service for handling user lifecycle emails."""

import logging

from app.core.config import settings
from app.utils.notifications.email import SendgridClient

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for managing user notifications."""

    def __init__(self):
        self.email_client = SendgridClient()

    async def send_welcome_email(
        self,
        user_email: str,
        user_name: str,
        cta_link: str | None = None,
    ) -> None:
        """
        Send welcome email to new user.

        Args:
            user_email: User's email address
            user_name: User's display name
            cta_link: Call-to-action link (defaults to frontend URL)
        """
        try:
            await self.email_client.send_welcome_email(
                to_email=user_email,
                data={
                    "name": user_name,
                    "cta_link": cta_link or settings.FRONTEND_URL,
                },
            )
            logger.info(f"Welcome email sent to {user_email}")
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Failed to send welcome email to {user_email}: {str(e)}")


# Global instance
notification_service = NotificationService()