import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { incrementBlogViews } from '@/app/actions/blog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) {
    notFound()
  }

  // Increment views (non-blocking)
  incrementBlogViews(post.id).catch(() => {})

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
              <time>{formatDate(post.publishedAt.toISOString())}</time>
            )}
            <span>{post.readingTime} min read</span>
            <span>{post.views} views</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex gap-2 mb-8">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}

          {post.content ? (
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom rendering for links to open in new tab
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                  // Custom rendering for tables
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto">
                      <table {...props} />
                    </div>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No content available for this post yet.</p>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
