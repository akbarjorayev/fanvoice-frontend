'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'

interface AvatarMenuProps {
  displayName: string
  initial: string
  avatarUrl?: string | null
}

export function AvatarMenu({ displayName, initial, avatarUrl }: AvatarMenuProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback(() => {
    setVisible(false)
    closeTimer.current = setTimeout(() => setMounted(false), 150)
  }, [])

  const open = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMounted(true)
    // Two rAFs so the browser sees the initial state before transitioning
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }, [])

  function toggle() {
    if (visible) close()
    else open()
  }

  useEffect(() => {
    if (!mounted) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mounted, close])

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        title={displayName}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-full"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={36}
            height={36}
            className="rounded-full ring-2 ring-violet-500/30 hover:ring-violet-500 transition-all object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white via-violet-400 to-blue-500 ring-2 ring-violet-500/30 hover:ring-violet-500 transition-all flex items-center justify-center">
            <span className="text-sm font-bold text-white drop-shadow">{initial}</span>
          </div>
        )}
      </button>

      {mounted && (
        <div
          className={`absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/[0.08] rounded-2xl shadow-lg shadow-black/10 dark:shadow-black/40 z-50 p-1.5 flex flex-col gap-0.5 origin-top-right transition-all duration-150 ${
            visible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
          }`}
        >
          <Link
            href="/me"
            onClick={close}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faUser} className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </span>
            Profile
          </Link>
          <a
            href="https://t.me/fanvoice_support_bot"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-500/[0.08] hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-sky-50 dark:bg-sky-500/[0.12] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faTelegram} className="w-3 h-3 text-sky-500" />
            </span>
            Support
          </a>
        </div>
      )}
    </div>
  )
}
