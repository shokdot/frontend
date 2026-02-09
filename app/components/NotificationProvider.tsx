"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ──────────────────────── Types ──────────────────────── */

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = sticky
}

interface NotificationContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within <NotificationProvider>"
    );
  return ctx;
}

/* ──────────────────────── Icons ──────────────────────── */

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ──────────────────────── Toast styling map ──────────────────────── */

const toastStyles: Record<
  NotificationType,
  { icon: typeof CheckCircleIcon; iconClass: string; border: string; glow: string; bar: string }
> = {
  success: {
    icon: CheckCircleIcon,
    iconClass: "text-emerald-400",
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.1)]",
    bar: "bg-emerald-400",
  },
  error: {
    icon: XCircleIcon,
    iconClass: "text-red-400",
    border: "border-red-500/20",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.1)]",
    bar: "bg-red-400",
  },
  info: {
    icon: InfoIcon,
    iconClass: "text-neon-cyan",
    border: "border-neon-cyan/20",
    glow: "shadow-[0_0_20px_rgba(0,240,255,0.1)]",
    bar: "bg-neon-cyan",
  },
  warning: {
    icon: AlertTriangleIcon,
    iconClass: "text-amber-400",
    border: "border-amber-500/20",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.1)]",
    bar: "bg-amber-400",
  },
};

/* ──────────────────────── Single Toast ──────────────────────── */

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const duration = toast.duration ?? 5000;
  const style = toastStyles[toast.type];
  const Icon = style.icon;

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        setExiting(true);
        setTimeout(onRemove, 300);
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(onRemove, 300);
  }

  return (
    <div
      className={`pointer-events-auto relative w-80 overflow-hidden rounded-xl border bg-surface-light backdrop-blur-xl transition-all duration-300 sm:w-96 ${style.border} ${style.glow} ${
        visible && !exiting
          ? "translate-x-0 opacity-100"
          : "translate-x-8 opacity-0"
      }`}
    >
      <div className="flex gap-3 p-4">
        <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.iconClass}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          {toast.message && (
            <p className="mt-0.5 text-sm text-zinc-400">{toast.message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-md p-0.5 text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/5">
          <div
            className={`h-full ${style.bar} opacity-60`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Provider ──────────────────────── */

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast container — fixed bottom-right */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-3 sm:bottom-6 sm:right-6">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
