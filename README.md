<<<<<<< HEAD
# hrms-lite

A lightweight Human Resource Management System (HRMS Lite) with employee management and attendance tracking. Built to be clean, functional, and production-ready within scope constraints.

## Overview
- Backend: FastAPI + SQLModel + SQLite
- Frontend: React (Vite)

## Features
- Add / list / delete employees
- Mark attendance (date + Present/Absent)
- View attendance per employee

## Run locally

### Backend
```
cd backend
python -m venv .venv
.\.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Notes
- API base for frontend defaults to `http://localhost:8000`. Use `VITE_API_BASE` env var to override.
- Database file is `backend/hrms.db` (SQLite).

## Limitations & assumptions
- Single admin user; no auth
- Minimal validation on frontend; backend enforces required fields and duplicate checks
=======
# hrms-lite
A lightweight Human Resource Management System (HRMS Lite) with employee management and attendance tracking. Built to be clean, functional, and production-ready within scope constraints.
>>>>>>> ee0a835e2783617621920db90c68511ac4aa8148
