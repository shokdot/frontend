const TOKEN_KEY = "access_token";

export function getAccessToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
	document.cookie = "logged_in=true; path=/; max-age=604800; SameSite=Strict";
}

export function clearAuth(): void {
	localStorage.removeItem(TOKEN_KEY);
	// Must match the attributes used when setting (SameSite=Strict)
	// so the browser deletes the correct cookie.
	document.cookie = "logged_in=; path=/; max-age=0; SameSite=Strict";
}

/** Thrown when a refresh attempt is rate-limited (429). The session may still be valid. */
export class RateLimitedError extends Error {
	constructor() {
		super("Rate limited");
		this.name = "RateLimitedError";
	}
}

/**
 * Mutex for token refresh.
 * When multiple API calls get 401 simultaneously, only the first one
 * actually hits /auth/refresh. The rest await the same promise.
 *
 * Returns the new access token on success, null if the session is dead.
 * Throws RateLimitedError if the server returned 429.
 */
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
	// If a refresh is already in flight, piggyback on it
	if (refreshPromise) return refreshPromise;

	refreshPromise = doRefresh();
	try {
		return await refreshPromise;
	} finally {
		refreshPromise = null;
	}
}

async function doRefresh(): Promise<string | null> {
	try {
		const res = await fetch("/api/v1/auth/refresh", {
			method: "POST",
			credentials: "include",
		});

		if (res.status === 429) {
			// Rate-limited — the session might still be valid.
			// Don't clear auth; let callers decide how to handle it.
			throw new RateLimitedError();
		}

		if (!res.ok) {
			// Genuine auth failure (401/403) — session is dead.
			clearAuth();
			return null;
		}

		const json = await res.json();
		const token = json.data?.accessToken;
		if (token) {
			setAccessToken(token);
			return token;
		}

		clearAuth();
		return null;
	} catch (err) {
		if (err instanceof RateLimitedError) throw err;
		clearAuth();
		return null;
	}
}
