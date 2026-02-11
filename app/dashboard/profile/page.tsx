"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
	getMyProfile,
	getPlayerStats,
	getPlayerRank,
	getMatchHistory,
	getUserById,
	ApiUserProfile,
	ApiPlayerStats,
	ApiPlayerRank,
} from "@/lib/api";

/* ──────────────────────── Icons ──────────────────────── */

function UserEditIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M11 21H4a2 2 0 01-2-2v-1a5 5 0 015-5h2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M17.5 12.5l-1.4 1.4a2 2 0 00-.5.9l-.3 1.5a.5.5 0 00.6.6l1.5-.3a2 2 0 00.9-.5l1.4-1.4a1.4 1.4 0 00-2.2-2.2z" />
		</svg>
	);
}

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

/* ──────────────────────── Helpers ──────────────────────── */

function formatJoinDate(isoDate: string): string {
	const date = new Date(isoDate);
	return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getInitials(displayName: string | null, username: string): string {
	const name = displayName || username;
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

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

/* ──────────────────────── Types ──────────────────────── */

interface ResolvedMatch {
	id: string;
	opponentName: string;
	result: "win" | "loss" | "draw";
	score: string;
	date: string;
}

/* ──────────────────────── Loading Skeleton ──────────────────────── */

function ProfileSkeleton() {
	return (
		<div className="relative">
			<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
			<div className="relative z-10 p-4 sm:p-6 lg:p-8">
				{/* Header skeleton */}
				<div className="overflow-hidden rounded-2xl border border-accent/15 bg-surface-light">
					<div className="h-32 animate-pulse bg-gradient-to-br from-accent/10 via-neon-purple/5 to-neon-cyan/5 sm:h-40" />
					<div className="px-5 pb-6 sm:px-8 sm:pb-8">
						<div className="-mt-14 mb-4 sm:-mt-16">
							<div className="h-24 w-24 animate-pulse rounded-full bg-surface-lighter ring-4 ring-surface-light sm:h-28 sm:w-28" />
						</div>
						<div className="space-y-3">
							<div className="h-8 w-48 animate-pulse rounded-lg bg-surface-lighter" />
							<div className="h-4 w-32 animate-pulse rounded bg-surface-lighter" />
							<div className="h-4 w-72 animate-pulse rounded bg-surface-lighter" />
						</div>
					</div>
				</div>
				{/* Stats skeleton */}
				<div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="rounded-2xl border border-white/5 bg-surface-light p-4 sm:p-5">
							<div className="mx-auto h-8 w-16 animate-pulse rounded bg-surface-lighter" />
							<div className="mx-auto mt-2 h-3 w-12 animate-pulse rounded bg-surface-lighter" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/* ──────────────────────── Page ──────────────────────── */

export default function ProfilePage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [profile, setProfile] = useState<ApiUserProfile | null>(null);
	const [stats, setStats] = useState<ApiPlayerStats | null>(null);
	const [rank, setRank] = useState<ApiPlayerRank | null>(null);
	const [matches, setMatches] = useState<ResolvedMatch[]>([]);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// 1. Get the user profile first (we need userId for other calls)
			const profileRes = await getMyProfile();
			const profileData = profileRes.data;
			setProfile(profileData);

			// 2. Fetch stats, rank, and match history in parallel
			const [statsRes, rankRes, historyRes] = await Promise.allSettled([
				getPlayerStats(profileData.userId),
				getPlayerRank(profileData.userId),
				getMatchHistory(profileData.userId, 1, 10),
			]);

			if (statsRes.status === "fulfilled") {
				setStats(statsRes.value.data);
			}

			if (rankRes.status === "fulfilled") {
				setRank(rankRes.value.data);
			}

			// 3. Resolve match history opponent names
			if (historyRes.status === "fulfilled") {
				const rawMatches = historyRes.value.data;
				const opponentIds = new Set(
					rawMatches.map((m) =>
						m.playerAId === profileData.userId ? m.playerBId : m.playerAId,
					),
				);

				// Batch-resolve unique opponent usernames
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

					let result: "win" | "loss" | "draw";
					if (m.winnerId === profileData.userId) result = "win";
					else if (m.winnerId === null) result = "draw";
					else result = "loss";

					return {
						id: m.id,
						opponentName: userCache.get(opponentId) || "Unknown",
						result,
						score: `${myScore} - ${opScore}`,
						date: timeAgo(m.playedAt),
					};
				});

				setMatches(resolved);
			}
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to load profile";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (loading) return <ProfileSkeleton />;

	if (error || !profile) {
		return (
			<div className="flex min-h-[400px] items-center justify-center p-8">
				<div className="text-center">
					<p className="text-lg font-semibold text-red-400">
						{error || "Failed to load profile"}
					</p>
					<button
						onClick={fetchData}
						className="mt-4 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm text-zinc-300 transition-all hover:border-accent/30 hover:text-white"
					>
						Try again
					</button>
				</div>
			</div>
		);
	}

	const wins = stats?.wins ?? 0;
	const losses = stats?.losses ?? 0;
	const draws = stats?.draws ?? 0;
	const totalMatches = wins + losses + draws;
	const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : "0.0";
	const elo = rank?.elo ?? stats?.elo ?? 0;
	const playerRank = rank?.rank ?? 0;

	return (
		<div className="relative">
			{/* Background effects */}
			<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

			<div className="relative z-10 p-4 sm:p-6 lg:p-8">
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
								<div className="flex h-full w-full items-center justify-center rounded-full bg-accent/20 ring-2 ring-accent/30">
									{profile.avatarUrl ? (
										<img src={profile.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
									) : (
										getInitials(profile.displayName, profile.username)
									)}
								</div>
							</div>
							{/* Online indicator */}
							<span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-400 ring-[3px] ring-surface-light shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
						</div>

						<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
							{/* Info */}
							<div>
								<div className="flex items-center gap-3">
									<h1 className="text-2xl font-bold text-white sm:text-3xl">
										{profile.displayName || profile.username}
									</h1>
									{playerRank > 0 && (
										<span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-light">
											#{playerRank}
										</span>
									)}
								</div>
								<p className="mt-0.5 text-sm text-zinc-500">@{profile.username}</p>
								{profile.bio && (
									<p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
										{profile.bio}
									</p>
								)}
								<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
									<span className="inline-flex items-center gap-1.5">
										<CalendarIcon className="h-3.5 w-3.5" />
										Joined {formatJoinDate(profile.createdAt)}
									</span>
									<span className="inline-flex items-center gap-1.5">
										<ChartIcon className="h-3.5 w-3.5" />
										{elo} ELO
									</span>
								</div>
							</div>

							{/* Edit button — navigates to Settings */}
							<Link
								href="/dashboard/settings"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-accent/30 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] sm:self-auto"
							>
								<UserEditIcon className="h-4 w-4" />
								Edit Profile
							</Link>
						</div>
					</div>
				</div>

				{/* ── Stats grid ── */}
				<div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
					<div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-accent/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.06)] sm:p-5">
						<p className="text-2xl font-bold text-white">{wins}</p>
						<p className="mt-0.5 text-xs text-zinc-500">Wins</p>
						<div className="mx-auto mt-2 h-1 w-12 rounded-full bg-emerald-500/30">
							<div
								className="h-full rounded-full bg-emerald-400"
								style={{ width: `${Number(winRate)}%` }}
							/>
						</div>
					</div>
					<div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-red-500/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.06)] sm:p-5">
						<p className="text-2xl font-bold text-white">{losses}</p>
						<p className="mt-0.5 text-xs text-zinc-500">Losses</p>
						<div className="mx-auto mt-2 h-1 w-12 rounded-full bg-red-500/30">
							<div
								className="h-full rounded-full bg-red-400"
								style={{ width: `${100 - Number(winRate)}%` }}
							/>
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
					<h2 className="mb-4 text-lg font-semibold text-white">Match History</h2>

					{matches.length === 0 ? (
						<p className="py-8 text-center text-sm text-zinc-500">
							No matches played yet. Start a game to see your history!
						</p>
					) : (
						<>
							{/* Table header (desktop) */}
							<div className="mb-3 hidden grid-cols-[1fr_auto_auto] gap-4 px-4 text-xs font-medium uppercase tracking-wider text-zinc-500 sm:grid">
								<span>Opponent</span>
								<span className="w-20 text-center">Score</span>
								<span className="w-24 text-right">Date</span>
							</div>

							<div className="space-y-2">
								{matches.map((match) => {
									const isWin = match.result === "win";
									const isDraw = match.result === "draw";
									return (
										<div
											key={match.id}
											className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter"
										>
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

											{/* Opponent */}
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium text-white">
													vs {match.opponentName}
												</p>
												<p className="text-xs text-zinc-500 sm:hidden">{match.date}</p>
											</div>

											{/* Score */}
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

											{/* Date (desktop) */}
											<span className="hidden w-24 text-right text-xs text-zinc-500 sm:block">
												{match.date}
											</span>
										</div>
									);
								})}
							</div>

							<div className="mt-4 text-center">
								<Link
									href="/dashboard/history"
									className="text-xs font-medium text-zinc-500 transition-colors hover:text-neon-cyan"
								>
									View full match history
								</Link>
							</div>
						</>
					)}
				</div>
			</div>

		</div>
	);
}
