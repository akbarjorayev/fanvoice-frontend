'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Inbox, Send, Sparkles, ChevronLeft, ChevronRight, Coins, Clock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { SentMessage, ReceivedMessage } from '@/types/message'
import { formatPrice } from '@/lib/fees'
import { Avatar } from '@/components/ui/Avatar'
import { PAGE_SIZE } from '@/lib/constants'
import { formatShortDate, type DateNames } from '@/lib/i18n/formatDate'
import type { Locale } from '@/lib/i18n/config'

interface Props {
  tab: 'sent' | 'received'
  page: number
  sort: 'date' | 'money'
  read: 'all' | 'read' | 'unread'
  pay: 'all' | 'paid' | 'unpaid'
  messages: SentMessage[] | ReceivedMessage[]
  total: number
  isCreator: boolean
  sentCount: number
  receivedCount: number
  unreadReceived: number
}

function formatMessageDate(
  dateStr: string,
  locale: Locale,
  t: ReturnType<typeof useTranslations>,
  dateNames: DateNames,
): string {
  const date = new Date(dateStr)
  const now = new Date()
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((today.getTime() - dateDay.getTime()) / 86400000)
  if (diffDays === 0) return t('today')
  if (diffDays === 1) return t('yesterday')
  return formatShortDate(date, locale, dateNames)
}

function useSlidingPill(getActiveEl: () => HTMLElement | null, deps: React.DependencyList) {
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    const el = getActiveEl()
    const container = el?.parentElement
    if (!el || !container) return

    function measure() {
      const current = getActiveEl()
      if (current) setPill({ left: current.offsetLeft, width: current.offsetWidth })
    }
    measure()

    // Re-measure on any width change within the pill row — covers locale
    // switches (text length changes), font loading, and count-badge digits,
    // not just the `deps` that changed which button is active.
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return pill
}

function pageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const show = new Set([1, total, current - 1, current, current + 1].filter(p => p >= 1 && p <= total))
  const sorted = Array.from(show).sort((a, b) => a - b)
  const result: (number | '...')[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}

function StatusPills({
  message,
  isPaid,
  nowrap,
}: {
  message: SentMessage | ReceivedMessage
  isPaid: boolean
  nowrap?: boolean
}) {
  const t = useTranslations('messageTabs')
  const nw = nowrap ? ' whitespace-nowrap' : ''
  return (
    <>
      {message.read_at ? (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400${nw}`}>
          <span className="w-1 h-1 rounded-full bg-blue-500" />
          {t('read')}
        </span>
      ) : (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400${nw}`}>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          {t('unread')}
        </span>
      )}
      {isPaid ? (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400${nw}`}>
          <span className="w-1 h-1 rounded-full bg-green-500" />
          {t('paid')}
        </span>
      ) : (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400${nw}`}>
          <Clock size={9} />
          {t('unpaid')}
        </span>
      )}
    </>
  )
}

