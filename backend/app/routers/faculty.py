from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.attendance import StudentAttendanceSummary
from app.services.attendance import list_students_with_percentages

router = APIRouter(prefix="/faculty", tags=["faculty"])


@router.get("/students", response_model=list[StudentAttendanceSummary])
def get_students(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return list_students_with_percentages(db, page, page_size)
