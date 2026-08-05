'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { COPY_FEEDBACK_MS } from '@/lib/constants'

interface Props {
  open: boolean
  onClose: () => void
  username: string
}

export function ShareDialog({ open, onClose, username }: Props) {
  const t = useTranslations('shareDialog')
  const tCommon = useTranslations('common')
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(`${window.location.origin}/u/${username}`)
    setCanShare(typeof navigator.share === 'function')
  }, [username])

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
  }

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`,
  }

  async function handleShare() {
    try {
      await navigator.share({ url })
    } catch {
      // user cancelled
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('title')}>
      {/* Link + copy */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group text-left mb-5"
      >
        <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate">
          {url}
        </span>
        {copied
          ? <Check size={13} className="shrink-0 text-green-500" />
          : <Copy size={13} className="shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
        }
      </button>

      {/* Social share */}
      <div className="flex gap-2 mb-4">
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white transition-colors text-sm font-medium"
        >
          <FontAwesomeIcon icon={faXTwitter} style={{ width: 13 }} />
          X
        </a>
        <a
          href={shareUrls.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#2AABEE] hover:text-[#2AABEE] transition-colors text-sm font-medium"
        >
          <FontAwesomeIcon icon={faTelegram} style={{ width: 13 }} />
          Telegram
        </a>
        <a
          href={shareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#25D366] hover:text-[#25D366] transition-colors text-sm font-medium"
        >
          <FontAwesomeIcon icon={faWhatsapp} style={{ width: 13 }} />
          WhatsApp
        </a>
      </div>

      {/* Native share */}
      {canShare && (
        <button
          onClick={handleShare}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"
        >
          <Share2 size={14} />
          {tCommon('share')}
        </button>
      )}
    </Dialog>
  )
}
