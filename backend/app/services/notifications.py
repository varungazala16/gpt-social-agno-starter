"""Notification service for handling user lifecycle emails."""

import logging

from app.core.config import settings
from app.utils.notifications.email import SendgridClient
from app.utils.notifications.templates import (
    POST_REMINDER_TEMPLATE,
    WEEKLY_DIGEST_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
)

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for managing user notifications."""

    def __init__(self) -> None:
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
            await self.email_client.send_template_email(
                to_email=user_email,
                template_id=WELCOME_EMAIL_TEMPLATE,
                dynamic_template_data={
                    "name": user_name,
                    "cta_link": cta_link or settings.FRONTEND_URL,
                },
                subject="Welcome to SocialGPT!",
            )
            logger.info(f"Welcome email sent to {user_email}")
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Failed to send welcome email to {user_email}: {str(e)}")

    async def send_weekly_digest_email(
        self,
        user_email: str,
        user_name: str,
        post_count: int,
        highlights: list[str],
        cta_link: str | None = None,
    ) -> None:
        """
        Send weekly digest email to user.

        Args:
            user_email: User's email address
            user_name: User's display name
            post_count: Number of posts in the past week
            highlights: List of post highlights/snippets
            cta_link: Call-to-action link (defaults to frontend URL)
        """
        try:
            await self.email_client.send_template_email(
                to_email=user_email,
                template_id=WEEKLY_DIGEST_TEMPLATE,
                dynamic_template_data={
                    "name": user_name,
                    "post_count": post_count,
                    "highlights": highlights,
                    "cta_link": cta_link or settings.FRONTEND_URL,
                },
                subject="Your Weekly Digest",
            )
            logger.info(f"Weekly digest email sent to {user_email}")
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Failed to send weekly digest email to {user_email}: {str(e)}")

    async def send_post_reminder_email(
        self,
        user_email: str,
        user_name: str,
        days_since_last_post: int,
        cta_link: str | None = None,
    ) -> None:
        """
        Send post reminder email to inactive user.

        Args:
            user_email: User's email address
            user_name: User's display name
            days_since_last_post: Number of days since user's last post
            cta_link: Call-to-action link (defaults to frontend URL)
        """
        try:
            await self.email_client.send_template_email(
                to_email=user_email,
                template_id=POST_REMINDER_TEMPLATE,
                dynamic_template_data={
                    "name": user_name,
                    "days_since_last_post": days_since_last_post,
                    "cta_link": cta_link or settings.FRONTEND_URL,
                },
                subject="hey - it's been a while"
            )
            logger.info(f"Post reminder email sent to {user_email}")
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Failed to send post reminder email to {user_email}: {str(e)}")


# Global instance
notification_service = NotificationService()
