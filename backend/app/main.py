from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.models.complaint import Complaint
from app.api.complaint import router as complaint_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Complaint Management API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaint_router)

@app.get("/")
def home():
    return {"message": "Backend Running Successfully 🚀"}