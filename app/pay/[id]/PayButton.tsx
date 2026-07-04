'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Coins } from 'lucide-react'
import { payMessage } from '@/lib/api'

interface Props {
  messageId: string
  price: number
}

function formatPrice(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function PayButton({ messageId, price }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay() {
    setLoading(true)
    setError(null)
    try {
      await payMessage(messageId)
      router.push(`/success/${messageId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handlePay}
        disabled={loading}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-base font-semibold transition-colors"
      >
        <Coins size={16} />
        {loading ? 'Processing…' : `Pay ${formatPrice(price)} so'm`}
      </button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
