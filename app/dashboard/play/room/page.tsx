"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMyProfile, getUserById } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

/* ──────────────────────── Game / Canvas Constants ──────────────────────── */

const CANVAS_W = 800;
const CANVAS_H = 600;

const PADDLE_W = 12;
const PADDLE_H = 100;
const PADDLE_OFFSET = 20;

const BALL_SIZE = 10;
const BALL_R = 8;

const COLORS = {
    bg: "#08080c",
    p1: "#f59e0b",
    p1Glow: "rgba(245,158,11,0.6)",
    p2: "#a78bfa",
    p2Glow: "rgba(167,139,250,0.6)",
    ball: "#ffffff",
    ballGlow: "rgba(255,255,255,0.8)",
    line: "rgba(255,255,255,0.08)",
};

/* ──────────────────────── Types ──────────────────────── */

type ConnectionPhase =
    | "connecting"
    | "waiting"
    | "countdown"
    | "playing"
    | "opponent_disconnected"
    | "game_over"
    | "error";

interface ServerGameState {
    ball: { x: number; y: number; vx: number; vy: number };
    paddle1: { y: number; moving: number };
    paddle2: { y: number; moving: number };
    score: { player1: number; player2: number };
}

interface GameResult {
    winner: 1 | 2;
    finalScore: { player1: number; player2: number };
    gameDuration: number;
    startTime: string;
    endTime: string;
}

/* ──────────────────────── Icons ──────────────────────── */

function ArrowLeftIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

function DoorIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2z" />
            <path d="M12 11h.01" />
            <circle cx="12" cy="11" r="1" fill="currentColor" />
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

function WifiOffIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
            <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0122.56 9" />
            <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
            <path d="M8.53 16.11a6 6 0 016.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
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

