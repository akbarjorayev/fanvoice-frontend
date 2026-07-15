import { BadgeCheck, Sparkles, Coins } from 'lucide-react'
import { formatPrice } from '@/lib/fees'

export function YouBadge() {
  return (
    <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
      you
    </span>
  )
}

export function VerifiedBadge({ size = 15 }: { size?: number }) {
  return <BadgeCheck size={size} className="shrink-0 text-blue-500" />
}

export function CreatorBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-xs font-semibold text-violet-600 dark:text-violet-400 shrink-0">
      <Sparkles size={10} />
      Creator
    </span>
  )
}

export function MinPricePill({ price, suffix }: { price: number; suffix?: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
      <Coins size={13} className="text-yellow-500 dark:text-yellow-400 shrink-0" />
      <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
        From {formatPrice(price)} so&apos;m{suffix ? ` ${suffix}` : ''}
      </span>
    </div>
  )
}
