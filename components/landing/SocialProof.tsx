import { useTranslations } from 'next-intl'

interface QuoteItem {
  text: string
  author: string
}

function MessagePill({ text, author }: { text: string; author: string }) {
  return (
    <div className="shrink-0 flex flex-col gap-1 bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] rounded-2xl px-5 py-3.5 mx-2 shadow-sm dark:shadow-none">
      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">{text}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{author}</p>
    </div>
  )
}

export function SocialProof() {
  const t = useTranslations('socialProof')
  const row1 = t.raw('row1') as QuoteItem[]
  const row2 = t.raw('row2') as QuoteItem[]
  return (
    <section className="relative py-16 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.08] to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.08] to-transparent" />

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 100%)' }}
      />

      <p className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-10">
        {t('eyebrow')}
      </p>

      {/* Row 1 */}
      <div className="relative mb-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-marquee">
          {[...row1, ...row1].map((item, i) => (
            <MessagePill key={i} text={item.text} author={item.author} />
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-marquee-reverse">
          {[...row2, ...row2].map((item, i) => (
            <MessagePill key={i} text={item.text} author={item.author} />
          ))}
        </div>
      </div>
    </section>
  )
}
