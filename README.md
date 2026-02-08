# HRMS Lite

This repository contains a lightweight full-stack HRMS (Human Resource Management System) sample.

Overview
- Backend: FastAPI + SQLModel + SQLite
- Frontend: React (Vite)

Features
- Add / list / delete employees
- Mark attendance (date + Present/Absent)
- View attendance per employee

Run locally

Backend
```
cd backend
python -m venv .venv
.\.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Frontend
```
cd frontend
npm install
npm run dev
```

Notes
- API base for frontend defaults to `http://localhost:8000`. Use `VITE_API_BASE` env var to override.
- Database file is `backend/hrms.db` (SQLite).

Limitations & assumptions
- Single admin user; no auth
- Minimal validation on frontend; backend enforces required fields and duplicate checks
