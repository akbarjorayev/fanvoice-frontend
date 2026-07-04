import { API_URL } from './constants'
import type { User } from '@/types/user'
import type { SocialLink } from '@/types/social-link'

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...init.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as {
      message?: string
      errors?: { field: string; message: string }[]
    }
    throw new Error(
      body.errors?.[0]?.message ?? body.message ?? `Request failed with status ${res.status}`
    )
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export function emailSignUp(email: string, password: string) {
  return apiFetch<{ user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function emailSignIn(email: string, password: string) {
  return apiFetch<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiFetch<void>('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export function googleSignIn(code: string) {
  return apiFetch<{ user: User }>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
}

export function getMe() {
  return apiFetch<{ user: User }>('/auth/me')
}

export function logout() {
  return apiFetch<void>('/auth/logout', { method: 'POST' })
}

export function updateProfile(data: { display_name?: string; username?: string }) {
  return apiFetch<{ user: User }>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function getSocialLinks() {
  return apiFetch<{ links: SocialLink[] }>('/profile/social-links')
}

export function upsertSocialLink(platform: string, url: string) {
  return apiFetch<{ link: SocialLink }>(`/profile/social-links/${platform}`, {
    method: 'PUT',
    body: JSON.stringify({ url }),
  })
}

export function deleteSocialLink(platform: string) {
  return apiFetch<void>(`/profile/social-links/${platform}`, { method: 'DELETE' })
}

export function becomeCreator(bio?: string) {
  return apiFetch<void>('/profile/creator', {
    method: 'POST',
    body: JSON.stringify({ bio: bio ?? '' }),
  })
}

export function updateCreator(params: { bio?: string; min_price_per_message?: number }) {
  return apiFetch<void>('/profile/creator', {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

export function markMessageRead(id: string) {
  return apiFetch<void>(`/messages/${id}/read`, { method: 'PATCH' })
}

export function payMessage(id: string) {
  return apiFetch<void>(`/messages/${id}/pay`, { method: 'PATCH' })
}

export function sendMessage(params: {
  creator_id: string
  title: string
  message: string
  price: number
}) {
  return apiFetch<{ message: { id: string } }>('/messages', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
