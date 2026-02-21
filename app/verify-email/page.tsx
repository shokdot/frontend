"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token found. Please use the link from your email.");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`/api/v1/auth/verify-email?token=${token}`);
                const data = await res.json().catch(() => null);

                if (res.ok) {
                    setStatus("success");
                    setMessage(data?.message || "Email verified successfully. You can now log in.");
                } else {
                    setStatus("error");
                    setMessage(data?.message || "This verification link is invalid or has expired.");
                }
            } catch {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            }
        };

        verify();
    }, [token]);

    // Loading
    if (status === "loading") {
        return (
            <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <svg className="h-7 w-7 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    Verifying your <span className="text-accent neon-text-purple">email…</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    Please wait while we confirm your email address.
                </p>
            </div>
        );
    }

    // Success
    if (status === "success") {
        return (
            <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-neon-cyan/10">
                    <svg className="h-7 w-7 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    Email <span className="text-neon-cyan neon-text-cyan">verified!</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{message}</p>
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

    // Error
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
                Verification <span className="text-red-400">failed</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{message}</p>
            <div className="mt-8 space-y-3">
                <Link
                    href="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                >
                    Go to sign in
                </Link>
                <Link
                    href="/register"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-neon-cyan/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                >
                    Create new account
                </Link>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.4)] overflow-hidden">
                            <Logo className="h-full w-full" />
                        </div>
                        <span className="text-xl font-bold text-white">iPong</span>
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
                        <VerifyEmailContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
