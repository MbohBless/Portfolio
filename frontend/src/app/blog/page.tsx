import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/Card'
import { CodeAnimation } from '@/components/animations/CodeAnimation'

export const dynamic = 'force-dynamic'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 12
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
    <main className="flex-1 relative">
      <CodeAnimation />
      <section className="container mx-auto px-6 py-20 border-b border-gray-200 dark:border-gray-800 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Technical articles, tutorials, and thoughts on AI, software engineering,
            and emerging technologies.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 relative z-10">
        {posts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card hoverable className="h-full flex flex-col">
                    {post.coverImageUrl && (
                      <div className="relative h-48 bg-gray-100">
                        <img 
                          src={post.coverImageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        {post.publishedAt && (
                          <time>{formatDate(post.publishedAt.toISOString())}</time>
                        )}
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                      </div>

                      <h2 className="text-xl font-bold mb-3 line-clamp-2 flex-1">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                {page > 1 && (
                  <Link
                    href={`/blog?page=${page - 1}`}
                    className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/blog?page=${page + 1}`}
                    className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32">
            <p className="text-gray-500 text-lg">No blog posts yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
