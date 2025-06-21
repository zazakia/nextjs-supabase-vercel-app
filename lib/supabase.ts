// Dynamic client creation that only works on the client side
export const createSupabaseClient = async () => {
  // Only create client on the client side
  if (typeof window === 'undefined') {
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if environment variables are not set or are placeholders
  if (!supabaseUrl || 
      !supabaseAnonKey || 
      supabaseUrl.includes('placeholder') || 
      supabaseUrl.includes('your_supabase') ||
      supabaseAnonKey.includes('placeholder') ||
      supabaseAnonKey.includes('your_supabase')) {
    console.log('Supabase not configured - using demo mode')
    return null
  }

  // Dynamic import to avoid server-side issues
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(supabaseUrl, supabaseAnonKey)
}

// For server-side operations (optional)
export const createServerClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  const { createClient } = await import('@supabase/supabase-js')
  return createClient(supabaseUrl, serviceRoleKey)
} 