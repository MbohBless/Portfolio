'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const EducationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  grade: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  courses: z.array(z.string()).default([]),
  institutionUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
})

export async function createEducation(data: unknown) {
  try {
    const validated = EducationSchema.parse(data)

    const education = await prisma.education.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        institutionUrl: validated.institutionUrl || null,
        grade: validated.grade || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/education')
    return { success: true, data: education }
  } catch (error) {
    console.error('Error creating education:', error)
    return { success: false, error: 'Failed to create education' }
  }
}

export async function updateEducation(id: string, data: unknown) {
  try {
    const validated = EducationSchema.parse(data)

    const education = await prisma.education.update({
      where: { id },
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        institutionUrl: validated.institutionUrl || null,
        grade: validated.grade || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/education')
    return { success: true, data: education }
  } catch (error) {
    console.error('Error updating education:', error)
    return { success: false, error: 'Failed to update education' }
  }
}

export async function deleteEducation(id: string) {
  try {
    await prisma.education.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/admin/education')
    return { success: true }
  } catch (error) {
    console.error('Error deleting education:', error)
    return { success: false, error: 'Failed to delete education' }
  }
}

export async function getEducation() {
  try {
    const education = await prisma.education.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' },
      ],
    })
    return { success: true, data: education }
  } catch (error) {
    console.error('Error fetching education:', error)
    return { success: false, error: 'Failed to fetch education' }
  }
}
