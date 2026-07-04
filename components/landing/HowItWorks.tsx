import { FadeIn } from './FadeIn'

const steps = [
  {
    number: '01',
    title: 'Write your message',
    description:
      'Choose a creator, write what you want them to say, and set your price. Your payment is held securely in escrow — nothing leaves until delivery.',
    detail: 'Takes less than 2 minutes',
  },
  {
    number: '02',
    title: 'Creator reads it aloud',
    description:
      'The creator reads your message live to their audience — on stream, in a video, or a personal shoutout. Verified by voice.',
    detail: 'Within 30 days',
  },
  {
    number: '03',
    title: 'Everyone wins',
    description:
      'You get your moment, the creator gets paid. If they don\'t deliver within 30 days, you get a full automatic refund. No disputes needed.',
    detail: 'Guaranteed or refunded',
  },
]

export function HowItWorks() {
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
        style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 100%)' }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <FadeIn className="text-center mb-20">
          <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            The process
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
            Three steps to be{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)' }}
            >
              heard
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm mx-auto">
            Simple, transparent, and protected at every step.
          </p>
        </FadeIn>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-10 md:gap-6">
          {/* Connecting line — desktop only */}
          <div
            aria-hidden
            className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(139,92,246,0) 0%, rgba(139,92,246,0.35) 20%, rgba(139,92,246,0.35) 80%, rgba(139,92,246,0) 100%)',
            }}
          />

          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 130} className="flex flex-col items-center text-center">
              {/* Number circle */}
              <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-violet-600/20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-purple-700" />
                <div className="absolute inset-[3px] rounded-full bg-gray-50 dark:bg-gray-900" />
                <span
                  className="relative text-xl font-black bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 max-w-[260px]">
                {step.description}
              </p>

              {/* Detail tag */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 px-3 py-1 rounded-full">
                <span className="w-1 h-1 rounded-full bg-violet-500" />
                {step.detail}
              </span>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
