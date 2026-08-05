import { redirect } from 'next/navigation'
import { Send, Inbox, Bell } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getMeServer, getProfileServer, getSentMessages, getReceivedMessages, getMessageCounts } from '@/lib/api.server'
import { AppHeader } from '@/components/ui/AppHeader'
import { MessageTabs } from '@/components/dashboard/MessageTabs'
import { TotalEarnedCard } from '@/components/dashboard/TotalEarnedCard'
import { Greeting } from '@/components/dashboard/Greeting'
import { getUserInfo } from '@/lib/user'
import { getGreetingKey } from '@/lib/greeting'
import { PAGE_SIZE } from '@/lib/constants'

interface Props {
  searchParams: Promise<{ tab?: string; page?: string; sort?: string; read?: string; pay?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const t = await getTranslations('dashboard')
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
    tab === 'sent' ? getSentMessages(page, PAGE_SIZE, read, pay) : getReceivedMessages(page, PAGE_SIZE, sort, read),
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
    const overflowParams = new URLSearchParams({ tab, page: String(totalPages) })
    if (tab === 'sent') {
      if (read !== 'all') overflowParams.set('read', read)
      if (pay !== 'all') overflowParams.set('pay', pay)
    } else {
      overflowParams.set('sort', sort)
      if (read !== 'all') overflowParams.set('read', read)
    }
    redirect(`/dashboard?${overflowParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppHeader user={userInfo} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Greeting + stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            <Greeting initialKey={getGreetingKey(new Date())} />,{' '}
          <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
            {displayName}
          </span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 pl-2 pr-3.5 py-1.5 shadow-sm">
              <span className="flex items-center justify-center size-6 rounded-full bg-violet-100 dark:bg-violet-500/15 shrink-0">
                <Send size={12} className="text-violet-500 dark:text-violet-400" />
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white font-semibold">{counts.sent}</strong> {t('sent')}
              </span>
            </span>
            {isCreator && (
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 pl-2 pr-3.5 py-1.5 shadow-sm">
                <span className="flex items-center justify-center size-6 rounded-full bg-blue-100 dark:bg-blue-500/15 shrink-0">
                  <Inbox size={12} className="text-blue-500 dark:text-blue-400" />
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white font-semibold">{counts.received}</strong> {t('received')}
                </span>
              </span>
            )}
            {isCreator && counts.unread_received > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 pl-2 pr-3.5 py-1.5 shadow-sm">
                <span className="flex items-center justify-center size-6 rounded-full bg-amber-100 dark:bg-amber-500/20 shrink-0">
                  <Bell size={12} className="text-amber-600 dark:text-amber-400" />
                </span>
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {counts.unread_received} {t('unread')}
                </span>
              </span>
            )}
          </div>
          </div>

          {isCreator && counts.total_earned > 0 && (
            <TotalEarnedCard totalEarned={counts.total_earned} />
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
