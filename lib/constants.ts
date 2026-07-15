export const API_URL = process.env.NODE_ENV === 'production'
  ? (process.env.NEXT_PUBLIC_API_URL ?? '')
  : (process.env.NEXT_PUBLIC_DEV_API_URL ?? '')
export const GOOGLE_CLIENT_ID = process.env.NODE_ENV === 'production'
  ? (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '')
  : (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_DEV ?? '')

// Must match the cookie name set by the backend
export const SESSION_COOKIE_NAME = 'session'

export const SUPPORT_TELEGRAM_URL = 'https://t.me/fanvoice_support_bot'

export const COPY_FEEDBACK_MS = 2000

// Must match the backend's default page size (src/constants/pagination.ts)
export const PAGE_SIZE = 10

// Shared REST paths used by both lib/api.ts (browser) and lib/api.server.ts (server components)
export const API_PATH_ME = '/auth/me'
export const API_PATH_PROFILE = '/profile'
export const API_PATH_SOCIAL_LINKS = '/profile/social-links'
