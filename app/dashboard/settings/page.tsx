"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "../../components/ThemeProvider";
import {
	getMyProfile,
	updateMyProfile,
	updateAvatar,
	fileToBase64,
	ApiUserProfile,
	getNotificationPreferences,
	updateNotificationPreferences,
	getAuthMe,
	changePassword as apiChangePassword,
	setPassword as apiSetPassword,
	disconnectGithub as apiDisconnectGithub,
	setup2FA as apiSetup2FA,
	confirm2FA as apiConfirm2FA,
	disable2FA as apiDisable2FA,
	AuthMeData,
	ApiError,
} from "@/lib/api";
import { getAccessToken, clearAuth } from "@/lib/auth";
import { setNotificationSoundPref } from "@/lib/useNotificationSoundPref";

/* ──────────────────────── Icons ──────────────────────── */

function UserIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}

function ShieldIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	);
}

function BellIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
			<path d="M13.73 21a2 2 0 01-3.46 0" />
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

function TrashIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
			<path d="M10 11v6" />
			<path d="M14 11v6" />
			<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
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

function KeyIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
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

function PaletteIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="13.5" cy="6.5" r="2.5" />
			<circle cx="17.5" cy="10.5" r="2.5" />
			<circle cx="8.5" cy="7.5" r="2.5" />
			<circle cx="6.5" cy="12.5" r="2.5" />
			<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.75 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.02 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-9.95-10-9.95z" />
		</svg>
	);
}

function SunIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="5" />
			<line x1="12" y1="1" x2="12" y2="3" />
			<line x1="12" y1="21" x2="12" y2="23" />
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
			<line x1="1" y1="12" x2="3" y2="12" />
			<line x1="21" y1="12" x2="23" y2="12" />
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
		</svg>
	);
}

function MoonIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
		</svg>
	);
}

function SettingsGearIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
		</svg>
	);
}

/* ──────────────────────── Types ──────────────────────── */

type SettingsTab = "account" | "security" | "notifications" | "game" | "appearance";

/* ──────────────────────── Toggle Switch ──────────────────────── */

function Toggle({
	enabled,
	onChange,
	color = "accent",
}: {
	enabled: boolean;
	onChange: (val: boolean) => void;
	color?: "accent" | "cyan" | "emerald";
}) {
	const colorMap = {
		accent: "bg-accent shadow-[0_0_10px_rgba(139,92,246,0.4)]",
		cyan: "bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.4)]",
		emerald: "bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.4)]",
	};

	return (
		<button
			type="button"
			role="switch"
			aria-checked={enabled}
			onClick={() => onChange(!enabled)}
			className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${enabled ? colorMap[color] : "bg-white/10"
				}`}
		>
			<span
				className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#fff] shadow-lg transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"
					}`}
			/>
		</button>
	);
}

/* ──────────────────────── Section Wrapper ──────────────────────── */

function SettingsSection({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-2xl border border-white/5 bg-surface-light p-5 sm:p-6">
			<div className="mb-5">
				<h3 className="text-base font-semibold text-white">{title}</h3>
				{description && (
					<p className="mt-0.5 text-sm text-zinc-500">{description}</p>
				)}
			</div>
			{children}
		</div>
	);
}

/* ──────────────────────── Setting Row ──────────────────────── */

function SettingRow({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/5">
			<div className="min-w-0">
				<p className="text-sm font-medium text-zinc-200">{label}</p>
				{description && (
					<p className="mt-0.5 text-xs text-zinc-500">{description}</p>
				)}
			</div>
			<div className="flex-shrink-0">{children}</div>
		</div>
	);
}

/* ──────────────────────── Tab Button ──────────────────────── */

function TabButton({
	icon: Icon,
	label,
	isActive,
	onClick,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${isActive
				? "bg-accent/10 text-accent-light shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]"
				: "text-zinc-400 hover:bg-white/5 hover:text-white"
				}`}
		>
			<Icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? "text-accent-light" : ""}`} />
			{label}
			{isActive && (
				<div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
			)}
		</button>
	);
}

/* ──────────────────────── Color Picker ──────────────────────── */

