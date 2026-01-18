import { createClient } from '@supabase/supabase-js'

// Hardcoded for debugging
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Supabase URL or Anon Key is missing. Please check .env.local')
// }

// Singleton pattern removed for simplicity and stability
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-client-info': 'mbti-stock-app',
    },
  },
})

console.log('✅ Supabase client initialized')
