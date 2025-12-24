import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DbColumn {
  id: string
  name: string
  color: string
  order: number
  user_id: string | null
  created_at: string
}

export interface DbCard {
  id: string
  column_id: string
  title: string
  description: string | null
  labels: string[]
  due_date: string | null
  order: number
  attachment_count: number
  comment_count: number
  archived_at: string | null
  user_id: string | null
  created_at: string
}

export interface DbComment {
  id: string
  card_id: string
  author: string
  author_initials: string | null
  text: string
  user_id: string | null
  created_at: string
}

export interface DbAttachment {
  id: string
  card_id: string
  name: string
  type: 'file' | 'link'
  url: string | null
  size: string | null
  user_id: string | null
  created_at: string
}
