"""Notification job endpoints."""

import logging
from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.agent_session import AgentSession
from app.models.user import Profile
from app.services.notifications import notification_service

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/send-weekly-digest")
async def send_weekly_digest(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Weekly job to send digest emails to all users with their activity summary.

    This endpoint should be called by Cloud Scheduler weekly.
    It gathers each user's posts from the last 7 days and sends a digest email.
    """
    try:
        # Calculate date range for the past week
        one_week_ago = datetime.now(UTC) - timedelta(days=7)

        # Get all user profiles
        result = await db.execute(select(Profile))
        all_users = list(result.scalars().all())

        if not all_users:
            logger.info("Weekly digest: No users found")
            return {
                "message": "No users to send digest to",
                "users_processed": 0,
                "emails_sent": 0,
                "timestamp": datetime.now(UTC).isoformat(),
            }

        users_processed = 0
        emails_sent = 0
        emails_failed = 0

        for user in all_users:
            try:
                # Get user's posts (agent sessions) from the past week
                posts_result = await db.execute(
                    select(AgentSession)
                    .where(AgentSession.user_id == user.id)
                    .where(AgentSession.created_at >= one_week_ago)
                    .order_by(AgentSession.created_at.desc())
                )
                user_posts = list(posts_result.scalars().all())

                post_count = len(user_posts)

                # Create highlights from the first 3 posts
                highlights = []
                for post in user_posts[:3]:
                    # Create a simple highlight with agent type and creation date
                    highlight = f"{post.agent_type} - {post.created_at.strftime('%b %d')}"
                    highlights.append(highlight)

                # If no posts, add a placeholder
                if not highlights:
                    highlights = ["No posts this week - time to get started!"]

                # Send digest email
                await notification_service.send_weekly_digest_email(
                    user_email=user.email,
                    user_name=user.name or "there",
                    post_count=post_count,
                    highlights=highlights,
                )

                users_processed += 1
                emails_sent += 1

                logger.info(
                    f"Weekly digest sent to {user.email} - {post_count} posts in past week"
                )

            except Exception as e:
                emails_failed += 1
                logger.error(f"Failed to send weekly digest to {user.email}: {str(e)}")
                # Continue processing other users
                continue

        logger.info(
            f"Weekly digest completed: {users_processed} users processed, "
            f"{emails_sent} emails sent, {emails_failed} failed"
        )

        return {
            "message": "Weekly digest job completed",
            "users_processed": users_processed,
            "emails_sent": emails_sent,
            "emails_failed": emails_failed,
            "timestamp": datetime.now(UTC).isoformat(),
        }

    except Exception as e:
        logger.error(f"Weekly digest job failed: {str(e)}", exc_info=True)
        raise


@router.post("/send-post-reminders")
async def send_post_reminders(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Weekly job to send reminder emails to users who haven't posted in 7 days.

    This endpoint should be called by Cloud Scheduler weekly.
    It finds users who haven't created any agent sessions in the last 7 days
    and sends them a reminder email to encourage engagement.
    """
    try:
        # Calculate date range
        one_week_ago = datetime.now(UTC) - timedelta(days=7)

        # Get all user profiles
        result = await db.execute(select(Profile))
        all_users = list(result.scalars().all())

        print(all_users)

        if not all_users:
            logger.info("Post reminders: No users found")
            return {
                "message": "No users to send reminders to",
                "users_checked": 0,
                "reminders_sent": 0,
                "timestamp": datetime.now(UTC).isoformat(),
            }

        users_checked = 0
        reminders_sent = 0
        reminders_failed = 0
        active_users_skipped = 0

        for user in all_users:
            try:
                users_checked += 1

                # Get user's most recent post
                recent_post_result = await db.execute(
                    select(AgentSession)
                    .where(AgentSession.user_id == user.id)
                    .order_by(AgentSession.created_at.desc())
                    .limit(1)
                )
                most_recent_post = recent_post_result.scalar_one_or_none()

                # Check if user needs a reminder
                should_send_reminder = False
                days_since_last_post = 7  # Default for users with no posts

                if most_recent_post is None:
                    # User has never posted - send reminder
                    should_send_reminder = True
                    days_since_last_post = 999  # Arbitrary large number for "never posted"
                elif most_recent_post.created_at < one_week_ago:
                    # User's last post was more than a week ago - send reminder
                    should_send_reminder = True
                    days_since_last_post = (datetime.now(UTC) - most_recent_post.created_at).days
                else:
                    # User is active - skip
                    active_users_skipped += 1

                if should_send_reminder:
                    # Send reminder email
                    await notification_service.send_post_reminder_email(
                        user_email=user.email,
                        user_name=user.name or "there",
                        days_since_last_post=days_since_last_post,
                    )

                    reminders_sent += 1
                    logger.info(
                        f"Post reminder sent to {user.email} - "
                        f"{days_since_last_post} days since last post"
                    )

            except Exception as e:
                reminders_failed += 1
                logger.error(f"Failed to send post reminder to {user.email}: {str(e)}")
                # Continue processing other users
                continue

        logger.info(
            f"Post reminders completed: {users_checked} users checked, "
            f"{reminders_sent} reminders sent, {active_users_skipped} active users skipped, "
            f"{reminders_failed} failed"
        )

        return {
            "message": "Post reminder job completed",
            "users_checked": users_checked,
            "reminders_sent": reminders_sent,
            "active_users_skipped": active_users_skipped,
            "reminders_failed": reminders_failed,
            "timestamp": datetime.now(UTC).isoformat(),
        }

    except Exception as e:
        logger.error(f"Post reminder job failed: {str(e)}", exc_info=True)
        raise
