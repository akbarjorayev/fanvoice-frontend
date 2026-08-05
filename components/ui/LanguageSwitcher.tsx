'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Globe, Check } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { LOCALES, LOCALE_COOKIE, LOCALE_LABELS, LOCALE_SHORT_LABELS, type Locale } from '@/lib/i18n/config'

interface Props {
  className?: string
}

export function LanguageSwitcher({ className = '' }: Props) {
  const locale = useLocale() as Locale
  const t = useTranslations('languageSwitcher')
  const router = useRouter()
  const [open, setOpen] = useState(false)

  function selectLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365}`
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={t('label')}
        aria-label={t('label')}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
      >
        <Globe size={14} />
        <span className="uppercase">{LOCALE_SHORT_LABELS[locale]}</span>
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title={t('label')}>
        <div className="flex flex-col gap-0.5">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => selectLocale(l)}
              className="flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
            >
              {LOCALE_LABELS[l]}
              {l === locale && <Check size={16} className="text-violet-500 shrink-0" />}
            </button>
          ))}
        </div>
      </Dialog>
    </>
  )
}
