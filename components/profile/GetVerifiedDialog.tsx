'use client'

import { BadgeCheck } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { Dialog } from '@/components/ui/Dialog'

interface Props {
  open: boolean
  onClose: () => void
}

export function GetVerifiedDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} title="Get Verified">
      <div className="space-y-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 mx-auto">
          <BadgeCheck size={28} className="text-blue-500" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Verified creators get a badge on their profile and public page, letting fans know the account is authentic.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            To apply, reach out to our support team on Telegram and we&apos;ll get back to you.
          </p>
        </div>
        <a
          href="https://t.me/fanvoice_support_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#2AABEE] hover:bg-[#1d9bd8] text-white text-sm font-semibold transition-colors"
        >
          <FontAwesomeIcon icon={faTelegram} style={{ width: 16, height: 16 }} />
          Contact Support on Telegram
        </a>
      </div>
    </Dialog>
  )
}
