import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/Card'
import { getUser } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const user = await getUser()
  
  const [projectCount, publicationCount, blogPostCount] = await Promise.all([
    prisma.project.count(),
    prisma.publication.count(),
    prisma.blogPost.count(),
  ])

  return (
    <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your portfolio content</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{projectCount}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{publicationCount}</div>
              <div className="text-sm text-gray-600">Publications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{blogPostCount}</div>
              <div className="text-sm text-gray-600">Blog Posts</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/admin/projects">
            <Card hoverable className="h-full">
              <CardContent>
                <h2 className="text-2xl font-bold mb-3">Projects</h2>
                <p className="text-gray-600 mb-4">
                  Create, edit, and manage your portfolio projects. Add tech stack, images, and links.
                </p>
                <div className="text-sm font-medium">
                  Manage Projects →
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/publications">
            <Card hoverable className="h-full">
              <CardContent>
                <h2 className="text-2xl font-bold mb-3">Publications</h2>
                <p className="text-gray-600 mb-4">
                  Manage research papers and academic publications. Add DOI, arXiv links, and PDFs.
                </p>
                <div className="text-sm font-medium">
                  Manage Publications →
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blog">
            <Card hoverable className="h-full">
              <CardContent>
                <h2 className="text-2xl font-bold mb-3">Blog Posts</h2>
                <p className="text-gray-600 mb-4">
                  Write and publish blog posts. Edit content, manage tags, and track views.
                </p>
                <div className="text-sm font-medium">
                  Manage Blog →
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* yupeee solved 🙈 */}
        {/* <div className="mt-12">
          <Card className="bg-green-50 border-green-200">
            <CardContent>
              <div className="flex gap-3">
                <div className="text-2xl"></div>
                <div>
                  <h3 className="font-semibold mb-1">Authentication Enabled</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Admin pages are now protected. Only authenticated users can access this dashboard.
                  </p>
                  <p className="text-sm text-gray-700">
                    Logged in as: <code className="bg-green-100 px-1">{user?.email}</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </main>
  )
}
