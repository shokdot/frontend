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

/* ──────────────────────── Types ──────────────────────── */

export interface ChatMessage {
	type: string;
	from: string;
	content: string;
	sentAt: string;
}

interface ChatContextValue {
	/** Send a chat message to a user via WebSocket */
	sendMessage: (to: string, content: string) => void;
	/** Real-time incoming messages (accumulated during session) */
	incomingMessages: ChatMessage[];
	/** Whether the WebSocket is currently connected */
	connected: boolean;
	/** Number of unread incoming messages (resets on clearUnread) */
	unreadCount: number;
	/** Reset the unread counter (call when the user views the chat page) */
	clearUnread: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/* ──────────────────────── Hook ──────────────────────── */

export function useChat(): ChatContextValue {
	const ctx = useContext(ChatContext);
	if (!ctx) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return ctx;
}

/* ──────────────────────── Helpers ──────────────────────── */

function buildWsUrl(path: string, token: string): string {
	const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
	return `${proto}//${window.location.host}${path}?token=${encodeURIComponent(token)}`;
}

/* ──────────────────────── Provider ──────────────────────── */

export default function ChatProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [incomingMessages, setIncomingMessages] = useState<ChatMessage[]>([]);
	const [connected, setConnected] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(null);

	const clearUnread = useCallback(() => setUnreadCount(0), []);

	const connect = useCallback(() => {
		const token = getAccessToken();
		if (!token) return;

		// Close existing connection
		if (wsRef.current) {
			wsRef.current.onclose = null;
			wsRef.current.close();
		}

		const ws = new WebSocket(
			buildWsUrl("/api/v1/chat/ws", token),
		);
		wsRef.current = ws;

		ws.onopen = () => {
			setConnected(true);
		};

		ws.onmessage = (event) => {
			try {
				const msg = JSON.parse(event.data);
				// Handle chat messages and undelivered messages
				if (msg.type === "CHAT" && msg.from && msg.sentAt) {
					const chatMsg: ChatMessage = {
						type: msg.type,
						from: msg.from,
						content: msg.content ?? "",
						sentAt: msg.sentAt,
					};
					setIncomingMessages((prev) => [...prev, chatMsg]);
					setUnreadCount((prev) => prev + 1);
				}
				// Ignore ERROR and GAME_INVITE messages for now
			} catch {
				// Ignore malformed messages
			}
		};

		ws.onclose = () => {
			setConnected(false);
			// Reconnect after delay
			reconnectTimer.current = setTimeout(() => {
				connect();
			}, 5000);
		};

		ws.onerror = () => {
			ws.close();
		};
	}, []);

	const sendMessage = useCallback((to: string, content: string) => {
		const ws = wsRef.current;
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(
				JSON.stringify({
					type: "CHAT",
					to,
					content,
				}),
			);
		}
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

	return (
		<ChatContext.Provider value={{ sendMessage, incomingMessages, connected, unreadCount, clearUnread }}>
			{children}
		</ChatContext.Provider>
	);
}
