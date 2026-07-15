import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getProfileServer, getSocialLinksServer } from '@/lib/api.server'
import { AppHeader, navBtnClass } from '@/components/ui/AppHeader'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { getUserInfo } from '@/lib/user'

export default async function MePage() {
  const [profileResult, linksResult] = await Promise.all([
    getProfileServer().catch(() => null),
    getSocialLinksServer().catch(() => ({ links: [] })),
  ])

  if (!profileResult) redirect('/login?expired=1')

  const u = profileResult.user
  const userInfo = getUserInfo(u)

  return (
    <>
      <AppHeader
        left={<Link href="/dashboard" className={navBtnClass}><ArrowLeft size={14} />Dashboard</Link>}
        user={userInfo}
      />
      <ProfileCard user={u} links={linksResult.links} />
    </>
  )
}
