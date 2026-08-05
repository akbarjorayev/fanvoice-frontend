'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { payMessage } from '@/lib/api'
import { useApiErrorMessage } from '@/lib/i18n/useApiErrorMessage'

interface Props {
  messageId: string
  price: number
}

export function PayButton({ messageId, price: _ }: Props) {
  const t = useTranslations('payPage')
  const getApiErrorMessage = useApiErrorMessage()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay() {
    setLoading(true)
    setError(null)
    try {
      await payMessage(messageId)
      setLoading(false)
      setSuccess(true)
      setTimeout(() => router.push(`/success/${messageId}`), 450)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <button
        onClick={handlePay}
        disabled={loading || success}
        className={`w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full disabled:cursor-not-allowed text-base font-bold transition-all duration-300 ${
          success
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900'
        }`}
      >
        {success ? (
          <>
            <Check size={18} className="animate-scale-in" />
            {t('paid')}
          </>
        ) : loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {t('processing')}
          </>
        ) : (
          <>
            {t('confirmAndPay')}
            <ArrowRight size={18} />
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
