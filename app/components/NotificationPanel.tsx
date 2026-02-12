"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	ApiNotification,
	getNotifications,
	markNotificationRead,
	markAllNotificationsRead,
	deleteNotification,
} from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { useNotifications } from "./NotificationProvider";

/* ──────────────────────── Types ──────────────────────── */

type NotifKind = "game_invite" | "friend_request" | "match_result" | "system";

/* ──────────────────────── Icons ──────────────────────── */

function BellIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
			<path d="M13.73 21a2 2 0 01-3.46 0" />
		</svg>
	);
}

function GamepadSmIcon({ className }: { className?: string }) {
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

function UserPlusIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<line x1="19" y1="8" x2="19" y2="14" />
			<line x1="22" y1="11" x2="16" y2="11" />
		</svg>
	);
}

function TrophySmIcon({ className }: { className?: string }) {
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

function InfoSmIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" />
			<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
	);
}

function CheckAllIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="1 12 5 16 11 6" />
			<polyline points="9 12 13 16 22 4" />
		</svg>
	);
}

/* ──────────────────────── Style map ──────────────────────── */

const kindStyle: Record<NotifKind, { icon: typeof BellIcon; iconBg: string; iconColor: string }> = {
	game_invite: {
		icon: GamepadSmIcon,
		iconBg: "bg-neon-cyan/10",
		iconColor: "text-neon-cyan",
	},
	friend_request: {
		icon: UserPlusIcon,
		iconBg: "bg-accent/10",
		iconColor: "text-accent-light",
	},
	match_result: {
		icon: TrophySmIcon,
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-400",
	},
	system: {
		icon: InfoSmIcon,
		iconBg: "bg-amber-500/10",
		iconColor: "text-amber-400",
	},
};

const defaultKindStyle = kindStyle.system;

/* ──────────────────────── Toast type mapping ──────────────────────── */

const toastTypeMap: Record<string, "success" | "error" | "info" | "warning"> = {
	game_invite: "info",
	friend_request: "info",
	match_result: "success",
	system: "warning",
};

/* ──────────────────────── Helpers ──────────────────────── */

function getKindStyle(type: string) {
	return kindStyle[type as NotifKind] ?? defaultKindStyle;
}

function formatNotifTitle(type: string): string {
	switch (type) {
		case "game_invite": return "Game Invite";
		case "friend_request": return "Friend Request";
		case "match_result": return "Match Result";
		default: return "Notification";
	}
}

function timeAgo(dateStr: string): string {
	const now = Date.now();
	const then = new Date(dateStr).getTime();
	const diffMs = now - then;

	const seconds = Math.floor(diffMs / 1000);
	if (seconds < 60) return "just now";

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} min ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;

	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;

	return new Date(dateStr).toLocaleDateString();
}

/** Build WebSocket URL from the current page origin. */
function buildWsUrl(path: string, token: string): string {
	const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
	return `${proto}//${window.location.host}${path}?token=${encodeURIComponent(token)}`;
}

/* ──────────────────────── Reconnecting WebSocket hook ──────────────────────── */

function useNotificationWebSocket(
	onMessage: (notification: ApiNotification) => void,
) {
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(null);
	const onMessageRef = useRef(onMessage);
	onMessageRef.current = onMessage;

	const connect = useCallback(() => {
		const token = getAccessToken();
		if (!token) return;

		// Close existing connection
		if (wsRef.current) {
			wsRef.current.onclose = null;
			wsRef.current.close();
		}

		const ws = new WebSocket(buildWsUrl("/api/v1/notifications/ws", token));
		wsRef.current = ws;

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data) as ApiNotification;
				onMessageRef.current(data);
			} catch {
				// Ignore malformed messages
			}
		};

		ws.onclose = () => {
			// Reconnect with exponential backoff (max 30s)
			reconnectTimer.current = setTimeout(() => {
				connect();
			}, 5000);
		};

		ws.onerror = () => {
			ws.close();
		};
	}, []);

	useEffect(() => {
		connect();

		return () => {
			if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
			if (wsRef.current) {
				wsRef.current.onclose = null;
				wsRef.current.close();
			}
		};
	}, [connect]);
}

/* ──────────────────────── Component ──────────────────────── */

