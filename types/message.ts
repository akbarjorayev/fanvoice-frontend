export interface SentMessage {
  id: string
  fan_id: string
  creator_id: string
  title: string
  message: string
  price: number
  created_at: string
  read_at: string | null
  paid_at: string | null
  creator_name: string
  creator_username: string
  creator_avatar_url?: string | null
}

export interface MessageDetail {
  id: string
  fan_id: string
  creator_id: string
  title: string
  message: string
  price: number
  created_at: string
  read_at: string | null
  paid_at: string | null
  fan_name: string
  fan_username: string
  fan_avatar_url: string | null
  fan_verified: boolean
  creator_name: string
  creator_username: string
  creator_avatar_url: string | null
  creator_verified: boolean
}

export interface ReceivedMessage {
  id: string
  fan_id: string
  creator_id: string
  title: string
  message: string
  price: number
  created_at: string
  read_at: string | null
  fan_name: string
  fan_username: string
  fan_avatar_url?: string | null
}
