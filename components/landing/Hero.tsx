import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faShield, faCheck } from '@fortawesome/free-solid-svg-icons'

const avatarSeeds = [
  { initials: 'AK', from: 'from-violet-500', to: 'to-fuchsia-500' },
  { initials: 'SL', from: 'from-blue-500', to: 'to-cyan-500' },
  { initials: 'MR', from: 'from-emerald-500', to: 'to-teal-500' },
  { initials: 'JP', from: 'from-amber-500', to: 'to-orange-500' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen bg-white dark:bg-gray-950 flex items-center overflow-hidden pt-20">
      {/* Light mode glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden dark:hidden">
        <div className="absolute -top-40 left-1/3 w-[700px] h-[700px] bg-violet-100 rounded-full blur-[130px] opacity-70" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[110px] opacity-50" />
      </div>

      {/* Dark mode aurora */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden hidden dark:block">
        <div className="absolute -top-60 -left-40 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[700px] h-[700px] bg-indigo-700/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-700/10 rounded-full blur-[100px]" />
      </div>

      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.07) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 w-full py-16 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Badge */}
            <div
              className="animate-fade-up anim-delay-0 inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/80 border border-violet-200 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse" />
              Guaranteed delivery or your money back
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-up anim-delay-100 text-5xl md:text-6xl lg:text-[4.5rem] font-black text-gray-900 dark:text-white leading-[0.92] tracking-tight mb-6"
            >
              Your message,
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 55%, #4f46e5 100%)' }}
              >
                their voice.
              </span>
            </h1>

            {/* Subtext */}
            <p
              className="animate-fade-up anim-delay-200 text-lg text-gray-500 dark:text-gray-400 max-w-md mb-10 leading-relaxed"
            >
              Pay your favorite creator to read your message aloud — to their audience, on stream, in a video.
              They only get paid when they deliver.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-up anim-delay-300 flex flex-col sm:flex-row items-center gap-3 mb-12 w-full sm:w-auto"
            >
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 text-white text-sm font-semibold rounded-full hover:bg-violet-500 transition-all shadow-xl shadow-violet-600/30 w-full sm:w-auto justify-center"
              >
                Send a message
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ width: 13, height: 13 }}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-full hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-all w-full sm:w-auto"
              >
                See how it works
              </a>
            </div>

            {/* Social proof + stats */}
            <div className="animate-fade-up anim-delay-400 flex flex-wrap items-center justify-center lg:justify-start gap-6">
              {/* Avatar cluster */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {avatarSeeds.map((a) => (
                    <div
                      key={a.initials}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.from} ${a.to} flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-950`}
                    >
                      {a.initials}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white font-bold">1,200+</strong> fans joined
                </div>
              </div>

              <span className="w-px h-5 bg-gray-200 dark:bg-gray-800 hidden sm:block" />

              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="text-emerald-500 font-bold text-base">98%</span> delivery rate
              </div>

              <span className="w-px h-5 bg-gray-200 dark:bg-gray-800 hidden sm:block" />

              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="text-violet-600 dark:text-violet-400 font-bold">30-day</span> guarantee
              </div>
            </div>
          </div>

          {/* ── Right: floating mockup ── */}
          <div
            className="animate-fade-up anim-delay-300 hidden lg:flex items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            <div className="relative">
              {/* Glow behind card */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-3xl bg-violet-400/25 dark:bg-violet-600/25 blur-3xl"
                style={{ transform: 'scale(1.3)' }}
              />

              {/* Main floating card */}
              <div className="animate-float-card relative w-[340px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-2xl shadow-violet-900/10">

                {/* Card header */}
                <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                    AK
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-none mb-0.5">
                      Alex K.{' '}
                      <span className="text-violet-500 dark:text-violet-400 text-xs">✓</span>
                    </p>
                    <p className="text-gray-400 text-xs">@alexkhan · 24.5K fans</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white/10" />
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="px-5 py-4">
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">
                    Your message
                  </p>
                  <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/10 rounded-xl px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-violet-100/60 dark:border-violet-500/10">
                    &ldquo;Love your videos! Please say hi to my daughter Sofia — she&apos;s your biggest fan!&rdquo;
                  </div>
                </div>

                {/* Amount row */}
                <div className="flex items-center justify-between px-5 pb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FontAwesomeIcon icon={faShield} style={{ width: 11, height: 11 }} className="text-emerald-500" />
                    Held in escrow
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400 text-xs mr-1">Amount:</span>
                    <strong className="text-gray-900 dark:text-white">$5.00</strong>
                  </div>
                </div>

                {/* Send button */}
                <div className="px-5 pb-5">
                  <div className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 cursor-default select-none">
                    Send Message
                    <FontAwesomeIcon icon={faArrowRight} style={{ width: 13, height: 13 }} />
                  </div>
                </div>
              </div>

              {/* Floating badge: message read */}
              <div className="animate-float-badge absolute -top-4 -right-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/10 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
                  <FontAwesomeIcon icon={faCheck} style={{ width: 9, height: 9 }} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">Message read!</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Just now</p>
                </div>
              </div>

              {/* Floating badge: payout */}
              <div className="animate-float-badge-delay absolute -bottom-5 -left-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/10">
                <p className="text-[10px] text-gray-400 mb-0.5">Creator earned</p>
                <p className="text-sm font-black text-gray-900 dark:text-white leading-none">
                  +$4.25{' '}
                  <span className="text-emerald-500 text-xs font-bold">paid out</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
