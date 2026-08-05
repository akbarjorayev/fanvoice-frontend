import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'
import { Tilt3D } from './Tilt3D'

const testimonialStyles = [
  { initial: 'S', from: 'from-pink-400', to: 'to-rose-500', accent: '#f43f5e' },
  { initial: 'A', from: 'from-violet-500', to: 'to-purple-600', accent: '#7c3aed' },
  { initial: 'O', from: 'from-blue-400', to: 'to-indigo-600', accent: '#3b82f6' },
  { initial: 'K', from: 'from-emerald-400', to: 'to-teal-600', accent: '#10b981' },
  { initial: 'J', from: 'from-amber-400', to: 'to-orange-500', accent: '#f59e0b' },
  { initial: 'N', from: 'from-cyan-400', to: 'to-sky-600', accent: '#06b6d4' },
] as const

interface TestimonialItem {
  quote: string
  name: string
  role: string
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5 mb-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} className="text-amber-400" style={{ width: 13, height: 13 }} />
      ))}
    </div>
  )
}

export function Testimonials() {
  const t = useTranslations('testimonials')
  const items = t.raw('items') as TestimonialItem[]
  const testimonials = items.map((item, i) => ({ ...item, ...testimonialStyles[i] }))
  const [featured, ...rest] = testimonials

  return (
    <section className="relative py-28 bg-gray-50 dark:bg-gray-900 px-6 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(139,92,246,0.06) 0%, transparent 100%)' }}
      />

      <div className="max-w-5xl mx-auto relative">
        <FadeIn className="text-center mb-16">
          <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            {t('titlePrefix')}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)' }}
            >
              {t('titleHighlight')}
            </span>
          </h2>
        </FadeIn>

        {/* Featured testimonial */}
        <FadeIn className="mb-5">
          <Tilt3D intensity={5} className="overflow-hidden rounded-2xl">
            <div
              className="relative bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-8 md:p-10 shadow-sm overflow-hidden"
              style={{ borderLeft: `3px solid ${featured.accent}` }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(ellipse 60% 60% at 0% 50%, ${featured.accent}0d 0%, transparent 60%)` }}
              />

              <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                ✦ {t('featured')}
              </div>

              <Stars />

              <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl leading-relaxed mb-7 max-w-2xl relative">
                &ldquo;{featured.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 relative">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${featured.from} ${featured.to} flex items-center justify-center text-white font-bold text-base shrink-0`}>
                  {featured.initial}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white leading-none mb-0.5">{featured.name}</p>
                  <p className="text-gray-400 text-sm">{featured.role}</p>
                </div>
              </div>
            </div>
          </Tilt3D>
        </FadeIn>

        {/* Remaining 5 cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((t, i) => (
            <FadeIn key={t.name} delay={i * 100}>
              <Tilt3D className="h-full overflow-hidden rounded-2xl">
                <div
                  className="h-full flex flex-col bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-6 shadow-sm overflow-hidden"
                  style={{ borderLeft: `2px solid ${t.accent}` }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{ backgroundImage: `radial-gradient(ellipse 50% 50% at 0% 50%, ${t.accent}0a 0%, transparent 60%)` }}
                  />

                  <Stars />

                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1 mb-5 relative">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="h-px bg-gray-100 dark:bg-white/[0.06] mb-4" />

                  <div className="flex items-center gap-3 relative">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.from} ${t.to} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                      {t.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm leading-none mb-0.5">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
