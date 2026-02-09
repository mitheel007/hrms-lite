# hrms-lite

A lightweight Human Resource Management System (HRMS Lite) with employee management and attendance tracking. Built to be clean, functional, and production-ready within scope constraints.

## Overview
- Backend: FastAPI + SQLModel + SQLite (Serverless on Vercel)
- Frontend: React 18 + Vite

## Features
- Add / list / delete employees
- Mark attendance (date + Present/Absent)
- View attendance per employee
- Dashboard with statistics

## Project Structure

```
hrms-lite/
├── api/                    # Vercel serverless functions (FastAPI backend)
│   └── index.py           # Main API handler
├── backend/               # Original backend (for local dev)
├── frontend/              # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── vercel.json           # Vercel deployment config
└── requirements.txt      # Python dependencies for Vercel
```

## Local Development

### Backend (Traditional)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Vercel Deployment

### Quick Deploy
1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel will automatically:
   - Build the frontend (`npm run build`)
   - Deploy Python serverless functions (`api/index.py`)
   - Configure routing between frontend and API

### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Create `.env` file in `frontend/` directory:
```
# For local development with separate backend
VITE_API_BASE=http://localhost:8000

# For Vercel deployment (same domain - leave empty)
VITE_API_BASE=
```

## API Endpoints

All API routes are prefixed with `/api/` on Vercel:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/stats` | Dashboard statistics |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | List employees |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/employees/{id}/stats` | Employee attendance stats |
| POST | `/api/employees/{id}/attendance` | Mark attendance |
| GET | `/api/employees/{id}/attendance` | Get attendance records |

## Configuration Files

### vercel.json
Routes all `/api/*` requests to the Python serverless function and serves the frontend for all other routes.

### vite.config.js
Production build configuration with React plugin and API proxy for local development.

## Notes
- SQLite database is used for simplicity (file-based)
- On Vercel, the database is ephemeral - data persists only during the function's lifetime
- For production with persistent data, consider migrating to PostgreSQL (Supabase, Neon, etc.)

## Limitations & Assumptions
- Single admin user; no authentication
- Minimal frontend validation; backend enforces required fields and duplicate checks
- SQLite database (consider PostgreSQL for production scale)
