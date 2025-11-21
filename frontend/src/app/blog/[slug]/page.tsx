import { apiClient } from '@/lib/api'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await apiClient.getBlogPost(params.slug).catch(() => null)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await apiClient.getBlogPost(params.slug).catch(() => null)

  if (!post) {
    notFound()
  }

  // Fetch MDX content from contentUrl
  let mdxContent = ''
  if (post.contentUrl) {
    try {
      const response = await fetch(post.contentUrl)
      mdxContent = await response.text()
    } catch (error) {
      console.error('Failed to fetch MDX content:', error)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <article>
          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex gap-4 text-gray-500 mb-8">
            {post.publishedAt && (
              <time>{formatDate(post.publishedAt)}</time>
            )}
            <span>{post.readingTime} min read</span>
            <span>{post.views} views</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {/* Render MDX content here */}
            {/* For now, displaying as plain text */}
            {/* In production, use next-mdx-remote or similar */}
            {mdxContent ? (
              <div className="whitespace-pre-wrap">{mdxContent}</div>
            ) : (
              <p className="text-gray-500">Content not available</p>
            )}
          </div>
        </article>
      </main>
    </div>
  )
}
