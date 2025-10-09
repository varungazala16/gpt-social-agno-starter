from fastapi import APIRouter, HTTPException, status

from app.core.auth import User, SupabaseClient
from app.schemas.user import (
    UserCreate,
    UserLogin,
    SignupResponse,
    LoginResponse,
    UserResponse,
)

router = APIRouter()


@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=SignupResponse)
async def signup(user_data: UserCreate, supabase_client: SupabaseClient) -> SignupResponse:
    """Create a new user account"""
    try:
        result = await supabase_client.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "name": user_data.name
                }
            }
        })

        if not result.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )

        return SignupResponse(
            user=UserResponse(
                id=result.user.id,
                email=result.user.email
            ),
            session={
                "access_token": result.session.access_token if result.session else None,
                "refresh_token": result.session.refresh_token if result.session else None,
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Signup failed: {str(e)}"
        )


@router.post("/login", response_model=LoginResponse)
async def login(credentials: UserLogin, supabase_client: SupabaseClient) -> LoginResponse:
    """Login with email and password"""
    try:
        result = await supabase_client.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })

        if not result.user or not result.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        return LoginResponse(
            user=UserResponse(
                id=result.user.id,
                email=result.user.email
            ),
            access_token=result.session.access_token,
            refresh_token=result.session.refresh_token,
            token_type="bearer"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User) -> UserResponse:
    """Get current authenticated user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        user_metadata=current_user.user_metadata or {}
    )
