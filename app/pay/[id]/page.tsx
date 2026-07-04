import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Coins } from 'lucide-react'
import { getMeServer, getMessage } from '@/lib/api.server'
import { PayButton } from './PayButton'

interface Props {
  params: Promise<{ id: string }>
}

function formatPrice(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default async function PayPage({ params }: Props) {
  const { id } = await params
  const meResult = await getMeServer().catch(() => null)
  if (!meResult) redirect('/login?expired=1')

  const result = await getMessage(id).catch(() => null)
  if (!result) notFound()

  const { message: msg } = result
  const userId = meResult.user.id

  if (msg.fan_id !== userId) redirect(`/message/${id}`)
  if (msg.paid_at) redirect(`/message/${id}`)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top bar */}
      <div className="border-b border-gray-100 dark:border-gray-800/60 px-4 sm:px-6 h-14 flex items-center">
        <Link
          href={`/message/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to message
        </Link>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 flex flex-col items-center text-center gap-8">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
          <Coins size={28} className="text-violet-600 dark:text-violet-400" />
        </div>

        {/* Message info */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Message to
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {msg.creator_name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            &ldquo;{msg.title}&rdquo;
          </p>
        </div>

        {/* Amount */}
        <div className="w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center gap-1">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold">
            Amount
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {formatPrice(msg.price)}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">so&apos;m</p>
        </div>

        {/* Pay button */}
        <PayButton messageId={msg.id} price={msg.price} />
      </div>
    </div>
  )
}
