"use client";

import { useState } from "react";
import Link from "next/link";

/* ──────────────────────── Icons ──────────────────────── */

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
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

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
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

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* ──────────────────────── Mock Data ──────────────────────── */

const profileData = {
  username: "Player",
  displayName: "Player One",
  email: "player@example.com",
  bio: "Competitive pong player. Always looking for a challenge. Let's see what you've got!",
  avatar: "PO",
  status: "online" as const,
  joinDate: "January 2026",
  location: "Paris, France",
  elo: 1850,
  rank: 4,
  stats: {
    wins: 87,
    losses: 47,
    totalMatches: 134,
    winRate: 64.9,
    winStreak: 3,
    bestStreak: 8,
    avgScore: 9.2,
    totalPlayTime: "48h 32m",
  },
  linkedAccounts: {
    github: true,
  },
};

interface MatchData {
  id: number;
  opponent: string;
  result: "win" | "loss";
  score: string;
  date: string;
  eloChange: number;
}

const matchHistory: MatchData[] = [
  { id: 1, opponent: "NeonBlade42", result: "win", score: "11 - 7", date: "2 hours ago", eloChange: +18 },
  { id: 2, opponent: "PixelStorm", result: "loss", score: "9 - 11", date: "5 hours ago", eloChange: -14 },
  { id: 3, opponent: "CyberPaddle", result: "win", score: "11 - 3", date: "Yesterday", eloChange: +12 },
  { id: 4, opponent: "QuantumServe", result: "win", score: "11 - 9", date: "Yesterday", eloChange: +22 },
  { id: 5, opponent: "VortexPlayer", result: "loss", score: "6 - 11", date: "2 days ago", eloChange: -16 },
  { id: 6, opponent: "RetroWave", result: "win", score: "11 - 5", date: "2 days ago", eloChange: +15 },
  { id: 7, opponent: "ArcadeKing", result: "win", score: "11 - 8", date: "3 days ago", eloChange: +20 },
  { id: 8, opponent: "GlitchMaster", result: "loss", score: "7 - 11", date: "3 days ago", eloChange: -12 },
];

/* ──────────────────────── Edit Profile Modal ──────────────────────── */

function EditProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [displayName, setDisplayName] = useState(profileData.displayName);
  const [bio, setBio] = useState(profileData.bio);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    // TODO: wire to API — PATCH /api/v1/users/me
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-white/5 bg-surface-light p-6 shadow-[0_0_40px_rgba(139,92,246,0.1)] sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-xl font-bold text-accent-light ring-2 ring-accent/30">
                {profileData.avatar}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
              >
                <CameraIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Profile photo</p>
              <p className="text-xs text-zinc-500">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-neon-cyan/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] focus:ring-1 focus:ring-neon-cyan/30"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
              className="w-full resize-none rounded-lg border border-white/10 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-neon-cyan/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] focus:ring-1 focus:ring-neon-cyan/30"
            />
            <p className="mt-1 text-right text-xs text-zinc-600">{bio.length}/160</p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 bg-surface-lighter py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ──────────────────────── Page ──────────────────────── */

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const { stats } = profileData;

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
                  {profileData.avatar}
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
                    {profileData.displayName}
                  </h1>
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-light">
                    #{profileData.rank}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">@{profileData.username}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
                  {profileData.bio}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Joined {profileData.joinDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GlobeIcon className="h-3.5 w-3.5" />
                    {profileData.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ChartIcon className="h-3.5 w-3.5" />
                    {profileData.elo} ELO
                  </span>
                  {profileData.linkedAccounts.github && (
                    <span className="inline-flex items-center gap-1.5">
                      <GithubIcon className="h-3.5 w-3.5" />
                      GitHub linked
                    </span>
                  )}
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-lighter px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-accent/30 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] sm:self-auto"
              >
                <EditIcon className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-accent/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.06)] sm:p-5">
            <p className="text-2xl font-bold text-white">{stats.wins}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Wins</p>
            <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-emerald-500/30">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-surface-light p-4 text-center transition-all hover:border-red-500/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.06)] sm:p-5">
            <p className="text-2xl font-bold text-white">{stats.losses}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Losses</p>
            <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-red-500/30">
              <div
                className="h-full rounded-full bg-red-400"
                style={{ width: `${100 - stats.winRate}%` }}
              />
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
          <h2 className="mb-4 text-lg font-semibold text-white">Match History</h2>

          {/* Table header (desktop) */}
          <div className="mb-3 hidden grid-cols-[1fr_auto_auto_auto] gap-4 px-4 text-xs font-medium uppercase tracking-wider text-zinc-500 sm:grid">
            <span>Opponent</span>
            <span className="w-20 text-center">Score</span>
            <span className="w-20 text-center">ELO</span>
            <span className="w-24 text-right">Date</span>
          </div>

          <div className="space-y-2">
            {matchHistory.map((match) => {
              const isWin = match.result === "win";
              return (
                <div
                  key={match.id}
                  className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter"
                >
                  {/* Result indicator */}
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isWin ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isWin ? "W" : "L"}
                  </div>

                  {/* Opponent */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      vs {match.opponent}
                    </p>
                    <p className="text-xs text-zinc-500 sm:hidden">{match.date}</p>
                  </div>

                  {/* Score */}
                  <span
                    className={`text-sm font-semibold ${
                      isWin ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {match.score}
                  </span>

                  {/* ELO change */}
                  <span
                    className={`hidden w-20 text-center text-sm font-medium sm:block ${
                      match.eloChange > 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {match.eloChange > 0 ? "+" : ""}
                    {match.eloChange}
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
        </div>
      </div>

      {/* Edit modal */}
      <EditProfileModal isOpen={isEditing} onClose={() => setIsEditing(false)} />
    </div>
  );
}
