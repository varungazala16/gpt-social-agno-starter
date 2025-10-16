import logging
from collections.abc import Callable
from functools import wraps
from http import HTTPStatus
from typing import Annotated, Any, cast

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import AsyncClientOptions
from supabase._async.client import AsyncClient, create_client

from app.core.config import settings
from app.core.types import UserProtocol
from app.services.credits import CreditsService, InsufficientCreditsError


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


SupabaseClient = Annotated[AsyncClient, Depends(get_supabase_client)]  # Real implementation


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


def require_credits(cost: int) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
    """
    Decorator to check and deduct credits for API operations.

    Args:
        cost: Number of credits required for the operation

    Usage:
        @app.post("/generate")
        @require_credits(cost=3)
        async def generate_content(
            current_user: User,
            db: Annotated[AsyncSession, Depends(get_db)],
            supabase_client: SupabaseClient,
            # ... other params
        ):
            # Operation logic here
            return {"message": "Generation complete"}
    """

    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Extract dependencies from kwargs
            current_user = kwargs.get("current_user")
            db = kwargs.get("db")
            supabase_client = kwargs.get("supabase_client")

            # Validate required dependencies are present
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User authentication dependency missing"
                )
            if not db:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database dependency missing"
                )
            if not supabase_client:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Supabase client dependency missing"
                )

            credits_service = CreditsService(db, supabase_client)

            try:
                # Check and deduct credits
                await credits_service.deduct_credits(
                    user_id=current_user.id, amount=cost, description=f"API operation: {func.__name__}"
                )

                return await func(*args, **kwargs)

            except InsufficientCreditsError as e:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail=f"Not enough credits. Required: {e.required}, Available: {e.available}",
                ) from e

        return wrapper

    return decorator
