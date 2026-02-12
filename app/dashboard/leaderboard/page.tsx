"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
	getLeaderboard,
	getPlayerRank,
	getMyProfile,
	getUserById,
	type ApiLeaderboardEntry,
	type ApiUserProfile,
} from "@/lib/api";

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

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="11" cy="11" r="8" />
			<path d="M21 21l-4.35-4.35" />
		</svg>
	);
}

function CrownIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M2.5 19h19v2h-19zM22.5 7l-5 5-5-7-5 7-5-5 2 12h16z" />
		</svg>
	);
}

function ChevronUpIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="18 15 12 9 6 15" />
		</svg>
	);
}

function ChevronDownIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="6 9 12 15 18 9" />
		</svg>
	);
}

function SpinnerIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none">
			<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
			<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
		</svg>
	);
}

/* ──────────────────────── Types ──────────────────────── */

type SortField = "rank" | "elo" | "wins" | "winRate";
type SortDirection = "asc" | "desc";

interface LeaderboardPlayer {
	rank: number;
	userId: string;
	username: string;
	displayName: string;
	avatar: string;
	avatarUrl: string | null;
	wins: number;
	losses: number;
	draws: number;
	elo: number;
	level: number;
	isCurrentUser: boolean;
}

/* ──────────────────────── Podium Card ──────────────────────── */

