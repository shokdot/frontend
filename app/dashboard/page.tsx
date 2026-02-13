"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
	listFriends,
	getMyProfile,
	getPlayerStats,
	getPlayerRank,
	getMatchHistory,
	getLeaderboard,
	getUserById,
	type ApiFriend,
	type ApiUserProfile,
	type ApiPlayerStats,
	type ApiPlayerRank,
} from "@/lib/api";
import { useStatusMap, mapBackendStatus, type UserStatus } from "../components/StatusProvider";

/* ──────────────────────── Icons ──────────────────────── */

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

function SwordsIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
			<line x1="13" y1="19" x2="19" y2="13" />
			<line x1="16" y1="16" x2="20" y2="20" />
			<line x1="19" y1="21" x2="21" y2="19" />
			<polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
			<line x1="5" y1="14" x2="9" y2="18" />
			<line x1="7" y1="17" x2="4" y2="20" />
			<line x1="3" y1="19" x2="5" y2="21" />
		</svg>
	);
}

function TargetIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<circle cx="12" cy="12" r="6" />
			<circle cx="12" cy="12" r="2" />
		</svg>
	);
}

function UserEditIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M11 21H4a2 2 0 01-2-2v-1a5 5 0 015-5h2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M17.5 12.5l-1.4 1.4a2 2 0 00-.5.9l-.3 1.5a.5.5 0 00.6.6l1.5-.3a2 2 0 00.9-.5l1.4-1.4a1.4 1.4 0 00-2.2-2.2z" />
		</svg>
	);
}

function FlameIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
		</svg>
	);
}

function PlayIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M8 5v14l11-7z" />
		</svg>
	);
}

function ArrowRightIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12h14M12 5l7 7-7 7" />
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

/* ──────────────────────── Stat Card ──────────────────────── */

