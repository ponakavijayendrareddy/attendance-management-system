import { NavLink, Outlet } from "react-router-dom";

import styles from "../../styles/glass-neumorphic.module.css";

export function AppShell() {
  return (
    <div className="min-h-screen bg-aurora-surface px-4 py-6 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6">
        <header className={`${styles.cardGlass} flex items-center justify-between gap-4`}>
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold">Attendance Studio</p>
            <p className="text-sm text-slate-600">Attendance overview workspace</p>
          </div>
          <nav className="flex flex-wrap justify-end gap-2">
            <NavLink
              className={({ isActive }) =>
                `${styles.navPill} ${isActive ? styles.navPillActive : ""}`
              }
              to="/"
            >
              Role Switcher
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${styles.navPill} ${isActive ? styles.navPillActive : ""}`
              }
              to="/student"
            >
              Student
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${styles.navPill} ${isActive ? styles.navPillActive : ""}`
              }
              to="/faculty"
            >
              Faculty
            </NavLink>
          </nav>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
