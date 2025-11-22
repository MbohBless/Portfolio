'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const BlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().optional(),
  content: z.string().optional(), // Markdown content
  contentUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
  readingTime: z.number().int().min(0).default(0),
})

// Calculate reading time based on content (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

export async function createBlogPost(data: unknown) {
  try {
    const validated = BlogPostSchema.parse(data)

    // Calculate reading time from content if provided
    const readingTime = validated.content
      ? calculateReadingTime(validated.content)
      : validated.readingTime

    const blogPost = await prisma.blogPost.create({
      data: {
        ...validated,
        excerpt: validated.excerpt || null,
        content: validated.content || null,
        contentUrl: validated.contentUrl || null,
        coverImageUrl: validated.coverImageUrl || null,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : validated.published ? new Date() : null,
        readingTime,
      },
    })

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/admin/blog')

    return { success: true, data: blogPost }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors }
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create blog post' }
  }
}

export async function updateBlogPost(id: string, data: unknown) {
  try {
    const validated = BlogPostSchema.partial().parse(data)

    // Get current post to check if it's being published for the first time
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { published: true, publishedAt: true },
    })

    // Calculate reading time from content if provided
    const readingTime = validated.content
      ? calculateReadingTime(validated.content)
      : validated.readingTime

    const updateData: any = {
      ...validated,
      excerpt: validated.excerpt || null,
      content: validated.content || null,
      contentUrl: validated.contentUrl || null,
      coverImageUrl: validated.coverImageUrl || null,
    }

    if (readingTime) {
      updateData.readingTime = readingTime
    }

    // Set publishedAt only on first publish
    if (validated.published && !currentPost?.published && !currentPost?.publishedAt) {
      updateData.publishedAt = new Date()
    } else if (validated.publishedAt) {
      updateData.publishedAt = new Date(validated.publishedAt)
    }

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath(`/blog/${blogPost.slug}`)
    revalidatePath('/admin/blog')

    return { success: true, data: blogPost }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update blog post' }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id },
    })

    revalidatePath('/blog')
    revalidatePath('/admin/blog')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete blog post' }
  }
}

export async function incrementBlogViews(id: string) {
  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })
    return { success: true }
  } catch (error) {
    // Silent fail for view tracking
    return { success: false }
  }
}

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: posts }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return { success: false, error: 'Failed to fetch blog posts' }
  }
}

export async function getBlogPost(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    })
    if (!post) {
      return { success: false, error: 'Blog post not found' }
    }
    return { success: true, data: post }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return { success: false, error: 'Failed to fetch blog post' }
  }
}
