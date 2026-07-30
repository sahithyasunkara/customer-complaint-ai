from datetime import UTC, datetime

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check() -> dict:
    return {
        "status": "healthy",
        "timestamp": datetime.now(UTC).isoformat(),
        "service": "complaint-management-api",
    }
