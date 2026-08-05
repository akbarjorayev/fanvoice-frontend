'use client'

import { BadgeCheck } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { SUPPORT_TELEGRAM_URL } from '@/lib/constants'

interface Props {
  open: boolean
  onClose: () => void
}

export function GetVerifiedDialog({ open, onClose }: Props) {
  const t = useTranslations('getVerifiedDialog')
  return (
    <Dialog open={open} onClose={onClose} title={t('title')}>
      <div className="space-y-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 mx-auto">
          <BadgeCheck size={28} className="text-blue-500" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('description1')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {t('description2')}
          </p>
        </div>
        <a
          href={SUPPORT_TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#2AABEE] hover:bg-[#1d9bd8] text-white text-sm font-semibold transition-colors"
        >
          <FontAwesomeIcon icon={faTelegram} style={{ width: 16, height: 16 }} />
          {t('contactSupport')}
        </a>
      </div>
    </Dialog>
  )
}
