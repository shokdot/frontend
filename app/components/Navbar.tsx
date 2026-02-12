"use client";

import { useState, useEffect } from "react";

const navLinks = [
	{ label: "Features", href: "#features" },
	{ label: "How It Works", href: "#how-it-works" },
	{ label: "Community", href: "#community" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
				? "border-b border-neon-cyan/10 bg-surface/80 shadow-[0_4px_30px_rgba(0,240,255,0.05)] backdrop-blur-xl"
				: "bg-transparent"
				}`}
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<a href="#" className="group flex items-center gap-2.5">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-shadow group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]">
						<svg
							className="h-5 w-5 text-white"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
					</div>
					<span className="text-lg font-bold text-white transition-all group-hover:neon-text-purple">
						iPong
					</span>
				</a>

				{/* Desktop nav */}
				<div className="hidden items-center gap-8 md:flex">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="relative text-sm font-medium text-zinc-400 transition-all hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
						>
							{link.label}
						</a>
					))}
				</div>

				{/* Desktop CTA */}
				<div className="hidden items-center gap-3 md:flex">
					<a
						href="/login"
						className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-neon-cyan/30 hover:text-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
					>
						Log in
					</a>
					<a
						href="/register"
						className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
					>
						Sign up
					</a>
				</div>

				{/* Mobile hamburger */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:text-neon-cyan md:hidden"
					aria-label="Toggle menu"
				>
					{isOpen ? (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					) : (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					)}
				</button>
			</div>

			{/* Mobile menu */}
			<div
				className={`overflow-hidden transition-all duration-300 md:hidden ${isOpen ? "max-h-80" : "max-h-0"
					}`}
			>
				<div className="space-y-1 border-t border-neon-cyan/10 bg-surface/95 px-4 py-4 backdrop-blur-xl">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={() => setIsOpen(false)}
							className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-neon-cyan/5 hover:text-neon-cyan"
						>
							{link.label}
						</a>
					))}
					<div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
						<a
							href="/login"
							className="rounded-lg border border-white/10 px-3 py-2.5 text-center text-sm font-medium text-zinc-300 transition-all hover:border-neon-cyan/30 hover:text-neon-cyan"
						>
							Log in
						</a>
						<a
							href="/register"
							className="rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
						>
							Sign up
						</a>
					</div>
				</div>
			</div>
		</nav>
	);
}
