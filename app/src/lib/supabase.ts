import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Cloud mode is enabled when both Supabase env vars are present. Without
 * them the app runs local-first: guest profile + browser-only persistence.
 */
export const isCloudMode = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isCloudMode
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
