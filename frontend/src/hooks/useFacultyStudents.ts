import { useEffect, useState } from "react";

import { getFacultyStudents, markAttendance } from "../services/attendanceService";
import type { AttendanceStatus, StudentSummary } from "../types/attendance";
import { useDemoAttendanceStore } from "../store/demoAttendanceStore";

export function useFacultyStudents() {
  const demoStudents = useDemoAttendanceStore((state) => state.students);
  const updateAttendanceStatus = useDemoAttendanceStore((state) => state.updateAttendanceStatus);
  const [students, setStudents] = useState<StudentSummary[]>(demoStudents);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getFacultyStudents();
        setStudents(data);
        setError(null);
      } catch {
        setStudents(demoStudents);
        setError("Showing demo faculty data until authenticated API access is wired.");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [demoStudents]);

  const toggleAttendance = async (student: StudentSummary, slot: number, status: AttendanceStatus) => {
    updateAttendanceStatus(student.id, slot, status);
    try {
      await markAttendance([
        {
          student_id: student.id,
          date: new Date().toISOString().slice(0, 10),
          slot,
          status,
        },
      ]);
      setError(null);
    } catch {
      setError("Saved locally in demo mode. Connect authenticated faculty flow to persist changes.");
    }
  };

  return { students: demoStudents, isLoading, error, toggleAttendance };
}
