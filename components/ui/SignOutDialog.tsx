'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { logout } from '@/lib/api'

interface SignOutDialogProps {
  open: boolean
  onClose: () => void
}

export function SignOutDialog({ open, onClose }: SignOutDialogProps) {
  const t = useTranslations('signOutDialog')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await logout().catch(() => null)
    router.push('/login')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('title')}
      description={t('description')}
    >
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={loggingOut}
          className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {tCommon('cancel')}
        </button>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loggingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
          {loggingOut ? tCommon('signingOut') : tCommon('signOut')}
        </button>
      </div>
    </Dialog>
  )
}
