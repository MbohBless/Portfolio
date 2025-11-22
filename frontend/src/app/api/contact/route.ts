import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Log to console for debugging
    console.log('📧 Contact Form Submission saved:', contact.id)

    // TODO: Integrate with email service (Resend, SendGrid, or Nodemailer)
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: 'your-email@example.com',
    //   subject: `Contact form: ${name}`,
    //   text: `From: ${name} (${email})\n\nMessage:\n${message}`
    // })

    return NextResponse.json({
      success: true,
      message: 'Message received! We\'ll get back to you soon.',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}