'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const WorkExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  companyUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
})

export async function createWorkExperience(data: unknown) {
  try {
    const validated = WorkExperienceSchema.parse(data)

    const experience = await prisma.workExperience.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        companyUrl: validated.companyUrl || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/experience')
    return { success: true, data: experience }
  } catch (error) {
    console.error('Error creating work experience:', error)
    return { success: false, error: 'Failed to create work experience' }
  }
}

export async function updateWorkExperience(id: string, data: unknown) {
  try {
    const validated = WorkExperienceSchema.parse(data)

    const experience = await prisma.workExperience.update({
      where: { id },
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        companyUrl: validated.companyUrl || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/experience')
    return { success: true, data: experience }
  } catch (error) {
    console.error('Error updating work experience:', error)
    return { success: false, error: 'Failed to update work experience' }
  }
}

export async function deleteWorkExperience(id: string) {
  try {
    await prisma.workExperience.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/admin/experience')
    return { success: true }
  } catch (error) {
    console.error('Error deleting work experience:', error)
    return { success: false, error: 'Failed to delete work experience' }
  }
}

export async function getWorkExperiences() {
  try {
    const experiences = await prisma.workExperience.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' },
      ],
    })
    return { success: true, data: experiences }
  } catch (error) {
    console.error('Error fetching work experiences:', error)
    return { success: false, error: 'Failed to fetch work experiences' }
  }
}
