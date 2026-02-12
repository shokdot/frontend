"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getAccessToken } from "@/lib/auth";
import { getMyProfile, updateMyProfile } from "@/lib/api";

type Theme = "dark" | "light";

interface ThemeContextValue {
	theme: Theme;
	themeReady: boolean;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: "dark",
	themeReady: false,
	toggleTheme: () => { },
	setTheme: () => { },
});

export function useTheme() {
	return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("dark");
	const [mounted, setMounted] = useState(false);
	const [themeReady, setThemeReady] = useState(false);
	const isUserChange = useRef(false);

	useEffect(() => {
		const isAuthenticated = !!getAccessToken();

		if (!isAuthenticated) {
			// Public pages: always dark, ignore localStorage, ready immediately
			document.documentElement.setAttribute("data-theme", "dark");
			setThemeState("dark");
			setMounted(true);
			setThemeReady(true);
			return;
		}

		// Authenticated: read localStorage for fast paint, then sync from API
		const stored = localStorage.getItem("theme") as Theme | null;
		const initial = stored ?? "dark";
		setThemeState(initial);
		document.documentElement.setAttribute("data-theme", initial);
		setMounted(true);

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
				// Network error — keep local theme
			})
			.finally(() => {
				setThemeReady(true);
			});
	}, []);

	// Sync attribute + localStorage whenever theme changes, persist to backend on user action
	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute("data-theme", theme);

		// Only persist to localStorage when authenticated
		if (getAccessToken()) {
			localStorage.setItem("theme", theme);
		}

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
		<ThemeContext.Provider value={{ theme, themeReady, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
