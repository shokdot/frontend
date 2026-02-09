"use client";

import Link from "next/link";

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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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

/* ──────────────────────── Match Row ──────────────────────── */

type MatchResult = "win" | "loss";

interface MatchData {
  id: number;
  opponent: string;
  result: MatchResult;
  score: string;
  date: string;
  duration: string;
}

const recentMatches: MatchData[] = [
  { id: 1, opponent: "NeonBlade42", result: "win", score: "11 - 7", date: "2 hours ago", duration: "8:42" },
  { id: 2, opponent: "PixelStorm", result: "loss", score: "9 - 11", date: "5 hours ago", duration: "12:15" },
  { id: 3, opponent: "CyberPaddle", result: "win", score: "11 - 3", date: "Yesterday", duration: "5:20" },
  { id: 4, opponent: "QuantumServe", result: "win", score: "11 - 9", date: "Yesterday", duration: "10:05" },
  { id: 5, opponent: "VortexPlayer", result: "loss", score: "6 - 11", date: "2 days ago", duration: "7:30" },
];

function MatchRow({ match }: { match: MatchData }) {
  const isWin = match.result === "win";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter">
      {/* Result indicator */}
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
          isWin
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {isWin ? "W" : "L"}
      </div>

      {/* Opponent & date */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          vs {match.opponent}
        </p>
        <p className="text-xs text-zinc-500">{match.date}</p>
      </div>

      {/* Score */}
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            isWin ? "text-emerald-400" : "text-red-400"
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

interface FriendData {
  id: number;
  name: string;
  status: "online" | "in-game" | "idle";
  avatar: string;
}

const onlineFriends: FriendData[] = [
  { id: 1, name: "NeonBlade42", status: "online", avatar: "NB" },
  { id: 2, name: "PixelStorm", status: "in-game", avatar: "PS" },
  { id: 3, name: "CyberPaddle", status: "online", avatar: "CP" },
  { id: 4, name: "ArcadeKing", status: "idle", avatar: "AK" },
  { id: 5, name: "RetroWave", status: "in-game", avatar: "RW" },
];

function FriendRow({ friend }: { friend: FriendData }) {
  const statusColors = {
    online: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
    "in-game": "bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]",
    idle: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
  };

  const statusLabels = {
    online: "Online",
    "in-game": "In Game",
    idle: "Idle",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-white/5">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent-light">
          {friend.avatar}
        </div>
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
        <button className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent-light transition-colors hover:bg-accent/20">
          Invite
        </button>
      )}
    </div>
  );
}

/* ──────────────────────── Leaderboard Row ──────────────────────── */

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  wins: number;
  elo: number;
}

const topPlayers: LeaderboardEntry[] = [
  { rank: 1, name: "NeonBlade42", avatar: "NB", wins: 142, elo: 2450 },
  { rank: 2, name: "QuantumServe", avatar: "QS", wins: 128, elo: 2380 },
  { rank: 3, name: "CyberPaddle", avatar: "CP", wins: 115, elo: 2310 },
  { rank: 4, name: "You", avatar: "U", wins: 87, elo: 1850 },
  { rank: 5, name: "ArcadeKing", avatar: "AK", wins: 76, elo: 1780 },
];

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const isUser = entry.name === "You";
  const rankColors: Record<number, string> = {
    1: "text-amber-400",
    2: "text-zinc-300",
    3: "text-amber-600",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        isUser
          ? "bg-accent/5 ring-1 ring-accent/20"
          : "hover:bg-white/5"
      }`}
    >
      <span
        className={`w-5 text-center text-sm font-bold ${
          rankColors[entry.rank] || "text-zinc-500"
        }`}
      >
        {entry.rank}
      </span>
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
          isUser
            ? "bg-accent/20 text-accent-light ring-1 ring-accent/30"
            : "bg-white/5 text-zinc-400"
        }`}
      >
        {entry.avatar}
      </div>
      <span
        className={`flex-1 truncate text-sm font-medium ${
          isUser ? "text-accent-light" : "text-zinc-300"
        }`}
      >
        {entry.name}
      </span>
      <span className="text-xs text-zinc-500">{entry.elo} ELO</span>
    </div>
  );
}

/* ──────────────────────── Page ──────────────────────── */

export default function DashboardPage() {
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
                <span className="text-accent neon-text-purple">Player</span>
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Ready for your next match? Your current rank is{" "}
                <span className="font-semibold text-neon-cyan">#4</span>
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
          <StatCard
            icon={<TrophyIcon className="h-5 w-5" />}
            label="Total Wins"
            value="87"
            subValue="+3 today"
            glowColor="purple"
          />
          <StatCard
            icon={<SwordsIcon className="h-5 w-5" />}
            label="Total Matches"
            value="134"
            subValue="5 today"
            glowColor="cyan"
          />
          <StatCard
            icon={<TargetIcon className="h-5 w-5" />}
            label="Win Rate"
            value="64.9%"
            subValue="+2.1%"
            glowColor="green"
          />
          <StatCard
            icon={<FlameIcon className="h-5 w-5" />}
            label="Win Streak"
            value="3"
            subValue="Best: 8"
            glowColor="pink"
          />
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
              <div className="space-y-2">
                {recentMatches.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
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
              <div className="space-y-0.5">
                {onlineFriends.map((friend) => (
                  <FriendRow key={friend.id} friend={friend} />
                ))}
              </div>
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
              <div className="space-y-0.5">
                {topPlayers.map((entry) => (
                  <LeaderboardRow key={entry.rank} entry={entry} />
                ))}
              </div>
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
                  <ClockIcon className="h-4 w-4 text-zinc-500" />
                  Open Chat
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface-lighter px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-white/10 hover:text-white"
                >
                  <TargetIcon className="h-4 w-4 text-zinc-500" />
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
