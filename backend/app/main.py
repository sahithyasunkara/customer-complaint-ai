from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database.base import Base
from app.database.session import engine
from app.models import Complaint  # noqa: F401
from app.routers.ai import router as ai_router
from app.routers.complaints import router as complaints_router
from app.routers.health import router as health_router

settings = get_settings()


def create_app() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI-powered pharmaceutical customer complaint management system",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(health_router)
    application.include_router(complaints_router)
    application.include_router(ai_router)

    Base.metadata.create_all(bind=engine)

    upload_path = Path(settings.upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)

    @application.get("/")
    def root() -> dict:
        return {
            "message": "AI Complaint Management API is running",
            "version": settings.app_version,
            "docs": "/docs",
            "health": "/health",
        }

    return application


app = create_app()
