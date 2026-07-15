import type { User } from '@/types/user'

export interface UserInfo {
  displayName: string
  initial: string
  avatarUrl?: string | null
  username?: string | null
}

export function getUserInfo(user: User): UserInfo {
  const displayName = user.display_name ?? user.email.split('@')[0]
  return { displayName, initial: displayName[0].toUpperCase(), avatarUrl: user.avatar_url, username: user.username }
}

export function getUserInfoOrNull(user: User | undefined | null): UserInfo | null {
  return user ? getUserInfo(user) : null
}
