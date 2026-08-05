import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslations } from 'next-intl'
import { CREATOR_SHARE_PCT } from '@/lib/fees'

const connections = [
  {
    fan: { id: 'J', name: '@jasur_n', gradient: 'from-blue-400 to-indigo-500' },
    creator: { id: 'AK', name: '@alexkhan', gradient: 'from-violet-500 to-fuchsia-500', live: true },
    message: '"Salom! Say hi to my sis!"',
    delay: '0s',
    pill: 'from-violet-600 to-fuchsia-600',
    glow: 'shadow-violet-500/40',
  },
  {
    fan: { id: 'K', name: '@kamola', gradient: 'from-emerald-400 to-teal-500' },
    creator: { id: 'NP', name: '@nina_p', gradient: 'from-cyan-500 to-sky-500', live: false },
    message: '"Love your art, draw me please!"',
    delay: '0.93s',
    pill: 'from-cyan-600 to-sky-600',
    glow: 'shadow-cyan-500/40',
  },
  {
    fan: { id: 'O', name: '@omar_r', gradient: 'from-amber-400 to-orange-500' },
    creator: { id: 'JM', name: '@jamshid', gradient: 'from-fuchsia-500 to-pink-500', live: true },
    message: '"Shout out my birthday bro!"',
    delay: '1.86s',
    pill: 'from-fuchsia-600 to-pink-600',
    glow: 'shadow-fuchsia-500/40',
  },
]

function NetworkFlow() {
  const t = useTranslations('hero')
  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Desktop: multi-row live network */}
      <div className="hidden sm:block space-y-2.5">
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.18em]">{t('fansLabel')}</span>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.18em]">{t('creatorsLabel')}</span>
        </div>

        {connections.map((conn, i) => (
          <div key={i} className="flex items-center">
            {/* Fan node */}
            <div className="shrink-0 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/[0.08] rounded-xl px-3 py-2 shadow-sm">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${conn.fan.gradient} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                {conn.fan.id}
              </div>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{conn.fan.name}</span>
            </div>

            {/* Animated wire */}
            <div className="relative flex-1 h-9 flex items-center overflow-hidden mx-1">
              <div className="w-full h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-white/[0.06] dark:via-white/[0.12] dark:to-white/[0.06]" />
              <div
                className={`animate-message-fly absolute top-1/2 bg-gradient-to-r ${conn.pill} text-white text-[9px] font-semibold px-2.5 py-1 rounded-full shadow-md ${conn.glow} whitespace-nowrap pointer-events-none select-none`}
                style={{ animationDelay: conn.delay }}
              >
                {conn.message}
              </div>
            </div>

            {/* Creator node */}
            <div className="shrink-0 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/[0.08] rounded-xl px-3 py-2 shadow-sm">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${conn.creator.gradient} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                {conn.creator.id}
              </div>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{conn.creator.name}</span>
              {conn.creator.live && (
                <div className="flex items-center gap-0.5 bg-red-500 rounded-full px-1.5 py-0.5">
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  <span className="text-[8px] font-bold text-white uppercase tracking-wide">{t('live')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: single wire */}
      <div className="sm:hidden flex justify-center">
        <div className="relative h-10 w-full max-w-xs flex items-center overflow-hidden">
          <div className="w-full h-px bg-gradient-to-r from-violet-300 to-fuchsia-300 dark:from-violet-600/40 dark:to-fuchsia-600/40" />
          <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-violet-500" />
          <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
          <div className="animate-message-fly absolute top-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full shadow-md shadow-violet-500/40 whitespace-nowrap pointer-events-none select-none">
            💬 &ldquo;Say hi to my sis!&rdquo;
          </div>
        </div>
      </div>
    </div>
  )
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => {
        const x = (i * 47 + 11) % 100
        const y = (i * 31 + 7) % 100
        const size = i % 5 === 0 ? 6 : i % 3 === 0 ? 5 : 4
        const duration = 4 + (i % 4)
        const delay = (i % 7) * 0.6
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

export function Hero() {
  const t = useTranslations('hero')
  return (
    <section className="relative min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center overflow-hidden pt-24 pb-20 px-6">

      <FloatingParticles />

      {/* Light mode glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden dark:hidden">
        <div className="absolute -top-60 -left-20 w-[800px] h-[800px] bg-violet-100 rounded-full blur-[130px] opacity-70" />
        <div className="absolute -bottom-20 right-0 w-[600px] h-[600px] bg-fuchsia-100 rounded-full blur-[110px] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-50" />
      </div>

      {/* Dark mode aurora */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden hidden dark:block">
        <div className="absolute -top-60 -left-40 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[700px] h-[700px] bg-fuchsia-700/16 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[100px]" />
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

      {/* Content */}
      <div className="relative flex flex-col items-center text-center w-full max-w-4xl mx-auto">

        {/* Headline */}
        <h1 className="animate-fade-up anim-delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tight mb-6">
          <span className="text-gray-900 dark:text-white">{t('headlineLine1')}</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 55%, #4f46e5 100%)' }}
          >
            {t('headlineLine2')}
          </span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up anim-delay-200 text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-lg mb-10 leading-relaxed">
          {t('subtext')}
        </p>

        {/* CTAs */}
        <div className="animate-fade-up anim-delay-300 flex flex-col sm:flex-row items-center gap-3 mb-14 w-full sm:w-auto">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 text-white text-sm font-semibold rounded-full hover:bg-violet-500 transition-all shadow-xl shadow-violet-600/30 w-full sm:w-auto justify-center"
          >
            {t('sendMessage')}
            <FontAwesomeIcon
              icon={faArrowRight}
              style={{ width: 13, height: 13 }}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-full hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-all w-full sm:w-auto"
          >
            {t('becomeCreator')}
          </Link>
        </div>

        {/* Live network visualization */}
        <div className="animate-fade-up anim-delay-400 w-full mb-12">
          <NetworkFlow />
        </div>

        {/* Real product facts */}
        <div className="animate-fade-up anim-delay-500 flex flex-wrap items-center justify-center gap-5">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-violet-600 dark:text-violet-400 font-black">{CREATOR_SHARE_PCT}%</span>
            {t('shareGoesTo')}
          </div>
          <span className="w-px h-5 bg-gray-200 dark:bg-gray-800 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{t('uzumBank')}</span>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">{t('moreComing')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
