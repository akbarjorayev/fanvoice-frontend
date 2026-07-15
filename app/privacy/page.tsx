import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { SUPPORT_TELEGRAM_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy — FanVoice',
  description: 'How FanVoice collects, uses, and protects your personal information.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
      <div className="space-y-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">Legal</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Privacy Policy</h1>
            <p className="text-sm text-gray-400">Last updated: July 4, 2026</p>
          </div>

          <Section title="1. Who We Are">
            <p>
              FanVoice ("we", "our", "us") is a platform that lets fans send paid messages to their favorite
              creators. We operate at <span className="text-violet-500">fanvoice.akbarjon.uz</span>. This policy
              explains how we handle your personal data.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p>
              <strong className="text-gray-800 dark:text-gray-200">Account data:</strong> When you sign in with
              Google, we receive your name, email address, and profile picture from Google OAuth. We store this
              to create and identify your account.
            </p>
            <p>
              <strong className="text-gray-800 dark:text-gray-200">Message data:</strong> The title and content
              of messages you send or receive, along with the associated price and timestamps.
            </p>
            <p>
              <strong className="text-gray-800 dark:text-gray-200">Payment data:</strong> Transaction records
              tied to messages (amounts, status). We do not store raw card numbers — payments are processed by
              our payment provider.
            </p>
            <p>
              <strong className="text-gray-800 dark:text-gray-200">Usage data:</strong> Basic server logs
              (IP address, browser type, pages visited) for security and debugging purposes.
            </p>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We use your data solely to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Provide the FanVoice service (account management, messaging, payments)</li>
              <li>Send transactional notifications about your messages and payouts</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Improve the platform based on aggregated, anonymized usage patterns</li>
            </ul>
            <p>We do not sell your personal data to third parties. Ever.</p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We rely on the following trusted services to operate:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <strong className="text-gray-800 dark:text-gray-200">Google OAuth</strong> — authentication
                only; governed by Google's Privacy Policy
              </li>
              <li>
                <strong className="text-gray-800 dark:text-gray-200">Supabase</strong> — database and file
                storage hosted on AWS (ap-southeast-2)
              </li>
              <li>
                <strong className="text-gray-800 dark:text-gray-200">Payment processor</strong> — handles
                card transactions under PCI-DSS compliance
              </li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We keep your account data for as long as your account is active. Message records are retained
              for 2 years for dispute resolution purposes, then permanently deleted. You may request earlier
              deletion by contacting us.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>You may at any time:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Request a copy of the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
            </ul>
            <p>
              To exercise these rights, contact us on Telegram:{' '}
              <a
                href={SUPPORT_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:underline"
              >
                @fanvoice_support_bot
              </a>
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              We use a single HTTP-only session cookie to keep you logged in. We do not use advertising or
              tracking cookies. No cookie banners needed.
            </p>
          </Section>

          <Section title="8. Security">
            <p>
              All data is transmitted over HTTPS. Session tokens are stored in HTTP-only cookies to protect
              against XSS. Passwords are never stored — we use Google OAuth exclusively.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              If we make material changes, we'll update the "Last updated" date at the top of this page. For
              significant changes, we'll notify you through the platform.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions about this policy? Reach us at{' '}
              <a
                href={SUPPORT_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:underline"
              >
                @fanvoice_support_bot
              </a>{' '}
              on Telegram.
            </p>
          </Section>

          <div className="pt-6 border-t border-gray-100 dark:border-white/[0.06]">
            <Link
              href="/terms"
              className="text-sm text-violet-500 hover:underline"
            >
              Read our Terms of Service →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
