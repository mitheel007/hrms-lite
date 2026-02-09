from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from backend.database import engine, init_db
from backend.models import Employee, EmployeeCreate, Attendance, AttendanceCreate
from typing import List, Optional
from datetime import date
from sqlalchemy import func
from mangum import Mangum

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/stats")
def get_stats():
    with Session(engine) as session:
        total_employees = session.exec(select(func.count(Employee.id))).one()
        total_records = session.exec(select(func.count(Attendance.id))).one()
        today = date.today()
        present_today = session.exec(
            select(func.count(Attendance.id)).where(
                (Attendance.date == today) & (Attendance.status == "Present")
            )
        ).one()
        absent_today = session.exec(
            select(func.count(Attendance.id)).where(
                (Attendance.date == today) & (Attendance.status == "Absent")
            )
        ).one()
        return {
            "total_employees": total_employees,
            "total_attendance_records": total_records,
            "present_today": present_today,
            "absent_today": absent_today
        }


@app.post("/api/employees", response_model=Employee, status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate):
    with Session(engine) as session:
        existing = session.exec(select(Employee).where((Employee.employee_id == payload.employee_id) | (Employee.email == payload.email))).first()
        if existing:
            raise HTTPException(status_code=400, detail="Employee with same ID or email already exists")
        emp = Employee.model_validate(payload)
        session.add(emp)
        session.commit()
        session.refresh(emp)
        return emp


@app.get("/api/employees", response_model=List[Employee])
def list_employees():
    with Session(engine) as session:
        employees = session.exec(select(Employee)).all()
        return employees


@app.get("/api/employees/{employee_id}/stats")
def get_employee_stats(employee_id: str):
    with Session(engine) as session:
        emp = session.exec(select(Employee).where(Employee.employee_id == employee_id)).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        total_present = session.exec(
            select(func.count(Attendance.id)).where(
                (Attendance.employee_id == emp.id) & (Attendance.status == "Present")
            )
        ).one()
        
        total_absent = session.exec(
            select(func.count(Attendance.id)).where(
                (Attendance.employee_id == emp.id) & (Attendance.status == "Absent")
            )
        ).one()
        
        total = total_present + total_absent
        percentage = (total_present / total * 100) if total > 0 else 0
        
        return {
            "employee_id": employee_id,
            "total_present_days": total_present,
            "total_absent_days": total_absent,
            "total_records": total,
            "attendance_percentage": round(percentage, 2)
        }


@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str):
    with Session(engine) as session:
        emp = session.exec(select(Employee).where(Employee.employee_id == employee_id)).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        atts = session.exec(select(Attendance).where(Attendance.employee_id == emp.id)).all()
        for a in atts:
            session.delete(a)
        session.delete(emp)
        session.commit()
        return None


@app.post("/api/employees/{employee_id}/attendance", response_model=Attendance, status_code=status.HTTP_201_CREATED)
def mark_attendance(employee_id: str, payload: AttendanceCreate):
    with Session(engine) as session:
        emp = session.exec(select(Employee).where(Employee.employee_id == employee_id)).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        existing = session.exec(select(Attendance).where((Attendance.employee_id == emp.id) & (Attendance.date == payload.date))).first()
        if existing:
            raise HTTPException(status_code=400, detail="Attendance for this date already recorded")
        att = Attendance(employee_id=emp.id, date=payload.date, status=payload.status)
        session.add(att)
        session.commit()
        session.refresh(att)
        return att


@app.get("/api/employees/{employee_id}/attendance", response_model=List[Attendance])
def get_attendance(employee_id: str, start_date: Optional[date] = None, end_date: Optional[date] = None):
    with Session(engine) as session:
        emp = session.exec(select(Employee).where(Employee.employee_id == employee_id)).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        q = select(Attendance).where(Attendance.employee_id == emp.id)
        if start_date:
            q = q.where(Attendance.date >= start_date)
        if end_date:
            q = q.where(Attendance.date <= end_date)
        records = session.exec(q).all()
        return records


handler = Mangum(app)
