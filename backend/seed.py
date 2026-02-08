import random
from datetime import date, timedelta
from sqlmodel import Session
from .database import engine, init_db
from .models import Employee, Attendance

# ---------- CONFIG ----------
DEPARTMENTS = ["Engineering", "Marketing", "Sales", "Human Resources", "Finance"]
EMP_PER_DEPT = 8
DAYS = 30
PRESENT_PROBABILITY = 0.85  # 85% present
# ----------------------------

first_names = [
    "Aarav", "Vivaan", "Aditya", "Riya", "Neha", "Karan", "Priya", "Rahul",
    "Sneha", "Ishaan", "Anjali", "Rohit", "Meera", "Divya", "Sameer",
    "Tanya", "Deepak", "Swati", "Vikram", "Ananya", "John", "Sarah", "Michael",
    "Emily", "David", "Lisa", "James", "Rachel", "Chris", "Amanda"
]

last_names = [
    "Sharma", "Patel", "Shah", "Gupta", "Mehta", "Iyer", "Rao",
    "Singh", "Joshi", "Nair", "Jain", "Kapoor", "Reddy", "Kumar",
    "Smith", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson"
]


def random_name():
    return f"{random.choice(first_names)} {random.choice(last_names)}"


def random_email(name):
    return name.lower().replace(" ", ".") + "@company.com"


def seed_database():
    init_db()
    
    with Session(engine) as session:
        # Check if already seeded
        existing = session.query(Employee).first()
        if existing:
            print("✓ Database already seeded. Clearing and reseeding...")
            # Delete all attendance and employee records
            session.query(Attendance).delete()
            session.query(Employee).delete()
            session.commit()
        
        print("🌱 Seeding database...\n")
        
        employees = []
        emp_counter = 1
        
        # ---------- Create Employees ----------
        for dept in DEPARTMENTS:
            for i in range(EMP_PER_DEPT):
                name = random_name()
                emp = Employee(
                    employee_id=f"{dept[:2].upper()}{emp_counter:03}",
                    full_name=name,
                    email=random_email(name),
                    department=dept
                )
                employees.append(emp)
                emp_counter += 1
        
        session.add_all(employees)
        session.commit()
        
        print(f"✓ Created {len(employees)} employees across {len(DEPARTMENTS)} departments")
        
        # ---------- Create Attendance Records ----------
        all_emps = session.query(Employee).all()
        start_date = date.today() - timedelta(days=DAYS)
        
        attendance_records = []
        
        for emp in all_emps:
            for i in range(DAYS):
                current_day = start_date + timedelta(days=i)
                
                # Skip weekends (Saturday=5, Sunday=6)
                if current_day.weekday() >= 5:
                    continue
                
                status = (
                    "Present"
                    if random.random() < PRESENT_PROBABILITY
                    else "Absent"
                )
                
                attendance_records.append(
                    Attendance(
                        employee_id=emp.id,
                        date=current_day,
                        status=status
                    )
                )
        
        session.add_all(attendance_records)
        session.commit()
        
        print(f"✓ Created {len(attendance_records)} attendance records (last {DAYS} days, weekends excluded)")
        
        # ---------- Summary ----------
        print("\n" + "="*50)
        print("✅ Database seeded successfully!")
        print("="*50)
        print(f"\n📊 Summary:")
        print(f"  • Total Employees: {len(employees)}")
        print(f"  • Employees per Department: {EMP_PER_DEPT}")
        print(f"  • Departments: {', '.join(DEPARTMENTS)}")
        print(f"  • Attendance Records: {len(attendance_records)}")
        print(f"  • Expected Attendance Rate: {PRESENT_PROBABILITY*100:.0f}%")
        print(f"\n🚀 Ready to use! Visit http://localhost:5173")


if __name__ == "__main__":
    seed_database()

