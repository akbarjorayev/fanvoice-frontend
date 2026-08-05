'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Share2, Copy, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { COPY_FEEDBACK_MS } from '@/lib/constants'

interface QRInstance {
  append(el: HTMLElement): void
  download(opts: { name: string; extension: 'png' | 'svg' | 'jpeg' | 'webp' }): void
  getRawData(ext: 'png' | 'svg' | 'jpeg' | 'webp'): Promise<Blob | undefined>
}

interface Props {
  open: boolean
  onClose: () => void
  username: string
}

export function QRDialog({ open, onClose, username }: Props) {
  const t = useTranslations('qrDialog')
  const tCommon = useTranslations('common')
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRInstance | null>(null)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open || !containerRef.current) return
    setReady(false)

    const url = `${window.location.origin}/u/${username}`

    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      const qr = new QRCodeStyling({
        width: 280,
        height: 280,
        type: 'svg',
        data: url,
        qrOptions: { errorCorrectionLevel: 'H' },
        dotsOptions: {
          type: 'extra-rounded',
          gradient: {
            type: 'linear',
            rotation: 0.8,
            colorStops: [
              { offset: 0, color: '#7c3aed' },
              { offset: 1, color: '#d946ef' },
            ],
          },
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: '#7c3aed',
        },
        cornersDotOptions: {
          type: 'dot',
          color: '#7c3aed',
        },
        backgroundOptions: { color: 'rgba(0,0,0,0)' },
        image: `${window.location.origin}/fanvoice-logo.png`,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 6,
          imageSize: 0.22,
          hideBackgroundDots: true,
        },
      } as ConstructorParameters<typeof QRCodeStyling>[0])

      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        qr.append(containerRef.current)
        qrRef.current = qr as unknown as QRInstance
        setReady(true)
      }
    })
  }, [open, username])

  async function handleDownload() {
    qrRef.current?.download({ name: `fanvoice-${username}`, extension: 'png' })
  }

  async function handleShare() {
    if (!qrRef.current) return
    const blob = await qrRef.current.getRawData('png')
    if (!blob) return
    const file = new File([blob], `fanvoice-${username}.png`, { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: `FanVoice — @${username}` }) }
      catch { /* cancelled */ }
    } else {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url; a.download = file.name; a.click()
      URL.revokeObjectURL(url)
    }
  }

  function handleCopy() {
    const url = `${window.location.origin}/u/${username}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
    })
  }

  const displayUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/u/${username}`
    : `/u/${username}`

  return (
    <Dialog open={open} onClose={onClose} title={t('title')}>
      <div className="flex flex-col items-center gap-5">
        {/* QR card */}
        <div className="p-1">
          {/* placeholder shown until QR is ready */}
          {!ready && (
            <div className="w-[280px] h-[280px] rounded-xl bg-gray-100 animate-pulse" />
          )}
          <div
            ref={containerRef}
            className={ready ? 'block' : 'hidden'}
            style={{ width: 280, height: 280 }}
          />
        </div>

        {/* URL — click to copy */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group text-left"
        >
          <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate">
            {displayUrl}
          </span>
          {copied
            ? <Check size={13} className="shrink-0 text-green-500" />
            : <Copy size={13} className="shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          }
        </button>

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <button
            onClick={handleDownload}
            disabled={!ready}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors disabled:opacity-40"
          >
            <Download size={14} />
            {tCommon('download')}
          </button>
          <button
            onClick={handleShare}
            disabled={!ready}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40"
          >
            <Share2 size={14} />
            {tCommon('share')}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
