import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ft_transcendence",
  description: "Learn how ft_transcendence collects, uses, and protects your personal information.",
};

/* ──────────────────────── Section Component ──────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
        {children}
      </div>
    </section>
  );
}

/* ──────────────────────── Page ──────────────────────── */

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/8 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full bg-neon-cyan/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-neon-cyan"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/5 bg-surface-light p-6 shadow-[0_0_30px_rgba(139,92,246,0.06)] sm:p-10">
          {/* Header */}
          <div className="mb-10 border-b border-white/5 pb-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Privacy <span className="text-accent neon-text-purple">Policy</span>
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Last updated: February 11, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Section title="1. Introduction">
              <p>
                Welcome to ft_transcendence (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you use our multiplayer game
                platform. Please read this policy carefully.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p>We collect the following types of information:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-zinc-300">Account Information:</strong> When you register, we collect your
                  username, email address, and password (stored securely using hashing).
                </li>
                <li>
                  <strong className="text-zinc-300">Profile Data:</strong> Avatar, display name, biography, and other
                  profile information you choose to provide.
                </li>
                <li>
                  <strong className="text-zinc-300">OAuth Data:</strong> If you sign in via GitHub or another OAuth provider,
                  we receive your public profile information from that provider.
                </li>
                <li>
                  <strong className="text-zinc-300">Game Data:</strong> Match history, scores, rankings, statistics, and
                  gameplay interactions.
                </li>
                <li>
                  <strong className="text-zinc-300">Chat Messages:</strong> Direct and group chat messages sent through the
                  platform.
                </li>
                <li>
                  <strong className="text-zinc-300">Usage Data:</strong> IP address, browser type, device information, pages
                  visited, and timestamps of access.
                </li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>We use the collected information to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide, operate, and maintain the platform.</li>
                <li>Create and manage your account.</li>
                <li>Enable matchmaking, leaderboards, and social features.</li>
                <li>Facilitate real-time chat and notifications.</li>
                <li>Monitor and analyze usage for performance improvements.</li>
                <li>Detect, prevent, and address security issues or abuse.</li>
                <li>Communicate important updates about the platform.</li>
              </ul>
            </Section>

            <Section title="4. Data Storage & Security">
              <p>
                Your data is stored on secure servers. We implement industry-standard security measures
                including HTTPS encryption, hashed passwords, two-factor authentication (2FA) support,
                and rate-limited APIs to protect your information.
              </p>
              <p>
                While we strive to use commercially acceptable means to protect your personal data, no
                method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </Section>

            <Section title="5. Data Sharing">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share
                data only in the following circumstances:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-zinc-300">Public Profile:</strong> Your username, avatar, and game statistics are
                  visible to other users.
                </li>
                <li>
                  <strong className="text-zinc-300">Legal Requirements:</strong> When required by law, regulation, or legal
                  process.
                </li>
                <li>
                  <strong className="text-zinc-300">Platform Safety:</strong> To protect the rights, property, or safety of
                  our users and the platform.
                </li>
              </ul>
            </Section>

            <Section title="6. Cookies & Sessions">
              <p>
                We use session cookies to keep you authenticated while using the platform. These cookies
                are essential for the functioning of the service and are not used for tracking or
                advertising purposes.
              </p>
            </Section>

            <Section title="7. Your Rights">
              <p>You have the right to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Access and review your personal data.</li>
                <li>Update or correct inaccurate information via your profile settings.</li>
                <li>Request deletion of your account and associated data.</li>
                <li>Withdraw consent for optional data processing at any time.</li>
              </ul>
            </Section>

            <Section title="8. Third-Party Services">
              <p>
                Our platform may integrate with third-party services (e.g., GitHub for OAuth). These
                services have their own privacy policies and we encourage you to review them. We are not
                responsible for the practices of these external services.
              </p>
            </Section>

            <Section title="9. Children&apos;s Privacy">
              <p>
                Our platform is not intended for children under the age of 13. We do not knowingly
                collect personal information from children. If we discover that a child under 13 has
                provided us with personal information, we will promptly delete it.
              </p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                updating the &quot;Last updated&quot; date at the top of this page. Continued use of the platform
                after changes constitutes acceptance of the updated policy.
              </p>
            </Section>

            <Section title="11. Contact Us">
              <p>
                If you have any questions about this Privacy Policy, please reach out to us through our
                platform or open an issue on our project repository.
              </p>
            </Section>
          </div>

          {/* Footer link */}
          <div className="mt-10 border-t border-white/5 pt-6 text-center">
            <Link
              href="/terms"
              className="text-sm font-medium text-accent transition-colors hover:text-accent-light"
            >
              View Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
