import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page) || 1
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: pageSize,
      skip,
    }),
    prisma.blogPost.count({
      where: { published: true },
    }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="min-h-screen">
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
            <Link href="/blog" className="hover:underline font-semibold">
              Blog
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.id} className="pb-8 border-b">
              <Link
                href={`/blog/${post.slug}`}
                className="text-3xl font-bold hover:text-blue-600 block mb-2"
              >
                {post.title}
              </Link>
              <div className="flex gap-4 text-gray-500 text-sm mb-4">
                {post.publishedAt && (
                  <time>{formatDate(post.publishedAt.toISOString())}</time>
                )}
                <span>{post.readingTime} min read</span>
                <span>{post.views} views</span>
              </div>
              {post.excerpt && (
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
              )}
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No blog posts yet. Check back soon!
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
