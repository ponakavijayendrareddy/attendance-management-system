import type { AttendanceMarkRecord, MonthlyAttendance, StudentSummary } from "../types/attendance";
import { apiRequest } from "./api";

export function getStudentAttendance(studentId: number, month: string) {
  return apiRequest<MonthlyAttendance>(`/attendance/student/${studentId}?month=${month}`);
}

export function markAttendance(payload: AttendanceMarkRecord[]) {
  return apiRequest<{ success: boolean; updated_count: number }>("/attendance/mark", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getFacultyStudents(page = 1) {
  return apiRequest<StudentSummary[]>(`/faculty/students?page=${page}&page_size=25`);
}
