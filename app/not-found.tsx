"use client";

import Link from "next/link";
import Logo from "./components/Logo";

function ArrowLeftIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

export default function NotFound() {
    return (
        <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-surface px-4 text-center">
            {/* Background glows */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[min(600px,100vw)] w-[min(600px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
            <div className="pointer-events-none absolute top-[20%] left-[30%] h-[min(300px,60vw)] w-[min(300px,60vw)] rounded-full bg-neon-cyan/5 blur-[100px]" />

            {/* Grid overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative z-10 mx-auto max-w-lg">
                {/* Brand */}
                <div className="mb-12 flex justify-center">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
                            <Logo className="h-full w-full" />
                        </div>
                        <span className="text-xl font-bold text-white">iPong</span>
                    </div>
                </div>

                {/* 404 Text */}
                <h1 className="text-8xl font-black tracking-tighter sm:text-9xl">
                    <span className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent opacity-10">
                        404
                    </span>
                </h1>

                <div className="mt-[-2rem] space-y-4">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Lost in{" "}
                        <span className="text-neon-cyan neon-text-cyan">Cyberspace</span>?
                    </h2>
                    <p className="mx-auto max-w-sm text-base text-zinc-400">
                        The page you are looking for has been disqualified or never existed.
                        Let&apos;s get you back to the match.
                    </p>
                </div>

                <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link
                        href="/"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:bg-accent-light hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] sm:w-auto"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex w-full items-center justify-center rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 px-8 py-4 text-sm font-semibold text-neon-cyan transition-all hover:border-neon-cyan/40 hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] sm:w-auto"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-[10%] right-[10%] h-32 w-32 animate-float rounded-full border border-white/5 bg-white/1 overflow-hidden backdrop-blur-3xl lg:block hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent" />
            </div>
            <div className="absolute bottom-[15%] left-[10%] h-24 w-24 animate-float rounded-full border border-white/5 bg-white/1 overflow-hidden backdrop-blur-3xl lg:block hidden" style={{ animationDelay: "1s" }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/20 to-transparent" />
            </div>
        </div>
    );
}
