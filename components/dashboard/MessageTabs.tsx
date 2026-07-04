'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Inbox, Send, Sparkles, ChevronLeft, ChevronRight, Coins, Clock } from 'lucide-react'
import type { SentMessage, ReceivedMessage } from '@/types/message'

const PER_PAGE = 10

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

function parseDate(dateStr: string): Date {
  // DB returns bare timestamps without timezone — append Z to force UTC parsing
  const normalized = dateStr.includes('Z') || dateStr.includes('+')
    ? dateStr
    : dateStr.replace(' ', 'T') + 'Z'
  return new Date(normalized)
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - parseDate(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(parseDate(dateStr))
}

function formatPrice(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const GRADIENTS = [
  'from-violet-400 to-purple-600',
  'from-blue-400 to-cyan-500',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-indigo-400 to-blue-600',
  'from-teal-400 to-green-600',
  'from-red-400 to-pink-600',
]

function avatarGradient(name: string) {
  return GRADIENTS[name.toLowerCase().charCodeAt(0) % GRADIENTS.length]
}

function AvatarInitial({ name }: { name: string }) {
  return (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient(name)} flex items-center justify-center shrink-0 text-white font-bold text-sm select-none`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value)
    const btn = btnRefs.current[idx]
    if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [value, options])

  return (
    <div className="relative flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-gray-800/60 rounded-full">
      {pill && (
        <div
          className="absolute top-0.5 bottom-0.5 bg-white dark:bg-gray-900 rounded-full shadow-sm transition-all duration-200 ease-out"
          style={{ left: pill.left, width: pill.width }}
        />
      )}
      {options.map((opt, i) => (
        <button
          key={opt.value}
          ref={(el) => { btnRefs.current[i] = el }}
          onClick={() => onChange(opt.value)}
          className={`relative z-10 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 ${
            value === opt.value
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {opt.label}
        </button>
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
  const router = useRouter()
  const totalPages = Math.ceil(total / PER_PAGE)

  const sentBtnRef = useRef<HTMLButtonElement>(null)
  const receivedBtnRef = useRef<HTMLButtonElement>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    const activeBtn = tab === 'sent' ? sentBtnRef.current : receivedBtnRef.current
    if (activeBtn) setPill({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth })
  }, [tab])

  function navigate(
    newTab: 'sent' | 'received',
    newPage: number,
    newSort = sort,
    newRead = read,
    newPay = pay,
  ) {
    const params = new URLSearchParams({ tab: newTab, page: String(newPage) })
    if (newTab === 'received') {
      params.set('sort', newSort)
    } else {
      if (newRead !== 'all') params.set('read', newRead)
      if (newPay !== 'all') params.set('pay', newPay)
    }
    router.push(`/dashboard?${params.toString()}`)
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
          <button
            ref={sentBtnRef}
            onClick={() => navigate('sent', 1)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
              tab === 'sent'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Send size={14} />
            Sent
            {sentCount > 0 && (
              <span className="ml-0.5 min-w-[20px] h-5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1 rounded-full inline-flex items-center justify-center leading-none">
                {sentCount}
              </span>
            )}
          </button>

          <button
            ref={receivedBtnRef}
            onClick={() => navigate('received', 1)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
              tab === 'received'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Inbox size={14} />
            Received
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
          </button>
        </div>

        {/* Filters — sent tab only, hidden when no messages and no active filter */}
        {tab === 'sent' && (messages.length > 0 || read !== 'all' || pay !== 'all') && (
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <PillGroup
              options={[
                { value: 'all', label: 'All' },
                { value: 'read', label: 'Read' },
                { value: 'unread', label: 'Unread' },
              ]}
              value={read}
              onChange={(v) => navigate('sent', 1, sort, v, pay)}
            />
            <PillGroup
              options={[
                { value: 'all', label: 'All' },
                { value: 'paid', label: 'Paid' },
                { value: 'unpaid', label: 'Unpaid' },
              ]}
              value={pay}
              onChange={(v) => navigate('sent', 1, sort, read, v)}
            />
          </div>
        )}

        {/* Sort — received tab only */}
        {tab === 'received' && isCreator && (
          <PillGroup
            options={[
              { value: 'date', label: 'Latest' },
              { value: 'money', label: 'Most paid' },
            ]}
            value={sort}
            onChange={(v) => navigate('received', 1, v)}
          />
        )}
      </div>

      {/* Received — not a creator */}
      {tab === 'received' && !isCreator ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
            <Sparkles size={20} className="text-violet-500" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You&apos;re not a creator yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Become a creator to receive messages from fans
          </p>
          <Link
            href="/me?becomecreator=1"
            className="mt-4 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
          >
            Set up creator profile
          </Link>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            {tab === 'sent' ? (
              <Send size={22} className="text-gray-400" />
            ) : (
              <Inbox size={22} className="text-gray-400" />
            )}
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {tab === 'sent' ? 'No sent messages yet' : 'No messages yet'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
            {tab === 'sent'
              ? 'Find a creator and send them your first message'
              : 'Share your profile link so fans can reach you'}
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
              const isUnread = tab === 'received' && msg.read_at === null
              const isPaid = tab === 'sent' ? (msg as SentMessage).paid_at !== null : true

              return (
                <div
                  key={msg.id}
                  onClick={() => router.push(`/message/${msg.id}`)}
                  className="flex items-start gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
                >
                  <AvatarInitial name={name} />

                  <div className="flex-1 min-w-0">
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
                        {timeAgo(msg.created_at)}
                      </span>
                    </div>

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
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                          <Coins size={11} />
                          {formatPrice(msg.price)}
                        </span>
                        {tab === 'sent' && (
                          <>
                            {msg.read_at ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                <span className="w-1 h-1 rounded-full bg-blue-500" />
                                Read
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                Unread
                              </span>
                            )}
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 whitespace-nowrap">
                                <span className="w-1 h-1 rounded-full bg-green-500" />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 whitespace-nowrap">
                                <Clock size={9} />
                                Unpaid
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate(tab, page - 1)}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => navigate(tab, p)}
                    className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                      p === page
                        ? 'bg-violet-600 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => navigate(tab, page + 1)}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
