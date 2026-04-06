"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  ChevronRight,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import {
  useGetDashboardStatsQuery,
  useGetPersonalTasksQuery,
  useGetRecentActivityQuery,
  useGetProjectsQuery,
} from "@/lib/features/tasks/taskApi";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";
import { StatCard } from "@/components/Card";
import { TextCard } from "@/components/TextCard";
import { NewTaskModal } from "@/components/forms/NewTaskModal";

const chartData = [
  { day: "Mon", completed: 24, created: 27 },
  { day: "Tue", completed: 32, created: 30 },
  { day: "Wed", completed: 28, created: 35 },
  { day: "Thu", completed: 40, created: 38 },
  { day: "Fri", completed: 36, created: 42 },
  { day: "Sat", completed: 45, created: 30 },
  { day: "Sun", completed: 38, created: 32 },
];

function TaskActivityChart() {
  const W = 680,
    H = 220,
    PAD = { top: 20, right: 10, bottom: 40, left: 40 };
  const maxVal = 60;
  const xStep = (W - PAD.left - PAD.right) / (chartData.length - 1);
  const yScale = (v: number) =>
    H - PAD.bottom - (v / maxVal) * (H - PAD.top - PAD.bottom);
  const toPath = (key: "completed" | "created") =>
    chartData
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${PAD.left + i * xStep} ${yScale(d[key])}`,
      )
      .join(" ");
  const toArea = (key: "completed" | "created") => {
    const pts = chartData
      .map((d, i) => `${PAD.left + i * xStep} ${yScale(d[key])}`)
      .join(" L ");
    const lastX = PAD.left + (chartData.length - 1) * xStep;
    return `M ${PAD.left} ${H - PAD.bottom} L ${pts} L ${lastX} ${H - PAD.bottom} Z`;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6C5CE7" stopOpacity=".15" />
          <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00a3bf" stopOpacity=".12" />
          <stop offset="100%" stopColor="#00a3bf" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 15, 30, 45, 60].map((t) => (
        <g key={t}>
          <line
            x1={PAD.left}
            y1={yScale(t)}
            x2={W - PAD.right}
            y2={yScale(t)}
            stroke="#F1F5F9"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 6}
            y={yScale(t) + 4}
            fontSize="11"
            fill="#94A3B8"
            textAnchor="end"
          >
            {t}
          </text>
        </g>
      ))}
      {chartData.map((d, i) => (
        <text
          key={d.day}
          x={PAD.left + i * xStep}
          y={H - PAD.bottom + 16}
          fontSize="11"
          fill="#94A3B8"
          textAnchor="middle"
        >
          {d.day}
        </text>
      ))}
      <path d={toArea("completed")} fill="url(#gC)" />
      <path d={toArea("created")} fill="url(#gR)" />
      <path
        d={toPath("completed")}
        fill="none"
        stroke="#6C5CE7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {chartData.map((d, i) => (
        <circle
          key={`c${i}`}
          cx={PAD.left + i * xStep}
          cy={yScale(d.completed)}
          r="4"
          fill="#fff"
          stroke="#6C5CE7"
          strokeWidth="2"
        />
      ))}
      <path
        d={toPath("created")}
        fill="none"
        stroke="#00a3bf"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {chartData.map((d, i) => (
        <circle
          key={`r${i}`}
          cx={PAD.left + i * xStep}
          cy={yScale(d.created)}
          r="4"
          fill="#fff"
          stroke="#00a3bf"
          strokeWidth="2"
        />
      ))}
      <g transform={`translate(${W / 2 - 80}, ${H - 6})`}>
        <circle cx="6" cy="0" r="5" fill="#6C5CE7" />
        <text x="14" y="4" fontSize="11" fill="#6C5CE7" fontWeight="600">
          Completed
        </text>
        <circle cx="92" cy="0" r="5" fill="#00a3bf" />
        <text x="100" y="4" fontSize="11" fill="#00a3bf" fontWeight="600">
          Created
        </text>
      </g>
    </svg>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#F1F5F9] rounded-lg ${className}`} />
  );
}

