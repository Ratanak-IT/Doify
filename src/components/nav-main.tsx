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
    <div className="px-3">
      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                isActive ? "bg-[#F0EDFF] text-[#6C5CE7] font-semibold" : "text-[#64748B] hover:bg-[#F8F8FC] hover:text-[#344054]"
              }`}>
              <Icon size={17} className={isActive ? "text-[#6C5CE7]" : "text-[#94A3B8] group-hover:text-[#64748B]"} />
              <span className="flex-1">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
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
