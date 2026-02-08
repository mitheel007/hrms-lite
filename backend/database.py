from sqlmodel import create_engine, SQLModel

SQLITE_FILE_NAME = "hrms.db"
SQLITE_URL = f"sqlite:///{SQLITE_FILE_NAME}"

engine = create_engine(SQLITE_URL, echo=False, connect_args={"check_same_thread": False})

def init_db():
    try:
        from backend.models import Employee, Attendance
    except ImportError:
        from models import Employee, Attendance
    SQLModel.metadata.create_all(engine)
