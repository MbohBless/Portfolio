import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // TODO: Integrate with email service (Resend, SendGrid, or Nodemailer)
    // For now, just log to console
    console.log('📧 Contact Form Submission:')
    console.log(`Name: ${name}`)
    console.log(`Email: ${email}`)
    console.log(`Message: ${message}`)

    // You can integrate email service here:
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: 'your-email@example.com',
    //   subject: `Contact form: ${name}`,
    //   text: `From: ${name} (${email})\n\nMessage:\n${message}`
    // })

    return NextResponse.json({
      success: true,
      message: 'Message received! (Currently logging to console)',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}