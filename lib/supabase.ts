import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Create Supabase client.
 * If credentials are not yet configured (empty strings), we create a stub client
 * that won't crash but also won't make real API calls. This allows the app to build
 * and run in demo mode without a live Supabase project.
 */
function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a client pointed at a placeholder – Supabase SDK requires a valid-looking URL
    return createClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.placeholder'
    )
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

/** Whether Supabase is properly configured with real credentials */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
