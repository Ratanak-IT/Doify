"use client";

import Link from "next/link";
import { useGetProjectsQuery } from "@/lib/features/tasks/taskApi";

export function NavProjects() {
  const { data: pageData, isLoading } = useGetProjectsQuery({});
  const projects = pageData?.content ?? [];

  return (
    <div className="px-2">
      <p className="px-3 text-[10px] font-bold text-[#7ab0ff] mb-1.5 uppercase tracking-wider">Projects</p>
      <nav className="space-y-0.5">
        {isLoading && (
          <div className="space-y-1 px-3 py-1">
            {[1,2,3].map((i) => <div key={i} className="h-7 bg-[#0052cc]/40 rounded-md animate-pulse" />)}
          </div>
        )}
        {projects.slice(0, 6).map(({ id, name, color }) => (
          <Link key={id} href="/dashboard/projects"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#b8d4ff] hover:bg-[#0052cc]/50 hover:text-white transition-colors">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
            <span className="truncate">{name}</span>
          </Link>
        ))}
        {!isLoading && projects.length === 0 && (
          <p className="px-3 py-2 text-xs text-[#7ab0ff]">No projects yet</p>
        )}
        <Link href="/dashboard/projects"
          className="flex items-center px-3 py-2 rounded-md text-sm text-[#7ab0ff] hover:bg-[#0052cc]/50 hover:text-white transition-colors font-medium">
          All Projects →
        </Link>
      </nav>
    </div>
  );
}
