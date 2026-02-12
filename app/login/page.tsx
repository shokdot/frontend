"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { setAccessToken } from "@/lib/auth";

interface FieldErrors {
	email?: string;
	password?: string;
}

export default function LoginPage() {
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/dashboard";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(() => {
		const err = searchParams.get("error");
		if (err === "oauth_failed") return "GitHub sign-in failed. Please try again.";
		return err ? `Authentication error: ${err}` : "";
	});
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	function clearFieldError(field: keyof FieldErrors) {
		setFieldErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setFieldErrors({});
		setIsLoading(true);

		try {
			const res = await fetch("/api/v1/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json().catch(() => null);

			if (!res.ok) {
				const code = data?.error?.code;
				const message = data?.error?.message;
				const details = data?.error?.details;

				switch (code) {
					case "NOT_REGISTERED":
						setFieldErrors({ email: "No account found with this email" });
						return;
					case "EMAIL_NOT_VERIFIED":
						setFieldErrors({ email: "Please verify your email before signing in" });
						return;
					case "INVALID_CREDENTIALS":
						setFieldErrors({ password: "Incorrect password" });
						return;
					case "VALIDATION_FAILED":
						if (details?.field) {
							setFieldErrors({ [details.field]: details.message || "Invalid value" });
						} else {
							setError(message || "Invalid input");
						}
						return;
					case "TOO_MANY_REQUESTS":
						setError("Too many login attempts. Please try again later");
						return;
					default:
						setError(message || "Invalid email or password");
						return;
				}
			}

			if (data?.data?.accessToken) {
				setAccessToken(data.data.accessToken);
			}

			window.location.href = redirectTo;
		} catch {
			setError("Unable to connect. Please check your internet connection");
		} finally {
			setIsLoading(false);
		}
	}

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
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-bold text-white sm:text-3xl">
							Welcome <span className="text-accent neon-text-purple">back</span>
						</h1>
						<p className="mt-2 text-sm text-zinc-400">
							Sign in to your account to continue
						</p>
					</div>

					{/* Error */}
					{error && (
						<div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Email */}
						<div>
							<label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
								Email
							</label>
							<div className="group relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
									<svg className="h-4.5 w-4.5 text-zinc-500 transition-colors group-focus-within:text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
										<rect x="2" y="4" width="20" height="16" rx="2" />
										<path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
									</svg>
								</div>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
									placeholder="you@example.com"
									className={`w-full rounded-lg border bg-surface-lighter py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all ${fieldErrors.email ? "border-red-500/50 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30" : "border-white/10 focus:border-neon-cyan/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] focus:ring-1 focus:ring-neon-cyan/30"}`}
								/>
							</div>
							{fieldErrors.email && (
								<p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>
							)}
						</div>

						{/* Password */}
						<div>
							<div className="mb-1.5 flex items-center justify-between">
								<label htmlFor="password" className="text-sm font-medium text-zinc-300">
									Password
								</label>
								<Link
									href="/forgot-password"
									className="text-xs text-zinc-500 transition-colors hover:text-neon-cyan"
								>
									Forgot password?
								</Link>
							</div>
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
									value={password}
									onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
									placeholder="••••••••"
									className={`w-full rounded-lg border bg-surface-lighter py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-all ${fieldErrors.password ? "border-red-500/50 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30" : "border-white/10 focus:border-neon-cyan/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] focus:ring-1 focus:ring-neon-cyan/30"}`}
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
							{fieldErrors.password && (
								<p className="mt-1.5 text-xs text-red-400">{fieldErrors.password}</p>
							)}
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
									Signing in...
								</span>
							) : (
								"Sign in"
							)}
						</button>
					</form>

					{/* Divider */}
					<div className="my-6 flex items-center gap-3">
						<div className="h-px flex-1 bg-white/5" />
						<span className="text-xs text-zinc-500">or continue with</span>
						<div className="h-px flex-1 bg-white/5" />
					</div>

					{/* OAuth */}
					<a
						href="/api/v1/auth/oauth/github"
						className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-surface-lighter py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-neon-cyan/20 hover:text-white hover:shadow-[0_0_15px_rgba(0,240,255,0.08)]"
					>
						<svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
						</svg>
						GitHub
					</a>

					{/* Sign up link */}
					<p className="mt-6 text-center text-sm text-zinc-500">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-accent transition-colors hover:text-accent-light"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
