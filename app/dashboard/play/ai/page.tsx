"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { recordAIMatch, getMyProfile } from "@/lib/api";

/* ──────────────────────── Constants ──────────────────────── */

const CANVAS_W = 800;
const CANVAS_H = 600;

const PADDLE_W = 12;
const PADDLE_H = 100;
const PADDLE_OFFSET = 20;

const BALL_R = 8;

type Difficulty = "easy" | "medium" | "hard";

const SPEED_CONFIG: Record<Difficulty, { ballSpeed: number; speedInc: number; maxSpeed: number; paddleSpeed: number }> = {
	easy: { ballSpeed: 4, speedInc: 0.15, maxSpeed: 8, paddleSpeed: 6 },
	medium: { ballSpeed: 5.5, speedInc: 0.3, maxSpeed: 12, paddleSpeed: 7 },
	hard: { ballSpeed: 7.5, speedInc: 0.5, maxSpeed: 17, paddleSpeed: 9 },
};

/* ── AI Config: human-like behavior per difficulty ── */

interface AIConfig {
	paddleSpeed: number;       // How fast the AI paddle moves
	reactionMin: number;       // Min ms between target recalculations
	reactionMax: number;       // Max ms between target recalculations
	errorMin: number;          // Min px random offset on target
	errorMax: number;          // Max px random offset on target
	mistakeChance: number;     // Probability of a mistake per reaction cycle (0-1)
	mistakeDuration: number;   // How long a mistake lasts in ms
	trackThreshold: number;    // Ball X must be past this ratio (0-1) of canvas for AI to track
	idleDriftSpeed: number;    // How fast AI drifts toward center when idle
	deadZone: number;          // Px dead zone before AI moves
	useProjection: boolean;    // Whether AI uses simple linear projection (Hard only)
	projectionNoise: number;   // Noise added to projection in px
}

const AI_CONFIG: Record<Difficulty, AIConfig> = {
	easy: {
		paddleSpeed: 4.2,
		reactionMin: 350,
		reactionMax: 520,
		errorMin: 25,
		errorMax: 45,
		mistakeChance: 0.08,
		mistakeDuration: 300,
		trackThreshold: 0.48,
		idleDriftSpeed: 1.5,
		deadZone: 12,
		useProjection: false,
		projectionNoise: 0,
	},
	medium: {
		paddleSpeed: 6.2,
		reactionMin: 140,
		reactionMax: 280,
		errorMin: 10,
		errorMax: 22,
		mistakeChance: 0.03,
		mistakeDuration: 240,
		trackThreshold: 0.32,
		idleDriftSpeed: 2.5,
		deadZone: 6,
		useProjection: true,
		projectionNoise: 45,
	},
	hard: {
		paddleSpeed: 8.5,
		reactionMin: 50,
		reactionMax: 120,
		errorMin: 3,
		errorMax: 8,
		mistakeChance: 0.008,
		mistakeDuration: 150,
		trackThreshold: 0.15,
		idleDriftSpeed: 3.5,
		deadZone: 3,
		useProjection: true,
		projectionNoise: 15,
	},
};

const DIFFICULTY_LABELS: Record<Difficulty, { label: string; color: string; desc: string }> = {
	easy: { label: "Easy", color: "text-emerald-400", desc: "Casual pace, forgiving AI" },
	medium: { label: "Medium", color: "text-amber-400", desc: "Competitive challenge with prediction" },
	hard: { label: "Hard", color: "text-red-400", desc: "Expert AI, near-perfect tracking" },
};

const COLORS = {
	bg: "#08080c",
	p1: "#00f0ff",
	p1Glow: "rgba(0,240,255,0.6)",
	p2: "#a78bfa",
	p2Glow: "rgba(167,139,250,0.6)",
	ball: "#ffffff",
	ballGlow: "rgba(255,255,255,0.8)",
	line: "rgba(255,255,255,0.08)",
};

/* ──────────────────────── Types ──────────────────────── */

type Phase = "lobby" | "countdown" | "playing" | "paused" | "gameover";

interface GameState {
	ballX: number;
	ballY: number;
	ballVX: number;
	ballVY: number;
	ballSpeed: number;
	p1Y: number;
	p2Y: number;
	score1: number;
	score2: number;
}