function StatCard({
	icon,
	label,
	value,
	subValue,
	glowColor = "cyan",
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	subValue?: string;
	glowColor?: "cyan" | "purple" | "pink" | "green";
}) {
	const colorMap = {
		cyan: {
			iconBg: "bg-neon-cyan/10 text-neon-cyan",
			border: "hover:border-neon-cyan/20",
			glow: "hover:shadow-[0_0_25px_rgba(0,240,255,0.06)]",
			sub: "text-neon-cyan",
		},
		purple: {
			iconBg: "bg-accent/10 text-accent-light",
			border: "hover:border-accent/20",
			glow: "hover:shadow-[0_0_25px_rgba(139,92,246,0.06)]",
			sub: "text-accent-light",
		},
		pink: {
			iconBg: "bg-neon-pink/10 text-neon-pink",
			border: "hover:border-neon-pink/20",
			glow: "hover:shadow-[0_0_25px_rgba(224,64,251,0.06)]",
			sub: "text-neon-pink",
		},
		green: {
			iconBg: "bg-emerald-500/10 text-emerald-400",
			border: "hover:border-emerald-500/20",
			glow: "hover:shadow-[0_0_25px_rgba(52,211,153,0.06)]",
			sub: "text-emerald-400",
		},
	};

	const c = colorMap[glowColor];

	return (
		<div
			className={`rounded-2xl border border-white/5 bg-surface-light p-5 transition-all duration-300 sm:p-6 ${c.border} ${c.glow}`}
		>
			<div className="flex items-center justify-between">
				<div
					className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg}`}
				>
					{icon}
				</div>
				{subValue && (
					<span className={`text-xs font-medium ${c.sub}`}>{subValue}</span>
				)}
			</div>
			<div className="mt-4">
				<p className="text-2xl font-bold text-white">{value}</p>
				<p className="mt-0.5 text-sm text-zinc-500">{label}</p>
			</div>
		</div>
	);
}

/* ──────────────────────── Helpers ──────────────────────── */

function timeAgo(isoDate: string): string {
	const seconds = Math.floor(
		(Date.now() - new Date(isoDate).getTime()) / 1000,
	);
	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days === 1) return "Yesterday";
	return `${days} days ago`;
}

function formatDuration(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ──────────────────────── Match Row ──────────────────────── */

interface ResolvedMatch {
	id: string;
	opponentName: string;
	result: "win" | "loss" | "draw";
	score: string;
	date: string;
	duration: string;
	gameMode: string;
}

const AI_OPPONENT_IDS = new Set(["ai_easy", "ai_medium", "ai_hard"]);
const AI_MODE_LABELS: Record<string, { label: string; color: string }> = {
	ai_easy: { label: "Easy", color: "text-emerald-400 bg-emerald-500/10" },
	ai_medium: { label: "Medium", color: "text-amber-400 bg-amber-500/10" },
	ai_hard: { label: "Hard", color: "text-red-400 bg-red-500/10" },
};

function MatchRow({ match }: { match: ResolvedMatch }) {
	const isWin = match.result === "win";
	const isDraw = match.result === "draw";

	return (
		<div className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter">
			{/* Result indicator */}
			<div
				className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isDraw
					? "bg-zinc-500/10 text-zinc-400"
					: isWin
						? "bg-emerald-500/10 text-emerald-400"
						: "bg-red-500/10 text-red-400"
					}`}
			>
				{isDraw ? "D" : isWin ? "W" : "L"}
			</div>

			{/* Opponent & date */}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<p className="truncate text-sm font-medium text-white">
						vs {match.opponentName}
					</p>
					{match.gameMode.startsWith("ai_") && AI_MODE_LABELS[match.gameMode] && (
						<span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${AI_MODE_LABELS[match.gameMode].color}`}>
							{AI_MODE_LABELS[match.gameMode].label}
						</span>
					)}
				</div>
				<p className="text-xs text-zinc-500">{match.date}</p>
			</div>

			{/* Score */}
			<div className="text-right">
				<p
					className={`text-sm font-semibold ${isDraw
						? "text-zinc-400"
						: isWin
							? "text-emerald-400"
							: "text-red-400"
						}`}
				>
					{match.score}
				</p>
				<p className="text-xs text-zinc-500">{match.duration}</p>
			</div>
		</div>
	);
}

/* ──────────────────────── Online Friend ──────────────────────── */

type OnlineStatus = "online" | "in-game" | "idle";

interface FriendData {
	userId: string;
	name: string;
	status: OnlineStatus;
	avatar: string;
	avatarUrl: string | null;
}

function FriendRow({ friend }: { friend: FriendData }) {
	const statusColors: Record<OnlineStatus, string> = {
		online: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
		"in-game": "bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]",
		idle: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
	};

	const statusLabels: Record<OnlineStatus, string> = {
		online: "Online",
		"in-game": "In Game",
		idle: "Idle",
	};

	return (
		<Link
			href={`/dashboard/player/${friend.name}`}
			className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-white/5"
		>
			{/* Avatar */}
			<div className="relative flex-shrink-0">
				{friend.avatarUrl ? (
					<img src={friend.avatarUrl} alt={friend.avatar} className="h-8 w-8 rounded-full object-cover" />
				) : (
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent-light">
						{friend.avatar}
					</div>
				)}
				<span
					className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface-light ${statusColors[friend.status]}`}
				/>
			</div>

			{/* Info */}
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium text-zinc-300">
					{friend.name}
				</p>
				<p className="text-xs text-zinc-500">{statusLabels[friend.status]}</p>
			</div>

			{/* Challenge button */}
			{friend.status === "online" && (
				<span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent-light transition-colors hover:bg-accent/20">
					Invite
				</span>
			)}
		</Link>
	);
}

/* ──────────────────────── Leaderboard Row ──────────────────────── */

