import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faMicrophone, faMessage } from '@fortawesome/free-solid-svg-icons'
import { FadeIn } from './FadeIn'
import { Tilt3D } from './Tilt3D'

function CTAParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i * 53 + 17) % 100
        const y = (i * 37 + 11) % 100
        const size = i % 4 === 0 ? 6 : 4
        const duration = 4 + (i % 3)
        const delay = (i % 5) * 0.9
        return (
          <div
            key={i}
            className="absolute rounded-full bg-violet-400/10 dark:bg-violet-400/8"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              animationName: 'float-particle',
              animationDuration: `${duration}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export function CTA() {
  return (
    <section className="relative py-32 bg-white dark:bg-gray-950 px-6 overflow-hidden">
      <CTAParticles />

      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

      {/* Strong ambient glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 70% 70% at 15% 50%, rgba(139,92,246,0.1) 0%, transparent 60%)' }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 70% 70% at 85% 50%, rgba(217,70,239,0.07) 0%, transparent 60%)' }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 50% 50% at 50% 100%, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            Get started today
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-5 leading-tight tracking-tight">
            Ready to be{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 50%, #4f46e5 100%)' }}
            >
              heard?
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            Whether you&apos;re a fan or a creator, FanVoice was built for you.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Fan card */}
          <FadeIn delay={80}>
            <Tilt3D className="h-full overflow-hidden rounded-2xl">
              <div className="group relative flex flex-col h-full bg-gray-50 dark:bg-white/[0.04] hover:bg-violet-50 dark:hover:bg-white/[0.07] border border-gray-200 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-500/40 rounded-2xl p-7 transition-all duration-300 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 70%)' }}
                />

                <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-600/20 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 relative">
                  <FontAwesomeIcon icon={faMessage} style={{ width: 18, height: 18 }} />
                </div>

                <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2 relative">For Fans</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug relative">
                  Send a message to any creator you love
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 relative">
                  Find your favorite creator, write what you want them to say, and pay a small fee.
                  If they don&apos;t read it — you get every so&apos;m back.
                </p>

                {/* Price example */}
                <div className="relative flex items-center gap-2 bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 mb-6 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">You pay</span>
                  <span className="font-black text-gray-900 dark:text-white">10,000 so&apos;m</span>
                  <span className="text-gray-300 dark:text-gray-600">→</span>
                  <span className="text-violet-600 dark:text-violet-400 font-semibold">Creator reads it</span>
                </div>

                <Link
                  href="/login"
                  className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-violet-600/20 w-fit"
                >
                  Send a message
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ width: 12, height: 12 }}
                    className="group-hover/btn:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </Tilt3D>
          </FadeIn>

          {/* Creator card */}
          <FadeIn delay={160}>
            <Tilt3D className="h-full overflow-hidden rounded-2xl">
              <div className="group relative flex flex-col h-full bg-gray-50 dark:bg-white/[0.04] hover:bg-fuchsia-50 dark:hover:bg-white/[0.07] border border-gray-200 dark:border-white/[0.08] hover:border-fuchsia-300 dark:hover:border-fuchsia-500/40 rounded-2xl p-7 transition-all duration-300 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217,70,239,0.07) 0%, transparent 70%)' }}
                />

                <div className="w-11 h-11 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-600/20 border border-fuchsia-200 dark:border-fuchsia-500/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 mb-6 relative">
                  <FontAwesomeIcon icon={faMicrophone} style={{ width: 18, height: 18 }} />
                </div>

                <p className="text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest mb-2 relative">For Creators</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug relative">
                  Turn your voice into income from fans
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 relative">
                  Set up your profile, set your price, and let fans send you messages to read.
                  You get paid automatically as soon as you deliver.
                </p>

                {/* Earnings example */}
                <div className="relative flex items-center gap-2 bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 mb-6 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Fan pays</span>
                  <span className="font-black text-gray-900 dark:text-white">10,000 so&apos;m</span>
                  <span className="text-gray-300 dark:text-gray-600">→</span>
                  <span className="text-fuchsia-600 dark:text-fuchsia-400 font-semibold">You get 9,000</span>
                </div>

                <Link
                  href="/signup"
                  className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white/10 dark:hover:bg-white/[0.16] text-white text-sm font-semibold rounded-full transition-all border border-transparent dark:border-white/10 dark:hover:border-white/20 w-fit"
                >
                  Become a creator
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ width: 12, height: 12 }}
                    className="group-hover/btn:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </Tilt3D>
          </FadeIn>
        </div>

        {/* Payment methods + fine print */}
        <FadeIn delay={240}>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">Pay with:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                Uzum Bank
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-transparent border border-dashed border-gray-200 dark:border-white/[0.08] rounded-full text-xs text-gray-400 dark:text-gray-600">
                Click · Payme
                <span className="text-[10px] bg-gray-100 dark:bg-white/[0.06] px-1.5 py-0.5 rounded-full">soon</span>
              </span>
            </div>
            <p className="text-center text-gray-400 dark:text-gray-600 text-xs">
              No setup fee · No monthly charge · Pay only per message
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
