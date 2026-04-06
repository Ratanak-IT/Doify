"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  useCreateProjectTaskMutation,
  useCreatePersonalTaskMutation,
} from "@/lib/features/tasks/taskApi";

export default function CreateSubtaskModal({
  projectId,
  parentTaskId,
  onClose,
}: {
  projectId?: string;
  parentTaskId: string;
  onClose: () => void;
}) {
  const [createProjectTask, { isLoading: projectLoading }] = useCreateProjectTaskMutation();
  const [createPersonalTask, { isLoading: personalLoading }] = useCreatePersonalTaskMutation();
  const isLoading = projectLoading || personalLoading;

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!form.title.trim()) return;

    try {
      if (projectId) {
        await createProjectTask({
          projectId,
          title: form.title.trim(),
          description: form.description || undefined,
          priority: form.priority,
          dueDate: form.dueDate || undefined,
          parentTaskId,
        }).unwrap();
      } else {
        await createPersonalTask({
          title: form.title.trim(),
          description: form.description || undefined,
          priority: form.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
          dueDate: form.dueDate || undefined,
          parentTaskId,
        }).unwrap();
      }

      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to create subtask.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F1F5F9]">
          <h2 className="text-base font-bold text-[#1E293B]">
            New Subtask
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <p className="text-sm text-[#EF4444] bg-[#FEE2E2] border border-[#FECACA] p-3 rounded-lg">
              {apiError}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#64748B] mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Subtask title"
              className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] text-sm outline-none bg-white focus:border-[#6C5CE7] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#64748B] mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Subtask details…"
              className="w-full px-3 py-2.5 rounded-md border border-[#D1D5DB] text-sm outline-none focus:border-[#6C5CE7] bg-white resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#64748B] mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] text-sm outline-none focus:border-[#6C5CE7] bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#64748B] mb-1.5">Due date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] text-sm outline-none focus:border-[#6C5CE7] bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-md border border-[#D1D5DB] text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-9 rounded-md bg-[#6C5CE7] text-white text-sm font-semibold hover:bg-[#5B4BD5] transition-colors disabled:opacity-60"
            >
              {isLoading ? "Creating…" : "Create Subtask"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
