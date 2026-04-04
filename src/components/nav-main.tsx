"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, Bell } from "lucide-react";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";

const navItems = [
  { label: "Dashboard",     href: "/dashboard",               icon: LayoutDashboard },
  { label: "Projects",      href: "/dashboard/projects",      icon: FolderKanban },
  { label: "My Tasks",      href: "/dashboard/tasks",         icon: CheckSquare },
  { label: "Team",          href: "/dashboard/team",          icon: Users },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: true },
  { label: "Settings",      href: "/dashboard/settings",      icon: Settings },
];

export function NavMain() {
  const pathname = usePathname();
  const { data: unread } = useGetUnreadCountQuery();
  const unreadCount = unread?.count ?? 0;

  return (
    <div className="px-2">
      <p className="px-3 text-[10px] font-bold text-[#7ab0ff] mb-1.5 uppercase tracking-wider">Platform</p>
      <nav className="space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group ${
                isActive ? "bg-[#0052cc] text-white font-semibold" : "text-[#b8d4ff] hover:bg-[#0052cc]/50 hover:text-white"
              }`}>
              <Icon size={15} className={isActive ? "text-white" : "text-[#7ab0ff] group-hover:text-white"} />
              <span className="flex-1">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="bg-[#de350b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
