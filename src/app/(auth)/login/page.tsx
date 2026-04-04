"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { loginSchema } from "@/lib/schemas";
import { Eye, EyeOff } from "lucide-react";
import type { z } from "zod";

type Form = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm]     = useState<Form>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "general", string>>>({});
  const [showPwd, setShow]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof Form, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof Form;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }

    try {
      const res = await login(result.data).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token, refreshToken: res.refreshToken }));
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Invalid email or password.";
      setErrors({ general: msg });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0a0a0a] mb-1">Welcome back</h1>
            <p className="text-sm text-[#6a7282]">Sign in to your account to continue</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors bg-white placeholder:text-[#9ca3af] ${
                  errors.email ? "border-red-400 bg-red-50" : "border-[#e5e7eb] focus:border-[#615fff]"
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-[#374151]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#615fff] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: "2.5rem" }}
                  className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors bg-white placeholder:text-[#9ca3af] ${
                    errors.password ? "border-red-400 bg-red-50" : "border-[#e5e7eb] focus:border-[#615fff]"
                  }`}
                />
                <button type="button" onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full h-10 rounded-lg bg-black text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading
                ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</>
                : "Sign in"
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6a7282] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#615fff] font-medium hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}
