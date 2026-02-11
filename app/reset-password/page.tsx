"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to reset password");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // Invalid or missing token
  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <svg className="h-7 w-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Invalid <span className="text-red-400">link</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          This password reset link is invalid or has expired.
          Please request a new one.
        </p>
        <div className="mt-8 space-y-3">
          <Link
            href="/forgot-password"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            Request new link
          </Link>
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-neon-cyan/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,240,255,0.08)]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-neon-cyan/10">
          <svg className="h-7 w-7 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Password <span className="text-neon-cyan neon-text-cyan">reset!</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Your password has been successfully reset.
          You can now sign in with your new password.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
          <svg className="h-7 w-7 text-accent-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Set new <span className="text-accent neon-text-purple">password</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your new password must be at least 8 characters.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-300">
            New password
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg className="h-4.5 w-4.5 text-zinc-500 transition-colors group-focus-within:text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full rounded-lg border border-white/10 bg-surface-lighter py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-neon-cyan/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] focus:ring-1 focus:ring-neon-cyan/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {showPassword ? (
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Confirm password
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg className="h-4.5 w-4.5 text-zinc-500 transition-colors group-focus-within:text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="w-full rounded-lg border border-white/10 bg-surface-lighter py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-neon-cyan/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] focus:ring-1 focus:ring-neon-cyan/30"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Resetting...
            </span>
          ) : (
            "Reset password"
          )}
        </button>
      </form>

      {/* Back to login */}
      <p className="mt-6 text-center text-sm text-zinc-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-accent transition-colors hover:text-accent-light"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/8 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full bg-neon-cyan/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">transcendence</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/5 bg-surface-light p-8 shadow-[0_0_30px_rgba(139,92,246,0.06)] sm:p-10">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <svg className="h-6 w-6 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
