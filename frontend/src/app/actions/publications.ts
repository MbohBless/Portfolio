'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const PublicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  authors: z.array(z.string()).min(1, 'At least one author is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 5),
  venue: z.string().optional(),
  doi: z.string().optional(),
  arxivId: z.string().optional(),
  pdfUrl: z.string().url().optional().or(z.literal('')),
  abstract: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
})

export async function createPublication(data: unknown) {
  try {
    const validated = PublicationSchema.parse(data)

    const publication = await prisma.publication.create({
      data: {
        ...validated,
        venue: validated.venue || null,
        doi: validated.doi || null,
        arxivId: validated.arxivId || null,
        pdfUrl: validated.pdfUrl || null,
        abstract: validated.abstract || null,
      },
    })

    revalidatePath('/publications')
    revalidatePath('/admin/publications')

    return { success: true, data: publication }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors }
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create publication' }
  }
}

export async function updatePublication(id: string, data: unknown) {
  try {
    const validated = PublicationSchema.partial().parse(data)

    const publication = await prisma.publication.update({
      where: { id },
      data: {
        ...validated,
        venue: validated.venue || null,
        doi: validated.doi || null,
        arxivId: validated.arxivId || null,
        pdfUrl: validated.pdfUrl || null,
        abstract: validated.abstract || null,
      },
    })

    revalidatePath('/publications')
    revalidatePath(`/publications/${publication.slug}`)
    revalidatePath('/admin/publications')

    return { success: true, data: publication }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update publication' }
  }
}

export async function deletePublication(id: string) {
  try {
    await prisma.publication.delete({
      where: { id },
    })

    revalidatePath('/publications')
    revalidatePath('/admin/publications')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete publication' }
  }
}
