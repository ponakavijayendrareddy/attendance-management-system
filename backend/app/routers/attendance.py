from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy import extract, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import AppError
from app.models.attendance import Attendance
from app.models.user import User, UserRole
from app.schemas.attendance import (
    AttendanceMarkItem,
    AttendanceMarkResponse,
    MonthlyAttendanceResponse,
    build_attendance_grid,
)
from app.services.attendance import build_month_dates, bulk_upsert_attendance, calculate_student_percentage

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("/student/{student_id}", response_model=MonthlyAttendanceResponse)
def get_student_attendance(
    student_id: int,
    month: str | None = Query(default=None, description="Format: YYYY-MM"),
    db: Session = Depends(get_db),
):
    student = db.get(User, student_id)
    if not student or student.role != UserRole.STUDENT:
        raise AppError(404, "Student not found.", "student_not_found")

    try:
        target_month = date.fromisoformat(f"{month or date.today().strftime('%Y-%m')}-01")
    except ValueError as exc:
        raise AppError(400, "Month must use YYYY-MM format.", "attendance_month_invalid") from exc

    month_dates = build_month_dates(target_month)
    stmt = (
        select(Attendance)
        .where(
            Attendance.student_id == student_id,
            extract("year", Attendance.date) == target_month.year,
            extract("month", Attendance.date) == target_month.month,
        )
        .order_by(Attendance.date.asc(), Attendance.slot.asc())
    )
    records = db.scalars(stmt).all()
    percentage = calculate_student_percentage(db, student_id, target_month)
    return MonthlyAttendanceResponse(
        student_id=student_id,
        month=target_month.strftime("%Y-%m"),
        attendance_percentage=percentage,
        days=build_attendance_grid(records, month_dates),
    )


@router.post("/mark", response_model=AttendanceMarkResponse)
def mark_attendance(
    payload: list[AttendanceMarkItem],
    db: Session = Depends(get_db),
):
    if not payload:
        raise AppError(400, "At least one attendance record is required.", "attendance_payload_empty")

    student_ids = {item.student_id for item in payload}
    valid_students = set(
        db.scalars(select(User.id).where(User.id.in_(student_ids), User.role == UserRole.STUDENT)).all()
    )
    if valid_students != student_ids:
        raise AppError(404, "One or more student records were not found.", "student_not_found")

    updated_count = bulk_upsert_attendance(db, payload)
    return AttendanceMarkResponse(success=True, updated_count=updated_count)
