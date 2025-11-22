'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getContacts() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: contacts }
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return { success: false, error: 'Failed to fetch contacts' }
  }
}

export async function markAsRead(id: string) {
  try {
    await prisma.contact.update({
      where: { id },
      data: { read: true },
    })
    revalidatePath('/admin/contacts')
    return { success: true }
  } catch (error) {
    console.error('Error marking contact as read:', error)
    return { success: false, error: 'Failed to mark as read' }
  }
}

export async function markAsUnread(id: string) {
  try {
    await prisma.contact.update({
      where: { id },
      data: { read: false },
    })
    revalidatePath('/admin/contacts')
    return { success: true }
  } catch (error) {
    console.error('Error marking contact as unread:', error)
    return { success: false, error: 'Failed to mark as unread' }
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    })
    revalidatePath('/admin/contacts')
    return { success: true }
  } catch (error) {
    console.error('Error deleting contact:', error)
    return { success: false, error: 'Failed to delete contact' }
  }
}
