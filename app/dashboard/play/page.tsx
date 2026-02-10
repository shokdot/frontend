"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ──────────────────────── Icons ──────────────────────── */

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

function BotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

function KeyboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
      <path d="M8 16h8" />
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

function DoorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2z" />
      <path d="M12 11h.01" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function TournamentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v6h6" />
      <path d="M3 9l4-4" />
      <path d="M21 3v6h-6" />
      <path d="M21 9l-4-4" />
      <path d="M3 21v-6h6" />
      <path d="M3 15l4 4" />
      <path d="M21 21v-6h-6" />
      <path d="M21 15l-4 4" />
      <circle cx="12" cy="12" r="3" />
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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

/* ──────────────────────── Types ──────────────────────── */

type AIDifficulty = "easy" | "medium" | "hard";

interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "cyan" | "purple" | "pink" | "amber" | "emerald";
  tags: string[];
}

/* ──────────────────────── Config ──────────────────────── */

const colorMap = {
  cyan: {
    iconBg: "bg-neon-cyan/10 text-neon-cyan",
    border: "border-neon-cyan/15",
    borderHover: "hover:border-neon-cyan/30",
    glow: "hover:shadow-[0_0_30px_rgba(0,240,255,0.08)]",
    activeRing: "ring-neon-cyan/40",
    activeBg: "bg-neon-cyan/5",
    activeBorder: "border-neon-cyan/30",
    activeGlow: "shadow-[0_0_30px_rgba(0,240,255,0.1)]",
    badge: "bg-neon-cyan/10 text-neon-cyan",
    btn: "bg-neon-cyan text-surface shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)]",
  },
  purple: {
    iconBg: "bg-accent/10 text-accent-light",
    border: "border-accent/15",
    borderHover: "hover:border-accent/30",
    glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
    activeRing: "ring-accent/40",
    activeBg: "bg-accent/5",
    activeBorder: "border-accent/30",
    activeGlow: "shadow-[0_0_30px_rgba(139,92,246,0.1)]",
    badge: "bg-accent/10 text-accent-light",
    btn: "bg-accent text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)]",
  },
  pink: {
    iconBg: "bg-neon-pink/10 text-neon-pink",
    border: "border-neon-pink/15",
    borderHover: "hover:border-neon-pink/30",
    glow: "hover:shadow-[0_0_30px_rgba(224,64,251,0.08)]",
    activeRing: "ring-neon-pink/40",
    activeBg: "bg-neon-pink/5",
    activeBorder: "border-neon-pink/30",
    activeGlow: "shadow-[0_0_30px_rgba(224,64,251,0.1)]",
    badge: "bg-neon-pink/10 text-neon-pink",
    btn: "bg-neon-pink text-white shadow-[0_0_20px_rgba(224,64,251,0.4)] hover:shadow-[0_0_35px_rgba(224,64,251,0.6)]",
  },
  amber: {
    iconBg: "bg-amber-500/10 text-amber-400",
    border: "border-amber-500/15",
    borderHover: "hover:border-amber-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    activeRing: "ring-amber-500/40",
    activeBg: "bg-amber-500/5",
    activeBorder: "border-amber-500/30",
    activeGlow: "shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    badge: "bg-amber-500/10 text-amber-400",
    btn: "bg-amber-500 text-surface shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)]",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 text-emerald-400",
    border: "border-emerald-500/15",
    borderHover: "hover:border-emerald-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]",
    activeRing: "ring-emerald-500/40",
    activeBg: "bg-emerald-500/5",
    activeBorder: "border-emerald-500/30",
    activeGlow: "shadow-[0_0_30px_rgba(52,211,153,0.1)]",
    badge: "bg-emerald-500/10 text-emerald-400",
    btn: "bg-emerald-500 text-surface shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_35px_rgba(52,211,153,0.6)]",
  },
};

const gameModes: GameMode[] = [
  {
    id: "ai",
    title: "vs AI",
    description: "Challenge an AI opponent. Choose your difficulty and sharpen your skills.",
    icon: BotIcon,
    color: "cyan",
    tags: ["Single Player", "Practice"],
  },
  {
    id: "local",
    title: "Local 1v1",
    description: "Play against a friend on the same keyboard. Classic couch multiplayer.",
    icon: KeyboardIcon,
    color: "purple",
    tags: ["2 Players", "Same Device"],
  },
  {
    id: "online",
    title: "Online Match",
    description: "Find an opponent online. Get matched by ELO rating for a fair game.",
    icon: GlobeIcon,
    color: "pink",
    tags: ["Ranked", "Matchmaking"],
  },
  {
    id: "room",
    title: "Private Room",
    description: "Create or join a private room. Share the code and play with anyone.",
    icon: DoorIcon,
    color: "amber",
    tags: ["Custom", "Invite"],
  },
  {
    id: "tournament",
    title: "Tournament",
    description: "Compete in a bracket-style tournament. Last one standing wins it all.",
    icon: TournamentIcon,
    color: "emerald",
    tags: ["Competitive", "Bracket"],
  },
];

