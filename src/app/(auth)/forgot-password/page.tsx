"use client";

import { useState } from "react";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/lib/features/auth/authApi";
import { forgotPasswordSchema } from "@/lib/schemas";
import { Check, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail]   = useState("");
  const [error, setError]   = useState("");
  const [sent, setSent]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    try {
      await forgotPassword({ email: result.data.email }).unwrap();
      setSent(true);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to send reset email.";
      setError(msg);
    }
  };

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
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
                <Check size={24} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0a0a0a] mb-1">Check your email</h2>
                <p className="text-sm text-[#6a7282]">
                  We sent a password reset link to <span className="font-medium text-[#0a0a0a]">{email}</span>.
                  Check your inbox and follow the instructions.
                </p>
              </div>
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#615fff] hover:underline font-medium">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#0a0a0a] mb-1">Reset password</h1>
                <p className="text-sm text-[#6a7282]">Enter your email and we&apos;ll send you a reset link.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Email address</label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors bg-white placeholder:text-[#9ca3af] ${
                      error ? "border-red-400 bg-red-50" : "border-[#e5e7eb] focus:border-[#615fff]"
                    }`}
                  />
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full h-10 rounded-lg bg-black text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {isLoading
                    ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending…</>
                    : "Send reset link"
                  }
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-[#6a7282] hover:text-[#374151]">
                  <ArrowLeft size={13} /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
