import { redirect } from 'next/navigation'
import { Send, Inbox, Bell } from 'lucide-react'
import { getMeServer, getProfileServer, getSentMessages, getReceivedMessages, getMessageCounts } from '@/lib/api.server'
import { AvatarMenu } from '@/components/dashboard/AvatarMenu'
import { MessageTabs } from '@/components/dashboard/MessageTabs'

interface Props {
  searchParams: Promise<{ tab?: string; page?: string; sort?: string; read?: string; pay?: string }>
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage({ searchParams }: Props) {
  const result = await getMeServer().catch(() => null)
  if (!result) redirect('/login?expired=1')

  const { user } = result
  const displayName = user.display_name ?? user.email.split('@')[0]
  const initial = displayName.charAt(0).toUpperCase()

  const params = await searchParams
  const tab = params.tab === 'received' ? 'received' : 'sent'
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  const sort = params.sort === 'money' ? 'money' : 'date'
  const read = params.read === 'read' ? 'read' : params.read === 'unread' ? 'unread' : 'all'
  const pay = params.pay === 'paid' ? 'paid' : params.pay === 'unpaid' ? 'unpaid' : 'all'

  const [profileResult, messagesResult, countsResult] = await Promise.allSettled([
    getProfileServer(),
    tab === 'sent' ? getSentMessages(page, 10, read, pay) : getReceivedMessages(page, 10, sort),
    getMessageCounts(),
  ])

  const isCreator = profileResult.status === 'fulfilled' && !!profileResult.value.user.is_creator
  const messages = messagesResult.status === 'fulfilled' ? messagesResult.value.messages : []
  const total = messagesResult.status === 'fulfilled' ? messagesResult.value.total : 0
  const counts = countsResult.status === 'fulfilled'
    ? countsResult.value
    : { sent: 0, received: 0, unread_received: 0 }

  const totalPages = Math.ceil(total / 10)
  if (totalPages > 0 && page > totalPages) {
    redirect(`/dashboard?tab=${tab}&page=${totalPages}&sort=${sort}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 h-14 px-4 sm:px-6 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <span className="font-bold text-gray-900 dark:text-white tracking-tight">FanVoice</span>
        <AvatarMenu displayName={displayName} initial={initial} avatarUrl={user.avatar_url} />
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Greeting + stats */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()},{' '}
          <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
            {displayName}
          </span>
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Send size={13} className="text-violet-400 shrink-0" />
              <strong className="text-gray-900 dark:text-white font-semibold">{counts.sent}</strong>
              &nbsp;sent
            </span>
            {isCreator && (
              <>
                <span className="text-gray-300 dark:text-gray-700 select-none">·</span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Inbox size={13} className="text-blue-400 shrink-0" />
                  <strong className="text-gray-900 dark:text-white font-semibold">{counts.received}</strong>
                  &nbsp;received
                </span>
              </>
            )}
            {isCreator && counts.unread_received > 0 && (
              <>
                <span className="text-gray-300 dark:text-gray-700 select-none">·</span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  <Bell size={13} className="shrink-0" />
                  {counts.unread_received} unread
                </span>
              </>
            )}
          </div>
        </div>

        <MessageTabs
          tab={tab}
          page={page}
          sort={sort}
          read={read}
          pay={pay}
          messages={messages}
          total={total}
          isCreator={isCreator}
          sentCount={counts.sent}
          receivedCount={counts.received}
          unreadReceived={counts.unread_received}
        />
      </main>
    </div>
  )
}
