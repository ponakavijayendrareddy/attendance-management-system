from collections.abc import Generator
from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.auth.security import create_token, hash_password
from app.core.database import Base, get_db
from app.main import create_application
from app.models.attendance import Attendance, AttendanceStatus
from app.models.user import User, UserRole

TEST_DATABASE_URL = "sqlite:///./test_attendance.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False}, future=True)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client(db_session: Session):
    app = create_application()

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


@pytest.fixture
def seeded_users(db_session: Session):
    faculty = User(
        name="Faculty User",
        email="faculty@gmail.com",
        enrollment_no="FAC1001",
        role=UserRole.FACULTY,
        hashed_password=hash_password("password123"),
    )
    student = User(
        name="Student User",
        email="student@gmail.com",
        enrollment_no="STU1001",
        role=UserRole.STUDENT,
        hashed_password=hash_password("password123"),
    )
    peer = User(
        name="Peer Student",
        email="peer@gmail.com",
        enrollment_no="STU1002",
        role=UserRole.STUDENT,
        hashed_password=hash_password("password123"),
    )
    db_session.add_all([faculty, student, peer])
    db_session.commit()
    db_session.refresh(faculty)
    db_session.refresh(student)
    db_session.refresh(peer)
    return {"faculty": faculty, "student": student, "peer": peer}


@pytest.fixture
def access_headers():
    def _build(user_id: int):
        token = create_token(str(user_id), "access", 15)
        return {"Authorization": f"Bearer {token}"}

    return _build


@pytest.fixture
def attendance_seed(db_session: Session, seeded_users):
    records = [
        Attendance(
            student_id=seeded_users["student"].id,
            date=date(2026, 3, 27),
            slot=1,
            status=AttendanceStatus.PRESENT,
        ),
        Attendance(
            student_id=seeded_users["student"].id,
            date=date(2026, 3, 27),
            slot=2,
            status=AttendanceStatus.ABSENT,
        ),
    ]
    db_session.add_all(records)
    db_session.commit()
    return records
