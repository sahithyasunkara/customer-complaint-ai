from datetime import date, datetime

from pydantic import BaseModel, Field


class ComplaintBase(BaseModel):
    complaint_id: str = Field(..., min_length=1, max_length=100)
    customer_name: str = Field(..., min_length=1, max_length=255)
    complaint_source: str | None = None
    product_name: str | None = None
    product_strength: str | None = None
    batch_number: str | None = None
    manufacturing_date: date | None = None
    expiry_date: date | None = None
    quantity: int | None = None
    complaint_category: str | None = None
    complaint_description: str = Field(..., min_length=1)
    severity: str | None = None
    priority: str | None = None
    status: str = "open"


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintUpdate(BaseModel):
    complaint_id: str | None = None
    customer_name: str | None = None
    complaint_source: str | None = None
    product_name: str | None = None
    product_strength: str | None = None
    batch_number: str | None = None
    manufacturing_date: date | None = None
    expiry_date: date | None = None
    quantity: int | None = None
    complaint_category: str | None = None
    complaint_description: str | None = None
    severity: str | None = None
    priority: str | None = None
    status: str | None = None


class ComplaintResponse(ComplaintBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
