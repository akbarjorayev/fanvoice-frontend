import { API_URL, API_PATH_ME, API_PATH_PROFILE, API_PATH_SOCIAL_LINKS } from './constants'
import { ApiError } from './apiError'
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
      code?: string
      params?: Record<string, string | number>
      errors?: { field: string; code: string }[]
    }
    throw new ApiError(body.errors?.[0]?.code ?? body.code ?? 'UNKNOWN_ERROR', body.params)
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
  return apiFetch<{ user: User }>(API_PATH_ME)
}

export function logout() {
  return apiFetch<void>('/auth/logout', { method: 'POST' })
}

export function updateProfile(data: { display_name?: string; username?: string }) {
  return apiFetch<{ user: User }>(API_PATH_PROFILE, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function getSocialLinks() {
  return apiFetch<{ links: SocialLink[] }>(API_PATH_SOCIAL_LINKS)
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

export function updateMessagePrice(id: string, price: number) {
  return apiFetch<void>(`/messages/${id}/price`, {
    method: 'PATCH',
    body: JSON.stringify({ price }),
  })
}

export function deleteMessage(id: string) {
  return apiFetch<void>(`/messages/${id}`, { method: 'DELETE' })
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
