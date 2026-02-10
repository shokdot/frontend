"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ──────────────────────── Icons ──────────────────────── */

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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
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

function UserMinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="23" y1="11" x2="17" y2="11" />
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BlockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

/* ──────────────────────── Types ──────────────────────── */

type Status = "online" | "in-game" | "idle" | "offline";
type FriendsTab = "all" | "online" | "pending" | "blocked";

interface Friend {
  id: number;
  username: string;
  avatar: string;
  elo: number;
  status: Status;
  mutualFriends?: number;
}

interface PendingRequest {
  id: number;
  username: string;
  avatar: string;
  elo: number;
  direction: "incoming" | "outgoing";
  time: string;
}

interface BlockedUser {
  id: number;
  username: string;
  avatar: string;
}

/* ──────────────────────── Mock Data ──────────────────────── */

const friendsList: Friend[] = [
  { id: 1, username: "NeonBlade42", avatar: "NB", elo: 2450, status: "online", mutualFriends: 4 },
  { id: 2, username: "PixelStorm", avatar: "PS", elo: 1980, status: "in-game", mutualFriends: 3 },
  { id: 3, username: "CyberPaddle", avatar: "CP", elo: 2310, status: "online", mutualFriends: 5 },
  { id: 4, username: "ArcadeKing", avatar: "AK", elo: 1920, status: "idle", mutualFriends: 2 },
  { id: 5, username: "RetroWave", avatar: "RW", elo: 1870, status: "online", mutualFriends: 3 },
  { id: 6, username: "QuantumServe", avatar: "QS", elo: 2380, status: "offline", mutualFriends: 6 },
  { id: 7, username: "VoltServe", avatar: "VS", elo: 2180, status: "offline", mutualFriends: 1 },
  { id: 8, username: "NeonDrift", avatar: "ND", elo: 2050, status: "online", mutualFriends: 2 },
  { id: 9, username: "HyperRally", avatar: "HR", elo: 1720, status: "idle", mutualFriends: 1 },
  { id: 10, username: "CosmicAce", avatar: "CA", elo: 1640, status: "offline" },
];

const pendingRequests: PendingRequest[] = [
  { id: 1, username: "ShadowSmash", avatar: "SS", elo: 2240, direction: "incoming", time: "2 hours ago" },
  { id: 2, username: "GlitchMaster", avatar: "GM", elo: 1810, direction: "incoming", time: "1 day ago" },
  { id: 3, username: "TurboSpin", avatar: "TS", elo: 1680, direction: "outgoing", time: "3 hours ago" },
  { id: 4, username: "PulsePlayer", avatar: "PP", elo: 1770, direction: "outgoing", time: "2 days ago" },
];

const blockedUsers: BlockedUser[] = [
  { id: 1, username: "ToxicPlayer99", avatar: "TP" },
];

/* ──────────────────────── Status Helpers ──────────────────────── */

const statusDot: Record<Status, string> = {
  online: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
  "in-game": "bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]",
  idle: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
  offline: "bg-zinc-600",
};

const statusLabel: Record<Status, string> = {
  online: "Online",
  "in-game": "In Game",
  idle: "Idle",
  offline: "Offline",
};

const statusOrder: Record<Status, number> = {
  online: 0,
  "in-game": 1,
  idle: 2,
  offline: 3,
};

