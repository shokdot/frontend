"use client";

import { useState, useRef, useEffect } from "react";

/* ──────────────────────── Icons ──────────────────────── */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function HashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
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

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function EllipsisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

/* ──────────────────────── Types ──────────────────────── */

type Status = "online" | "in-game" | "idle" | "offline";

interface Conversation {
  id: string;
  type: "dm" | "channel";
  name: string;
  avatar: string;
  status?: Status;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  isOwn: boolean;
}

/* ──────────────────────── Mock Data ──────────────────────── */

const conversations: Conversation[] = [
  { id: "1", type: "dm", name: "NeonBlade42", avatar: "NB", status: "online", lastMessage: "gg! rematch?", lastTime: "2m", unread: 2 },
  { id: "2", type: "dm", name: "PixelStorm", avatar: "PS", status: "in-game", lastMessage: "Nice one, that was close", lastTime: "15m", unread: 0 },
  { id: "3", type: "dm", name: "CyberPaddle", avatar: "CP", status: "online", lastMessage: "I'll be on later tonight", lastTime: "1h", unread: 1 },
  { id: "4", type: "channel", name: "general", avatar: "#", status: undefined, lastMessage: "RetroWave: anyone up for a game?", lastTime: "5m", unread: 4 },
  { id: "5", type: "channel", name: "tournaments", avatar: "#", status: undefined, lastMessage: "ArcadeKing: neon cup starts at 8pm", lastTime: "30m", unread: 0 },
  { id: "6", type: "dm", name: "ArcadeKing", avatar: "AK", status: "idle", lastMessage: "Sure, let me know when", lastTime: "3h", unread: 0 },
  { id: "7", type: "dm", name: "RetroWave", avatar: "RW", status: "online", lastMessage: "That serve was insane lol", lastTime: "5h", unread: 0 },
  { id: "8", type: "channel", name: "strategy", avatar: "#", status: undefined, lastMessage: "VoltServe: try angling your paddle more", lastTime: "1d", unread: 0 },
  { id: "9", type: "dm", name: "QuantumServe", avatar: "QS", status: "offline", lastMessage: "Thanks for the tips!", lastTime: "2d", unread: 0 },
];

const messagesByConversation: Record<string, Message[]> = {
  "1": [
    { id: "m1", sender: "NeonBlade42", avatar: "NB", content: "Hey, nice match earlier!", time: "10:30 AM", isOwn: false },
    { id: "m2", sender: "You", avatar: "U", content: "Thanks! You almost had me at the end there", time: "10:31 AM", isOwn: true },
    { id: "m3", sender: "NeonBlade42", avatar: "NB", content: "That last serve was crazy. How do you do that spin?", time: "10:32 AM", isOwn: false },
    { id: "m4", sender: "You", avatar: "U", content: "It's all about the angle and timing. Hit the edge of the paddle right when the ball arrives", time: "10:33 AM", isOwn: true },
    { id: "m5", sender: "NeonBlade42", avatar: "NB", content: "I need to practice that. Wanna go again?", time: "10:34 AM", isOwn: false },
    { id: "m6", sender: "You", avatar: "U", content: "Sure, give me 5 minutes", time: "10:35 AM", isOwn: true },
    { id: "m7", sender: "NeonBlade42", avatar: "NB", content: "gg! rematch?", time: "10:52 AM", isOwn: false },
  ],
  "2": [
    { id: "m1", sender: "PixelStorm", avatar: "PS", content: "That game was intense", time: "9:15 AM", isOwn: false },
    { id: "m2", sender: "You", avatar: "U", content: "Yeah I thought I was done for at 9-10", time: "9:16 AM", isOwn: true },
    { id: "m3", sender: "PixelStorm", avatar: "PS", content: "Nice one, that was close", time: "9:17 AM", isOwn: false },
  ],
  "3": [
    { id: "m1", sender: "You", avatar: "U", content: "Hey, wanna play tonight?", time: "8:00 AM", isOwn: true },
    { id: "m2", sender: "CyberPaddle", avatar: "CP", content: "I'll be on later tonight", time: "8:45 AM", isOwn: false },
  ],
  "4": [
    { id: "m1", sender: "ArcadeKing", avatar: "AK", content: "Morning everyone!", time: "8:00 AM", isOwn: false },
    { id: "m2", sender: "PixelStorm", avatar: "PS", content: "Hey! Anyone want to warm up?", time: "8:05 AM", isOwn: false },
    { id: "m3", sender: "You", avatar: "U", content: "I'm in, just finished breakfast", time: "8:10 AM", isOwn: true },
    { id: "m4", sender: "NeonBlade42", avatar: "NB", content: "Count me in too!", time: "8:12 AM", isOwn: false },
    { id: "m5", sender: "RetroWave", avatar: "RW", content: "anyone up for a game?", time: "10:48 AM", isOwn: false },
  ],
  "5": [
    { id: "m1", sender: "ArcadeKing", avatar: "AK", content: "neon cup starts at 8pm", time: "10:22 AM", isOwn: false },
  ],
  "6": [
    { id: "m1", sender: "ArcadeKing", avatar: "AK", content: "Sure, let me know when", time: "7:00 AM", isOwn: false },
  ],
  "7": [
    { id: "m1", sender: "RetroWave", avatar: "RW", content: "That serve was insane lol", time: "5:30 PM", isOwn: false },
  ],
  "8": [
    { id: "m1", sender: "VoltServe", avatar: "VS", content: "try angling your paddle more", time: "Yesterday", isOwn: false },
  ],
  "9": [
    { id: "m1", sender: "QuantumServe", avatar: "QS", content: "Thanks for the tips!", time: "2 days ago", isOwn: false },
  ],
};

