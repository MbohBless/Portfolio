'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔐 Attempting login for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Login response:', { data: !!data, error: error?.message })

      if (error) {
        console.error('❌ Login error:', error)
        // Check for common error types
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email before logging in. Check your inbox for the confirmation link.')
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.')
        }
        throw error
      }

      if (!data.session) {
        console.error('❌ No session created')
        throw new Error('Login failed: No session created. Please try again.')
      }

      console.log('✅ Login successful, redirecting...')
      // Successful login - use router.push with a longer delay for cookies to propagate
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/admin')
      router.refresh()
      return { data, error: null }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign in'
      console.error('❌ Sign in error:', errorMessage)
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.refresh()
      router.push('/admin/login')
      return { error: null }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign out'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      return { data, error: null }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign up'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    signIn,
    signOut,
    signUp,
    loading,
    error,
  }
}
