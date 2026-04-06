"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const teams = [
  { name: "ISTAD Inc", plan: "Enterprise" },
  { name: "Acme Corp", plan: "Pro" },
];

export function TeamSwitcher() {
  const [active, setActive] = useState(teams[0]);
  const [open,   setOpen]   = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full px-4 py-3.5 border-b border-[#E8E8EF] hover:bg-[#F8F8FC] transition-colors">
        <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="4"  height="12" rx="1" fill="white"/>
            <rect x="7" y="1" width="6"  height="8"  rx="1" fill="white" opacity=".8"/>
          </svg>
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-bold text-[#1E293B] leading-none truncate">{active.name}</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">{active.plan}</p>
        </div>
        <ChevronDown size={14} className="text-[#94A3B8] shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-2 right-2 top-full mt-1 bg-white border border-[#E8E8EF] rounded-xl shadow-xl z-20 py-1 overflow-hidden">
            {teams.map((team) => (
              <button key={team.name} onClick={() => { setActive(team); setOpen(false); }}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-left hover:bg-[#F8F8FC] transition-colors ${active.name === team.name ? "bg-[#F0EDFF]" : ""}`}>
                <div className="w-7 h-7 rounded-lg bg-[#6C5CE7] flex items-center justify-center text-white text-xs font-bold shrink-0">{team.name[0]}</div>
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">{team.name}</p>
                  <p className="text-xs text-[#94A3B8]">{team.plan}</p>
                </div>
                {active.name === team.name && (
                  <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
            <div className="border-t border-[#F1F5F9] mt-1 pt-1">
              <button className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#94A3B8] hover:bg-[#F8F8FC] transition-colors">
                <span className="text-lg leading-none">+</span> Add workspace
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
