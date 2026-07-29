from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)


def analyze_complaint(complaint):
    prompt = f"""
You are an AI Complaint Analysis Assistant for a pharmaceutical company.

Analyze the complaint below.

Complaint:
{complaint}

Return ONLY in this format:

Category: <one line>

Priority: <Low/Medium/High>

Sentiment: <Positive/Neutral/Negative>

Response:
<Professional customer response>

Do not add markdown.
"""

    result = llm.invoke(prompt)
    return result.content