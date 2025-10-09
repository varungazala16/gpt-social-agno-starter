import logging
from http import HTTPStatus
from typing import Annotated, Any, Protocol, cast

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from supabase import AsyncClientOptions
from supabase._async.client import AsyncClient, create_client

from app.core.config import settings


class UserProtocol(Protocol):
    """Protocol for user objects from Supabase"""

    id: str
    email: str | None
    user_metadata: dict[str, Any]


async def get_supabase_client() -> AsyncClient:
    supabase_client = await create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_KEY,
        options=AsyncClientOptions(postgrest_client_timeout=10, storage_client_timeout=10),
    )
    if not supabase_client:
        logging.error({"message": "Supabase client not initialized"})
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail="Supabase client not initialized")
    return supabase_client


SupabaseClient = Annotated[AsyncClient, Depends(get_supabase_client)]


# auto get token from header
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")
TokenDep = Annotated[str, Depends(reusable_oauth2)]


async def get_current_user(token: TokenDep, supabase_client: SupabaseClient) -> UserProtocol:
    """get current user from token and validate same time"""
    try:
        user_rsp = await supabase_client.auth.get_user(jwt=token)
        if not user_rsp or not user_rsp.user:
            logging.error({"message": "User not found", "token_prefix": token[:10] if token else None})
            raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED, detail="Invalid authentication credentials")

        logging.info(
            {"message": "User authenticated successfully", "user_id": user_rsp.user.id, "email": user_rsp.user.email}
        )
        return cast(UserProtocol, user_rsp.user)
    except HTTPException:
        raise
    except Exception as e:
        logging.error({"message": "Error validating user", "error": str(e), "error_type": type(e).__name__})
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED, detail="Invalid authentication credentials") from e


User = Annotated[UserProtocol, Depends(get_current_user)]
