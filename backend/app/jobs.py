"""
Jobs service entrypoint.

This service exposes job endpoints intended to be triggered by Cloud Scheduler.
All endpoints are protected by OIDC authentication configured in Cloud Run.
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.api.jobs import credits, notifications, test
from app.core.config import settings

app = FastAPI(
    title=f"{settings.PROJECT_NAME} - Jobs Service",
    description="Scheduled job endpoints for background tasks",
    openapi_url="/jobs/openapi.json",
    docs_url="/jobs/docs",
)


# Include job routers
app.include_router(test.router, prefix="/jobs", tags=["jobs"])
app.include_router(credits.router, prefix="/jobs", tags=["jobs", "credits"])
app.include_router(notifications.router, prefix="/jobs", tags=["jobs", "notifications"])


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint for jobs service."""
    return {"message": "Jobs service is running", "service": "gpt-social-jobs"}


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "service": "gpt-social-jobs"}
