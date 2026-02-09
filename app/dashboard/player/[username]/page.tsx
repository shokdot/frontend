"use client";

import { use } from "react";
import Link from "next/link";

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

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
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

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

/* ──────────────────────── Types ──────────────────────── */

type Status = "online" | "in-game" | "idle" | "offline";

interface PlayerProfile {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  status: Status;
  joinDate: string;
  location: string;
  elo: number;
  rank: number;
  stats: {
    wins: number;
    losses: number;
    totalMatches: number;
    winRate: number;
    totalPlayTime: string;
  };
}

interface MatchData {
  id: number;
  opponent: string;
  result: "win" | "loss";
  score: string;
  date: string;
  eloChange: number;
}

/* ──────────────────────── Mock Data ──────────────────────── */

const playersDb: Record<string, PlayerProfile> = {
  NeonBlade42: {
    username: "NeonBlade42", displayName: "Neon Blade", avatar: "NB",
    bio: "Top-ranked pong player. I live for the neon lights and fast rallies.",
    status: "online", joinDate: "December 2025", location: "Tokyo, Japan",
    elo: 2450, rank: 1,
    stats: { wins: 142, losses: 28, totalMatches: 170, winRate: 83.5, totalPlayTime: "96h 12m" },
  },
  QuantumServe: {
    username: "QuantumServe", displayName: "Quantum Serve", avatar: "QS",
    bio: "Strategic player with a knack for impossible angles.",
    status: "offline", joinDate: "January 2026", location: "Berlin, Germany",
    elo: 2380, rank: 2,
    stats: { wins: 128, losses: 35, totalMatches: 163, winRate: 78.5, totalPlayTime: "82h 45m" },
  },
  CyberPaddle: {
    username: "CyberPaddle", displayName: "Cyber Paddle", avatar: "CP",
    bio: "Defense is the best offense. Try to get past me.",
    status: "online", joinDate: "January 2026", location: "Seoul, South Korea",
    elo: 2310, rank: 3,
    stats: { wins: 115, losses: 40, totalMatches: 155, winRate: 74.2, totalPlayTime: "71h 30m" },
  },
  ShadowSmash: {
    username: "ShadowSmash", displayName: "Shadow Smash", avatar: "SS",
    bio: "Aggressive playstyle. You won't see it coming.",
    status: "in-game", joinDate: "January 2026", location: "London, UK",
    elo: 2240, rank: 4,
    stats: { wins: 108, losses: 42, totalMatches: 150, winRate: 72.0, totalPlayTime: "65h 20m" },
  },
  PixelStorm: {
    username: "PixelStorm", displayName: "Pixel Storm", avatar: "PS",
    bio: "Pixel perfect reflexes. Every millisecond counts.",
    status: "in-game", joinDate: "February 2026", location: "New York, USA",
    elo: 1980, rank: 8,
    stats: { wins: 91, losses: 55, totalMatches: 146, winRate: 62.3, totalPlayTime: "58h 10m" },
  },
  ArcadeKing: {
    username: "ArcadeKing", displayName: "Arcade King", avatar: "AK",
    bio: "Old school gamer. Arcade machines were my first love.",
    status: "online", joinDate: "January 2026", location: "Los Angeles, USA",
    elo: 1920, rank: 9,
    stats: { wins: 89, losses: 57, totalMatches: 146, winRate: 61.0, totalPlayTime: "55h 40m" },
  },
  RetroWave: {
    username: "RetroWave", displayName: "Retro Wave", avatar: "RW",
    bio: "Synthwave vibes and smooth rallies.",
    status: "online", joinDate: "February 2026", location: "Miami, USA",
    elo: 1870, rank: 10,
    stats: { wins: 85, losses: 60, totalMatches: 145, winRate: 58.6, totalPlayTime: "52h 15m" },
  },
};

function getPlayerMatches(username: string): MatchData[] {
  // Generate plausible match history for any player
  const opponents = ["NeonBlade42", "PixelStorm", "CyberPaddle", "QuantumServe", "ArcadeKing", "RetroWave", "You"];
  const filtered = opponents.filter((o) => o !== username);
  return [
    { id: 1, opponent: filtered[0], result: "win", score: "11 - 7", date: "3 hours ago", eloChange: +18 },
    { id: 2, opponent: filtered[1], result: "loss", score: "9 - 11", date: "Yesterday", eloChange: -14 },
    { id: 3, opponent: filtered[2], result: "win", score: "11 - 3", date: "Yesterday", eloChange: +12 },
    { id: 4, opponent: filtered[3], result: "win", score: "11 - 9", date: "2 days ago", eloChange: +22 },
    { id: 5, opponent: filtered[4], result: "loss", score: "6 - 11", date: "3 days ago", eloChange: -16 },
    { id: 6, opponent: filtered[5], result: "win", score: "11 - 5", date: "4 days ago", eloChange: +15 },
  ];
}

