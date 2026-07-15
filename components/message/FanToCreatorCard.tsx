import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { YouBadge, VerifiedBadge } from '@/components/ui/UserBadges'

interface FanToCreatorCardProps {
  fanName: string
  fanUsername: string
  fanAvatarUrl: string | null
  fanVerified?: boolean
  fanId: string
  creatorName: string
  creatorUsername: string
  creatorAvatarUrl: string | null
  creatorVerified?: boolean
  creatorId: string
  currentUserId: string
  className?: string
}

export function FanToCreatorCard({
  fanName,
  fanUsername,
  fanAvatarUrl,
  fanVerified,
  fanId,
  creatorName,
  creatorUsername,
  creatorAvatarUrl,
  creatorVerified,
  creatorId,
  currentUserId,
  className = '',
}: FanToCreatorCardProps) {
  return (
    <div className={`flex items-center gap-2 sm:gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ${className}`}>
      {/* Fan */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <Avatar name={fanName} avatarUrl={fanAvatarUrl} size={40} />
        <div className="min-w-0 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
            From
          </p>
          <div className="flex items-center gap-1 min-w-0 flex-wrap">
            <Link
              href={`/u/${fanUsername}`}
              className="text-sm font-semibold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate"
            >
              {fanName}
            </Link>
            {fanVerified && <VerifiedBadge />}
            {currentUserId === fanId && <YouBadge />}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">@{fanUsername}</p>
        </div>
      </div>

      {/* Arrow */}
      <div className="shrink-0 w-7 h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
        <MoveRight size={13} className="text-gray-400 dark:text-gray-500" />
      </div>

      {/* Creator */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <Avatar name={creatorName} avatarUrl={creatorAvatarUrl} size={40} />
        <div className="min-w-0 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
            To
          </p>
          <div className="flex items-center gap-1 min-w-0 flex-wrap">
            <Link
              href={`/u/${creatorUsername}`}
              className="text-sm font-semibold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate"
            >
              {creatorName}
            </Link>
            {creatorVerified && <VerifiedBadge />}
            {currentUserId === creatorId && <YouBadge />}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">@{creatorUsername}</p>
        </div>
      </div>
    </div>
  )
}
