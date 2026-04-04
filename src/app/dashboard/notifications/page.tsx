"use client";

import { useState } from "react";
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
  onRead,
  onAcceptInvite,
}: {
  notif: Notification;
  onRead: (id: string) => void;
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
      className={`flex gap-3 p-4 rounded-xl border transition-all ${
        // FIX: API field is `isRead`, not `read`
        notif.isRead ? "bg-white border-[#f3f4f6]" : `${style.bg} border-transparent`
      } ${!isInvite ? "cursor-pointer hover:shadow-sm" : ""}`}
      onClick={() => {
        if (!isInvite && !notif.isRead) onRead(notif.id);
      }}
    >
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.isRead ? "bg-[#e5e7eb]" : style.dot}`} />
      <div className="flex-1 min-w-0">
        {/* FIX: API has only `message` — no separate `title` field */}
        <p className={`text-sm leading-snug ${notif.isRead ? "text-[#6a7282]" : "text-[#0a0a0a] font-medium"}`}>
          {notif.message}
        </p>
        <p className="text-[10px] text-[#9ca3af] mt-1">{timeAgo(notif.createdAt)}</p>

        {/* Accept button for TEAM_INVITATION — referenceId is the invitation id */}
        {isInvite && notif.referenceId && !notif.isRead && (
          <button
            disabled={accepting}
            onClick={async (e) => {
              e.stopPropagation();
              setAccepting(true);
              await onAcceptInvite(notif.referenceId!, notif.id);
              setAccepting(false);
            }}
            className="mt-2 flex items-center gap-1.5 h-7 px-3 rounded-lg bg-[#615fff] text-white text-xs font-semibold hover:bg-[#4f46e5] disabled:opacity-60 transition-colors"
          >
            <UserPlus size={11} />
            {accepting ? "Accepting…" : "Accept Invitation"}
          </button>
        )}
      </div>
      {!notif.isRead && !isInvite && (
        <div className="shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[#615fff] mt-1.5" />
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
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
    // Also mark the notification as read after accepting
    await markRead(notifId);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-[#374151]" />
          <h1 className="text-lg font-semibold text-[#0a0a0a]">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-[#fb2c36] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="w-9 h-9 rounded-lg border border-[#e5e7eb] flex items-center justify-center text-[#6a7282] hover:bg-[#f9fafb] transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#e5e7eb] text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Filter tabs */}
          <div className="flex gap-1 bg-[#f3f4f6] p-1 rounded-xl w-fit">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 h-7 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f ? "bg-white text-[#0a0a0a] shadow-sm" : "text-[#6a7282] hover:text-[#374151]"
                }`}
              >
                {f}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 bg-[#615fff] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
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
                      onRead={(id) => markRead(id)}
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