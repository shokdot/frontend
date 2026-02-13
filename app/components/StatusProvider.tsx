"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { getAccessToken } from "@/lib/auth";
import { listFriends } from "@/lib/api";

/* ──────────────────────── Types ──────────────────────── */

/** Frontend-facing status values */
export type UserStatus = "online" | "in-game" | "idle" | "offline";

/** WebSocket message from the status endpoint */
interface StatusChangeMessage {
	type: "friend-status-changed";
	data: {
		userId: string;
		status: string; // "ONLINE" | "IN_GAME" | "OFFLINE"
		timestamp: string;
	};
}

interface StatusContextValue {
	/** Map of userId → live frontend status */
	statuses: Map<string, UserStatus>;
}

const StatusContext = createContext<StatusContextValue | null>(null);

/* ──────────────────────── Hooks ──────────────────────── */

/**
 * Returns the live statuses map.
 * Use `statuses.get(userId)` to get a user's real-time status,
 * falling back to the API-provided status if not in the map.
 */
export function useStatusMap(): Map<string, UserStatus> {
	const ctx = useContext(StatusContext);
	if (!ctx) return new Map();
	return ctx.statuses;
}

/**
 * Convenience: get a single user's live status with a fallback.
 * Must be called at the component level (React hook rules).
 */
export function useLiveStatus(
	userId: string | undefined,
	fallback: string = "offline",
): UserStatus {
	const statuses = useStatusMap();
	if (!userId) return mapBackendStatus(fallback);
	return statuses.get(userId) ?? mapBackendStatus(fallback);
}

/* ──────────────────────── Helpers ──────────────────────── */

/** Map backend status string (ONLINE, IN_GAME, OFFLINE) to frontend format */
export function mapBackendStatus(backendStatus: string): UserStatus {
	switch (backendStatus?.toUpperCase()) {
		case "ONLINE":
			return "online";
		case "IN_GAME":
			return "in-game";
		case "IDLE":
			return "idle";
		default:
			return "offline";
	}
}

function buildWsUrl(path: string, token: string): string {
	const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
	return `${proto}//${window.location.host}${path}?token=${encodeURIComponent(token)}`;
}

/* ──────────────────────── Provider ──────────────────────── */

export default function StatusProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [statuses, setStatuses] = useState<Map<string, UserStatus>>(
		() => new Map(),
	);
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(null);

	const connect = useCallback(() => {
		const token = getAccessToken();
		if (!token) return;

		// Close existing connection gracefully
		if (wsRef.current) {
			const old = wsRef.current;
			old.onclose = null;
			old.onerror = null;
			old.onmessage = null;
			old.onopen = null;
			if (old.readyState === WebSocket.OPEN) {
				old.close();
			} else if (old.readyState === WebSocket.CONNECTING) {
				old.addEventListener("open", () => old.close(), { once: true });
			}
		}

		// Clear stale statuses — events may have been missed while disconnected
		setStatuses(new Map());

		const ws = new WebSocket(
			buildWsUrl("/api/v1/notifications/status/ws", token),
		);
		wsRef.current = ws;

		ws.onopen = () => {
			// Pre-populate the map with current friend statuses so components
			// don't have to wait for individual change events
			listFriends("accepted")
				.then((res) => {
					const batch = new Map<string, UserStatus>();
					for (const f of res.data.friends) {
						batch.set(f.userId, mapBackendStatus(f.onlineStatus));
					}
					setStatuses((prev) => {
						// Merge: any WS updates that arrived during the fetch
						// take priority over API data (they are more recent)
						const next = new Map(batch);
						for (const [k, v] of prev) {
							next.set(k, v);
						}
						return next;
					});
				})
				.catch(() => {
					// Silently fail — components will use their API fallback
				});
		};

		ws.onmessage = (event) => {
			try {
				const msg = JSON.parse(event.data) as StatusChangeMessage;
				if (msg.type === "friend-status-changed" && msg.data?.userId) {
					const status = mapBackendStatus(msg.data.status);
					setStatuses((prev) => {
						const next = new Map(prev);
						next.set(msg.data.userId, status);
						return next;
					});
				}
			} catch {
				// Ignore malformed messages
			}
		};

		ws.onclose = () => {
			// Reconnect after delay
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
				const ws = wsRef.current;
				ws.onclose = null;
				ws.onerror = null;
				ws.onmessage = null;
				ws.onopen = null;
				if (ws.readyState === WebSocket.OPEN) {
					ws.close();
				} else if (ws.readyState === WebSocket.CONNECTING) {
					ws.addEventListener("open", () => ws.close(), { once: true });
				}
			}
		};
	}, [connect]);

	return (
		<StatusContext.Provider value={{ statuses }}>
			{children}
		</StatusContext.Provider>
	);
}
