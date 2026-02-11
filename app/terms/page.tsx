import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ft_transcendence",
  description: "Read the terms and conditions for using the ft_transcendence multiplayer game platform.",
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

export default function TermsOfServicePage() {
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
              Terms of <span className="text-neon-cyan neon-text-cyan">Service</span>
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Last updated: February 11, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using ft_transcendence (&quot;the Platform&quot;), you agree to be bound by these
                Terms of Service. If you do not agree with any part of these terms, you must not use
                the Platform.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>
                ft_transcendence is a real-time multiplayer game platform that provides online gaming,
                chat functionality, leaderboards, matchmaking, and social features. The Platform is
                developed as part of the 42 school curriculum.
              </p>
            </Section>

            <Section title="3. User Accounts">
              <p>To use the Platform, you must:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Register an account with a valid email address or via an OAuth provider.</li>
                <li>Provide accurate and complete information during registration.</li>
                <li>Maintain the security and confidentiality of your account credentials.</li>
                <li>Be at least 13 years of age.</li>
              </ul>
              <p>
                You are responsible for all activity that occurs under your account. Notify us
                immediately if you suspect unauthorized access.
              </p>
            </Section>

            <Section title="4. Acceptable Use">
              <p>When using the Platform, you agree not to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Use cheats, exploits, bots, or any unauthorized automated tools.</li>
                <li>Harass, bully, threaten, or intimidate other users.</li>
                <li>Send spam, unsolicited messages, or abusive content through the chat system.</li>
                <li>Impersonate other users or misrepresent your identity.</li>
                <li>Attempt to gain unauthorized access to the Platform or its infrastructure.</li>
                <li>Interfere with or disrupt the Platform&apos;s functionality or servers.</li>
                <li>Share, distribute, or upload any illegal, harmful, or offensive content.</li>
                <li>Exploit bugs or vulnerabilities instead of reporting them.</li>
              </ul>
            </Section>

            <Section title="5. User Content">
              <p>
                You retain ownership of the content you submit (e.g., profile information, chat
                messages). By submitting content, you grant us a non-exclusive, worldwide, royalty-free
                license to use, display, and distribute that content within the Platform as necessary
                for its operation.
              </p>
              <p>
                We reserve the right to remove content that violates these terms or is deemed
                inappropriate.
              </p>
            </Section>

            <Section title="6. Fair Play">
              <p>
                We are committed to maintaining a fair and enjoyable gaming environment. Players found
                to be cheating, exploiting, or manipulating matches may face:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Temporary or permanent suspension of their account.</li>
                <li>Removal from leaderboards and reset of game statistics.</li>
                <li>Restrictions on matchmaking and social features.</li>
              </ul>
            </Section>

            <Section title="7. Intellectual Property">
              <p>
                The Platform, including its design, code, graphics, and branding, is the intellectual
                property of the ft_transcendence team. You may not copy, modify, distribute, or create
                derivative works without explicit permission, except as allowed by the project&apos;s
                open-source license.
              </p>
            </Section>

            <Section title="8. Availability & Modifications">
              <p>
                We strive to keep the Platform available at all times but do not guarantee uninterrupted
                access. We reserve the right to:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Modify, suspend, or discontinue any feature at any time.</li>
                <li>Perform maintenance that may temporarily affect availability.</li>
                <li>Update these terms — continued use after changes indicates acceptance.</li>
              </ul>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
                whether express or implied. To the fullest extent permitted by law:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>We are not liable for any indirect, incidental, or consequential damages.</li>
                <li>We are not responsible for data loss resulting from factors beyond our control.</li>
                <li>
                  We do not guarantee the accuracy of leaderboard data, match results, or statistics
                  in the event of technical issues.
                </li>
              </ul>
            </Section>

            <Section title="10. Account Termination">
              <p>
                We reserve the right to suspend or terminate your account at our discretion if you
                violate these terms. You may also request deletion of your account at any time through
                your profile settings.
              </p>
              <p>
                Upon termination, your right to use the Platform ceases immediately. Data associated
                with your account may be deleted in accordance with our Privacy Policy.
              </p>
            </Section>

            <Section title="11. Governing Law">
              <p>
                These Terms of Service shall be governed by and construed in accordance with applicable
                laws. Any disputes arising from the use of the Platform will be resolved through good
                faith negotiation.
              </p>
            </Section>

            <Section title="12. Contact Us">
              <p>
                If you have any questions about these Terms of Service, please reach out to us through
                our platform or open an issue on our project repository.
              </p>
            </Section>
          </div>

          {/* Footer link */}
          <div className="mt-10 border-t border-white/5 pt-6 text-center">
            <Link
              href="/privacy"
              className="text-sm font-medium text-accent transition-colors hover:text-accent-light"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