function PodiumCard({
	player,
	place,
}: {
	player: LeaderboardPlayer;
	place: 1 | 2 | 3;
}) {
	const config = {
		1: {
			height: "h-36",
			avatarSize: "h-16 w-16 text-xl",
			ringColor: "ring-amber-400/50",
			bgColor: "bg-amber-400/10",
			textColor: "text-amber-400",
			glowColor: "shadow-[0_0_30px_rgba(251,191,36,0.15)]",
			badgeGlow: "shadow-[0_0_10px_rgba(251,191,36,0.6)]",
			label: "1st",
		},
		2: {
			height: "h-28",
			avatarSize: "h-14 w-14 text-lg",
			ringColor: "ring-zinc-300/40",
			bgColor: "bg-zinc-300/10",
			textColor: "text-zinc-300",
			glowColor: "shadow-[0_0_25px_rgba(212,212,216,0.1)]",
			badgeGlow: "shadow-[0_0_8px_rgba(212,212,216,0.4)]",
			label: "2nd",
		},
		3: {
			height: "h-24",
			avatarSize: "h-12 w-12 text-base",
			ringColor: "ring-amber-600/40",
			bgColor: "bg-amber-600/10",
			textColor: "text-amber-600",
			glowColor: "shadow-[0_0_20px_rgba(217,119,6,0.1)]",
			badgeGlow: "shadow-[0_0_8px_rgba(217,119,6,0.4)]",
			label: "3rd",
		},
	};

	const c = config[place];

	return (
		<Link
			href={player.isCurrentUser ? "/dashboard/profile" : `/dashboard/player/${player.username}`}
			className={`flex flex-col items-center ${place === 1 ? "order-2" : place === 2 ? "order-1" : "order-3"} transition-transform hover:scale-105`}
		>
			{/* Crown for #1 */}
			{place === 1 && (
				<CrownIcon className="mb-1 h-6 w-6 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
			)}

			{/* Avatar */}
			<div className="relative">
				{player.avatarUrl ? (
					<img
						src={player.avatarUrl}
						alt={player.username}
						className={`rounded-full object-cover ${c.avatarSize} ring-2 ${c.ringColor}`}
					/>
				) : (
					<div
						className={`flex items-center justify-center rounded-full ${c.avatarSize} ${c.bgColor} font-bold ${c.textColor} ring-2 ${c.ringColor}`}
					>
						{player.avatar}
					</div>
				)}
				<div
					className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${c.bgColor} text-[10px] font-bold ${c.textColor} ring-1 ${c.ringColor} ${c.badgeGlow}`}
				>
					{place}
				</div>
			</div>

			{/* Name */}
			<p className={`mt-2 text-sm font-semibold ${c.textColor}`}>
				{player.displayName}
			</p>
			<p className="text-[10px] text-zinc-500">@{player.username}</p>
			<p className="text-xs text-zinc-500">{player.elo} ELO</p>

			{/* Podium bar */}
			<div
				className={`mt-3 w-24 rounded-t-xl border border-white/5 ${c.bgColor} ${c.height} ${c.glowColor} flex items-center justify-center sm:w-28`}
			>
				<span className={`text-lg font-bold ${c.textColor}`}>{c.label}</span>
			</div>
		</Link>
	);
}

/* ──────────────────────── Rank Badge ──────────────────────── */

function RankBadge({ rank }: { rank: number }) {
	if (rank === 1) {
		return (
			<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/15 text-sm font-bold text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
				{rank}
			</div>
		);
	}
	if (rank === 2) {
		return (
			<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-300/10 text-sm font-bold text-zinc-300">
				{rank}
			</div>
		);
	}
	if (rank === 3) {
		return (
			<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600/10 text-sm font-bold text-amber-600">
				{rank}
			</div>
		);
	}
	return (
		<div className="flex h-7 w-7 items-center justify-center text-sm font-medium text-zinc-500">
			{rank}
		</div>
	);
}

/* ──────────────────────── Sort Header ──────────────────────── */

function SortHeader({
	label,
	field,
	activeField,
	direction,
	onSort,
	align = "left",
}: {
	label: string;
	field: SortField;
	activeField: SortField;
	direction: SortDirection;
	onSort: (field: SortField) => void;
	align?: "left" | "right";
}) {
	const isActive = activeField === field;

	return (
		<button
			onClick={() => onSort(field)}
			className={`inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors ${isActive ? "text-neon-cyan" : "text-zinc-500 hover:text-zinc-300"
				} ${align === "right" ? "ml-auto" : ""}`}
		>
			{label}
			{isActive && (
				direction === "asc"
					? <ChevronUpIcon className="h-3 w-3" />
					: <ChevronDownIcon className="h-3 w-3" />
			)}
		</button>
	);
}

/* ──────────────────────── Skeleton Loaders ──────────────────────── */

function PodiumSkeleton() {
	return (
		<div className="flex items-end justify-center gap-2 sm:gap-4">
			{[2, 1, 3].map((place) => (
				<div
					key={place}
					className={`flex flex-col items-center ${place === 1 ? "order-2" : place === 2 ? "order-1" : "order-3"}`}
				>
					<div className={`${place === 1 ? "h-16 w-16" : place === 2 ? "h-14 w-14" : "h-12 w-12"} animate-pulse rounded-full bg-surface-lighter`} />
					<div className="mt-2 h-4 w-16 animate-pulse rounded bg-surface-lighter" />
					<div className="mt-1 h-3 w-12 animate-pulse rounded bg-surface-lighter" />
					<div className={`mt-3 w-24 animate-pulse rounded-t-xl bg-surface-lighter sm:w-28 ${place === 1 ? "h-36" : place === 2 ? "h-28" : "h-24"}`} />
				</div>
			))}
		</div>
	);
}

function TableRowSkeleton() {
	return (
		<div className="flex items-center gap-3 px-3 py-3">
			<div className="h-7 w-7 animate-pulse rounded-lg bg-surface-lighter" />
			<div className="h-7 w-7 animate-pulse rounded-full bg-surface-lighter" />
			<div className="flex-1">
				<div className="h-4 w-24 animate-pulse rounded bg-surface-lighter" />
			</div>
			<div className="hidden sm:block">
				<div className="h-4 w-12 animate-pulse rounded bg-surface-lighter" />
			</div>
			<div className="hidden sm:block">
				<div className="h-4 w-10 animate-pulse rounded bg-surface-lighter" />
			</div>
			<div className="hidden sm:block">
				<div className="h-4 w-10 animate-pulse rounded bg-surface-lighter" />
			</div>
			<div className="hidden sm:block">
				<div className="h-4 w-14 animate-pulse rounded bg-surface-lighter" />
			</div>
		</div>
	);
}

/* ──────────────────────── Page ──────────────────────── */

export default function LeaderboardPage() {
	const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [myRank, setMyRank] = useState<number | null>(null);
	const [myElo, setMyElo] = useState<number | null>(null);
	const [totalPlayers, setTotalPlayers] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [search, setSearch] = useState("");
	const [sortField, setSortField] = useState<SortField>("rank");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const fetchLeaderboard = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch profile and leaderboard in parallel
			const [profileRes, leaderboardRes] = await Promise.allSettled([
				getMyProfile(),
				getLeaderboard(100, 0),
			]);

			let userId: string | null = null;
			if (profileRes.status === "fulfilled") {
				userId = profileRes.value.data.userId;
				setCurrentUserId(userId);
			}

			if (leaderboardRes.status === "rejected") {
				setError("Failed to load leaderboard data");
				return;
			}

			const entries = leaderboardRes.value.data;
			setTotalPlayers(leaderboardRes.value.count);

			// Resolve usernames in parallel
			const userCache = new Map<string, ApiUserProfile>();
			await Promise.allSettled(
				entries.map(async (entry) => {
					try {
						const res = await getUserById(entry.userId);
						userCache.set(entry.userId, res.data);
					} catch {
						// Will use fallback below
					}
				}),
			);

			const resolved: LeaderboardPlayer[] = entries.map((entry) => {
				const profile = userCache.get(entry.userId);
				const displayName = profile?.displayName || profile?.username || "Unknown";
				const username = profile?.username || "Unknown";
				return {
					rank: entry.rank,
					userId: entry.userId,
					username,
					displayName,
					avatar: displayName.slice(0, 2).toUpperCase(),
					avatarUrl: profile?.avatarUrl ?? null,
					wins: entry.wins,
					losses: entry.losses,
					draws: entry.draws,
					elo: entry.elo,
					level: entry.level,
					isCurrentUser: entry.userId === userId,
				};
			});

			setPlayers(resolved);

			// Fetch current user's rank
			if (userId) {
				try {
					const rankRes = await getPlayerRank(userId);
					setMyRank(rankRes.data.rank);
					setMyElo(rankRes.data.elo);
				} catch {
					// Non-critical — rank badge just won't show
				}
			}
		} catch {
			setError("Failed to load leaderboard");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLeaderboard();
	}, [fetchLeaderboard]);

	const currentUser = useMemo(
		() => players.find((p) => p.isCurrentUser),
		[players],
	);

	// Use API rank data if available, else fall back to leaderboard position
	const displayRank = myRank ?? currentUser?.rank;
	const displayElo = myElo ?? currentUser?.elo;

	function handleSort(field: SortField) {
		if (sortField === field) {
			setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection(field === "rank" ? "asc" : "desc");
		}
	}

	const filteredAndSorted = useMemo(() => {
		let data = [...players];

		if (search.trim()) {
			const q = search.toLowerCase();
			data = data.filter((p) =>
				p.displayName.toLowerCase().includes(q) ||
				p.username.toLowerCase().includes(q),
			);
		}

		data.sort((a, b) => {
			let aVal: number, bVal: number;
			switch (sortField) {
				case "rank":
					aVal = a.rank;
					bVal = b.rank;
					break;
				case "elo":
					aVal = a.elo;
					bVal = b.elo;
					break;
				case "wins":
					aVal = a.wins;
					bVal = b.wins;
					break;
				case "winRate": {
					const aTotal = a.wins + a.losses + a.draws;
					const bTotal = b.wins + b.losses + b.draws;
					aVal = aTotal > 0 ? a.wins / aTotal : 0;
					bVal = bTotal > 0 ? b.wins / bTotal : 0;
					break;
				}
			}
			return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
		});

		return data;
	}, [players, search, sortField, sortDirection]);

	const topThree = players.slice(0, 3);

	const currentUserWins = currentUser?.wins ?? 0;
	const currentUserLosses = currentUser?.losses ?? 0;
	const currentUserDraws = currentUser?.draws ?? 0;
	const currentUserTotal = currentUserWins + currentUserLosses + currentUserDraws;
	const currentUserWinRate = currentUserTotal > 0
		? ((currentUserWins / currentUserTotal) * 100).toFixed(1)
		: "0.0";

	return (
		<div className="relative">
			{/* Background effects */}
			<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

			<div className="relative z-10 p-4 sm:p-6 lg:p-8">
				{/* ── Header ── */}
				<div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-br from-surface-lighter via-accent/5 to-surface-lighter p-6 neon-box-purple sm:p-8">
					<div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/15 blur-[80px]" />
					<div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-neon-cyan/10 blur-[60px]" />
					<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

					<div className="relative z-10">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-light">
								<TrophyIcon className="h-5 w-5" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-white sm:text-3xl">
									Leaderboard
								</h1>
								<p className="mt-0.5 text-sm text-zinc-400">
									Top players ranked by ELO rating
								</p>
							</div>
						</div>

						{/* Your rank summary */}
						{!loading && currentUserId && (
							<div className="mt-5 flex flex-wrap gap-3">
								{displayRank != null && (
									<div className="rounded-xl border border-accent/15 bg-accent/5 px-4 py-2.5">
										<p className="text-xs text-zinc-500">Your Rank</p>
										<p className="text-lg font-bold text-accent-light">
											#{displayRank}
										</p>
									</div>
								)}
								{displayElo != null && (
									<div className="rounded-xl border border-neon-cyan/15 bg-neon-cyan/5 px-4 py-2.5">
										<p className="text-xs text-zinc-500">Your ELO</p>
										<p className="text-lg font-bold text-neon-cyan">
											{displayElo}
										</p>
									</div>
								)}
								{currentUser && (
									<div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-2.5">
										<p className="text-xs text-zinc-500">Win Rate</p>
										<p className="text-lg font-bold text-emerald-400">
											{currentUserWinRate}%
										</p>
									</div>
								)}
								<div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5">
									<p className="text-xs text-zinc-500">Total Players</p>
									<p className="text-lg font-bold text-zinc-300">
										{totalPlayers}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* ── Loading / Error states ── */}
				{loading && (
					<>
						<div className="mt-8">
							<PodiumSkeleton />
						</div>
						<div className="mt-8 rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
							<div className="mb-5 h-10 w-full animate-pulse rounded-xl bg-surface-lighter" />
							<div className="space-y-1">
								{[...Array(10)].map((_, i) => (
									<TableRowSkeleton key={i} />
								))}
							</div>
						</div>
					</>
				)}

				{error && !loading && (
					<div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-12">
						<p className="text-sm font-medium text-red-400">{error}</p>
						<button
							onClick={fetchLeaderboard}
							className="mt-4 rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent-light transition-colors hover:bg-accent/20"
						>
							Try again
						</button>
					</div>
				)}

				{!loading && !error && players.length === 0 && (
					<div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-surface-light p-12">
						<TrophyIcon className="mb-3 h-10 w-10 text-zinc-600" />
						<p className="text-sm font-medium text-zinc-400">
							No players on the leaderboard yet
						</p>
						<p className="mt-1 text-xs text-zinc-500">
							Play your first game to appear here!
						</p>
						<Link
							href="/dashboard/play"
							className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-xs font-medium text-accent-light transition-colors hover:bg-accent/20"
						>
							Find a Match
						</Link>
					</div>
				)}

				{/* ── Podium ── */}
				{!loading && !error && topThree.length > 0 && (
					<div className="mt-8 flex items-end justify-center gap-2 sm:gap-4">
						{topThree[1] && <PodiumCard player={topThree[1]} place={2} />}
						{topThree[0] && <PodiumCard player={topThree[0]} place={1} />}
						{topThree[2] && <PodiumCard player={topThree[2]} place={3} />}
					</div>
				)}

				{/* ── Search + Table ── */}
				{!loading && !error && players.length > 0 && (
					<div className="mt-8 rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
						{/* Search bar */}
						<div className="mb-5 flex items-center gap-3">
							<div className="relative flex-1">
								<SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
								<input
									type="text"
									placeholder="Search players..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
								/>
							</div>
						</div>

						{/* Table header */}
						<div className="hidden items-center gap-3 border-b border-white/5 px-3 pb-3 sm:flex">
							<div className="w-10">
								<SortHeader
									label="#"
									field="rank"
									activeField={sortField}
									direction={sortDirection}
									onSort={handleSort}
								/>
							</div>
							<div className="w-7" /> {/* Avatar space */}
							<div className="flex-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
								Player
							</div>
							<div className="w-20 text-right">
								<SortHeader
									label="ELO"
									field="elo"
									activeField={sortField}
									direction={sortDirection}
									onSort={handleSort}
									align="right"
								/>
							</div>
							<div className="w-16 text-right">
								<SortHeader
									label="Wins"
									field="wins"
									activeField={sortField}
									direction={sortDirection}
									onSort={handleSort}
									align="right"
								/>
							</div>
							<div className="w-16 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
								Losses
							</div>
							<div className="w-20 text-right">
								<SortHeader
									label="Win %"
									field="winRate"
									activeField={sortField}
									direction={sortDirection}
									onSort={handleSort}
									align="right"
								/>
							</div>
							<div className="w-14 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
								Level
							</div>
						</div>

						{/* Table rows */}
						<div className="mt-1 space-y-1">
							{filteredAndSorted.length === 0 ? (
								<div className="py-12 text-center">
									<p className="text-sm text-zinc-500">No players found</p>
								</div>
							) : (
								filteredAndSorted.map((player) => {
									const total = player.wins + player.losses + player.draws;
									const winRate = total > 0
										? ((player.wins / total) * 100).toFixed(1)
										: "0.0";
									const isUser = player.isCurrentUser;

									return (
										<Link
											key={player.userId}
											href={isUser ? "/dashboard/profile" : `/dashboard/player/${player.username}`}
											className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${isUser
												? "bg-accent/5 ring-1 ring-accent/20"
												: "hover:bg-white/[0.03]"
												}`}
										>
											{/* Rank */}
											<div className="w-10 flex-shrink-0">
												<RankBadge rank={player.rank} />
											</div>

											{/* Avatar */}
											{player.avatarUrl ? (
												<img
													src={player.avatarUrl}
													alt={player.username}
													className={`h-8 w-8 flex-shrink-0 rounded-full object-cover sm:h-7 sm:w-7 ${isUser ? "ring-1 ring-accent/30" : ""
														}`}
												/>
											) : (
												<div
													className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 ${isUser
														? "bg-accent/20 text-accent-light ring-1 ring-accent/30"
														: "bg-white/5 text-zinc-400"
														}`}
												>
													{player.avatar}
												</div>
											)}

											{/* Name + mobile stats */}
											<div className="min-w-0 flex-1">
												<p
													className={`truncate text-sm font-medium ${isUser ? "text-accent-light" : "text-zinc-200"
														}`}
												>
													{player.displayName}
													{isUser && (
														<span className="ml-1.5 text-xs text-accent/60">(you)</span>
													)}
												</p>
												<p className="truncate text-xs text-zinc-500">
													@{player.username}
												</p>
												{/* Mobile-only stats */}
												<p className="mt-0.5 text-xs text-zinc-500 sm:hidden">
													{player.elo} ELO &middot; {player.wins}W / {player.losses}L &middot; {winRate}%
												</p>
											</div>

											{/* Desktop stats */}
											<div className="hidden w-20 text-right sm:block">
												<span className="text-sm font-semibold text-neon-cyan">
													{player.elo}
												</span>
											</div>
											<div className="hidden w-16 text-right sm:block">
												<span className="text-sm text-emerald-400">
													{player.wins}
												</span>
											</div>
											<div className="hidden w-16 text-right sm:block">
												<span className="text-sm text-red-400/70">
													{player.losses}
												</span>
											</div>
											<div className="hidden w-20 text-right sm:block">
												<span className="text-sm text-zinc-300">{winRate}%</span>
											</div>
											<div className="hidden w-14 text-right sm:block">
												<span className="text-sm text-zinc-400">
													Lv.{player.level}
												</span>
											</div>
										</Link>
									);
								})
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
