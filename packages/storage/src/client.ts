import { createClient, SupabaseClient } from "@supabase/supabase-js"

let adminClient: SupabaseClient | null = null
let publicClient: SupabaseClient | null = null

export function getStorageAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    )
  }

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    })
  }

  return adminClient
}

/**
 * Returns a Supabase client with public/anon privileges
 */
export function getStoragePublicClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    )
  }

  if (!publicClient) {
    publicClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    })
  }

  return publicClient
}
