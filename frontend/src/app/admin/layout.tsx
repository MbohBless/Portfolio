import Link from 'next/link'
import { getUser } from '@/lib/auth-server'
import { LogoutButton } from '@/components/LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-black dark:text-white">
                Admin Dashboard
              </Link>
              <nav className="flex gap-6">
                <Link href="/admin/profile" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Profile
                </Link>
                <Link href="/admin/projects" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Projects
                </Link>
                <Link href="/admin/publications" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Publications
                </Link>
                <Link href="/admin/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Blog
                </Link>
                <Link href="/admin/experience" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Experience
                </Link>
                <Link href="/admin/education" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Education
                </Link>
                <Link href="/admin/skills" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Skills
                </Link>
                <Link href="/admin/contacts" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Contacts
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </span>
              )}
              <LogoutButton />
              <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                ← Back to site
              </Link>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
