import { redirect } from 'next/navigation'
import { Send, Inbox, Bell, Coins, Banknote } from 'lucide-react'
import { getMeServer, getProfileServer, getSentMessages, getReceivedMessages, getMessageCounts } from '@/lib/api.server'
import { AppHeader } from '@/components/ui/AppHeader'
import { MessageTabs } from '@/components/dashboard/MessageTabs'
import { formatPrice } from '@/lib/fees'
import { getUserInfo } from '@/lib/user'
import { PAGE_SIZE } from '@/lib/constants'

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
  const userInfo = getUserInfo(user)
  const displayName = userInfo.displayName

  const params = await searchParams
  const tab = params.tab === 'received' ? 'received' : 'sent'
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  const sort = params.sort === 'money' ? 'money' : 'date'
  const read = params.read === 'read' ? 'read' : params.read === 'unread' ? 'unread' : 'all'
  const pay = params.pay === 'paid' ? 'paid' : params.pay === 'unpaid' ? 'unpaid' : 'all'

  const [profileResult, messagesResult, countsResult] = await Promise.allSettled([
    getProfileServer(),
    tab === 'sent' ? getSentMessages(page, PAGE_SIZE, read, pay) : getReceivedMessages(page, PAGE_SIZE, sort),
    getMessageCounts(),
  ])

  const isCreator = profileResult.status === 'fulfilled' && !!profileResult.value.user.is_creator
  const messages = messagesResult.status === 'fulfilled' ? messagesResult.value.messages : []
  const total = messagesResult.status === 'fulfilled' ? messagesResult.value.total : 0
  const counts = countsResult.status === 'fulfilled'
    ? countsResult.value
    : { sent: 0, received: 0, unread_received: 0, total_earned: 0 }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  if (totalPages > 0 && page > totalPages) {
    redirect(`/dashboard?tab=${tab}&page=${totalPages}&sort=${sort}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppHeader user={userInfo} />

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

          {isCreator && counts.total_earned > 0 && (
            <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800 px-6 py-6 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30">
              <Banknote
                size={160}
                strokeWidth={1.1}
                className="absolute -bottom-8 -right-8 text-white/10 rotate-[-15deg] pointer-events-none select-none"
              />
              <div className="relative flex items-center gap-1.5 text-xs font-bold text-emerald-50/80 uppercase tracking-widest mb-2">
                <Coins size={13} className="shrink-0" />
                Total earned
              </div>
              <p className="relative text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {formatPrice(counts.total_earned)}
                <span className="text-lg sm:text-xl font-semibold text-emerald-50/70 ml-2">so&apos;m</span>
              </p>
            </div>
          )}
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
