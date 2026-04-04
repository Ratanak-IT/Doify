"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/lib/features/auth/authApi";
import { resetPasswordSchema } from "@/lib/schemas";
import { Eye, EyeOff, Check } from "lucide-react";
import type { z } from "zod";

type Form = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token") ?? "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [form, setForm]   = useState<Form>({ token, newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "general", string>>>({});
  const [showPwd, setShow]  = useState(false);
  const [done, setDone]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const merged = { ...form, token };
    const result = resetPasswordSchema.safeParse(merged);
    if (!result.success) {
      const fe: Partial<Record<keyof Form, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof Form;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe); return;
    }

    try {
      await resetPassword({ token: result.data.token, newPassword: result.data.newPassword }).unwrap();
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to reset password. The link may have expired.";
      setErrors({ general: msg });
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
          <Check size={24} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-1">Password reset!</h2>
          <p className="text-sm text-[#6a7282]">Your password has been updated. Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a0a0a] mb-1">Set new password</h1>
        <p className="text-sm text-[#6a7282]">Choose a strong new password for your account.</p>
      </div>

      {!token && (
        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-600">
          No reset token found. Please use the link from your email.
        </div>
      )}
      {errors.general && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">New password</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              style={{ paddingRight: "2.5rem" }}
              className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors bg-white placeholder:text-[#9ca3af] ${
                errors.newPassword ? "border-red-400 bg-red-50" : "border-[#e5e7eb] focus:border-[#615fff]"
              }`}
            />
            <button type="button" onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]">
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Confirm new password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors bg-white placeholder:text-[#9ca3af] ${
              errors.confirmPassword ? "border-red-400 bg-red-50" : "border-[#e5e7eb] focus:border-[#615fff]"
            }`}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={isLoading || !token}
          className="w-full h-10 rounded-lg bg-black text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {isLoading
            ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Resetting…</>
            : "Reset password"
          }
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-[#6a7282] hover:text-[#374151]">Back to sign in</Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[15px] text-[#0a0a0a] leading-none">TaskFlow</p>
            <p className="text-xs text-[#6a7282]">Enterprise</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-8">
          <Suspense fallback={<div className="text-sm text-[#6a7282]">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
