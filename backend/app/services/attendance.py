from calendar import monthrange
from datetime import date

from sqlalchemy import case, func, select
from sqlalchemy.dialects.postgresql import insert as postgres_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session

from app.models.attendance import Attendance, AttendanceStatus
from app.models.user import User, UserRole
from app.schemas.attendance import AttendanceMarkItem


def build_month_dates(target_month: date) -> list[date]:
    _, total_days = monthrange(target_month.year, target_month.month)
    return [date(target_month.year, target_month.month, day) for day in range(1, total_days + 1)]


def calculate_student_percentage(db: Session, student_id: int, target_month: date) -> float:
    start = target_month.replace(day=1)
    end = target_month.replace(day=monthrange(target_month.year, target_month.month)[1])
    present_case = case((Attendance.status == AttendanceStatus.PRESENT, 1), else_=0)
    stmt = (
        select(
            func.coalesce(func.sum(present_case), 0).label("present_count"),
            func.count(Attendance.id).label("total_count"),
        )
        .where(
            Attendance.student_id == student_id,
            Attendance.date >= start,
            Attendance.date <= end,
        )
    )
    result = db.execute(stmt).one()
    if not result.total_count:
        return 0.0
    return round((result.present_count / result.total_count) * 100, 2)


def bulk_upsert_attendance(db: Session, items: list[AttendanceMarkItem]) -> int:
    payload = [
        {
            "student_id": item.student_id,
            "date": item.date,
            "slot": item.slot,
            "status": item.status,
        }
        for item in items
    ]
    dialect_name = db.bind.dialect.name if db.bind else "sqlite"
    insert_fn = postgres_insert if dialect_name == "postgresql" else sqlite_insert
    stmt = insert_fn(Attendance).values(payload)
    stmt = stmt.on_conflict_do_update(
        index_elements=["student_id", "date", "slot"],
        set_={"status": stmt.excluded.status, "last_updated_at": func.now()},
    )
    result = db.execute(stmt)
    db.commit()
    return result.rowcount or len(payload)


def list_students_with_percentages(db: Session, page: int, page_size: int):
    present_case = case((Attendance.status == AttendanceStatus.PRESENT, 1), else_=0)
    stmt = (
        select(
            User.id,
            User.name,
            User.email,
            User.enrollment_no,
            (
                func.coalesce(func.sum(present_case), 0) * 100.0
                / func.nullif(func.count(Attendance.id), 0)
            ).label("attendance_percentage"),
        )
        .select_from(User)
        .outerjoin(Attendance, Attendance.student_id == User.id)
        .where(User.role == UserRole.STUDENT)
        .group_by(User.id)
        .order_by(User.name.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()
    return [
        {
            "id": row.id,
            "name": row.name,
            "email": row.email,
            "enrollment_no": row.enrollment_no,
            "attendance_percentage": round(row.attendance_percentage or 0.0, 2),
        }
        for row in rows
    ]