/* ──────────────────────── Status Helpers ──────────────────────── */

const statusColors: Record<Status, string> = {
  online: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
  "in-game": "bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]",
  idle: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
  offline: "bg-zinc-600",
};

const statusLabels: Record<Status, string> = {
  online: "Online",
  "in-game": "In Game",
  idle: "Idle",
  offline: "Offline",
};

/* ──────────────────────── Conversation Item ──────────────────────── */

function ConversationItem({
  convo,
  isActive,
  onClick,
}: {
  convo: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
        isActive
          ? "bg-accent/10 shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]"
          : "hover:bg-white/5"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {convo.type === "channel" ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-lighter text-sm font-bold text-zinc-400">
            <HashIcon className="h-4 w-4" />
          </div>
        ) : (
          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
            isActive ? "bg-accent/20 text-accent-light" : "bg-white/5 text-zinc-400"
          }`}>
            {convo.avatar}
          </div>
        )}
        {convo.status && (
          <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface-light ${statusColors[convo.status]}`} />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate text-sm font-medium ${isActive ? "text-accent-light" : "text-zinc-200"}`}>
            {convo.type === "channel" ? `# ${convo.name}` : convo.name}
          </p>
          <span className="flex-shrink-0 text-[11px] text-zinc-600">{convo.lastTime}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-zinc-500">{convo.lastMessage}</p>
      </div>

      {/* Unread badge */}
      {convo.unread > 0 && (
        <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(139,92,246,0.5)]">
          {convo.unread}
        </span>
      )}
    </button>
  );
}

/* ──────────────────────── Message Bubble ──────────────────────── */