function PillGroup<T extends string>({
  options,
  value,
}: {
  options: { value: T; label: string; href: string }[]
  value: T
}) {
  const btnRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const activeIdx = options.findIndex((o) => o.value === value)
  const pill = useSlidingPill(() => btnRefs.current[activeIdx] ?? null, [activeIdx])

  return (
    <div className="relative flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-gray-800/60 rounded-full">
      {pill && (
        <div
          className="absolute top-0.5 bottom-0.5 bg-white dark:bg-gray-900 rounded-full shadow-sm transition-all duration-200 ease-out"
          style={{ left: pill.left, width: pill.width }}
        />
      )}
      {options.map((opt, i) => (
        <Link
          key={opt.value}
          href={opt.href}
          ref={(el) => { btnRefs.current[i] = el }}
          className={`relative z-10 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 ${
            value === opt.value
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  )
}

export function MessageTabs({
  tab,
  page,
  sort,
  read,
  pay,
  messages,
  total,
  isCreator,
  sentCount,
  receivedCount,
  unreadReceived,
}: Props) {
  const t = useTranslations('messageTabs')
  const tDates = useTranslations('dates')
  const locale = useLocale() as Locale
  const dateNames: DateNames = {
    monthsShort: tDates.raw('monthsShort'),
    monthsLong: tDates.raw('monthsLong'),
    monthsLongGenitive: tDates.raw('monthsLongGenitive'),
    weekdaysShort: tDates.raw('weekdaysShort'),
  }
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const sentBtnRef = useRef<HTMLAnchorElement>(null)
  const receivedBtnRef = useRef<HTMLAnchorElement>(null)
  const pill = useSlidingPill(
    () => (tab === 'sent' ? sentBtnRef.current : receivedBtnRef.current),
    [tab],
  )

  function buildHref(
    newTab: 'sent' | 'received',
    newPage: number,
    newSort = sort,
    newRead = read,
    newPay = pay,
  ) {
    const params = new URLSearchParams({ tab: newTab, page: String(newPage) })
    if (newTab === 'received') {
      params.set('sort', newSort)
      if (newRead !== 'all') params.set('read', newRead)
    } else {
      if (newRead !== 'all') params.set('read', newRead)
      if (newPay !== 'all') params.set('pay', newPay)
    }
    return `/dashboard?${params.toString()}`
  }

  return (
    <div>
      {/* Tab bar + filters row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        {/* Sent / Received tab switcher */}
        <div className="relative flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-full w-fit">
          {pill && (
            <div
              className="absolute top-1 bottom-1 bg-white dark:bg-gray-900 rounded-full shadow-sm transition-all duration-200 ease-out"
              style={{ left: pill.left, width: pill.width }}
            />
          )}
          <Link
            ref={sentBtnRef}
            href={buildHref('sent', 1)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
              tab === 'sent'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Send size={14} />
            {t('sent')}
            {sentCount > 0 && (
              <span className="ml-0.5 min-w-[20px] h-5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1 rounded-full inline-flex items-center justify-center leading-none">
                {sentCount}
              </span>
            )}
          </Link>

          <Link
            ref={receivedBtnRef}
            href={buildHref('received', 1)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
              tab === 'received'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Inbox size={14} />
            {t('received')}
            {isCreator && unreadReceived > 0 && (
              <span className="ml-0.5 min-w-[20px] h-5 text-xs bg-amber-500 text-white px-1 rounded-full inline-flex items-center justify-center leading-none">
                {unreadReceived}
              </span>
            )}
            {isCreator && unreadReceived === 0 && receivedCount > 0 && (
              <span className="ml-0.5 min-w-[20px] h-5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1 rounded-full inline-flex items-center justify-center leading-none">
                {receivedCount}
              </span>
            )}
          </Link>
        </div>

        {/* Filters — sent tab only, hidden when no messages and no active filter */}
        {tab === 'sent' && (messages.length > 0 || read !== 'all' || pay !== 'all') && (
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <PillGroup
              options={[
                { value: 'all', label: t('all'), href: buildHref('sent', 1, sort, 'all', pay) },
                { value: 'read', label: t('read'), href: buildHref('sent', 1, sort, 'read', pay) },
                { value: 'unread', label: t('unread'), href: buildHref('sent', 1, sort, 'unread', pay) },
              ]}
              value={read}
            />
            <PillGroup
              options={[
                { value: 'all', label: t('all'), href: buildHref('sent', 1, sort, read, 'all') },
                { value: 'paid', label: t('paid'), href: buildHref('sent', 1, sort, read, 'paid') },
                { value: 'unpaid', label: t('unpaid'), href: buildHref('sent', 1, sort, read, 'unpaid') },
              ]}
              value={pay}
            />
          </div>
        )}

        {/* Filters + sort — received tab only, hidden when no messages and no active filter */}
        {tab === 'received' && isCreator && (messages.length > 0 || read !== 'all') && (
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <PillGroup
              options={[
                { value: 'all', label: t('all'), href: buildHref('received', 1, sort, 'all') },
                { value: 'read', label: t('read'), href: buildHref('received', 1, sort, 'read') },
                { value: 'unread', label: t('unread'), href: buildHref('received', 1, sort, 'unread') },
              ]}
              value={read}
            />
            <PillGroup
              options={[
                { value: 'date', label: t('latest'), href: buildHref('received', 1, 'date', read) },
                { value: 'money', label: t('mostPaid'), href: buildHref('received', 1, 'money', read) },
              ]}
              value={sort}
            />
          </div>
        )}
      </div>

      {/* Received — not a creator */}
      {tab === 'received' && !isCreator ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
            <Sparkles size={20} className="text-violet-500" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('notCreatorYet')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t('becomeCreatorHint')}
          </p>
          <Link
            href="/me?becomecreator=1"
            className="mt-4 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
          >
            {t('setUpCreatorProfile')}
          </Link>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            {tab === 'sent' ? (
              <Send size={22} className="text-gray-400" />
            ) : (
              <Inbox size={22} className="text-gray-400" />
            )}
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {tab === 'sent' ? t('noSentMessages') : t('noMessages')}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
            {tab === 'sent'
              ? t('findCreatorHint')
              : t('shareProfileHint')}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
          <div className="divide-y divide-gray-50 dark:divide-gray-800/80">
            {messages.map((msg) => {
              const name =
                tab === 'sent'
                  ? (msg as SentMessage).creator_name
                  : (msg as ReceivedMessage).fan_name
              const username =
                tab === 'sent'
                  ? (msg as SentMessage).creator_username
                  : (msg as ReceivedMessage).fan_username
              const avatarUrl =
                tab === 'sent'
                  ? (msg as SentMessage).creator_avatar_url
                  : (msg as ReceivedMessage).fan_avatar_url
              const isUnread = tab === 'received' && msg.read_at === null
              const isPaid = tab === 'sent' ? (msg as SentMessage).paid_at !== null : true
              const displayPrice = tab === 'received' ? (msg as ReceivedMessage).creator_earning : msg.price

              return (
                <Link
                  key={msg.id}
                  href={`/message/${msg.id}`}
                  className="flex items-start gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 active:bg-gray-100 dark:active:bg-gray-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-inset transition-colors"
                >
                  <Avatar name={name} avatarUrl={avatarUrl} size={40} variant="hashed" textClassName="font-bold text-sm select-none" />

                  <div className="flex-1 min-w-0">
                    {/* Row 1: name + time */}
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                          {name}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline truncate">
                          @{username}
                        </span>
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">
                        {formatMessageDate(msg.created_at, locale, t, dateNames)}
                      </span>
                    </div>

                    {/* Row 2: title + badges (desktop) / title only (mobile) */}
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-base truncate ${
                          isUnread
                            ? 'font-bold text-gray-900 dark:text-white'
                            : 'font-medium text-gray-800 dark:text-gray-100'
                        }`}
                      >
                        {msg.title}
                      </p>
                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                          <Coins size={11} />
                          {formatPrice(displayPrice)}
                        </span>
                        {tab === 'sent' && <StatusPills message={msg} isPaid={isPaid} nowrap />}
                      </div>
                    </div>

                    {/* Row 3: badges on mobile only */}
                    <div className="flex items-center gap-1.5 mt-1 sm:hidden">
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <Coins size={10} />
                        {formatPrice(msg.price)}
                      </span>
                      {tab === 'sent' && <StatusPills message={msg} isPaid={isPaid} />}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t('pageOf', { page, total: totalPages })}
              </p>
              <div className="flex items-center gap-1">
                {page === 1 ? (
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700 cursor-not-allowed">
                    <ChevronLeft size={14} />
                  </span>
                ) : (
                  <Link
                    href={buildHref(tab, page - 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </Link>
                )}
                {pageNumbers(page, totalPages).map((p, i) =>
                  p === '...'
                    ? <span key={`ellipsis-${i}`} className="w-7 text-center text-xs text-gray-400 dark:text-gray-600">…</span>
                    : (
                      <Link
                        key={p}
                        href={buildHref(tab, p)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                          p === page
                            ? 'bg-violet-600 text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {p}
                      </Link>
                    )
                )}
                {page === totalPages ? (
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700 cursor-not-allowed">
                    <ChevronRight size={14} />
                  </span>
                ) : (
                  <Link
                    href={buildHref(tab, page + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
