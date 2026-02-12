"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	getUserByUsername,
	getPlayerStats,
	getPlayerRank,
	getMatchHistory,
	getUserById,
	getMyProfile,
	listFriends,
	listBlocked,
	blockUser,
	unblockUser,
	sendFriendRequest,
	acceptFriendRequest,
	removeFriend,
	ApiUserProfile,
	ApiPlayerStats,
	ApiPlayerRank,
	ApiMatch,
} from "@/lib/api";
import { useLiveStatus } from "../../../components/StatusProvider";

/* ──────────────────────── Icons ──────────────────────── */

function CalendarIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="8" y1="2" x2="8" y2="6" />
			<line x1="3" y1="10" x2="21" y2="10" />
		</svg>
	);
}

function ChartIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M18 20V10M12 20V4M6 20v-6" />
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

function UserPlusIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
			<circle cx="8.5" cy="7" r="4" />
			<line x1="20" y1="8" x2="20" y2="14" />
			<line x1="23" y1="11" x2="17" y2="11" />
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

function ShieldBanIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<line x1="4.5" y1="4.5" x2="19.5" y2="19.5" />
		</svg>
	);
}

function ArrowLeftIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
	);
}

/* ──────────────────────── Status Helpers ──────────────────────── */

type Status = "online" | "in-game" | "idle" | "offline";

const statusColors: Record<string, string> = {
	online: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
	"in-game": "bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]",
	idle: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
	offline: "bg-zinc-600",
};

const statusLabels: Record<string, string> = {
	online: "Online",
	"in-game": "In Game",
	idle: "Idle",
	offline: "Offline",
};

const statusBadge: Record<string, string> = {
	online: "bg-emerald-500/10 text-emerald-400",
	"in-game": "bg-neon-cyan/10 text-neon-cyan",
	idle: "bg-amber-500/10 text-amber-400",
	offline: "bg-zinc-500/10 text-zinc-400",
};

/* ──────────────────────── Page ──────────────────────── */

