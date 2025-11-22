import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Cached function to get the current user session
export const getSession = cache(async () => {
  const supabase = createServerComponentClient({ cookies })
  
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
