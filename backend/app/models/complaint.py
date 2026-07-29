from sqlalchemy import Column, Integer, String, Text

from app.database.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String)
    product_name = Column(String)
    complaint_text = Column(Text)
    batch_number = Column(String) 
    category = Column(String)
    priority = Column(String)
    sentiment = Column(String)

    ai_response = Column(Text)