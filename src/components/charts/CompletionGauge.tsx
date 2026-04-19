"use client";

interface Props {
  completedTasks: number;
  totalTasks: number;
}

export function CompletionGauge({ completedTasks, totalTasks }: Props) {
  const pct = totalTasks ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;

  const color = pct >= 75 ? "#22c55e" : pct >= 40 ? "#6C5CE7" : "#ef4444";
  const label = pct >= 75 ? "On track" : pct >= 40 ? "In progress" : "Needs focus";

  // Donut ring math
  const SIZE = 180;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 68;
  const STROKE = 14;
  const circumference = 2 * Math.PI * R;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Completion rate</p>

      <div className="flex flex-col items-center">
        {/* Donut ring */}
        <div className="relative">
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
            {/* Background track */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth={STROKE}
              className="dark:stroke-slate-800"
            />
            {/* Progress arc */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>

          {/* Center text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-950 dark:text-white leading-none">
              {pct}%
            </span>
            <span className="text-xs font-semibold mt-1" style={{ color }}>
              {label}
            </span>
          </div>
        </div>

        {/* Detail row */}
        <div className="mt-4 grid grid-cols-3 gap-2 w-full">
          <div className="text-center bg-slate-50 dark:bg-[#252840] rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{completedTasks}</p>
            <p className="text-[11px] text-slate-400">Done</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-[#252840] rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{totalTasks - completedTasks}</p>
            <p className="text-[11px] text-slate-400">Left</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-[#252840] rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{totalTasks}</p>
            <p className="text-[11px] text-slate-400">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}