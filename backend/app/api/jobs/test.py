"""Test job endpoint for validating jobs service."""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.post("/hello")
async def hello_world_job() -> dict[str, str]:
    """
    Simple test job endpoint.

    Returns a hello world message with timestamp to verify the jobs service is working.
    """
    return {
        "message": "Hello from jobs service!",
        "timestamp": datetime.utcnow().isoformat(),
        "job": "test_hello_world",
    }
