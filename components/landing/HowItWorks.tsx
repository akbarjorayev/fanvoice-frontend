import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faMicrophone, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'
import { Tilt3D } from './Tilt3D'
import { CREATOR_SHARE_PCT, PLATFORM_FEE_PCT, creatorAmount, formatPrice } from '@/lib/fees'

function Waveform() {
  const bars = [3, 5, 8, 4, 9, 6, 7, 4, 8, 5, 6, 9, 4, 7, 5, 8, 3, 6, 9, 4]
  return (
    <div className="flex items-end gap-[3px] h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-fuchsia-500 to-violet-400"
          style={{
            height: `${h * 3}px`,
            animation: `wave ${0.7 + (i % 4) * 0.15}s ease-in-out infinite`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  )
}

function PreviewForm() {
  const t = useTranslations('howItWorks')
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-white/[0.07] p-4 mb-6">
      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{t('yourMessage')}</p>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/[0.08] rounded-lg px-3 py-2 mb-3 text-xs text-gray-600 dark:text-gray-300 italic">
        {t('sampleMessage')}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t('amountLabel')} <span className="text-violet-600 dark:text-violet-400 font-bold">5,000 so&apos;m</span>
        </span>
        <div className="px-3 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-[10px] text-white font-semibold shadow-md shadow-violet-500/30">
          {t('sendArrow')}
        </div>
      </div>
    </div>
  )
}

function PreviewLive() {
  const t = useTranslations('howItWorks')
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-white/[0.07] p-4 mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          AK
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">@alexkhan</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{t('fansCount')}</p>
        </div>
        <div className="flex items-center gap-0.5 bg-red-500 rounded-full px-2 py-0.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wide">{t('live')}</span>
        </div>
      </div>
      <Waveform />
    </div>
  )
}

function PreviewSplit() {
  const t = useTranslations('howItWorks')
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-white/[0.07] p-4 mb-6">
      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{t('paymentSplit')}</p>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('fanPays')} <strong className="text-gray-900 dark:text-white">10,000 so&apos;m</strong></div>
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-2">
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ flex: CREATOR_SHARE_PCT }} />
        <div className="bg-gray-300 dark:bg-gray-700 rounded-full" style={{ flex: PLATFORM_FEE_PCT }} />
      </div>
      <div className="flex items-center justify-between text-[11px] mb-3">
        <span className="text-violet-600 dark:text-violet-400 font-bold">{t('creatorLabel', { amount: formatPrice(creatorAmount(10000)) })}</span>
        <span className="text-gray-400">{t('platformLabel', { amount: formatPrice(10000 - creatorAmount(10000)) })}</span>
      </div>
      <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-2.5 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{t('releasedAutomatically')}</span>
      </div>
    </div>
  )
}

const stepMeta = [
  { key: 'write', number: '01', icon: faPenToSquare, Preview: PreviewForm, accent: 'from-violet-500 to-fuchsia-500', glow: 'rgba(139,92,246,0.14)' },
  { key: 'read', number: '02', icon: faMicrophone, Preview: PreviewLive, accent: 'from-fuchsia-500 to-pink-500', glow: 'rgba(217,70,239,0.14)' },
  { key: 'win', number: '03', icon: faCircleCheck, Preview: PreviewSplit, accent: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.14)' },
] as const

export function HowItWorks() {
  const t = useTranslations('howItWorks')
  const steps = stepMeta.map((meta) => ({
    ...meta,
    title: t(`steps.${meta.key}.title`),
    description: meta.key === 'win'
      ? t('steps.win.description', { pct: CREATOR_SHARE_PCT })
      : t(`steps.${meta.key}.description`),
    detail: t(`steps.${meta.key}.detail`),
  }))
  return (
    <section
      id="how-it-works"
      className="relative py-28 bg-gray-50 dark:bg-gray-900 px-6 overflow-hidden"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(139,92,246,0.07) 0%, transparent 100%)' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <FadeIn className="text-center mb-16">
          <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
            {t('titlePrefix')}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)' }}
            >
              {t('titleHighlight')}
            </span>
            {' '}{t('titleSuffix')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm mx-auto">
            {t('subtitle')}
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 130}>
              <Tilt3D className="h-full overflow-hidden rounded-2xl">
                <div className="group relative h-full bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-6 overflow-hidden shadow-sm">

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${step.glow} 0%, transparent 70%)` }}
                  />

                  <div className="absolute -bottom-3 -right-1 text-[100px] font-black leading-none text-gray-100 dark:text-white/[0.03] select-none pointer-events-none">
                    {step.number}
                  </div>

                  <div className="relative">
                    <step.Preview />
                  </div>

                  <div className="flex items-center gap-3 mb-3 relative">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${step.accent} flex items-center justify-center shadow-md shrink-0`}>
                      <FontAwesomeIcon icon={step.icon} className="text-white" style={{ width: 15, height: 15 }} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {t('step', { number: parseInt(step.number) })}
                    </p>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug relative">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 relative">
                    {step.description}
                  </p>

                  <span className="relative inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 px-3 py-1 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-violet-500" />
                    {step.detail}
                  </span>
                </div>
              </Tilt3D>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
