import Navbar from "./components/Navbar";

/* ──────────────────────── SVG Icons ──────────────────────── */

function GamepadIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="6" width="20" height="12" rx="3" />
			<path d="M8 6v12" />
			<path d="M16 6v12" />
			<circle cx="12" cy="12" r="1" fill="currentColor" />
			<path d="M6 10v4" />
			<path d="M4 12h4" />
			<circle cx="17" cy="10" r="0.5" fill="currentColor" />
			<circle cx="19" cy="12" r="0.5" fill="currentColor" />
		</svg>
	);
}

function ChatIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
			<path d="M8 10h.01M12 10h.01M16 10h.01" />
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

function ChartIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M18 20V10M12 20V4M6 20v-6" />
		</svg>
	);
}

function ShieldIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<path d="M9 12l2 2 4-4" />
		</svg>
	);
}

function UsersIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
		</svg>
	);
}

function ArrowRightIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12h14M12 5l7 7-7 7" />
		</svg>
	);
}

/* ──────────────────────── Feature Card ──────────────────────── */

function FeatureCard({
	icon,
	title,
	description,
	glowColor = "cyan",
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	glowColor?: "cyan" | "purple";
}) {
	const borderHover =
		glowColor === "cyan"
			? "hover:border-neon-cyan/30 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)]"
			: "hover:border-accent/30 hover:shadow-[0_0_25px_rgba(139,92,246,0.08)]";

	const iconBg =
		glowColor === "cyan"
			? "bg-neon-cyan/10 text-neon-cyan group-hover:bg-neon-cyan/15 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
			: "bg-accent/10 text-accent group-hover:bg-accent/15 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]";

	return (
		<div
			className={`group rounded-2xl border border-white/5 bg-surface-light p-6 transition-all duration-300 hover:bg-surface-lighter sm:p-8 ${borderHover}`}
		>
			<div
				className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${iconBg}`}
			>
				{icon}
			</div>
			<h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
			<p className="text-sm leading-relaxed text-zinc-400">{description}</p>
		</div>
	);
}

/* ──────────────────────── Step Card ──────────────────────── */

function StepCard({
	step,
	title,
	description,
}: {
	step: string;
	title: string;
	description: string;
}) {
	return (
		<div className="relative flex flex-col items-center text-center">
			<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-lg font-bold text-neon-cyan animate-neon-pulse">
				{step}
			</div>
			<h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
			<p className="text-sm leading-relaxed text-zinc-400">{description}</p>
		</div>
	);
}

/* ──────────────────────── Stat Item ──────────────────────── */

function StatItem({ value, label }: { value: string; label: string }) {
	return (
		<div className="text-center">
			<div className="text-2xl font-bold text-neon-cyan neon-text-cyan sm:text-4xl">
				{value}
			</div>
			<div className="mt-1 text-xs text-zinc-400 sm:text-sm">{label}</div>
		</div>
	);
}

/* ──────────────────────── Pong Animation ──────────────────── */

function PongVisual() {
	return (
		<div className="relative mx-auto aspect-[4/3] w-full max-w-lg cursor-default select-none overflow-hidden rounded-2xl border border-neon-cyan/15 bg-surface-light neon-box-cyan">
			{/* Scanline overlay */}
			<div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.015)_2px,rgba(0,240,255,0.015)_4px)]" />

			{/* Center line */}
			<div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-neon-cyan/15" />

			{/* Left paddle */}
			<div className="absolute left-[6%] top-1/2 h-20 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_rgba(139,92,246,0.6),0_0_30px_rgba(139,92,246,0.3)] animate-float" />

			{/* Right paddle */}
			<div
				className="absolute right-[6%] top-1/3 h-20 w-2 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.6),0_0_30px_rgba(0,240,255,0.3)]"
				style={{ animation: "float 3s ease-in-out infinite 1.5s" }}
			/>

			{/* Ball */}
			<div className="absolute h-3 w-3 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_20px_rgba(0,240,255,0.6),0_0_40px_rgba(0,240,255,0.3)] animate-ball" />

			{/* Score */}
			<div className="absolute top-4 left-1/2 flex -translate-x-1/2 gap-8 text-2xl font-bold">
				<span className="text-accent/40 neon-text-purple">3</span>
				<span className="text-neon-cyan/40 neon-text-cyan">5</span>
			</div>

			{/* Bottom glow gradient */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neon-cyan/5 to-transparent" />
		</div>
	);
}

/* ──────────────────────── Page ──────────────────────── */

export default function Home() {
	return (
		<>
			<Navbar />

			{/* ── Hero ── */}
			<section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pt-20 sm:px-6 lg:px-8">
				{/* Background glows */}
				<div className="pointer-events-none absolute top-[-200px] left-1/2 h-[min(700px,100vw)] w-[min(700px,100vw)] -translate-x-1/2 rounded-full bg-accent/8 blur-[150px]" />
				<div className="pointer-events-none absolute top-[100px] left-[20%] h-[min(400px,80vw)] w-[min(400px,80vw)] rounded-full bg-neon-cyan/5 blur-[120px]" />

				{/* Grid overlay */}
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

				<div className="relative z-10 mx-auto max-w-4xl text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 px-4 py-1.5 text-sm text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)] backdrop-blur-sm">
						<span className="h-2 w-2 animate-pulse rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
						Now in development
					</div>

					<h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
						Play. Compete.{" "}
						<span className="bg-gradient-to-r from-neon-cyan via-accent-light to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
							Transcend.
						</span>
					</h1>

					<p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
						A real-time multiplayer game platform where you challenge friends,
						climb leaderboards, and prove your skills in head-to-head matches.
					</p>

					<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
						<a
							href="/register"
							className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] sm:w-auto"
						>
							Get Started
							<ArrowRightIcon className="h-4 w-4" />
						</a>
						<a
							href="#features"
							className="inline-flex w-full items-center justify-center rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 px-6 py-3.5 text-sm font-semibold text-neon-cyan transition-all hover:border-neon-cyan/40 hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] sm:w-auto"
						>
							Learn More
						</a>
					</div>
				</div>

				{/* Pong visual */}
				<div className="relative z-10 mx-auto mt-16 w-full max-w-2xl px-4 sm:mt-20">
					<PongVisual />
				</div>

				{/* Scroll indicator — hidden on small screens to avoid overlapping the Pong visual */}
				<div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
					<div className="flex h-8 w-5 items-start justify-center rounded-full border border-neon-cyan/25 p-1">
						<div className="h-2 w-1 animate-bounce rounded-full bg-neon-cyan/60" />
					</div>
				</div>
			</section>

			{/* ── Features ── */}
			<section id="features" className="relative overflow-hidden py-24 sm:py-32">
				<div className="pointer-events-none absolute right-0 top-0 h-[min(500px,100vw)] w-[min(500px,100vw)] rounded-full bg-accent/5 blur-[150px]" />

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold text-white sm:text-4xl">
							Everything you need to{" "}
							<span className="text-neon-cyan neon-text-cyan">compete</span>
						</h2>
						<p className="mt-4 text-base text-zinc-400 sm:text-lg">
							Built with a microservices architecture for speed, reliability, and
							real-time gameplay.
						</p>
					</div>

					<div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
						<FeatureCard
							icon={<GamepadIcon className="h-6 w-6" />}
							title="Real-Time Games"
							description="Play multiplayer games with low latency. Smooth, responsive gameplay powered by WebSockets."
							glowColor="cyan"
						/>
						<FeatureCard
							icon={<ChatIcon className="h-6 w-6" />}
							title="Live Chat"
							description="Message friends, create group chats, and challenge players directly from the conversation."
							glowColor="purple"
						/>
						<FeatureCard
							icon={<BellIcon className="h-6 w-6" />}
							title="Smart Notifications"
							description="Stay in the loop with real-time alerts for friend requests, game invites, and match results."
							glowColor="cyan"
						/>
						<FeatureCard
							icon={<ChartIcon className="h-6 w-6" />}
							title="Stats & Leaderboards"
							description="Track your wins, losses, ranking, and progression. Climb the global leaderboard."
							glowColor="purple"
						/>
						<FeatureCard
							icon={<ShieldIcon className="h-6 w-6" />}
							title="Secure by Design"
							description="HTTPS everywhere, 2FA support, OAuth integration, and rate-limited APIs."
							glowColor="cyan"
						/>
						<FeatureCard
							icon={<UsersIcon className="h-6 w-6" />}
							title="Social Features"
							description="Build your profile, add friends, see who's online, and spectate ongoing matches."
							glowColor="purple"
						/>
					</div>
				</div>
			</section>

			{/* ── How It Works ── */}
			<section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32">
				<div className="pointer-events-none absolute left-0 bottom-0 h-[min(400px,80vw)] w-[min(400px,80vw)] rounded-full bg-neon-cyan/5 blur-[120px]" />

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold text-white sm:text-4xl">
							Up and running in{" "}
							<span className="text-neon-cyan neon-text-cyan">minutes</span>
						</h2>
						<p className="mt-4 text-base text-zinc-400 sm:text-lg">
							From sign-up to your first match — it&apos;s that simple.
						</p>
					</div>

					{/* Connecting line (desktop) */}
					<div className="relative mt-16">
						<div className="pointer-events-none absolute top-7 left-[12.5%] right-[12.5%] hidden h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent lg:block" />

						<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
							<StepCard
								step="1"
								title="Create Account"
								description="Sign up with email or use OAuth. Set up your profile and avatar."
							/>
							<StepCard
								step="2"
								title="Find a Match"
								description="Join matchmaking or challenge a friend to a game."
							/>
							<StepCard
								step="3"
								title="Play & Compete"
								description="Enjoy smooth real-time gameplay with instant feedback."
							/>
							<StepCard
								step="4"
								title="Climb the Ranks"
								description="Win matches, earn achievements, and rise on the leaderboard."
							/>
						</div>
					</div>
				</div>
			</section>

			{/* ── Community / Stats ── */}
			<section id="community" className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="overflow-hidden rounded-3xl border border-neon-cyan/10 bg-surface-light neon-box-cyan">
						<div className="px-6 py-16 sm:px-12 sm:py-20 lg:px-20">
							<div className="mx-auto max-w-2xl text-center">
								<h2 className="text-3xl font-bold text-white sm:text-4xl">
									Built for{" "}
									<span className="text-neon-cyan neon-text-cyan">players</span>
									, by players
								</h2>
								<p className="mt-4 text-base text-zinc-400 sm:text-lg">
									A growing community of competitive gamers pushing each other to
									be better.
								</p>
							</div>

							<div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-4">
								<StatItem value="7" label="Microservices" />
								<StatItem value="6+" label="API Endpoints" />
								<StatItem value="24/7" label="Monitoring" />
								<StatItem value="100%" label="Open Source" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── CTA ── */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-surface-lighter via-accent/5 to-surface-lighter px-6 py-16 text-center neon-box-purple sm:px-12 sm:py-20">
						{/* Decorative neon orbs */}
						<div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/15 blur-[80px] sm:-top-32 sm:-right-32 sm:h-72 sm:w-72" />
						<div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-neon-cyan/10 blur-[80px] sm:-bottom-32 sm:-left-32 sm:h-72 sm:w-72" />

						{/* Grid overlay */}
						<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

						<div className="relative z-10">
							<h2 className="text-3xl font-bold text-white sm:text-4xl">
								Ready to{" "}
								<span className="text-accent neon-text-purple">play</span>?
							</h2>
							<p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
								Create your account, jump into a match, and see where you land on
								the leaderboard.
							</p>
							<div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
								<a
									href="/register"
									className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] sm:w-auto"
								>
									Create Account
									<ArrowRightIcon className="h-4 w-4" />
								</a>
								<a
									href="/login"
									className="inline-flex w-full items-center justify-center rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 px-6 py-3.5 text-sm font-semibold text-neon-cyan transition-all hover:border-neon-cyan/40 hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] sm:w-auto"
								>
									Log in
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── Footer ── */}
			<footer className="border-t border-neon-cyan/5 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
						{/* Brand */}
						<div className="sm:col-span-2 lg:col-span-1">
							<div className="flex items-center gap-2">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-[0_0_12px_rgba(139,92,246,0.3)]">
									<svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
										<path d="M8 5v14l11-7z" />
									</svg>
								</div>
								<span className="text-base font-bold text-white">iPong</span>
							</div>
							<p className="mt-3 max-w-xs text-sm text-zinc-500">
								A 42 project — real-time multiplayer game platform built with
								modern web technologies.
							</p>
						</div>

						{/* Platform */}
						<div>
							<h4 className="text-sm font-semibold text-white">Platform</h4>
							<ul className="mt-3 space-y-2">
								<li>
									<a href="#features" className="text-sm text-zinc-500 transition-colors hover:text-neon-cyan">Features</a>
								</li>
								<li>
									<a href="#how-it-works" className="text-sm text-zinc-500 transition-colors hover:text-neon-cyan">How It Works</a>
								</li>
								<li>
									<a href="#community" className="text-sm text-zinc-500 transition-colors hover:text-neon-cyan">Community</a>
								</li>
							</ul>
						</div>

						{/* Account */}
						<div>
							<h4 className="text-sm font-semibold text-white">Account</h4>
							<ul className="mt-3 space-y-2">
								<li>
									<a href="/register" className="text-sm text-zinc-500 transition-colors hover:text-neon-cyan">Sign up</a>
								</li>
								<li>
									<a href="/login" className="text-sm text-zinc-500 transition-colors hover:text-neon-cyan">Log in</a>
								</li>
							</ul>
						</div>

						{/* Legal */}
						<div>
							<h4 className="text-sm font-semibold text-white">Legal</h4>
							<ul className="mt-3 space-y-2">
								<li>
									<a href="/privacy" className="text-sm text-zinc-500 transition-colors hover:text-neon-cyan">Privacy Policy</a>
								</li>
								<li>
									<a href="/terms" className="text-sm text-zinc-500 transition-colors hover:text-neon-cyan">Terms of Service</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-10 border-t border-white/5 pt-6 text-center text-sm text-zinc-600">
						&copy; {new Date().getFullYear()} ft_transcendence. All rights reserved.
					</div>
				</div>
			</footer>
		</>
	);
}
