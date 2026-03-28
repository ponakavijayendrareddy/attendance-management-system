import { Link } from "react-router-dom";

import styles from "../styles/glass-neumorphic.module.css";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-aurora-surface px-4">
      <div className={`${styles.cardGlass} max-w-lg text-center`}>
        <p className="font-display text-5xl font-semibold text-ink">404</p>
        <p className="mt-3 text-lg text-slate-600">That page drifted out of the attendance grid.</p>
        <Link className={`${styles.btnNeumorphic} mt-6 inline-flex`} to="/">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
