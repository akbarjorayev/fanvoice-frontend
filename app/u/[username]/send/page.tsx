import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BadgeCheck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getPublicProfile, getMeServer } from '@/lib/api.server'
import { AppHeader, navBtnClass } from '@/components/ui/AppHeader'
import { SendMessageForm } from './SendMessageForm'
import { Avatar } from '@/components/ui/Avatar'
import { CreatorBadge, MinPricePill } from '@/components/ui/UserBadges'
import { getUserInfoOrNull } from '@/lib/user'

interface Props {
  params: Promise<{ username: string }>
}

export default async function SendMessagePage({ params }: Props) {
  const { username } = await params
  const t = await getTranslations('sendMessagePage')
  const tPublicProfile = await getTranslations('publicProfile')
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

  if (isSelf) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">🪞</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t('mirrorTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            {t('mirrorDescription', { name: displayName })}
          </p>
          <Link
            href={`/u/${username}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={14} />
            {t('backToYourProfile')}
          </Link>
        </div>
      </div>
    )
  }

  const meUserInfo = getUserInfoOrNull(meResult?.user)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader
        left={<Link href={`/u/${username}`} className={navBtnClass}><ArrowLeft size={14} />{t('backToProfile')}</Link>}
        user={meUserInfo}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-14 lg:gap-24">

          {/* Creator info panel */}
          <div className="md:sticky md:top-14 self-start">

            {/* Mobile: horizontal row — Desktop: vertical stack */}
            <div className="flex md:block items-center gap-4">
              <Avatar
                name={displayName}
                avatarUrl={user.avatar_url}
                size={72}
                sizeClassName="w-14 h-14 md:w-[72px] md:h-[72px]"
                className="md:mb-5"
                textClassName="text-xl md:text-2xl font-bold"
              />

              {/* Name block */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {displayName}
                  </h2>
                  {isVerified && (
                    <BadgeCheck size={16} className="text-blue-500 shrink-0" />
                  )}
                  <CreatorBadge />
                </div>
                <p className="text-sm text-gray-400 mt-0.5">@{user.username}</p>

                {/* Mobile-only min price */}
                {minPrice > 0 && (
                  <div className="flex md:hidden mt-2">
                    <MinPricePill price={minPrice} />
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
                <MinPricePill price={minPrice} suffix={tPublicProfile('perMessage')} />
              </div>
            )}

          </div>

          {/* Form */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t('title')}
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
