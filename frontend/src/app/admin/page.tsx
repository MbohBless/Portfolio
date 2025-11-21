import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <nav className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold">
            Portfolio Admin
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/admin/projects"
            className="p-6 bg-white border rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-2">Projects</h2>
            <p className="text-gray-600">Manage your portfolio projects</p>
          </Link>

          <Link
            href="/admin/publications"
            className="p-6 bg-white border rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-2">Publications</h2>
            <p className="text-gray-600">Manage research publications</p>
          </Link>

          <Link
            href="/admin/blog"
            className="p-6 bg-white border rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-2">Blog Posts</h2>
            <p className="text-gray-600">Create and edit blog posts</p>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-2">⚠️ Authentication Required</h3>
          <p className="text-sm text-gray-700">
            Admin pages require Supabase authentication. Implement auth middleware to protect these routes.
          </p>
        </div>
      </main>
    </div>
  )
}
