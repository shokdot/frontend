import { getAccessToken, refreshAccessToken, clearAuth, RateLimitedError } from "./auth";

interface ApiOptions extends Omit<RequestInit, "headers"> {
	headers?: Record<string, string>;
}

/**
 * Authenticated fetch wrapper.
 * Automatically attaches Bearer token, retries once on 401 via token refresh.
 */
export async function apiFetch<T = unknown>(
	url: string,
	options: ApiOptions = {},
): Promise<T> {
	const doFetch = async (token: string | null) => {
		const headers: Record<string, string> = {
			...options.headers,
		};
		if (options.body) {
			headers["Content-Type"] ??= "application/json";
		}
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		return fetch(url, {
			...options,
			headers,
			credentials: "include",
		});
	};

	let token = getAccessToken();
	let res = await doFetch(token);

	// On 401, try refreshing the token once
	if (res.status === 401) {
		try {
			token = await refreshAccessToken();
		} catch (err) {
			if (err instanceof RateLimitedError) {
				// Rate-limited but session may still be valid — surface as API error, don't redirect.
				throw new ApiError("Too many requests. Please wait a moment.", 429, "TOO_MANY_REQUESTS");
			}
			throw err;
		}

		if (token) {
			res = await doFetch(token);
		} else {
			// Refresh failed — session is dead. Redirect once.
			forceLogoutRedirect();
			throw new Error("Session expired");
		}
	}

	// If the retry *also* returned 401, the token is truly invalid
	if (res.status === 401) {
		forceLogoutRedirect();
		throw new Error("Session expired");
	}

	const json = await res.json();

	if (!res.ok) {
		const message =
			json?.error?.message || json?.message || "Something went wrong";
		throw new ApiError(message, res.status, json?.error?.code);
	}

	return json as T;
}

/** Redirect to /login exactly once per page load. */
let isRedirecting = false;
function forceLogoutRedirect() {
	if (isRedirecting) return;
	isRedirecting = true;
	clearAuth();
	window.location.href = "/login";
}

export class ApiError extends Error {
	status: number;
	code?: string;

	constructor(message: string, status: number, code?: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
	}
}

/* ───────────── Profile API ───────────── */

export interface ApiUserProfile {
	userId: string;
	username: string;
	displayName: string | null;
	bio: string | null;
	avatarUrl: string | null;
	theme: "dark" | "light";
	createdAt: string;
	updatedAt: string;
}

interface GetProfileResponse {
	status: string;
	data: ApiUserProfile;
	message: string;
}

export function getMyProfile() {
	return apiFetch<GetProfileResponse>("/api/v1/users/me");
}

export function getUserById(userId: string) {
	return apiFetch<GetProfileResponse>(
		`/api/v1/users/${encodeURIComponent(userId)}`,
	);
}

export function getUserByUsername(username: string) {
	return apiFetch<GetProfileResponse>(
		`/api/v1/users/username/${encodeURIComponent(username)}`,
	);
}

export interface UpdateProfileData {
	username?: string;
	displayName?: string;
	bio?: string;
	theme?: "dark" | "light";
}

