export interface User {
  id: string
  email: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  creator_verified_at?: string | null
  created_at: string
  has_password?: boolean
  is_creator?: boolean
  creator_bio?: string | null
  creator_since?: string | null
  creator_min_price?: number | null
}
