"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, RefreshCw, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} from "@/lib/features/notifications/notificationsApi";
import { useAcceptInvitationMutation } from "@/lib/features/team/teamApi";
import type { Notification } from "@/lib/features/types/task-type";

const TYPE_STYLE: Record<string, { bg: string; dot: string }> = {
  TASK_ASSIGNED:       { bg: "bg-blue-50",   dot: "bg-blue-500" },
  DUE_DATE_REMINDER:   { bg: "bg-orange-50", dot: "bg-orange-500" },
  OVERDUE_TASK:        { bg: "bg-red-50",    dot: "bg-red-500" },
  MENTIONED_IN_COMMENT:{ bg: "bg-yellow-50", dot: "bg-yellow-500" },
  INVITATION_ACCEPTED: { bg: "bg-green-50",  dot: "bg-green-500" },
  COMMENT_ADDED:       { bg: "bg-purple-50", dot: "bg-purple-500" },
  PROJECT_UPDATED:     { bg: "bg-cyan-50",   dot: "bg-cyan-500" },
  TEAM_INVITATION:     { bg: "bg-indigo-50", dot: "bg-indigo-500" },
};

function getNotificationHref(notif: Notification) {
  const referenceType = String(notif.referenceType ?? "").trim().toLowerCase();
  const referenceId = notif.referenceId ? encodeURIComponent(notif.referenceId) : null;

  if (referenceType === "team") {
    return referenceId ? `/dashboard/team/${referenceId}` : "/dashboard/team";
  }

  if (referenceType === "project") {
    return "/dashboard/projects";
  }

  if (referenceType === "task") {
    return referenceId ? `/dashboard/tasks?taskId=${referenceId}` : "/dashboard/tasks";
  }

  if (referenceType === "comment") {
    return "/dashboard/tasks";
  }

  if (notif.type === "TEAM_INVITATION") return "/dashboard/team";
  if (notif.type === "PROJECT_UPDATED") return "/dashboard/projects";
  if (notif.type === "TASK_ASSIGNED" || notif.type === "DUE_DATE_REMINDER" || notif.type === "OVERDUE_TASK") {
    return referenceId ? `/dashboard/tasks?taskId=${referenceId}` : "/dashboard/tasks";
  }
  if (notif.type === "MENTIONED_IN_COMMENT" || notif.type === "COMMENT_ADDED") {
    return referenceId ? `/dashboard/team?taskId=${referenceId}` : "/dashboard/team";
  }

  return "/dashboard/notifications";
}

function Skeleton() {
  return (
    <div className="animate-pulse flex gap-3 p-4">
      <div className="w-2 h-2 rounded-full bg-[#f3f4f6] mt-1.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-[#f3f4f6] rounded w-3/4" />
        <div className="h-3 bg-[#f3f4f6] rounded w-1/2" />
      </div>
    </div>
  );
}

function NotifCard({
  notif,
  onClick,
  onAcceptInvite,
}: {
  notif: Notification;
  onClick: () => void;
  onAcceptInvite: (invitationId: string, notifId: string) => void;
}) {
  const style = TYPE_STYLE[notif.type] ?? { bg: "bg-slate-50", dot: "bg-slate-400" };
  const [accepting, setAccepting] = useState(false);

  const timeAgo = (iso: string) => {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
    return `${Math.round(mins / 1440)}d ago`;
  };

  const isInvite = notif.type === "TEAM_INVITATION";

  return (
    <div
      className={`group rounded-3xl border p-5 transition-all ${
        notif.isRead ? "border-slate-200 bg-white shadow-sm" : "border-transparent bg-slate-50 shadow-md"
      } hover:-translate-y-0.5 hover:shadow-lg cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 ${notif.isRead ? "bg-slate-300" : style.dot}`} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {notif.type.replace(/_/g, " ")}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.bg} ${style.dot === "bg-slate-400" ? "text-slate-700" : "text-slate-800"}`}>
              {notif.referenceType ? notif.referenceType : notif.type.toLowerCase()}
            </span>
          </div>
          <p className={`text-sm leading-6 ${notif.isRead ? "text-slate-500" : "text-slate-950 font-semibold"}`}>
            {notif.message}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>{timeAgo(notif.createdAt)}</span>
            {notif.referenceId && <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500">ID: {notif.referenceId}</span>}
          </div>

          {isInvite && notif.referenceId && !notif.isRead && (
            <button
              disabled={accepting}
              onClick={async (e) => {
                e.stopPropagation();
                setAccepting(true);
                await onAcceptInvite(notif.referenceId!, notif.id);
                setAccepting(false);
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#615fff] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#4f46e5] disabled:opacity-60 transition-colors"
            >
              <UserPlus size={13} />
              {accepting ? "Accepting…" : "Accept Invitation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { data: pageData, isLoading, isError, refetch } = useGetNotificationsQuery({ page, size: 20 });
  const notifications: Notification[] = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 1;
  const [markAllRead] = useMarkAllReadMutation();
  const [markRead] = useMarkReadMutation();
  const [acceptInvitation] = useAcceptInvitationMutation();

  // FIX: use `isRead` not `read`
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const displayed = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const handleAcceptInvite = async (invitationId: string, notifId: string) => {
    await acceptInvitation(invitationId);
    await markRead(notifId);
  };

  const handleCardClick = async (notif: Notification) => {
    if (!notif.isRead) {
      try {
        await markRead(notif.id);
      } catch {
        // swallow errors and continue navigation
      }
    }
    router.push(getNotificationHref(notif));
  };

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Notification center
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Bell size={20} className="text-slate-700 dark:text-slate-200" />
            <div>
              <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Notifications</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Stay on top of your tasks, teams, and comments.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Filtered view</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{filter === "all" ? "All notifications" : "Unread notifications"}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(["all", "unread"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      filter === f
                        ? "bg-slate-950 text-white shadow-sm dark:bg-slate-200 dark:text-slate-950"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {f === "all" ? "All" : "Unread"}
                    {f === "unread" && unreadCount > 0 && (
                      <span className="ml-2 inline-flex h-6 items-center justify-center rounded-full bg-[#615fff] px-2 text-[11px] font-semibold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center justify-between">
              Failed to load notifications.
              <button onClick={() => refetch()} className="font-semibold underline">Retry</button>
            </div>
          )}

          <div className="space-y-2">
            {isLoading
              ? Array(5).fill(0).map((_, i) => <Skeleton key={i} />)
              : displayed.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Bell size={32} className="text-[#e5e7eb] mb-3" />
                    <p className="text-sm font-medium text-[#374151]">
                      {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                    </p>
                  </div>
                )
                : displayed.map((n) => (
                    <NotifCard
                      key={n.id}
                      notif={n}
                      onClick={() => handleCardClick(n)}
                      onAcceptInvite={handleAcceptInvite}
                    />
                  ))
            }
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-8 h-8 rounded-lg border border-[#e5e7eb] flex items-center justify-center text-[#6a7282] hover:bg-[#f9fafb] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm text-[#6a7282]">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 rounded-lg border border-[#e5e7eb] flex items-center justify-center text-[#6a7282] hover:bg-[#f9fafb] disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}