function buildWsUrl(path: string, token: string): string {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}${path}?token=${encodeURIComponent(token)}`;
}

function formatDuration(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

/* ──────────────────────── Canvas Drawing ──────────────────────── */

function drawGame(
    ctx: CanvasRenderingContext2D,
    state: ServerGameState,
    myColor: string,
    opponentColor: string,
    playerNumber: 1 | 2,
) {
    const w = CANVAS_W;
    const h = CANVAS_H;

    const myPaddleY = playerNumber === 1 ? state.paddle1.y : state.paddle2.y;
    const opPaddleY = playerNumber === 1 ? state.paddle2.y : state.paddle1.y;
    const myScore = playerNumber === 1 ? state.score.player1 : state.score.player2;
    const opScore = playerNumber === 1 ? state.score.player2 : state.score.player1;

    const halfBall = BALL_SIZE / 2;
    let ballCX = state.ball.x + halfBall;
    let ballCY = state.ball.y + halfBall;
    let ballVX = state.ball.vx;
    let ballVY = state.ball.vy;

    if (playerNumber === 2) {
        ballCX = w - ballCX;
        ballVX = -ballVX;
    }

    const myGlow = hexToRgba(myColor, 0.6);

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
    ctx.fillStyle = hexToRgba(myColor, 0.15);
    ctx.fillText(String(myScore), w / 4, 30);
    ctx.fillStyle = hexToRgba(opponentColor, 0.15);
    ctx.fillText(String(opScore), (3 * w) / 4, 30);

    ctx.shadowColor = myGlow;
    ctx.shadowBlur = 15;
    ctx.fillStyle = myColor;
    ctx.beginPath();
    ctx.roundRect(PADDLE_OFFSET, myPaddleY, PADDLE_W, PADDLE_H, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.shadowColor = hexToRgba(opponentColor, 0.6);
    ctx.shadowBlur = 15;
    ctx.fillStyle = opponentColor;
    ctx.beginPath();
    ctx.roundRect(w - PADDLE_OFFSET - PADDLE_W, opPaddleY, PADDLE_W, PADDLE_H, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.shadowColor = COLORS.ballGlow;
    ctx.shadowBlur = 20;
    ctx.fillStyle = COLORS.ball;
    ctx.beginPath();
    ctx.arc(ballCX, ballCY, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.15;
    ctx.fillStyle = COLORS.ball;
    ctx.beginPath();
    ctx.arc(ballCX - ballVX * 2, ballCY - ballVY * 2, BALL_R * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.07;
    ctx.beginPath();
    ctx.arc(ballCX - ballVX * 4, ballCY - ballVY * 4, BALL_R * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}

/* ──────────────────────── Error Screen ──────────────────────── */

function ErrorScreen({ message }: { message: string }) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <div className="rounded-2xl border border-red-500/20 bg-surface-light p-8">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                            <WifiOffIcon className="h-8 w-8 text-red-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-red-400">Connection Error</h2>
                    <p className="mt-2 text-sm text-zinc-400">{message}</p>
                    <Link
                        href="/dashboard/play"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Play
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────── Game Over Screen ──────────────────────── */

function RoomGameOverScreen({
    won,
    myScore,
    opScore,
    duration,
    myColor,
    opponentName,
}: {
    won: boolean;
    myScore: number;
    opScore: number;
    duration: number;
    myColor: string;
    opponentName: string;
}) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <div
                    className="rounded-2xl border bg-surface-light p-8"
                    style={won
                        ? { borderColor: hexToRgba(myColor, 0.2), boxShadow: `0 0 40px ${hexToRgba(myColor, 0.2)}` }
                        : { borderColor: "rgba(239,68,68,0.2)", boxShadow: "0 0 40px rgba(239,68,68,0.15)" }
                    }
                >
                    <div className="mb-4 flex justify-center">
                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-full"
                            style={{ backgroundColor: won ? hexToRgba(myColor, 0.1) : "rgba(239,68,68,0.1)" }}
                        >
                            {won
                                ? <span style={{ color: myColor }}><TrophyIcon className="h-8 w-8" /></span>
                                : <svg className="h-8 w-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                            }
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold" style={{ color: won ? myColor : undefined }}>
                        <span className={won ? "" : "text-red-400"}>
                            {won ? "Victory!" : "Defeat"}
                        </span>
                    </h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        {won ? "Well played!" : "Better luck next time!"}
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-6">
                        <div className="text-center">
                            <p className="text-xs text-zinc-500">You</p>
                            <p className="mt-1 text-4xl font-bold" style={{ color: myColor }}>{myScore}</p>
                        </div>
                        <div className="text-2xl font-light text-zinc-600">:</div>
                        <div className="text-center">
                            <p className="text-xs text-zinc-500">{opponentName}</p>
                            <p className="mt-1 text-4xl font-bold text-accent-light">{opScore}</p>
                        </div>
                    </div>

                    {duration > 0 && (
                        <p className="mt-4 text-xs text-zinc-500">
                            Match duration: {formatDuration(duration)}
                        </p>
                    )}

                    <div className="mt-8">
                        <Link
                            href="/dashboard/play"
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
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

/* ──────────────────────── Game Left Screen ──────────────────────── */

function GameLeftScreen({ opponentName }: { opponentName: string }) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <div
                    className="rounded-2xl border bg-surface-light p-8"
                    style={{ borderColor: "rgba(161,161,170,0.2)" }}
                >
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-500/10">
                            <WifiOffIcon className="h-8 w-8 text-zinc-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-200">Game Ended</h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        {opponentName} left the game.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/dashboard/play"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-surface shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:shadow-[0_0_35px_rgba(245,158,11,0.6)]"
                        >
                            Go to Play
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────── Main Room Game Screen ──────────────────────── */

function RoomGameScreen({
    roomId,
    paddleColor,
}: {
    roomId: string;
    paddleColor: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const stateRef = useRef<ServerGameState | null>(null);
    const rafRef = useRef<number>(0);
    const keysRef = useRef<Set<string>>(new Set());
    const lastDirRef = useRef<number>(0);
    const playerNumberRef = useRef<1 | 2>(1);
    const router = useRouter();

    const [phase, setPhase] = useState<ConnectionPhase>("connecting");
    const phaseRef = useRef<ConnectionPhase>("connecting");
    const [errorMessage, setErrorMessage] = useState("");
    const [opponentName, setOpponentName] = useState("Opponent");
    const myUserIdRef = useRef<string>("");
    const [gameResult, setGameResult] = useState<{
        won: boolean;
        myScore: number;
        opScore: number;
        duration: number;
    } | null>(null);
    const [leftByOpponent, setLeftByOpponent] = useState(false);
    const [countdownValue, setCountdownValue] = useState(3);
    const [opponentDisconnectTimer, setOpponentDisconnectTimer] = useState(30);
    const disconnectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const setPhaseSync = useCallback((p: ConnectionPhase) => {
        phaseRef.current = p;
        setPhase(p);
    }, []);

    const myColor = paddleColor;
    const opponentColor = COLORS.p2;

    const sendInput = useCallback((direction: -1 | 0 | 1) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "input", direction }));
        }
    }, []);

    // Rendering loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function loop() {
            const state = stateRef.current;
            if (state && ctx) {
                try {
                    drawGame(ctx, state, myColor, opponentColor, playerNumberRef.current);
                } catch {
                    // Prevent rendering error from killing the loop
                }
            }
            rafRef.current = requestAnimationFrame(loop);
        }

        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [myColor, opponentColor, phase]);

    // Keyboard input
    useEffect(() => {
        const isUp = (k: string) => k === "w" || k === "W" || k === "ArrowUp";
        const isDown = (k: string) => k === "s" || k === "S" || k === "ArrowDown";

        function applyDir(dir: -1 | 0 | 1) {
            if (dir !== lastDirRef.current) {
                lastDirRef.current = dir;
                sendInput(dir);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (isUp(e.key) || isDown(e.key)) e.preventDefault();
            keysRef.current.add(e.key);

            if (isUp(e.key)) applyDir(-1);
            else if (isDown(e.key)) applyDir(1);
        }

        function handleKeyUp(e: KeyboardEvent) {
            keysRef.current.delete(e.key);
            const keys = keysRef.current;

            const up = keys.has("w") || keys.has("W") || keys.has("ArrowUp");
            const down = keys.has("s") || keys.has("S") || keys.has("ArrowDown");

            if (up && !down) applyDir(-1);
            else if (down && !up) applyDir(1);
            else applyDir(0);
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [sendInput]);

    // Fetch opponent profile
    const fetchOpponentName = useCallback((players?: string[]) => {
        if (!players || !myUserIdRef.current) return;
        const opponentId = players.find((id) => id !== myUserIdRef.current);
        if (!opponentId) return;
        getUserById(opponentId)
            .then((res) => {
                if (res?.data) {
                    setOpponentName(res.data.displayName || res.data.username);
                }
            })
            .catch(() => { });
    }, []);

    // WebSocket connection
    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            setPhaseSync("error");
            return;
        }

        getMyProfile()
            .then((res) => {
                if (res?.data?.userId) myUserIdRef.current = res.data.userId;
            })
            .catch(() => { });

        const wsUrl = buildWsUrl(`/api/v1/games/ws/${roomId}`, token);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setPhaseSync("waiting");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case "player_assignment":
                        playerNumberRef.current = data.playerNumber as 1 | 2;
                        if (data.players) fetchOpponentName(data.players);
                        break;

                    case "countdown":
                        setCountdownValue(data.count as number);
                        if (phaseRef.current !== "countdown") {
                            setPhaseSync("countdown");
                        }
                        if (disconnectTimerRef.current) {
                            clearInterval(disconnectTimerRef.current);
                            disconnectTimerRef.current = null;
                        }
                        break;

                    case "state":
                        if (phaseRef.current !== "playing" && phaseRef.current !== "opponent_disconnected") {
                            setPhaseSync("playing");
                        }
                        stateRef.current = data.state;
                        break;

                    case "reconnected":
                        if (data.playerNumber) {
                            playerNumberRef.current = data.playerNumber as 1 | 2;
                        }
                        if (data.players) fetchOpponentName(data.players);
                        stateRef.current = data.state;
                        if (disconnectTimerRef.current) {
                            clearInterval(disconnectTimerRef.current);
                            disconnectTimerRef.current = null;
                        }
                        break;

                    case "game_resumed":
                        if (disconnectTimerRef.current) {
                            clearInterval(disconnectTimerRef.current);
                            disconnectTimerRef.current = null;
                        }
                        break;

                    case "you_win": {
                        const result = data.result as GameResult;
                        const pn = playerNumberRef.current;
                        setGameResult({
                            won: true,
                            myScore: pn === 1 ? result.finalScore.player1 : result.finalScore.player2,
                            opScore: pn === 1 ? result.finalScore.player2 : result.finalScore.player1,
                            duration: result.gameDuration,
                        });
                        setPhaseSync("game_over");
                        break;
                    }

                    case "you_lose": {
                        const result = data.result as GameResult;
                        const pn = playerNumberRef.current;
                        setGameResult({
                            won: false,
                            myScore: pn === 1 ? result.finalScore.player1 : result.finalScore.player2,
                            opScore: pn === 1 ? result.finalScore.player2 : result.finalScore.player1,
                            duration: result.gameDuration,
                        });
                        setPhaseSync("game_over");
                        break;
                    }

                    case "opponent_disconnected":
                        setPhaseSync("opponent_disconnected");
                        setOpponentDisconnectTimer(30);
                        disconnectTimerRef.current = setInterval(() => {
                            setOpponentDisconnectTimer((t) => {
                                if (t <= 1) {
                                    if (disconnectTimerRef.current) {
                                        clearInterval(disconnectTimerRef.current);
                                        disconnectTimerRef.current = null;
                                    }
                                    return 0;
                                }
                                return t - 1;
                            });
                        }, 1000);
                        break;

                    case "opponent_left":
                        setLeftByOpponent(true);
                        setPhaseSync("game_over");
                        if (disconnectTimerRef.current) {
                            clearInterval(disconnectTimerRef.current);
                            disconnectTimerRef.current = null;
                        }
                        break;

                    case "game_end":
                        if (phaseRef.current !== "game_over") {
                            setPhaseSync("game_over");
                        }
                        break;
                }
            } catch {
                // Ignore malformed messages
            }
        };

        ws.onclose = (event) => {
            if (phaseRef.current === "game_over") return;
            if (event.code === 1000) return;

            if (event.code === 4004) {
                setErrorMessage("This game has already ended or does not exist.");
                setPhaseSync("error");
                return;
            }
            if (event.code === 4003) {
                setErrorMessage("You are not allowed to join this game, or the room is full.");
                setPhaseSync("error");
                return;
            }
            if (event.code === 1008) {
                setErrorMessage("Authentication failed. Please log in and try again.");
                setPhaseSync("error");
                return;
            }

            if (phaseRef.current === "connecting" || phaseRef.current === "waiting") {
                setPhaseSync("connecting");
            } else {
                setPhaseSync("error");
            }
        };

        ws.onerror = () => {
            // onerror is always followed by onclose
        };

        return () => {
            if (disconnectTimerRef.current) {
                clearInterval(disconnectTimerRef.current);
            }
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                if (phaseRef.current !== "game_over" && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "leave" }));
                }
                ws.close();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, setPhaseSync]);

    if (phase === "error") {
        return <ErrorScreen message={errorMessage || "Failed to connect to the game. The game may have ended or you may not have access."} />;
    }

    if (phase === "game_over" && leftByOpponent) {
        return <GameLeftScreen opponentName={opponentName} />;
    }

    if (phase === "game_over" && gameResult) {
        return (
            <RoomGameOverScreen
                won={gameResult.won}
                myScore={gameResult.myScore}
                opScore={gameResult.opScore}
                duration={gameResult.duration}
                myColor={myColor}
                opponentName={opponentName}
            />
        );
    }

    const currentState = stateRef.current;
    const pn = playerNumberRef.current;
    const myScoreValue = currentState
        ? (pn === 1 ? currentState.score.player1 : currentState.score.player2)
        : 0;
    const opScoreValue = currentState
        ? (pn === 1 ? currentState.score.player2 : currentState.score.player1)
        : 0;

    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 p-4">
            {/* Score HUD */}
            <div className="flex w-full max-w-[800px] items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: myColor, boxShadow: `0 0 8px ${hexToRgba(myColor, 0.6)}` }}
                    />
                    <span className="text-sm font-medium" style={{ color: myColor }}>You</span>
                    <span className="text-2xl font-bold tabular-nums" style={{ color: myColor }}>
                        {myScoreValue}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    {phase === "connecting" && (
                        <span className="flex items-center gap-1.5 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-3 py-1 text-zinc-400">
                            <div className="h-3 w-3 rounded-full border border-zinc-500/30 border-t-zinc-300 animate-spin" />
                            Connecting...
                        </span>
                    )}
                    {phase === "waiting" && (
                        <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-400">
                            <DoorIcon className="h-3 w-3" />
                            Waiting for opponent...
                        </span>
                    )}
                    {phase === "countdown" && (
                        <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-400">
                            Starting in {countdownValue}...
                        </span>
                    )}
                    {phase === "opponent_disconnected" && (
                        <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-400">
                            <WifiOffIcon className="h-3 w-3" />
                            {opponentName} disconnected ({opponentDisconnectTimer}s)
                        </span>
                    )}
                    {phase === "playing" && (
                        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400">
                            LIVE
                        </span>
                    )}
                    <span className="text-zinc-600">|</span>
                    <span>Private Room</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold tabular-nums text-accent-light">
                        {opScoreValue}
                    </span>
                    <span className="text-sm font-medium text-accent-light">{opponentName}</span>
                    <div className="h-3 w-3 rounded-full bg-accent-light shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
                </div>
            </div>

            {/* Canvas */}
            <div className="relative w-full max-w-[800px]">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_W}
                    height={CANVAS_H}
                    className="w-full rounded-xl border border-white/10 shadow-[0_0_40px_rgba(245,158,11,0.06)]"
                    style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
                />

                {/* Connecting overlay */}
                {phase === "connecting" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-black/70 backdrop-blur-sm">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-2 border-zinc-500/30 border-t-zinc-300 animate-spin" />
                            <DoorIcon className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-white">Connecting to game...</p>
                        <p className="text-sm text-zinc-400">Please wait</p>
                    </div>
                )}

                {/* Waiting overlay */}
                {phase === "waiting" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-black/60 backdrop-blur-sm">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                            <DoorIcon className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-amber-400" />
                        </div>
                        <p className="text-lg font-bold text-white">Waiting for opponent...</p>
                        <p className="text-sm text-zinc-400">Game will start when both players connect</p>
                    </div>
                )}

                {/* Countdown overlay */}
                {phase === "countdown" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm">
                        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-zinc-400">
                            Get Ready
                        </p>
                        <span
                            key={countdownValue}
                            className="animate-ping-once text-8xl font-black tabular-nums"
                            style={{
                                color: myColor,
                                textShadow: `0 0 40px ${hexToRgba(myColor, 0.6)}, 0 0 80px ${hexToRgba(myColor, 0.3)}`,
                            }}
                        >
                            {countdownValue}
                        </span>
                    </div>
                )}

                {/* Opponent disconnected overlay */}
                {phase === "opponent_disconnected" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-black/60 backdrop-blur-sm">
                        <WifiOffIcon className="h-12 w-12 text-amber-400" />
                        <p className="text-lg font-bold text-white">{opponentName} Disconnected</p>
                        <p className="text-sm text-zinc-400">
                            Waiting for reconnection... ({opponentDisconnectTimer}s)
                        </p>
                        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                                style={{ width: `${(opponentDisconnectTimer / 30) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Controls hint */}
            <div className="flex w-full max-w-[800px] items-center justify-between">
                <div className="flex items-center gap-6 text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                        <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">W</kbd>
                        <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">S</kbd>
                        <span>or</span>
                        <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">&uarr;</kbd>
                        <kbd className="rounded border border-white/10 bg-surface-lighter px-1.5 py-0.5 font-mono text-[10px]">&darr;</kbd>
                        <span style={{ color: myColor }}>Move</span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        // Mark as game_over BEFORE closing the socket so that
                        // ws.onclose does not flash the Connection Error screen.
                        setPhaseSync("game_over");
                        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                            wsRef.current.send(JSON.stringify({ type: "leave" }));
                            wsRef.current.close();
                        }
                        router.push("/dashboard/play");
                    }}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/20"
                >
                    Leave Match
                </button>
            </div>
        </div>
    );
}

