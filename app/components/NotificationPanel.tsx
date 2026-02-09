"use client";

import { useEffect, useRef, useState } from "react";

/* ──────────────────────── Types ──────────────────────── */

type NotifKind = "game_invite" | "friend_request" | "match_result" | "system";

interface Notification {
  id: string;
  kind: NotifKind;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

/* ──────────────────────── Icons ──────────────────────── */

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function GamepadSmIcon({ className }: { className?: string }) {
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
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function TrophySmIcon({ className }: { className?: string }) {
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

function InfoSmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function CheckAllIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 12 5 16 11 6" />
      <polyline points="9 12 13 16 22 4" />
    </svg>
  );
}

/* ──────────────────────── Style map ──────────────────────── */

const kindStyle: Record<NotifKind, { icon: typeof BellIcon; iconBg: string; iconColor: string }> = {
  game_invite: {
    icon: GamepadSmIcon,
    iconBg: "bg-neon-cyan/10",
    iconColor: "text-neon-cyan",
  },
  friend_request: {
    icon: UserPlusIcon,
    iconBg: "bg-accent/10",
    iconColor: "text-accent-light",
  },
  match_result: {
    icon: TrophySmIcon,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
  system: {
    icon: InfoSmIcon,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
  },
};

/* ──────────────────────── Sample data ──────────────────────── */

const sampleNotifications: Notification[] = [
  {
    id: "1",
    kind: "game_invite",
    title: "Game Invite",
    message: "NeonBlade42 challenged you to a match!",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    kind: "friend_request",
    title: "Friend Request",
    message: "PixelStorm wants to be your friend.",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    kind: "match_result",
    title: "Match Finished",
    message: "You won against CyberPaddle 11-3!",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    kind: "system",
    title: "System Update",
    message: "Server maintenance scheduled for tonight.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    kind: "game_invite",
    title: "Game Invite",
    message: "RetroWave wants a rematch!",
    time: "5 hours ago",
    read: true,
  },
];

/* ──────────────────────── Component ──────────────────────── */

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function removeNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Bell trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neon-pink shadow-[0_0_6px_rgba(224,64,251,0.8)]" />
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 top-full mt-2 w-80 origin-top-right transition-all duration-200 sm:w-96 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-light shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-neon-cyan"
              >
                <CheckAllIcon className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BellIcon className="mb-3 h-8 w-8 text-zinc-600" />
                <p className="text-sm text-zinc-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const style = kindStyle[notif.kind];
                const Icon = style.icon;

                return (
                  <div
                    key={notif.id}
                    className={`group relative flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] ${
                      !notif.read ? "bg-accent/[0.03]" : ""
                    }`}
                  >
                    {/* Unread dot */}
                    {!notif.read && (
                      <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
                    )}

                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
                    >
                      <Icon className={`h-4 w-4 ${style.iconColor}`} />
                    </div>

                    {/* Content */}
                    <button
                      onClick={() => markRead(notif.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className={`text-sm font-medium ${notif.read ? "text-zinc-400" : "text-white"}`}>
                        {notif.title}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-600">
                        {notif.time}
                      </p>
                    </button>

                    {/* Dismiss */}
                    <button
                      onClick={() => removeNotification(notif.id)}
                      className="mt-0.5 flex-shrink-0 rounded-md p-1 text-zinc-600 opacity-0 transition-all hover:text-zinc-300 group-hover:opacity-100"
                      aria-label="Dismiss"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-white/5 px-4 py-2.5 text-center">
              <button className="text-xs font-medium text-zinc-500 transition-colors hover:text-neon-cyan">
                View all notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