/* ──────────────────────── Status Helpers ──────────────────────── */

const statusColors: Record<Status, string> = {
  online: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  "in-game": "bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]",
  idle: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  offline: "bg-zinc-600",
};

const statusLabels: Record<Status, string> = {
  online: "Online",
  "in-game": "In Game",
  idle: "Idle",
  offline: "Offline",
};

/* ──────────────────────── Page ──────────────────────── */

export default function PlayerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const player = playersDb[username];

  if (!player) {
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

  const matches = getPlayerMatches(username);
  const { stats } = player;

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Back link */}
        <Link
          href="/dashboard/leaderboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-accent-light"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back
        </Link>

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
                  {player.avatar}
                </div>
              </div>
              {/* Status indicator */}
              <span className={`absolute bottom-1 right-1 h-4 w-4 rounded-full ring-[3px] ring-surface-light ${statusColors[player.status]}`} />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Info */}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    {player.displayName}
                  </h1>
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-light">
                    #{player.rank}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    player.status === "online"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : player.status === "in-game"
                        ? "bg-neon-cyan/10 text-neon-cyan"
                        : player.status === "idle"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-zinc-500/10 text-zinc-400"
                  }`}>
                    {statusLabels[player.status]}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">@{player.username}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
                  {player.bio}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Joined {player.joinDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GlobeIcon className="h-3.5 w-3.5" />
                    {player.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ChartIcon className="h-3.5 w-3.5" />
                    {player.elo} ELO
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 sm:self-auto">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#fff] shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <UserPlusIcon className="h-4 w-4" />
                  Add Friend
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-neon-cyan/30 hover:text-neon-cyan">
                  <GamepadIcon className="h-4 w-4" />
                  Invite
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-white/20 hover:text-white">
                  <ChatIcon className="h-4 w-4" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-accent/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.06)] sm:p-5">
            <p className="text-2xl font-bold text-white">{stats.wins}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Wins</p>
            <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-emerald-500/30">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${stats.winRate}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-red-500/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.06)] sm:p-5">
            <p className="text-2xl font-bold text-white">{stats.losses}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Losses</p>
            <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-red-500/30">
              <div className="h-full rounded-full bg-red-400" style={{ width: `${100 - stats.winRate}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-neon-cyan/20 hover:shadow-[0_0_25px_rgba(0,240,255,0.06)] sm:p-5">
            <p className="text-2xl font-bold text-neon-cyan neon-text-cyan">{stats.winRate}%</p>
            <p className="mt-0.5 text-xs text-zinc-500">Win Rate</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-neon-pink/20 hover:shadow-[0_0_25px_rgba(224,64,251,0.06)] sm:p-5">
            <p className="text-2xl font-bold text-white">{stats.totalPlayTime}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Play Time</p>
          </div>
        </div>

        {/* ── Match History ── */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Matches</h2>

          {/* Table header (desktop) */}
          <div className="mb-3 hidden grid-cols-[1fr_auto_auto_auto] gap-4 px-4 text-xs font-medium uppercase tracking-wider text-zinc-500 sm:grid">
            <span>Opponent</span>
            <span className="w-20 text-center">Score</span>
            <span className="w-20 text-center">ELO</span>
            <span className="w-24 text-right">Date</span>
          </div>

          <div className="space-y-2">
            {matches.map((match) => {
              const isWin = match.result === "win";
              return (
                <div
                  key={match.id}
                  className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter"
                >
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isWin ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isWin ? "W" : "L"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      vs {match.opponent}
                    </p>
                    <p className="text-xs text-zinc-500 sm:hidden">{match.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${isWin ? "text-emerald-400" : "text-red-400"}`}>
                    {match.score}
                  </span>
                  <span className={`hidden w-20 text-center text-sm font-medium sm:block ${match.eloChange > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {match.eloChange > 0 ? "+" : ""}{match.eloChange}
                  </span>
                  <span className="hidden w-24 text-right text-xs text-zinc-500 sm:block">
                    {match.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