export function updateMyProfile(data: UpdateProfileData) {
	return apiFetch<GetProfileResponse>("/api/v1/users/me", {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/* ───────────── Avatar API ───────────── */

export function updateAvatar(avatarUrl: string) {
	return apiFetch<{ status: string; message: string }>(
		"/api/v1/users/me/avatar",
		{
			method: "PATCH",
			body: JSON.stringify({ avatarUrl }),
		},
	);
}

export function deleteAvatar() {
	return apiFetch<{ status: string; message: string }>(
		"/api/v1/users/me/avatar",
		{ method: "DELETE" },
	);
}

/**
 * Convert a File to a base64 data URL string.
 * Validates type (png, jpeg, gif, webp) and size (max 2MB).
 */
export function fileToBase64(file: File): Promise<string> {
	const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];
	const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

	if (!ALLOWED_TYPES.includes(file.type)) {
		return Promise.reject(new Error("Only PNG, JPG, GIF, and WEBP files are allowed"));
	}
	if (file.size > MAX_SIZE) {
		return Promise.reject(new Error("Image must be smaller than 2MB"));
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});
}

/* ───────────── Stats API ───────────── */

export interface ApiPlayerStats {
	userId: string;
	wins: number;
	losses: number;
	draws: number;
	elo: number;
	xp: number;
	level: number;
	updatedAt: string;
}

interface GetPlayerStatsResponse {
	status: string;
	data: ApiPlayerStats;
}

export function getPlayerStats(userId: string) {
	return apiFetch<GetPlayerStatsResponse>(
		`/api/v1/stats/${encodeURIComponent(userId)}`,
	);
}

export interface ApiPlayerRank {
	userId: string;
	elo: number;
	rank: number;
}

interface GetPlayerRankResponse {
	status: string;
	data: ApiPlayerRank;
}

export function getPlayerRank(userId: string) {
	return apiFetch<GetPlayerRankResponse>(
		`/api/v1/stats/leaderboard/rank/${encodeURIComponent(userId)}`,
	);
}

export interface ApiLeaderboardEntry {
	userId: string;
	wins: number;
	losses: number;
	draws: number;
	elo: number;
	xp: number;
	level: number;
	rank: number;
}

interface GetLeaderboardResponse {
	status: string;
	data: ApiLeaderboardEntry[];
	count: number;
}

export function getLeaderboard(limit = 100, offset = 0) {
	return apiFetch<GetLeaderboardResponse>(
		`/api/v1/stats/leaderboard?limit=${limit}&offset=${offset}`,
	);
}

export interface ApiMatch {
	id: string;
	playerAId: string;
	playerBId: string;
	scoreA: number;
	scoreB: number;
	winnerId: string | null;
	duration: number;
	playedAt: string;
}

interface GetMatchHistoryResponse {
	status: string;
	data: ApiMatch[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export function getMatchHistory(
	userId: string,
	page = 1,
	limit = 20,
) {
	return apiFetch<GetMatchHistoryResponse>(
		`/api/v1/stats/${encodeURIComponent(userId)}/history?page=${page}&limit=${limit}`,
	);
}

/* ───────────── Friends API ───────────── */

export interface ApiFriend {
	userId: string;
	username: string;
	avatarUrl: string | null;
	onlineStatus: string;
	status: "pending" | "accepted";
	direction?: "incoming" | "outgoing";
	createdAt: string;
}

interface ListFriendsResponse {
	status: string;
	data: { friends: ApiFriend[]; count: number };
	message: string;
}

export function listFriends(statusFilter?: "pending" | "accepted") {
	const query = statusFilter ? `?status=${statusFilter}` : "";
	return apiFetch<ListFriendsResponse>(`/api/v1/users/me/friends${query}`);
}

export function sendFriendRequest(username: string) {
	return apiFetch<{ status: string; message: string }>(
		`/api/v1/users/me/friends/${encodeURIComponent(username)}`,
		{ method: "POST" },
	);
}

export function acceptFriendRequest(username: string) {
	return apiFetch<{ status: string; message: string }>(
		`/api/v1/users/me/friends/${encodeURIComponent(username)}`,
		{ method: "PATCH" },
	);
}

export function removeFriend(username: string) {
	return apiFetch<{ status: string; message: string }>(
		`/api/v1/users/me/friends/${encodeURIComponent(username)}`,
		{ method: "DELETE" },
	);
}

/* ───────────── Search API ───────────── */

export interface ApiSearchResult {
	userId: string;
	username: string;
	avatarUrl: string | null;
	status: string;
}

interface SearchUsersResponse {
	status: string;
	data: {
		query: string;
		count: number;
		results: ApiSearchResult[];
	};
	message: string;
}

export function searchUsers(username: string) {
	return apiFetch<SearchUsersResponse>(
		`/api/v1/users/search?username=${encodeURIComponent(username)}`,
	);
}

/* ───────────── Blocked API ───────────── */

export interface ApiBlockedUser {
	userId: string;
	username: string;
	avatarUrl: string | null;
}

interface ListBlockedResponse {
	status: string;
	data: { blocked: ApiBlockedUser[]; count: number };
	message: string;
}

export function listBlocked() {
	return apiFetch<ListBlockedResponse>("/api/v1/users/blocks");
}

export function blockUser(targetUsername: string) {
	return apiFetch<{ status: string; message: string }>("/api/v1/users/block", {
		method: "POST",
		body: JSON.stringify({ targetUsername }),
	});
}

export function unblockUser(targetUsername: string) {
	return apiFetch<{ status: string; message: string }>(
		"/api/v1/users/unblock",
		{
			method: "POST",
			body: JSON.stringify({ targetUsername }),
		},
	);
}

/* ───────────── Notifications API ───────────── */

export interface ApiNotification {
	id: string;
	type: string;
	message: string;
	isRead: boolean;
	createdAt: string;
}

interface GetNotificationsResponse {
	status: string;
	message: string;
	data: {
		count: number;
		results: ApiNotification[];
	};
}

export function getNotifications() {
	return apiFetch<GetNotificationsResponse>("/api/v1/notifications");
}

export function markNotificationRead(id: string) {
	return apiFetch<{ status: string; message: string }>(
		`/api/v1/notifications/${encodeURIComponent(id)}/read`,
		{ method: "PATCH" },
	);
}

export function markAllNotificationsRead() {
	return apiFetch<{ status: string; message: string }>(
		"/api/v1/notifications/read-all",
		{ method: "PATCH" },
	);
}

export function deleteNotification(id: string) {
	return apiFetch<{ status: string; message: string }>(
		`/api/v1/notifications/${encodeURIComponent(id)}`,
		{ method: "DELETE" },
	);
}

/* ───────────── Notification Preferences API ───────────── */

export interface NotificationPreferences {
	gameInvites: boolean;
	friendRequests: boolean;
	matchResults: boolean;
	systemUpdates: boolean;
	sounds: boolean;
}

export function getNotificationPreferences() {
	return apiFetch<{ status: string; data: NotificationPreferences }>(
		"/api/v1/notifications/preferences",
	);
}

export function updateNotificationPreferences(prefs: Partial<NotificationPreferences>) {
	return apiFetch<{ status: string; message: string }>(
		"/api/v1/notifications/preferences",
		{ method: "PUT", body: JSON.stringify(prefs) },
	);
}

/* ───────────── Chat API ───────────── */

export interface ApiConversation {
	partnerId: string;
	lastMessage: string;
	lastMessageType: string;
	lastMessageAt: string;
	lastMessageFrom: string;
}

interface GetConversationsResponse {
	status: string;
	data: ApiConversation[];
}

export function getConversations() {
	return apiFetch<GetConversationsResponse>("/api/v1/chat/conversations");
}

export interface ApiChatMessage {
	type: string;
	from: string;
	to: string;
	content: string;
	sentAt: string;
}

interface GetConversationMessagesResponse {
	status: string;
	data: ApiChatMessage[];
}

export function getConversationMessages(userId: string, limit = 100) {
	return apiFetch<GetConversationMessagesResponse>(
		`/api/v1/chat/conversations/${encodeURIComponent(userId)}?limit=${limit}`,
	);
}

export function deleteConversation(userId: string) {
	return apiFetch<{ status: string; message: string }>(
		`/api/v1/chat/conversations/${encodeURIComponent(userId)}`,
		{ method: "DELETE" },
	);
}
