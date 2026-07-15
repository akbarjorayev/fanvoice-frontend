'use client'

import { useState, useEffect } from 'react'
import { Link2, Check } from 'lucide-react'
import { COPY_FEEDBACK_MS } from '@/lib/constants'

interface Props {
  username: string
}

export function CopyCreatorLink({ username }: Props) {
  const [copied, setCopied] = useState(false)
  const [fullUrl, setFullUrl] = useState('')

  useEffect(() => {
    setFullUrl(`${window.location.origin}/u/${username}`)
  }, [username])

  const displayUrl = fullUrl.replace(/^https?:\/\//, '')

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
    })
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
        <Link2 size={14} className="text-violet-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
          Your FanVoice link
        </p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{displayUrl}</p>
      </div>
      <button
        onClick={handleCopy}
        className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
          copied
            ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
            : 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-500/30'
        }`}
      >
        {copied ? (
          <>
            <Check size={12} />
            Copied!
          </>
        ) : (
          'Copy link'
        )}
      </button>
    </div>
  )
}
