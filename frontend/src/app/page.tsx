import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Portfolio
          </Link>
          <div className="flex gap-6">
            <Link href="/projects" className="hover:underline">
              Projects
            </Link>
            <Link href="/publications" className="hover:underline">
              Publications
            </Link>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <Link href="/admin" className="hover:underline text-blue-600">
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to My Portfolio
          </h1>
          <p className="text-xl text-gray-600">
            Software engineer, researcher, and technical writer.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/projects"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View Projects
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Read Blog
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <p className="text-gray-600">
              Explore my open-source projects and side work.
            </p>
            <Link href="/projects" className="text-blue-600 mt-4 inline-block">
              View all →
            </Link>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Publications</h3>
            <p className="text-gray-600">
              Research papers and academic publications.
            </p>
            <Link href="/publications" className="text-blue-600 mt-4 inline-block">
              View all →
            </Link>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Blog</h3>
            <p className="text-gray-600">
              Technical writing and thoughts on software.
            </p>
            <Link href="/blog" className="text-blue-600 mt-4 inline-block">
              View all →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
