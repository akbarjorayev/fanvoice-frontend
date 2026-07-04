'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogoClick(e: React.MouseEvent) {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200/70 dark:border-white/[0.06] shadow-sm dark:shadow-none'
          : 'bg-transparent'
      }`}
    >
      <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-600/30">
          F
        </span>
        <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">
          FanVoice
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <a
          href="#how-it-works"
          className="hidden sm:block text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2"
        >
          How it works
        </a>
        <a
          href="https://t.me/fanvoice_support_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors px-3 py-2"
        >
          <FontAwesomeIcon icon={faTelegram} style={{ width: 14, height: 14 }} />
          Support
        </a>
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
    </nav>
  )
}
