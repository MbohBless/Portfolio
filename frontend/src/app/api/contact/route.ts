import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations'
import { applyRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import {
  errorResponse,
  handleValidationError,
  successResponse,
  addSecurityHeaders,
  handleOptions,
  sanitizeErrorMessage,
  safeJsonParse,
} from '@/lib/api-utils'

async function sendDiscordNotification(
  name: string,
  email: string,
  message: string,
  contactId: string
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('Discord webhook URL not configured')
    return
  }

  try {
    const embed = {
      title: 'New Contact Form Submission',
      color: 0x5865f2, // Discord blurple color
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

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS(req: NextRequest) {
  return handleOptions(req.headers.get('origin'))
}

/**
 * Handle contact form submissions
 * Protected by rate limiting and input validation
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')

  try {
    // Apply rate limiting (5 submissions per hour per IP)
    const rateLimit = applyRateLimit(req, RATE_LIMITS.contact)
    if (!rateLimit.allowed) {
      const response = errorResponse(rateLimit.message || 'Rate limit exceeded', 429)
      Object.entries(rateLimit.headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return addSecurityHeaders(response, origin)
    }

    // Safely parse JSON body
    const parseResult = await safeJsonParse(req)
    if (!parseResult.success) {
      return addSecurityHeaders(errorResponse(parseResult.error, 400), origin)
    }

    // Validate input with Zod schema
    const validatedData = contactSchema.parse(parseResult.data)

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        read: false,
      },
    })

    console.log('✅ Contact form submission saved:', contact.id)

    // Send Discord notification asynchronously
    sendDiscordNotification(
      validatedData.name,
      validatedData.email,
      validatedData.message,
      contact.id
    ).catch((err) => console.error('Discord notification error:', err))

    // Return success response with rate limit headers
    const response = successResponse(
      undefined,
      "Message received! We'll get back to you soon.",
      201
    )
    Object.entries(rateLimit.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return addSecurityHeaders(response, origin)
  } catch (error) {
    console.error('Contact form error:', error)

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return addSecurityHeaders(handleValidationError(error), origin)
    }

    // Generic error response
    return addSecurityHeaders(
      errorResponse(sanitizeErrorMessage(error), 500),
      origin
    )
  }
}