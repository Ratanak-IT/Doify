"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setCredentials, updateUser, logout } from "@/lib/features/auth/authSlice";
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/lib/features/profile/profileApi";
import { useLogoutApiMutation } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, LogOut, User, Lock, Bell, Settings } from "lucide-react";
import { updateProfileSchema, changePasswordSchema } from "@/lib/schemas";
import type { z } from "zod";

type Tab = "profile" | "security" | "notifications" | "workspace";

/* ── Profile Tab ─────────────────────────────────────────────────── */
type ProfileForm = z.infer<typeof updateProfileSchema>;

function ProfileTab() {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((s) => s.auth.user);
  const token    = useAppSelector((s) => s.auth.token);
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const [form, setForm] = useState<ProfileForm>({ fullName: "", username: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({ fullName: profile.fullName, username: profile.username, email: profile.email });
    } else if (user) {
      setForm((f) => ({ ...f, fullName: user.name, email: user.email }));
    }
  }, [profile, user]);

  const displayName = profile?.fullName ?? user?.name ?? "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSave = async () => {
    setErrors({}); setMsg(null);

    const result = updateProfileSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof ProfileForm, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof ProfileForm;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe); return;
    }

    try {
      const updated = await updateProfile(result.data).unwrap();
      if (user && token) {
        dispatch(setCredentials({ user: { ...user, name: updated.fullName, email: updated.email }, token }));
      }
      dispatch(updateUser({ name: result.data.fullName, email: result.data.email }));
      setMsg({ text: "Profile saved successfully!", ok: true });
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setMsg({ text: e?.data?.message ?? "Failed to save profile.", ok: false });
    }
    setTimeout(() => setMsg(null), 4000);
  };

  if (profileLoading) {
    return (
      <div className="space-y-4 max-w-lg animate-pulse">
        <div className="h-16 bg-[#f3f4f6] rounded-xl" />
        {Array(3).fill(0).map((_, i) => <div key={i} className="h-12 bg-[#f3f4f6] rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        {profile?.profilePhoto
          ? <img src={profile.profilePhoto} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-[#f3f4f6]" />
          : <div className="w-16 h-16 rounded-full bg-[#615fff] flex items-center justify-center text-white text-xl font-bold">{initials}</div>
        }
        <div>
          <p className="text-sm font-semibold text-[#0a0a0a]">{displayName}</p>
          <p className="text-xs text-[#9ca3af]">{profile?.email ?? user?.email}</p>
        </div>
      </div>

      {msg && (
        <p className={`text-sm p-3 rounded-lg border flex items-center gap-2 ${msg.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
          {msg.ok && <Check size={14} />} {msg.text}
        </p>
      )}

      {(["fullName", "username", "email"] as const).map((key) => {
        const labels: Record<typeof key, string> = { fullName: "Full name", username: "Username", email: "Email" };
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">{labels[key]}</label>
            <input
              type={key === "email" ? "email" : "text"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className={`w-full h-10 px-3 rounded-lg border text-sm outline-none bg-white transition-colors ${errors[key] ? "border-red-400" : "border-[#e5e7eb] focus:border-[#615fff]"}`}
            />
            {errors[key] && <p className="text-xs text-red-600 mt-1">{errors[key]}</p>}
          </div>
        );
      })}

      <button onClick={handleSave} disabled={saving}
        className="h-9 px-6 rounded-lg bg-[#615fff] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors disabled:opacity-60">
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

/* ── Security Tab ─────────────────────────────────────────────────── */
type PwdForm = z.infer<typeof changePasswordSchema>;

function SecurityTab() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form, setForm] = useState<PwdForm>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof PwdForm, string>>>({});
  const [show, setShow] = useState<Record<keyof PwdForm, boolean>>({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSave = async () => {
    setErrors({}); setMsg(null);

    const result = changePasswordSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof PwdForm, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof PwdForm;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe); return;
    }

    try {
      await changePassword({ currentPassword: result.data.currentPassword, newPassword: result.data.newPassword }).unwrap();
      setMsg({ text: "Password changed successfully!", ok: true });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setMsg({ text: e?.data?.message ?? "Failed to change password.", ok: false });
    }
    setTimeout(() => setMsg(null), 4000);
  };

  const fields: { key: keyof PwdForm; label: string }[] = [
    { key: "currentPassword", label: "Current password" },
    { key: "newPassword",     label: "New password" },
    { key: "confirmPassword", label: "Confirm new password" },
  ];

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h3 className="text-sm font-semibold text-[#0a0a0a] mb-1">Change Password</h3>
        <p className="text-xs text-[#9ca3af]">Use a strong password with at least 8 characters, one uppercase letter, and one number.</p>
      </div>

      {msg && (
        <p className={`text-sm p-3 rounded-lg border flex items-center gap-2 ${msg.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
          {msg.ok && <Check size={14} />} {msg.text}
        </p>
      )}

      {fields.map(({ key, label }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
          <div className="relative">
            <input
              type={show[key] ? "text" : "password"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className={`w-full h-10 pl-3 pr-10 rounded-lg border text-sm outline-none bg-white transition-colors ${errors[key] ? "border-red-400" : "border-[#e5e7eb] focus:border-[#615fff]"}`}
            />
            <button type="button" onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]">
              {show[key] ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors[key] && <p className="text-xs text-red-600 mt-1">{errors[key]}</p>}
        </div>
      ))}

      <button onClick={handleSave} disabled={isLoading}
        className="h-9 px-6 rounded-lg bg-[#615fff] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors disabled:opacity-60">
        {isLoading ? "Updating…" : "Update Password"}
      </button>
    </div>
  );
}

/* ── Notifications Tab ───────────────────────────────────────────── */
function NotificationsTab() {
  const prefs = [
    { key: "task_assigned",  label: "Task assigned to me",     desc: "When someone assigns a task to you" },
    { key: "task_completed", label: "Task completed",          desc: "When a task you own is marked done" },
    { key: "comments",       label: "Comments & mentions",     desc: "When someone comments or mentions you" },
    { key: "due_soon",       label: "Due date reminders",      desc: "24 hours before a task is due" },
    { key: "overdue",        label: "Overdue alerts",          desc: "When tasks become overdue" },
    { key: "team_updates",   label: "Team updates",            desc: "New members and role changes" },
  ];
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(prefs.map((p) => [p.key, true]))
  );

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <h3 className="text-sm font-semibold text-[#0a0a0a] mb-1">Notification Preferences</h3>
        <p className="text-xs text-[#9ca3af]">Choose what notifications you want to receive.</p>
      </div>
      <div className="divide-y divide-[#f3f4f6]">
        {prefs.map((p) => (
          <div key={p.key} className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-medium text-[#0a0a0a]">{p.label}</p>
              <p className="text-xs text-[#9ca3af]">{p.desc}</p>
            </div>
            <button
              onClick={() => setEnabled((e) => ({ ...e, [p.key]: !e[p.key] }))}
              className={`w-10 h-5.5 rounded-full transition-colors relative ${enabled[p.key] ? "bg-[#615fff]" : "bg-[#e5e7eb]"}`}
              style={{ minWidth: 40, height: 22 }}
            >
              <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${enabled[p.key] ? "translate-x-5" : "translate-x-0.5"}`}
                style={{ width: 18, height: 18, transform: enabled[p.key] ? "translateX(20px)" : "translateX(2px)" }} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#9ca3af]">Note: Notification preferences are saved locally in your browser.</p>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile",       label: "Profile",       icon: <User size={15} /> },
  { id: "security",      label: "Security",      icon: <Lock size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "workspace",     label: "Workspace",     icon: <Settings size={15} /> },
];

export default function SettingsPage() {
  const dispatch             = useAppDispatch();
  const router               = useRouter();
  const refreshToken         = useAppSelector((s) => s.auth.refreshToken);
  const [logoutApi]          = useLogoutApiMutation();
  const [activeTab, setTab]  = useState<Tab>("profile");

  const handleLogout = async () => {
    try {
      if (refreshToken) await logoutApi({ refreshToken }).unwrap();
    } catch { /* ignore */ }
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 shrink-0">
        <h1 className="text-lg font-semibold text-[#0a0a0a]">Settings</h1>
        <button onClick={handleLogout}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#e5e7eb] text-sm font-medium text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors">
          <LogOut size={14} /> Sign out
        </button>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-6 flex gap-8">
          {/* Sidebar */}
          <nav className="w-44 shrink-0 space-y-0.5">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 w-full px-3 h-9 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.id
                    ? "bg-[#ede9fe] text-[#615fff]"
                    : "text-[#6a7282] hover:bg-[#f3f4f6] hover:text-[#374151]"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "profile"       && <ProfileTab />}
            {activeTab === "security"      && <SecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "workspace"     && (
              <div className="text-sm text-[#9ca3af]">Workspace settings coming soon.</div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
