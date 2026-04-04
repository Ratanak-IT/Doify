import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

interface CardProps {
  label: string;
  value: string | number;
  change: string;
  changeLabel: string;
  trend: "up" | "down";
  icon: ReactNode;
  iconBg: string;
}

export function StatCard({ label, value, change, changeLabel, trend, icon, iconBg }: CardProps) {
  const isUp = trend === "up";
  return (
    <div className="bg-white border border-[#ebecf0] rounded-xl p-5 flex flex-col gap-3 flex-1 min-w-0 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#6b778c] uppercase tracking-wide">{label}</p>
          <p className="text-[32px] font-bold text-[#172b4d] leading-none mt-2">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
      </div>
      <div className="flex items-center gap-1.5 pt-1 border-t border-[#f4f5f7]">
        {isUp ? <TrendingUp size={13} className="text-[#00875a]" /> : <TrendingDown size={13} className="text-[#de350b]" />}
        <span className={`text-xs font-semibold ${isUp ? "text-[#00875a]" : "text-[#de350b]"}`}>{change}</span>
        <span className="text-xs text-[#8993a4]">{changeLabel}</span>
      </div>
    </div>
  );
}
