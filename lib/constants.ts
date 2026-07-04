export const API_URL = process.env.NODE_ENV === 'production'
  ? (process.env.NEXT_PUBLIC_API_URL ?? '')
  : (process.env.NEXT_PUBLIC_DEV_API_URL ?? '')
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''

// Must match the cookie name set by the backend
export const SESSION_COOKIE_NAME = 'session'
