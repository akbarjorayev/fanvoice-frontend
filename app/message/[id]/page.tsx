import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Coins, Clock, CheckCircle2, MoveRight, BadgeCheck } from 'lucide-react'
import { getMeServer, getMessage } from '@/lib/api.server'
import { ReadAloud } from './ReadAloud'

interface Props {
  params: Promise<{ id: string }>
}

function parseDate(dateStr: string): Date {
  const normalized = dateStr.includes('Z') || dateStr.includes('+')
    ? dateStr
    : dateStr.replace(' ', 'T') + 'Z'
  return new Date(normalized)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parseDate(dateStr))
}

function formatPrice(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function Avatar({ name, avatarUrl, size }: { name: string; avatarUrl: string | null; size: number }) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-white via-violet-400 to-blue-500 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="font-bold text-white" style={{ fontSize: size * 0.35 }}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

function YouBadge() {
  return (
    <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
      you
    </span>
  )
}

function VerifiedBadge() {
  return <BadgeCheck size={15} className="shrink-0 text-blue-500" />
}

export default async function MessagePage({ params }: Props) {
  const { id } = await params
  const meResult = await getMeServer().catch(() => null)
  if (!meResult) redirect('/login?expired=1')

  const result = await getMessage(id).catch(() => null)
  if (!result) notFound()

  const { message: msg } = result
  const userId = meResult.user.id
  const isCreator = userId === msg.creator_id
  const isFan = userId === msg.fan_id
  const isPaid = msg.paid_at !== null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top bar */}
      <div className="border-b border-gray-100 dark:border-gray-800/60 px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        {isFan && (
          isPaid ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Paid
            </span>
          ) : (
            <Link
              href={`/pay/${msg.id}`}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
            >
              <Coins size={13} />
              Pay {formatPrice(msg.price)} so&apos;m
            </Link>
          )
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-8 md:mb-10">
          {msg.title}
        </h1>

        {/* People: From → To */}
        <div className="flex items-center gap-2 sm:gap-4 mb-8 md:mb-10 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          {/* Fan */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Avatar name={msg.fan_name} avatarUrl={msg.fan_avatar_url} size={40} />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
                From
              </p>
              <div className="flex items-center gap-1 min-w-0 flex-wrap">
                <Link
                  href={`/u/${msg.fan_username}`}
                  className="text-sm font-semibold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate"
                >
                  {msg.fan_name}
                </Link>
                {msg.fan_verified && <VerifiedBadge />}
                {userId === msg.fan_id && <YouBadge />}
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">@{msg.fan_username}</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="shrink-0 w-7 h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
            <MoveRight size={13} className="text-gray-400 dark:text-gray-500" />
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Avatar name={msg.creator_name} avatarUrl={msg.creator_avatar_url} size={40} />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
                To
              </p>
              <div className="flex items-center gap-1 min-w-0 flex-wrap">
                <Link
                  href={`/u/${msg.creator_username}`}
                  className="text-sm font-semibold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate"
                >
                  {msg.creator_name}
                </Link>
                {msg.creator_verified && <VerifiedBadge />}
                {userId === msg.creator_id && <YouBadge />}
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">@{msg.creator_username}</p>
            </div>
          </div>
        </div>

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
              {formatPrice(msg.price)} so&apos;m
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

        {/* Read aloud — only shown to the creator while message is unread */}
        {isCreator && !msg.read_at && (
          <ReadAloud messageId={msg.id} messageText={msg.message} />
        )}
      </div>
    </div>
  )
}
