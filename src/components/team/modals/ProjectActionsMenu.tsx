"use client";

import { Edit2, Trash2 } from "lucide-react";
import type { Project } from "@/lib/features/types/task-type";

type Props = {
  project: Project;
  isOwner: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onClose: () => void;
};

export default function ProjectActionsMenu({
  project,
  isOwner,
  onEdit,
  onDelete,
  onClose,
}: Props) {
  return (
    <div className="absolute right-4 top-12 bg-white dark:bg-slate-800 shadow-xl border dark:border-slate-700 rounded-xl py-1 w-48 z-50 text-sm">
      <button
        onClick={() => {
          onEdit(project);
          onClose();
        }}
        className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
      >
        <Edit2 size={16} />
        Edit Project
      </button>

      {isOwner && (
        <button
          onClick={() => {
            onDelete(project);
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-500 text-left"
        >
          <Trash2 size={16} />
          Delete Project
        </button>
      )}
    </div>
  );
}