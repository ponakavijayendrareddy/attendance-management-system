import { useEffect, useState } from "react";

import { getStudentAttendance } from "../services/attendanceService";
import type { MonthlyAttendance } from "../types/attendance";
import { useDemoAttendanceStore } from "../store/demoAttendanceStore";

export function useStudentAttendance(month: string) {
  const activeStudentId = useDemoAttendanceStore((state) => state.activeStudentId);
  const fallbackAttendance = useDemoAttendanceStore((state) => state.attendanceByStudent[activeStudentId]);
  const [attendance, setAttendance] = useState<MonthlyAttendance | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getStudentAttendance(activeStudentId, month);
        setAttendance(data);
      } catch {
        setAttendance({ ...fallbackAttendance, month });
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [activeStudentId, fallbackAttendance, month]);

  return { attendance, isLoading };
}
