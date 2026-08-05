'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { VerifiedBadge } from '@/components/ui/UserBadges'
import { CREATOR_SHARE_PCT, PLATFORM_FEE_PCT, formatPrice } from '@/lib/fees'

export function PriceInfoButton({
  price,
  creatorEarning,
  creatorName,
  creatorVerified,
}: {
  price: number
  creatorEarning: number
  creatorName: string
  creatorVerified?: boolean
}) {
  const t = useTranslations('priceInfoDialog')
  const tCommon = useTranslations('common')
  const tPay = useTranslations('payPage')
  const [open, setOpen] = useState(false)

  const feeAmount = price - creatorEarning

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
        aria-label={tPay('infoAriaLabel')}
      >
        <Info size={14} className="text-white" />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title={t('title')}>
        <div className="flex flex-col gap-5">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {t('description', { name: creatorName })}
          </p>

          {/* Split bar */}
          <div>
            <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ flex: CREATOR_SHARE_PCT }} />
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full" style={{ flex: PLATFORM_FEE_PCT }} />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('toCreator', { amount: formatPrice(creatorEarning), name: creatorName })}
                  </p>
                  {creatorVerified && <VerifiedBadge size={14} />}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{t('releasedWhenRead', { pct: CREATOR_SHARE_PCT })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {t('toPlatform', { amount: formatPrice(feeAmount) })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{t('serviceFee', { pct: PLATFORM_FEE_PCT })}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">{t('youPayTotal')}</span>
            <span className="font-black text-gray-900 dark:text-white">{formatPrice(price)} so&apos;m</span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-full py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors"
          >
            {tCommon('gotIt')}
          </button>
        </div>
      </Dialog>
    </>
  )
}
