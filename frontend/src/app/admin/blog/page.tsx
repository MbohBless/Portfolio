import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Posts</h1>
            <p className="text-gray-600">Create and manage your blog content</p>
          </div>
          <Link href="/admin/blog/new">
            <Button size="lg">+ New Post</Button>
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{post.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium ${
                            post.published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {post.publishedAt && (
                          <span>
                            Published: {formatDate(post.publishedAt.toISOString())}
                          </span>
                        )}
                        <span>{post.readingTime} min read</span>
                        <span>{post.views} views</span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No blog posts yet</p>
              <Link href="/admin/blog/new">
                <Button>Write Your First Post</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
  )
}
