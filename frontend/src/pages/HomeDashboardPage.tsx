import { useState } from "react";

import { FacultyAttendanceBoard } from "../components/dashboard/FacultyAttendanceBoard";
import { StudentDashboardPage } from "./StudentDashboardPage";
import styles from "../styles/glass-neumorphic.module.css";

export function HomeDashboardPage() {
  const [activeRole, setActiveRole] = useState<"Student" | "Faculty">("Student");

  return (
    <section className="grid gap-8">
      <article className={`${styles.cardGlass} flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between`}>
        <div>
          <p className="font-display text-3xl font-semibold text-ink">Attendance Management Interface</p>
          <p className="text-sm text-slate-500">
            Switch roles inside the interface to move between the student and faculty dashboards.
          </p>
        </div>
        <div className={styles.roleSwitch}>
          <button
            className={`${styles.authSwitch} ${activeRole === "Student" ? styles.authSwitchActive : ""}`}
            onClick={() => setActiveRole("Student")}
            type="button"
          >
            Student Role
          </button>
          <button
            className={`${styles.authSwitch} ${activeRole === "Faculty" ? styles.authSwitchActive : ""}`}
            onClick={() => setActiveRole("Faculty")}
            type="button"
          >
            Faculty Role
          </button>
        </div>
      </article>

      {activeRole === "Student" ? (
        <section id="student-section" className="grid gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-display text-2xl font-semibold text-ink">Student Dashboard</p>
            <p className="text-sm text-slate-500">
              Attendance percentage, total slots, present, absent, pending, and day-wise slot details.
            </p>
          </div>
          <StudentDashboardPage />
        </section>
      ) : (
        <section id="faculty-section" className="grid gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-display text-2xl font-semibold text-ink">Faculty Dashboard</p>
            <p className="text-sm text-slate-500">
              Toggle attendance by slot, bulk mark visible students, and track live percentage trends.
            </p>
          </div>
          <article className={`${styles.cardGlass} flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between`}>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Faculty Control Deck</p>
              <p className="text-sm text-slate-500">
                Slot-based marking interface with optimistic updates and reusable attendance controls.
              </p>
            </div>
            <p className="text-sm text-slate-500">Faculty role is active</p>
          </article>
          <FacultyAttendanceBoard />
        </section>
      )}
    </section>
  );
}
