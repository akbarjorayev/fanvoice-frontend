'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Share2, Copy, Check } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'

interface Props {
  open: boolean
  onClose: () => void
  username: string
}

export function QRDialog({ open, onClose, username }: Props) {
  const [dataUrl, setDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!profileUrl) return
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    if (!open || !username) return
    const profileUrl = `${window.location.origin}/u/${username}`
    QRCode.toDataURL(profileUrl, {
      width: 240,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setDataUrl)
  }, [open, username])

  async function handleShare() {
    if (!dataUrl) return
    const blob = await fetch(dataUrl).then(r => r.blob())
    const file = new File([blob], `fanvoice-${username}.png`, { type: 'image/png' })

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `FanVoice — @${username}` })
      } catch {
        // user cancelled
      }
    } else {
      download(file)
    }
  }

  function handleDownload() {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `fanvoice-${username}.png`
    a.click()
  }

  function download(file: File) {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${username}` : ''

  return (
    <Dialog open={open} onClose={onClose} title="QR Code">
      <div className="flex flex-col items-center gap-5">
        {/* QR image */}
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-200">
          {dataUrl ? (
            <img src={dataUrl} alt="Profile QR code" width={200} height={200} className="block" />
          ) : (
            <div className="w-[200px] h-[200px] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          )}
        </div>

        {/* URL label — click to copy */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group text-left"
        >
          <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate">
            {profileUrl}
          </span>
          {copied
            ? <Check size={13} className="shrink-0 text-green-500" />
            : <Copy size={13} className="shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          }
        </button>

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <button
            onClick={handleDownload}
            disabled={!dataUrl}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors disabled:opacity-40"
          >
            <Download size={14} />
            Download
          </button>
          <button
            onClick={handleShare}
            disabled={!dataUrl}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40"
          >
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </Dialog>
  )
}