const PRIORITY_LABEL: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600 border border-slate-200",
  MEDIUM: "bg-orange-50 text-orange-600 border border-orange-200",
  HIGH:   "bg-red-50    text-red-600   border border-red-200",
  URGENT: "bg-red-100   text-red-800   border border-red-300",
};

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const today = mounted
    ? new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: activity, isLoading: activityLoading } =
    useGetRecentActivityQuery();
  const { data: projectsPage, isLoading: projectsLoading } =
    useGetProjectsQuery({});
  const projects = projectsPage?.content ?? [];
  const { data: myTasksPage, isLoading: tasksLoading } =
    useGetPersonalTasksQuery({ status: "IN_PROGRESS" });
  const myTasks = myTasksPage?.content ?? [];
  const { data: unread } = useGetUnreadCountQuery();

  const unreadCount = unread?.count ?? 0;
  useEffect(() => {
    setMounted(true);
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Tasks",
          value: stats.totalTasks,
          change: stats.totalTasksChange,
          changeLabel: "from last week",
          trend: "up" as const,
          icon: <ListTodo size={18} className="text-[#6C5CE7]" />,
          iconBg: "bg-[#F0EDFF]",
        },
        {
          label: "In Progress",
          value: stats.inProgress,
          change: stats.inProgressChange,
          changeLabel: "from yesterday",
          trend: "up" as const,
          icon: <Clock size={18} className="text-[#F59E0B]" />,
          iconBg: "bg-[#FEF9C3]",
        },
        {
          label: "Completed",
          value: stats.completed,
          change: stats.completedChange,
          changeLabel: "",
          trend: "up" as const,
          icon: <CheckCircle2 size={18} className="text-[#10B981]" />,
          iconBg: "bg-[#D1FAE5]",
        },
        {
          label: "Overdue",
          value: stats.overdue,
          change: stats.overdueChange,
          changeLabel: "",
          trend: "down" as const,
          icon: <AlertTriangle size={18} className="text-[#EF4444]" />,
          iconBg: "bg-[#FEE2E2]",
        },
      ]
    : [];

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E8E8EF] flex items-center justify-end px-6 gap-3 shrink-0">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#6C5CE7] text-white text-sm font-semibold hover:bg-[#5B4BD5] transition-colors"
        >
          <Plus size={15} /> New Task
        </button>
        <Link
          href="/dashboard/notifications"
          className="relative w-9 h-9 rounded-lg border border-[#E8E8EF] flex items-center justify-center hover:bg-[#F8F8FC] transition-colors"
        >
          <Bell size={16} className="text-[#64748B]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-semibold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </header>

      <main className="flex-1 overflow-auto p-6 bg-[#F8F9FC]">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Greeting */}
          <div className="bg-white rounded-xl border border-[#E8E8EF] px-6 py-5 flex items-center justify-between shadow-sm">
            <div>
              <h1 className="text-[22px] font-bold text-[#1E293B] leading-tight">
                Good morning,{" "}
                {mounted ? (user?.name?.split(" ")[0] ?? "there") : "there"} 👋
              </h1>
              <p className="text-sm text-[#94A3B8] mt-0.5">{today}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => <Skeleton key={i} className="h-[140px]" />)
              : statCards.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          <TextCard
            title="Task Activity"
            description="Tasks created vs completed this week"
          >
            <TaskActivityChart />
          </TextCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Projects */}
            <TextCard
              title="Projects"
              action={
                <Link
                  href="/dashboard/projects"
                  className="flex items-center gap-1 text-sm text-[#6C5CE7] font-semibold hover:underline"
                >
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {projectsLoading ? (
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-10" />
                    ))}
                </div>
              ) : (projects ?? []).length === 0 ? (
                <p className="text-sm text-[#94A3B8] py-4 text-center">
                  No projects yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {(projects ?? [])
                    .slice(0, 4)
                    .map(({ id, name, color, progress }) => (
                      <div key={id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-sm shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-[#1E293B]">
                              {name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-[#64748B]">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#E8E8EF] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TextCard>

            {/* My Tasks */}
            <TextCard
              title="My Tasks"
              action={
                <Link
                  href="/dashboard/tasks"
                  className="flex items-center gap-1 text-sm text-[#6C5CE7] font-semibold hover:underline"
                >
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {tasksLoading ? (
                <div className="space-y-3">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                </div>
              ) : (myTasks ?? []).length === 0 ? (
                <p className="text-sm text-[#94A3B8] py-4 text-center">
                  No tasks in progress.
                </p>
              ) : (
                <div className="space-y-3">
                  {(myTasks ?? []).slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="border border-[#E8E8EF] rounded-xl p-4 space-y-3 hover:border-[#D1D5DB] transition-colors bg-[#F8F9FC]"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#1E293B]">
                          {task.title}
                        </h4>
                        <button className="text-[#94A3B8] hover:text-[#64748B]">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${PRIORITY_LABEL[task.priority] ?? ""}`}
                        >
                          {task.priority.toLowerCase()}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-[#94A3B8] ml-auto">
                            <Calendar size={11} />{" "}
                            {new Date(task.dueDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {(task.assignees ?? []).slice(0, 3).map((a, i) => (
                          <div
                            key={a.id}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-medium ring-2 ring-white"
                            style={{
                              backgroundColor: a.color,
                              marginLeft: i > 0 ? "-6px" : "0",
                            }}
                          >
                            {a.initials}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TextCard>
          </div>

          {/* Recent Activity */}
          <TextCard title="Recent Activity">
            {activityLoading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
              </div>
            ) : (activity ?? []).length === 0 ? (
              <p className="text-sm text-[#94A3B8] py-4 text-center">
                No recent activity.
              </p>
            ) : (
              <div className="divide-y divide-[#F1F5F9]">
                {(activity ?? []).map((item) => {
                  const mins = mounted
                    ? Math.round(
                        (Date.now() - new Date(item.createdAt).getTime()) /
                          60000,
                      )
                    : 0;
                  const timeStr =
                    mins < 1
                      ? "just now"
                      : mins < 60
                        ? `${mins}m ago`
                        : mins < 1440
                          ? `${Math.round(mins / 60)}h ago`
                          : `${Math.round(mins / 1440)}d ago`;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-medium"
                        style={{ backgroundColor: item.user.color }}
                      >
                        {item.user.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#1E293B]">
                          <span className="font-semibold">
                            {item.user.name}
                          </span>{" "}
                          <span className="text-[#64748B]">{item.action}</span>{" "}
                          <span className="font-semibold">{item.target}</span>
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          {timeStr}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TextCard>
        </div>
      </main>

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} />}
    </>
  );
}
