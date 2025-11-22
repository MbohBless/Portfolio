import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Helper to create a Supabase client for server components
async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting errors in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie removal errors
          }
        },
      },
    }
  )
}

// Cached function to get the current user session
export const getSession = cache(async () => {
  const supabase = await createServerSupabaseClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
})

// Get the current authenticated user
export const getUser = cache(async () => {
  const session = await getSession()
  return session?.user ?? null
})

// Check if user is authenticated
export const isAuthenticated = cache(async () => {
  const session = await getSession()
  return !!session
})

// Check if user has admin role (customize based on your needs)
export const isAdmin = cache(async () => {
  const user = await getUser()
  if (!user) return false

  // Check user metadata or role
  // You can customize this based on how you store admin roles
  const isAdminUser = user.email?.endsWith('@yourdomain.com') ||
                      user.user_metadata?.role === 'admin'

  return isAdminUser
})
