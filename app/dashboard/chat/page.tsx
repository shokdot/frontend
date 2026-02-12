"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import Link from "next/link";
import { useChat, type ChatMessage } from "../../components/ChatProvider";
import { useLiveStatus, mapBackendStatus, type UserStatus } from "../../components/StatusProvider";
import {
	getConversations,
	getConversationMessages,
	deleteConversation,
	getUserById,
	getMyProfile,
	searchUsers,
	listFriends,
	sendFriendRequest,
	removeFriend,
	acceptFriendRequest,
	listBlocked,
	blockUser,
	unblockUser,
	type ApiConversation,
	type ApiChatMessage,
	type ApiUserProfile,
} from "@/lib/api";

/* ──────────────────────── Icons ──────────────────────── */

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="11" cy="11" r="8" />
			<path d="M21 21l-4.35-4.35" />
		</svg>
	);
}

function SendIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
		</svg>
	);
}

function ChatBubbleIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
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

function ChevronLeftIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="15 18 9 12 15 6" />
		</svg>
	);
}

function EllipsisIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<circle cx="5" cy="12" r="2" />
			<circle cx="12" cy="12" r="2" />
			<circle cx="19" cy="12" r="2" />
		</svg>
	);
}

function PenSquareIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
		</svg>
	);
}

function PersonIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
		</svg>
	);
}

function TrashIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
			<path d="M10 11v6" />
			<path d="M14 11v6" />
			<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
		</svg>
	);
}

function ShieldBanIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<line x1="4.5" y1="4.5" x2="19.5" y2="19.5" />
		</svg>
	);
}

function XIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
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

function UserCheckIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<polyline points="16 11 18 13 22 9" />
		</svg>
	);
}

function ClockIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}

/* ──────────────────────── Types ──────────────────────── */

type Status = UserStatus;

interface ConversationDisplay {
	partnerId: string;
	name: string;
	username: string;
	avatar: string;
	avatarUrl: string | null;
	status: Status;
	lastMessage: string;
	lastTime: string;
	unreadCount: number;
}

interface MessageDisplay {
	id: string;
	sender: string;
	avatar: string;
	avatarUrl: string | null;
	content: string;
	time: string;
	sentAt: string; // raw ISO string for grouping logic
	isOwn: boolean;
}

/* ──────────────────────── Status Helpers ──────────────────────── */

const statusColors: Record<Status, string> = {
	online: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
	"in-game": "bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]",
	idle: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
	offline: "bg-zinc-600",
};

const statusLabels: Record<Status, string> = {
	online: "Online",
	"in-game": "In Game",
	idle: "Idle",
	offline: "Offline",
};

