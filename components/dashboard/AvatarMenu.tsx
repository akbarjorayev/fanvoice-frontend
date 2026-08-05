'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User, LayoutDashboard, Globe, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { useLocale, useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { Avatar } from '@/components/ui/Avatar'
import { SignOutDialog } from '@/components/ui/SignOutDialog'
import { SUPPORT_TELEGRAM_URL } from '@/lib/constants'
import { LOCALES, LOCALE_COOKIE, LOCALE_LABELS, type Locale } from '@/lib/i18n/config'

interface AvatarMenuProps {
  displayName: string
  initial: string
  avatarUrl?: string | null
  username?: string | null
}

const linkClass =
  'flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors'

export function AvatarMenu({ displayName, avatarUrl, username }: AvatarMenuProps) {
  const t = useTranslations('common')
  const tAvatarMenu = useTranslations('avatarMenu')
  const tLang = useTranslations('languageSwitcher')
  const locale = useLocale() as Locale
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'menu' | 'language'>('menu')
  const [confirmLogout, setConfirmLogout] = useState(false)

  function backToMenu() {
    setView('menu')
  }

  // Deliberately doesn't reset `view` here — the dialog stays mounted during
  // its ~150ms close animation, so resetting immediately would flash the
  // menu view back in behind the fade-out instead of closing on whatever
  // view was actually showing. Reset happens on next open instead.
  function handleClose() {
    setOpen(false)
  }

  function selectLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365}`
    setOpen(false)
    router.refresh()
  }

  function openMenu() {
    setView('menu')
    setOpen(true)
  }

  return (
    <>
      <button
        onClick={openMenu}
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
      <Dialog
        open={open}
        onClose={handleClose}
        onEscape={view === 'language' ? backToMenu : handleClose}
      >
        {view === 'menu' ? (
          <>
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
                {t('profile')}
              </Link>
              <Link href="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
                <span className="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-500/[0.12] flex items-center justify-center shrink-0">
                  <LayoutDashboard size={15} className="text-violet-500" />
                </span>
                {t('dashboard')}
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
                {t('support')}
              </a>
              <button onClick={() => setView('language')} className={`${linkClass} w-full justify-between`}>
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/[0.12] flex items-center justify-center shrink-0">
                    <Globe size={15} className="text-emerald-500" />
                  </span>
                  {tLang('label')}
                </span>
                <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                  <span className="text-xs font-medium">{LOCALE_LABELS[locale]}</span>
                  <ChevronRight size={15} />
                </span>
              </button>

              <div className="my-1 h-px bg-gray-100 dark:bg-white/[0.06]" />

              <button
                onClick={() => { setOpen(false); setConfirmLogout(true) }}
                className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.08] transition-colors w-full"
              >
                <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/[0.12] flex items-center justify-center shrink-0">
                  <LogOut size={15} className="text-red-500 dark:text-red-400" />
                </span>
                {t('signOut')}
              </button>
            </div>

            {/* Legal links */}
            <div className="px-5 pb-5 pt-1 flex items-center justify-center gap-1.5">
              <Link
                href="/privacy"
                onClick={() => setOpen(false)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {tAvatarMenu('privacyPolicy')}
              </Link>
              <span className="text-gray-300 dark:text-gray-600 text-[11px]">&bull;</span>
              <Link
                href="/terms"
                onClick={() => setOpen(false)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {tAvatarMenu('termsOfService')}
              </Link>
            </div>
          </>
        ) : (
          <div>
            {/* Sub-header */}
            <div className="flex items-center gap-1 px-3 pt-4 pb-2">
              <button
                onClick={backToMenu}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors shrink-0"
              >
                <ChevronLeft size={17} />
              </button>
              <p className="font-bold text-gray-900 dark:text-white text-base">{tLang('label')}</p>
            </div>

            <div className="px-3 pb-5 flex flex-col gap-0.5">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => selectLocale(l)}
                  className={`${linkClass} w-full justify-between`}
                >
                  {LOCALE_LABELS[l]}
                  {l === locale && <Check size={16} className="text-violet-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </Dialog>

      <SignOutDialog open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </>
  )
}