function ColorOption({
	color,
	label,
	isSelected,
	onSelect,
}: {
	color: string;
	label: string;
	isSelected: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			onClick={onSelect}
			className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${isSelected
				? "border-accent/30 bg-accent/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
				: "border-white/5 bg-surface-lighter/50 hover:border-white/10"
				}`}
		>
			<div
				className="h-8 w-8 rounded-full ring-2 ring-white/10"
				style={{ backgroundColor: color }}
			/>
			{isSelected && (
				<div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
					<CheckIcon className="h-2.5 w-2.5 text-white" />
				</div>
			)}
			<span className="text-[11px] text-zinc-500">{label}</span>
		</button>
	);
}

/* ──────────────────────── Page ──────────────────────── */

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<SettingsTab>("account");
	const [isSaving, setIsSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const { theme, setTheme } = useTheme();

	/* Profile data */
	const [profile, setProfile] = useState<ApiUserProfile | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarError, setAvatarError] = useState<string | null>(null);
	const [avatarUploading, setAvatarUploading] = useState(false);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const loadProfile = useCallback(async () => {
		try {
			const res = await getMyProfile();
			setProfile(res.data);
		} catch {
			// Silently fail; settings page can still function
		}
	}, []);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setAvatarError(null);
		try {
			const base64 = await fileToBase64(file);
			setAvatarPreview(base64);
			setAvatarUploading(true);
			await updateAvatar(base64);
			// Update profile data so the avatar persists in state
			setProfile((prev) => prev ? { ...prev, avatarUrl: base64 } : prev);
			setAvatarPreview(null);
		} catch (err: unknown) {
			setAvatarPreview(null);
			const message = err instanceof Error ? err.message : "Failed to upload avatar";
			setAvatarError(message);
		} finally {
			setAvatarUploading(false);
		}
	}

	/* Account */
	const [displayName, setDisplayName] = useState("");
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [saveError, setSaveError] = useState<string | null>(null);

	// Sync form fields when profile loads
	useEffect(() => {
		if (profile) {
			setDisplayName(profile.displayName || "");
			setUsername(profile.username || "");
			setBio(profile.bio || "");
		}
	}, [profile]);

	/* Security */
	const [authMe, setAuthMe] = useState<AuthMeData | null>(null);
	const twoFactorEnabled = authMe?.twoFactorEnabled ?? false;
	const githubLinked = authMe?.githubLinked ?? false;
	const hasPassword = authMe?.hasPassword ?? false;

	/* 2FA setup flow */
	const [twoFaStep, setTwoFaStep] = useState<"idle" | "qr" | "confirming">("idle");
	const [twoFaQrCode, setTwoFaQrCode] = useState<string | null>(null);
	const [twoFaCode, setTwoFaCode] = useState("");
	const [twoFaError, setTwoFaError] = useState<string | null>(null);
	const [twoFaLoading, setTwoFaLoading] = useState(false);
	const [twoFaDisableLoading, setTwoFaDisableLoading] = useState(false);

	/* Disconnect GitHub modal */
	const [showDisconnectModal, setShowDisconnectModal] = useState(false);
	const [disconnectNewPw, setDisconnectNewPw] = useState("");
	const [disconnectConfirmPw, setDisconnectConfirmPw] = useState("");
	const [disconnectError, setDisconnectError] = useState<string | null>(null);
	const [disconnectLoading, setDisconnectLoading] = useState(false);

	/* Change Password (for users who already have a password) */
	const [changePwCurrent, setChangePwCurrent] = useState("");
	const [changePwNew, setChangePwNew] = useState("");
	const [changePwConfirm, setChangePwConfirm] = useState("");
	const [changePwError, setChangePwError] = useState<string | null>(null);
	const [changePwLoading, setChangePwLoading] = useState(false);
	const [changePwSuccess, setChangePwSuccess] = useState(false);

	/* Set Password (for OAuth users in Password section) */
	const [setPwNew, setSetPwNew] = useState("");
	const [setPwConfirm, setSetPwConfirm] = useState("");
	const [setPwError, setSetPwError] = useState<string | null>(null);
	const [setPwLoading, setSetPwLoading] = useState(false);
	const [setPwSuccess, setSetPwSuccess] = useState(false);

	const loadAuthMe = useCallback(async () => {
		try {
			const res = await getAuthMe();
			setAuthMe(res.data);
		} catch {
			// Silently fail
		}
	}, []);

	useEffect(() => {
		loadAuthMe();
	}, [loadAuthMe]);

	async function handleEnable2FA() {
		setTwoFaError(null);
		setTwoFaLoading(true);
		try {
			const res = await apiSetup2FA();
			setTwoFaQrCode(res.data.qrCodeDataURL);
			setTwoFaStep("qr");
			setTwoFaCode("");
		} catch (err: unknown) {
			const message = err instanceof ApiError ? err.message : "Failed to initialize 2FA setup";
			setTwoFaError(message);
		} finally {
			setTwoFaLoading(false);
		}
	}

	async function handleConfirm2FA() {
		setTwoFaError(null);
		if (!twoFaCode || twoFaCode.length !== 6) {
			setTwoFaError("Please enter a valid 6-digit code");
			return;
		}
		setTwoFaLoading(true);
		try {
			await apiConfirm2FA(twoFaCode);
			await loadAuthMe();
			setTwoFaStep("idle");
			setTwoFaQrCode(null);
			setTwoFaCode("");
		} catch (err: unknown) {
			const message = err instanceof ApiError ? err.message : "Invalid code. Please try again.";
			setTwoFaError(message);
		} finally {
			setTwoFaLoading(false);
		}
	}

	function handleCancel2FASetup() {
		setTwoFaStep("idle");
		setTwoFaQrCode(null);
		setTwoFaCode("");
		setTwoFaError(null);
	}

	async function handleDisable2FA() {
		setTwoFaError(null);
		setTwoFaDisableLoading(true);
		try {
			await apiDisable2FA();
			await loadAuthMe();
		} catch (err: unknown) {
			const message = err instanceof ApiError ? err.message : "Failed to disable 2FA";
			setTwoFaError(message);
		} finally {
			setTwoFaDisableLoading(false);
		}
	}

	async function handleDisconnectGithub() {
		if (!hasPassword) {
			// Need to set password first — show modal
			setShowDisconnectModal(true);
			setDisconnectNewPw("");
			setDisconnectConfirmPw("");
			setDisconnectError(null);
			return;
		}
		// Already has password — disconnect directly
		try {
			setDisconnectLoading(true);
			await apiDisconnectGithub();
			await loadAuthMe();
		} catch (err: unknown) {
			const message = err instanceof ApiError ? err.message : "Failed to disconnect GitHub";
			setDisconnectError(message);
			setTimeout(() => setDisconnectError(null), 4000);
		} finally {
			setDisconnectLoading(false);
		}
	}

	async function handleSetPasswordAndDisconnect() {
		setDisconnectError(null);
		if (disconnectNewPw.length < 6) {
			setDisconnectError("Password must be at least 6 characters");
			return;
		}
		if (disconnectNewPw !== disconnectConfirmPw) {
			setDisconnectError("Passwords do not match");
			return;
		}
		try {
			setDisconnectLoading(true);
			await apiSetPassword(disconnectNewPw);
			await apiDisconnectGithub();
			await loadAuthMe();
			setShowDisconnectModal(false);
		} catch (err: unknown) {
			const message = err instanceof ApiError ? err.message : "Failed to set password";
			setDisconnectError(message);
		} finally {
			setDisconnectLoading(false);
		}
	}

	async function handleChangePassword() {
		setChangePwError(null);
		if (!changePwCurrent) {
			setChangePwError("Current password is required");
			return;
		}
		if (changePwNew.length < 6) {
			setChangePwError("New password must be at least 6 characters");
			return;
		}
		if (changePwNew !== changePwConfirm) {
			setChangePwError("New passwords do not match");
			return;
		}
		if (changePwCurrent === changePwNew) {
			setChangePwError("New password must be different from current password");
			return;
		}
		try {
			setChangePwLoading(true);
			await apiChangePassword(changePwCurrent, changePwNew);
			setChangePwCurrent("");
			setChangePwNew("");
			setChangePwConfirm("");
			setChangePwSuccess(true);
			// Show success message briefly, then log out
			setTimeout(async () => {
				try {
					const token = getAccessToken();
					await fetch("/api/v1/auth/logout", {
						method: "POST",
						credentials: "include",
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					});
				} finally {
					clearAuth();
					window.location.href = "/login";
				}
			}, 2000);
			return;
		} catch (err: unknown) {
			if (err instanceof ApiError) {
				const friendlyMessages: Record<string, string> = {
					WRONG_PASSWORD: "The current password you entered is incorrect. Please try again.",
					WEAK_PASSWORD: "Password is too weak. Try using a mix of letters, numbers, and symbols.",
					INVALID_CREDENTIALS: "The current password you entered is incorrect. Please try again.",
					OAUTH_USER: "Your account uses GitHub login. Please set a password first.",
				};
				setChangePwError(friendlyMessages[err.code ?? ""] ?? err.message);
			} else {
				setChangePwError("Failed to change password. Please try again.");
			}
		} finally {
			setChangePwLoading(false);
		}
	}

	async function handleSetPassword() {
		setSetPwError(null);
		if (setPwNew.length < 6) {
			setSetPwError("Password must be at least 6 characters");
			return;
		}
		if (setPwNew !== setPwConfirm) {
			setSetPwError("Passwords do not match");
			return;
		}
		try {
			setSetPwLoading(true);
			await apiSetPassword(setPwNew);
			await loadAuthMe();
			setSetPwNew("");
			setSetPwConfirm("");
			setSetPwSuccess(true);
			setTimeout(() => setSetPwSuccess(false), 3000);
		} catch (err: unknown) {
			const message = err instanceof ApiError ? err.message : "Failed to set password";
			setSetPwError(message);
		} finally {
			setSetPwLoading(false);
		}
	}

	/* Notifications */
	const [notifyGameInvites, setNotifyGameInvites] = useState(true);
	const [notifyFriendRequests, setNotifyFriendRequests] = useState(true);
	const [notifyMatchResults, setNotifyMatchResults] = useState(true);
	const [notifySystemUpdates, setNotifySystemUpdates] = useState(false);
	const [notifySounds, setNotifySounds] = useState(true);

	const loadPreferences = useCallback(async () => {
		try {
			const res = await getNotificationPreferences();
			setNotifyGameInvites(res.data.gameInvites);
			setNotifyFriendRequests(res.data.friendRequests);
			setNotifyMatchResults(res.data.matchResults);
			setNotifySystemUpdates(res.data.systemUpdates);
			setNotifySounds(res.data.sounds);
			// Sync sound preference to localStorage for the NotificationPanel
			setNotificationSoundPref(res.data.sounds);
		} catch {
			// Keep defaults on failure
		}
	}, []);

	useEffect(() => {
		loadPreferences();
	}, [loadPreferences]);

	/* Game */
	const [paddleColor, setPaddleColor] = useState("#00f0ff");
	const [ballTrail, setBallTrail] = useState(true);
	const [screenShake, setScreenShake] = useState(true);
	const [powerUps, setPowerUps] = useState(true);

	async function handleSave() {
		setIsSaving(true);
		setSaveError(null);

		try {
			await Promise.all([
				updateMyProfile({
					displayName: displayName || undefined,
					username: username || undefined,
					bio: bio || undefined,
				}),
				updateNotificationPreferences({
					gameInvites: notifyGameInvites,
					friendRequests: notifyFriendRequests,
					matchResults: notifyMatchResults,
					systemUpdates: notifySystemUpdates,
					sounds: notifySounds,
				}),
			]);
			// Sync sound preference to localStorage immediately
			setNotificationSoundPref(notifySounds);
			// Refresh profile data to stay in sync
			await loadProfile();
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to save settings";
			setSaveError(message);
			setTimeout(() => setSaveError(null), 4000);
		} finally {
			setIsSaving(false);
		}
	}

	const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
		{ id: "account", label: "Account", icon: UserIcon },
		{ id: "security", label: "Security", icon: ShieldIcon },
		{ id: "notifications", label: "Notifications", icon: BellIcon },
		{ id: "game", label: "Game", icon: GamepadIcon },
		{ id: "appearance", label: "Appearance", icon: PaletteIcon },
	];

	const paddleColors = [
		{ color: "#00f0ff", label: "Cyan" },
		{ color: "#8b5cf6", label: "Purple" },
		{ color: "#e040fb", label: "Pink" },
		{ color: "#34d399", label: "Green" },
		{ color: "#f59e0b", label: "Amber" },
		{ color: "#ef4444", label: "Red" },
		{ color: "#ffffff", label: "White" },
		{ color: "#3b82f6", label: "Blue" },
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

					<div className="relative z-10 flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-light">
							<SettingsGearIcon className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white sm:text-3xl">
								Settings
							</h1>
							<p className="mt-0.5 text-sm text-zinc-400">
								Manage your account and preferences
							</p>
						</div>
					</div>
				</div>

				{/* ── Content ── */}
				<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
					{/* Sidebar tabs */}
					<nav className="flex flex-row gap-1 overflow-x-auto rounded-2xl border border-white/5 bg-surface-light p-2 lg:flex-col lg:self-start">
						{tabs.map((tab) => (
							<TabButton
								key={tab.id}
								icon={tab.icon}
								label={tab.label}
								isActive={activeTab === tab.id}
								onClick={() => setActiveTab(tab.id)}
							/>
						))}
					</nav>

					{/* Tab content */}
					<div className="space-y-6">
						{/* ─── Account ─── */}
						{activeTab === "account" && (
							<>
								<SettingsSection
									title="Profile Information"
									description="Update your personal details"
								>
									<div className="space-y-4">
										{/* Avatar */}
										<input
											ref={avatarInputRef}
											type="file"
											accept="image/png,image/jpeg,image/gif,image/webp"
											className="hidden"
											onChange={handleAvatarChange}
										/>
										<div className="flex items-center gap-4">
											<div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-xl font-bold text-accent-light ring-2 ring-accent/30 overflow-hidden">
												{avatarPreview || profile?.avatarUrl ? (
													<img
														src={avatarPreview || profile!.avatarUrl!}
														alt=""
														className="h-full w-full object-cover"
													/>
												) : (
													(profile?.displayName || profile?.username || "?")
														.split(" ")
														.map((w) => w[0])
														.join("")
														.toUpperCase()
														.slice(0, 2)
												)}
											</div>
											<div>
												<button
													type="button"
													onClick={() => avatarInputRef.current?.click()}
													disabled={avatarUploading}
													className="rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent-light transition-colors hover:bg-accent/20 disabled:opacity-50"
												>
													{avatarUploading ? "Uploading..." : "Change avatar"}
												</button>
												{avatarError && (
													<p className="mt-1 text-xs text-red-400">{avatarError}</p>
												)}
												<p className="mt-1 text-xs text-zinc-500">
													JPG, PNG, GIF or WEBP. Max 2MB.
												</p>
											</div>
										</div>

										{/* Display Name */}
										<div>
											<label htmlFor="s-displayName" className="mb-1.5 block text-sm font-medium text-zinc-300">
												Display Name
											</label>
											<input
												id="s-displayName"
												type="text"
												value={displayName}
												onChange={(e) => setDisplayName(e.target.value)}
												maxLength={50}
												placeholder="How others see you"
												className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
											/>
											<p className="mt-1 text-right text-xs text-zinc-600">{displayName.length}/50</p>
										</div>

										{/* Username */}
										<div>
											<label htmlFor="s-username" className="mb-1.5 block text-sm font-medium text-zinc-300">
												Username
											</label>
											<input
												id="s-username"
												type="text"
												value={username}
												onChange={(e) => setUsername(e.target.value)}
												placeholder="Your unique identifier"
												className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
											/>
										</div>

										{/* Bio */}
										<div>
											<label htmlFor="s-bio" className="mb-1.5 block text-sm font-medium text-zinc-300">
												Bio
											</label>
											<textarea
												id="s-bio"
												value={bio}
												onChange={(e) => setBio(e.target.value)}
												rows={3}
												maxLength={160}
												placeholder="Tell others a bit about yourself"
												className="w-full resize-none rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
											/>
											<p className="mt-1 text-right text-xs text-zinc-600">{bio.length}/160</p>
										</div>
									</div>
								</SettingsSection>
							</>
						)}

						{/* ─── Security ─── */}
						{activeTab === "security" && (
							<>
								<SettingsSection
									title="Password"
									description={hasPassword ? "Change your password to keep your account secure" : "Set a password to enable email & password login"}
								>
									{hasPassword ? (
										<div key="change-password" className="space-y-4">
											<div>
												<label htmlFor="s-current-pw" className="mb-1.5 block text-sm font-medium text-zinc-300">
													Current Password
												</label>
												<input
													id="s-current-pw"
													type="password"
													value={changePwCurrent}
													onChange={(e) => setChangePwCurrent(e.target.value)}
													placeholder="Enter current password"
													className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
												/>
											</div>
											<div>
												<label htmlFor="s-new-pw" className="mb-1.5 block text-sm font-medium text-zinc-300">
													New Password
												</label>
												<input
													id="s-new-pw"
													type="password"
													value={changePwNew}
													onChange={(e) => setChangePwNew(e.target.value)}
													placeholder="Enter new password"
													className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
												/>
											</div>
											<div>
												<label htmlFor="s-confirm-pw" className="mb-1.5 block text-sm font-medium text-zinc-300">
													Confirm New Password
												</label>
												<input
													id="s-confirm-pw"
													type="password"
													value={changePwConfirm}
													onChange={(e) => setChangePwConfirm(e.target.value)}
													placeholder="Confirm new password"
													className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
												/>
											</div>
											{changePwError && (
												<p className="text-sm text-red-400">{changePwError}</p>
											)}
											{changePwSuccess && (
												<p className="text-sm text-emerald-400">Password changed successfully! Redirecting to login...</p>
											)}
											<button
												onClick={handleChangePassword}
												disabled={changePwLoading}
												className="rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent-light transition-colors hover:bg-accent/20 disabled:opacity-50"
											>
												{changePwLoading ? "Updating..." : "Update Password"}
											</button>
										</div>
									) : (
										<div key="set-password" className="space-y-4">
											<div className="rounded-xl border border-accent/15 bg-accent/5 p-3">
												<p className="text-xs text-zinc-400">
													Your account was created via GitHub. Set a password to also log in with email and password.
												</p>
											</div>
											<div>
												<label htmlFor="s-set-pw" className="mb-1.5 block text-sm font-medium text-zinc-300">
													New Password
												</label>
												<input
													id="s-set-pw"
													type="password"
													value={setPwNew}
													onChange={(e) => setSetPwNew(e.target.value)}
													placeholder="Enter a password"
													className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
												/>
											</div>
											<div>
												<label htmlFor="s-set-pw-confirm" className="mb-1.5 block text-sm font-medium text-zinc-300">
													Confirm Password
												</label>
												<input
													id="s-set-pw-confirm"
													type="password"
													value={setPwConfirm}
													onChange={(e) => setSetPwConfirm(e.target.value)}
													placeholder="Confirm your password"
													className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
												/>
											</div>
											{setPwError && (
												<p className="text-sm text-red-400">{setPwError}</p>
											)}
											{setPwSuccess && (
												<p className="text-sm text-emerald-400">Password set successfully!</p>
											)}
											<button
												onClick={handleSetPassword}
												disabled={setPwLoading}
												className="rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent-light transition-colors hover:bg-accent/20 disabled:opacity-50"
											>
												{setPwLoading ? "Setting..." : "Set Password"}
											</button>
										</div>
									)}
								</SettingsSection>

								<SettingsSection
									title="Two-Factor Authentication"
									description="Add an extra layer of security to your account"
								>
									{twoFactorEnabled ? (
										<>
											<div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
												<div className="flex items-start gap-3">
													<KeyIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
													<div>
														<p className="text-sm font-medium text-emerald-400">
															2FA is enabled
														</p>
														<p className="mt-0.5 text-xs text-zinc-400">
															Your account is protected with two-factor authentication. You&apos;ll need your authenticator app to sign in.
														</p>
													</div>
												</div>
											</div>
											{twoFaError && (
												<p className="mt-3 text-sm text-red-400">{twoFaError}</p>
											)}
											<button
												onClick={handleDisable2FA}
												disabled={twoFaDisableLoading}
												className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
											>
												{twoFaDisableLoading ? "Disabling..." : "Disable 2FA"}
											</button>
										</>
									) : twoFaStep === "idle" ? (
										<>
											<div className="rounded-xl border border-white/5 bg-surface-lighter/50 p-4">
												<div className="flex items-start gap-3">
													<KeyIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-400" />
													<div>
														<p className="text-sm font-medium text-zinc-300">
															2FA is not enabled
														</p>
														<p className="mt-0.5 text-xs text-zinc-500">
															Add an extra layer of security by enabling two-factor authentication with an authenticator app.
														</p>
													</div>
												</div>
											</div>
											{twoFaError && (
												<p className="mt-3 text-sm text-red-400">{twoFaError}</p>
											)}
											<button
												onClick={handleEnable2FA}
												disabled={twoFaLoading}
												className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
											>
												{twoFaLoading ? "Setting up..." : "Enable 2FA"}
											</button>
										</>
									) : (
										<div className="space-y-5">
											{/* Step 1: QR Code */}
											<div className="rounded-xl border border-accent/15 bg-accent/5 p-4">
												<p className="text-sm font-medium text-zinc-200">
													Scan this QR code with your authenticator app
												</p>
												<p className="mt-1 text-xs text-zinc-500">
													Use Google Authenticator, Authy, or any TOTP-compatible app.
												</p>
											</div>

											{twoFaQrCode && (
												<div className="flex justify-center">
													<div className="rounded-xl border border-white/10 bg-white p-3">
														<img
															src={twoFaQrCode}
															alt="2FA QR Code"
															className="h-48 w-48"
														/>
													</div>
												</div>
											)}

											{/* Step 2: Confirm code */}
											<div>
												<label htmlFor="s-2fa-code" className="mb-1.5 block text-sm font-medium text-zinc-300">
													Enter the 6-digit code from your app
												</label>
												<input
													id="s-2fa-code"
													type="text"
													inputMode="numeric"
													maxLength={6}
													value={twoFaCode}
													onChange={(e) => {
														const val = e.target.value.replace(/\D/g, "").slice(0, 6);
														setTwoFaCode(val);
													}}
													placeholder="000000"
													className="w-full max-w-xs rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-center text-lg font-mono tracking-[0.3em] text-white placeholder-zinc-600 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
												/>
											</div>

											{twoFaError && (
												<p className="text-sm text-red-400">{twoFaError}</p>
											)}

											<div className="flex gap-3">
												<button
													onClick={handleConfirm2FA}
													disabled={twoFaLoading || twoFaCode.length !== 6}
													className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
												>
													{twoFaLoading ? "Verifying..." : "Verify & Enable"}
												</button>
												<button
													onClick={handleCancel2FASetup}
													className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
												>
													Cancel
												</button>
											</div>
										</div>
									)}
								</SettingsSection>

								<SettingsSection
									title="Linked Accounts"
									description="Connect external accounts for easier sign-in"
								>
									<div className="flex items-center justify-between rounded-xl border border-white/5 bg-surface-lighter/50 px-4 py-3">
										<div className="flex items-center gap-3">
											<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
												<GithubIcon className="h-5 w-5 text-zinc-300" />
											</div>
											<div>
												<p className="text-sm font-medium text-zinc-200">GitHub</p>
												<p className="text-xs text-zinc-500">
													{githubLinked ? "Connected" : "Not connected"}
												</p>
											</div>
										</div>
										{githubLinked ? (
											<button
												onClick={handleDisconnectGithub}
												disabled={disconnectLoading}
												className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
											>
												{disconnectLoading ? "Disconnecting..." : "Disconnect"}
											</button>
										) : (
											<a
												href={`${process.env.NEXT_PUBLIC_OAUTH_URL || ""}/api/v1/auth/oauth/github`}
												className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-accent/10 text-accent-light hover:bg-accent/20"
											>
												Connect
											</a>
										)}
									</div>
									{disconnectError && !showDisconnectModal && (
										<p className="mt-2 text-sm text-red-400">{disconnectError}</p>
									)}
								</SettingsSection>

								{/* Set Password & Disconnect Modal */}
								{showDisconnectModal && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
										<div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-surface-light p-6 shadow-2xl">
											<h3 className="text-lg font-semibold text-white">Set a Password</h3>
											<p className="mt-1 text-sm text-zinc-400">
												To disconnect GitHub, you need to set a password first so you can still log in.
											</p>
											<div className="mt-5 space-y-4">
												<div>
													<label htmlFor="dm-new-pw" className="mb-1.5 block text-sm font-medium text-zinc-300">
														New Password
													</label>
													<input
														id="dm-new-pw"
														type="password"
														value={disconnectNewPw}
														onChange={(e) => setDisconnectNewPw(e.target.value)}
														placeholder="Enter a password"
														className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
													/>
												</div>
												<div>
													<label htmlFor="dm-confirm-pw" className="mb-1.5 block text-sm font-medium text-zinc-300">
														Confirm Password
													</label>
													<input
														id="dm-confirm-pw"
														type="password"
														value={disconnectConfirmPw}
														onChange={(e) => setDisconnectConfirmPw(e.target.value)}
														placeholder="Confirm your password"
														className="w-full rounded-xl border border-white/5 bg-surface-lighter py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/30 focus:ring-1 focus:ring-accent/20"
													/>
												</div>
												{disconnectError && (
													<p className="text-sm text-red-400">{disconnectError}</p>
												)}
											</div>
											<div className="mt-6 flex justify-end gap-3">
												<button
													onClick={() => setShowDisconnectModal(false)}
													className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
												>
													Cancel
												</button>
												<button
													onClick={handleSetPasswordAndDisconnect}
													disabled={disconnectLoading}
													className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
												>
													{disconnectLoading ? "Processing..." : "Set Password & Disconnect"}
												</button>
											</div>
										</div>
									</div>
								)}

								<SettingsSection title="Danger Zone">
									<div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
										<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
											<div className="flex items-start gap-3">
												<TrashIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
												<div>
													<p className="text-sm font-medium text-red-400">
														Delete Account
													</p>
													<p className="mt-0.5 text-xs text-zinc-400">
														Permanently delete your account and all associated data. This action cannot be undone.
													</p>
												</div>
											</div>
											<button className="flex-shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20">
												Delete Account
											</button>
										</div>
									</div>
								</SettingsSection>
							</>
						)}

						{/* ─── Notifications ─── */}
						{activeTab === "notifications" && (
							<>
								<SettingsSection
									title="Notification Preferences"
									description="Choose what you want to be notified about"
								>
									<div>
										<SettingRow
											label="Game Invites"
											description="Get notified when someone invites you to a match"
										>
											<Toggle
												enabled={notifyGameInvites}
												onChange={setNotifyGameInvites}
												color="cyan"
											/>
										</SettingRow>
										<SettingRow
											label="Friend Requests"
											description="Get notified when someone sends you a friend request"
										>
											<Toggle
												enabled={notifyFriendRequests}
												onChange={setNotifyFriendRequests}
												color="cyan"
											/>
										</SettingRow>
										<SettingRow
											label="Match Results"
											description="Receive a summary after each completed match"
										>
											<Toggle
												enabled={notifyMatchResults}
												onChange={setNotifyMatchResults}
												color="cyan"
											/>
										</SettingRow>
										<SettingRow
											label="System Updates"
											description="News about features, maintenance and updates"
										>
											<Toggle
												enabled={notifySystemUpdates}
												onChange={setNotifySystemUpdates}
												color="cyan"
											/>
										</SettingRow>
									</div>
								</SettingsSection>

								<SettingsSection
									title="Sound"
									description="Control in-app notification sounds"
								>
									<SettingRow
										label="Notification Sounds"
										description="Play a sound when you receive a notification"
									>
										<Toggle
											enabled={notifySounds}
											onChange={setNotifySounds}
											color="accent"
										/>
									</SettingRow>
								</SettingsSection>
							</>
						)}

						{/* ─── Game ─── */}
						{activeTab === "game" && (
							<>
								<SettingsSection
									title="Paddle Customization"
									description="Choose your paddle color"
								>
									<div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
										{paddleColors.map((pc) => (
											<ColorOption
												key={pc.color}
												color={pc.color}
												label={pc.label}
												isSelected={paddleColor === pc.color}
												onSelect={() => setPaddleColor(pc.color)}
											/>
										))}
									</div>

									{/* Preview */}
									<div className="mt-5 flex items-center justify-center rounded-xl border border-white/5 bg-surface-lighter/50 p-6">
										<div className="relative h-24 w-full max-w-xs">
											{/* Field */}
											<div className="absolute inset-0 rounded-lg border border-white/5 bg-surface/80">
												<div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-white/10" />
											</div>
											{/* Left paddle */}
											<div
												className="absolute left-3 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-full"
												style={{
													backgroundColor: paddleColor,
													boxShadow: `0 0 12px ${paddleColor}80, 0 0 24px ${paddleColor}40`,
												}}
											/>
											{/* Right paddle */}
											<div className="absolute right-3 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-full bg-[rgba(255,255,255,0.4)]" />
											{/* Ball */}
											<div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff] shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
										</div>
									</div>
								</SettingsSection>

								<SettingsSection
									title="Visual Effects"
									description="Configure in-game visual effects"
								>
									<div>
										<SettingRow
											label="Ball Trail"
											description="Show a trailing glow effect behind the ball"
										>
											<Toggle
												enabled={ballTrail}
												onChange={setBallTrail}
												color="cyan"
											/>
										</SettingRow>
										<SettingRow
											label="Screen Shake"
											description="Shake the screen on powerful hits"
										>
											<Toggle
												enabled={screenShake}
												onChange={setScreenShake}
												color="cyan"
											/>
										</SettingRow>
										<SettingRow
											label="Power-Ups"
											description="Enable power-up items during matches"
										>
											<Toggle
												enabled={powerUps}
												onChange={setPowerUps}
												color="cyan"
											/>
										</SettingRow>
									</div>
								</SettingsSection>
							</>
						)}

						{/* ─── Appearance ─── */}
						{activeTab === "appearance" && (
							<>
								<SettingsSection
									title="Theme"
									description="Choose between dark and light mode"
								>
									<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
										{/* Dark */}
										<button
											onClick={() => setTheme("dark")}
											className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${theme === "dark"
												? "border-accent/30 bg-accent/5 shadow-[0_0_15px_rgba(139,92,246,0.1)] ring-1 ring-accent/30"
												: "border-white/5 bg-surface-lighter/50 hover:border-white/10"
												}`}
										>
											{theme === "dark" && (
												<div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
													<CheckIcon className="h-3 w-3 text-[#fff]" />
												</div>
											)}

											{/* Mini preview */}
											<div className="mb-3 overflow-hidden rounded-lg border border-white/5">
												<div className="flex h-20 flex-col bg-[#08080c]">
													<div className="h-3 border-b border-[#1a1a24]/60 bg-[#111118]" />
													<div className="flex flex-1">
														<div className="w-8 border-r border-[#1a1a24]/60 bg-[#111118]" />
														<div className="flex-1 p-2">
															<div className="mb-1 h-1.5 w-10 rounded-full bg-[#a78bfa]/30" />
															<div className="h-1 w-14 rounded-full bg-[#e4e4e7]/10" />
															<div className="mt-1.5 h-1 w-12 rounded-full bg-[#e4e4e7]/10" />
														</div>
													</div>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<MoonIcon className={`h-4 w-4 ${theme === "dark" ? "text-accent-light" : "text-zinc-400"}`} />
												<span className={`text-sm font-medium ${theme === "dark" ? "text-accent-light" : "text-zinc-300"}`}>
													Dark
												</span>
											</div>
											<p className="mt-0.5 text-xs text-zinc-500">
												Easy on the eyes with neon accents
											</p>
										</button>

										{/* Light */}
										<button
											onClick={() => setTheme("light")}
											className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${theme === "light"
												? "border-accent/30 bg-accent/5 shadow-[0_0_15px_rgba(139,92,246,0.1)] ring-1 ring-accent/30"
												: "border-white/5 bg-surface-lighter/50 hover:border-white/10"
												}`}
										>
											{theme === "light" && (
												<div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
													<CheckIcon className="h-3 w-3 text-[#fff]" />
												</div>
											)}

											{/* Mini preview */}
											<div className="mb-3 overflow-hidden rounded-lg border border-[#d1d5db]">
												<div className="flex h-20 flex-col bg-[#f4f4f7]">
													<div className="h-3 border-b border-[#e5e7eb] bg-[#ffffff]" />
													<div className="flex flex-1">
														<div className="w-8 border-r border-[#e5e7eb] bg-[#ffffff]" />
														<div className="flex-1 p-2">
															<div className="mb-1 h-1.5 w-10 rounded-full bg-[#8b5cf6]/30" />
															<div className="h-1 w-14 rounded-full bg-[#1a1a2e]/10" />
															<div className="mt-1.5 h-1 w-12 rounded-full bg-[#1a1a2e]/10" />
														</div>
													</div>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<SunIcon className={`h-4 w-4 ${theme === "light" ? "text-accent-light" : "text-zinc-400"}`} />
												<span className={`text-sm font-medium ${theme === "light" ? "text-accent-light" : "text-zinc-300"}`}>
													Light
												</span>
											</div>
											<p className="mt-0.5 text-xs text-zinc-500">
												Clean and bright for daytime use
											</p>
										</button>
									</div>
								</SettingsSection>
							</>
						)}

						{/* ── Save Button ── */}
						<div className="flex items-center justify-end gap-3">
							{saveError && (
								<span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400">
									{saveError}
								</span>
							)}
							{saved && (
								<span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
									<CheckIcon className="h-4 w-4" />
									Settings saved
								</span>
							)}
							<button
								onClick={handleSave}
								disabled={isSaving}
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isSaving ? (
									<>
										<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
										</svg>
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
