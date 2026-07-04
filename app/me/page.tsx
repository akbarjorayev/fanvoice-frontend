import { redirect } from 'next/navigation'
import { getProfileServer, getSocialLinksServer } from '@/lib/api.server'
import { ProfileCard } from '@/components/profile/ProfileCard'

export default async function MePage() {
  const [profileResult, linksResult] = await Promise.all([
    getProfileServer().catch(() => null),
    getSocialLinksServer().catch(() => ({ links: [] })),
  ])

  if (!profileResult) redirect('/login?expired=1')

  return <ProfileCard user={profileResult.user} links={linksResult.links} />
}
