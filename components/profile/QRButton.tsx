'use client'

import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { QRDialog } from './QRDialog'

interface Props {
  username: string
}

export function QRButton({ username }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:gap-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 text-sm font-semibold hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 shadow-sm transition-colors"
        title="Show QR code"
      >
        <QrCode size={15} />
        <span className="hidden sm:inline">QR</span>
      </button>

      <QRDialog open={open} onClose={() => setOpen(false)} username={username} />
    </>
  )
}
