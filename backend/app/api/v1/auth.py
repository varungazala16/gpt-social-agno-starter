from fastapi import APIRouter, HTTPException, status

from app.core.auth import SupabaseClient, User
from app.schemas.user import (
    LoginResponse,
    UserLogin,
    UserResponse,
)

router = APIRouter()


# Custom signup endpoint deprecated - users should sign up via Supabase social login (Google)


@router.post("/login", response_model=LoginResponse)
async def login(credentials: UserLogin, supabase_client: SupabaseClient) -> LoginResponse:
    """Login with email and password"""
    try:
        result = await supabase_client.auth.sign_in_with_password(
            {"email": credentials.email, "password": credentials.password}
        )

        if not result.user or not result.session:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        return LoginResponse(
            user=UserResponse(id=result.user.id, email=result.user.email),
            access_token=result.session.access_token,
            refresh_token=result.session.refresh_token,
            token_type="bearer",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Login failed: {str(e)}") from e


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User) -> UserResponse:
    """Get current authenticated user information"""
    return UserResponse(id=current_user.id, email=current_user.email, user_metadata=current_user.user_metadata or {})