export default function NotificationPanel() {
	const [open, setOpen] = useState(false);
	const [notifications, setNotifications] = useState<ApiNotification[]>([]);
	const [loading, setLoading] = useState(true);
	const panelRef = useRef<HTMLDivElement>(null);
	const { addToast } = useNotifications();

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	/* ── Fetch notifications from API ── */
	const fetchNotifications = useCallback(async () => {
		try {
			const res = await getNotifications();
			setNotifications(res.data.results);
		} catch {
			// Silently fail — panel shows empty state
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	/* ── Real-time via WebSocket ── */
	useNotificationWebSocket(
		useCallback(
			(incoming: ApiNotification) => {
				// Prepend new notification to the list
				setNotifications((prev) => {
					// Avoid duplicates
					if (prev.some((n) => n.id === incoming.id)) return prev;
					return [incoming, ...prev];
				});

				// Show toast for new notification
				addToast({
					type: toastTypeMap[incoming.type] ?? "info",
					title: formatNotifTitle(incoming.type),
					message: incoming.message,
				});
			},
			[addToast],
		),
	);

	/* ── Close on outside click ── */
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		if (open) document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [open]);

	/* ── Close on Escape ── */
	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		if (open) document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [open]);

	/* ── Actions ── */
	async function handleMarkAllRead() {
		try {
			await markAllNotificationsRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
		} catch {
			addToast({ type: "error", title: "Failed to mark all as read" });
		}
	}

	async function handleMarkRead(id: string) {
		try {
			await markNotificationRead(id);
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
			);
		} catch {
			// Silently fail
		}
	}

	async function handleDelete(id: string) {
		try {
			await deleteNotification(id);
			setNotifications((prev) => prev.filter((n) => n.id !== id));
		} catch {
			addToast({ type: "error", title: "Failed to delete notification" });
		}
	}

	return (
		<div ref={panelRef} className="relative">
			{/* Bell trigger */}
			<button
				onClick={() => setOpen(!open)}
				className="relative rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
				aria-label="Notifications"
			>
				<BellIcon className="h-5 w-5" />
				{unreadCount > 0 && (
					<span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-neon-pink shadow-[0_0_6px_rgba(224,64,251,0.8)]" />
				)}
			</button>

			{/* Dropdown */}
			<div
				className={`absolute right-0 top-full mt-2 w-80 origin-top-right transition-all duration-200 sm:w-96 ${open
					? "scale-100 opacity-100"
					: "pointer-events-none scale-95 opacity-0"
					}`}
			>
				<div className="overflow-hidden rounded-xl border border-white/10 bg-surface-light shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
						<h3 className="text-sm font-semibold text-white">Notifications</h3>
						{unreadCount > 0 && (
							<button
								onClick={handleMarkAllRead}
								className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-neon-cyan"
							>
								<CheckAllIcon className="h-3.5 w-3.5" />
								Mark all read
							</button>
						)}
					</div>

					{/* Notification list */}
					<div className="max-h-[400px] overflow-y-auto">
						{loading ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-neon-cyan" />
								<p className="mt-3 text-sm text-zinc-500">Loading...</p>
							</div>
						) : notifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<BellIcon className="mb-3 h-8 w-8 text-zinc-600" />
								<p className="text-sm text-zinc-500">No notifications yet</p>
							</div>
						) : (
							notifications.map((notif) => {
								const style = getKindStyle(notif.type);
								const Icon = style.icon;

								return (
									<div
										key={notif.id}
										className={`group relative flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] ${!notif.isRead ? "bg-accent/[0.03]" : ""
											}`}
									>
										{/* Unread dot */}
										{!notif.isRead && (
											<span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
										)}

										{/* Icon */}
										<div
											className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
										>
											<Icon className={`h-4 w-4 ${style.iconColor}`} />
										</div>

										{/* Content */}
										<button
											onClick={() => handleMarkRead(notif.id)}
											className="min-w-0 flex-1 text-left"
										>
											<p className={`text-sm font-medium ${notif.isRead ? "text-zinc-400" : "text-white"}`}>
												{formatNotifTitle(notif.type)}
											</p>
											<p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">
												{notif.message}
											</p>
											<p className="mt-1 text-[11px] text-zinc-600">
												{timeAgo(notif.createdAt)}
											</p>
										</button>

										{/* Dismiss */}
										<button
											onClick={() => handleDelete(notif.id)}
											className="mt-0.5 flex-shrink-0 rounded-md p-1 text-zinc-600 opacity-0 transition-all hover:text-zinc-300 group-hover:opacity-100"
											aria-label="Dismiss"
										>
											<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
												<line x1="18" y1="6" x2="6" y2="18" />
												<line x1="6" y1="6" x2="18" y2="18" />
											</svg>
										</button>
									</div>
								);
							})
						)}
					</div>

					{/* Footer */}
					{notifications.length > 0 && (
						<div className="border-t border-white/5 px-4 py-2.5 text-center">
							<button
								onClick={fetchNotifications}
								className="text-xs font-medium text-zinc-500 transition-colors hover:text-neon-cyan"
							>
								Refresh notifications
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