export default function PlayerPage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = use(params);
	const router = useRouter();

	const [profile, setProfile] = useState<ApiUserProfile | null>(null);
	const [stats, setStats] = useState<ApiPlayerStats | null>(null);
	const [rank, setRank] = useState<ApiPlayerRank | null>(null);
	const [matches, setMatches] = useState<(ApiMatch & { opponentName?: string })[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Live status from WebSocket (called unconditionally per hook rules)
	const playerStatus = useLiveStatus(profile?.userId, (profile as any)?.status ?? "offline");

	/* ── Friend state ── */
	type FriendStatus = "none" | "pending_outgoing" | "pending_incoming" | "accepted" | "self";
	const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
	const [friendLoading, setFriendLoading] = useState(false);

	/* ── Block state ── */
	const [isBlocked, setIsBlocked] = useState(false);
	const [blockLoading, setBlockLoading] = useState(false);
	const [showBlockConfirm, setShowBlockConfirm] = useState(false);

	const loadFriendStatus = useCallback(async (targetUsername: string) => {
		try {
			const [meRes, friendsRes, pendingRes] = await Promise.allSettled([
				getMyProfile(),
				listFriends("accepted"),
				listFriends("pending"),
			]);

			// Check if this is the current user's own profile
			if (meRes.status === "fulfilled" && meRes.value.data.username === targetUsername) {
				setFriendStatus("self");
				return;
			}

			// Check accepted friends
			if (friendsRes.status === "fulfilled") {
				const isFriend = friendsRes.value.data.friends.some(
					(f) => f.username === targetUsername,
				);
				if (isFriend) {
					setFriendStatus("accepted");
					return;
				}
			}

			// Check pending requests
			if (pendingRes.status === "fulfilled") {
				const pending = pendingRes.value.data.friends.find(
					(f) => f.username === targetUsername,
				);
				if (pending) {
					setFriendStatus(pending.direction === "incoming" ? "pending_incoming" : "pending_outgoing");
					return;
				}
			}

			setFriendStatus("none");
		} catch {
			setFriendStatus("none");
		}
	}, []);

	async function handleAddFriend() {
		if (!profile) return;
		setFriendLoading(true);
		try {
			await sendFriendRequest(profile.username);
			setFriendStatus("pending_outgoing");
		} catch {
			// Silently fail — button stays in current state
		} finally {
			setFriendLoading(false);
		}
	}

	async function handleAcceptFriend() {
		if (!profile) return;
		setFriendLoading(true);
		try {
			await acceptFriendRequest(profile.username);
			setFriendStatus("accepted");
		} catch {
			// Silently fail
		} finally {
			setFriendLoading(false);
		}
	}

	async function handleRemoveFriend() {
		if (!profile) return;
		setFriendLoading(true);
		try {
			await removeFriend(profile.username);
			setFriendStatus("none");
		} catch {
			// Silently fail
		} finally {
			setFriendLoading(false);
		}
	}

	async function handleBlock() {
		if (!profile) return;
		setBlockLoading(true);
		try {
			await blockUser(profile.username);
			setIsBlocked(true);
			setFriendStatus("none"); // blocking removes friendship
			setShowBlockConfirm(false);
		} catch {
			// Silently fail
		} finally {
			setBlockLoading(false);
		}
	}

	async function handleUnblock() {
		if (!profile) return;
		setBlockLoading(true);
		try {
			await unblockUser(profile.username);
			setIsBlocked(false);
		} catch {
			// Silently fail
		} finally {
			setBlockLoading(false);
		}
	}

	const loadPlayer = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const profileRes = await getUserByUsername(username);
			const playerProfile = profileRes.data;
			setProfile(playerProfile);

			// Check friendship and block status
			loadFriendStatus(playerProfile.username);

			// Check if user is blocked
			listBlocked()
				.then((res) => {
					const blocked = res.data.blocked.some((b) => b.userId === playerProfile.userId);
					setIsBlocked(blocked);
				})
				.catch(() => { });

			// Fetch stats, rank, and match history in parallel
			const [statsRes, rankRes, matchRes] = await Promise.allSettled([
				getPlayerStats(playerProfile.userId),
				getPlayerRank(playerProfile.userId),
				getMatchHistory(playerProfile.userId, 1, 10),
			]);

			if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
			if (rankRes.status === "fulfilled") setRank(rankRes.value.data);

			if (matchRes.status === "fulfilled") {
				// Resolve opponent names
				const rawMatches = matchRes.value.data;
				const opponentIds = new Set(
					rawMatches.map((m) =>
						m.playerAId === playerProfile.userId ? m.playerBId : m.playerAId,
					),
				);
				const nameMap: Record<string, string> = {};
				await Promise.allSettled(
					[...opponentIds].map(async (id) => {
						try {
							const res = await getUserById(id);
							nameMap[id] = res.data.username;
						} catch {
							nameMap[id] = "Unknown";
						}
					}),
				);
				setMatches(
					rawMatches.map((m) => {
						const oppId = m.playerAId === playerProfile.userId ? m.playerBId : m.playerAId;
						return { ...m, opponentName: nameMap[oppId] || "Unknown" };
					}),
				);
			}
		} catch {
			setError("Player not found");
		} finally {
			setLoading(false);
		}
	}, [username, loadFriendStatus]);

	useEffect(() => {
		loadPlayer();
	}, [loadPlayer]);

	/* Loading state */
	if (loading) {
		return (
			<div className="flex items-center justify-center p-8 py-24">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
			</div>
		);
	}

	/* Error / not found state */
	if (error || !profile) {
		return (
			<div className="relative">
				<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
				<div className="relative z-10 flex flex-col items-center justify-center p-8 py-24">
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-lighter text-3xl font-bold text-zinc-600">
						?
					</div>
					<h1 className="mt-4 text-xl font-bold text-white">Player not found</h1>
					<p className="mt-1 text-sm text-zinc-500">
						No player with the username &quot;{username}&quot; exists.
					</p>
					<Link
						href="/dashboard"
						className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent-light transition-colors hover:bg-accent/20"
					>
						<ArrowLeftIcon className="h-4 w-4" />
						Back to Dashboard
					</Link>
				</div>
			</div>
		);
	}

	const wins = stats?.wins ?? 0;
	const losses = stats?.losses ?? 0;
	const totalMatches = wins + losses + (stats?.draws ?? 0);
	const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 1000) / 10 : 0;

	return (
		<div className="relative">
			{/* Background effects */}
			<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

			<div className="relative z-10 p-4 sm:p-6 lg:p-8">
				{/* Back link */}
				<button
					onClick={() => router.back()}
					className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-accent-light"
				>
					<ArrowLeftIcon className="h-3.5 w-3.5" />
					Back
				</button>

				{/* ── Profile Header ── */}
				<div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-surface-light neon-box-purple">
					{/* Banner gradient */}
					<div className="h-32 bg-gradient-to-br from-accent/20 via-neon-purple/10 to-neon-cyan/10 sm:h-40">
						<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
					</div>

					<div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
						{/* Avatar */}
						<div className="relative -mt-14 mb-4 inline-block sm:-mt-16">
							<div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-light text-2xl font-bold text-accent-light ring-4 ring-surface-light sm:h-28 sm:w-28 sm:text-3xl">
								{profile.avatarUrl ? (
									<img
										src={profile.avatarUrl}
										alt={profile.displayName || profile.username}
										className="h-full w-full rounded-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center rounded-full bg-accent/20 ring-2 ring-accent/30">
										{(profile.displayName || profile.username)
											.split(" ")
											.map((w) => w[0])
											.join("")
											.toUpperCase()
											.slice(0, 2)}
									</div>
								)}
							</div>
							{/* Status indicator */}
							<span className={`absolute bottom-1 right-1 h-4 w-4 rounded-full ring-[3px] ring-surface-light ${statusColors[playerStatus] || statusColors.offline}`} />
						</div>

						<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
							{/* Info */}
							<div>
								<div className="flex items-center gap-3">
									<h1 className="text-2xl font-bold text-white sm:text-3xl">
										{profile.displayName || profile.username}
									</h1>
									{rank && (
										<span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-light">
											#{rank.rank}
										</span>
									)}
									<span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadge[playerStatus] || statusBadge.offline}`}>
										{statusLabels[playerStatus] || "Offline"}
									</span>
								</div>
								<p className="mt-0.5 text-sm text-zinc-500">@{profile.username}</p>
								{profile.bio && (
									<p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
										{profile.bio}
									</p>
								)}
								<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
									{profile.createdAt && (
										<span className="inline-flex items-center gap-1.5">
											<CalendarIcon className="h-3.5 w-3.5" />
											Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
										</span>
									)}
									<span className="inline-flex items-center gap-1.5">
										<ChartIcon className="h-3.5 w-3.5" />
										{rank?.elo ?? stats?.elo ?? 0} ELO
									</span>
								</div>
							</div>

							{/* Action buttons */}
							<div className="flex flex-wrap gap-2 sm:self-auto">
								{friendStatus === "self" ? (
									<Link
										href="/dashboard/settings"
										className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#fff] shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
									>
										Edit Profile
									</Link>
								) : isBlocked ? (
									<>
										<button
											onClick={handleUnblock}
											disabled={blockLoading}
											className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/15 disabled:opacity-50"
										>
											<ShieldBanIcon className="h-4 w-4" />
											{blockLoading ? "..." : "Unblock"}
										</button>
									</>
								) : (
									<>
										{friendStatus === "accepted" ? (
											<button
												onClick={handleRemoveFriend}
												disabled={friendLoading}
												className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
											>
												{friendLoading ? "..." : "Friends ✓"}
											</button>
										) : friendStatus === "pending_outgoing" ? (
											<button
												onClick={handleRemoveFriend}
												disabled={friendLoading}
												className="inline-flex items-center justify-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent-light transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
											>
												{friendLoading ? "..." : "Request Sent"}
											</button>
										) : friendStatus === "pending_incoming" ? (
											<button
												onClick={handleAcceptFriend}
												disabled={friendLoading}
												className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-[#fff] shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] disabled:opacity-50"
											>
												<UserPlusIcon className="h-4 w-4" />
												{friendLoading ? "..." : "Accept Request"}
											</button>
										) : (
											<button
												onClick={handleAddFriend}
												disabled={friendLoading}
												className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#fff] shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50"
											>
												<UserPlusIcon className="h-4 w-4" />
												{friendLoading ? "..." : "Add Friend"}
											</button>
										)}
										<button className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-neon-cyan/30 hover:text-neon-cyan">
											<GamepadIcon className="h-4 w-4" />
											Invite
										</button>
										<button
											onClick={() => profile && router.push(`/dashboard/chat?userId=${profile.userId}`)}
											className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-white/20 hover:text-white"
										>
											<ChatIcon className="h-4 w-4" />
											Message
										</button>
										<button
											onClick={() => setShowBlockConfirm(true)}
											className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm font-medium text-zinc-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
											title="Block user"
										>
											<ShieldBanIcon className="h-4 w-4" />
										</button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* ── Stats grid ── */}
				<div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
					<div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-accent/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.06)] sm:p-5">
						<p className="text-2xl font-bold text-white">{wins}</p>
						<p className="mt-0.5 text-xs text-zinc-500">Wins</p>
						<div className="mx-auto mt-2 h-1 w-12 rounded-full bg-emerald-500/30">
							<div className="h-full rounded-full bg-emerald-400" style={{ width: `${winRate}%` }} />
						</div>
					</div>
					<div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-red-500/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.06)] sm:p-5">
						<p className="text-2xl font-bold text-white">{losses}</p>
						<p className="mt-0.5 text-xs text-zinc-500">Losses</p>
						<div className="mx-auto mt-2 h-1 w-12 rounded-full bg-red-500/30">
							<div className="h-full rounded-full bg-red-400" style={{ width: `${totalMatches > 0 ? 100 - winRate : 0}%` }} />
						</div>
					</div>
					<div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-neon-cyan/20 hover:shadow-[0_0_25px_rgba(0,240,255,0.06)] sm:p-5">
						<p className="text-2xl font-bold text-neon-cyan neon-text-cyan">{winRate}%</p>
						<p className="mt-0.5 text-xs text-zinc-500">Win Rate</p>
					</div>
					<div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-neon-pink/20 hover:shadow-[0_0_25px_rgba(224,64,251,0.06)] sm:p-5">
						<p className="text-2xl font-bold text-white">{totalMatches}</p>
						<p className="mt-0.5 text-xs text-zinc-500">Total Matches</p>
					</div>
				</div>

				{/* ── Match History ── */}
				<div className="mt-6 rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
					<h2 className="mb-4 text-lg font-semibold text-white">Recent Matches</h2>

					{matches.length > 0 ? (
						<>
							{/* Table header (desktop) */}
							<div className="mb-3 hidden grid-cols-[1fr_auto_auto_auto] gap-4 px-4 text-xs font-medium uppercase tracking-wider text-zinc-500 sm:grid">
								<span>Opponent</span>
								<span className="w-20 text-center">Score</span>
								<span className="w-20 text-center">Result</span>
								<span className="w-24 text-right">Date</span>
							</div>

							<div className="space-y-2">
								{matches.map((match) => {
									const isPlayerA = match.playerAId === profile.userId;
									const myScore = isPlayerA ? match.scoreA : match.scoreB;
									const oppScore = isPlayerA ? match.scoreB : match.scoreA;
									const isWin = match.winnerId === profile.userId;
									const isDraw = match.winnerId === null;

									return (
										<div
											key={match.id}
											className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter"
										>
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
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium text-white">
													vs {match.opponentName}
												</p>
												<p className="text-xs text-zinc-500 sm:hidden">
													{new Date(match.playedAt).toLocaleDateString()}
												</p>
											</div>
											<span className={`text-sm font-semibold ${isDraw
												? "text-zinc-400"
												: isWin
													? "text-emerald-400"
													: "text-red-400"
												}`}>
												{myScore} - {oppScore}
											</span>
											<span className={`hidden w-20 text-center text-sm font-medium sm:block ${isDraw
												? "text-zinc-400"
												: isWin
													? "text-emerald-400"
													: "text-red-400"
												}`}>
												{isDraw ? "Draw" : isWin ? "Win" : "Loss"}
											</span>
											<span className="hidden w-24 text-right text-xs text-zinc-500 sm:block">
												{new Date(match.playedAt).toLocaleDateString()}
											</span>
										</div>
									);
								})}
							</div>
						</>
					) : (
						<div className="py-8 text-center">
							<p className="text-sm text-zinc-500">No matches played yet.</p>
						</div>
					)}
				</div>
			</div>

			{/* Block confirmation dialog */}
			{showBlockConfirm && profile && (
				<div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowBlockConfirm(false)}>
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
					<div
						className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-surface-light p-6 shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-base font-semibold text-white">Block @{profile.username}?</h3>
						<p className="mt-2 text-sm leading-relaxed text-zinc-400">
							They won&apos;t be able to send you messages or game invites. You can unblock them anytime.
						</p>
						<div className="mt-5 flex justify-end gap-2">
							<button
								onClick={() => setShowBlockConfirm(false)}
								className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
							>
								Cancel
							</button>
							<button
								onClick={handleBlock}
								disabled={blockLoading}
								className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:opacity-50"
							>
								{blockLoading ? "..." : "Block"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
