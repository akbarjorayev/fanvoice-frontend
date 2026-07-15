'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, User, LayoutDashboard } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { Dialog } from '@/components/ui/Dialog'
import { Avatar } from '@/components/ui/Avatar'
import { SignOutDialog } from '@/components/ui/SignOutDialog'
import { SUPPORT_TELEGRAM_URL } from '@/lib/constants'

interface AvatarMenuProps {
  displayName: string
  initial: string
  avatarUrl?: string | null
  username?: string | null
}

const linkClass =
  'flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors'

export function AvatarMenu({ displayName, avatarUrl, username }: AvatarMenuProps) {
  const [open, setOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={displayName}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-full"
      >
        <Avatar
          name={displayName}
          avatarUrl={avatarUrl}
          size={36}
          className="ring-2 ring-violet-500/30 hover:ring-violet-500 transition-all"
          textClassName="text-sm font-bold drop-shadow"
        />
      </button>

      {/* Profile dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        {/* Profile header */}
        <div className="flex items-center gap-4 px-5 pt-6 pb-5">
          <Avatar
            name={displayName}
            avatarUrl={avatarUrl}
            size={56}
            className="ring-4 ring-violet-500/20"
            textClassName="text-lg font-bold drop-shadow"
          />
          <div className="min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-base truncate">{displayName}</p>
            {username && (
              <p className="text-sm text-gray-400 dark:text-gray-500 truncate">@{username}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-3 pb-4 flex flex-col gap-0.5">
          <Link href="/me" onClick={() => setOpen(false)} className={linkClass}>
            <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center shrink-0">
              <User size={15} className="text-gray-500 dark:text-gray-400" />
            </span>
            Profile
          </Link>
          <Link href="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
            <span className="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-500/[0.12] flex items-center justify-center shrink-0">
              <LayoutDashboard size={15} className="text-violet-500" />
            </span>
            Dashboard
          </Link>
          <a
            href={SUPPORT_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            <span className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-500/[0.12] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faTelegram} className="w-3.5 h-3.5 text-sky-500" />
            </span>
            Support
          </a>

          <div className="my-1 h-px bg-gray-100 dark:bg-white/[0.06]" />

          <button
            onClick={() => { setOpen(false); setConfirmLogout(true) }}
            className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.08] transition-colors w-full"
          >
            <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/[0.12] flex items-center justify-center shrink-0">
              <LogOut size={15} className="text-red-500 dark:text-red-400" />
            </span>
            Sign out
          </button>
        </div>

        {/* Legal links */}
        <div className="px-5 pb-5 pt-1 flex items-center justify-center gap-1.5">
          <Link
            href="/privacy"
            onClick={() => setOpen(false)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-300 dark:text-gray-600 text-[11px]">&bull;</span>
          <Link
            href="/terms"
            onClick={() => setOpen(false)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </Dialog>

      <SignOutDialog open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </>
  )
}
