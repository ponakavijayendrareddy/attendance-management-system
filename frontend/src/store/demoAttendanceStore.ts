import { create } from "zustand";

import type { AttendanceStatus, MonthlyAttendance, StudentSummary } from "../types/attendance";

interface DemoAttendanceState {
  activeStudentId: number;
  students: StudentSummary[];
  attendanceByStudent: Record<number, MonthlyAttendance>;
  setActiveStudent: (studentId: number) => void;
  updateAttendanceStatus: (studentId: number, slot: number, status: AttendanceStatus, date?: string) => void;
}

const initialAttendanceByStudent: Record<number, MonthlyAttendance> = {
  1: {
    student_id: 1,
    student_name: "Vijay",
    month: "2026-03",
    attendance_percentage: 82.4,
    days: [
      {
        date: "2026-03-27",
        slots: [
          { slot: 1, status: "Present" },
          { slot: 2, status: "Present" },
          { slot: 3, status: "Absent" },
          { slot: 4, status: "Present" },
          { slot: 5, status: "Pending" },
        ],
      },
      {
        date: "2026-03-28",
        slots: [
          { slot: 1, status: "Present" },
          { slot: 2, status: "Pending" },
          { slot: 3, status: "Present" },
          { slot: 4, status: "Present" },
          { slot: 5, status: "Present" },
        ],
      },
    ],
  },
  2: {
    student_id: 2,
    student_name: "Diya Sharma",
    month: "2026-03",
    attendance_percentage: 76,
    days: [
      {
        date: "2026-03-28",
        slots: [
          { slot: 1, status: "Present" },
          { slot: 2, status: "Absent" },
          { slot: 3, status: "Present" },
          { slot: 4, status: "Pending" },
          { slot: 5, status: "Present" },
        ],
      },
    ],
  },
  3: {
    student_id: 3,
    student_name: "Rohan Iyer",
    month: "2026-03",
    attendance_percentage: 64,
    days: [
      {
        date: "2026-03-28",
        slots: [
          { slot: 1, status: "Absent" },
          { slot: 2, status: "Pending" },
          { slot: 3, status: "Present" },
          { slot: 4, status: "Absent" },
          { slot: 5, status: "Present" },
        ],
      },
    ],
  },
};

const initialStudents: StudentSummary[] = [
  {
    id: 1,
    name: "Vijay",
    email: "vijay@gmail.com",
    enrollment_no: "STU1001",
    attendance_percentage: 82.4,
  },
  {
    id: 2,
    name: "Diya Sharma",
    email: "diya@gmail.com",
    enrollment_no: "STU1002",
    attendance_percentage: 76,
  },
  {
    id: 3,
    name: "Rohan Iyer",
    email: "rohan@gmail.com",
    enrollment_no: "STU1003",
    attendance_percentage: 64,
  },
];

function calculatePercentage(attendance: MonthlyAttendance) {
  const slots = attendance.days.flatMap((day) => day.slots);
  if (!slots.length) {
    return 0;
  }
  const presentCount = slots.filter((slot) => slot.status === "Present").length;
  return Number(((presentCount / slots.length) * 100).toFixed(1));
}

export const useDemoAttendanceStore = create<DemoAttendanceState>((set) => ({
  activeStudentId: 1,
  students: initialStudents,
  attendanceByStudent: initialAttendanceByStudent,
  setActiveStudent: (studentId) => set({ activeStudentId: studentId }),
  updateAttendanceStatus: (studentId, slot, status, date = "2026-03-28") =>
    set((state) => {
      const currentAttendance = state.attendanceByStudent[studentId];
      if (!currentAttendance) {
        return state;
      }

      let dayFound = false;
      const updatedDays = currentAttendance.days.map((day) => {
        if (day.date !== date) {
          return day;
        }
        dayFound = true;
        return {
          ...day,
          slots: day.slots.map((entry) => (entry.slot === slot ? { ...entry, status } : entry)),
        };
      });

      const nextDays = dayFound
        ? updatedDays
        : [
            ...updatedDays,
            {
              date,
              slots: Array.from({ length: 5 }, (_, index) => ({
                slot: index + 1,
                status: index + 1 === slot ? status : ("Pending" as AttendanceStatus),
              })),
            },
          ];

      const nextAttendance: MonthlyAttendance = {
        ...currentAttendance,
        days: nextDays,
      };
      nextAttendance.attendance_percentage = calculatePercentage(nextAttendance);

      const nextStudents = state.students.map((student) =>
        student.id === studentId
          ? { ...student, attendance_percentage: nextAttendance.attendance_percentage }
          : student,
      );

      return {
        attendanceByStudent: {
          ...state.attendanceByStudent,
          [studentId]: nextAttendance,
        },
        students: nextStudents,
      };
    }),
}));
