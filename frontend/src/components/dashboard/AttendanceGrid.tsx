import type { AttendanceDay } from "../../types/attendance";
import styles from "../../styles/glass-neumorphic.module.css";

const slotStyles = {
  Pending: styles.slotPending,
  Present: styles.slotPresent,
  Absent: styles.slotAbsent,
};

export function AttendanceGrid({ days }: { days: AttendanceDay[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {days.map((day) => (
        <article key={day.date} className={`${styles.cardGlass} flex flex-col gap-4`}>
          {(() => {
            const presentCount = day.slots.filter((slot) => slot.status === "Present").length;
            const absentCount = day.slots.filter((slot) => slot.status === "Absent").length;
            const pendingCount = day.slots.filter((slot) => slot.status === "Pending").length;

            return (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold">{day.date}</p>
                    <p className="text-sm text-slate-500">5-slot day planner</p>
                  </div>
                  <div className="rounded-2xl bg-white/55 px-3 py-2 text-right text-xs font-medium text-slate-600">
                    <p>Present: {presentCount}</p>
                    <p>Absent: {absentCount}</p>
                    <p>Pending: {pendingCount}</p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {day.slots.map((slot) => (
                    <button
                      key={`${day.date}-${slot.slot}`}
                      className={`${styles.slotButton} ${slotStyles[slot.status]}`}
                      title={`${day.date} | Slot ${slot.slot} | ${slot.status}`}
                    >
                      <span className="text-xs font-semibold">S{slot.slot}</span>
                    </button>
                  ))}
                </div>
              </>
            );
          })()}
        </article>
      ))}
    </div>
  );
}
