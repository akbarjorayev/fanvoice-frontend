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
