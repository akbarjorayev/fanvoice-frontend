export interface SocialLink {
  user_id: string
  platform: string
  url: string
}

export const PLATFORMS = [
  'twitter',
  'instagram',
  'youtube',
  'tiktok',
  'telegram',
  'github',
  'website',
] as const

export type Platform = (typeof PLATFORMS)[number]

export const PLATFORM_META: Record<Platform, { label: string; color: string }> = {
  twitter:   { label: 'Twitter / X', color: '#000000' },
  instagram: { label: 'Instagram',   color: '#E1306C' },
  youtube:   { label: 'YouTube',     color: '#FF0000' },
  tiktok:    { label: 'TikTok',      color: '#000000' },
  telegram:  { label: 'Telegram',    color: '#2AABEE' },
  github:    { label: 'GitHub',      color: '#333333' },
  website:   { label: 'Website',     color: '#6B7280' },
}
