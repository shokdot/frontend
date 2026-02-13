"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
	getMyProfile,
	getPlayerStats,
	getMatchHistory,
	getUserById,
	type ApiUserProfile,
	type ApiPlayerStats,
	type ApiMatch,
} from "@/lib/api";

/* ──────────────────────── Icons ──────────────────────── */

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

function TargetIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<circle cx="12" cy="12" r="6" />
			<circle cx="12" cy="12" r="2" />
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

function ChevronLeftIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M15 18l-6-6 6-6" />
		</svg>
	);
}

function ChevronRightIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M9 18l6-6-6-6" />
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
	if (days < 30) return `${days}d ago`;
	const date = new Date(isoDate);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDuration(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(isoDate: string): string {
	return new Date(isoDate).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/* ──────────────────────── Types ──────────────────────── */

type ResultFilter = "all" | "win" | "loss" | "draw";

interface ResolvedMatch {
	id: string;
	opponentId: string;
	opponentName: string;
	result: "win" | "loss" | "draw";
	myScore: number;
	opScore: number;
	score: string;
	date: string;
	fullDate: string;
	duration: string;
	durationSeconds: number;
	playedAt: string;
	gameMode: string;
}

const AI_OPPONENT_IDS = new Set(["ai_easy", "ai_medium", "ai_hard"]);

const AI_MODE_LABELS: Record<string, { label: string; color: string }> = {
	ai_easy: { label: "Easy", color: "text-emerald-400 bg-emerald-500/10" },
	ai_medium: { label: "Medium", color: "text-amber-400 bg-amber-500/10" },
	ai_hard: { label: "Hard", color: "text-red-400 bg-red-500/10" },
};

function getOpponentDisplayName(opponentId: string, gameMode: string, cachedName?: string): string {
	if (AI_OPPONENT_IDS.has(opponentId) || gameMode.startsWith("ai_")) {
		return "AI";
	}
	return cachedName || "Unknown";
}

/* ──────────────────────── Skeleton Loaders ──────────────────────── */

function StatCardSkeleton() {
	return (
		<div className="rounded-2xl border border-white/5 bg-surface-light p-4 sm:p-5">
			<div className="flex items-center gap-3">
				<div className="h-10 w-10 animate-pulse rounded-xl bg-surface-lighter" />
				<div className="space-y-2">
					<div className="h-6 w-12 animate-pulse rounded bg-surface-lighter" />
					<div className="h-3 w-16 animate-pulse rounded bg-surface-lighter" />
				</div>
			</div>
		</div>
	);
}

function MatchRowSkeleton() {
	return (
		<div className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3.5">
			<div className="h-10 w-10 animate-pulse rounded-lg bg-surface-lighter" />
			<div className="min-w-0 flex-1 space-y-2">
				<div className="h-4 w-32 animate-pulse rounded bg-surface-lighter" />
				<div className="h-3 w-20 animate-pulse rounded bg-surface-lighter" />
			</div>
			<div className="hidden space-y-2 sm:block">
				<div className="h-4 w-16 animate-pulse rounded bg-surface-lighter" />
			</div>
			<div className="space-y-2 text-right">
				<div className="ml-auto h-4 w-14 animate-pulse rounded bg-surface-lighter" />
				<div className="ml-auto h-3 w-10 animate-pulse rounded bg-surface-lighter" />
			</div>
		</div>
	);
}

/* ──────────────────────── Page ──────────────────────── */

const ITEMS_PER_PAGE = 15;

export default function HistoryPage() {
	const [profile, setProfile] = useState<ApiUserProfile | null>(null);
	const [stats, setStats] = useState<ApiPlayerStats | null>(null);
	const [matches, setMatches] = useState<ResolvedMatch[]>([]);
	const [loading, setLoading] = useState(true);
	const [matchesLoading, setMatchesLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalMatches, setTotalMatches] = useState(0);
	const [filter, setFilter] = useState<ResultFilter>("all");
	const [error, setError] = useState<string | null>(null);

	// Cache for resolved usernames
	const [userCache] = useState(() => new Map<string, string>());

	const resolveMatches = useCallback(
		async (rawMatches: ApiMatch[], userId: string): Promise<ResolvedMatch[]> => {
			// Collect unknown opponent IDs (skip AI sentinels)
			const unknownIds = new Set<string>();
			for (const m of rawMatches) {
				const opId = m.playerAId === userId ? m.playerBId : m.playerAId;
				if (!userCache.has(opId) && !AI_OPPONENT_IDS.has(opId)) unknownIds.add(opId);
			}

			// Batch resolve real users only
			await Promise.allSettled(
				[...unknownIds].map(async (id) => {
					try {
						const res = await getUserById(id);
						userCache.set(id, res.data.username);
					} catch {
						userCache.set(id, "Unknown");
					}
				}),
			);

			return rawMatches.map((m) => {
				const isPlayerA = m.playerAId === userId;
				const opponentId = isPlayerA ? m.playerBId : m.playerAId;
				const myScore = isPlayerA ? m.scoreA : m.scoreB;
				const opScore = isPlayerA ? m.scoreB : m.scoreA;
				const gameMode = m.gameMode || "online";

				let result: "win" | "loss" | "draw";
				if (m.winnerId === userId) result = "win";
				else if (m.winnerId === null && gameMode.startsWith("ai_")) result = "loss"; // AI won
				else if (m.winnerId === null) result = "draw";
				else result = "loss";

				return {
					id: m.id,
					opponentId,
					opponentName: getOpponentDisplayName(opponentId, gameMode, userCache.get(opponentId)),
					result,
					myScore,
					opScore,
					score: `${myScore} - ${opScore}`,
					date: timeAgo(m.playedAt),
					fullDate: formatDate(m.playedAt),
					duration: formatDuration(m.duration),
					durationSeconds: m.duration,
					playedAt: m.playedAt,
					gameMode,
				};
			});
		},
		[userCache],
	);

	// Fetch profile and stats once
	useEffect(() => {
		(async () => {
			try {
				const profileRes = await getMyProfile();
				setProfile(profileRes.data);

				try {
					const statsRes = await getPlayerStats(profileRes.data.userId);
					setStats(statsRes.data);
				} catch {
					// Stats may not exist yet
				}
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : "Failed to load data";
				setError(message);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	// Fetch match history when page changes
	useEffect(() => {
		if (!profile) return;

		(async () => {
			try {
				setMatchesLoading(true);
				const historyRes = await getMatchHistory(
					profile.userId,
					page,
					ITEMS_PER_PAGE,
				);
				const resolved = await resolveMatches(
					historyRes.data,
					profile.userId,
				);
				setMatches(resolved);
				setTotalPages(historyRes.pagination.totalPages);
				setTotalMatches(historyRes.pagination.total);
			} catch {
				// Match loading failed
			} finally {
				setMatchesLoading(false);
			}
		})();
	}, [profile, page, resolveMatches]);

	// Apply client-side filter
	const filteredMatches =
		filter === "all"
			? matches
			: matches.filter((m) => m.result === filter);

	// Derived stats
	const wins = stats?.wins ?? 0;
	const losses = stats?.losses ?? 0;
	const draws = stats?.draws ?? 0;
	const total = wins + losses + draws;
	const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

	if (error) {
		return (
			<div className="flex min-h-[400px] items-center justify-center p-8">
				<div className="text-center">
					<p className="text-lg font-semibold text-red-400">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-4 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm text-zinc-300 transition-all hover:border-accent/30 hover:text-white"
					>
						Try again
					</button>
				</div>
			</div>
		);
	}

	const filters: { label: string; value: ResultFilter }[] = [
		{ label: "All", value: "all" },
		{ label: "Wins", value: "win" },
		{ label: "Losses", value: "loss" },
		{ label: "Draws", value: "draw" },
	];

	return (
		<div className="relative">
			{/* Background effects */}
			<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

			<div className="relative z-10 p-4 sm:p-6 lg:p-8">
				{/* ── Page Header ── */}
				<div className="mb-6">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
							<ClockIcon className="h-5 w-5 text-accent-light" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white">Match History</h1>
							<p className="text-sm text-zinc-500">
								{totalMatches > 0
									? `${totalMatches} total matches played`
									: "Track your game results here"}
							</p>
						</div>
					</div>
				</div>

				{/* ── Stats Summary ── */}
				<div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
					{loading ? (
						<>
							<StatCardSkeleton />
							<StatCardSkeleton />
							<StatCardSkeleton />
							<StatCardSkeleton />
						</>
					) : (
						<>
							<div className="rounded-2xl border border-white/5 bg-surface-light p-4 transition-all hover:border-emerald-500/20 hover:shadow-[0_0_25px_rgba(52,211,153,0.06)] sm:p-5">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
										<TrophyIcon className="h-5 w-5 text-emerald-400" />
									</div>
									<div>
										<p className="text-2xl font-bold text-white">{wins}</p>
										<p className="text-xs text-zinc-500">Wins</p>
									</div>
								</div>
							</div>
							<div className="rounded-2xl border border-white/5 bg-surface-light p-4 transition-all hover:border-red-500/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.06)] sm:p-5">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
										<SwordsIcon className="h-5 w-5 text-red-400" />
									</div>
									<div>
										<p className="text-2xl font-bold text-white">{losses}</p>
										<p className="text-xs text-zinc-500">Losses</p>
									</div>
								</div>
							</div>
							<div className="rounded-2xl border border-white/5 bg-surface-light p-4 transition-all hover:border-neon-cyan/20 hover:shadow-[0_0_25px_rgba(0,240,255,0.06)] sm:p-5">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-cyan/10">
										<TargetIcon className="h-5 w-5 text-neon-cyan" />
									</div>
									<div>
										<p className="text-2xl font-bold text-neon-cyan neon-text-cyan">
											{winRate}%
										</p>
										<p className="text-xs text-zinc-500">Win Rate</p>
									</div>
								</div>
							</div>
							<div className="rounded-2xl border border-white/5 bg-surface-light p-4 transition-all hover:border-accent/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.06)] sm:p-5">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
										<ClockIcon className="h-5 w-5 text-accent-light" />
									</div>
									<div>
										<p className="text-2xl font-bold text-white">{draws}</p>
										<p className="text-xs text-zinc-500">Draws</p>
									</div>
								</div>
							</div>
						</>
					)}
				</div>

				{/* ── Matches Section ── */}
				<div className="rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
					{/* Header + Filters */}
					<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h2 className="text-lg font-semibold text-white">All Matches</h2>
						<div className="flex gap-1.5 rounded-xl bg-surface-lighter p-1">
							{filters.map((f) => (
								<button
									key={f.value}
									onClick={() => setFilter(f.value)}
									className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === f.value
										? "bg-accent/20 text-accent-light shadow-[0_0_10px_rgba(139,92,246,0.15)]"
										: "text-zinc-500 hover:text-zinc-300"
										}`}
								>
									{f.label}
								</button>
							))}
						</div>
					</div>

					{/* Table header (desktop) */}
					{filteredMatches.length > 0 && (
						<div className="mb-3 hidden grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 text-xs font-medium uppercase tracking-wider text-zinc-500 sm:grid">
							<span className="w-10" />
							<span>Opponent</span>
							<span className="w-20 text-center">Score</span>
							<span className="w-16 text-center">Duration</span>
							<span className="w-28 text-right">Date</span>
						</div>
					)}

					{/* Match rows */}
					{matchesLoading ? (
						<div className="space-y-2">
							{[...Array(8)].map((_, i) => (
								<MatchRowSkeleton key={i} />
							))}
						</div>
					) : filteredMatches.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16">
							<SwordsIcon className="mb-3 h-12 w-12 text-zinc-600" />
							<p className="text-sm font-medium text-zinc-400">
								{filter === "all"
									? "No matches played yet"
									: `No ${filter === "win" ? "wins" : filter === "loss" ? "losses" : "draws"} found`}
							</p>
							<p className="mt-1 text-xs text-zinc-500">
								{filter === "all"
									? "Play your first game to see your history here!"
									: "Try a different filter or play more games."}
							</p>
							{filter === "all" && (
								<Link
									href="/dashboard/play"
									className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-xs font-medium text-accent-light transition-colors hover:bg-accent/20"
								>
									<PlayIcon className="h-3.5 w-3.5" />
									Find a Match
								</Link>
							)}
						</div>
					) : (
						<div className="space-y-2">
							{filteredMatches.map((match) => {
								const isWin = match.result === "win";
								const isDraw = match.result === "draw";
								const isAI = match.gameMode.startsWith("ai_");
								const aiLabel = AI_MODE_LABELS[match.gameMode];

								const rowContent = (
									<>
										{/* Result indicator */}
										<div
											className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isDraw
												? "bg-zinc-500/10 text-zinc-400"
												: isWin
													? "bg-emerald-500/10 text-emerald-400"
													: "bg-red-500/10 text-red-400"
												}`}
										>
											{isDraw ? "D" : isWin ? "W" : "L"}
										</div>

										{/* Opponent & date (mobile) */}
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className="truncate text-sm font-medium text-white">
													vs {match.opponentName}
												</p>
												{isAI && aiLabel && (
													<span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${aiLabel.color}`}>
														{aiLabel.label}
													</span>
												)}
											</div>
											<p className="text-xs text-zinc-500 sm:hidden">
												{match.date}
											</p>
										</div>

										{/* Score */}
										<div className="text-center">
											<span
												className={`text-sm font-semibold ${isDraw
													? "text-zinc-400"
													: isWin
														? "text-emerald-400"
														: "text-red-400"
													}`}
											>
												{match.score}
											</span>
										</div>

										{/* Duration (desktop) */}
										<span className="hidden w-16 text-center text-xs text-zinc-500 sm:block">
											{match.duration}
										</span>

										{/* Date (desktop) */}
										<span className="hidden w-28 text-right text-xs text-zinc-500 sm:block">
											{match.date}
										</span>
									</>
								);

								return isAI ? (
									<div
										key={match.id}
										className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3.5 transition-all hover:border-white/10 hover:bg-surface-lighter"
									>
										{rowContent}
									</div>
								) : (
									<Link
										key={match.id}
										href={`/dashboard/player/${match.opponentName}`}
										className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3.5 transition-all hover:border-white/10 hover:bg-surface-lighter"
									>
										{rowContent}
									</Link>
								);
							})}
						</div>
					)}

					{/* ── Pagination ── */}
					{totalPages > 1 && (
						<div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
							<p className="text-xs text-zinc-500">
								Page {page} of {totalPages}
							</p>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page === 1}
									className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-surface-lighter text-zinc-400 transition-all hover:border-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/5 disabled:hover:text-zinc-400"
								>
									<ChevronLeftIcon className="h-4 w-4" />
								</button>

								{/* Page numbers */}
								<div className="flex items-center gap-1">
									{Array.from({ length: totalPages }, (_, i) => i + 1)
										.filter((p) => {
											if (totalPages <= 7) return true;
											if (p === 1 || p === totalPages) return true;
											if (Math.abs(p - page) <= 1) return true;
											return false;
										})
										.reduce<(number | "dots")[]>((acc, p, i, arr) => {
											if (i > 0 && p - (arr[i - 1] as number) > 1) {
												acc.push("dots");
											}
											acc.push(p);
											return acc;
										}, [])
										.map((item, i) =>
											item === "dots" ? (
												<span
													key={`dots-${i}`}
													className="px-1 text-xs text-zinc-600"
												>
													...
												</span>
											) : (
												<button
													key={item}
													onClick={() => setPage(item as number)}
													className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg text-xs font-medium transition-all ${page === item
														? "bg-accent/20 text-accent-light shadow-[0_0_10px_rgba(139,92,246,0.15)]"
														: "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
														}`}
												>
													{item}
												</button>
											),
										)}
								</div>

								<button
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									disabled={page === totalPages}
									className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-surface-lighter text-zinc-400 transition-all hover:border-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/5 disabled:hover:text-zinc-400"
								>
									<ChevronRightIcon className="h-4 w-4" />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
