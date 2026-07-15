import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { SUPPORT_TELEGRAM_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service — FanVoice',
  description: 'Rules and conditions for using the FanVoice platform.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
      <div className="space-y-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">Legal</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Terms of Service</h1>
            <p className="text-sm text-gray-400">Last updated: July 4, 2026</p>
          </div>

          <Section title="1. Acceptance">
            <p>
              By creating an account or using FanVoice ("the platform", "we", "us"), you agree to these
              Terms of Service. If you do not agree, do not use the platform.
            </p>
          </Section>

          <Section title="2. What FanVoice Is">
            <p>
              FanVoice is a paid messaging platform. Fans pay to send a message to a creator. The creator
              records themselves reading that message aloud. The creator's payout is released only after the
              recording is delivered — this is our core guarantee.
            </p>
          </Section>

          <Section title="3. Eligibility">
            <p>
              You must be at least 13 years old to use FanVoice. By using the platform, you confirm you meet
              this requirement. Creators who monetize their profile must be at least 18 years old.
            </p>
          </Section>

          <Section title="4. Accounts">
            <p>
              You sign in exclusively via Google OAuth — we do not manage passwords. You are responsible for
              maintaining access to your Google account. One person, one account. Do not share accounts.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms, engage in fraud,
              or abuse other users.
            </p>
          </Section>

          <Section title="5. Fans — Sending Messages">
            <p>
              When you send a message, your payment is held until the creator delivers their recording. The
              minimum message price is 10,000 so'm, or the creator's set minimum price if higher.
            </p>
            <p>
              Once a message is sent and payment is processed, it cannot be cancelled unless the creator fails
              to respond within the allowed time window, in which case a full refund is issued automatically.
            </p>
            <p>
              You may not send messages that contain harassment, threats, hate speech, explicit sexual content,
              illegal requests, or any content that violates applicable law.
            </p>
          </Section>

          <Section title="6. Creators — Receiving Messages">
            <p>
              As a creator, you choose your minimum price per message. You are not obligated to accept every
              message, but you must respond to paid messages within a reasonable time (currently 7 days) or
              the fan receives a full refund and you forfeit the payout.
            </p>
            <p>
              You may decline a message without penalty before recording. Once you record and submit, the
              payout is processed to your account.
            </p>
            <p>
              Your recorded response must be an authentic reading of the fan's message. You may not record
              pre-made generic responses unrelated to the message content.
            </p>
          </Section>

          <Section title="7. Payments and Fees">
            <p>
              All payments are processed in Uzbekistani so'm (UZS). FanVoice deducts a platform fee from each
              transaction before releasing the creator's payout. The current fee percentage is displayed on
              your creator dashboard.
            </p>
            <p>
              Payouts are processed to your linked account. You are responsible for any applicable taxes on
              your creator income.
            </p>
          </Section>

          <Section title="8. Prohibited Content">
            <p>You must not use FanVoice to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Harass, threaten, or harm other users</li>
              <li>Send or request sexually explicit content involving minors</li>
              <li>Impersonate another person or entity</li>
              <li>Engage in money laundering or financial fraud</li>
              <li>Spam or send bulk unsolicited messages</li>
              <li>Attempt to circumvent platform fees or payment systems</li>
              <li>Upload malware, viruses, or malicious code</li>
            </ul>
            <p>
              Violation of these rules may result in immediate account termination and, where applicable,
              reporting to law enforcement.
            </p>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              Fans retain ownership of the messages they write. Creators retain ownership of their recorded
              responses. By using the platform, you grant FanVoice a limited, non-exclusive license to store
              and transmit this content as necessary to provide the service.
            </p>
            <p>
              FanVoice's brand, logo, and platform code are our intellectual property. Do not reproduce or
              use them without written permission.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              FanVoice is provided "as is." We do not guarantee uninterrupted availability. To the maximum
              extent permitted by law, we are not liable for indirect, incidental, or consequential damages
              arising from your use of the platform.
            </p>
            <p>
              Our total liability for any claim is limited to the amount you paid to FanVoice in the 30 days
              preceding the claim.
            </p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>
              We may update these terms from time to time. Continued use of the platform after changes are
              posted constitutes acceptance of the new terms. We'll notify you of significant changes via the
              platform.
            </p>
          </Section>

          <Section title="12. Governing Law">
            <p>
              These terms are governed by the laws of the Republic of Uzbekistan. Any disputes shall be
              resolved in the competent courts of Uzbekistan.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              Questions or concerns? Reach us at{' '}
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
              href="/privacy"
              className="text-sm text-violet-500 hover:underline"
            >
              Read our Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
