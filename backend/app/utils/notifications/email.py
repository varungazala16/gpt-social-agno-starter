import asyncio
import logging
from typing import Any

from sendgrid import SendGridAPIClient  # type: ignore[import-not-found]
from sendgrid.helpers.mail import Mail  # type: ignore[import-not-found]

from app.core.config import settings
from app.utils.notifications.templates import WELCOME_EMAIL_TEMPLATE, WelcomeEmailData

logger = logging.getLogger(__name__)


class SendgridClient:
    """Client for sending emails via SendGrid with dynamic templates."""

    def __init__(self, api_key: str | None = None, default_sender: str | None = None):
        """
        Initialize the SendGrid client.

        Args:
            api_key: SendGrid API key. Defaults to settings.SENDGRID_API_KEY
            default_sender: Default sender email. Defaults to settings.DEFAULT_EMAIL_SENDER
        """
        self.api_key = api_key or settings.SENDGRID_API_KEY
        self.default_sender = default_sender or settings.DEFAULT_EMAIL_SENDER
        self.client = SendGridAPIClient(self.api_key)

    async def send_template_email(
        self,
        to_email: str,
        template_id: str,
        dynamic_template_data: dict[str, Any],
        from_email: str | None = None,
        subject: str | None = None,
    ) -> bool:
        """
        Send a templated email via SendGrid.

        Args:
            to_email: Recipient email address
            template_id: SendGrid template ID
            dynamic_template_data: Dictionary of template variables
            from_email: Sender email address. Defaults to self.default_sender
            subject: Email subject (optional, can be set in template)

        Returns:
            True if email was sent successfully, False otherwise
        """
        try:
            message = Mail(
                from_email=from_email or self.default_sender,
                to_emails=to_email,
            )
            message.template_id = template_id
            message.dynamic_template_data = dynamic_template_data

            if subject:
                message.subject = subject

            # Run the blocking SendGrid call in a thread pool
            response = await asyncio.to_thread(self.client.send, message)

            if response.status_code >= 200 and response.status_code < 300:
                logger.info(f"Email sent successfully to {to_email}")
                return True
            else:
                logger.error(
                    f"Failed to send email to {to_email}. " f"Status: {response.status_code}, Body: {response.body}"
                )
                return False

        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {str(e)}")
            return False

    async def send_bulk_template_emails(
        self,
        recipients: list[str],
        template_id: str,
        dynamic_template_data: dict[str, Any],
        from_email: str | None = None,
    ) -> dict[str, bool]:
        """
        Send the same templated email to multiple recipients concurrently.

        Args:
            recipients: List of recipient email addresses
            template_id: SendGrid template ID
            dynamic_template_data: Dictionary of template variables
            from_email: Sender email address. Defaults to self.default_sender

        Returns:
            Dictionary mapping email addresses to success status
        """
        tasks = [
            self.send_template_email(
                to_email=recipient,
                template_id=template_id,
                dynamic_template_data=dynamic_template_data,
                from_email=from_email,
            )
            for recipient in recipients
        ]
        results = await asyncio.gather(*tasks)
        return dict(zip(recipients, results, strict=False))

    async def send_welcome_email(
        self,
        to_email: str,
        data: WelcomeEmailData,
        from_email: str | None = None,
    ) -> bool:
        """
        Send a welcome email to a new user.

        Args:
            to_email: Recipient email address
            data: Welcome email template data (name, cta_link)
            from_email: Sender email address. Defaults to self.default_sender

        Returns:
            True if email was sent successfully, False otherwise
        """
        return await self.send_template_email(
            to_email=to_email,
            template_id=WELCOME_EMAIL_TEMPLATE,
            dynamic_template_data=dict(data),
            from_email=from_email,
        )