function getInitials(name: string): string {
	return name
		.split(/\s+/)
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function formatTime(isoString: string): string {
	const date = new Date(isoString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "now";
	if (diffMins < 60) return `${diffMins}m`;
	if (diffHours < 24) {
		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	}
	if (diffDays < 7) return `${diffDays}d`;
	return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatMessageTime(isoString: string): string {
	return new Date(isoString).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

/* ──────────────────────── Message Grouping ──────────────────────── */

const MESSAGE_GROUP_GAP_MS = 5 * 60 * 1000; // 5 minutes

/** True when consecutive messages are from different senders or have a >5 min gap */
function isNewGroup(current: MessageDisplay, previous: MessageDisplay | undefined): boolean {
	if (!previous) return true;
	if (current.isOwn !== previous.isOwn) return true;
	return new Date(current.sentAt).getTime() - new Date(previous.sentAt).getTime() > MESSAGE_GROUP_GAP_MS;
}

/** True when there should be a visible timestamp after this message (last in group) */
function shouldShowTimestamp(current: MessageDisplay, next: MessageDisplay | undefined): boolean {
	if (!next) return true; // last message always shows time
	if (current.isOwn !== next.isOwn) return true; // sender changes
	return new Date(next.sentAt).getTime() - new Date(current.sentAt).getTime() > MESSAGE_GROUP_GAP_MS;
}

/** True when the date changes between two consecutive messages */
function shouldShowDateSeparator(current: MessageDisplay, previous: MessageDisplay | undefined): boolean {
	if (!previous) return true; // always show date before first message
	const prevDate = new Date(previous.sentAt);
	const currDate = new Date(current.sentAt);
	return (
		prevDate.getFullYear() !== currDate.getFullYear() ||
		prevDate.getMonth() !== currDate.getMonth() ||
		prevDate.getDate() !== currDate.getDate()
	);
}

function formatDateSeparator(isoString: string): string {
	const date = new Date(isoString);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const diffDays = Math.round((today.getTime() - msgDay.getTime()) / 86400000);

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return date.toLocaleDateString([], { weekday: "long" });
	return date.toLocaleDateString([], { month: "long", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
}

/* ──────────────────────── Conversation Item ──────────────────────── */

function ConversationItem({
	convo,
	isActive,
	onClick,
}: {
	convo: ConversationDisplay;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-all ${isActive
				? "bg-accent/10 shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]"
				: "hover:bg-white/5"
				}`}
		>
			{/* Avatar */}
			<div className="relative flex-shrink-0">
				{convo.avatarUrl ? (
					<img
						src={convo.avatarUrl}
						alt={convo.name}
						className="h-9 w-9 rounded-full object-cover"
					/>
				) : (
					<div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${isActive ? "bg-accent/20 text-accent-light" : "bg-white/5 text-zinc-400"
						}`}>
						{convo.avatar}
					</div>
				)}
				<span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface-light ${statusColors[convo.status]}`} />
			</div>

			{/* Info */}
			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<p className={`truncate text-sm font-medium ${isActive ? "text-accent-light" : "text-zinc-200"}`}>
						{convo.name}
					</p>
					{convo.unreadCount > 0 ? (
						<span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
							{convo.unreadCount > 99 ? "99+" : convo.unreadCount}
						</span>
					) : (
						<span className="flex-shrink-0 text-[11px] text-zinc-600">{convo.lastTime}</span>
					)}
				</div>
				<p className={`mt-0.5 truncate text-xs ${convo.unreadCount > 0 ? "font-medium text-zinc-300" : "text-zinc-500"}`}>{convo.lastMessage}</p>
			</div>
		</button>
	);
}

/* ──────────────────────── Date Separator ──────────────────────── */

function DateSeparator({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-3 py-2">
			<div className="h-px flex-1 bg-white/5" />
			<span className="text-[11px] font-medium text-zinc-500">{label}</span>
			<div className="h-px flex-1 bg-white/5" />
		</div>
	);
}

/* ──────────────────────── Message Bubble ──────────────────────── */

function MessageBubble({
	message,
	isFirstInGroup,
	showTimestamp,
}: {
	message: MessageDisplay;
	isFirstInGroup: boolean;
	showTimestamp: boolean;
}) {
	if (message.isOwn) {
		return (
			<div className={`flex justify-end gap-2 ${isFirstInGroup ? "mt-3" : "mt-0.5"}`}>
				<div className="max-w-[75%]">
					<div className={`bg-accent/15 px-4 py-2 ring-1 ring-accent/10 ${isFirstInGroup ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-r-md"
						}`}>
						<p className="text-sm leading-relaxed text-zinc-200">{message.content}</p>
					</div>
					{showTimestamp && (
						<p className="mt-1 text-right text-[11px] text-zinc-600">{message.time}</p>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className={`flex gap-2.5 ${isFirstInGroup ? "mt-3" : "mt-0.5"}`}>
			{/* Avatar - only visible for first message in group, invisible spacer otherwise */}
			{isFirstInGroup ? (
				message.avatarUrl ? (
					<img
						src={message.avatarUrl}
						alt={message.sender}
						className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
					/>
				) : (
					<div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
						<PersonIcon className="h-4 w-4 text-zinc-400" />
					</div>
				)
			) : (
				<div className="w-7 flex-shrink-0" />
			)}
			<div className="max-w-[75%]">
				<div className={`bg-surface-lighter px-4 py-2 ring-1 ring-white/5 ${isFirstInGroup ? "rounded-2xl rounded-bl-md" : "rounded-2xl rounded-l-md"
					}`}>
					<p className="text-sm leading-relaxed text-zinc-200">{message.content}</p>
				</div>
				{showTimestamp && (
					<p className="mt-1 text-[11px] text-zinc-600">{message.time}</p>
				)}
			</div>
		</div>
	);
}

/* ──────────────────────── Empty State ──────────────────────── */

function EmptyState() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<div className="flex flex-col items-center text-center">
				<ChatBubbleIcon className="mb-3 h-10 w-10 text-zinc-600" />
				<p className="text-sm font-medium text-zinc-400">No conversations yet</p>
				<p className="mt-1 text-xs text-zinc-600">
					Send a message to a friend to start chatting
				</p>
			</div>
		</div>
	);
}

/* ──────────────────────── Confirm Dialog ──────────────────────── */

function ConfirmDialog({
	title,
	description,
	confirmLabel,
	onConfirm,
	onCancel,
	loading,
}: {
	title: string;
	description: string;
	confirmLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onCancel}>
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
			<div
				className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-surface-light p-6 shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<h3 className="text-base font-semibold text-white">{title}</h3>
				<p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
				<div className="mt-5 flex justify-end gap-2">
					<button
						onClick={onCancel}
						className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:opacity-50"
					>
						{loading ? "..." : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

/* ──────────────────────── Live Status Wrapper ──────────────────────── */

function ConversationItemWithStatus({
	convo,
	isActive,
	onClick,
}: {
	convo: ConversationDisplay;
	isActive: boolean;
	onClick: () => void;
}) {
	const liveStatus = useLiveStatus(convo.partnerId, convo.status);
	return (
		<ConversationItem
			convo={{ ...convo, status: liveStatus }}
			isActive={isActive}
			onClick={onClick}
		/>
	);
}

/* ──────────────────────── New Message Modal ──────────────────────── */

function NewMessageModal({
	onSelect,
	onClose,
	existingPartnerIds,
}: {
	onSelect: (user: ApiUserProfile) => void;
	onClose: () => void;
	existingPartnerIds: Set<string>;
}) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<{ userId: string; username: string; avatarUrl: string | null }[]>([]);
	const [searching, setSearching] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	// Load friends as default suggestions
	useEffect(() => {
		listFriends("accepted")
			.then((res) => {
				setResults(
					res.data.friends.map((f) => ({
						userId: f.userId,
						username: f.username,
						avatarUrl: f.avatarUrl,
					})),
				);
				setLoaded(true);
			})
			.catch(() => setLoaded(true));
	}, []);

	// Focus input on mount
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	function handleSearch(value: string) {
		setQuery(value);

		if (debounceRef.current) clearTimeout(debounceRef.current);

		if (!value.trim()) {
			// Reset to friends list
			listFriends("accepted")
				.then((res) =>
					setResults(
						res.data.friends.map((f) => ({
							userId: f.userId,
							username: f.username,
							avatarUrl: f.avatarUrl,
						})),
					),
				)
				.catch(() => { });
			return;
		}

		debounceRef.current = setTimeout(async () => {
			setSearching(true);
			try {
				const res = await searchUsers(value.trim());
				setResults(
					res.data.results.map((u) => ({
						userId: u.userId,
						username: u.username,
						avatarUrl: u.avatarUrl,
					})),
				);
			} catch {
				setResults([]);
			} finally {
				setSearching(false);
			}
		}, 300);
	}

	async function handleSelect(user: { userId: string; username: string; avatarUrl: string | null }) {
		try {
			const res = await getUserById(user.userId);
			onSelect(res.data);
		} catch {
			// Fallback with what we have
			onSelect({
				userId: user.userId,
				username: user.username,
				displayName: null,
				bio: null,
				avatarUrl: user.avatarUrl,
				createdAt: "",
				updatedAt: "",
			});
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={onClose}>
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
			<div
				className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-surface-light shadow-2xl shadow-accent/10"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
					<h3 className="text-sm font-semibold text-white">New Message</h3>
					<button
						onClick={onClose}
						className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
					>
						<XIcon className="h-4 w-4" />
					</button>
				</div>

				{/* Search */}
				<div className="px-5 py-3">
					<div className="relative">
						<SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
						<input
							ref={inputRef}
							type="text"
							placeholder="Search by username..."
							value={query}
							onChange={(e) => handleSearch(e.target.value)}
							className="w-full rounded-lg border border-white/5 bg-surface-lighter py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
						/>
					</div>
				</div>

				{/* Results */}
				<div className="max-h-72 overflow-y-auto px-3 pb-3">
					{!loaded || searching ? (
						<div className="flex justify-center py-6">
							<div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
						</div>
					) : results.length > 0 ? (
						<div className="space-y-0.5">
							{!query.trim() && (
								<p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
									Friends
								</p>
							)}
							{results.map((user) => {
								const hasConvo = existingPartnerIds.has(user.userId);
								return (
									<button
										key={user.userId}
										onClick={() => handleSelect(user)}
										className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-white/5"
									>
										{user.avatarUrl ? (
											<img
												src={user.avatarUrl}
												alt={user.username}
												className="h-9 w-9 rounded-full object-cover"
											/>
										) : (
											<div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-zinc-400">
												{getInitials(user.username)}
											</div>
										)}
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-zinc-200">{user.username}</p>
										</div>
										{hasConvo && (
											<span className="flex-shrink-0 text-[10px] font-medium text-accent-light">Open</span>
										)}
									</button>
								);
							})}
						</div>
					) : (
						<div className="flex flex-col items-center py-8 text-center">
							<SearchIcon className="mb-2 h-5 w-5 text-zinc-600" />
							<p className="text-sm text-zinc-500">No users found</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

/* ──────────────────────── Page ──────────────────────── */

export default function ChatPage() {
	const { sendMessage, incomingMessages, clearUnread, conversationUnreads, clearConversationUnread, setActiveChatPartner } = useChat();

	// State
	const [myUserId, setMyUserId] = useState<string | null>(null);
	const [conversations, setConversations] = useState<ConversationDisplay[]>([]);
	const [activeConvo, setActiveConvo] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [messageInput, setMessageInput] = useState("");
	const [messages, setMessages] = useState<MessageDisplay[]>([]);
	const [mobileShowChat, setMobileShowChat] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [showNewMessage, setShowNewMessage] = useState(false);
	const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());

	// Clear global unread badge whenever the chat page is active
	useEffect(() => {
		clearUnread();
	}, [clearUnread, incomingMessages]);

	// Sync active conversation with ChatProvider for per-conversation unread tracking
	useEffect(() => {
		setActiveChatPartner(activeConvo);
		return () => setActiveChatPartner(null);
	}, [activeConvo, setActiveChatPartner]);

	const profileCache = useRef<Map<string, ApiUserProfile>>(new Map());
	const lastIncomingCount = useRef(0);

	// Fetch user profile with cache
	const fetchProfile = useCallback(async (userId: string): Promise<ApiUserProfile | null> => {
		if (profileCache.current.has(userId)) {
			return profileCache.current.get(userId)!;
		}
		try {
			const res = await getUserById(userId);
			profileCache.current.set(userId, res.data);
			return res.data;
		} catch {
			return null;
		}
	}, []);

	// Load my profile
	useEffect(() => {
		getMyProfile()
			.then((res) => setMyUserId(res.data.userId))
			.catch(() => { });
	}, []);

	// Load conversation list
	const loadConversations = useCallback(async () => {
		try {
			// Fetch conversations and friends statuses in parallel
			const [convRes, friendsRes] = await Promise.all([
				getConversations(),
				listFriends("accepted").catch(() => null),
			]);

			// Build a map of userId → online status from friends list
			const friendStatusMap = new Map<string, UserStatus>();
			if (friendsRes) {
				for (const f of friendsRes.data.friends) {
					friendStatusMap.set(f.userId, mapBackendStatus(f.onlineStatus));
				}
			}

			const convos: ConversationDisplay[] = [];

			for (const c of convRes.data) {
				// Skip conversations that only have GAME_INVITE messages (no actual chat)
				if (c.lastMessageType === "GAME_INVITE" && !c.lastMessage) continue;

				const profile = await fetchProfile(c.partnerId);
				const name = profile?.displayName || profile?.username || c.partnerId.slice(0, 8);
				convos.push({
					partnerId: c.partnerId,
					name,
					username: profile?.username || c.partnerId.slice(0, 8),
					avatar: getInitials(name),
					avatarUrl: profile?.avatarUrl ?? null,
					status: friendStatusMap.get(c.partnerId) ?? "offline",
					lastMessage: c.lastMessageType === "GAME_INVITE" ? "Game Invite" : c.lastMessage,
					lastTime: formatTime(c.lastMessageAt),
					unreadCount: 0,
				});
			}

			setConversations(convos);
		} catch {
			// Silently fail - user may have no conversations
		} finally {
			setLoading(false);
		}
	}, [fetchProfile]);

	// Load blocked user IDs
	const loadBlockedUsers = useCallback(async () => {
		try {
			const res = await listBlocked();
			setBlockedUserIds(new Set(res.data.blocked.map((b) => b.userId)));
		} catch {
			// Silently fail
		}
	}, []);

	useEffect(() => {
		if (myUserId) {
			loadConversations();
			loadBlockedUsers();
		}
	}, [myUserId, loadConversations, loadBlockedUsers]);

	// Deselect active conversation on Escape
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setActiveConvo(null);
				setMessages([]);
				setMessageInput("");
				setMobileShowChat(false);
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Load messages for active conversation
	useEffect(() => {
		if (!activeConvo || !myUserId) return;

		let cancelled = false;
		setLoadingMessages(true);

		(async () => {
			try {
				const res = await getConversationMessages(activeConvo);
				if (cancelled) return;

				const profile = await fetchProfile(activeConvo);
				const partnerName = profile?.displayName || profile?.username || activeConvo.slice(0, 8);
				const partnerAvatar = getInitials(partnerName);

				const partnerAvatarUrl = profile?.avatarUrl ?? null;

				const displayMessages: MessageDisplay[] = res.data
					.filter((m) => m.type === "CHAT")
					.map((m, i) => ({
						id: `${m.sentAt}-${i}`,
						sender: m.from === myUserId ? "You" : partnerName,
						avatar: m.from === myUserId ? "U" : partnerAvatar,
						avatarUrl: m.from === myUserId ? null : partnerAvatarUrl,
						content: m.content,
						time: formatMessageTime(m.sentAt),
						sentAt: m.sentAt,
						isOwn: m.from === myUserId,
					}));

				setMessages(displayMessages);
			} catch {
				setMessages([]);
			} finally {
				if (!cancelled) setLoadingMessages(false);
			}
		})();

		return () => { cancelled = true; };
	}, [activeConvo, myUserId, fetchProfile]);

	// Handle real-time incoming messages
	// Unread counts are tracked by ChatProvider; this effect handles conversation
	// metadata updates (last message, reorder) and active conversation message display.
	useEffect(() => {
		if (!myUserId) return;

		const newMessages = incomingMessages.slice(lastIncomingCount.current);
		lastIncomingCount.current = incomingMessages.length;

		if (newMessages.length === 0) return;

		for (const msg of newMessages) {
			const partnerId = msg.from;

			// Update conversation list (metadata only, unread counts come from ChatProvider)
			setConversations((prev) => {
				const existing = prev.find((c) => c.partnerId === partnerId);
				if (existing) {
					const updated = prev.map((c) =>
						c.partnerId === partnerId
							? {
								...c,
								lastMessage: msg.content,
								lastTime: formatTime(msg.sentAt),
							}
							: c,
					);
					// Move to top
					const target = updated.find((c) => c.partnerId === partnerId)!;
					return [target, ...updated.filter((c) => c.partnerId !== partnerId)];
				}

				// New conversation partner - add with placeholder, profile will be fetched
				const name = partnerId.slice(0, 8);
				const newConvo: ConversationDisplay = {
					partnerId,
					name,
					username: partnerId.slice(0, 8),
					avatar: getInitials(name),
					avatarUrl: null,
					status: "offline",
					lastMessage: msg.content,
					lastTime: formatTime(msg.sentAt),
					unreadCount: 0, // Actual count derived from ChatProvider context at render time
				};

				// Fetch profile in background to update name
				fetchProfile(partnerId).then((profile) => {
					if (profile) {
						setConversations((current) =>
							current.map((c) =>
								c.partnerId === partnerId
									? {
										...c,
										name: profile.displayName || profile.username || c.name,
										username: profile.username || c.username,
										avatar: getInitials(profile.displayName || profile.username || c.name),
										avatarUrl: profile.avatarUrl ?? null,
									}
									: c,
							),
						);
					}
				});

				return [newConvo, ...prev];
			});

			// If the message is for the active conversation, add it to messages
			if (partnerId === activeConvo) {
				const partnerProfile = profileCache.current.get(partnerId);
				const partnerName = partnerProfile?.displayName || partnerProfile?.username || partnerId.slice(0, 8);

				setMessages((prev) => [
					...prev,
					{
						id: `rt-${msg.sentAt}-${Date.now()}`,
						sender: partnerName,
						avatar: getInitials(partnerName),
						avatarUrl: partnerProfile?.avatarUrl ?? null,
						content: msg.content,
						time: formatMessageTime(msg.sentAt),
						sentAt: msg.sentAt,
						isOwn: false,
					},
				]);
			}
		}
	}, [incomingMessages, myUserId, activeConvo, fetchProfile]);


	const activeConversation = conversations.find((c) => c.partnerId === activeConvo);

	const filteredConversations = search.trim()
		? conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
		: conversations;

	function handleSend(e: React.FormEvent) {
		e.preventDefault();
		if (!messageInput.trim() || !activeConvo || !myUserId) return;

		const content = messageInput.trim();
		const sentAt = new Date().toISOString();

		// Send via WebSocket
		sendMessage(activeConvo, content);

		// Add to local messages immediately (optimistic)
		setMessages((prev) => [
			...prev,
			{
				id: `own-${Date.now()}`,
				sender: "You",
				avatar: "U",
				avatarUrl: null,
				content,
				time: formatMessageTime(sentAt),
				sentAt,
				isOwn: true,
			},
		]);

		// Update conversation list
		setConversations((prev) => {
			const updated = prev.map((c) =>
				c.partnerId === activeConvo
					? { ...c, lastMessage: content, lastTime: formatTime(sentAt) }
					: c,
			);
			const target = updated.find((c) => c.partnerId === activeConvo);
			if (target) {
				return [target, ...updated.filter((c) => c.partnerId !== activeConvo)];
			}
			return updated;
		});

		setMessageInput("");
	}

	function handleConvoSelect(partnerId: string) {
		setActiveConvo(partnerId);
		setMobileShowChat(true);
		// Clear unread in ChatProvider context (setActiveChatPartner effect also handles this)
		clearConversationUnread(partnerId);
	}

	function handleNewConversation(profile: ApiUserProfile) {
		setShowNewMessage(false);
		const existing = conversations.find((c) => c.partnerId === profile.userId);

		if (existing) {
			// Open existing conversation
			setActiveConvo(profile.userId);
			setMobileShowChat(true);
			return;
		}

		// Create new conversation entry in the list
		const name = profile.displayName || profile.username || profile.userId.slice(0, 8);
		const newConvo: ConversationDisplay = {
			partnerId: profile.userId,
			name,
			username: profile.username || profile.userId.slice(0, 8),
			avatar: getInitials(name),
			avatarUrl: profile.avatarUrl ?? null,
			status: "offline",
			lastMessage: "",
			lastTime: "",
			unreadCount: 0,
		};

		profileCache.current.set(profile.userId, profile);
		setConversations((prev) => [newConvo, ...prev]);
		setActiveConvo(profile.userId);
		setMessages([]);
		setMobileShowChat(true);
	}

	const handleBlockUser = useCallback(async (username: string, partnerId: string) => {
		try {
			await blockUser(username);
			setBlockedUserIds((prev) => new Set(prev).add(partnerId));
		} catch {
			// Silently fail
		}
	}, []);

	const handleDeleteConversation = useCallback((partnerId: string) => {
		setConversations((prev) => prev.filter((c) => c.partnerId !== partnerId));
		setActiveConvo(null);
		setMessages([]);
		setMessageInput("");
		setMobileShowChat(false);
	}, []);

	const handleUnblockUser = useCallback(async (username: string, partnerId: string) => {
		try {
			await unblockUser(username);
			setBlockedUserIds((prev) => {
				const next = new Set(prev);
				next.delete(partnerId);
				return next;
			});
		} catch {
			// Silently fail
		}
	}, []);

	const existingPartnerIds = new Set(conversations.map((c) => c.partnerId));

	if (loading) {
		return (
			<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
				<div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="relative flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
			{/* Background effects */}
			<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

			<div className="relative z-10 flex flex-1 overflow-hidden">
				{/* ── Sidebar ── */}
				<aside
					className={`flex w-full flex-col border-r border-white/5 bg-surface-light/50 backdrop-blur-sm md:w-80 md:flex-shrink-0 ${mobileShowChat ? "hidden md:flex" : "flex"
						}`}
				>
					{/* Sidebar header */}
					<div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
						<div className="flex items-center gap-2">
							<ChatBubbleIcon className="h-5 w-5 text-accent-light" />
							<h2 className="text-sm font-semibold text-white">Messages</h2>
						</div>
						<button
							onClick={() => setShowNewMessage(true)}
							className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-accent-light"
							title="New message"
						>
							<PenSquareIcon className="h-4 w-4" />
						</button>
					</div>

					{/* Search */}
					<div className="px-3 py-2">
						<div className="relative">
							<SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
							<input
								type="text"
								placeholder="Search conversations..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full rounded-lg border border-white/5 bg-surface-lighter py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
							/>
						</div>
					</div>

					{/* Conversation list */}
					<div className="flex-1 overflow-y-auto px-2 pb-2">
						{filteredConversations.length > 0 ? (
							<div className="pt-1">
								{filteredConversations.map((convo) => (
									<ConversationItemWithStatus
										key={convo.partnerId}
										convo={{
											...convo,
											unreadCount: conversationUnreads.get(convo.partnerId) || 0,
										}}
										isActive={activeConvo === convo.partnerId}
										onClick={() => handleConvoSelect(convo.partnerId)}
									/>
								))}
							</div>
						) : conversations.length === 0 ? (
							<EmptyState />
						) : (
							<div className="flex flex-col items-center py-12 text-center">
								<SearchIcon className="mb-2 h-5 w-5 text-zinc-600" />
								<p className="text-sm text-zinc-500">No conversations found</p>
							</div>
						)}
					</div>
				</aside>

				{/* ── Chat Area ── */}
				<div
					className={`flex flex-1 flex-col ${mobileShowChat ? "flex" : "hidden md:flex"
						}`}
				>
					{activeConversation ? (
						<ChatArea
							conversation={activeConversation}
							messages={messages}
							messageInput={messageInput}
							loadingMessages={loadingMessages}
							isBlocked={blockedUserIds.has(activeConversation.partnerId)}
							onBack={() => setMobileShowChat(false)}
							onInputChange={setMessageInput}
							onSend={handleSend}
							onBlock={handleBlockUser}
							onUnblock={handleUnblockUser}
							onDeleteConversation={handleDeleteConversation}
						/>
					) : (
						<div className="flex flex-1 items-center justify-center">
							<div className="flex flex-col items-center text-center">
								<ChatBubbleIcon className="mb-3 h-10 w-10 text-zinc-600" />
								<p className="text-sm font-medium text-zinc-400">Select a conversation</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* New message modal */}
			{showNewMessage && (
				<NewMessageModal
					onSelect={handleNewConversation}
					onClose={() => setShowNewMessage(false)}
					existingPartnerIds={existingPartnerIds}
				/>
			)}
		</div>
	);
}

/* ──────────────────────── Chat Area Component ──────────────────────── */

function ChatArea({
	conversation,
	messages,
	messageInput,
	loadingMessages,
	isBlocked,
	onBack,
	onInputChange,
	onSend,
	onBlock,
	onUnblock,
	onDeleteConversation,
}: {
	conversation: ConversationDisplay;
	messages: MessageDisplay[];
	messageInput: string;
	loadingMessages: boolean;
	isBlocked: boolean;
	onBack: () => void;
	onInputChange: (val: string) => void;
	onSend: (e: React.FormEvent) => void;
	onBlock: (username: string, partnerId: string) => Promise<void>;
	onUnblock: (username: string, partnerId: string) => Promise<void>;
	onDeleteConversation: (partnerId: string) => void;
}) {
	const liveStatus = useLiveStatus(conversation.partnerId, conversation.status);
	const inputRef = useRef<HTMLInputElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const hasScrolledRef = useRef(false);
	const [ready, setReady] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showBlockConfirm, setShowBlockConfirm] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [blockLoading, setBlockLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [friendStatus, setFriendStatus] = useState<"none" | "pending_outgoing" | "pending_incoming" | "accepted">("none");
	const [friendLoading, setFriendLoading] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown on click outside or Escape
	useEffect(() => {
		if (!showDropdown) return;
		function handleClick(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setShowDropdown(false);
			}
		}
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") setShowDropdown(false);
		}
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keydown", handleKey);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keydown", handleKey);
		};
	}, [showDropdown]);

	async function handleBlockConfirm() {
		setBlockLoading(true);
		await onBlock(conversation.username, conversation.partnerId);
		setBlockLoading(false);
		setShowBlockConfirm(false);
	}

	async function handleUnblock() {
		setBlockLoading(true);
		await onUnblock(conversation.username, conversation.partnerId);
		setBlockLoading(false);
	}

	async function handleDeleteConversation() {
		setDeleteLoading(true);
		try {
			await deleteConversation(conversation.partnerId);
			onDeleteConversation(conversation.partnerId);
		} catch {
			// Silently fail
		} finally {
			setDeleteLoading(false);
			setShowDeleteConfirm(false);
		}
	}

	// Fetch friend status when conversation changes
	useEffect(() => {
		let cancelled = false;
		async function fetchFriendStatus() {
			try {
				const res = await listFriends();
				if (cancelled) return;
				const friend = res.data.friends.find(
					(f) => f.username === conversation.username,
				);
				if (!friend) {
					setFriendStatus("none");
				} else if (friend.status === "accepted") {
					setFriendStatus("accepted");
				} else if (friend.direction === "outgoing") {
					setFriendStatus("pending_outgoing");
				} else {
					setFriendStatus("pending_incoming");
				}
			} catch {
				if (!cancelled) setFriendStatus("none");
			}
		}
		setFriendStatus("none");
		fetchFriendStatus();
		return () => { cancelled = true; };
	}, [conversation.partnerId, conversation.username]);

	async function handleAddFriend() {
		setFriendLoading(true);
		try {
			await sendFriendRequest(conversation.username);
			setFriendStatus("pending_outgoing");
		} catch {
			// Silently fail
		} finally {
			setFriendLoading(false);
		}
	}

	async function handleAcceptFriend() {
		setFriendLoading(true);
		try {
			await acceptFriendRequest(conversation.username);
			setFriendStatus("accepted");
		} catch {
			// Silently fail
		} finally {
			setFriendLoading(false);
		}
	}

	async function handleRemoveFriend() {
		setFriendLoading(true);
		try {
			await removeFriend(conversation.username);
			setFriendStatus("none");
		} catch {
			// Silently fail
		} finally {
			setFriendLoading(false);
		}
	}

	// Reset when conversation changes
	useEffect(() => {
		inputRef.current?.focus();
		hasScrolledRef.current = false;
		setReady(false);
	}, [conversation.partnerId]);

	// Scroll to bottom synchronously before paint to avoid flash of top messages
	useLayoutEffect(() => {
		const el = scrollContainerRef.current;
		if (!el || messages.length === 0) return;

		if (!hasScrolledRef.current) {
			el.scrollTop = el.scrollHeight;
			hasScrolledRef.current = true;
			setReady(true);
		} else {
			// New message — smooth scroll
			el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
		}
	}, [messages.length, loadingMessages]);

	return (
		<>
			{/* Chat header */}
			<div className="flex items-center justify-between border-b border-white/5 bg-surface-light/30 px-4 py-3 backdrop-blur-sm">
				<div className="flex items-center gap-3">
					{/* Mobile back */}
					<button
						onClick={onBack}
						className="rounded-lg p-1 text-zinc-400 hover:text-white md:hidden"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</button>

					{/* Avatar */}
					<div className="relative">
						{conversation.avatarUrl ? (
							<img
								src={conversation.avatarUrl}
								alt={conversation.name}
								className="h-8 w-8 rounded-full object-cover"
							/>
						) : (
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent-light">
								{conversation.avatar}
							</div>
						)}
						<span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface-light ${statusColors[liveStatus]}`} />
					</div>

					{/* Name & status */}
					<div>
						<Link
							href={`/dashboard/player/${conversation.username}`}
							className="text-sm font-semibold text-white hover:text-accent-light transition-colors"
						>
							{conversation.name}
						</Link>
						<p className="text-[11px] text-zinc-500">
							@{conversation.username} · {statusLabels[liveStatus]}
						</p>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-1">
					{!isBlocked && liveStatus === "online" && (
						<button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-neon-cyan" title="Invite to game">
							<GamepadIcon className="h-4 w-4" />
						</button>
					)}
					{!isBlocked && friendStatus === "none" && (
						<button
							onClick={handleAddFriend}
							disabled={friendLoading}
							className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-emerald-400 disabled:opacity-50"
							title="Add Friend"
						>
							<UserPlusIcon className="h-4 w-4" />
						</button>
					)}
					{!isBlocked && friendStatus === "pending_outgoing" && (
						<button
							onClick={handleRemoveFriend}
							disabled={friendLoading}
							className="rounded-lg p-2 text-amber-400/70 transition-colors hover:bg-white/5 hover:text-amber-300 disabled:opacity-50"
							title="Cancel Request"
						>
							<ClockIcon className="h-4 w-4" />
						</button>
					)}
					{!isBlocked && friendStatus === "pending_incoming" && (
						<button
							onClick={handleAcceptFriend}
							disabled={friendLoading}
							className="rounded-lg p-2 text-emerald-400 transition-colors hover:bg-white/5 hover:text-emerald-300 disabled:opacity-50"
							title="Accept Friend Request"
						>
							<UserPlusIcon className="h-4 w-4" />
						</button>
					)}
					{!isBlocked && friendStatus === "accepted" && (
						<button
							onClick={handleRemoveFriend}
							disabled={friendLoading}
							className="rounded-lg p-2 text-emerald-400 transition-colors hover:bg-white/5 hover:text-red-400 disabled:opacity-50"
							title="Unfriend"
						>
							<UserCheckIcon className="h-4 w-4" />
						</button>
					)}
					<div className="relative" ref={dropdownRef}>
						<button
							onClick={() => setShowDropdown((v) => !v)}
							className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
							title="More"
						>
							<EllipsisIcon className="h-4 w-4" />
						</button>
						{showDropdown && (
							<div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-white/10 bg-surface-light shadow-xl">
								<button
									onClick={() => {
										setShowDropdown(false);
										setShowDeleteConfirm(true);
									}}
									className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-white/5"
								>
									<TrashIcon className="h-4 w-4" />
									Delete Chat
								</button>
								<div className="mx-3 h-px bg-white/5" />
								{isBlocked ? (
									<button
										onClick={() => {
											setShowDropdown(false);
											handleUnblock();
										}}
										className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-white/5"
									>
										<ShieldBanIcon className="h-4 w-4" />
										Unblock User
									</button>
								) : (
									<button
										onClick={() => {
											setShowDropdown(false);
											setShowBlockConfirm(true);
										}}
										className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
									>
										<ShieldBanIcon className="h-4 w-4" />
										Block User
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Messages */}
			<div ref={scrollContainerRef} className={`flex-1 overflow-y-auto px-4 py-4 sm:px-6 ${!ready && !loadingMessages && messages.length > 0 ? "invisible" : ""}`}>
				{!loadingMessages && (
					<div className="mx-auto max-w-2xl">
						{/* Conversation start */}
						<div className="flex flex-col items-center pb-4 pt-2 text-center">
							{conversation.avatarUrl ? (
								<img
									src={conversation.avatarUrl}
									alt={conversation.name}
									className="h-12 w-12 rounded-full object-cover ring-2 ring-accent/20"
								/>
							) : (
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent-light ring-2 ring-accent/20">
									{conversation.avatar}
								</div>
							)}
							<p className="mt-2 text-sm font-semibold text-white">
								{conversation.name}
							</p>
							<p className="mt-0.5 text-xs text-zinc-500">
								This is the beginning of your conversation.
							</p>
						</div>

						{messages.map((msg, i) => {
							const prev = messages[i - 1];
							const next = messages[i + 1];

							return (
								<div key={msg.id}>
									{shouldShowDateSeparator(msg, prev) && (
										<DateSeparator label={formatDateSeparator(msg.sentAt)} />
									)}
									<MessageBubble
										message={msg}
										isFirstInGroup={isNewGroup(msg, prev)}
										showTimestamp={shouldShowTimestamp(msg, next)}
									/>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Message input or blocked banner */}
			{isBlocked ? (
				<div className="border-t border-white/5 bg-surface-light/30 px-4 py-3 backdrop-blur-sm sm:px-6">
					<div className="mx-auto flex max-w-2xl items-center justify-between rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-2.5">
						<div className="flex items-center gap-2.5">
							<ShieldBanIcon className="h-4 w-4 text-red-400" />
							<span className="text-sm text-zinc-400">You blocked this user</span>
						</div>
						<button
							onClick={handleUnblock}
							disabled={blockLoading}
							className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
						>
							{blockLoading ? "..." : "Unblock"}
						</button>
					</div>
				</div>
			) : (
				<div className="border-t border-white/5 bg-surface-light/30 px-4 py-3 backdrop-blur-sm sm:px-6">
					<form onSubmit={onSend} className="mx-auto flex max-w-2xl items-center gap-2">
						<input
							ref={inputRef}
							type="text"
							value={messageInput}
							onChange={(e) => onInputChange(e.target.value)}
							placeholder={`Message ${conversation.name}...`}
							className="flex-1 rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
						/>
						<button
							type="submit"
							disabled={!messageInput.trim()}
							className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
						>
							<SendIcon className="h-4 w-4" />
						</button>
					</form>
				</div>
			)}

			{/* Block confirmation dialog */}
			{showBlockConfirm && (
				<ConfirmDialog
					title={`Block @${conversation.username}?`}
					description="They won't be able to send you messages or game invites. You can unblock them anytime."
					confirmLabel="Block"
					loading={blockLoading}
					onConfirm={handleBlockConfirm}
					onCancel={() => setShowBlockConfirm(false)}
				/>
			)}

			{/* Delete chat confirmation dialog */}
			{showDeleteConfirm && (
				<ConfirmDialog
					title="Delete chat?"
					description="All messages in this conversation will be permanently deleted. This cannot be undone."
					confirmLabel="Delete"
					loading={deleteLoading}
					onConfirm={handleDeleteConversation}
					onCancel={() => setShowDeleteConfirm(false)}
				/>
			)}
		</>
	);
}
