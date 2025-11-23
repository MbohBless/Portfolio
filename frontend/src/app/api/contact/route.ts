import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function sendDiscordNotification(name: string, email: string, message: string, contactId: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('⚠️ Discord webhook URL not configured')
    return
  }

  try {
    const embed = {
      title: 'New Contact Form Submission',
      color: 0x5865F2, // Discord blurple color
      fields: [
        {
          name: 'Name',
          value: name,
          inline: true,
        },
        {
          name: 'Email',
          value: email,
          inline: true,
        },
        {
          name: 'Message',
          value: message.length > 1024 ? message.substring(0, 1021) + '...' : message,
          inline: false,
        },
        {
          name: 'Admin Link',
          value: `[View in Admin Panel](${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/contacts)`,
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `Contact ID: ${contactId}`,
      },
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Portfolio Contact Form',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        embeds: [embed],
      }),
    })

  } catch (error) {
    console.error('Failed to send Discord notification:', error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
        read: false,
      },
    })

    console.log('Contact Form Submission saved:', contact.id)

    sendDiscordNotification(name, email, message, contact.id).catch((err) =>
      console.error('Discord notification error:', err)
    )

    return NextResponse.json({
      success: true,
      message: 'Message received! We\'ll get back to you soon.',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}