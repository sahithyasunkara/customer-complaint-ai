# AI-Powered Pharmaceutical Complaint Management System

This project is a polished, portfolio-ready complaint management application for pharmaceutical quality operations. It combines a React + Material UI frontend, a FastAPI backend, and a Redux-powered state layer to support complaint intake, AI-assisted summarization, and operational dashboards.

## Project Overview

The application is designed to help teams manage customer complaints through a modern, enterprise-style workflow:

- Capture complaints through a professional intake experience
- Use AI-assisted analysis to suggest values, risk, and summary content
- Review complaint records from a dashboard and complaint detail view
- Maintain a clean, responsive interface suitable for portfolio presentation

## Architecture

The project follows a modular monorepo structure:

- Frontend: React, Vite, Redux Toolkit, Material UI, React Router, Recharts
- Backend: FastAPI, Pydantic, SQLAlchemy, PostgreSQL-compatible persistence
- AI Layer: structured analysis workflow for intake assistance

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Redux Toolkit, React Router, MUI, Axios, Recharts |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy |
| Data | PostgreSQL-compatible SQLAlchemy models |
| AI | Modular workflow-based intake analysis |
| Tooling | Docker Compose, Vite, Python unittest |

## Folder Structure

```text
customer-complaint-ai/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── theme/
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Installation

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Full stack with Docker

```bash
docker compose up --build
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/complaints` | List complaints |
| POST | `/complaints` | Create complaint |
| GET | `/complaints/{complaint_id}` | Fetch complaint by ID |
| PUT | `/complaints/{complaint_id}` | Update complaint |
| DELETE | `/complaints/{complaint_id}` | Delete complaint |
| POST | `/ai/analyze` | Analyze complaint text or upload |

## Screenshots

Placeholder for portfolio screenshots.

## Future Improvements

- Add real Groq or OpenAI integration for richer AI reasoning
- Introduce authentication and role-based access
- Add attachment storage and document parsing
- Expand dashboard analytics and export features

## Verification

The application was verified with:

- Frontend production build: `npm run build`
- Backend tests: `python -m unittest tests.test_ai_analyze tests.test_complaints`
