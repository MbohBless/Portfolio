import { z } from 'zod'


export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters'),

  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
})

export type ContactInput = z.infer<typeof contactSchema>

// Profile validation
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),

  bio: z
    .string()
    .max(5000, 'Bio must be less than 5000 characters')
    .optional()
    .nullable(),

  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z
    .string()
    .max(50, 'Phone must be less than 50 characters')
    .optional()
    .nullable(),

  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional()
    .nullable(),

  profileImageUrl: z
    .string()
    .url('Invalid profile image URL')
    .max(2048, 'URL too long')
    .optional()
    .nullable(),

  resumeUrl: z
    .string()
    .url('Invalid resume URL')
    .max(2048, 'URL too long')
    .optional()
    .nullable(),

  heroTitle: z
    .string()
    .min(2, 'Hero title must be at least 2 characters')
    .max(200, 'Hero title must be less than 200 characters'),

  heroSubtitle: z
    .string()
    .min(2, 'Hero subtitle must be at least 2 characters')
    .max(500, 'Hero subtitle must be less than 500 characters'),

  availableForWork: z
    .boolean()
    .optional()
    .default(true),

  githubUrl: z
    .string()
    .url('Invalid GitHub URL')
    .max(2048, 'URL too long')
    .optional()
    .nullable()
    .or(z.literal('')),

  linkedinUrl: z
    .string()
    .url('Invalid LinkedIn URL')
    .max(2048, 'URL too long')
    .optional()
    .nullable()
    .or(z.literal('')),

  twitterUrl: z
    .string()
    .url('Invalid Twitter URL')
    .max(2048, 'URL too long')
    .optional()
    .nullable()
    .or(z.literal('')),

  websiteUrl: z
    .string()
    .url('Invalid website URL')
    .max(2048, 'URL too long')
    .optional()
    .nullable()
    .or(z.literal('')),
})

export type ProfileInput = z.infer<typeof profileSchema>

/**
 * Sanitize URL to prevent XSS and malicious redirects
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url || url === '') return null

  try {
    const parsed = new URL(url)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }
    return url
  } catch {
    return null
  }
}

/**
 * Validate and sanitize profile URLs
 */
export function sanitizeProfileUrls(data: ProfileInput): ProfileInput {
  return {
    ...data,
    profileImageUrl: sanitizeUrl(data.profileImageUrl) || undefined,
    resumeUrl: sanitizeUrl(data.resumeUrl) || undefined,
    githubUrl: sanitizeUrl(data.githubUrl) || undefined,
    linkedinUrl: sanitizeUrl(data.linkedinUrl) || undefined,
    twitterUrl: sanitizeUrl(data.twitterUrl) || undefined,
    websiteUrl: sanitizeUrl(data.websiteUrl) || undefined,
  }
}
