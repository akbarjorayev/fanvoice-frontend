import Image from 'next/image'
import Link from 'next/link'
import { AvatarMenu } from '@/components/dashboard/AvatarMenu'
import type { UserInfo } from '@/lib/user'

interface AppHeaderProps {
  left?: React.ReactNode
  meta?: React.ReactNode
  user?: UserInfo | null
}

export function AppHeader({ left, meta, user }: AppHeaderProps) {
  return (
    <header className="sticky top-[20px] z-40 h-14 px-4 sm:px-6 flex items-center justify-between gap-4 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl">
      <div className="shrink-0">
        {left ?? (
          <Link href="/" className="flex items-center gap-2">
            <Image src="/fanvoice-logo.png" alt="FanVoice" width={26} height={26} className="rounded-md" />
            <span className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">FanVoice</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {meta}
        {user && (
          <AvatarMenu
            displayName={user.displayName}
            initial={user.initial}
            avatarUrl={user.avatarUrl}
            username={user.username}
          />
        )}
      </div>
    </header>
  )
}

export const navBtnClass =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors'
