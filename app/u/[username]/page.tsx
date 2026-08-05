import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeCheck, Calendar, MessageCircle, Sparkles } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getPublicProfile, getMeServer } from '@/lib/api.server'
import { AppHeader } from '@/components/ui/AppHeader'
import { SocialLinks } from '@/components/profile/SocialLinks'
import { ShareProfileButton } from '@/components/profile/ShareProfileButton'
import { QRButton } from '@/components/profile/QRButton'
import { Avatar } from '@/components/ui/Avatar'
import { CreatorBadge, MinPricePill } from '@/components/ui/UserBadges'
import { getUserInfoOrNull } from '@/lib/user'
import { formatLongMonthYear, type DateNames } from '@/lib/i18n/formatDate'

interface Props {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const t = await getTranslations('publicProfile')
  const tDates = await getTranslations('dates')
  const dateNames: DateNames = {
    monthsShort: tDates.raw('monthsShort'),
    monthsLong: tDates.raw('monthsLong'),
    monthsLongGenitive: tDates.raw('monthsLongGenitive'),
    weekdaysShort: tDates.raw('weekdaysShort'),
  }
  const [result, meResult] = await Promise.all([
    getPublicProfile(username).catch(() => null),
    getMeServer().catch(() => null),
  ])

  if (!result) notFound()

  const { user, links } = result
  const isSelf = meResult?.user.username === user.username
  const displayName = user.display_name ?? user.username ?? 'Unknown'
  const memberSince = formatLongMonthYear(new Date(user.created_at), dateNames)
  const creatorSince = user.creator_since
    ? formatLongMonthYear(new Date(user.creator_since), dateNames)
    : null
  const minPrice = user.creator_min_price ?? 0

  const meUserInfo = getUserInfoOrNull(meResult?.user)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppHeader user={meUserInfo} />
      {/* Cover band */}
      <div className="h-52 bg-gradient-to-br from-violet-700 via-violet-500 to-fuchsia-500" />

      {/* Page body */}
      <div className="max-w-2xl mx-auto px-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-14 mb-5">
          <Avatar
            name={displayName}
            avatarUrl={user.avatar_url}
            size={112}
            priority
            className="ring-4 ring-gray-50 dark:ring-gray-950"
            textClassName="text-4xl font-black drop-shadow"
          />

          <div className="mb-2 flex items-center gap-2">
            <QRButton username={user.username ?? ''} />
            <ShareProfileButton username={user.username ?? ''} />
            {user.is_creator && !isSelf && (
              <Link
                href={`/u/${user.username}/send`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <MessageCircle size={15} />
                <span className="sm:hidden">{t('message')}</span>
                <span className="hidden sm:inline">{t('sendAMessage')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* FanVoice explainer — shown to non-self visitors on a creator profile */}
        {user.is_creator && !isSelf && (
          <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-violet-50 dark:bg-violet-950/50 border border-violet-100 dark:border-violet-800/40">
            <MessageCircle size={14} className="text-violet-500 shrink-0 mt-0.5" />
            <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
              {t.rich('explainer', { name: displayName, b: (chunks) => <span className="font-semibold">{chunks}</span> })}
            </p>
          </div>
        )}

        {/* Name + badge + username */}
        <div className="mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {displayName}
            </h1>
            {user.creator_verified_at && (
              <BadgeCheck size={22} className="text-blue-500 flex-shrink-0" />
            )}
            {user.is_creator && <CreatorBadge />}
          </div>
          {user.username && (
            <p className="text-gray-400 dark:text-gray-500 mt-1">@{user.username}</p>
          )}
        </div>

        {/* Bio */}
        {user.creator_bio && (
          <pre className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 font-sans whitespace-pre-wrap">
            {user.creator_bio}
          </pre>
        )}

        {/* Min price — shown right after bio */}
        {minPrice > 0 && (
          <div className="mb-5">
            <MinPricePill price={minPrice} suffix={t('perMessage')} />
          </div>
        )}

        {/* Social links */}
        {links.length > 0 && (
          <div className="mb-6">
            <SocialLinks links={links} />
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

        {/* Info rows */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
            <Calendar size={15} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
            <span>{t('memberSince', { date: memberSince })}</span>
          </div>
          {creatorSince && (
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
              <Sparkles size={15} className="flex-shrink-0 text-violet-400 dark:text-violet-500" />
              <span>{t('creatorSince', { date: creatorSince })}</span>
            </div>
          )}
          {user.creator_verified_at && (
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
              <BadgeCheck size={15} className="flex-shrink-0 text-blue-500" />
              <span>{t('verifiedSince', { date: formatLongMonthYear(new Date(user.creator_verified_at), dateNames) })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
