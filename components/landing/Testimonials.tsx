import { FadeIn } from './FadeIn'

const testimonials = [
  {
    quote:
      "My daughter's favorite streamer read her name live in front of 20,000 people. She was shaking. I've never seen her that happy. Worth every penny.",
    name: 'Sarah M.',
    role: 'Fan from London',
    initial: 'S',
    from: 'from-pink-400',
    to: 'to-rose-500',
  },
  {
    quote:
      "FanVoice changed how I connect with my community. The escrow system means fans actually trust me, and I get fair payment for the time I spend. It's a win-win.",
    name: 'Alex K.',
    role: 'Content Creator · 24K fans',
    initial: 'A',
    from: 'from-violet-500',
    to: 'to-purple-600',
  },
  {
    quote:
      "I've tried other platforms and always got burned. FanVoice is the only one that actually guarantees delivery. My message went out within a week.",
    name: 'Omar R.',
    role: 'Fan from UAE',
    initial: 'O',
    from: 'from-blue-400',
    to: 'to-indigo-600',
  },
]

export function Testimonials() {
  return (
    <section className="relative py-28 bg-gray-50 dark:bg-gray-900 px-6 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(139,92,246,0.05) 0%, transparent 100%)' }}
      />

      <div className="max-w-5xl mx-auto relative">
        <FadeIn className="text-center mb-16">
          <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Real stories
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            Moments that matter
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 120}>
              <div className="h-full flex flex-col bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-7 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300">
                {/* Quote mark */}
                <div
                  className="text-5xl font-black leading-none mb-4 bg-clip-text text-transparent select-none"
                  style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #d946ef)' }}
                  aria-hidden
                >
                  &ldquo;
                </div>

                {/* Quote */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1 mb-6">
                  {t.quote}
                </p>

                {/* Divider */}
                <div className="h-px bg-gray-100 dark:bg-white/[0.06] mb-5" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.from} ${t.to} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-none mb-0.5">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
