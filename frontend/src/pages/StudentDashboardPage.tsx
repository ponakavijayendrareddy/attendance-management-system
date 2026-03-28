import { AttendanceGrid } from "../components/dashboard/AttendanceGrid";
import { ProgressRing } from "../components/dashboard/ProgressRing";
import { DashboardSkeleton } from "../components/feedback/DashboardSkeleton";
import { useStudentAttendance } from "../hooks/useStudentAttendance";
import { useDemoAttendanceStore } from "../store/demoAttendanceStore";
import styles from "../styles/glass-neumorphic.module.css";

export function StudentDashboardPage() {
  const month = new Date().toISOString().slice(0, 7);
  const { attendance, isLoading } = useStudentAttendance(month);
  const activeStudentId = useDemoAttendanceStore((state) => state.activeStudentId);
  const students = useDemoAttendanceStore((state) => state.students);

  if (isLoading || !attendance) {
    return <DashboardSkeleton />;
  }

  const activeStudent = students.find((student) => student.id === activeStudentId);
  const allSlots = attendance.days.flatMap((day) => day.slots);
  const totalSlots = allSlots.length;
  const presentSlots = allSlots.filter((slot) => slot.status === "Present").length;
  const absentSlots = allSlots.filter((slot) => slot.status === "Absent").length;
  const pendingSlots = allSlots.filter((slot) => slot.status === "Pending").length;
  const totalDays = attendance.days.length;

  return (
    <section className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <article className={`${styles.cardGlass} flex flex-col items-center justify-center gap-6`}>
          <ProgressRing percentage={attendance.attendance_percentage} />
          <div className="text-center">
            <p className="font-display text-xl font-semibold text-ink">
              {attendance.student_name ?? activeStudent?.name ?? "Student"} Dashboard
            </p>
            <p className="text-sm text-slate-500">
              {activeStudent?.enrollment_no ?? "STU1001"} • Responsive slot tracker for {attendance.month}
            </p>
          </div>
        </article>

        <article className={`${styles.cardGlass} grid gap-4`}>
          <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-2xl font-semibold text-ink">Attendance Details</p>
              <p className="text-sm text-slate-500">
                Slot-wise monthly breakdown across {totalDays} tracked day{totalDays === 1 ? "" : "s"}.
              </p>
            </div>
            <p className="rounded-full bg-white/55 px-4 py-2 text-sm font-semibold text-slate-700">
              {attendance.month}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className={styles.metricCard}>
              <p className="text-sm font-medium text-slate-500">Total Slots</p>
              <p className="font-display text-4xl font-semibold text-ink">{totalSlots}</p>
              <p className="text-sm text-slate-500">5 slots per working day</p>
            </div>

            <div className={`${styles.metricCard} ${styles.metricPresent}`}>
              <p className="text-sm font-medium text-slate-500">Present Slots</p>
              <p className="font-display text-4xl font-semibold text-emerald-700">{presentSlots}</p>
              <p className="text-sm text-slate-500">
                {totalSlots ? ((presentSlots / totalSlots) * 100).toFixed(1) : "0.0"}% of total slots
              </p>
            </div>

            <div className={`${styles.metricCard} ${styles.metricAbsent}`}>
              <p className="text-sm font-medium text-slate-500">Absent Slots</p>
              <p className="font-display text-4xl font-semibold text-rose-700">{absentSlots}</p>
              <p className="text-sm text-slate-500">
                {totalSlots ? ((absentSlots / totalSlots) * 100).toFixed(1) : "0.0"}% of total slots
              </p>
            </div>

            <div className={`${styles.metricCard} ${styles.metricPending}`}>
              <p className="text-sm font-medium text-slate-500">Pending Slots</p>
              <p className="font-display text-4xl font-semibold text-slate-700">{pendingSlots}</p>
              <p className="text-sm text-slate-500">Yet to be marked by faculty</p>
            </div>
          </div>
        </article>
      </div>

      <AttendanceGrid days={attendance.days} />
    </section>
  );
}
