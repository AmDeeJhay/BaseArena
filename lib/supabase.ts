import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Allow app to load even if env vars are missing, but throw error when trying to use client
export const supabase = (() => {
    if (!supabaseUrl || !supabaseAnonKey) {
        return null
    }
    return createClient(supabaseUrl, supabaseAnonKey)
})()

if (!supabase) {
    console.error(
        "⚠️  Supabase not configured. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
}
