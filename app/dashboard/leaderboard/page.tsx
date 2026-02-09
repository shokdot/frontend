"use client";

import { useState, useMemo } from "react";

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

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ──────────────────────── Types ──────────────────────── */

type SortField = "rank" | "elo" | "wins" | "winRate";
type SortDirection = "asc" | "desc";
type TrendDirection = "up" | "down" | "stable";

interface LeaderboardPlayer {
  rank: number;
  name: string;
  avatar: string;
  wins: number;
  losses: number;
  elo: number;
  trend: TrendDirection;
  isCurrentUser?: boolean;
}

/* ──────────────────────── Mock Data ──────────────────────── */

const leaderboardData: LeaderboardPlayer[] = [
  { rank: 1, name: "NeonBlade42", avatar: "NB", wins: 142, losses: 28, elo: 2450, trend: "up" },
  { rank: 2, name: "QuantumServe", avatar: "QS", wins: 128, losses: 35, elo: 2380, trend: "up" },
  { rank: 3, name: "CyberPaddle", avatar: "CP", wins: 115, losses: 40, elo: 2310, trend: "down" },
  { rank: 4, name: "ShadowSmash", avatar: "SS", wins: 108, losses: 42, elo: 2240, trend: "up" },
  { rank: 5, name: "VoltServe", avatar: "VS", wins: 102, losses: 48, elo: 2180, trend: "stable" },
  { rank: 6, name: "BlitzPong", avatar: "BP", wins: 98, losses: 52, elo: 2120, trend: "down" },
  { rank: 7, name: "NeonDrift", avatar: "ND", wins: 94, losses: 50, elo: 2050, trend: "up" },
  { rank: 8, name: "PixelStorm", avatar: "PS", wins: 91, losses: 55, elo: 1980, trend: "stable" },
  { rank: 9, name: "ArcadeKing", avatar: "AK", wins: 89, losses: 57, elo: 1920, trend: "up" },
  { rank: 10, name: "RetroWave", avatar: "RW", wins: 85, losses: 60, elo: 1870, trend: "down" },
  { rank: 11, name: "You", avatar: "U", wins: 87, losses: 47, elo: 1850, trend: "up", isCurrentUser: true },
  { rank: 12, name: "GlitchMaster", avatar: "GM", wins: 80, losses: 62, elo: 1810, trend: "stable" },
  { rank: 13, name: "PulsePlayer", avatar: "PP", wins: 77, losses: 58, elo: 1770, trend: "down" },
  { rank: 14, name: "HyperRally", avatar: "HR", wins: 74, losses: 63, elo: 1720, trend: "up" },
  { rank: 15, name: "TurboSpin", avatar: "TS", wins: 70, losses: 65, elo: 1680, trend: "stable" },
  { rank: 16, name: "CosmicAce", avatar: "CA", wins: 68, losses: 68, elo: 1640, trend: "down" },
  { rank: 17, name: "VortexPlayer", avatar: "VP", wins: 65, losses: 70, elo: 1600, trend: "up" },
  { rank: 18, name: "ZenPaddle", avatar: "ZP", wins: 60, losses: 72, elo: 1550, trend: "stable" },
  { rank: 19, name: "NovaBounce", avatar: "NV", wins: 55, losses: 75, elo: 1500, trend: "down" },
  { rank: 20, name: "EchoStrike", avatar: "ES", wins: 50, losses: 78, elo: 1450, trend: "stable" },
];

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
    <div className={`flex flex-col items-center ${place === 1 ? "order-2" : place === 2 ? "order-1" : "order-3"}`}>
      {/* Crown for #1 */}
      {place === 1 && (
        <CrownIcon className="mb-1 h-6 w-6 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
      )}

      {/* Avatar */}
      <div className="relative">
        <div
          className={`flex items-center justify-center rounded-full ${c.avatarSize} ${c.bgColor} font-bold ${c.textColor} ring-2 ${c.ringColor}`}
        >
          {player.avatar}
        </div>
        <div
          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${c.bgColor} text-[10px] font-bold ${c.textColor} ring-1 ${c.ringColor} ${c.badgeGlow}`}
        >
          {place}
        </div>
      </div>

      {/* Name */}
      <p className={`mt-2 text-sm font-semibold ${c.textColor}`}>
        {player.name}
      </p>
      <p className="text-xs text-zinc-500">{player.elo} ELO</p>

      {/* Podium bar */}
      <div
        className={`mt-3 w-24 rounded-t-xl border border-white/5 ${c.bgColor} ${c.height} ${c.glowColor} flex items-center justify-center sm:w-28`}
      >
        <span className={`text-lg font-bold ${c.textColor}`}>{c.label}</span>
      </div>
    </div>
  );
}

/* ──────────────────────── Trend Indicator ──────────────────────── */

function TrendIndicator({ trend }: { trend: TrendDirection }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-400">
        <ChevronUpIcon className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-0.5 text-red-400">
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-zinc-500">
      <MinusIcon className="h-3.5 w-3.5" />
    </span>
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
      className={`inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors ${
        isActive ? "text-neon-cyan" : "text-zinc-500 hover:text-zinc-300"
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

/* ──────────────────────── Page ──────────────────────── */

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const currentUser = leaderboardData.find((p) => p.isCurrentUser);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "rank" ? "asc" : "desc");
    }
  }

  const filteredAndSorted = useMemo(() => {
    let data = [...leaderboardData];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(q));
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
        case "winRate":
          aVal = a.wins / (a.wins + a.losses);
          bVal = b.wins / (b.wins + b.losses);
          break;
      }
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [search, sortField, sortDirection]);

  const topThree = leaderboardData.slice(0, 3);

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
            {currentUser && (
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-xl border border-accent/15 bg-accent/5 px-4 py-2.5">
                  <p className="text-xs text-zinc-500">Your Rank</p>
                  <p className="text-lg font-bold text-accent-light">
                    #{currentUser.rank}
                  </p>
                </div>
                <div className="rounded-xl border border-neon-cyan/15 bg-neon-cyan/5 px-4 py-2.5">
                  <p className="text-xs text-zinc-500">Your ELO</p>
                  <p className="text-lg font-bold text-neon-cyan">
                    {currentUser.elo}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-2.5">
                  <p className="text-xs text-zinc-500">Win Rate</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {((currentUser.wins / (currentUser.wins + currentUser.losses)) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5">
                  <p className="text-xs text-zinc-500">Total Players</p>
                  <p className="text-lg font-bold text-zinc-300">
                    {leaderboardData.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Podium ── */}
        <div className="mt-8 flex items-end justify-center gap-2 sm:gap-4">
          {topThree[1] && <PodiumCard player={topThree[1]} place={2} />}
          {topThree[0] && <PodiumCard player={topThree[0]} place={1} />}
          {topThree[2] && <PodiumCard player={topThree[2]} place={3} />}
        </div>

        {/* ── Search + Table ── */}
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
            <div className="w-8" /> {/* Trend space */}
          </div>

          {/* Table rows */}
          <div className="mt-1 space-y-1">
            {filteredAndSorted.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-zinc-500">No players found</p>
              </div>
            ) : (
              filteredAndSorted.map((player) => {
                const winRate = ((player.wins / (player.wins + player.losses)) * 100).toFixed(1);
                const isUser = player.isCurrentUser;

                return (
                  <div
                    key={player.rank}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                      isUser
                        ? "bg-accent/5 ring-1 ring-accent/20"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-10 flex-shrink-0">
                      <RankBadge rank={player.rank} />
                    </div>

                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 ${
                        isUser
                          ? "bg-accent/20 text-accent-light ring-1 ring-accent/30"
                          : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      {player.avatar}
                    </div>

                    {/* Name + mobile stats */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${
                          isUser ? "text-accent-light" : "text-zinc-200"
                        }`}
                      >
                        {player.name}
                        {isUser && (
                          <span className="ml-1.5 text-xs text-accent/60">(you)</span>
                        )}
                      </p>
                      {/* Mobile-only stats */}
                      <p className="mt-0.5 text-xs text-zinc-500 sm:hidden">
                        {player.elo} ELO · {player.wins}W / {player.losses}L · {winRate}%
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

                    {/* Trend */}
                    <div className="w-8 flex-shrink-0 text-center">
                      <TrendIndicator trend={player.trend} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
