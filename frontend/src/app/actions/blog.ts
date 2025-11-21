'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const BlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().optional(),
  contentUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  readingTime: z.number().int().min(0).default(0),
})

export async function createBlogPost(data: unknown) {
  try {
    const validated = BlogPostSchema.parse(data)

    const blogPost = await prisma.blogPost.create({
      data: {
        ...validated,
        excerpt: validated.excerpt || null,
        contentUrl: validated.contentUrl || null,
        coverImageUrl: validated.coverImageUrl || null,
        publishedAt: validated.published ? new Date() : null,
      },
    })

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

    const updateData: any = {
      ...validated,
      excerpt: validated.excerpt || null,
      contentUrl: validated.contentUrl || null,
      coverImageUrl: validated.coverImageUrl || null,
    }

    // Set publishedAt only on first publish
    if (validated.published && !currentPost?.published && !currentPost?.publishedAt) {
      updateData.publishedAt = new Date()
    }

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    })

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
