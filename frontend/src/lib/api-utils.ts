import { NextResponse } from 'next/server'
import { ZodError } from 'zod'


export function getCorsHeaders(origin?: string | null): Record<string, string> {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
  ]

  const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]

  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

interface ErrorResponse {
  error: string
  details?: unknown
  timestamp: string
}

/**
 * Create standardized error response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    error,
    timestamp: new Date().toISOString(),
  }

  // Only include details in development
  if (process.env.NODE_ENV === 'development' && details) {
    response.details = details
  }

  return NextResponse.json(response, { status })
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError): NextResponse<ErrorResponse> {
  const firstError = error.errors[0]
  const message = firstError
    ? `${firstError.path.join('.')}: ${firstError.message}`
    : 'Validation failed'

  return errorResponse(
    message,
    400,
    process.env.NODE_ENV === 'development' ? error.errors : undefined
  )
}

/**
 * Standard success response format
 */
interface SuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
  timestamp: string
}

/**
 * Create standardized success response
 */
export function successResponse<T = unknown>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function handleOptions(origin?: string | null): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  })
}

/**
 * Sanitize error messages to prevent information leakage
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (process.env.NODE_ENV === 'development') {
    if (error instanceof Error) return error.message
    return String(error)
  }

  // In production, return generic messages
  if (error instanceof Error) {
    // Only expose safe error types
    if (error.name === 'ValidationError') return error.message
    if (error.name === 'ZodError') return 'Invalid input data'
  }

  return 'An unexpected error occurred'
}

/**
 * Security headers for API responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  }
}

/**
 * Add security and CORS headers to a response
 */
export function addSecurityHeaders(
  response: NextResponse,
  origin?: string | null
): NextResponse {
  const corsHeaders = getCorsHeaders(origin)
  const securityHeaders = getSecurityHeaders()

  Object.entries({ ...corsHeaders, ...securityHeaders }).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

/**
 * Validate content type is JSON
 */
export function validateContentType(contentType: string | null): boolean {
  return contentType?.includes('application/json') ?? false
}

/**
 * Extract and validate JSON body safely
 */
export async function safeJsonParse<T = unknown>(
  request: Request
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const contentType = request.headers.get('content-type')

    if (!validateContentType(contentType)) {
      return {
        success: false,
        error: 'Content-Type must be application/json',
      }
    }

    const data = await request.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON in request body',
    }
  }
}
