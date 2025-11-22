'use server'

import { prisma } from '@/lib/prisma'

/**
 * Check if any users exist in the database
 * Used to disable signup when an admin account already exists
 */
export async function checkUsersExist(): Promise<boolean> {
  try {
    const userCount = await prisma.user.count()
    return userCount > 0
  } catch (error) {
    console.error('Error checking users:', error)
    // If there's an error checking, assume users exist to be safe
    return true
  }
}
