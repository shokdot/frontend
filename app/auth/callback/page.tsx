"use client";

import { useEffect, useRef } from "react";
import { setAccessToken } from "@/lib/auth";

/**
 * OAuth callback page.
 *
 * After GitHub OAuth, the backend sets a refreshToken httpOnly cookie and
 * redirects here. We call /api/v1/auth/refresh (which reads the cookie) to
 * obtain an access token, then store it and redirect to the dashboard.
 */
export default function AuthCallbackPage() {
	const ran = useRef(false);

	useEffect(() => {
		// Strict-mode double-invoke guard
		if (ran.current) return;
		ran.current = true;

		(async () => {
			try {
				const res = await fetch("/api/v1/auth/refresh", {
					method: "POST",
					credentials: "include",
				});

				if (!res.ok) {
					window.location.href = "/login?error=oauth_failed";
					return;
				}

				const json = await res.json();
				const token = json.data?.accessToken;

				if (!token) {
					window.location.href = "/login?error=oauth_failed";
					return;
				}

				setAccessToken(token);
				window.location.href = "/dashboard";
			} catch {
				window.location.href = "/login?error=oauth_failed";
			}
		})();
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
					<svg className="h-8 w-8 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
					</svg>
				</div>
				<p className="text-sm text-zinc-400">Completing sign-in...</p>
			</div>
		</div>
	);
}
