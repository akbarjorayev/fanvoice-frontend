'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, Coins } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { sendMessage } from '@/lib/api'

interface Props {
  creatorId: string
  creatorName: string
  creatorUsername: string
  minPrice: number
}

const inputBase =
  'w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all'

const PLATFORM_MIN = 10_000

export function SendMessageForm({ creatorId, creatorName, creatorUsername, minPrice }: Props) {
  const effectiveMin = Math.max(PLATFORM_MIN, minPrice)
  const effectiveMinThousands = effectiveMin / 1000

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [priceThousands, setPriceThousands] = useState(String(effectiveMinThousands))
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [messageId, setMessageId] = useState<string | null>(null)

  const effectiveMinFormatted = `${String(effectiveMin).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const priceActual = priceThousands === '' ? 0 : (parseInt(priceThousands, 10) || 0) * 1000

    if (priceActual < effectiveMin) {
      setErrorMsg(`Price must be at least ${effectiveMinFormatted}`)
      setStatus('error')
      return
    }

    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await sendMessage({
        creator_id: creatorId,
        title: title.trim(),
        message: message.trim(),
        price: priceActual,
      })
      setMessageId(res.message.id)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'success' && messageId) {
    const priceActual = priceThousands === '' ? 0 : (parseInt(priceThousands, 10) || 0) * 1000
    const priceFormatted = String(priceActual).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

    return (
      <div className="flex flex-col gap-6 py-4">
        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
            <Coins size={16} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Message is ready</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Pay to deliver it to {creatorName}</p>
          </div>
        </div>

        {/* Divider with steps */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Message written</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Pay {priceFormatted} so&apos;m to send
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2">
          <Link
            href={`/pay/${messageId}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-violet-600/20"
          >
            <Coins size={14} />
            Pay now
          </Link>
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center py-3 rounded-full text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Pay later from dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="msg-title" className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Title
        </label>
        <input
          id="msg-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Birthday shoutout"
          maxLength={100}
          required
          className={`${inputBase} h-12 px-5 rounded-full text-sm`}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="msg-body" className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Message
        </label>
        <textarea
          id="msg-body"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
          placeholder={`Write your message to ${creatorName}…`}
          rows={7}
          required
          className={`${inputBase} px-5 py-4 rounded-3xl text-sm resize-none`}
        />
        <p className="text-xs text-gray-400 dark:text-gray-600 text-right">{message.length} / 1000</p>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label htmlFor="msg-price" className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Amount
        </label>
        <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-hidden w-fit focus-within:ring-2 focus-within:ring-violet-500/60 focus-within:border-transparent transition-all">
          <input
            id="msg-price"
            type="number"
            min={effectiveMinThousands}
            value={priceThousands}
            onChange={(e) => setPriceThousands(e.target.value.replace(/\D/g, ''))}
            placeholder={String(effectiveMinThousands)}
            required
            className="w-24 h-12 px-5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="h-12 flex items-center pr-5 pl-4 text-sm text-gray-400 dark:text-gray-500 select-none border-l border-gray-200 dark:border-gray-800">
            000 so&apos;m
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          Minimum: {effectiveMinFormatted}
        </p>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl px-4 py-3">
          {errorMsg}
        </p>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={status === 'sending' || !title.trim() || !message.trim() || !priceThousands}
          className="w-full inline-flex items-center justify-center gap-2 h-13 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-lg shadow-violet-600/20"
        >
          {status === 'sending'
            ? <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 14, height: 14 }} />
            : <Send size={14} />}
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  )
}
