from collections import defaultdict
from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.attendance import AttendanceStatus


class AttendanceMarkItem(BaseModel):
    student_id: int = Field(gt=0)
    date: date
    slot: int
    status: AttendanceStatus

    @field_validator("slot")
    @classmethod
    def validate_slot(cls, value: int) -> int:
        if value not in {1, 2, 3, 4, 5}:
            raise ValueError("Slot must be between 1 and 5.")
        return value


class AttendanceMarkResponse(BaseModel):
    success: bool
    updated_count: int


class AttendanceSlotResponse(BaseModel):
    slot: int
    status: AttendanceStatus


class AttendanceDayResponse(BaseModel):
    date: date
    slots: list[AttendanceSlotResponse]


class MonthlyAttendanceResponse(BaseModel):
    student_id: int
    month: str
    attendance_percentage: float
    days: list[AttendanceDayResponse]


class StudentAttendanceSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    enrollment_no: str
    attendance_percentage: float


def build_attendance_grid(records, month_dates: list[date]) -> list[AttendanceDayResponse]:
    grid_map: dict[date, dict[int, AttendanceStatus]] = defaultdict(dict)
    for record in records:
        grid_map[record.date][record.slot] = record.status

    days: list[AttendanceDayResponse] = []
    for entry_date in month_dates:
        slots = [
            AttendanceSlotResponse(
                slot=slot,
                status=grid_map[entry_date].get(slot, AttendanceStatus.PENDING),
            )
            for slot in range(1, 6)
        ]
        days.append(AttendanceDayResponse(date=entry_date, slots=slots))
    return days