interface AIState {
	targetY: number;          // Current target Y for paddle center
	nextReactionAt: number;   // Timestamp of next target recalculation
	isMistaking: boolean;     // Currently in a mistake state
	mistakeEndAt: number;     // When the mistake ends
	mistakeDir: number;       // Direction of mistake movement (-1 or 1)
}

/* ──────────────────────── Icons ──────────────────────── */

function ArrowLeftIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
	);
}

function PlayIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
		</svg>
	);
}

function PauseIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<rect x="6" y="4" width="4" height="16" fill="currentColor" />
			<rect x="14" y="4" width="4" height="16" fill="currentColor" />
		</svg>
	);
}

function TrophyIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
			<path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
			<path d="M4 22h16" />
			<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.24 7 20h10c0-.76-.85-1.25-2.03-1.79C14.47 17.98 14 17.55 14 17v-2.34" />
			<path d="M18 2H6v7a6 6 0 1012 0V2z" />
		</svg>
	);
}

function BotIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="11" width="18" height="10" rx="2" />
			<circle cx="12" cy="5" r="2" />
			<path d="M12 7v4" />
			<circle cx="8" cy="16" r="1" fill="currentColor" />
			<circle cx="16" cy="16" r="1" fill="currentColor" />
		</svg>
	);
}

/* ──────────────────────── Helpers ──────────────────────── */

