'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { logout } from '@/lib/api'

interface SignOutDialogProps {
  open: boolean
  onClose: () => void
}

export function SignOutDialog({ open, onClose }: SignOutDialogProps) {
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
      title="Sign out?"
      description="You'll be returned to the login screen and will need to sign in again."
    >
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={loggingOut}
          className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loggingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
          {loggingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </Dialog>
  )
}
