"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationPanel from "../components/NotificationPanel";
import StatusProvider, { mapBackendStatus } from "../components/StatusProvider";
import ChatProvider, { useChat } from "../components/ChatProvider";
import { useTheme } from "../components/ThemeProvider";
import Logo from "../components/Logo";
import { clearAuth, getAccessToken } from "@/lib/auth";

import { getMyProfile, ApiUserProfile, searchUsers, ApiSearchResult } from "@/lib/api";

/* ──────────────────────── Icons ──────────────────────── */

function LogoIcon() {
	return (
		<div className="flex h-9 w-9 items-center justify-center transition-shadow shadow-[0_0_15px_rgba(139,92,246,0.4)] overflow-hidden rounded-lg">
			<Logo className="h-full w-full" />
		</div>
	);
}


function DashboardIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="9" rx="1" />
			<rect x="14" y="3" width="7" height="5" rx="1" />
			<rect x="14" y="12" width="7" height="9" rx="1" />
			<rect x="3" y="16" width="7" height="5" rx="1" />
		</svg>
	);
}

function GamepadIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="6" width="20" height="12" rx="3" />
			<path d="M6 10v4" />
			<path d="M4 12h4" />
			<circle cx="17" cy="10" r="1" fill="currentColor" />
			<circle cx="19" cy="12" r="1" fill="currentColor" />
		</svg>
	);
}

function ChatIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
		</svg>
	);
}

function TrophyIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
			<path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
			<path d="M4 22h16" />
			<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
			<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
			<path d="M18 2H6v7a6 6 0 0012 0V2z" />
		</svg>
	);
}

function UserIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}

function UsersIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 00-3-3.87" />
			<path d="M16 3.13a4 4 0 010 7.75" />
		</svg>
	);
}

function SettingsIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
		</svg>
	);
}

function LogoutIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</svg>
	);
}

function MenuIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	);
}

function CloseIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	);
}

function SunIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="5" />
			<line x1="12" y1="1" x2="12" y2="3" />
			<line x1="12" y1="21" x2="12" y2="23" />
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
			<line x1="1" y1="12" x2="3" y2="12" />
			<line x1="21" y1="12" x2="23" y2="12" />
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
		</svg>
	);
}

function MoonIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
		</svg>
	);
}

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="11" cy="11" r="8" />
			<path d="M21 21l-4.35-4.35" />
		</svg>
	);
}

/* ──────────────────────── Search Helpers ──────────────────────── */

const statusDot: Record<string, string> = {
	online: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
	"in-game": "bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]",
	idle: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
	offline: "bg-zinc-600",
};

/* ──────────────────────── Nav Items ──────────────────────── */

