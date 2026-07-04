import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For Creators', href: '/signup' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
]

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-white/[0.06] py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-violet-600/20">
            F
          </span>
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
            href="https://t.me/fanvoice_support_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTelegram} style={{ width: 14, height: 14 }} />
            Support
          </a>
        </nav>

        <p className="text-gray-400 dark:text-gray-600 text-sm shrink-0">&copy; 2026 FanVoice</p>
      </div>
    </footer>
  )
}
