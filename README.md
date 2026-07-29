# Customer Complaint AI

## Project Overview

Customer Complaint AI is a web application that helps businesses analyze customer complaints using Artificial Intelligence. The system accepts a complaint from the user, sends it to an AI model, and returns useful information such as complaint category, priority, sentiment, and a suggested response.

The project is built with a React frontend and a FastAPI backend. The AI functionality is powered using the Groq API.

---

## Features

- Submit customer complaints
- AI-based complaint analysis
- Detect complaint category
- Identify complaint priority
- Analyze customer sentiment
- Generate a suggested response
- Simple and responsive user interface

---

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Uvicorn

### AI
- Groq API
- Llama Model

---

## Project Structure

```
customer-complaint-ai
│
├── backend
│   ├── app
│   ├── requirements.txt
│   └── .env.example
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/sahithyasunkara/customer-complaint-ai.git
```

### Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows:

```bash
venv\Scripts\activate
```

Install the required packages.

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder and add your Groq API key.

```env
GROQ_API_KEY=your_api_key
```

Start the backend server.

```bash
uvicorn app.main:app --reload
```

---

### Frontend Setup

Open another terminal.

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

## Future Improvements

- User login and registration
- Database integration
- Complaint history
- Email notifications
- Dashboard with analytics
- Admin panel

---

## Author

**Sahithya Sunkara**

GitHub: https://github.com/sahithyasunkara

---

## License

This project is created for learning and educational purposes.
