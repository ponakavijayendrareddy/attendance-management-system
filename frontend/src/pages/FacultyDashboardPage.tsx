import { FacultyAttendanceBoard } from "../components/dashboard/FacultyAttendanceBoard";
import styles from "../styles/glass-neumorphic.module.css";

export function FacultyDashboardPage() {
  return (
    <section className="grid gap-6">
      <article className={`${styles.cardGlass} flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between`}>
        <div>
          <p className="font-display text-3xl font-semibold text-ink">Faculty Control Deck</p>
          <p className="text-sm text-slate-500">
            Toggle slots with optimistic updates and bulk-mark visible cohorts in one pass.
          </p>
        </div>
        <p className="text-sm text-slate-500">Pagination-ready endpoint wired for larger student lists.</p>
      </article>
      <FacultyAttendanceBoard />
    </section>
  );
}
