import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMeServer, getMessage } from '@/lib/api.server'

interface Props {
  params: Promise<{ id: string }>
}

function formatPrice(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default async function SuccessPage({ params }: Props) {
  const { id } = await params
  const meResult = await getMeServer().catch(() => null)
  if (!meResult) redirect('/login?expired=1')

  const result = await getMessage(id).catch(() => null)
  if (!result) redirect('/dashboard')

  const { message: msg } = result
  if (!msg.paid_at) redirect(`/pay/${id}`)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        {/* Tada emoji */}
        <div className="text-7xl select-none animate-bounce">🎉</div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment sent!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your message to{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {msg.creator_name}
            </span>{' '}
            has been paid.
          </p>
        </div>

        {/* Amount pill */}
        <div className="px-5 py-2 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold text-lg">
          {formatPrice(msg.price)} so&apos;m
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full">
          <Link
            href={`/message/${id}`}
            className="w-full sm:w-auto flex-1 text-center px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            View message
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex-1 text-center px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-semibold transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
