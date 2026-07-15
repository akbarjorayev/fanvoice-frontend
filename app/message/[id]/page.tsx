import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Coins, Clock, CheckCircle2 } from 'lucide-react'
import { getMeServer, getMessage } from '@/lib/api.server'
import { AppHeader, navBtnClass } from '@/components/ui/AppHeader'
import { ReadAloud } from './ReadAloud'
import { creatorAmount, formatPrice } from '@/lib/fees'
import { getUserInfo } from '@/lib/user'
import { FanToCreatorCard } from '@/components/message/FanToCreatorCard'

interface Props {
  params: Promise<{ id: string }>
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export default async function MessagePage({ params }: Props) {
  const { id } = await params
  const [meResult, result] = await Promise.all([
    getMeServer().catch(() => null),
    getMessage(id).catch(() => null),
  ])
  if (!meResult) redirect('/login?expired=1')
  if (!result) notFound()

  const { message: msg } = result
  const userId = meResult.user.id
  const isCreator = userId === msg.creator_id
  const isFan = userId === msg.fan_id
  const isPaid = msg.paid_at !== null

  if (isCreator && !isPaid) notFound()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader
        left={<Link href="/dashboard" className={navBtnClass}><ArrowLeft size={14} />Dashboard</Link>}
        meta={isFan && (
          isPaid ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Paid
            </span>
          ) : (
            <Link href={`/pay/${msg.id}`} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
              <Coins size={13} />
              Pay {formatPrice(msg.price)} so&apos;m
            </Link>
          )
        )}
        user={getUserInfo(meResult.user)}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-8 md:mb-10">
          {msg.title}
        </h1>

        {/* People: From → To */}
        <FanToCreatorCard
          fanName={msg.fan_name}
          fanUsername={msg.fan_username}
          fanAvatarUrl={msg.fan_avatar_url}
          fanVerified={msg.fan_verified}
          fanId={msg.fan_id}
          creatorName={msg.creator_name}
          creatorUsername={msg.creator_username}
          creatorAvatarUrl={msg.creator_avatar_url}
          creatorVerified={msg.creator_verified}
          creatorId={msg.creator_id}
          currentUserId={userId}
          className="mb-8 md:mb-10"
        />

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-gray-800 mb-8 md:mb-10" />

        {/* Message body */}
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-7 sm:leading-8 whitespace-pre-wrap mb-12 md:mb-16">
          {msg.message}
        </p>

        {/* Footer meta */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5 sm:pt-6 flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Coins size={14} className="text-yellow-500 shrink-0" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {isCreator ? formatPrice(creatorAmount(msg.price)) : formatPrice(msg.price)} so&apos;m
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
              {formatDate(msg.created_at)}
            </span>
          </div>
          {msg.read_at && (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500 shrink-0" />
              <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                Read {formatDate(String(msg.read_at))}
              </span>
            </div>
          )}
        </div>

        {/* Waiting banner — shown to the fan after paying, before creator reads */}
        {isFan && isPaid && !msg.read_at && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-4">
            <Clock size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <span className="font-semibold">Waiting for {msg.creator_name} to read this.</span>{' '}
              Your payment is held in escrow — they receive it the moment they deliver.
            </p>
          </div>
        )}

        {/* Read aloud — only shown to the creator while message is unread */}
        {isCreator && !msg.read_at && (
          <ReadAloud messageId={msg.id} messageText={msg.message} />
        )}
      </div>
    </div>
  )
}
