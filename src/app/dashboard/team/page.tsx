"use client";

import { useState } from "react";
import {
  Plus, Search, Mail, MoreHorizontal, RefreshCw,
  X, UserPlus, Shield, Trash2, Edit2,
} from "lucide-react";
import {
  useGetTeamsQuery,
  useGetTeamMembersQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useInviteMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} from "@/lib/features/team/teamApi";
import type { Team, TeamMember } from "@/lib/features/types/task-type";
import { createTeamSchema, updateTeamSchema, inviteMemberSchema } from "@/lib/schemas";

/* ── Avatar Helpers ─────────────────────────────────────────────── */
// `initials` and `color` are not in the API — derive them from UserResponse.
const AVATAR_PALETTE = [
  "#0052cc", "#00875a", "#ff5630", "#6554c0",
  "#ff991f", "#00b8d9", "#36b37e", "#de350b",
];

function getInitials(fullName: string): string {
  return (fullName ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < (seed ?? "").length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/* ── Constants ──────────────────────────────────────────────────── */
// `status` is not in the API — omit the status dot entirely.
function Skeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-4 rounded-xl bg-[#f9fafb]">
      <div className="w-10 h-10 rounded-full bg-[#e5e7eb]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-[#e5e7eb] rounded w-1/3" />
        <div className="h-3 bg-[#e5e7eb] rounded w-1/2" />
      </div>
    </div>
  );
}

/* ── Create Team Modal ──────────────────────────────────────────── */
function CreateTeamModal({ onClose }: { onClose: () => void }) {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setApiError("");

    const result = createTeamSchema.safeParse(form);
    if (!result.success) {
      const fe: { name?: string; description?: string } = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as "name" | "description";
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe); return;
    }

    try {
      await createTeam({ name: result.data.name, description: result.data.description }).unwrap();
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to create team.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f3f4f6]">
          <h2 className="text-base font-semibold text-[#0a0a0a]">Create Team</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f4f6] transition-colors"><X size={15} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">{apiError}</p>}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Team name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dev Team Alpha"
              className={`w-full h-10 px-3 rounded-lg border text-sm outline-none bg-white transition-colors ${errors.name ? "border-red-400" : "border-[#e5e7eb] focus:border-[#615fff]"}`} />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2} placeholder="What does this team do?"
              className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm outline-none focus:border-[#615fff] bg-white resize-none transition-colors" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 h-9 rounded-lg border border-[#e5e7eb] text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 h-9 rounded-lg bg-[#615fff] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors disabled:opacity-60">
              {isLoading ? "Creating…" : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Edit Team Modal ────────────────────────────────────────────── */
function EditTeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const [updateTeam, { isLoading }] = useUpdateTeamMutation();
  const [form, setForm] = useState({ name: team.name, description: team.description ?? "" });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setApiError("");

    const result = updateTeamSchema.safeParse(form);
    if (!result.success) {
      const fe: { name?: string } = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as "name";
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe); return;
    }

    try {
      await updateTeam({ id: team.id, data: result.data }).unwrap();
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to update team.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f3f4f6]">
          <h2 className="text-base font-semibold text-[#0a0a0a]">Edit Team</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f4f6] transition-colors"><X size={15} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">{apiError}</p>}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Team name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full h-10 px-3 rounded-lg border text-sm outline-none bg-white transition-colors ${errors.name ? "border-red-400" : "border-[#e5e7eb] focus:border-[#615fff]"}`} />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2} className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm outline-none focus:border-[#615fff] bg-white resize-none transition-colors" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 h-9 rounded-lg border border-[#e5e7eb] text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 h-9 rounded-lg bg-[#615fff] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors disabled:opacity-60">
              {isLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Invite Modal ───────────────────────────────────────────────── */
function InviteModal({ onClose }: { onClose: () => void }) {
  const { data: teamsPage } = useGetTeamsQuery({});
  const teams = teamsPage?.content ?? [];
  const [inviteMember, { isLoading }] = useInviteMemberMutation();
  const [form, setForm] = useState({ email: "", role: "MEMBER" as "MEMBER" | "ADMIN", teamId: teams[0]?.id ?? "" });
  const [errors, setErrors] = useState<Partial<Record<"email" | "role" | "teamId", string>>>({});
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = inviteMemberSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<"email" | "role" | "teamId", string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as "email" | "role" | "teamId";
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe); return;
    }

    try {
      await inviteMember({ teamId: result.data.teamId, email: result.data.email, role: result.data.role }).unwrap();
      setMsg({ text: "Invitation sent!", ok: true });
      setTimeout(onClose, 1500);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setMsg({ text: e?.data?.message ?? "Failed to send invitation", ok: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f3f4f6]">
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-[#615fff]" />
            <h2 className="text-base font-semibold text-[#0a0a0a]">Invite Member</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f4f6] transition-colors"><X size={15} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {msg && (
            <p className={`text-sm p-3 rounded-lg border ${msg.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>{msg.text}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Email address *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="teammate@company.com"
              className={`w-full h-10 px-3 rounded-lg border text-sm outline-none bg-white transition-colors ${errors.email ? "border-red-400" : "border-[#e5e7eb] focus:border-[#615fff]"}`} />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          {teams.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Team *</label>
              <select value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                className={`w-full h-10 px-3 rounded-lg border text-sm outline-none bg-white appearance-none ${errors.teamId ? "border-red-400" : "border-[#e5e7eb] focus:border-[#615fff]"}`}>
                <option value="">Select a team</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {errors.teamId && <p className="text-xs text-red-600 mt-1">{errors.teamId}</p>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "MEMBER" | "ADMIN" })}
              className="w-full h-10 px-3 rounded-lg border border-[#e5e7eb] text-sm outline-none focus:border-[#615fff] bg-white appearance-none">
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 h-9 rounded-lg border border-[#e5e7eb] text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 h-9 rounded-lg bg-[#615fff] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors disabled:opacity-60">
              {isLoading ? "Sending…" : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Member Row ─────────────────────────────────────────────────── */
function MemberRow({ member, teamId }: { member: TeamMember; teamId: string }) {
  const [updateRole] = useUpdateMemberRoleMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [menuOpen, setMenuOpen] = useState(false);

  // FIX: API nests user info under `member.user` (UserResponse).
  // Derive initials and color since the API doesn't provide them.
  const displayName = member.user?.fullName ?? member.user?.username ?? "Unknown";
  const email       = member.user?.email ?? "";
  const initials    = getInitials(displayName);
  const color       = getAvatarColor(member.user?.id ?? member.id);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#f9fafb] transition-colors group">
      {/* Avatar — no status dot since API has no `status` field */}
      <div className="shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0a0a0a] truncate">{displayName}</p>
        <p className="text-xs text-[#6a7282] flex items-center gap-1 truncate">
          <Mail size={10} /> {email}
        </p>
      </div>

      {/* tasksOpen / tasksDone are not in the API — omitted */}

      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
        member.role === "ADMIN" || member.role === "OWNER"
          ? "bg-[#ede9fe] text-[#6d28d9]"
          : "bg-[#f3f4f6] text-[#6a7282]"
      }`}>
        {member.role}
      </span>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-7 h-7 flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f4f6] rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal size={14} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-[#e5e7eb] py-1 min-w-[150px]">
              {/* Only allow toggling between ADMIN and MEMBER (not OWNER) */}
              {member.role !== "OWNER" && (
                <button
                  onClick={() => {
                    updateRole({
                      teamId,
                      memberId: member.id,
                      role: member.role === "ADMIN" ? "MEMBER" : "ADMIN",
                    });
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-[#f9fafb]"
                >
                  <Shield size={13} /> {member.role === "ADMIN" ? "Make Member" : "Make Admin"}
                </button>
              )}
              <button
                onClick={() => {
                  // FIX: API uses member.id (membership record id) for removal,
                  // not member.user.id. The removeMember endpoint is
                  // DELETE /teams/{teamId}/members/{userId} where userId is the
                  // membership record id returned by the API.
                  if (confirm(`Remove ${displayName} from team?`)) {
                    removeMember({ teamId, userId: member.id });
                  }
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function TeamPage() {
  const [search, setSearch]     = useState("");
  const [showInvite, setInvite] = useState(false);
  const [showCreate, setCreate] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [activeTeam, setActive] = useState<string | null>(null);

  const { data: teamsPage, isLoading: teamsLoading, refetch: refetchTeams } = useGetTeamsQuery({});
  const teams = teamsPage?.content ?? [];
  const [deleteTeam] = useDeleteTeamMutation();

  const selectedTeamId = activeTeam ?? teams[0]?.id ?? null;
  const { data: membersPage, isLoading: membersLoading } = useGetTeamMembersQuery(
    { teamId: selectedTeamId! },
    { skip: !selectedTeamId }
  );
  const members: TeamMember[] = membersPage?.content ?? [];

  // FIX: filter on nested `member.user.fullName` / `member.user.email`
  // instead of the old flat `member.name` / `member.email`.
  const filtered = members.filter((m) => {
    const name  = (m.user?.fullName ?? m.user?.username ?? "").toLowerCase();
    const email = (m.user?.email ?? "").toLowerCase();
    const q     = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <>
      <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 shrink-0">
        <h1 className="text-lg font-semibold text-[#0a0a0a]">Team</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => refetchTeams()} className="w-9 h-9 rounded-lg border border-[#e5e7eb] flex items-center justify-center text-[#6a7282] hover:bg-[#f9fafb] transition-colors">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setCreate(true)} className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#e5e7eb] text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors">
            <Plus size={14} /> New Team
          </button>
          <button onClick={() => setInvite(true)} className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[#615fff] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors">
            <UserPlus size={14} /> Invite
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Teams list */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-[#6a7282] uppercase tracking-wide">Your Teams</h2>
          {teamsLoading
            ? <div className="animate-pulse h-12 bg-[#f3f4f6] rounded-xl" />
            : teams.length === 0
              ? <p className="text-sm text-[#9ca3af]">No teams yet. Create one to get started.</p>
              : (
                <div className="flex gap-2 flex-wrap">
                  {teams.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer group ${
                        selectedTeamId === t.id
                          ? "bg-[#615fff] border-[#615fff] text-white"
                          : "bg-white border-[#e5e7eb] text-[#374151] hover:border-[#615fff]"
                      }`}
                      onClick={() => setActive(t.id)}
                    >
                      <span className="text-sm font-medium">{t.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        selectedTeamId === t.id ? "bg-white/20 text-white" : "bg-[#f3f4f6] text-[#6a7282]"
                      }`}>
                        {t.memberCount}
                      </span>
                      <div className={`flex gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity ${selectedTeamId === t.id ? "opacity-100" : ""}`}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditTeam(t); }}
                          className={`w-5 h-5 flex items-center justify-center rounded ${
                            selectedTeamId === t.id ? "hover:bg-white/20 text-white" : "hover:bg-[#f3f4f6] text-[#6a7282]"
                          }`}
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (confirm(`Delete team "${t.name}"?`)) deleteTeam(t.id); }}
                          className={`w-5 h-5 flex items-center justify-center rounded ${
                            selectedTeamId === t.id ? "hover:bg-white/20 text-red-200" : "hover:bg-red-50 text-red-400"
                          }`}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
          }
        </div>

        {/* Members */}
        {selectedTeamId && (
          <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#0a0a0a]">
                  {teams.find((t) => t.id === selectedTeamId)?.name ?? "Members"}
                </h2>
                <p className="text-xs text-[#6a7282] mt-0.5">{filtered.length} member{filtered.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members…"
                  className="h-8 pl-8 pr-3 rounded-lg border border-[#e5e7eb] text-xs bg-white outline-none focus:border-[#615fff] transition-colors placeholder:text-[#9ca3af]"
                />
              </div>
            </div>
            <div className="divide-y divide-[#f3f4f6]">
              {membersLoading
                ? Array(3).fill(0).map((_, i) => <div key={i} className="px-5 py-2"><Skeleton /></div>)
                : filtered.length === 0
                  ? <p className="text-center text-sm text-[#9ca3af] py-10">No members found</p>
                  : filtered.map((m) => (
                      <div key={m.id} className="px-5">
                        <MemberRow member={m} teamId={selectedTeamId} />
                      </div>
                    ))
              }
            </div>
          </div>
        )}
      </main>

      {showCreate && <CreateTeamModal onClose={() => setCreate(false)} />}
      {editTeam   && <EditTeamModal team={editTeam} onClose={() => setEditTeam(null)} />}
      {showInvite && <InviteModal onClose={() => setInvite(false)} />}
    </>
  );
}