interface LeaderboardEntry {
	rank: number;
	name: string;
	username: string;
	avatar: string;
	avatarUrl: string | null;
	wins: number;
	elo: number;
	isCurrentUser: boolean;
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
	const isUser = entry.isCurrentUser;
	const rankColors: Record<number, string> = {
		1: "text-amber-400",
		2: "text-zinc-300",
		3: "text-amber-600",
	};

	return (
		<Link
			href={isUser ? "/dashboard/profile" : `/dashboard/player/${entry.username}`}
			className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isUser
				? "bg-accent/5 ring-1 ring-accent/20"
				: "hover:bg-white/5"
				}`}
		>
			<span
				className={`w-5 text-center text-sm font-bold ${rankColors[entry.rank] || "text-zinc-500"
					}`}
			>
				{entry.rank}
			</span>
			{entry.avatarUrl ? (
				<img src={entry.avatarUrl} alt={entry.name} className={`h-7 w-7 rounded-full object-cover ${isUser ? "ring-1 ring-accent/30" : ""}`} />
			) : (
				<div
					className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isUser
						? "bg-accent/20 text-accent-light ring-1 ring-accent/30"
						: "bg-white/5 text-zinc-400"
						}`}
				>
					{entry.avatar}
				</div>
			)}
			<div className="min-w-0 flex-1">
				<p
					className={`truncate text-sm font-medium ${isUser ? "text-accent-light" : "text-zinc-300"
						}`}
				>
					{entry.name}
					{isUser && <span className="ml-1 text-xs text-accent/60">(you)</span>}
				</p>
				<p className="truncate text-[10px] text-zinc-500">@{entry.username}</p>
			</div>
			<span className="text-xs text-zinc-500">{entry.elo} ELO</span>
		</Link>
	);
}

/* ──────────────────────── Skeleton Loaders ──────────────────────── */

function MatchRowSkeleton() {
	return (
		<div className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3">
			<div className="h-9 w-9 animate-pulse rounded-lg bg-surface-lighter" />
			<div className="min-w-0 flex-1 space-y-2">
				<div className="h-4 w-28 animate-pulse rounded bg-surface-lighter" />
				<div className="h-3 w-16 animate-pulse rounded bg-surface-lighter" />
			</div>
			<div className="space-y-2 text-right">
				<div className="ml-auto h-4 w-14 animate-pulse rounded bg-surface-lighter" />
				<div className="ml-auto h-3 w-10 animate-pulse rounded bg-surface-lighter" />
			</div>
		</div>
	);
}

function StatCardSkeleton() {
	return (
		<div className="rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
			<div className="flex items-center justify-between">
				<div className="h-10 w-10 animate-pulse rounded-xl bg-surface-lighter" />
				<div className="h-4 w-12 animate-pulse rounded bg-surface-lighter" />
			</div>
			<div className="mt-4 space-y-2">
				<div className="h-7 w-16 animate-pulse rounded bg-surface-lighter" />
				<div className="h-4 w-20 animate-pulse rounded bg-surface-lighter" />
			</div>
		</div>
	);
}

/* ──────────────────────── Page ──────────────────────── */

