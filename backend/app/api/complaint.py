from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import re

from app.database.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate
from app.ai.groq_ai import analyze_complaint

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


@router.post("/")
def create_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db)
):
    # Get AI analysis
    analysis = analyze_complaint(complaint.complaint_text)

    # Default values
    category = "Unknown"
    priority = "Unknown"
    sentiment = "Unknown"
    ai_response = analysis

    # Extract Category
    category_match = re.search(r"Category:\s*(.*)", analysis)
    if category_match:
        category = category_match.group(1).strip()

    # Extract Priority
    priority_match = re.search(r"Priority:\s*(.*)", analysis)
    if priority_match:
        priority = priority_match.group(1).strip()

    # Extract Sentiment
    sentiment_match = re.search(r"Sentiment:\s*(.*)", analysis)
    if sentiment_match:
        sentiment = sentiment_match.group(1).strip()

    # Extract AI Response
    response_match = re.search(r"Response:\s*([\s\S]*)", analysis)
    if response_match:
        ai_response = response_match.group(1).strip()

    # Save complaint to database
    complaint_db = Complaint(
        customer_name=complaint.customer_name,
        product_name=complaint.product_name,
        batch_number=complaint.batch_number,
        complaint_text=complaint.complaint_text,
        category=category,
        priority=priority,
        sentiment=sentiment,
        ai_response=ai_response
    )

    db.add(complaint_db)
    db.commit()
    db.refresh(complaint_db)

    return {
        "message": "Complaint submitted successfully!",
        "analysis": {
            "category": category,
            "priority": priority,
            "sentiment": sentiment,
            "response": ai_response
        },
        "complaint": {
            "id": complaint_db.id,
            "customer_name": complaint_db.customer_name,
            "product_name": complaint_db.product_name,
            "batch_number": complaint_db.batch_number,
            "complaint_text": complaint_db.complaint_text,
            "category": complaint_db.category,
            "priority": complaint_db.priority,
            "sentiment": complaint_db.sentiment,
            "ai_response": complaint_db.ai_response
        }
    }


@router.get("/")
def get_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).all()
    return complaints


@router.get("/all")
def get_all_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).all()
    return complaints