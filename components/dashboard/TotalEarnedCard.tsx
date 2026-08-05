'use client'

import { useState } from 'react'
import { ArrowRight, Banknote, Coins, Inbox, Info, MailOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { AnimatedAmount } from '@/components/dashboard/AnimatedAmount'

interface Props {
  totalEarned: number
}

export function TotalEarnedCard({ totalEarned }: Props) {
  const t = useTranslations('dashboard')
  const tMessageTabs = useTranslations('messageTabs')
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800 px-6 py-6 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30">
      <Banknote
        size={160}
        strokeWidth={1.1}
        className="absolute -bottom-8 -right-8 text-white/10 rotate-[-15deg] pointer-events-none select-none"
      />
      <button
        type="button"
        onClick={() => setInfoOpen(true)}
        aria-label={t('totalEarnedHint')}
        className="absolute z-10 top-4 right-4 flex items-center justify-center size-7 rounded-full bg-white/15 hover:bg-white/25 text-white/80 hover:text-white transition-colors"
      >
        <Info size={15} />
      </button>
      <div className="relative flex items-center gap-1.5 text-xs font-bold text-emerald-50/80 uppercase tracking-widest mb-2">
        <Coins size={13} className="shrink-0" />
        {t('totalEarned')}
      </div>
      <p className="relative text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        <AnimatedAmount value={totalEarned} />
        <span className="text-lg sm:text-xl font-semibold text-emerald-50/70 ml-2">so&apos;m</span>
      </p>

      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} title={t('totalEarned')}>
        <div className="space-y-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 mx-auto">
            <Coins size={26} className="text-emerald-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center">
            {t('totalEarnedHint')}
          </p>
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 py-4">
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center justify-center size-9 rounded-full bg-blue-100 dark:bg-blue-500/15">
                <Inbox size={16} className="text-blue-500 dark:text-blue-400" />
              </div>
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{t('received')}</span>
            </div>
            <ArrowRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center justify-center size-9 rounded-full bg-violet-100 dark:bg-violet-500/15">
                <MailOpen size={16} className="text-violet-500 dark:text-violet-400" />
              </div>
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{tMessageTabs('read')}</span>
            </div>
            <ArrowRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center justify-center size-9 rounded-full bg-emerald-100 dark:bg-emerald-500/15">
                <Coins size={16} className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{t('totalEarned')}</span>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
