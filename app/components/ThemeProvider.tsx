"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getAccessToken } from "@/lib/auth";
import { getMyProfile, updateMyProfile } from "@/lib/api";

type Theme = "dark" | "light";

interface ThemeContextValue {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: "dark",
	toggleTheme: () => { },
	setTheme: () => { },
});

export function useTheme() {
	return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("dark");
	const [mounted, setMounted] = useState(false);
	const isUserChange = useRef(false);

	// On mount: use localStorage immediately for fast paint, then sync from API
	useEffect(() => {
		const stored = localStorage.getItem("theme") as Theme | null;
		const initial = stored ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
		setThemeState(initial);
		document.documentElement.setAttribute("data-theme", initial);
		setMounted(true);

		// Only fetch user theme from backend if we have a token (i.e. user is logged in).
		// This provider lives in the root layout and wraps unauthenticated pages too.
		if (!getAccessToken()) return;

		getMyProfile()
			.then((res) => {
				const serverTheme = res.data.theme;
				if (serverTheme && serverTheme !== initial) {
					setThemeState(serverTheme);
					document.documentElement.setAttribute("data-theme", serverTheme);
					localStorage.setItem("theme", serverTheme);
				}
			})
			.catch(() => {
				// Not logged in or network error — keep local theme
			});
	}, []);

	// Sync attribute + localStorage whenever theme changes, persist to backend on user action
	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);

		if (isUserChange.current) {
			isUserChange.current = false;
			updateMyProfile({ theme }).catch(() => {
				// Silently fail — localStorage still has the value
			});
		}
	}, [theme, mounted]);

	const setTheme = useCallback((t: Theme) => {
		isUserChange.current = true;
		setThemeState(t);
	}, []);

	const toggleTheme = useCallback(
		() => {
			isUserChange.current = true;
			setThemeState((t) => (t === "dark" ? "light" : "dark"));
		},
		[],
	);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
