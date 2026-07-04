'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/api'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await logout().catch(() => null)
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
    >
      <LogOut size={15} />
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
