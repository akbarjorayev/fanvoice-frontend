'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { getMe } from '@/lib/api'
import type { User } from '@/types/user'
import { AvatarMenu } from '@/components/dashboard/AvatarMenu'
import { SUPPORT_TELEGRAM_URL } from '@/lib/constants'

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
  }, [])

  function handleLogoClick(e: React.MouseEvent) {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isLanding = pathname === '/'
  const displayName = user?.display_name ?? user?.email?.split('@')[0] ?? ''
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <nav
      className={`fixed top-[20px] inset-x-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-950/80 shadow-sm dark:shadow-none'
          : 'bg-white/40 dark:bg-gray-950/40'
      }`}
    >
      <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2">
        <Image src="/fanvoice-logo.png" alt="FanVoice" width={32} height={32} className="rounded-lg" />
        <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">
          FanVoice
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {isLanding && (
          <a
            href="#how-it-works"
            className="hidden sm:block text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2"
          >
            How it works
          </a>
        )}
        <a
          href={SUPPORT_TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors px-3 py-2"
        >
          <FontAwesomeIcon icon={faTelegram} style={{ width: 14, height: 14 }} />
          Support
        </a>

        {user !== undefined && (
          <div
            className="animate-nav-auth-in flex items-center gap-2"
            onAnimationEnd={(e) => {
              e.currentTarget.style.overflow = 'visible'
              e.currentTarget.style.whiteSpace = 'normal'
            }}
          >
            {user ? (
              <div className="animate-scale-in">
                <AvatarMenu displayName={displayName} initial={initial} avatarUrl={user.avatar_url} username={user.username} />
              </div>
            ) : (
              <div className="animate-slide-in-right flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
