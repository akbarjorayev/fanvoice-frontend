import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeCheck, Calendar, ArrowLeft, MessageCircle, Sparkles, Coins } from 'lucide-react'
import { getPublicProfile, getMeServer } from '@/lib/api.server'
import { SocialLinks } from '@/components/profile/SocialLinks'
import { ShareProfileButton } from '@/components/profile/ShareProfileButton'
import { QRButton } from '@/components/profile/QRButton'

interface Props {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const [result, meResult] = await Promise.all([
    getPublicProfile(username).catch(() => null),
    getMeServer().catch(() => null),
  ])

  if (!result) notFound()

  const { user, links } = result
  const isSelf = meResult?.user.username === user.username
  const displayName = user.display_name ?? user.username ?? 'Unknown'
  const initial = displayName.charAt(0).toUpperCase()
  const memberSince = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(user.created_at))
  const creatorSince = user.creator_since
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(user.creator_since))
    : null
  const minPrice = typeof user.creator_min_price === 'number' && user.creator_min_price > 0
    ? `${String(user.creator_min_price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`
    : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Cover band */}
      <div className="h-52 bg-gradient-to-br from-violet-700 via-violet-500 to-fuchsia-500 relative">
        <Link
          href="/"
          className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft size={14} />
          FanVoice
        </Link>
      </div>

      {/* Page body */}
      <div className="max-w-2xl mx-auto px-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-14 mb-5">
          <div className="relative">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={displayName}
                width={112}
                height={112}
                priority
                className="rounded-full ring-4 ring-gray-50 dark:ring-gray-950 object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full ring-4 ring-gray-50 dark:ring-gray-950 bg-gradient-to-br from-white via-violet-400 to-blue-500 flex items-center justify-center">
                <span className="text-4xl font-black text-white drop-shadow">
                  {initial}
                </span>
              </div>
            )}
          </div>

          <div className="mb-2 flex items-center gap-2">
            <QRButton username={user.username ?? ''} />
            <ShareProfileButton username={user.username ?? ''} />
            {user.is_creator && !isSelf && (
              <Link
                href={`/u/${user.username}/send`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <MessageCircle size={15} />
                <span className="sm:hidden">Message</span>
                <span className="hidden sm:inline">Send a message</span>
              </Link>
            )}
          </div>
        </div>

        {/* Name + badge + username */}
        <div className="mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {displayName}
            </h1>
            {user.creator_verified_at && (
              <BadgeCheck size={22} className="text-blue-500 flex-shrink-0" />
            )}
            {user.is_creator && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-xs font-semibold text-violet-600 dark:text-violet-400">
                <Sparkles size={10} />
                Creator
              </span>
            )}
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
        {minPrice && (
          <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
            <Coins size={13} className="text-yellow-500 dark:text-yellow-400 shrink-0" />
            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">From {minPrice} per message</span>
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
            <span>Member since {memberSince}</span>
          </div>
          {creatorSince && (
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
              <Sparkles size={15} className="flex-shrink-0 text-violet-400 dark:text-violet-500" />
              <span>Creator since {creatorSince}</span>
            </div>
          )}
          {user.creator_verified_at && (
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
              <BadgeCheck size={15} className="flex-shrink-0 text-blue-500" />
              <span>Verified since {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(user.creator_verified_at))}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
