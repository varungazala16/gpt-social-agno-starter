from typing import TypedDict

# Template IDs - replace with your actual SendGrid template IDs
WELCOME_EMAIL_TEMPLATE = "d-4cd50387a62c4def957835c00a5e5914"


# TypedDict definitions for each template's dynamic data
class WelcomeEmailData(TypedDict):
    """Data for welcome email template."""

    name: str
    cta_link: str
