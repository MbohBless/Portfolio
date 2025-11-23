'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Check if any users exist in Supabase auth
 * Used to disable signup when an admin account already exists
 */
export async function checkUsersExist(): Promise<boolean> {
  try {
    // Use service role key to access admin functions
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not configured, allowing signup')
      return false
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Check if there are any users in Supabase auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1, // Only need to know if at least one exists
    })

    if (error) {
      console.error('Error checking users:', error)
      // If we can't check, allow signup to not lock out the initial setup
      return false
    }

    const hasUsers = users && users.length > 0
    console.log(`👥 Users exist in Supabase: ${hasUsers}`)
    return hasUsers
  } catch (error) {
    console.error('Error checking users:', error)
    // If there's an error checking, allow signup to not lock out the initial setup
    return false
  }
}
