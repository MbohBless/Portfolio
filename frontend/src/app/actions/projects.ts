'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
})

export async function createProject(data: unknown) {
  try {
    const validated = ProjectSchema.parse(data)

    const project = await prisma.project.create({
      data: {
        ...validated,
        githubUrl: validated.githubUrl || null,
        demoUrl: validated.demoUrl || null,
        thumbnailUrl: validated.thumbnailUrl || null,
      },
    })

    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    return { success: true, data: project }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors }
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create project' }
  }
}

export async function updateProject(id: string, data: unknown) {
  try {
    const validated = ProjectSchema.partial().parse(data)

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...validated,
        githubUrl: validated.githubUrl || null,
        demoUrl: validated.demoUrl || null,
        thumbnailUrl: validated.thumbnailUrl || null,
      },
    })

    revalidatePath('/projects')
    revalidatePath(`/projects/${project.slug}`)
    revalidatePath('/admin/projects')

    return { success: true, data: project }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update project' }
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    })

    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete project' }
  }
}
