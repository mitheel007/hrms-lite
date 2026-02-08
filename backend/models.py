from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from pydantic import EmailStr


class EmployeeBase(SQLModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class Employee(EmployeeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class EmployeeCreate(EmployeeBase):
    pass


class AttendanceBase(SQLModel):
    date: date
    status: str


class Attendance(AttendanceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: int = Field(foreign_key="employee.id")


class AttendanceCreate(AttendanceBase):
    pass