/* ──────────────────────── Page ──────────────────────── */

function RoomGamePageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");
    const [paddleColor, setPaddleColor] = useState(COLORS.p1);

    useEffect(() => {
        getMyProfile()
            .then((res) => {
                if (res?.data?.paddleColor) setPaddleColor(res.data.paddleColor);
            })
            .catch(() => { });
    }, []);

    if (!roomId) {
        return <ErrorScreen message="No room ID provided. Please start a match from the Play page." />;
    }

    return (
        <div className="relative">
            <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[150px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-accent/3 blur-[120px]" />
            <div className="relative z-10">
                <RoomGameScreen
                    key={roomId}
                    roomId={roomId}
                    paddleColor={paddleColor}
                />
            </div>
        </div>
    );
}

export default function RoomGamePage() {
    return (
        <Suspense fallback={
            <div className="relative">
                <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[150px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-accent/3 blur-[120px]" />
                <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 p-4">
                    <div className="flex w-full max-w-[800px] items-center justify-center px-2">
                        <span className="flex items-center gap-1.5 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-3 py-1 text-xs text-zinc-400">
                            <div className="h-3 w-3 rounded-full border border-zinc-500/30 border-t-zinc-300 animate-spin" />
                            Loading...
                        </span>
                    </div>
                    <div className="relative w-full max-w-[800px]">
                        <div
                            className="w-full rounded-xl border border-white/10 bg-[#08080c]"
                            style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
                        />
                    </div>
                </div>
            </div>
        }>
            <RoomGamePageInner />
        </Suspense>
    );
}
