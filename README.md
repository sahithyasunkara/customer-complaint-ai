# AI Customer Complaint Management System

An AI-powered web application that helps businesses manage customer complaints by automatically classifying complaints and generating intelligent responses using Large Language Models (LLMs).

---

## Features

- AI-powered complaint classification
- Automatic response generation
- FastAPI backend
- React frontend
- REST API communication
- User-friendly interface
- Secure environment variable management

---

## Tech Stack

### Frontend
- React
- Vite
- HTML
- CSS
- JavaScript

### Backend
- FastAPI
- Python
- Uvicorn

### AI
- Groq API
- Large Language Models (LLMs)

---

## Project Structure

```
customer-complaint-ai/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/sahithyasunkara/customer-complaint-ai.git
```

### Navigate to the project

```bash
cd customer-complaint-ai
```

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```
GROQ_API_KEY=your_api_key_here
```

**Do not upload your API key to GitHub.**

---

## Future Improvements

- User Authentication
- Complaint History
- Admin Dashboard
- Email Notifications
- Database Integration
- Analytics Dashboard
- Cloud Deployment

---

## Author

**Sahithya Sunkara**

GitHub: https://github.com/sahithyasunkara

---

## License

This project is created for learning and portfolio purposes.