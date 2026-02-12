/**
 * Synthesizes a short two-tone notification chime using the Web Audio API.
 * No audio files required — works purely in-browser.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
	if (!audioCtx) {
		audioCtx = new AudioContext();
	}
	return audioCtx;
}

/**
 * Play a brief, pleasant notification chime.
 * Two ascending tones (C6 → E6) with a soft sine wave.
 */
export function playNotificationSound(): void {
	try {
		const ctx = getAudioContext();

		// Resume context if it was suspended (browser autoplay policy)
		if (ctx.state === "suspended") {
			ctx.resume();
		}

		const now = ctx.currentTime;

		// Master gain for overall volume
		const master = ctx.createGain();
		master.gain.setValueAtTime(0.15, now);
		master.connect(ctx.destination);

		// Tone 1: C6 (1047 Hz)
		playTone(ctx, master, 1047, now, 0.12);

		// Tone 2: E6 (1319 Hz) — starts slightly after
		playTone(ctx, master, 1319, now + 0.1, 0.14);
	} catch {
		// Silently fail — sound is non-critical
	}
}

function playTone(
	ctx: AudioContext,
	destination: AudioNode,
	frequency: number,
	startTime: number,
	duration: number,
): void {
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = "sine";
	osc.frequency.setValueAtTime(frequency, startTime);

	// Smooth fade-in and fade-out to avoid clicks
	gain.gain.setValueAtTime(0, startTime);
	gain.gain.linearRampToValueAtTime(1, startTime + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

	osc.connect(gain);
	gain.connect(destination);

	osc.start(startTime);
	osc.stop(startTime + duration);
}
