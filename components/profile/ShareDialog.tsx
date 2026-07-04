'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { Dialog } from '@/components/ui/Dialog'

interface Props {
  open: boolean
  onClose: () => void
  username: string
}

export function ShareDialog({ open, onClose, username }: Props) {
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
    setTimeout(() => setCopied(false), 2000)
  }

  function shareOn(platform: 'twitter' | 'telegram' | 'whatsapp') {
    const u = encodeURIComponent(url)
    const links = {
      twitter:  `https://twitter.com/intent/tweet?url=${u}`,
      telegram: `https://t.me/share/url?url=${u}`,
      whatsapp: `https://wa.me/?text=${u}`,
    }
    window.open(links[platform], '_blank', 'noopener,noreferrer')
  }

  async function handleShare() {
    try {
      await navigator.share({ url })
    } catch {
      // user cancelled
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Share profile">
      {/* Link + copy */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1 px-3 py-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 truncate font-mono select-all">
          {url}
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-violet-600 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
          title="Copy link"
        >
          {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
        </button>
      </div>

      {/* Social share */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => shareOn('twitter')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white transition-colors text-sm font-medium"
        >
          <FontAwesomeIcon icon={faXTwitter} style={{ width: 13 }} />
          X
        </button>
        <button
          onClick={() => shareOn('telegram')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#2AABEE] hover:text-[#2AABEE] transition-colors text-sm font-medium"
        >
          <FontAwesomeIcon icon={faTelegram} style={{ width: 13 }} />
          Telegram
        </button>
        <button
          onClick={() => shareOn('whatsapp')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#25D366] hover:text-[#25D366] transition-colors text-sm font-medium"
        >
          <FontAwesomeIcon icon={faWhatsapp} style={{ width: 13 }} />
          WhatsApp
        </button>
      </div>

      {/* Native share */}
      {canShare && (
        <button
          onClick={handleShare}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"
        >
          <Share2 size={14} />
          Share
        </button>
      )}
    </Dialog>
  )
}
