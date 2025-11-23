'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-client'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { checkUsersExist } from '@/app/actions/auth'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [userExists, setUserExists] = useState<boolean | null>(null)
  const { signUp, loading, error } = useAuth()

  // Check if users already exist on component mount
  useEffect(() => {
    async function checkUsers() {
      const exists = await checkUsersExist()
      setUserExists(exists)
    }
    checkUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return
    }

    const result = await signUp(email, password)
    if (result.data && !result.error) {
      setSuccess(true)
    }
  }

  // Show loading state while checking if users exist
  if (userExists === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  // Show message when user already exists - signup is disabled
  if (userExists) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎭</div>
              <h2 className="text-2xl font-bold mb-3">Access Politely Denied</h2>
              <div className="w-16 h-1 bg-gray-300 mx-auto mb-4"></div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <p className="leading-relaxed">
                We appreciate your enthusiasm, but this portfolio already has an administrator.
              </p>
              <p className="leading-relaxed">
                Unless you're the owner (in which case, where <em>are</em> you going?),
                you might be looking for the login page instead.
              </p>
              <div className="pt-2 pb-2 px-4 bg-gray-50 border-l-4 border-gray-300 italic">
                <p className="text-xs text-gray-500">
                  Fun fact: Only one admin account is permitted per portfolio.
                  We're exclusive like that.
                </p>
              </div>
            </div>

            <Link href="/admin/login">
              <Button variant="primary" className="w-full mb-3">
                I'm the Admin — Take Me to Login
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                View Portfolio Instead
              </Button>
            </Link>
          </div>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-black"
            >
              ← Return to homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 p-8 text-center">
            
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent you a confirmation link. Please check your email to verify your account.
            </p>
            <Link href="/admin/login">
              <Button variant="primary" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            PORTFOLIO
          </Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">Create Account</h1>
          <p className="text-gray-600">
            Sign up to manage portfolio content
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
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
              autoComplete="new-password"
              disabled={loading}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              disabled={loading}
              error={
                confirmPassword && password !== confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || password !== confirmPassword}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/admin/login" 
                className="font-medium hover:underline"
              >
                Sign in
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
      </div>
    </div>
  )
}
