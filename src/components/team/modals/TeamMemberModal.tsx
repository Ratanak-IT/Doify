// TeamMemberModal.tsx
"use client";

import { X } from "lucide-react";
import { getAvatarColor, getInitials } from "@/lib/features/team/team.utils";
import type { TeamMember } from "@/lib/features/types/task-type";

type Props = {
  member: TeamMember;
  isCurrentUserOwner: boolean;
  currentUserId: string;
  onClose: () => void;
  onRoleChange: (memberId: string, role: "OWNER" | "ADMIN" | "MEMBER") => void;
  onRemoveMember: (userId: string, name: string) => void;
};

export default function TeamMemberModal({
  member,
  isCurrentUserOwner,
  currentUserId,
  onClose,
  onRoleChange,
  onRemoveMember,
}: Props) {
  const { user, role } = member;
  const name = user.fullName || user.username || "User";
  const isSelf = user.id === currentUserId;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between">
          <h3 className="text-lg font-semibold">Member Profile</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-2xl text-5xl font-bold flex items-center justify-center text-white mb-4"
            style={{ backgroundColor: getAvatarColor(user.id) }}
          >
            {getInitials(name)}
          </div>
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-slate-500">@{user.username}</p>

          <div className="mt-8 w-full">
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Role</label>
            <select
              defaultValue={role}
              onChange={(e) => onRoleChange(member.id, e.target.value as any)}
              disabled={!isCurrentUserOwner || isSelf}
              className="w-full px-4 py-3 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-60"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
        </div>

        {isCurrentUserOwner && !isSelf && (
          <div className="p-6 border-t dark:border-slate-700">
            <button
              onClick={() => onRemoveMember(user.id, name)}
              className="w-full py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-medium"
            >
              Remove from Team
            </button>
          </div>
        )}
      </div>
    </div>
  );
}