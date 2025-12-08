import { createClient } from '@supabase/supabase-js'

// Simple server client without Clerk JWT integration
// For production, consider implementing proper Clerk-Supabase JWT integration
export function createClerkSupabaseClientSsr() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}