"use client";

import { useRouter } from "next/navigation";
import { useGetTeamByIdQuery } from "@/lib/features/team/teamApi";
import TeamDetailView from "@/components/team/TeamDetailView";

export default function TeamDetailPage({ params }: { params: { teamId: string } }) {
  const router = useRouter();
  const { teamId } = params;
  const { data: team, isLoading, isError } = useGetTeamByIdQuery(teamId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Loading team…
        </div>
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-semibold text-slate-900">Team not found</p>
        <p className="mt-2 text-sm text-slate-500">Unable to locate that team. Try returning to the team list.</p>
        <button
          onClick={() => router.push("/dashboard/team")}
          className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Back to teams
        </button>
      </div>
    );
  }

  return <TeamDetailView team={team} idx={0} onBack={() => router.push("/dashboard/team")} />;
}
