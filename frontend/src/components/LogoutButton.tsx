'use client'

import { useAuth } from '@/lib/auth-client'
import { Button } from './Button'

export function LogoutButton({ className }: { className?: string }) {
  const { signOut, loading } = useAuth()

  return (
    <Button
      onClick={() => signOut()}
      variant="ghost"
      size="sm"
      disabled={loading}
      className={className}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}
