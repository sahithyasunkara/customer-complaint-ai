from pydantic import BaseModel

class ComplaintCreate(BaseModel):
    customer_name: str
    product_name: str
    batch_number: str
    complaint_text: str