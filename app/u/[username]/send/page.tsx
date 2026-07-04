import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BadgeCheck, Coins, Sparkles } from 'lucide-react'
import { getPublicProfile, getMeServer } from '@/lib/api.server'
import { SendMessageForm } from './SendMessageForm'

interface Props {
  params: Promise<{ username: string }>
}

function formatPrice(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default async function SendMessagePage({ params }: Props) {
  const { username } = await params
  const [result, meResult] = await Promise.all([
    getPublicProfile(username).catch(() => null),
    getMeServer().catch(() => null),
  ])

  if (!result || !result.user.is_creator) notFound()

  const { user } = result
  const displayName = user.display_name ?? user.username ?? 'Unknown'
  const minPrice = user.creator_min_price ?? 0
  const isSelf = meResult?.user.username === user.username
  const isVerified = !!user.creator_verified_at
  const initial = displayName.charAt(0).toUpperCase()

  if (isSelf) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">🪞</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Hey, speak to the mirror!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            You can&apos;t send a message to yourself, {displayName}. That&apos;s what diaries are for 😄
          </p>
          <Link
            href={`/u/${username}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={14} />
            Back to your profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top bar */}
      <div className="border-b border-gray-100 dark:border-gray-800/60 px-4 sm:px-6 h-14 flex items-center">
        <Link
          href={`/u/${username}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to profile
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-14 lg:gap-24">

          {/* Creator info panel */}
          <div className="md:sticky md:top-14 self-start">

            {/* Mobile: horizontal row — Desktop: vertical stack */}
            <div className="flex md:block items-center gap-4">
              {/* Avatar */}
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={displayName}
                  width={72}
                  height={72}
                  className="rounded-full object-cover shrink-0 w-14 h-14 md:w-[72px] md:h-[72px] md:mb-5"
                />
              ) : (
                <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-gradient-to-br from-white via-violet-400 to-blue-500 flex items-center justify-center shrink-0 md:mb-5">
                  <span className="text-xl md:text-2xl font-bold text-white">{initial}</span>
                </div>
              )}

              {/* Name block */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {displayName}
                  </h2>
                  {isVerified && (
                    <BadgeCheck size={16} className="text-blue-500 shrink-0" />
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-xs font-semibold text-violet-600 dark:text-violet-400 shrink-0">
                    <Sparkles size={10} />
                    Creator
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">@{user.username}</p>

                {/* Mobile-only min price */}
                {minPrice > 0 && (
                  <div className="flex md:hidden mt-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
                      <Coins size={13} className="text-yellow-500 dark:text-yellow-400 shrink-0" />
                      <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">From {formatPrice(minPrice)} so&apos;m</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop-only extras */}
            {user.creator_bio && (
              <pre className="hidden md:block mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-sans">
                {user.creator_bio}
              </pre>
            )}

            {minPrice > 0 && (
              <div className="hidden md:block mt-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
                  <Coins size={13} className="text-yellow-500 dark:text-yellow-400 shrink-0" />
                  <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">From {formatPrice(minPrice)} so&apos;m per message</span>
                </div>
              </div>
            )}

          </div>

          {/* Form */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Send a message
            </h1>
            <SendMessageForm
              creatorId={user.id}
              creatorName={displayName}
              creatorUsername={user.username ?? username}
              minPrice={minPrice}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
