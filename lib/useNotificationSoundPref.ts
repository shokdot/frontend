"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "notification_sound_enabled";

/** Default when nothing has been stored yet. */
const DEFAULT = true;

function subscribe(callback: () => void): () => void {
	// Listen for changes from other tabs / from settings page writes
	function handleStorage(e: StorageEvent) {
		if (e.key === STORAGE_KEY) callback();
	}
	// Custom event for same-tab writes (StorageEvent only fires cross-tab)
	function handleCustom() {
		callback();
	}

	window.addEventListener("storage", handleStorage);
	window.addEventListener("notification-sound-changed", handleCustom);
	return () => {
		window.removeEventListener("storage", handleStorage);
		window.removeEventListener("notification-sound-changed", handleCustom);
	};
}

function getSnapshot(): boolean {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (raw === null) return DEFAULT;
	return raw === "true";
}

function getServerSnapshot(): boolean {
	return DEFAULT;
}

/**
 * Read the notification-sound preference from localStorage.
 * Reacts to changes from the settings page (same tab via custom event,
 * cross-tab via StorageEvent). Zero API calls.
 */
export function useNotificationSoundPref(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Write the notification-sound preference to localStorage
 * and notify same-tab subscribers.
 */
export function setNotificationSoundPref(enabled: boolean): void {
	localStorage.setItem(STORAGE_KEY, String(enabled));
	window.dispatchEvent(new Event("notification-sound-changed"));
}
