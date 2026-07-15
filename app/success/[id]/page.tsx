import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Mic, LayoutDashboard } from 'lucide-react'
import { getMeServer, getMessage } from '@/lib/api.server'
import { AppHeader, navBtnClass } from '@/components/ui/AppHeader'
import { CREATOR_SHARE_PCT, formatPrice } from '@/lib/fees'
import { getUserInfo } from '@/lib/user'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SuccessPage({ params }: Props) {
  const { id } = await params
  const [meResult, result] = await Promise.all([
    getMeServer().catch(() => null),
    getMessage(id).catch(() => null),
  ])
  if (!meResult) redirect('/login?expired=1')
  if (!result) redirect('/dashboard')

  const { message: msg } = result
  if (!msg.paid_at) redirect(`/pay/${id}`)
  if (meResult.user.id !== msg.fan_id) redirect(`/message/${id}`)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <AppHeader
        left={<Link href={`/message/${id}`} className={navBtnClass}><ArrowLeft size={14} />View message</Link>}
        user={getUserInfo(meResult.user)}
      />
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-7 max-w-sm w-full">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 size={30} className="text-emerald-500" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment sent!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your {formatPrice(msg.price)} so&apos;m is held securely in escrow for{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{msg.creator_name}</span>.
            </p>
          </div>

          {/* What happens next */}
          <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 text-left">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">What happens next</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <LayoutDashboard size={12} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Your message is on their dashboard</p>
                  <p className="text-xs text-gray-400 mt-0.5">{msg.creator_name} can see it when they log in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Mic size={12} className="text-fuchsia-600 dark:text-fuchsia-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">They read it to their audience</p>
                  <p className="text-xs text-gray-400 mt-0.5">On stream, in a video, or a personal shoutout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Payout released automatically</p>
                  <p className="text-xs text-gray-400 mt-0.5">They receive {CREATOR_SHARE_PCT}% the moment they mark it read</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <Link
              href={`/message/${id}`}
              className="w-full text-center px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
            >
              View message
            </Link>
            <Link
              href="/dashboard"
              className="w-full text-center px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-semibold transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
