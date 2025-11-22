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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold">
                Admin Dashboard
              </Link>
              <nav className="flex gap-6">
                <Link href="/admin/projects" className="text-sm text-gray-600 hover:text-black">
                  Projects
                </Link>
                <Link href="/admin/publications" className="text-sm text-gray-600 hover:text-black">
                  Publications
                </Link>
                <Link href="/admin/blog" className="text-sm text-gray-600 hover:text-black">
                  Blog
                </Link>
                <Link href="/admin/profile" className="text-sm text-gray-600 hover:text-black">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
              )}
              <LogoutButton />
              <Link href="/" className="text-sm text-gray-600 hover:text-black">
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
