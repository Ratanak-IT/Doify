"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";
import { LogOut, Settings, User, Bell } from "lucide-react";

export function NavUser() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: unread } = useGetUnreadCountQuery(undefined, {
    skip: !mounted,
  });
  const unreadCount = mounted ? (unread?.count ?? 0) : 0;

  const displayName = mounted ? (user?.name ?? "User") : "User";
  const displayEmail = mounted ? (user?.email ?? "") : "";
  const avatar = mounted ? user?.avatar : null;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="border-t border-[#0041a3] px-2 py-2 relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full rounded-md hover:bg-[#0052cc]/50 transition-colors p-2"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white text-xs font-bold overflow-hidden">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-white truncate leading-none">
            {displayName}
          </p>
          <p className="text-xs text-[#7ab0ff] truncate mt-0.5">
            {displayEmail}
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#de350b] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-2 right-2 bottom-full mb-1 bg-white border border-[#dfe1e6] rounded-xl shadow-xl z-20 py-1 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#f4f5f7]">
              <p className="text-sm font-semibold text-[#172b4d]">{displayName}</p>
              <p className="text-xs text-[#6b778c]">{displayEmail}</p>
            </div>

            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#44526e] hover:bg-[#f4f5f7] transition-colors"
            >
              <User size={14} /> Profile
            </Link>

            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#44526e] hover:bg-[#f4f5f7] transition-colors"
            >
              <Settings size={14} /> Settings
            </Link>

            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-[#44526e] hover:bg-[#f4f5f7] transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Bell size={14} /> Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-[#de350b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="border-t border-[#f4f5f7] mt-1" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#de350b] hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}