from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "AI Complaint Management API"
    app_version: str = "1.0.0"
    debug: bool = False

    database_url: str = Field(
    default="",
    validation_alias="DATABASE_URL",
    description="PostgreSQL connection string",
)
    groq_api_key: str = ""
    groq_model: str = "gemma2-9b-it"
    groq_fallback_model: str = "llama-3.3-70b-versatile"

   cors_origins: list[str] = Field(
    default_factory=lambda: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://customer-complaint-ai-foh3-fxhgeaglw-sahithyasunkara-projects.vercel.app",
    ]
)

    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
