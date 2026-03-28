import { useState } from "react";

import { useFacultyStudents } from "../../hooks/useFacultyStudents";
import type { AttendanceStatus } from "../../types/attendance";
import styles from "../../styles/glass-neumorphic.module.css";
import { useDemoAttendanceStore } from "../../store/demoAttendanceStore";
import { DashboardSkeleton } from "../feedback/DashboardSkeleton";
import { Toast } from "../feedback/Toast";

const toggleCycle: AttendanceStatus[] = ["Pending", "Present", "Absent"];
const stateStyles = {
  Pending: styles.slotPending,
  Present: styles.slotPresent,
  Absent: styles.slotAbsent,
};

export function FacultyAttendanceBoard() {
  const { students, isLoading, error, toggleAttendance } = useFacultyStudents();
  const activeStudentId = useDemoAttendanceStore((state) => state.activeStudentId);
  const setActiveStudent = useDemoAttendanceStore((state) => state.setActiveStudent);
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const toggleSlot = async (studentId: number, slot: number, attendancePercentage: number) => {
    const key = `${studentId}-${slot}`;
    const current = statusMap[key] ?? (attendancePercentage > 75 ? "Present" : "Pending");
    const next = toggleCycle[(toggleCycle.indexOf(current) + 1) % toggleCycle.length];
    const previousMap = { ...statusMap };
    setStatusMap({ ...statusMap, [key]: next });

    const student = students.find((entry) => entry.id === studentId);
    if (!student) {
      return;
    }
    try {
      await toggleAttendance(student, slot, next);
    } catch {
      setStatusMap(previousMap);
    }
  };

  const markAllPresent = async (slot: number) => {
    const confirmed = window.confirm(`Mark all visible students as Present for slot ${slot}?`);
    if (!confirmed) {
      return;
    }
    for (const student of students) {
      const key = `${student.id}-${slot}`;
      setStatusMap((current) => ({ ...current, [key]: "Present" }));
      try {
        await toggleAttendance(student, slot, "Present");
      } catch {
        setStatusMap((current) => ({ ...current, [key]: "Pending" }));
      }
    }
  };

  return (
    <section className="grid gap-4">
      <Toast message={error} />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <button key={index} className={styles.btnNeumorphic} onClick={() => void markAllPresent(index + 1)}>
            Mark Slot {index + 1} Present
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {students.map((student) => (
          <article key={student.id} className={`${styles.cardGlass} flex flex-col gap-4 lg:flex-row lg:items-center`}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <p className="font-display text-lg font-semibold">{student.name}</p>
                {student.id === activeStudentId ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Live Student View
                  </span>
                ) : null}
              </div>
              <p className="truncate text-sm text-slate-500">
                {student.enrollment_no} • {student.email}
              </p>
            </div>
            <button className={styles.btnNeumorphic} onClick={() => setActiveStudent(student.id)} type="button">
              View Student
            </button>
            <p className="rounded-full bg-white/45 px-4 py-2 text-sm font-semibold text-ink">
              {student.attendance_percentage.toFixed(1)}%
            </p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, slotIndex) => {
                const slot = slotIndex + 1;
                const state = statusMap[`${student.id}-${slot}`] ?? "Pending";
                return (
                  <button
                    key={slot}
                    className={`${styles.slotButton} ${stateStyles[state]}`}
                    onClick={() => void toggleSlot(student.id, slot, student.attendance_percentage)}
                  >
                    Slot {slot}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
