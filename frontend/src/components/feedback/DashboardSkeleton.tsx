import { motion } from "framer-motion";

import styles from "../../styles/glass-neumorphic.module.css";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-aurora-surface px-4 py-6">
      <div className="mx-auto grid max-w-7xl gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            className={`${styles.cardGlass} ${styles.skeletonShimmer} h-28 overflow-hidden`}
            animate={{ backgroundPositionX: ["0%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
    </div>
  );
}
