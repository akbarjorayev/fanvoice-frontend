import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShield,
  faClock,
  faArrowsRotate,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FadeIn } from './FadeIn'

const trustPoints = [
  {
    icon: faShield,
    label: 'Escrow protection',
    detail: 'Payment held securely until delivery is confirmed',
  },
  {
    icon: faClock,
    label: '30-day read window',
    detail: 'Creators have 30 days to read your message',
  },
  {
    icon: faArrowsRotate,
    label: 'Automatic refunds',
    detail: 'Returned to your original payment method instantly',
  },
]

export function Guarantee() {
  return (
    <section className="relative py-28 bg-white dark:bg-gray-950 px-6 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: copy ── */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-violet-100 dark:border-violet-800/50">
              <FontAwesomeIcon icon={faShield} style={{ width: 11, height: 11 }} />
              The FanVoice Guarantee
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-5 leading-tight">
              No read,{' '}
              <span className="relative inline-block">
                no charge.
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7c3aed, #d946ef)' }}
                />
              </span>
              <br />
              Simple as that.
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8">
              We hold your payment in escrow. The creator doesn&apos;t receive a single cent
              until they&apos;ve read your message aloud. If they don&apos;t deliver within 30 days,
              you get a full automatic refund — no questions asked.
            </p>

            <div className="flex flex-col gap-4">
              {trustPoints.map((point) => (
                <div key={point.label} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center shadow-lg shadow-violet-600/20">
                    <FontAwesomeIcon icon={point.icon} style={{ width: 13, height: 13 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{point.label}</p>
                    <p className="text-gray-400 text-sm">{point.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ── Right: flow card ── */}
          <FadeIn delay={150}>
            <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-7 shadow-sm dark:shadow-2xl border border-gray-200 dark:border-white/[0.06] relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 100%)' }}
              />

              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase mb-6 relative">
                How money flows
              </p>

              <div className="space-y-1 relative">
                {[
                  { label: 'Fan pays', sub: 'Held in escrow' },
                  { label: 'Creator reads aloud', sub: 'Within 30 days' },
                  { label: 'Creator receives payout', sub: 'Released automatically' },
                ].map((item, i) => (
                  <div key={item.label}>
                    <div className="flex items-center gap-4 py-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} style={{ width: 10, height: 10 }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.label}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    {i < 2 && (
                      <div className="ml-4 w-px h-4 bg-gradient-to-b from-gray-200 dark:from-white/10 to-transparent" />
                    )}
                  </div>
                ))}

                <div className="border-t border-dashed border-gray-200 dark:border-white/[0.08] my-3" />

                {/* Failure path */}
                <div className="flex items-center gap-4 py-2">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center">
                    <FontAwesomeIcon icon={faXmark} style={{ width: 10, height: 10 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Creator doesn&apos;t read</p>
                    <p className="text-red-500 dark:text-red-400 text-xs font-semibold mt-0.5">Full refund — automatic</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
