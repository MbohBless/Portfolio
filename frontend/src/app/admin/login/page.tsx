'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-client'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showResendVerification, setShowResendVerification] = useState(false)
  const { signIn, loading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Form submitted:', { email, hasPassword: !!password })
    setShowResendVerification(false)
    const result = await signIn(email, password)
    console.log('📬 Sign in result:', result)
    
    // Check if error is about email verification
    if (result.error && result.error.includes('verify your email')) {
      setShowResendVerification(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            PORTFOLIO
          </Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">Admin Login</h1>
          <p className="text-gray-600">
            Sign in to manage your portfolio content
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                <p className="font-semibold mb-1">⚠️ Login Failed</p>
                <p>{error}</p>
                {showResendVerification && (
                  <p className="mt-2 text-xs">
                    Didn't receive the email?{' '}
                    <Link href="/admin/signup" className="underline font-semibold">
                      Sign up again
                    </Link>{' '}
                    to resend the verification email.
                  </p>
                )}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                href="/admin/signup" 
                className="font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-600 hover:text-black"
          >
            ← Back to site
          </Link>
        </div>

        {/* Dev note */}
        {/* <div className="mt-8 p-4 bg-blue-50 border border-blue-200 text-sm">
          <p className="font-semibold mb-2">📋 Troubleshooting Login Issues?</p>
          <ol className="text-gray-700 space-y-1 list-decimal list-inside">
            <li>Open browser DevTools console (F12) to see debug logs</li>
            <li>Check your email inbox for verification link</li>
            <li>See <code className="bg-blue-100 px-1">LOGIN_TROUBLESHOOTING.md</code> for detailed help</li>
          </ol>
        </div> */}
      </div>
    </div>
  )
}
