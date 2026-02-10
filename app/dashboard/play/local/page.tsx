"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

/* ──────────────────────── Constants ──────────────────────── */

const CANVAS_W = 800;
const CANVAS_H = 600;

const PADDLE_W = 12;
const PADDLE_H = 100;
const PADDLE_OFFSET = 20;

const BALL_R = 8;

type GameSpeed = "easy" | "medium" | "hard";

const SPEED_CONFIG: Record<GameSpeed, { ballSpeed: number; speedInc: number; maxSpeed: number; paddleSpeed: number; label: string; desc: string }> = {
  easy:   { ballSpeed: 3.5, speedInc: 0.15, maxSpeed: 8,  paddleSpeed: 6, label: "Easy",   desc: "Slow ball, relaxed pace"   },
  medium: { ballSpeed: 5,   speedInc: 0.3,  maxSpeed: 12, paddleSpeed: 7, label: "Medium", desc: "Balanced speed, fair play"  },
  hard:   { ballSpeed: 7,   speedInc: 0.5,  maxSpeed: 16, paddleSpeed: 9, label: "Hard",   desc: "Fast ball, quick reflexes" },
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
  text: "rgba(255,255,255,0.5)",
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

/* ──────────────────────── Helper: create initial game state ──────────────────────── */

function createInitialState(speed: GameSpeed): GameState {
  const cfg = SPEED_CONFIG[speed];
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

function resetBall(state: GameState, speed: GameSpeed): void {
  const cfg = SPEED_CONFIG[speed];
  const dir = Math.random() > 0.5 ? 1 : -1;
  const angle = ((Math.random() * 60 - 30) * Math.PI) / 180;
  state.ballX = CANVAS_W / 2;
  state.ballY = CANVAS_H / 2;
  state.ballSpeed = cfg.ballSpeed;
  state.ballVX = cfg.ballSpeed * dir * Math.cos(angle);
  state.ballVY = cfg.ballSpeed * Math.sin(angle);
}

/* ──────────────────────── Lobby Screen ──────────────────────── */

function LobbyScreen({
  scoreLimit,
  onScoreLimitChange,
  gameSpeed,
  onGameSpeedChange,
  onStart,
}: {
  scoreLimit: number;
  onScoreLimitChange: (n: number) => void;
  gameSpeed: GameSpeed;
  onGameSpeedChange: (s: GameSpeed) => void;
  onStart: () => void;
}) {
  const scoreLimits = [3, 5, 7, 10];
  const speeds: GameSpeed[] = ["easy", "medium", "hard"];
  const speedColors: Record<GameSpeed, { active: string; text: string }> = {
    easy:   { active: "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.1)]", text: "text-emerald-400" },
    medium: { active: "border-amber-500/30 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]",     text: "text-amber-400"   },
    hard:   { active: "border-red-500/30 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]",           text: "text-red-400"     },
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back */}
        <Link
          href="/dashboard/play"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Play
        </Link>

        <div className="rounded-2xl border border-accent/15 bg-surface-light p-6 sm:p-8">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Local 1v1</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Same keyboard, two players, one winner
            </p>
          </div>

          {/* Score Limit */}
          <div className="mb-8">
            <h4 className="mb-3 text-sm font-medium text-zinc-300">Score Limit</h4>
            <div className="grid grid-cols-4 gap-2">
              {scoreLimits.map((n) => (
                <button
                  key={n}
                  onClick={() => onScoreLimitChange(n)}
                  className={`rounded-xl border py-3 text-center text-sm font-semibold transition-all ${
                    scoreLimit === n
                      ? "border-accent/30 bg-accent/10 text-accent-light shadow-[0_0_20px_rgba(139,92,246,0.1)]"
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

          {/* Game Speed */}
          <div className="mb-8">
            <h4 className="mb-3 text-sm font-medium text-zinc-300">Game Speed</h4>
            <div className="grid grid-cols-3 gap-2">
              {speeds.map((s) => {
                const cfg = SPEED_CONFIG[s];
                const sc = speedColors[s];
                return (
                  <button
                    key={s}
                    onClick={() => onGameSpeedChange(s)}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${
                      gameSpeed === s
                        ? sc.active
                        : "border-white/5 bg-surface-lighter/50 hover:border-white/10"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${gameSpeed === s ? sc.text : "text-zinc-300"}`}>
                      {cfg.label}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">{cfg.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="mb-8">
            <h4 className="mb-3 text-sm font-medium text-zinc-300">Controls</h4>
            <div className="rounded-xl border border-white/5 bg-surface-lighter/50 p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-neon-cyan">Player 1</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <kbd className="rounded-md border border-white/10 bg-surface px-2 py-0.5 text-xs font-mono text-zinc-300">
                        W
                      </kbd>
                      <span className="text-xs text-zinc-500">Move up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="rounded-md border border-white/10 bg-surface px-2 py-0.5 text-xs font-mono text-zinc-300">
                        S
                      </kbd>
                      <span className="text-xs text-zinc-500">Move down</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-light">Player 2</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <kbd className="rounded-md border border-white/10 bg-surface px-2 py-0.5 text-xs font-mono text-zinc-300">
                        &uarr;
                      </kbd>
                      <span className="text-xs text-zinc-500">Move up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="rounded-md border border-white/10 bg-surface px-2 py-0.5 text-xs font-mono text-zinc-300">
                        &darr;
                      </kbd>
                      <span className="text-xs text-zinc-500">Move down</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-white/5 pt-3">
                <div className="flex items-center justify-center gap-2">
                  <kbd className="rounded-md border border-white/10 bg-surface px-2.5 py-0.5 text-xs font-mono text-zinc-300">
                    Space
                  </kbd>
                  <span className="text-xs text-zinc-500">Pause / Resume</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start */}
          <button
            onClick={onStart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_35px_rgba(139,92,246,0.6)]"
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

function GameOverScreen({
  winner,
  score1,
  score2,
  onPlayAgain,
}: {
  winner: 1 | 2;
  score1: number;
  score2: number;
  onPlayAgain: () => void;
}) {
  const winnerColor = winner === 1 ? "text-neon-cyan" : "text-accent-light";
  const winnerGlow =
    winner === 1
      ? "shadow-[0_0_40px_rgba(0,240,255,0.2)]"
      : "shadow-[0_0_40px_rgba(167,139,250,0.2)]";
  const winnerBorder =
    winner === 1 ? "border-neon-cyan/20" : "border-accent/20";

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className={`rounded-2xl border ${winnerBorder} bg-surface-light p-8 ${winnerGlow}`}>
          {/* Trophy */}
          <div className="mb-4 flex justify-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${winner === 1 ? "bg-neon-cyan/10" : "bg-accent/10"}`}>
              <TrophyIcon className={`h-8 w-8 ${winnerColor}`} />
            </div>
          </div>

          {/* Winner text */}
          <h1 className={`text-3xl font-bold ${winnerColor}`}>
            Player {winner} Wins!
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Great match!</p>

          {/* Score */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-xs text-zinc-500">Player 1</p>
              <p className="mt-1 text-4xl font-bold text-neon-cyan">{score1}</p>
            </div>
            <div className="text-2xl font-light text-zinc-600">:</div>
            <div className="text-center">
              <p className="text-xs text-zinc-500">Player 2</p>
              <p className="mt-1 text-4xl font-bold text-accent-light">{score2}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onPlayAgain}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_35px_rgba(139,92,246,0.6)]"
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

/* ──────────────────────── Canvas Drawing ──────────────────────── */

function drawGame(ctx: CanvasRenderingContext2D, state: GameState) {
  const w = CANVAS_W;
  const h = CANVAS_H;

  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);

  // Center dashed line
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center circle
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Scores
  ctx.font = "bold 64px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(0,240,255,0.15)";
  ctx.fillText(String(state.score1), w / 4, 30);
  ctx.fillStyle = "rgba(167,139,250,0.15)";
  ctx.fillText(String(state.score2), (3 * w) / 4, 30);

  // Player 1 paddle (left)
  ctx.shadowColor = COLORS.p1Glow;
  ctx.shadowBlur = 15;
  ctx.fillStyle = COLORS.p1;
  ctx.beginPath();
  ctx.roundRect(PADDLE_OFFSET, state.p1Y, PADDLE_W, PADDLE_H, 6);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Player 2 paddle (right)
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

  // Ball trail (subtle)
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

/* ──────────────────────── Main Game Component ──────────────────────── */

function GameScreen({
  scoreLimit,
  gameSpeed,
  onGameOver,
}: {
  scoreLimit: number;
  gameSpeed: GameSpeed;
  onGameOver: (winner: 1 | 2, score1: number, score2: number) => void;
}) {
  const cfg = SPEED_CONFIG[gameSpeed];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(createInitialState(gameSpeed));
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("countdown");
  const countdownRef = useRef(3);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdownValue, setCountdownValue] = useState(3);

  // Sync refs with state for the game loop
  const setPhaseSync = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  // Start countdown sequence
  const startCountdown = useCallback(() => {
    setPhaseSync("countdown");
    countdownRef.current = 3;
    setCountdownValue(3);

    const tick = (val: number) => {
      if (val <= 0) {
        setPhaseSync("playing");
        return;
      }
      countdownRef.current = val;
      setCountdownValue(val);
      countdownTimerRef.current = setTimeout(() => tick(val - 1), 800);
    };

    // Clear any existing timer
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    countdownTimerRef.current = setTimeout(() => tick(2), 800);
  }, [setPhaseSync]);

  // Handle scoring
  const handleScore = useCallback(
    (scorer: 1 | 2) => {
      const state = gameRef.current;
      if (scorer === 1) state.score1++;
      else state.score2++;

      if (state.score1 >= scoreLimit) {
        setPhaseSync("gameover");
        onGameOver(1, state.score1, state.score2);
        return;
      }
      if (state.score2 >= scoreLimit) {
        setPhaseSync("gameover");
        onGameOver(2, state.score1, state.score2);
        return;
      }

      // Reset ball and start countdown
      resetBall(state, gameSpeed);
      startCountdown();
    },
    [scoreLimit, gameSpeed, onGameOver, startCountdown, setPhaseSync]
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

      // Move paddles (always, even during countdown for positioning)
      if (currentPhase === "playing" || currentPhase === "countdown") {
        if (keys.has("w") || keys.has("W")) state.p1Y = Math.max(0, state.p1Y - cfg.paddleSpeed);
        if (keys.has("s") || keys.has("S")) state.p1Y = Math.min(CANVAS_H - PADDLE_H, state.p1Y + cfg.paddleSpeed);
        if (keys.has("ArrowUp")) state.p2Y = Math.max(0, state.p2Y - cfg.paddleSpeed);
        if (keys.has("ArrowDown")) state.p2Y = Math.min(CANVAS_H - PADDLE_H, state.p2Y + cfg.paddleSpeed);
      }

      // Ball physics (only during playing)
      if (currentPhase === "playing") {
        state.ballX += state.ballVX;
        state.ballY += state.ballVY;

        // Top/bottom wall bounce
        if (state.ballY - BALL_R <= 0) {
          state.ballY = BALL_R;
          state.ballVY = Math.abs(state.ballVY);
        }
        if (state.ballY + BALL_R >= CANVAS_H) {
          state.ballY = CANVAS_H - BALL_R;
          state.ballVY = -Math.abs(state.ballVY);
        }

        // Left paddle collision (P1)
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

        // Right paddle collision (P2)
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
          handleScore(2);
        } else if (state.ballX + BALL_R >= CANVAS_W) {
          handleScore(1);
        }
      }

      // Draw
      if (ctx) {
        drawGame(ctx, state);
      }

      if (phaseRef.current !== "gameover") {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScore]);

  // Keyboard input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Prevent default for game keys to avoid scrolling
      if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }

      keysRef.current.add(e.key);

      // Toggle pause
      if (e.key === " ") {
        if (phaseRef.current === "playing") {
          setPhaseSync("paused");
        } else if (phaseRef.current === "paused") {
          setPhaseSync("playing");
        }
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

  // Start initial countdown
  useEffect(() => {
    startCountdown();
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [startCountdown]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 p-4">
      {/* Score HUD */}
      <div className="flex w-full max-w-[800px] items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
          <span className="text-sm font-medium text-neon-cyan">Player 1</span>
          <span className="text-2xl font-bold tabular-nums text-neon-cyan">
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
          <span>First to {scoreLimit}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tabular-nums text-accent-light">
            {gameRef.current.score2}
          </span>
          <span className="text-sm font-medium text-accent-light">Player 2</span>
          <div className="h-3 w-3 rounded-full bg-accent-light shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative w-full max-w-[800px]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full rounded-xl border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.08)]"
          style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
        />

        {/* Countdown overlay */}
        {phase === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
            <div className="text-center">
              <span
                key={countdownValue}
                className="animate-ping-once inline-block text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]"
              >
                {countdownValue > 0 ? countdownValue : "GO!"}
              </span>
            </div>
          </div>
        )}

        {/* Pause overlay */}
        {phase === "paused" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/60 backdrop-blur-sm">
            <PauseIcon className="h-12 w-12 text-white/60" />
            <p className="text-xl font-bold text-white">PAUSED</p>
            <p className="text-sm text-zinc-400">Press Space to resume</p>
          </div>
        )}
      </div>

      {/* Bottom controls hint */}
      <div className="flex items-center gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">W</kbd>
          <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">S</kbd>
          <span className="text-neon-cyan">P1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">Space</kbd>
          <span>Pause</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">&uarr;</kbd>
          <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">&darr;</kbd>
          <span className="text-accent-light">P2</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Page ──────────────────────── */

export default function LocalGamePage() {
  const [phase, setPhase] = useState<"lobby" | "playing" | "gameover">("lobby");
  const [scoreLimit, setScoreLimit] = useState(5);
  const [gameSpeed, setGameSpeed] = useState<GameSpeed>("medium");
  const [gameResult, setGameResult] = useState<{
    winner: 1 | 2;
    score1: number;
    score2: number;
  } | null>(null);
  const [gameKey, setGameKey] = useState(0);

  function handleStart() {
    setGameResult(null);
    setGameKey((k) => k + 1);
    setPhase("playing");
  }

  function handleGameOver(winner: 1 | 2, score1: number, score2: number) {
    setGameResult({ winner, score1, score2 });
    setPhase("gameover");
  }

  function handlePlayAgain() {
    setGameResult(null);
    setGameKey((k) => k + 1);
    setPhase("playing");
  }

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-neon-cyan/3 blur-[120px]" />

      <div className="relative z-10">
        {phase === "lobby" && (
          <LobbyScreen
            scoreLimit={scoreLimit}
            onScoreLimitChange={setScoreLimit}
            gameSpeed={gameSpeed}
            onGameSpeedChange={setGameSpeed}
            onStart={handleStart}
          />
        )}

        {phase === "playing" && (
          <GameScreen
            key={gameKey}
            scoreLimit={scoreLimit}
            gameSpeed={gameSpeed}
            onGameOver={handleGameOver}
          />
        )}

        {phase === "gameover" && gameResult && (
          <GameOverScreen
            winner={gameResult.winner}
            score1={gameResult.score1}
            score2={gameResult.score2}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
}
