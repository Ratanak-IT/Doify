"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

type Status = "loading" | "success" | "error" | "login_required";

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { token: authToken, isAuthenticated } = useAppSelector(
    (s) => s.auth
  );

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid invitation link.");
      return;
    }

    if (!isAuthenticated || !authToken) {
      // save token in sessionStorage so we can resume after login
      sessionStorage.setItem("pending_invite_token", token);
      setStatus("login_required");
      return;
    }

    const accept = async () => {
      try {
        const res = await fetch(
          `/api/teams/invitations/accept?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data?.message ?? "Failed to accept invitation.");
        } else {
          setTeamName(data?.teamName ?? "");
          setStatus("success");
          setTimeout(() => router.push("/dashboard/team"), 2500);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    accept();
  }, [token, isAuthenticated, authToken, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500" />

          <div className="p-8 flex flex-col items-center text-center gap-6">
            {/* Logo mark */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
            </div>

            {/* ── LOADING ── */}
            {status === "loading" && (
              <>
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-violet-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white mb-1">Accepting invitation…</h1>
                  <p className="text-slate-400 text-sm">Please wait a moment</p>
                </div>
              </>
            )}

            {/* ── SUCCESS ── */}
            {status === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white mb-1">
                    You&apos;re in! 🎉
                  </h1>
                  <p className="text-slate-400 text-sm">
                    {teamName
                      ? `You have successfully joined "${teamName}".`
                      : "You have successfully joined the team."}
                  </p>
                  <p className="text-slate-500 text-xs mt-3">
                    Redirecting to your team page…
                  </p>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full animate-[grow_2.5s_ease-in-out_forwards]" />
                </div>
              </>
            )}

            {/* ── ERROR ── */}
            {status === "error" && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white mb-1">Invitation failed</h1>
                  <p className="text-slate-400 text-sm">{message}</p>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 h-11 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </>
            )}

            {/* ── LOGIN REQUIRED ── */}
            {status === "login_required" && (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white mb-1">Login required</h1>
                  <p className="text-slate-400 text-sm">
                    Please login first to accept this invitation. We&apos;ll bring you right back.
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push(
                      `/login?redirect=${encodeURIComponent(
                        `/invitations/accept?token=${token}`
                      )}`
                    )
                  }
                  className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Login to continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          TaskFlow · Team Collaboration Platform
        </p>
      </div>

      <style jsx>{`
        @keyframes grow {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}