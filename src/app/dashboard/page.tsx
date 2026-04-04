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
          <stop offset="0%" stopColor="#0052cc" stopOpacity=".15" />
          <stop offset="100%" stopColor="#0052cc" stopOpacity="0" />
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
            stroke="#f1f2f4"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 6}
            y={yScale(t) + 4}
            fontSize="11"
            fill="#8993a4"
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
          fill="#8993a4"
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
        stroke="#0052cc"
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
          stroke="#0052cc"
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
        <circle cx="6" cy="0" r="5" fill="#0052cc" />
        <text x="14" y="4" fontSize="11" fill="#0052cc" fontWeight="600">
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
    <div className={`animate-pulse bg-[#f1f2f4] rounded-lg ${className}`} />
  );
}

const PRIORITY_LABEL: Record<string, string> = {
  low: "bg-slate-50  text-slate-600 border border-slate-200",
  medium: "bg-orange-50 text-orange-600 border border-orange-200",
  high: "bg-red-50    text-red-600   border border-red-200",
  critical: "bg-red-100   text-red-800   border border-red-300",
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
          icon: <ListTodo size={18} className="text-[#0052cc]" />,
          iconBg: "bg-[#e9f2ff]",
        },
        {
          label: "In Progress",
          value: stats.inProgress,
          change: stats.inProgressChange,
          changeLabel: "from yesterday",
          trend: "up" as const,
          icon: <Clock size={18} className="text-[#5e4db2]" />,
          iconBg: "bg-[#f3f0ff]",
        },
        {
          label: "Completed",
          value: stats.completed,
          change: stats.completedChange,
          changeLabel: "",
          trend: "up" as const,
          icon: <CheckCircle2 size={18} className="text-[#216e4e]" />,
          iconBg: "bg-[#dcfff1]",
        },
        {
          label: "Overdue",
          value: stats.overdue,
          change: stats.overdueChange,
          changeLabel: "",
          trend: "down" as const,
          icon: <AlertTriangle size={18} className="text-[#ae2e24]" />,
          iconBg: "bg-[#ffeceb]",
        },
      ]
    : [];

  return (
    <>
      <header className="h-16 bg-white border-b border-[#ebecf0] flex items-center justify-end px-6 gap-3 shrink-0">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-md bg-[#0052cc] text-white text-sm font-semibold hover:bg-[#0041a3] transition-colors"
        >
          <Plus size={15} /> New Task
        </button>
        <Link
          href="/dashboard/notifications"
          className="relative w-9 h-9 rounded-md border border-[#dfe1e6] flex items-center justify-center hover:bg-[#f4f5f7] transition-colors"
        >
          <Bell size={16} className="text-[#44526e]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#de350b] text-white text-[10px] font-semibold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </header>

      <main className="flex-1 overflow-auto p-6 bg-[#f4f5f7]">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Greeting */}
          <div className="bg-white rounded-xl border border-[#ebecf0] px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-[#172b4d] leading-tight">
                Good morning,{" "}
                {mounted ? (user?.name?.split(" ")[0] ?? "there") : "there"} 👋
              </h1>
              <p className="text-sm text-[#6b778c] mt-0.5">{today}</p>
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
                  className="flex items-center gap-1 text-sm text-[#0052cc] font-semibold hover:underline"
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
                <p className="text-sm text-[#97a0af] py-4 text-center">
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
                            <span className="text-sm font-medium text-[#172b4d]">
                              {name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-[#44526e]">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#ebecf0] overflow-hidden">
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
                  className="flex items-center gap-1 text-sm text-[#0052cc] font-semibold hover:underline"
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
                <p className="text-sm text-[#97a0af] py-4 text-center">
                  No tasks in progress.
                </p>
              ) : (
                <div className="space-y-3">
                  {(myTasks ?? []).slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="border border-[#ebecf0] rounded-xl p-4 space-y-3 hover:border-[#dfe1e6] transition-colors bg-[#fafbfc]"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#172b4d]">
                          {task.title}
                        </h4>
                        <button className="text-[#97a0af] hover:text-[#44526e]">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${PRIORITY_LABEL[task.priority] ?? ""}`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-[#6b778c] ml-auto">
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
              <p className="text-sm text-[#97a0af] py-4 text-center">
                No recent activity.
              </p>
            ) : (
              <div className="divide-y divide-[#f4f5f7]">
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
                        <p className="text-sm text-[#172b4d]">
                          <span className="font-semibold">
                            {item.user.name}
                          </span>{" "}
                          <span className="text-[#44526e]">{item.action}</span>{" "}
                          <span className="font-semibold">{item.target}</span>
                        </p>
                        <p className="text-xs text-[#8993a4] mt-0.5">
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