export default function DashboardPage() {
	const liveStatuses = useStatusMap();
	const [rawFriends, setRawFriends] = useState<(FriendData & { apiStatus: UserStatus })[]>([]);
	const [friendsLoading, setFriendsLoading] = useState(true);

	const [profile, setProfile] = useState<ApiUserProfile | null>(null);
	const [stats, setStats] = useState<ApiPlayerStats | null>(null);
	const [rank, setRank] = useState<ApiPlayerRank | null>(null);
	const [recentMatches, setRecentMatches] = useState<ResolvedMatch[]>([]);
	const [matchesLoading, setMatchesLoading] = useState(true);
	const [statsLoading, setStatsLoading] = useState(true);
	const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
	const [leaderboardLoading, setLeaderboardLoading] = useState(true);

	const fetchCoreData = useCallback(async () => {
		try {
			setMatchesLoading(true);
			setStatsLoading(true);

			// 1. Get user profile (need userId for other calls)
			const profileRes = await getMyProfile();
			const profileData = profileRes.data;
			setProfile(profileData);

			// 2. Fetch stats, rank, and match history in parallel
			const [statsRes, rankRes, historyRes] = await Promise.allSettled([
				getPlayerStats(profileData.userId),
				getPlayerRank(profileData.userId),
				getMatchHistory(profileData.userId, 1, 5),
			]);

			if (statsRes.status === "fulfilled") {
				setStats(statsRes.value.data);
			}
			setStatsLoading(false);

			if (rankRes.status === "fulfilled") {
				setRank(rankRes.value.data);
			}

			// 3. Resolve match opponent usernames
			if (historyRes.status === "fulfilled") {
				const rawMatches = historyRes.value.data;
				const opponentIds = new Set(
					rawMatches
						.map((m) => m.playerAId === profileData.userId ? m.playerBId : m.playerAId)
						.filter((id) => !AI_OPPONENT_IDS.has(id)),
				);

				const userCache = new Map<string, string>();
				await Promise.allSettled(
					[...opponentIds].map(async (id) => {
						try {
							const res = await getUserById(id);
							userCache.set(id, res.data.username);
						} catch {
							userCache.set(id, "Unknown");
						}
					}),
				);

				const resolved: ResolvedMatch[] = rawMatches.map((m) => {
					const isPlayerA = m.playerAId === profileData.userId;
					const opponentId = isPlayerA ? m.playerBId : m.playerAId;
					const myScore = isPlayerA ? m.scoreA : m.scoreB;
					const opScore = isPlayerA ? m.scoreB : m.scoreA;
					const gameMode = m.gameMode || "online";

					let result: "win" | "loss" | "draw";
					if (m.winnerId === profileData.userId) result = "win";
					else if (m.winnerId === null && gameMode.startsWith("ai_")) result = "loss";
					else if (m.winnerId === null) result = "draw";
					else result = "loss";

					let opponentName: string;
					if (AI_OPPONENT_IDS.has(opponentId) || gameMode.startsWith("ai_")) {
						opponentName = "AI";
					} else {
						opponentName = userCache.get(opponentId) || "Unknown";
					}

					return {
						id: m.id,
						opponentName,
						result,
						score: `${myScore} - ${opScore}`,
						date: timeAgo(m.playedAt),
						duration: formatDuration(m.duration),
						gameMode,
					};
				});

				setRecentMatches(resolved);
			}
		} catch {
			// Profile load failed — non-critical, stats/matches stay empty
		} finally {
			setMatchesLoading(false);
			setStatsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCoreData();
	}, [fetchCoreData]);

	useEffect(() => {
		listFriends("accepted")
			.then((res) => {
				const friends = res.data.friends.map((f) => ({
					userId: f.userId,
					name: f.username,
					avatar: f.username.slice(0, 2).toUpperCase(),
					avatarUrl: f.avatarUrl,
					status: mapBackendStatus(f.onlineStatus) as OnlineStatus,
					apiStatus: mapBackendStatus(f.onlineStatus),
				}));
				setRawFriends(friends);
			})
			.catch(() => {
				// Silently fail — widget is non-critical
			})
			.finally(() => setFriendsLoading(false));
	}, []);

	// Compute online friends using live statuses from WebSocket
	const onlineFriends = useMemo(() => {
		return rawFriends
			.map((f) => {
				const liveStatus = liveStatuses.get(f.userId) ?? f.apiStatus;
				return { ...f, status: liveStatus as OnlineStatus };
			})
			.filter((f) => (f.status as string) !== "offline");
	}, [rawFriends, liveStatuses]);

	// Fetch leaderboard preview (top 5) — runs after profile is available
	useEffect(() => {
		(async () => {
			try {
				const leaderboardRes = await getLeaderboard(5, 0);
				const entries = leaderboardRes.data;

				const myUserId = profile?.userId ?? null;

				// Resolve usernames in parallel
				const userCache = new Map<string, ApiUserProfile>();
				await Promise.allSettled(
					entries.map(async (entry) => {
						try {
							const res = await getUserById(entry.userId);
							userCache.set(entry.userId, res.data);
						} catch {
							// fallback handled below
						}
					}),
				);

				const resolved: LeaderboardEntry[] = entries.map((entry) => {
					const user = userCache.get(entry.userId);
					const name = user?.displayName || user?.username || "Unknown";
					const username = user?.username || "Unknown";
					return {
						rank: entry.rank,
						name,
						username,
						avatar: name.slice(0, 2).toUpperCase(),
						avatarUrl: user?.avatarUrl ?? null,
						wins: entry.wins,
						elo: entry.elo,
						isCurrentUser: entry.userId === myUserId,
					};
				});

				setTopPlayers(resolved);
			} catch {
				// Non-critical widget
			} finally {
				setLeaderboardLoading(false);
			}
		})();
	}, [profile]);

	// Derived stats
	const wins = stats?.wins ?? 0;
	const losses = stats?.losses ?? 0;
	const draws = stats?.draws ?? 0;
	const totalMatches = wins + losses + draws;
	const winRate =
		totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : "0.0";
	const playerRank = rank?.rank ?? 0;
	const displayName =
		profile?.displayName || profile?.username || "Player";

	return (
		<div className="relative">
			{/* Background effects */}
			<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

			<div className="relative z-10 p-4 sm:p-6 lg:p-8">
				{/* ── Welcome banner ── */}
				<div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-br from-surface-lighter via-accent/5 to-surface-lighter p-6 neon-box-purple sm:p-8">
					<div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/15 blur-[80px]" />
					<div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-neon-cyan/10 blur-[60px]" />
					<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

					<div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold text-white sm:text-3xl">
								Welcome back,{" "}
								{profile ? (
									<span className="text-accent neon-text-purple">
										{displayName}
									</span>
								) : (
									<span className="inline-block h-8 w-36 animate-pulse rounded-md bg-accent/20 align-middle" />
								)}
							</h1>
							<p className="mt-1 text-sm text-zinc-400">
								Ready for your next match?
								{playerRank > 0 && (
									<>
										{" "}Your current rank is{" "}
										<span className="font-semibold text-neon-cyan">
											#{playerRank}
										</span>
									</>
								)}
							</p>
						</div>
						<Link
							href="/dashboard/play"
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] sm:w-auto"
						>
							<PlayIcon className="h-4 w-4" />
							Play Now
						</Link>
					</div>
				</div>

				{/* ── Stats grid ── */}
				<div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
					{statsLoading ? (
						<>
							<StatCardSkeleton />
							<StatCardSkeleton />
							<StatCardSkeleton />
							<StatCardSkeleton />
						</>
					) : (
						<>
							<StatCard
								icon={<TrophyIcon className="h-5 w-5" />}
								label="Total Wins"
								value={String(wins)}
								glowColor="purple"
							/>
							<StatCard
								icon={<SwordsIcon className="h-5 w-5" />}
								label="Total Matches"
								value={String(totalMatches)}
								glowColor="cyan"
							/>
							<StatCard
								icon={<TargetIcon className="h-5 w-5" />}
								label="Win Rate"
								value={`${winRate}%`}
								glowColor="green"
							/>
							<StatCard
								icon={<FlameIcon className="h-5 w-5" />}
								label="ELO Rating"
								value={String(stats?.elo ?? 0)}
								glowColor="pink"
							/>
						</>
					)}
				</div>

				{/* ── Main content grid ── */}
				<div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
					{/* Left: Recent Matches (2 cols on xl) */}
					<div className="xl:col-span-2">
						<div className="rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
							<div className="mb-4 flex items-center justify-between">
								<h2 className="text-lg font-semibold text-white">
									Recent Matches
								</h2>
								<Link
									href="/dashboard/history"
									className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-neon-cyan"
								>
									View all
									<ArrowRightIcon className="h-3 w-3" />
								</Link>
							</div>

							{matchesLoading ? (
								<div className="space-y-2">
									{[...Array(5)].map((_, i) => (
										<MatchRowSkeleton key={i} />
									))}
								</div>
							) : recentMatches.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-10">
									<SwordsIcon className="mb-3 h-10 w-10 text-zinc-600" />
									<p className="text-sm font-medium text-zinc-400">
										No matches yet
									</p>
									<p className="mt-1 text-xs text-zinc-500">
										Play your first game to see your history here!
									</p>
									<Link
										href="/dashboard/play"
										className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-xs font-medium text-accent-light transition-colors hover:bg-accent/20"
									>
										<PlayIcon className="h-3.5 w-3.5" />
										Find a Match
									</Link>
								</div>
							) : (
								<div className="space-y-2">
									{recentMatches.map((match) => (
										<MatchRow key={match.id} match={match} />
									))}
								</div>
							)}
						</div>
					</div>

					{/* Right: sidebar widgets */}
					<div className="space-y-6">
						{/* Online friends */}
						<div className="rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="text-lg font-semibold text-white">
									Friends Online
								</h2>
								<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
									{onlineFriends.length}
								</span>
							</div>
							{friendsLoading ? (
								<div className="flex justify-center py-4">
									<svg className="h-5 w-5 animate-spin text-zinc-500" viewBox="0 0 24 24" fill="none">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
									</svg>
								</div>
							) : onlineFriends.length > 0 ? (
								<div className="space-y-0.5">
									{onlineFriends.map((friend) => (
										<FriendRow key={friend.userId} friend={friend} />
									))}
								</div>
							) : (
								<p className="py-4 text-center text-xs text-zinc-500">No friends online</p>
							)}
						</div>

						{/* Leaderboard preview */}
						<div className="rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="text-lg font-semibold text-white">
									Leaderboard
								</h2>
								<Link
									href="/dashboard/leaderboard"
									className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-neon-cyan"
								>
									Full board
									<ArrowRightIcon className="h-3 w-3" />
								</Link>
							</div>
							{leaderboardLoading ? (
								<div className="flex justify-center py-4">
									<svg className="h-5 w-5 animate-spin text-zinc-500" viewBox="0 0 24 24" fill="none">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
									</svg>
								</div>
							) : topPlayers.length > 0 ? (
								<div className="space-y-0.5">
									{topPlayers.map((entry) => (
										<LeaderboardRow key={entry.rank} entry={entry} />
									))}
								</div>
							) : (
								<p className="py-4 text-center text-xs text-zinc-500">No players ranked yet</p>
							)}
						</div>

						{/* Quick actions */}
						<div className="rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
							<h2 className="mb-3 text-lg font-semibold text-white">
								Quick Actions
							</h2>
							<div className="space-y-2">
								<Link
									href="/dashboard/play"
									className="flex items-center gap-3 rounded-xl border border-neon-cyan/10 bg-neon-cyan/5 px-4 py-3 text-sm font-medium text-neon-cyan transition-all hover:border-neon-cyan/25 hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.08)]"
								>
									<PlayIcon className="h-4 w-4" />
									Find a Match
								</Link>
								<Link
									href="/dashboard/chat"
									className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface-lighter px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-white/10 hover:text-white"
								>
									<ChatBubbleIcon className="h-4 w-4 text-zinc-500" />
									Open Chat
								</Link>
								<Link
									href="/dashboard/settings"
									className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface-lighter px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-white/10 hover:text-white"
								>
									<UserEditIcon className="h-4 w-4 text-zinc-500" />
									Edit Profile
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
