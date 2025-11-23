import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth-server'
import { profileSchema, sanitizeProfileUrls } from '@/lib/validations'
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

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS(req: NextRequest) {
  return handleOptions(req.headers.get('origin'))
}

/**
 * GET - Fetch profile data (public endpoint)
 */
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin')

  try {
    // Get the first (and only) profile record
    const profile = await prisma.profile.findFirst()

    if (!profile) {
      // Return default profile if none exists
      const defaultProfile = {
        name: 'Mboh Bless Pearl N',
        title: 'AI Engineer & Software Developer',
        bio: 'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
        email: 'mbohblesspearl@gmail.com',
        phone: '+250798287701',
        location: 'Kigali, RWA',
        profileImageUrl: '/images/profile.png',
        resumeUrl: '',
        heroTitle: 'AI Engineer & Software Developer',
        heroSubtitle:
          'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
        availableForWork: true,
        githubUrl: '',
        linkedinUrl: '',
        twitterUrl: '',
        websiteUrl: '',
      }
      const response = successResponse(defaultProfile)
      return addSecurityHeaders(response, origin)
    }

    const response = successResponse(profile)
    return addSecurityHeaders(response, origin)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return addSecurityHeaders(
      errorResponse(sanitizeErrorMessage(error), 500),
      origin
    )
  }
}

/**
 * PUT - Update profile data (protected endpoint)
 * Requires authentication and includes rate limiting
 */
export async function PUT(req: NextRequest) {
  const origin = req.headers.get('origin')

  try {
    // Check authentication
    const user = await getUser()
    if (!user) {
      return addSecurityHeaders(errorResponse('Unauthorized', 401), origin)
    }

    // Apply rate limiting (20 updates per hour)
    const rateLimit = applyRateLimit(req, RATE_LIMITS.profile)
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
    const validatedData = profileSchema.parse(parseResult.data)

    // Sanitize URLs to prevent XSS and malicious redirects
    const sanitizedData = sanitizeProfileUrls(validatedData)

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst()

    let profile
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          name: sanitizedData.name,
          title: sanitizedData.title,
          bio: sanitizedData.bio || null,
          email: sanitizedData.email,
          phone: sanitizedData.phone || null,
          location: sanitizedData.location || null,
          profileImageUrl: sanitizedData.profileImageUrl || '/images/profile.png',
          resumeUrl: sanitizedData.resumeUrl || null,
          heroTitle: sanitizedData.heroTitle,
          heroSubtitle: sanitizedData.heroSubtitle,
          availableForWork: sanitizedData.availableForWork ?? true,
          githubUrl: sanitizedData.githubUrl || null,
          linkedinUrl: sanitizedData.linkedinUrl || null,
          twitterUrl: sanitizedData.twitterUrl || null,
          websiteUrl: sanitizedData.websiteUrl || null,
        },
      })
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          name: sanitizedData.name,
          title: sanitizedData.title,
          bio: sanitizedData.bio || null,
          email: sanitizedData.email,
          phone: sanitizedData.phone || null,
          location: sanitizedData.location || null,
          profileImageUrl: sanitizedData.profileImageUrl || '/images/profile.png',
          resumeUrl: sanitizedData.resumeUrl || null,
          heroTitle: sanitizedData.heroTitle,
          heroSubtitle: sanitizedData.heroSubtitle,
          availableForWork: sanitizedData.availableForWork ?? true,
          githubUrl: sanitizedData.githubUrl || null,
          linkedinUrl: sanitizedData.linkedinUrl || null,
          twitterUrl: sanitizedData.twitterUrl || null,
          websiteUrl: sanitizedData.websiteUrl || null,
        },
      })
    }

    console.log('✅ Profile updated successfully:', profile.id)

    // Return success response with rate limit headers
    const response = successResponse(profile, 'Profile updated successfully')
    Object.entries(rateLimit.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return addSecurityHeaders(response, origin)
  } catch (error) {
    console.error('Error updating profile:', error)

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
