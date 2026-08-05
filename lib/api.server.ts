import 'server-only'
import { cookies } from 'next/headers'
import { API_URL, API_PATH_ME, API_PATH_PROFILE, API_PATH_SOCIAL_LINKS, PAGE_SIZE } from './constants'
import type { User } from '@/types/user'
import type { SocialLink } from '@/types/social-link'
import type { SentMessage, ReceivedMessage, MessageDetail } from '@/types/message'

async function serverFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Cookie: cookieHeader,
      'X-Requested-With': 'XMLHttpRequest',
      ...init.headers,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export function getMeServer() {
  return serverFetch<{ user: User }>(API_PATH_ME)
}

export function getProfileServer() {
  return serverFetch<{ user: User }>(API_PATH_PROFILE)
}

export function getSocialLinksServer() {
  return serverFetch<{ links: SocialLink[] }>(API_PATH_SOCIAL_LINKS)
}

export interface PublicUser {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  created_at: string
  is_creator?: boolean
  creator_bio?: string | null
  creator_since?: string | null
  creator_min_price?: number | null
  creator_verified_at?: string | null
}

export function getSentMessages(page = 1, limit = PAGE_SIZE, read: 'all' | 'read' | 'unread' = 'all', pay: 'all' | 'paid' | 'unpaid' = 'all') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (read !== 'all') params.set('read', read)
  if (pay !== 'all') params.set('pay', pay)
  return serverFetch<{ messages: SentMessage[]; total: number }>(`/messages/sent?${params.toString()}`)
}

export function getReceivedMessages(
  page = 1,
  limit = PAGE_SIZE,
  sort: 'date' | 'money' = 'date',
  read: 'all' | 'read' | 'unread' = 'all',
) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), sort })
  if (read !== 'all') params.set('read', read)
  return serverFetch<{ messages: ReceivedMessage[]; total: number }>(`/messages/received?${params.toString()}`)
}

export function getMessageCounts() {
  return serverFetch<{ sent: number; received: number; unread_received: number; total_earned: number }>('/messages/counts')
}

export function getMessage(id: string) {
  return serverFetch<{ message: MessageDetail }>(`/messages/${id}`)
}

export async function getPublicProfile(
  username: string,
): Promise<{ user: PublicUser; links: SocialLink[] } | null> {
  const res = await fetch(`${API_URL}/u/${encodeURIComponent(username)}`, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
