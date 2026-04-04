"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { registerSchema } from "@/lib/schemas";
import type { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

type Form = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof Form | "general", string>>;

export default function RegisterPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState<Form>({
    fullName: "", username: "", email: "",
    password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPwd, setShowPwd]     = useState(false);
  const [showConfirm, setConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fe: Errors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof Form;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }

    try {
      const res = await register({
        fullName: result.data.fullName,
        username: result.data.username,
        email: result.data.email,
        password: result.data.password,
      }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token, refreshToken: res.refreshToken }));
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Registration failed. Please try again.";
      setErrors({ general: msg });
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    return [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
  })();

  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const field = (key: keyof Form, type = "text") => ({
    type, value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
    className: `w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors bg-white placeholder:text-[#9ca3af] ${
      errors[key] ? "border-red-400 bg-red-50" : "border-[#e5e7eb] focus:border-[#615fff]"
    }`,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50 px-4 py-8">
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
            <h1 className="text-2xl font-bold text-[#0a0a0a] mb-1">Create an account</h1>
            <p className="text-sm text-[#6a7282]">Join your team and start managing tasks</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Full name</label>
              <input placeholder="Alex Johnson" {...field("fullName")} />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Username</label>
              <input placeholder="alexjohnson" {...field("username")} />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Work email</label>
              <input placeholder="alex@company.com" {...field("email", "email")} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
              <div className="relative">
                <input placeholder="Min. 8 characters" {...field("password", showPwd ? "text" : "password")} style={{ paddingRight: "2.5rem" }} />
                <button type="button" onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0,1,2,3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : "bg-[#f3f4f6]"}`}/>
                    ))}
                  </div>
                  <p className="text-xs text-[#6a7282]">Strength: <span className="font-medium">{strengthLabel}</span></p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Confirm password</label>
              <div className="relative">
                <input placeholder="••••••••" {...field("confirmPassword", showConfirm ? "text" : "password")} style={{ paddingRight: "2.5rem" }} />
                <button type="button" onClick={() => setConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" required className="w-4 h-4 mt-0.5 rounded accent-[#615fff] cursor-pointer"/>
              <label htmlFor="terms" className="text-sm text-[#6a7282] cursor-pointer select-none leading-snug">
                I agree to the{" "}
                <Link href="#" className="text-[#615fff] hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="#" className="text-[#615fff] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full h-10 rounded-lg bg-black text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {isLoading
                ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account…</>
                : "Create account"
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6a7282] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#615fff] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