function MessageBubble({ message }: { message: Message }) {
  if (message.isOwn) {
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[75%]">
          <div className="rounded-2xl rounded-br-md bg-accent/15 px-4 py-2.5 ring-1 ring-accent/10">
            <p className="text-sm leading-relaxed text-zinc-200">{message.content}</p>
          </div>
          <p className="mt-1 text-right text-[11px] text-zinc-600">{message.time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-zinc-400">
        {message.avatar}
      </div>
      <div className="max-w-[75%]">
        <p className="mb-0.5 text-xs font-medium text-zinc-400">{message.sender}</p>
        <div className="rounded-2xl rounded-bl-md bg-surface-lighter px-4 py-2.5 ring-1 ring-white/5">
          <p className="text-sm leading-relaxed text-zinc-200">{message.content}</p>
        </div>
        <p className="mt-1 text-[11px] text-zinc-600">{message.time}</p>
      </div>
    </div>
  );
}

/* ──────────────────────── Page ──────────────────────── */

export default function ChatPage() {
  const [activeConvo, setActiveConvo] = useState("1");
  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(messagesByConversation);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvo)!;
  const messages = localMessages[activeConvo] || [];

  const filteredConversations = search.trim()
    ? conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : conversations;

  const channels = filteredConversations.filter((c) => c.type === "channel");
  const dms = filteredConversations.filter((c) => c.type === "dm");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeConvo]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: Message = {
      id: `own-${Date.now()}`,
      sender: "You",
      avatar: "U",
      content: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };

    setLocalMessages((prev) => ({
      ...prev,
      [activeConvo]: [...(prev[activeConvo] || []), newMsg],
    }));
    setMessageInput("");
  }

  function handleConvoSelect(id: string) {
    setActiveConvo(id);
    setMobileShowChat(true);
  }

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside
          className={`flex w-full flex-col border-r border-white/5 bg-surface-light/50 backdrop-blur-sm md:w-80 md:flex-shrink-0 ${
            mobileShowChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <ChatBubbleIcon className="h-5 w-5 text-accent-light" />
              <h2 className="text-sm font-semibold text-white">Messages</h2>
              {totalUnread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent/15 px-1.5 text-[10px] font-bold text-accent-light">
                  {totalUnread}
                </span>
              )}
            </div>
            <button className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
              <UserPlusIcon className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-white/5 bg-surface-lighter py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {/* Channels */}
            {channels.length > 0 && (
              <div className="mb-1">
                <p className="mb-1 px-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Channels
                </p>
                {channels.map((convo) => (
                  <ConversationItem
                    key={convo.id}
                    convo={convo}
                    isActive={activeConvo === convo.id}
                    onClick={() => handleConvoSelect(convo.id)}
                  />
                ))}
              </div>
            )}

            {/* Direct messages */}
            {dms.length > 0 && (
              <div>
                <p className="mb-1 px-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Direct Messages
                </p>
                {dms.map((convo) => (
                  <ConversationItem
                    key={convo.id}
                    convo={convo}
                    isActive={activeConvo === convo.id}
                    onClick={() => handleConvoSelect(convo.id)}
                  />
                ))}
              </div>
            )}

            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center py-12 text-center">
                <SearchIcon className="mb-2 h-5 w-5 text-zinc-600" />
                <p className="text-sm text-zinc-500">No conversations found</p>
              </div>
            )}
          </div>
        </aside>

        {/* ── Chat Area ── */}
        <div
          className={`flex flex-1 flex-col ${
            mobileShowChat ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-surface-light/30 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {/* Mobile back */}
              <button
                onClick={() => setMobileShowChat(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white md:hidden"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              {/* Avatar */}
              {activeConversation.type === "channel" ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-lighter text-sm font-bold text-zinc-400">
                  <HashIcon className="h-4 w-4" />
                </div>
              ) : (
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent-light">
                    {activeConversation.avatar}
                  </div>
                  {activeConversation.status && (
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface-light ${statusColors[activeConversation.status]}`} />
                  )}
                </div>
              )}

              {/* Name & status */}
              <div>
                <p className="text-sm font-semibold text-white">
                  {activeConversation.type === "channel" ? `# ${activeConversation.name}` : activeConversation.name}
                </p>
                {activeConversation.status && (
                  <p className="text-[11px] text-zinc-500">
                    {statusLabels[activeConversation.status]}
                  </p>
                )}
                {activeConversation.type === "channel" && (
                  <p className="text-[11px] text-zinc-500">
                    {conversations.filter((c) => c.type === "dm").length} members
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {activeConversation.type === "dm" && activeConversation.status === "online" && (
                <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-neon-cyan" title="Invite to game">
                  <GamepadIcon className="h-4 w-4" />
                </button>
              )}
              <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white" title="Members">
                <UsersIcon className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white" title="More">
                <EllipsisIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-2xl space-y-4">
              {/* Conversation start */}
              <div className="flex flex-col items-center pb-4 pt-2 text-center">
                {activeConversation.type === "channel" ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-lighter">
                    <HashIcon className="h-6 w-6 text-zinc-400" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent-light ring-2 ring-accent/20">
                    {activeConversation.avatar}
                  </div>
                )}
                <p className="mt-2 text-sm font-semibold text-white">
                  {activeConversation.type === "channel" ? `# ${activeConversation.name}` : activeConversation.name}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {activeConversation.type === "channel"
                    ? "This is the beginning of the channel."
                    : "This is the beginning of your conversation."}
                </p>
              </div>

              {/* Messages */}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message input */}
          <div className="border-t border-white/5 bg-surface-light/30 px-4 py-3 backdrop-blur-sm sm:px-6">
            <form onSubmit={handleSend} className="mx-auto flex max-w-2xl items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${activeConversation.type === "channel" ? `#${activeConversation.name}` : activeConversation.name}...`}
                className="flex-1 rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
