import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faMicrophone, faMessage } from '@fortawesome/free-solid-svg-icons'
import { FadeIn } from './FadeIn'

export function CTA() {
  return (
    <section className="relative py-32 bg-white dark:bg-gray-950 px-6 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

      {/* Ambient glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 60% 60% at 20% 50%, rgba(139,92,246,0.06) 0%, transparent 100%)' }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(217,70,239,0.04) 0%, transparent 100%)' }} />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Dual CTA cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Fan card */}
          <FadeIn delay={80}>
            <div className="group relative flex flex-col h-full bg-gray-50 dark:bg-white/[0.04] hover:bg-violet-50 dark:hover:bg-white/[0.07] border border-gray-200 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-500/40 rounded-2xl p-7 transition-all duration-300 overflow-hidden">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-600/20 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6">
                  <FontAwesomeIcon icon={faMessage} style={{ width: 18, height: 18 }} />
                </div>

                <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">For Fans</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug">
                  Send a message to any creator you love
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                  Find your favorite creator, write what you want them to say, and pay a small fee.
                  Guaranteed to be read — or you get your money back.
                </p>

                <Link
                  href="/login"
                  className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-violet-600/20"
                >
                  Send a message
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ width: 12, height: 12 }}
                    className="group-hover/btn:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Creator card */}
          <FadeIn delay={160}>
            <div className="group relative flex flex-col h-full bg-gray-50 dark:bg-white/[0.04] hover:bg-fuchsia-50 dark:hover:bg-white/[0.07] border border-gray-200 dark:border-white/[0.08] hover:border-fuchsia-300 dark:hover:border-fuchsia-500/40 rounded-2xl p-7 transition-all duration-300 overflow-hidden">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-600/20 border border-fuchsia-200 dark:border-fuchsia-500/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 mb-6">
                  <FontAwesomeIcon icon={faMicrophone} style={{ width: 18, height: 18 }} />
                </div>

                <p className="text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest mb-2">For Creators</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug">
                  Turn your voice into income from fans
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                  Set up your profile, set your price, and let fans send you messages to read.
                  You get paid automatically as soon as you deliver.
                </p>

                <Link
                  href="/signup"
                  className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white/10 dark:hover:bg-white/[0.16] text-white text-sm font-semibold rounded-full transition-all border border-transparent dark:border-white/10 dark:hover:border-white/20"
                >
                  Become a creator
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ width: 12, height: 12 }}
                    className="group-hover/btn:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Fine print */}
        <FadeIn delay={240}>
          <p className="text-center text-gray-400 dark:text-gray-600 text-xs mt-8">
            No setup fee · No monthly charge · Pay only per message
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
