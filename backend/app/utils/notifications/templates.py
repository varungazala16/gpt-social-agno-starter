from typing import TypedDict

# Template IDs - replace with your actual SendGrid template IDs
WELCOME_EMAIL_TEMPLATE = "d-4cd50387a62c4def957835c00a5e5914"
WEEKLY_DIGEST_TEMPLATE = "d-dc868d36d06340c5ac349cf75b35e614"
POST_REMINDER_TEMPLATE = "d-394ccaf6595f4f389c99ab68b2229b8f"


# TypedDict definitions for each template's dynamic data
class WelcomeEmailData(TypedDict):
    """Data for welcome email template."""

    name: str
    cta_link: str


class WeeklyDigestEmailData(TypedDict):
    """Data for weekly digest email template."""

    name: str
    post_count: int
    highlights: list[str]
    cta_link: str


class PostReminderEmailData(TypedDict):
    """Data for post reminder email template."""

    name: str
    days_since_last_post: int
    cta_link: str
