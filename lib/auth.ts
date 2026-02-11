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
	document.cookie = "logged_in=; path=/; max-age=0";
}

export async function refreshAccessToken(): Promise<string | null> {
	try {
		const res = await fetch("/api/v1/auth/refresh", {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
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
	} catch {
		clearAuth();
		return null;
	}
}