const navItems = [
	{ label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
	{ label: "Play", href: "/dashboard/play", icon: GamepadIcon },
	{ label: "Chat", href: "/dashboard/chat", icon: ChatIcon },
	{ label: "Friends", href: "/dashboard/friends", icon: UsersIcon },
	{ label: "Leaderboard", href: "/dashboard/leaderboard", icon: TrophyIcon },
	{ label: "Profile", href: "/dashboard/profile", icon: UserIcon },
	{ label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

/* ──────────────────── Chat Unread Dot ──────────────────── */

/** Small glowing dot on the Chat icon when there are unread messages. Must be rendered inside ChatProvider. */
function ChatUnreadDot() {
	const { unreadCount } = useChat();
	if (unreadCount === 0) return null;
	return (
		<span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neon-pink shadow-[0_0_6px_rgba(224,64,251,0.8)]" />
	);
}

/* ──────────────────────── Layout ──────────────────────── */

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { theme, themeReady, toggleTheme } = useTheme();
	const [searchQuery, setSearchQuery] = useState("");
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchResults, setSearchResults] = useState<ApiSearchResult[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	/* Profile data for header avatar */
	const [profile, setProfile] = useState<ApiUserProfile | null>(null);

	const loadProfile = useCallback(async () => {
		try {
			const res = await getMyProfile();
			setProfile(res.data);
		} catch {
			// Silently fail — avatar will show fallback
		}
	}, []);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	/* Debounced search */
	useEffect(() => {
		const query = searchQuery.trim();
		if (!query) {
			setSearchResults([]);
			setSearchLoading(false);
			return;
		}

		setSearchLoading(true);

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			try {
				const res = await searchUsers(query);
				setSearchResults(res.data.results.slice(0, 6));
			} catch {
				setSearchResults([]);
			} finally {
				setSearchLoading(false);
			}
		}, 300);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [searchQuery]);

	// Close sidebar + search on route change
	useEffect(() => {
		setSidebarOpen(false);
		setSearchOpen(false);
		setSearchQuery("");
	}, [pathname]);

	// Close sidebar on escape key, close search
	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setSidebarOpen(false);
				setSearchOpen(false);
			}
		}
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, []);

	// Close search dropdown on outside click
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setSearchOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	async function handleLogout() {
		try {
			const token = getAccessToken();
			await fetch("/api/v1/auth/logout", {
				method: "POST",
				credentials: "include",
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
		} finally {
			clearAuth();
			localStorage.removeItem("theme");
			document.documentElement.setAttribute("data-theme", "dark");
			window.location.href = "/";
		}
	}

	/* ── Loading screen while theme resolves ── */
	if (!themeReady) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-surface">
				<div className="flex flex-col items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center transition-shadow shadow-[0_0_20px_rgba(139,92,246,0.4)] overflow-hidden rounded-xl">
						<Logo className="h-full w-full" />
					</div>
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-accent" />
				</div>

			</div>
		);
	}

	return (
		<StatusProvider>
			<ChatProvider>
				<div className="flex min-h-screen">
					{/* ── Mobile overlay ── */}
					{sidebarOpen && (
						<div
							className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
							onClick={() => setSidebarOpen(false)}
						/>
					)}

					{/* ── Sidebar ── */}
					<aside
						className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-surface-light transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
							}`}
					>
						{/* Sidebar header */}
						<div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
							<Link href="/dashboard" className="flex items-center gap-2.5">
								<LogoIcon />
								<span className="text-lg font-bold text-white">iPong</span>
							</Link>
							<button
								onClick={() => setSidebarOpen(false)}
								className="text-zinc-400 hover:text-white lg:hidden"
							>
								<CloseIcon className="h-5 w-5" />
							</button>
						</div>

						{/* Nav links */}
						<nav className="flex-1 overflow-y-auto px-3 py-4">
							<ul className="space-y-1">
								{navItems.map((item) => {
									const isActive = pathname === item.href;
									const isChatLink = item.href === "/dashboard/chat";
									return (
										<li key={item.href}>
											<Link
												href={item.href}
												className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
													? "bg-accent/10 text-accent-light shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]"
													: "text-zinc-400 hover:bg-white/5 hover:text-white"
													}`}
											>
												<span className="relative flex-shrink-0">
													<item.icon className={`h-5 w-5 ${isActive ? "text-accent-light" : ""}`} />
													{isChatLink && <ChatUnreadDot />}
												</span>
												{item.label}
												{isActive && (
													<div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
												)}
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>

						{/* Sidebar footer */}
						<div className="border-t border-white/5 p-3">
							<button
								onClick={handleLogout}
								className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400"
							>
								<LogoutIcon className="h-5 w-5" />
								Log out
							</button>
						</div>
					</aside>

					{/* ── Main area ── */}
					<div className="flex flex-1 flex-col">
						{/* Top bar */}
						<header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-surface/80 px-4 backdrop-blur-xl sm:px-6">
							{/* Left: hamburger + breadcrumb */}
							<div className="flex items-center gap-3">
								<button
									onClick={() => setSidebarOpen(true)}
									className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
								>
									<MenuIcon className="h-5 w-5" />
								</button>
								<h2 className="hidden text-sm font-semibold text-white capitalize sm:block">
									{pathname === "/dashboard"
										? "Dashboard"
										: pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
								</h2>
							</div>

							{/* Center: search bar */}
							<div ref={searchRef} className="relative flex-1 max-w-md mx-auto">
								<SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
								<input
									type="text"
									placeholder="Search players..."
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value);
										setSearchOpen(true);
									}}
									onFocus={() => setSearchOpen(true)}
									className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
								/>

								{/* Search dropdown */}
								{searchOpen && searchQuery.trim() && (
									<div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-white/5 bg-surface-light shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
										{searchLoading ? (
											<div className="px-4 py-6 text-center">
												<p className="text-sm text-zinc-500">Searching...</p>
											</div>
										) : searchResults.length > 0 ? (
											<div className="py-1">
												{searchResults.map((player) => (
													<button
														key={player.userId}
														onClick={() => {
															router.push(`/dashboard/player/${player.username}`);
															setSearchOpen(false);
															setSearchQuery("");
														}}
														className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
													>
														<div className="relative flex-shrink-0">
															{player.avatarUrl ? (
																<img
																	src={player.avatarUrl}
																	alt={player.username}
																	className="h-8 w-8 rounded-full object-cover"
																/>
															) : (
																<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-zinc-400">
																	{player.username.slice(0, 2).toUpperCase()}
																</div>
															)}
															<span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface-light ${statusDot[mapBackendStatus(player.status)]}`} />
														</div>
														<div className="min-w-0 flex-1">
															<p className="truncate text-sm font-medium text-zinc-200">
																{player.username}
															</p>
															<p className="text-xs text-zinc-500 capitalize">{mapBackendStatus(player.status)}</p>
														</div>
													</button>
												))}
											</div>
										) : (
											<div className="px-4 py-6 text-center">
												<p className="text-sm text-zinc-500">No players found</p>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Right: theme toggle + notifications + avatar */}
							<div className="flex items-center gap-2">
								<button
									onClick={toggleTheme}
									className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
									title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
								>
									{theme === "dark" ? (
										<SunIcon className="h-4.5 w-4.5" />
									) : (
										<MoonIcon className="h-4.5 w-4.5" />
									)}
								</button>
								<NotificationPanel />
								<Link
									href="/dashboard/profile"
									className="ml-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-accent/20 text-sm font-bold text-accent-light ring-2 ring-accent/30 transition-all hover:ring-accent/60"
								>
									{profile?.avatarUrl ? (
										<img
											src={profile.avatarUrl}
											alt={profile.displayName || profile.username}
											className="h-full w-full object-cover"
										/>
									) : (
										(profile?.displayName || profile?.username || "U")
											.split(" ")
											.map((w) => w[0])
											.join("")
											.toUpperCase()
											.slice(0, 2)
									)}
								</Link>
							</div>
						</header>

						{/* Page content */}
						<main className="flex-1 overflow-y-auto">
							{children}
						</main>
					</div>
				</div>
			</ChatProvider>
		</StatusProvider>
	);
}
