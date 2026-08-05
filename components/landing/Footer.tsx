'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { useTranslations } from 'next-intl'
import { SUPPORT_TELEGRAM_URL } from '@/lib/constants'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const pathname = usePathname()

  const baseLinks = [
    { label: t('forCreators'), href: '/signup' },
    { label: t('terms'), href: '/terms' },
    { label: t('privacy'), href: '/privacy' },
  ]
  const links = pathname === '/'
    ? [{ label: tNav('howItWorks'), href: '#how-it-works' }, ...baseLinks]
    : baseLinks

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-white/[0.06] py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/fanvoice-logo.png" alt="FanVoice" width={24} height={24} className="rounded-md" />
          <span className="text-gray-900 dark:text-white font-bold tracking-tight">FanVoice</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-500 text-sm hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={SUPPORT_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTelegram} style={{ width: 14, height: 14 }} />
            {tNav('support')}
          </a>
        </nav>

        <p className="text-gray-400 dark:text-gray-600 text-sm shrink-0">{t('copyright')}</p>
      </div>
    </footer>
  )
}
