from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, connections, tiktok, instagram, youtube
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.all_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(connections.router, prefix=f"{settings.API_V1_STR}/connections", tags=["connections"])
app.include_router(tiktok.router, prefix=f"{settings.API_V1_STR}/tiktok", tags=["tiktok"])
app.include_router(instagram.router, prefix=f"{settings.API_V1_STR}/instagram", tags=["instagram"])
app.include_router(youtube.router, prefix=f"{settings.API_V1_STR}/youtube", tags=["youtube"])


@app.get("/")
def read_root():
    return {"message": "Welcome to SocialGPT API"}