/* ──────────────────────── Game Mode Card ──────────────────────── */

function GameModeCard({
  mode,
  isSelected,
  onSelect,
}: {
  mode: GameMode;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const c = colorMap[mode.color];
  const Icon = mode.icon;

  return (
    <button
      onClick={onSelect}
      className={`group relative w-full rounded-2xl border p-5 text-left transition-all duration-300 sm:p-6 ${
        isSelected
          ? `${c.activeBorder} ${c.activeBg} ${c.activeGlow} ring-1 ${c.activeRing}`
          : `border-white/5 bg-surface-light ${c.borderHover} ${c.glow}`
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full ${c.iconBg}`}>
          <CheckIcon className="h-3 w-3" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${c.iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">{mode.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">
            {mode.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mode.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${c.badge}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ──────────────────────── AI Options ──────────────────────── */

function AIOptions({
  difficulty,
  onDifficultyChange,
}: {
  difficulty: AIDifficulty;
  onDifficultyChange: (d: AIDifficulty) => void;
}) {
  const difficulties: { id: AIDifficulty; label: string; desc: string; color: string; activeColor: string }[] = [
    { id: "easy", label: "Easy", desc: "Relaxed pace, slower reactions", color: "text-emerald-400", activeColor: "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_15px_rgba(52,211,153,0.08)]" },
    { id: "medium", label: "Medium", desc: "Balanced challenge, fair play", color: "text-amber-400", activeColor: "border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.08)]" },
    { id: "hard", label: "Hard", desc: "Fast and precise, no mercy", color: "text-red-400", activeColor: "border-red-500/30 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.08)]" },
  ];

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-zinc-300">Select Difficulty</h4>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {difficulties.map((d) => (
          <button
            key={d.id}
            onClick={() => onDifficultyChange(d.id)}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              difficulty === d.id
                ? d.activeColor
                : "border-white/5 bg-surface-lighter/50 hover:border-white/10"
            }`}
          >
            <p className={`text-sm font-semibold ${difficulty === d.id ? d.color : "text-zinc-300"}`}>
              {d.label}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">{d.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────── Local Options ──────────────────────── */

function LocalOptions() {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-zinc-300">Controls</h4>
      <div className="rounded-xl border border-white/5 bg-surface-lighter/50 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-neon-cyan">Player 1</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <kbd className="rounded-md border border-white/10 bg-surface px-2 py-0.5 text-xs font-mono text-zinc-300">W</kbd>
                <span className="text-xs text-zinc-500">Move up</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="rounded-md border border-white/10 bg-surface px-2 py-0.5 text-xs font-mono text-zinc-300">S</kbd>
                <span className="text-xs text-zinc-500">Move down</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-accent-light">Player 2</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <kbd className="rounded-md border border-white/10 bg-surface px-2 py-0.5 text-xs font-mono text-zinc-300">&uarr;</kbd>
                <span className="text-xs text-zinc-500">Move up</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="rounded-md border border-white/10 bg-surface px-2 py-0.5 text-xs font-mono text-zinc-300">&darr;</kbd>
                <span className="text-xs text-zinc-500">Move down</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Online Options ──────────────────────── */

function OnlineOptions({
  isSearching,
  onSearch,
  onCancel,
}: {
  isSearching: boolean;
  onSearch: () => void;
  onCancel: () => void;
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-zinc-300">Matchmaking</h4>
      {isSearching ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-neon-pink/15 bg-neon-pink/5 p-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-neon-pink/30 border-t-neon-pink animate-spin" />
            <GlobeIcon className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-neon-pink" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white">Searching for opponent...</p>
            <p className="mt-0.5 text-xs text-zinc-500">Matching by ELO rating (1850)</p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            Cancel Search
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-surface-lighter/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-pink/10">
              <UsersIcon className="h-5 w-5 text-neon-pink" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-200">
                <span className="text-emerald-400">247</span> players online
              </p>
              <p className="text-xs text-zinc-500">Avg. wait time: ~15s</p>
            </div>
            <button
              onClick={onSearch}
              className="rounded-lg bg-neon-pink/10 px-3 py-1.5 text-sm font-medium text-neon-pink transition-colors hover:bg-neon-pink/20"
            >
              Find Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Room Options ──────────────────────── */

function RoomOptions() {
  const [roomTab, setRoomTab] = useState<"create" | "join">("create");
  const [roomCode, setRoomCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  function handleCreate() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-zinc-300">Private Room</h4>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl border border-white/5 bg-surface-lighter/50 p-1">
        <button
          onClick={() => setRoomTab("create")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            roomTab === "create"
              ? "bg-amber-500/10 text-amber-400 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Create Room
        </button>
        <button
          onClick={() => setRoomTab("join")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            roomTab === "join"
              ? "bg-amber-500/10 text-amber-400 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Join Room
        </button>
      </div>

      {roomTab === "create" ? (
        <div className="space-y-3">
          {generatedCode ? (
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
              <p className="mb-2 text-xs text-zinc-500">Share this code with your friend</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-center font-mono text-lg font-bold tracking-[0.3em] text-amber-400">
                  {generatedCode}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-surface-lighter transition-colors hover:border-amber-500/30 hover:text-amber-400"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <CopyIcon className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-zinc-500">Waiting for opponent to join...</p>
              <div className="mt-2 flex justify-center">
                <SpinnerIcon className="h-4 w-4 text-amber-400" />
              </div>
            </div>
          ) : (
            <button
              onClick={handleCreate}
              className="w-full rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-4 text-sm font-medium text-amber-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/10"
            >
              Generate Room Code
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label htmlFor="room-code" className="mb-1.5 block text-xs text-zinc-500">
              Enter the room code
            </label>
            <input
              id="room-code"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. A1B2C3"
              maxLength={6}
              className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-center font-mono text-lg tracking-[0.3em] text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>
          <button
            disabled={roomCode.length < 4}
            className="w-full rounded-xl bg-amber-500/10 py-2.5 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Join Room
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Tournament Options ──────────────────────── */

function TournamentOptions() {
  const tournaments = [
    { id: 1, name: "Neon Cup", players: "8/8", status: "Starting soon", statusColor: "text-amber-400" },
    { id: 2, name: "Weekend Clash", players: "5/16", status: "Open", statusColor: "text-emerald-400" },
    { id: 3, name: "Ranked Showdown", players: "12/16", status: "Filling up", statusColor: "text-neon-cyan" },
  ];

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-zinc-300">Available Tournaments</h4>
      <div className="space-y-2">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <TournamentIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-200">{t.name}</p>
              <p className="text-xs text-zinc-500">{t.players} players</p>
            </div>
            <span className={`text-xs font-medium ${t.statusColor}`}>{t.status}</span>
            <button className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────── Pong Preview ──────────────────────── */

function PongPreview() {
  return (
    <div className="relative h-40 overflow-hidden rounded-xl border border-white/5 bg-surface/80 sm:h-52">
      {/* Field lines */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-white/10" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-mono text-zinc-600">0 : 0</div>

      {/* Left paddle */}
      <div className="absolute left-4 top-1/2 h-14 w-1.5 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.6)]" />

      {/* Right paddle */}
      <div className="absolute right-4 top-[60%] h-14 w-1.5 -translate-y-1/2 rounded-full bg-accent-light shadow-[0_0_12px_rgba(167,139,250,0.6)]" />

      {/* Ball */}
      <div className="absolute h-2.5 w-2.5 rounded-full bg-[#fff] shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-ball" />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
    </div>
  );
}

/* ──────────────────────── Page ──────────────────────── */

export default function PlayPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string>("ai");
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>("medium");
  const [isSearching, setIsSearching] = useState(false);

  const activeMode = gameModes.find((m) => m.id === selectedMode)!;
  const c = colorMap[activeMode.color];

  function handleStart() {
    if (selectedMode === "local") {
      router.push("/dashboard/play/local");
      return;
    }
    if (selectedMode === "online") {
      setIsSearching(true);
    }
    // TODO: wire other modes to game engine / API
  }

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

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-light">
                <GamepadIcon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Play</h1>
                <p className="mt-0.5 text-sm text-zinc-400">
                  Choose a game mode and start playing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left: Game Modes */}
          <div className="space-y-3">
            {gameModes.map((mode) => (
              <GameModeCard
                key={mode.id}
                mode={mode}
                isSelected={selectedMode === mode.id}
                onSelect={() => {
                  setSelectedMode(mode.id);
                  setIsSearching(false);
                }}
              />
            ))}
          </div>

          {/* Right: Options & Preview */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Pong preview */}
            <PongPreview />

            {/* Mode-specific options */}
            <div className="rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.iconBg}`}>
                  <activeMode.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{activeMode.title}</h3>
                  <p className="text-xs text-zinc-500">Configure your game</p>
                </div>
              </div>

              {selectedMode === "ai" && (
                <AIOptions
                  difficulty={aiDifficulty}
                  onDifficultyChange={setAiDifficulty}
                />
              )}
              {selectedMode === "local" && <LocalOptions />}
              {selectedMode === "online" && (
                <OnlineOptions
                  isSearching={isSearching}
                  onSearch={() => setIsSearching(true)}
                  onCancel={() => setIsSearching(false)}
                />
              )}
              {selectedMode === "room" && <RoomOptions />}
              {selectedMode === "tournament" && <TournamentOptions />}

              {/* Start button */}
              {selectedMode !== "online" && selectedMode !== "room" && selectedMode !== "tournament" && (
                <button
                  onClick={handleStart}
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${c.btn}`}
                >
                  Start Game
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
