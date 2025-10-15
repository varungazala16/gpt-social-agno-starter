"""Shared type definitions to avoid circular imports."""

from typing import Annotated, Any, Protocol

from fastapi import Depends


class UserProtocol(Protocol):
    """Protocol for user objects from Supabase"""

    id: str
    email: str | None
    user_metadata: dict[str, Any]


# Forward declaration for SupabaseClient type
# The actual dependency function lives in auth.py
def _get_supabase_client_stub():
    """Stub function for type annotation only. Real implementation in auth.py"""
    raise NotImplementedError("This is a stub for type annotation")


SupabaseClient = Annotated[Any, Depends(_get_supabase_client_stub)]
