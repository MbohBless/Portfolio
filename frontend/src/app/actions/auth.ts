'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function checkUsersExist(): Promise<boolean> {
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
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

   
    const { data: { users }, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1, 
    })

    if (error) {
      console.error('Error checking users:', error)
   
      return false
    }

    const hasUsers = users && users.length > 0
    console.log(`👥 Users exist in Supabase: ${hasUsers}`)
    return hasUsers
  } catch (error) {
    console.error('Error checking users:', error)
    return false
  }
}