function hexToRgba(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r},${g},${b},${alpha})`;
}

function randRange(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

function createInitialState(difficulty: Difficulty): GameState {
	const cfg = SPEED_CONFIG[difficulty];
	const dir = Math.random() > 0.5 ? 1 : -1;
	const angle = ((Math.random() * 60 - 30) * Math.PI) / 180;
	return {
		ballX: CANVAS_W / 2,
		ballY: CANVAS_H / 2,
		ballVX: cfg.ballSpeed * dir * Math.cos(angle),
		ballVY: cfg.ballSpeed * Math.sin(angle),
		ballSpeed: cfg.ballSpeed,
		p1Y: CANVAS_H / 2 - PADDLE_H / 2,
		p2Y: CANVAS_H / 2 - PADDLE_H / 2,
		score1: 0,
		score2: 0,
	};
}

function resetBall(state: GameState, difficulty: Difficulty): void {
	const cfg = SPEED_CONFIG[difficulty];
	const dir = Math.random() > 0.5 ? 1 : -1;
	const angle = ((Math.random() * 60 - 30) * Math.PI) / 180;
	state.ballX = CANVAS_W / 2;
	state.ballY = CANVAS_H / 2;
	state.ballSpeed = cfg.ballSpeed;
	state.ballVX = cfg.ballSpeed * dir * Math.cos(angle);
	state.ballVY = cfg.ballSpeed * Math.sin(angle);
}

function createInitialAIState(): AIState {
	return {
		targetY: CANVAS_H / 2,
		nextReactionAt: 0,
		isMistaking: false,
		mistakeEndAt: 0,
		mistakeDir: 1,
	};
}

/**
 * Simple linear projection: where will the ball be (Y) when it reaches the AI paddle's X?
 * Only used by Hard difficulty, with noise added.
 */
function projectBallY(state: GameState, noise: number): number {
	if (state.ballVX <= 0) return state.ballY; // Ball moving away, just use current Y

	const aiPaddleX = CANVAS_W - PADDLE_OFFSET - PADDLE_W;
	const dx = aiPaddleX - state.ballX;
	const timeToReach = dx / state.ballVX;
	let projectedY = state.ballY + state.ballVY * timeToReach;

	// Simulate wall bounces
	while (projectedY < 0 || projectedY > CANVAS_H) {
		if (projectedY < 0) projectedY = -projectedY;
		if (projectedY > CANVAS_H) projectedY = 2 * CANVAS_H - projectedY;
	}

	// Add noise
	projectedY += randRange(-noise, noise);
	return Math.max(BALL_R, Math.min(CANVAS_H - BALL_R, projectedY));
}

/* ──────────────────────── AI Update Logic ──────────────────────── */

function updateAI(
	state: GameState,
	aiState: AIState,
	aiCfg: AIConfig,
	now: number,
): void {
	const paddleCenter = state.p2Y + PADDLE_H / 2;

	// Handle active mistake
	if (aiState.isMistaking) {
		if (now >= aiState.mistakeEndAt) {
			aiState.isMistaking = false;
		} else {
			// During mistake: move in wrong direction or freeze
			if (aiState.mistakeDir !== 0) {
				state.p2Y += aiState.mistakeDir * aiCfg.paddleSpeed * 0.6;
				state.p2Y = Math.max(0, Math.min(CANVAS_H - PADDLE_H, state.p2Y));
			}
			return;
		}
	}

	// Recalculate target on reaction timer
	if (now >= aiState.nextReactionAt) {
		// Schedule next reaction with jitter
		aiState.nextReactionAt = now + randRange(aiCfg.reactionMin, aiCfg.reactionMax);

		// Check for random mistake
		if (Math.random() < aiCfg.mistakeChance) {
			aiState.isMistaking = true;
			aiState.mistakeEndAt = now + randRange(aiCfg.mistakeDuration * 0.7, aiCfg.mistakeDuration * 1.3);
			// 50% chance to move wrong direction, 50% to freeze
			aiState.mistakeDir = Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0;
			return;
		}

		const ballMovingTowardAI = state.ballVX > 0;
		const ballPastThreshold = state.ballX > CANVAS_W * aiCfg.trackThreshold;

		if (ballMovingTowardAI && ballPastThreshold) {
			// Track the ball
			let targetBallY: number;
			if (aiCfg.useProjection) {
				targetBallY = projectBallY(state, aiCfg.projectionNoise);
			} else {
				targetBallY = state.ballY;
			}
			// Add imprecision
			const error = randRange(-aiCfg.errorMax, aiCfg.errorMax);
			// Bias toward smaller errors (bell-curve-ish)
			const errorScaled = error * randRange(aiCfg.errorMin / aiCfg.errorMax, 1);
			aiState.targetY = targetBallY + errorScaled;
		} else {
			// Ball moving away or not past threshold: drift lazily toward center
			const center = CANVAS_H / 2;
			const drift = randRange(-30, 30); // Don't return to exact center
			aiState.targetY = center + drift;
		}

		// Clamp target
		aiState.targetY = Math.max(PADDLE_H / 2, Math.min(CANVAS_H - PADDLE_H / 2, aiState.targetY));
	}

	// Move paddle toward target (every frame)
	const delta = aiState.targetY - paddleCenter;
	if (Math.abs(delta) > aiCfg.deadZone) {
		const moveAmount = Math.min(Math.abs(delta), aiCfg.paddleSpeed);
		state.p2Y += delta > 0 ? moveAmount : -moveAmount;
		state.p2Y = Math.max(0, Math.min(CANVAS_H - PADDLE_H, state.p2Y));
	}
}

/* ──────────────────────── Canvas Drawing ──────────────────────── */

function drawGame(ctx: CanvasRenderingContext2D, state: GameState, p1Color: string) {
	const w = CANVAS_W;
	const h = CANVAS_H;
	const p1Glow = hexToRgba(p1Color, 0.6);

	ctx.fillStyle = COLORS.bg;
	ctx.fillRect(0, 0, w, h);

	ctx.setLineDash([10, 10]);
	ctx.strokeStyle = COLORS.line;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(w / 2, 0);
	ctx.lineTo(w / 2, h);
	ctx.stroke();
	ctx.setLineDash([]);

	ctx.beginPath();
	ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
	ctx.strokeStyle = COLORS.line;
	ctx.lineWidth = 1;
	ctx.stroke();

	ctx.font = "bold 64px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillStyle = hexToRgba(p1Color, 0.15);
	ctx.fillText(String(state.score1), w / 4, 30);
	ctx.fillStyle = "rgba(167,139,250,0.15)";
	ctx.fillText(String(state.score2), (3 * w) / 4, 30);

	// Player paddle (left)
	ctx.shadowColor = p1Glow;
	ctx.shadowBlur = 15;
	ctx.fillStyle = p1Color;
	ctx.beginPath();
	ctx.roundRect(PADDLE_OFFSET, state.p1Y, PADDLE_W, PADDLE_H, 6);
	ctx.fill();
	ctx.shadowBlur = 0;

	// AI paddle (right)
	ctx.shadowColor = COLORS.p2Glow;
	ctx.shadowBlur = 15;
	ctx.fillStyle = COLORS.p2;
	ctx.beginPath();
	ctx.roundRect(w - PADDLE_OFFSET - PADDLE_W, state.p2Y, PADDLE_W, PADDLE_H, 6);
	ctx.fill();
	ctx.shadowBlur = 0;

	// Ball
	ctx.shadowColor = COLORS.ballGlow;
	ctx.shadowBlur = 20;
	ctx.fillStyle = COLORS.ball;
	ctx.beginPath();
	ctx.arc(state.ballX, state.ballY, BALL_R, 0, Math.PI * 2);
	ctx.fill();
	ctx.shadowBlur = 0;

	// Ball trail
	ctx.globalAlpha = 0.15;
	ctx.fillStyle = COLORS.ball;
	ctx.beginPath();
	ctx.arc(state.ballX - state.ballVX * 2, state.ballY - state.ballVY * 2, BALL_R * 0.7, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = 0.07;
	ctx.beginPath();
	ctx.arc(state.ballX - state.ballVX * 4, state.ballY - state.ballVY * 4, BALL_R * 0.4, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = 1;
}

/* ──────────────────────── Lobby Screen ──────────────────────── */

function AILobbyScreen({
	difficulty,
	scoreLimit,
	onScoreLimitChange,
	onStart,
}: {
	difficulty: Difficulty;
	scoreLimit: number;
	onScoreLimitChange: (n: number) => void;
	onStart: () => void;
}) {
	const scoreLimits = [3, 5, 7, 10];
	const dl = DIFFICULTY_LABELS[difficulty];

	return (
		<div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
			<div className="w-full max-w-lg">
				<Link
					href="/dashboard/play"
					className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Back to Play
				</Link>

				<div className="rounded-2xl border border-neon-cyan/15 bg-surface-light p-6 sm:p-8">
					{/* Title */}
					<div className="mb-8 text-center">
						<div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-neon-cyan/10">
							<BotIcon className="h-7 w-7 text-neon-cyan" />
						</div>
						<h1 className="text-2xl font-bold text-white sm:text-3xl">vs AI</h1>
						<p className="mt-2 text-sm text-zinc-400">
							Difficulty: <span className={`font-semibold ${dl.color}`}>{dl.label}</span>
						</p>
						<p className="mt-1 text-xs text-zinc-500">{dl.desc}</p>
					</div>

					{/* Score Limit */}
					<div className="mb-8">
						<h4 className="mb-3 text-sm font-medium text-zinc-300">Score Limit</h4>
						<div className="grid grid-cols-4 gap-2">
							{scoreLimits.map((n) => (
								<button
									key={n}
									onClick={() => onScoreLimitChange(n)}
									className={`rounded-xl border py-3 text-center text-sm font-semibold transition-all ${scoreLimit === n
											? "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.1)]"
											: "border-white/5 bg-surface-lighter/50 text-zinc-400 hover:border-white/10 hover:text-white"
										}`}
								>
									{n}
								</button>
							))}
						</div>
						<p className="mt-2 text-center text-xs text-zinc-500">
							First to {scoreLimit} points wins
						</p>
					</div>

					{/* Controls */}
					<div className="mb-8">
						<h4 className="mb-3 text-sm font-medium text-zinc-300">Your Controls</h4>
						<div className="rounded-xl border border-white/5 bg-surface-lighter/50 p-4">
							<div className="flex justify-center">
								<div>
									<p className="text-sm font-medium text-neon-cyan">Player (You)</p>
									<div className="mt-2 space-y-1.5">
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
							</div>
							<div className="mt-4 border-t border-white/5 pt-3">
								<div className="flex items-center justify-center gap-2">
									<kbd className="rounded-md border border-white/10 bg-surface px-2.5 py-0.5 text-xs font-mono text-zinc-300">Space</kbd>
									<span className="text-xs text-zinc-500">Pause / Resume</span>
								</div>
							</div>
						</div>
					</div>

					{/* Start */}
					<button
						onClick={onStart}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan py-3.5 text-sm font-semibold text-surface shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:shadow-[0_0_35px_rgba(0,240,255,0.6)]"
					>
						<PlayIcon className="h-4 w-4" />
						Start Game
					</button>
				</div>
			</div>
		</div>
	);
}

/* ──────────────────────── Game Over Screen ──────────────────────── */

function AIGameOverScreen({
	playerWon,
	score1,
	score2,
	difficulty,
	saving,
	onPlayAgain,
	p1Color,
}: {
	playerWon: boolean;
	score1: number;
	score2: number;
	difficulty: Difficulty;
	saving: boolean;
	onPlayAgain: () => void;
	p1Color: string;
}) {
	const dl = DIFFICULTY_LABELS[difficulty];

	return (
		<div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
			<div className="w-full max-w-md text-center">
				<div
					className="rounded-2xl border bg-surface-light p-8"
					style={playerWon
						? { borderColor: hexToRgba(p1Color, 0.2), boxShadow: `0 0 40px ${hexToRgba(p1Color, 0.2)}` }
						: { borderColor: "rgba(239,68,68,0.2)", boxShadow: "0 0 40px rgba(239,68,68,0.15)" }
					}
				>
					{/* Trophy or X */}
					<div className="mb-4 flex justify-center">
						<div
							className="flex h-16 w-16 items-center justify-center rounded-full"
							style={{ backgroundColor: playerWon ? hexToRgba(p1Color, 0.1) : "rgba(239,68,68,0.1)" }}
						>
							{playerWon
								? <span style={{ color: p1Color }}><TrophyIcon className="h-8 w-8" /></span>
								: <BotIcon className="h-8 w-8 text-red-400" />
							}
						</div>
					</div>

					<h1 className="text-3xl font-bold" style={{ color: playerWon ? p1Color : undefined }}>
						<span className={playerWon ? "" : "text-red-400"}>
							{playerWon ? "You Win!" : "AI Wins!"}
						</span>
					</h1>
					<p className="mt-2 text-sm text-zinc-400">
						{playerWon ? "Great game!" : "Better luck next time!"}
						<span className={`ml-2 ${dl.color}`}>({dl.label})</span>
					</p>

					{/* Score */}
					<div className="mt-6 flex items-center justify-center gap-6">
						<div className="text-center">
							<p className="text-xs text-zinc-500">You</p>
							<p className="mt-1 text-4xl font-bold" style={{ color: p1Color }}>{score1}</p>
						</div>
						<div className="text-2xl font-light text-zinc-600">:</div>
						<div className="text-center">
							<p className="text-xs text-zinc-500">AI</p>
							<p className="mt-1 text-4xl font-bold text-accent-light">{score2}</p>
						</div>
					</div>

					{saving && (
						<p className="mt-4 text-xs text-zinc-500 animate-pulse">Saving match result...</p>
					)}

					{/* Actions */}
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<button
							onClick={onPlayAgain}
							className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-cyan py-3 text-sm font-semibold text-surface shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:shadow-[0_0_35px_rgba(0,240,255,0.6)]"
						>
							<PlayIcon className="h-4 w-4" />
							Play Again
						</button>
						<Link
							href="/dashboard/play"
							className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
						>
							<ArrowLeftIcon className="h-4 w-4" />
							Back to Menu
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ──────────────────────── Main Game Component ──────────────────────── */

function AIGameScreen({
	scoreLimit,
	difficulty,
	onGameOver,
	onQuit,
	p1Color,
}: {
	scoreLimit: number;
	difficulty: Difficulty;
	onGameOver: (playerWon: boolean, score1: number, score2: number, durationSec: number) => void;
	onQuit: () => void;
	p1Color: string;
}) {
	const cfg = SPEED_CONFIG[difficulty];
	const aiCfg = AI_CONFIG[difficulty];
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const gameRef = useRef<GameState>(createInitialState(difficulty));
	const aiRef = useRef<AIState>(createInitialAIState());
	const keysRef = useRef<Set<string>>(new Set());
	const rafRef = useRef<number>(0);
	const phaseRef = useRef<Phase>("countdown");
	const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const startTimeRef = useRef<number>(Date.now());

	const [phase, setPhase] = useState<Phase>("countdown");
	const [countdownValue, setCountdownValue] = useState(3);

	const setPhaseSync = useCallback((p: Phase) => {
		phaseRef.current = p;
		setPhase(p);
	}, []);

	const startCountdown = useCallback(() => {
		setPhaseSync("countdown");
		setCountdownValue(3);

		const tick = (val: number) => {
			if (val <= 0) {
				setPhaseSync("playing");
				return;
			}
			setCountdownValue(val);
			countdownTimerRef.current = setTimeout(() => tick(val - 1), 800);
		};

		if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
		countdownTimerRef.current = setTimeout(() => tick(2), 800);
	}, [setPhaseSync]);

	const handleScore = useCallback(
		(scorer: 1 | 2) => {
			const state = gameRef.current;
			if (scorer === 1) state.score1++;
			else state.score2++;

			if (state.score1 >= scoreLimit) {
				setPhaseSync("gameover");
				const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
				onGameOver(true, state.score1, state.score2, duration);
				return;
			}
			if (state.score2 >= scoreLimit) {
				setPhaseSync("gameover");
				const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
				onGameOver(false, state.score1, state.score2, duration);
				return;
			}

			resetBall(state, difficulty);
			// Reset AI state for new rally
			aiRef.current.isMistaking = false;
			aiRef.current.nextReactionAt = Date.now() + randRange(aiCfg.reactionMin, aiCfg.reactionMax);
			startCountdown();
		},
		[scoreLimit, difficulty, aiCfg, onGameOver, startCountdown, setPhaseSync]
	);

	// Game loop
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		function loop() {
			const state = gameRef.current;
			const keys = keysRef.current;
			const currentPhase = phaseRef.current;
			const now = Date.now();

			// Player paddle movement (W/S only)
			if (currentPhase === "playing" || currentPhase === "countdown") {
				if (keys.has("w") || keys.has("W")) state.p1Y = Math.max(0, state.p1Y - cfg.paddleSpeed);
				if (keys.has("s") || keys.has("S")) state.p1Y = Math.min(CANVAS_H - PADDLE_H, state.p1Y + cfg.paddleSpeed);
			}

			// AI paddle movement
			if (currentPhase === "playing") {
				updateAI(state, aiRef.current, aiCfg, now);
			}

			// Ball physics
			if (currentPhase === "playing") {
				state.ballX += state.ballVX;
				state.ballY += state.ballVY;

				// Wall bounce
				if (state.ballY - BALL_R <= 0) {
					state.ballY = BALL_R;
					state.ballVY = Math.abs(state.ballVY);
				}
				if (state.ballY + BALL_R >= CANVAS_H) {
					state.ballY = CANVAS_H - BALL_R;
					state.ballVY = -Math.abs(state.ballVY);
				}

				// Player paddle collision (left)
				const p1Left = PADDLE_OFFSET;
				const p1Right = PADDLE_OFFSET + PADDLE_W;
				if (
					state.ballX - BALL_R <= p1Right &&
					state.ballX + BALL_R >= p1Left &&
					state.ballY >= state.p1Y &&
					state.ballY <= state.p1Y + PADDLE_H &&
					state.ballVX < 0
				) {
					const hitPos = (state.ballY - state.p1Y) / PADDLE_H;
					const angle = ((hitPos - 0.5) * 120 * Math.PI) / 180;
					state.ballSpeed = Math.min(state.ballSpeed + cfg.speedInc, cfg.maxSpeed);
					state.ballVX = state.ballSpeed * Math.cos(angle);
					state.ballVY = state.ballSpeed * Math.sin(angle);
					state.ballX = p1Right + BALL_R;
				}

				// AI paddle collision (right)
				const p2Left = CANVAS_W - PADDLE_OFFSET - PADDLE_W;
				const p2Right = CANVAS_W - PADDLE_OFFSET;
				if (
					state.ballX + BALL_R >= p2Left &&
					state.ballX - BALL_R <= p2Right &&
					state.ballY >= state.p2Y &&
					state.ballY <= state.p2Y + PADDLE_H &&
					state.ballVX > 0
				) {
					const hitPos = (state.ballY - state.p2Y) / PADDLE_H;
					const angle = ((hitPos - 0.5) * 120 * Math.PI) / 180;
					state.ballSpeed = Math.min(state.ballSpeed + cfg.speedInc, cfg.maxSpeed);
					state.ballVX = -state.ballSpeed * Math.cos(angle);
					state.ballVY = state.ballSpeed * Math.sin(angle);
					state.ballX = p2Left - BALL_R;
				}

				// Scoring
				if (state.ballX - BALL_R <= 0) {
					handleScore(2); // AI scores
				} else if (state.ballX + BALL_R >= CANVAS_W) {
					handleScore(1); // Player scores
				}
			}

			if (ctx) drawGame(ctx, state, p1Color);

			if (phaseRef.current !== "gameover") {
				rafRef.current = requestAnimationFrame(loop);
			}
		}

		rafRef.current = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(rafRef.current);
	}, [handleScore, cfg, aiCfg, p1Color]);

	// Keyboard
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ([" ", "Escape"].includes(e.key)) e.preventDefault();
			keysRef.current.add(e.key);

			if (e.key === " " || e.key === "Escape") {
				if (phaseRef.current === "playing") setPhaseSync("paused");
				else if (phaseRef.current === "paused") setPhaseSync("playing");
			}
		}
		function handleKeyUp(e: KeyboardEvent) {
			keysRef.current.delete(e.key);
		}

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [setPhaseSync]);

	// Start countdown
	useEffect(() => {
		startTimeRef.current = Date.now();
		startCountdown();
		return () => { if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current); };
	}, [startCountdown]);

	const dl = DIFFICULTY_LABELS[difficulty];

	return (
		<div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 p-4">
			{/* Score HUD */}
			<div className="flex w-full max-w-[800px] items-center justify-between px-2">
				<div className="flex items-center gap-3">
					<div className="h-3 w-3 rounded-full" style={{ backgroundColor: p1Color, boxShadow: `0 0 8px ${hexToRgba(p1Color, 0.6)}` }} />
					<span className="text-sm font-medium" style={{ color: p1Color }}>You</span>
					<span className="text-2xl font-bold tabular-nums" style={{ color: p1Color }}>
						{gameRef.current.score1}
					</span>
				</div>
				<div className="flex items-center gap-2 text-xs text-zinc-500">
					{phase === "paused" && (
						<span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-400">
							<PauseIcon className="h-3 w-3" />
							PAUSED
						</span>
					)}
					<span className={`font-medium ${dl.color}`}>{dl.label}</span>
					<span className="text-zinc-600">|</span>
					<span>First to {scoreLimit}</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-2xl font-bold tabular-nums text-accent-light">
						{gameRef.current.score2}
					</span>
					<span className="text-sm font-medium text-accent-light">AI</span>
					<div className="h-3 w-3 rounded-full bg-accent-light shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
				</div>
			</div>

			{/* Canvas */}
			<div className="relative w-full max-w-[800px]">
				<canvas
					ref={canvasRef}
					width={CANVAS_W}
					height={CANVAS_H}
					className="w-full rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,240,255,0.06)]"
					style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
				/>

				{phase === "countdown" && (
					<div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
						<span
							key={countdownValue}
							className="animate-ping-once inline-block text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]"
						>
							{countdownValue > 0 ? countdownValue : "GO!"}
						</span>
					</div>
				)}

				{phase === "paused" && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-black/60 backdrop-blur-sm">
						<PauseIcon className="h-12 w-12 text-white/60" />
						<p className="text-xl font-bold text-white">PAUSED</p>
						<p className="text-sm text-zinc-400">Press Space or Esc to resume</p>
						<div className="mt-2 flex gap-3">
							<button
								onClick={() => setPhaseSync("playing")}
								className="flex items-center gap-2 rounded-xl bg-neon-cyan px-5 py-2.5 text-sm font-semibold text-surface shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:shadow-[0_0_35px_rgba(0,240,255,0.6)]"
							>
								<PlayIcon className="h-4 w-4" />
								Resume
							</button>
							<button
								onClick={onQuit}
								className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/20"
							>
								<ArrowLeftIcon className="h-4 w-4" />
								Quit
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Controls hint */}
			<div className="flex items-center gap-6 text-xs text-zinc-500">
				<div className="flex items-center gap-1.5">
					<kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">W</kbd>
					<kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">S</kbd>
					<span style={{ color: p1Color }}>You</span>
				</div>
				<div className="flex items-center gap-1.5">
					<kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">Space</kbd>
					<span>Pause</span>
				</div>
			</div>
		</div>
	);
}

/* ──────────────────────── Page ──────────────────────── */

function AIGamePageInner() {
	const searchParams = useSearchParams();
	const rawDifficulty = searchParams.get("difficulty") || "medium";
	const difficulty: Difficulty = (["easy", "medium", "hard"].includes(rawDifficulty)
		? rawDifficulty
		: "medium") as Difficulty;

	const [pagePhase, setPagePhase] = useState<"lobby" | "playing" | "gameover">("lobby");
	const [scoreLimit, setScoreLimit] = useState(5);
	const [gameResult, setGameResult] = useState<{
		playerWon: boolean;
		score1: number;
		score2: number;
	} | null>(null);
	const [gameKey, setGameKey] = useState(0);
	const [saving, setSaving] = useState(false);
	const [paddleColor, setPaddleColor] = useState(COLORS.p1);

	// Fetch user paddle color on mount
	useEffect(() => {
		getMyProfile()
			.then((res) => {
				if (res?.data?.paddleColor) setPaddleColor(res.data.paddleColor);
			})
			.catch(() => { });
	}, []);

	const handleStart = useCallback(() => {
		setGameResult(null);
		setGameKey((k) => k + 1);
		setPagePhase("playing");
	}, []);

	const handleGameOver = useCallback(
		async (playerWon: boolean, score1: number, score2: number, durationSec: number) => {
			setGameResult({ playerWon, score1, score2 });
			setPagePhase("gameover");

			// Save to stats
			setSaving(true);
			try {
				// Verify user is authenticated before saving
				const profile = await getMyProfile();
				if (profile?.data?.userId) {
					await recordAIMatch({
						scoreA: score1,
						scoreB: score2,
						duration: Math.max(1, durationSec),
						gameMode: `ai_${difficulty}` as "ai_easy" | "ai_medium" | "ai_hard",
					});
				}
			} catch {
				// Silently fail -- game was still played, just not recorded
				console.warn("Failed to save AI match result");
			} finally {
				setSaving(false);
			}
		},
		[difficulty]
	);

	const handlePlayAgain = useCallback(() => {
		setGameResult(null);
		setGameKey((k) => k + 1);
		setPagePhase("playing");
	}, []);

	const handleQuit = useCallback(() => {
		setGameResult(null);
		setPagePhase("lobby");
	}, []);

	return (
		<div className="relative">
			<div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-neon-cyan/5 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-accent/3 blur-[120px]" />

			<div className="relative z-10">
				{pagePhase === "lobby" && (
					<AILobbyScreen
						difficulty={difficulty}
						scoreLimit={scoreLimit}
						onScoreLimitChange={setScoreLimit}
						onStart={handleStart}
					/>
				)}

				{pagePhase === "playing" && (
					<AIGameScreen
						key={gameKey}
						scoreLimit={scoreLimit}
						difficulty={difficulty}
						onGameOver={handleGameOver}
						onQuit={handleQuit}
						p1Color={paddleColor}
					/>
				)}

				{pagePhase === "gameover" && gameResult && (
					<AIGameOverScreen
						playerWon={gameResult.playerWon}
						score1={gameResult.score1}
						score2={gameResult.score2}
						difficulty={difficulty}
						saving={saving}
						onPlayAgain={handlePlayAgain}
						p1Color={paddleColor}
					/>
				)}
			</div>
		</div>
	);
}

export default function AIGamePage() {
	return (
		<Suspense fallback={
			<div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
				<p className="text-zinc-500">Loading...</p>
			</div>
		}>
			<AIGamePageInner />
		</Suspense>
	);
}
