from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.ai.complaint_workflow import complaint_workflow

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/analyze", status_code=status.HTTP_200_OK)
def analyze_complaint(
    text: str | None = Form(default=None),
    file: UploadFile | None = File(default=None),
) -> dict:
    if not text and not file:
        raise HTTPException(status_code=400, detail="Provide either uploaded file or text input")

    if file is not None:
        file_bytes = file.file.read()
        text = text or f"Uploaded file: {file.filename} with {len(file_bytes)} bytes"

    state = {"text": text or ""}
    result = complaint_workflow.invoke(state)

    return {
        "summary": result.get("summary"),
        "risk_badge": result.get("risk_badge"),
        "confidence": result.get("confidence"),
        "extracted_data": result.get("extracted_data"),
        "missing_fields": result.get("missing_fields"),
        "suggested_values": result.get("suggested_values"),
        "progress": result.get("progress"),
    }
