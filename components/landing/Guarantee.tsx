import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShield,
  faClock,
  faArrowsRotate,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { FadeIn } from './FadeIn'
import { Tilt3D } from './Tilt3D'
import { CREATOR_SHARE_PCT, PLATFORM_FEE_PCT } from '@/lib/fees'

const trustPoints = [
  {
    icon: faShield,
    label: 'Escrow protection',
    detail: 'Payment held securely until delivery is confirmed',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: faClock,
    label: 'Creator reads aloud',
    detail: 'On stream, in a video, or a personal shoutout — verified by voice',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: faArrowsRotate,
    label: 'Instant payout on delivery',
    detail: `Creator receives ${CREATOR_SHARE_PCT}% the moment they deliver your message`,
    color: 'from-emerald-500 to-teal-600',
  },
]

export function Guarantee() {
  return (
    <section className="relative py-28 bg-white dark:bg-gray-950 px-6 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 60% at 10% 50%, rgba(139,92,246,0.05) 0%, transparent 60%)' }}
      />

      <div className="max-w-4xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: copy */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-violet-100 dark:border-violet-800/50">
              <FontAwesomeIcon icon={faShield} style={{ width: 11, height: 11 }} />
              The FanVoice Guarantee
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-5 leading-tight">
              No read,{' '}
              <span className="relative inline-block">
                no payout.
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7c3aed, #d946ef)' }}
                />
              </span>
              <br />
              Simple as that.
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-7">
              We hold your payment in escrow. The creator doesn&apos;t receive a single cent
              until they&apos;ve read your message aloud. Only after delivery does the
              payout go through — automatically.
            </p>

            {/* 90% split visualizer */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/[0.07] rounded-xl p-5 mb-8">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Where your money goes</p>
              <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center"
                  style={{ flex: CREATOR_SHARE_PCT }}
                />
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full" style={{ flex: PLATFORM_FEE_PCT }} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-violet-600 dark:text-violet-400">{CREATOR_SHARE_PCT}% → Creator</p>
                  <p className="text-xs text-gray-400">of what you pay</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500">{PLATFORM_FEE_PCT}% → Platform</p>
                  <p className="text-xs text-gray-400">that&apos;s all we take</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {trustPoints.map((point) => (
                <div key={point.label} className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${point.color} text-white flex items-center justify-center shadow-md`}>
                    <FontAwesomeIcon icon={point.icon} style={{ width: 13, height: 13 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{point.label}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">{point.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Right: flow card */}
          <FadeIn delay={150}>
            <Tilt3D className="overflow-hidden rounded-2xl">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-7 border border-gray-200 dark:border-white/[0.07] relative overflow-hidden shadow-sm">
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 100%)' }}
                />

                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase mb-2 relative">
                  How escrow works
                </p>
                <div className="h-px bg-gray-200 dark:bg-white/[0.06] mb-5" />

                <div className="space-y-1 relative">
                  {[
                    { label: 'Fan pays — held in escrow', sub: 'Money is locked until delivery', icon: faCheck, green: true },
                    { label: 'Creator reads aloud', sub: 'On stream, in a video, or a shoutout', icon: faCheck, green: true },
                    { label: `Creator receives ${CREATOR_SHARE_PCT}%`, sub: `Platform keeps ${PLATFORM_FEE_PCT}% — released instantly`, icon: faCheck, green: true },
                  ].map((item, i) => (
                    <div key={item.label}>
                      <div className="flex items-center gap-4 py-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <FontAwesomeIcon icon={item.icon} style={{ width: 10, height: 10 }} />
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

                </div>
              </div>
            </Tilt3D>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
