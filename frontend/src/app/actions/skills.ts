'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const SkillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.number().int().min(0).max(100).default(50),
  iconUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
})

export async function createSkill(data: unknown) {
  try {
    const validated = SkillSchema.parse(data)

    const skill = await prisma.skill.create({
      data: {
        ...validated,
        iconUrl: validated.iconUrl || null,
        description: validated.description || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/skills')

    return { success: true, data: skill }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors }
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create skill' }
  }
}

export async function updateSkill(id: string, data: unknown) {
  try {
    const validated = SkillSchema.partial().parse(data)

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...validated,
        iconUrl: validated.iconUrl || null,
        description: validated.description || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/skills')

    return { success: true, data: skill }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update skill' }
  }
}

export async function deleteSkill(id: string) {
  try {
    await prisma.skill.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/admin/skills')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete skill' }
  }
}

export async function getSkills() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { displayOrder: 'asc' },
      ],
    })
    return { success: true, data: skills }
  } catch (error) {
    console.error('Error fetching skills:', error)
    return { success: false, error: 'Failed to fetch skills' }
  }
}

export async function getSkill(id: string) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id },
    })
    if (!skill) {
      return { success: false, error: 'Skill not found' }
    }
    return { success: true, data: skill }
  } catch (error) {
    console.error('Error fetching skill:', error)
    return { success: false, error: 'Failed to fetch skill' }
  }
}
