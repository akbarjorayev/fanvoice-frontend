'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ShareDialog } from './ShareDialog'

interface Props {
  username: string
}

export function ShareProfileButton({ username }: Props) {
  const t = useTranslations('common')
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2 sm:gap-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 text-sm font-semibold hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 shadow-sm transition-colors"
      >
        <Share2 size={15} />
        <span className="hidden sm:inline">{t('share')}</span>
      </button>

      <ShareDialog
        open={open}
        onClose={() => setOpen(false)}
        username={username}
      />
    </>
  )
}