/* ──────────────────────── Friend Card ──────────────────────── */

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter">
      {/* Avatar */}
      <Link href={`/dashboard/player/${friend.username}`} className="relative flex-shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-zinc-400 transition-colors group-hover:bg-accent/15 group-hover:text-accent-light">
          {friend.avatar}
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-surface-lighter ${statusDot[friend.status]}`} />
      </Link>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <Link href={`/dashboard/player/${friend.username}`} className="group/name">
          <p className="truncate text-sm font-medium text-zinc-200 transition-colors group-hover/name:text-accent-light">
            {friend.username}
          </p>
        </Link>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>{statusLabel[friend.status]}</span>
          <span className="text-zinc-700">·</span>
          <span>{friend.elo} ELO</span>
          {friend.mutualFriends !== undefined && friend.mutualFriends > 0 && (
            <>
              <span className="text-zinc-700">·</span>
              <span>{friend.mutualFriends} mutual</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {friend.status === "online" && (
          <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan" title="Invite to game">
            <GamepadIcon className="h-4 w-4" />
          </button>
        )}
        <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-accent/10 hover:text-accent-light" title="Message">
          <ChatIcon className="h-4 w-4" />
        </button>
        <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400" title="Remove friend">
          <UserMinusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────── Pending Card ──────────────────────── */

function PendingCard({ request }: { request: PendingRequest }) {
  const isIncoming = request.direction === "incoming";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter">
      {/* Avatar */}
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-zinc-400">
        {request.avatar}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-200">{request.username}</p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>{request.elo} ELO</span>
          <span className="text-zinc-700">·</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {request.time}
          </span>
        </div>
      </div>

      {/* Direction label */}
      <span className={`hidden rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline-block ${
        isIncoming
          ? "bg-accent/10 text-accent-light"
          : "bg-white/5 text-zinc-400"
      }`}>
        {isIncoming ? "Incoming" : "Sent"}
      </span>

      {/* Actions */}
      {isIncoming ? (
        <div className="flex items-center gap-1.5">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors hover:bg-emerald-500/20" title="Accept">
            <CheckIcon className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20" title="Decline">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20">
          Cancel
        </button>
      )}
    </div>
  );
}

/* ──────────────────────── Blocked Card ──────────────────────── */

function BlockedCard({ user }: { user: BlockedUser }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3 transition-all hover:border-white/10 hover:bg-surface-lighter">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-500/5 text-sm font-bold text-zinc-500">
        {user.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-400">{user.username}</p>
        <p className="text-xs text-zinc-600">Blocked</p>
      </div>
      <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200">
        Unblock
      </button>
    </div>
  );
}

/* ──────────────────────── Page ──────────────────────── */

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<FriendsTab>("all");
  const [search, setSearch] = useState("");

  const onlineCount = friendsList.filter((f) => f.status !== "offline").length;
  const incomingCount = pendingRequests.filter((r) => r.direction === "incoming").length;

  const filteredFriends = useMemo(() => {
    let list = [...friendsList];

    if (activeTab === "online") {
      list = list.filter((f) => f.status !== "offline");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.username.toLowerCase().includes(q));
    }

    list.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    return list;
  }, [activeTab, search]);

  const filteredPending = useMemo(() => {
    if (!search.trim()) return pendingRequests;
    const q = search.toLowerCase();
    return pendingRequests.filter((r) => r.username.toLowerCase().includes(q));
  }, [search]);

  const tabs: { id: FriendsTab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: friendsList.length },
    { id: "online", label: "Online", count: onlineCount },
    { id: "pending", label: "Pending", count: incomingCount },
    { id: "blocked", label: "Blocked", count: blockedUsers.length },
  ];

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
                <UsersIcon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Friends</h1>
                <p className="mt-0.5 text-sm text-zinc-400">
                  <span className="text-emerald-400 font-medium">{onlineCount}</span> online · {friendsList.length} total
                </p>
              </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-[#fff] shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_35px_rgba(139,92,246,0.6)]">
              <UserPlusIcon className="h-4 w-4" />
              Add Friend
            </button>
          </div>
        </div>

        {/* ── Tabs + Search ── */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="flex gap-1 rounded-xl border border-white/5 bg-surface-light p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-accent/10 text-accent-light shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTab === tab.id
                      ? "bg-accent/20 text-accent-light"
                      : "bg-white/5 text-zinc-500"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          {(activeTab === "all" || activeTab === "online" || activeTab === "pending") && (
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search friends..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/5 bg-surface-light py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
              />
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="mt-4">
          {/* Friends list */}
          {(activeTab === "all" || activeTab === "online") && (
            <div className="space-y-2">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))
              ) : (
                <div className="rounded-2xl border border-white/5 bg-surface-light py-16 text-center">
                  <UsersIcon className="mx-auto h-8 w-8 text-zinc-600" />
                  <p className="mt-3 text-sm text-zinc-500">
                    {search.trim()
                      ? "No friends match your search"
                      : activeTab === "online"
                        ? "No friends are online right now"
                        : "You haven't added any friends yet"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pending requests */}
          {activeTab === "pending" && (
            <div className="space-y-4">
              {/* Incoming */}
              {filteredPending.filter((r) => r.direction === "incoming").length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Incoming Requests
                  </h3>
                  <div className="space-y-2">
                    {filteredPending
                      .filter((r) => r.direction === "incoming")
                      .map((req) => (
                        <PendingCard key={req.id} request={req} />
                      ))}
                  </div>
                </div>
              )}

              {/* Outgoing */}
              {filteredPending.filter((r) => r.direction === "outgoing").length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Sent Requests
                  </h3>
                  <div className="space-y-2">
                    {filteredPending
                      .filter((r) => r.direction === "outgoing")
                      .map((req) => (
                        <PendingCard key={req.id} request={req} />
                      ))}
                  </div>
                </div>
              )}

              {filteredPending.length === 0 && (
                <div className="rounded-2xl border border-white/5 bg-surface-light py-16 text-center">
                  <ClockIcon className="mx-auto h-8 w-8 text-zinc-600" />
                  <p className="mt-3 text-sm text-zinc-500">
                    {search.trim() ? "No pending requests match your search" : "No pending friend requests"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Blocked */}
          {activeTab === "blocked" && (
            <div className="space-y-2">
              {blockedUsers.length > 0 ? (
                blockedUsers.map((user) => (
                  <BlockedCard key={user.id} user={user} />
                ))
              ) : (
                <div className="rounded-2xl border border-white/5 bg-surface-light py-16 text-center">
                  <BlockIcon className="mx-auto h-8 w-8 text-zinc-600" />
                  <p className="mt-3 text-sm text-zinc-500">No blocked users</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
