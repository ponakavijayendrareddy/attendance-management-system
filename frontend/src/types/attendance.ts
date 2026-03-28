export type AttendanceStatus = "Present" | "Absent" | "Pending";

export interface AttendanceSlot {
  slot: number;
  status: AttendanceStatus;
}

export interface AttendanceDay {
  date: string;
  slots: AttendanceSlot[];
}

export interface MonthlyAttendance {
  student_id: number;
  student_name?: string;
  month: string;
  attendance_percentage: number;
  days: AttendanceDay[];
}

export interface StudentSummary {
  id: number;
  name: string;
  email: string;
  enrollment_no: string;
  attendance_percentage: number;
}

export interface AttendanceMarkRecord {
  student_id: number;
  date: string;
  slot: number;
  status: AttendanceStatus;
}
