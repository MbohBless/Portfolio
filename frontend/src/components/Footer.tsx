'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ProfileData {
  title: string
  bio: string
  email: string
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    // Fetch profile data for social links
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to fetch profile:', err))
  }, [])

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="font-bold text-lg mb-4 text-black dark:text-white">
              {profile?.title || 'AI Engineer & Software Developer'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
              {profile?.bio || 'Building intelligent systems and scalable software solutions. Passionate about machine learning, artificial intelligence, and elegant code.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-black dark:text-white">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">Projects</Link></li>
              <li><Link href="/publications" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">Research</Link></li>
              <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-black dark:text-white">Connect</h4>
            <ul className="space-y-2">
              {profile?.githubUrl && (
                <li><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">GitHub</a></li>
              )}
              {profile?.linkedinUrl && (
                <li><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">LinkedIn</a></li>
              )}
              {profile?.twitterUrl && (
                <li><a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">Twitter</a></li>
              )}
              {profile?.email && (
                <li><a href={`mailto:${profile.email}`} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">Email</a></li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xs transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
