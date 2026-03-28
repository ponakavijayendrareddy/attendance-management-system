interface ProgressRingProps {
  percentage: number;
}

export function ProgressRing({ percentage }: ProgressRingProps) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative h-40 w-40">
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140" aria-label="Attendance percentage">
        <defs>
          <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="14" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="url(#attendanceGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold text-ink">{percentage.toFixed(1)}%</span>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">This Month</span>
      </div>
    </div>
  );
}
