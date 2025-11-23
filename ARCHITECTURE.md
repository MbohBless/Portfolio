# Architecture Documentation

This document provides a comprehensive overview of the portfolio platform's architecture, design decisions, and technical implementation.

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Data Flow](#data-flow)
- [API Design](#api-design)
- [Security](#security)
- [Performance](#performance)
- [Deployment](#deployment)

## System Overview

The portfolio platform is a modern, full-stack web application built with Next.js 15, leveraging the App Router for optimal performance and developer experience.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Public     │  │    Admin     │  │   API        │      │
│  │   Pages      │  │    Panel     │  │   Routes     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│                    ┌──────▼───────┐                         │
│                    │  Server      │                         │
│                    │  Components  │                         │
│                    └──────┬───────┘                         │
└───────────────────────────┼──────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Prisma ORM    │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼───────┐  ┌───────▼────────┐
│   PostgreSQL   │  │   Supabase   │  │   Discord      │
│   Database     │  │   Auth       │  │   Webhook      │
└────────────────┘  └──────────────┘  └────────────────┘
```

### Key Characteristics

- **Monorepo Structure**: Single repository with all code in `frontend/`
- **Server-First**: Leverages React Server Components for optimal performance
- **Type-Safe**: Full TypeScript coverage with Prisma-generated types
- **Zero API Layer**: Direct database access from server components
- **Modern Patterns**: Server Actions for mutations, minimal client JavaScript

## Technology Stack

### Core Framework

**Next.js 15 (App Router)**
- **Why**: Latest App Router provides superior performance with React Server Components
- **Benefits**:
  - Direct database access from server components
  - Automatic code splitting
  - Built-in optimization (images, fonts, etc.)
  - Streaming and Suspense support
  - Server Actions for mutations

### Language & Type Safety

**TypeScript 5.0**
- **Why**: Type safety prevents runtime errors and improves DX
- **Benefits**:
  - Catch errors at compile time
  - Autocomplete and IntelliSense
  - Self-documenting code
  - Seamless integration with Prisma

### Styling

**Tailwind CSS**
- **Why**: Utility-first approach enables rapid development
- **Benefits**:
  - Consistent design system
  - Dark mode support out of the box
  - Minimal CSS bundle size
  - Responsive utilities
  - Easy customization

### Database Layer

**Prisma ORM**
- **Why**: Best-in-class TypeScript ORM with excellent DX
- **Benefits**:
  - Type-safe database queries
  - Automatic migrations
  - Database introspection
  - Prisma Studio for GUI management
  - Generated types match schema

**PostgreSQL 15+**
- **Why**: Robust, ACID-compliant relational database
- **Benefits**:
  - Complex queries and relationships
  - JSON support for flexible data
  - Full-text search capabilities
  - Excellent performance
  - Supabase compatibility

### Authentication

**Supabase Auth**
- **Why**: Production-ready auth with minimal setup
- **Benefits**:
  - Email/password authentication
  - Email verification
  - Session management
  - JWT tokens
  - Row-level security (RLS)

### Storage

**Supabase Storage**
- **Why**: Integrated storage solution with PostgreSQL
- **Benefits**:
  - S3-compatible API
  - CDN integration
  - Access control policies
  - Automatic optimization
  - Same provider as database

### Deployment

**Vercel**
- **Why**: Built by Next.js creators, optimized for the framework
- **Benefits**:
  - Zero-config deployment
  - Edge network
  - Automatic HTTPS
  - Preview deployments
  - Environment variables
  - Analytics and monitoring

## Architecture Patterns

### 1. Server Components (Default)

All pages and components are Server Components by default, enabling direct database access.

```typescript
// app/projects/page.tsx
import { prisma } from '@/lib/prisma'

export default async function ProjectsPage() {
  // Direct database access - no API call needed
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { displayOrder: 'asc' }
  })

  return <ProjectGrid projects={projects} />
}
```

**Benefits**:
- No API roundtrip latency
- Reduced client JavaScript
- Better SEO (fully rendered HTML)
- Automatic data caching

### 2. Server Actions (Mutations)

Forms and mutations use Server Actions instead of API routes.

```typescript
// app/actions/projects.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const project = await prisma.project.create({
    data: {
      title: formData.get('title'),
      // ... other fields
    }
  })

  revalidatePath('/projects')
  return { success: true, data: project }
}
```

**Benefits**:
- No API route needed
- Type-safe parameters
- Automatic revalidation
- Progressive enhancement

### 3. Client Components (Interactive UI)

Only interactive components are marked with `'use client'`.

```typescript
// components/ThemeToggle.tsx
'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme('dark')}>
      Toggle Theme
    </button>
  )
}
```

**When to use**:
- Event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, window, etc.)
- Third-party libraries requiring client-side

### 4. API Routes (External Access)

API routes only for external access or webhooks.

```typescript
// app/api/contact/route.ts
export async function POST(req: Request) {
  const body = await req.json()

  // Save to database
  await prisma.contact.create({ data: body })

  // Send Discord notification
  await sendDiscordNotification(body)

  return Response.json({ success: true })
}
```

**Use cases**:
- Contact form submissions
- Webhooks (Discord, Stripe, etc.)
- Public APIs
- Third-party integrations

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│   Profile   │
│  (Singleton)│
└─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Project   │     │  BlogPost   │     │ Publication │
│             │     │             │     │             │
│ - slug      │     │ - slug      │     │ - slug      │
│ - published │     │ - published │     │ - published │
│ - order     │     │ - tags[]    │     │ - authors[] │
└─────────────┘     └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│WorkExperience│    │  Education  │     │    Skill    │
│             │     │             │     │             │
│ - current   │     │ - current   │     │ - category  │
│ - order     │     │ - order     │     │ - proficiency│
└─────────────┘     └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐
│   Contact   │     │    User     │
│             │     │  (Supabase) │
│ - read      │     │ - email     │
│ - createdAt │     │ - role      │
└─────────────┘     └─────────────┘
```

### Key Design Decisions

1. **UUID Primary Keys**: Better for distributed systems and security
2. **JSON Arrays**: For flexible lists (tags, authors, achievements)
3. **Slug Fields**: SEO-friendly URLs for public content
4. **Published Flags**: Draft/publish workflow
5. **Display Order**: Manual sorting control
6. **Timestamps**: Track creation and updates
7. **Indexes**: Optimized for common queries

### Schema Highlights

```prisma
model Profile {
  id              String   @id @default(dbgenerated("gen_random_uuid()"))
  name            String
  email           String
  githubUrl       String?
  linkedinUrl     String?
  resumeUrl       String?
  // ... other fields
}

model Project {
  id              String   @id @default(dbgenerated("gen_random_uuid()"))
  slug            String   @unique
  title           String
  published       Boolean  @default(false)
  displayOrder    Int      @default(0)
  techStack       String[] // Array of technologies
  // ... other fields

  @@index([published, displayOrder])
}

model BlogPost {
  id              String    @id @default(dbgenerated("gen_random_uuid()"))
  slug            String    @unique
  title           String
  published       Boolean   @default(false)
  publishedAt     DateTime?
  tags            String[]  // Array of tags
  // ... other fields

  @@index([published, publishedAt])
}
```

## Authentication Flow

### Signup Flow

```
┌──────┐      ┌───────────┐      ┌─────────────┐      ┌──────────┐
│User  │      │ Signup    │      │ Supabase    │      │Database  │
│      │      │ Page      │      │ Auth        │      │          │
└──┬───┘      └─────┬─────┘      └──────┬──────┘      └────┬─────┘
   │                │                    │                  │
   │   Navigate     │                    │                  │
   ├───────────────>│                    │                  │
   │                │                    │                  │
   │                │  Check if users    │                  │
   │                │  exist             │                  │
   │                ├───────────────────>│                  │
   │                │                    │  Query users     │
   │                │                    ├─────────────────>│
   │                │                    │<─────────────────┤
   │                │<───────────────────┤                  │
   │                │                    │                  │
   │  Show form or  │                    │                  │
   │  "Access Denied"                    │                  │
   │<───────────────┤                    │                  │
   │                │                    │                  │
   │   Submit form  │                    │                  │
   ├───────────────>│                    │                  │
   │                │  Create account    │                  │
   │                ├───────────────────>│                  │
   │                │                    │  Store user      │
   │                │                    ├─────────────────>│
   │                │  Send verification │                  │
   │                │  email             │                  │
   │<───────────────┼────────────────────┤                  │
```

### Login Flow

```
┌──────┐      ┌───────────┐      ┌─────────────┐      ┌──────────┐
│User  │      │ Login     │      │ Supabase    │      │Middleware│
│      │      │ Page      │      │ Auth        │      │ (Proxy)  │
└──┬───┘      └─────┬─────┘      └──────┬──────┘      └────┬─────┘
   │                │                    │                  │
   │  Submit creds  │                    │                  │
   ├───────────────>│                    │                  │
   │                │  Sign in           │                  │
   │                ├───────────────────>│                  │
   │                │                    │                  │
   │                │  JWT + session     │                  │
   │                │<───────────────────┤                  │
   │                │  Set cookies       │                  │
   │<───────────────┤                    │                  │
   │                │                    │                  │
   │  Navigate to   │                    │                  │
   │  /admin        │                    │                  │
   ├───────────────────────────────────────────────────────>│
   │                │                    │  Verify session  │
   │                │                    │<─────────────────┤
   │                │                    │  Valid session   │
   │                │                    ├─────────────────>│
   │  Render admin  │                    │                  │
   │<────────────────────────────────────────────────────────┤
```

### Authentication Middleware (Proxy)

```typescript
// src/proxy.ts
export async function proxy(request: NextRequest) {
  const supabase = createServerClient(/* ... */)

  // Refresh session
  const { data: { session } } = await supabase.auth.getSession()

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/signup'

    if (!session && !isAuthPage) {
      // Redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (session && isAuthPage) {
      // Already logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return response
}
```

## Data Flow

### Public Page Rendering

```
User Request
    ↓
Next.js Server
    ↓
Server Component
    ↓
Direct Prisma Query ──→ PostgreSQL
    ↓
Render HTML
    ↓
Send to Client
```

### Admin Form Submission

```
User Submits Form
    ↓
Client Component (with Server Action)
    ↓
Server Action
    ↓
Prisma Mutation ──→ PostgreSQL
    ↓
Revalidate Cache
    ↓
Return Result
    ↓
Update UI
```

### Contact Form Flow

```
User Submits Form
    ↓
POST /api/contact
    ↓
┌─────────────┬──────────────┐
│             │              │
Save to DB    Send Discord   │
    ↓         Notification   │
PostgreSQL    Discord API    │
    │             │          │
    └─────────────┴──────────┘
           ↓
    Return Success
           ↓
    Show Confirmation
```

## API Design

### RESTful Endpoints

```
GET  /api/profile          # Get profile data
PUT  /api/profile          # Update profile

POST /api/contact          # Submit contact form
```

### Server Actions

```typescript
// app/actions/projects.ts
export async function createProject(data)
export async function updateProject(id, data)
export async function deleteProject(id)
export async function publishProject(id)

// app/actions/blog.ts
export async function createPost(data)
export async function updatePost(id, data)
export async function deletePost(id)

// app/actions/contacts.ts
export async function getContacts()
export async function markAsRead(id)
export async function deleteContact(id)
```

### Response Formats

**Success Response**:
```typescript
{
  success: true,
  data: { /* entity */ },
  message?: "Operation successful"
}
```

**Error Response**:
```typescript
{
  success: false,
  error: "Error message",
  details?: { /* validation errors */ }
}
```

## Security

### Authentication & Authorization

1. **Single Admin Account**: Enforced at signup - only one account allowed
2. **Email Verification**: Required before login
3. **JWT Tokens**: Secure session management via Supabase
4. **HTTP-Only Cookies**: Tokens stored securely, not accessible to JavaScript
5. **Middleware Protection**: All `/admin` routes protected by proxy middleware

### Input Validation

```typescript
// Server-side validation
export async function createProject(data: FormData) {
  // Validate required fields
  if (!data.get('title') || !data.get('slug')) {
    return { success: false, error: 'Missing required fields' }
  }

  // Sanitize inputs
  const title = sanitize(data.get('title'))

  // Prevent SQL injection (Prisma handles this)
  await prisma.project.create({ data: { title } })
}
```

### Environment Variables

**Public** (NEXT_PUBLIC_*):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

**Private** (Server-only):
- `DATABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DISCORD_WEBHOOK_URL`

### CORS & CSP

```typescript
// API routes include CORS headers
headers: {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
```

### Rate Limiting

Implemented at edge level via Vercel:
- Protects against brute force attacks
- Limits API requests per IP
- Configurable per route

## Performance

### Optimization Strategies

1. **React Server Components**
   - Zero client JavaScript for static content
   - Direct database access
   - Streaming and Suspense

2. **Incremental Static Regeneration (ISR)**
   ```typescript
   export const revalidate = 60 // Revalidate every 60 seconds
   ```

3. **Image Optimization**
   - Next.js automatic image optimization
   - WebP format conversion
   - Responsive images
   - Lazy loading

4. **Code Splitting**
   - Automatic route-based splitting
   - Dynamic imports for heavy components
   - Minimal client JavaScript

5. **Database Indexes**
   ```prisma
   @@index([published, displayOrder])
   @@index([published, publishedAt])
   ```

6. **Edge Caching**
   - Vercel Edge Network
   - Cached at 300+ global locations
   - Automatic cache invalidation

### Performance Metrics

**Target Metrics**:
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Deployment

### Production Architecture

```
┌────────────────────────────────────────────────────┐
│                  Vercel Edge Network               │
│  ┌──────────────────────────────────────────────┐ │
│  │          CDN (300+ locations)                │ │
│  │  - Static assets                             │ │
│  │  - Cached pages                              │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────┬─────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   Next.js Server    │
        │   (Serverless)      │
        └──────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────┐  ┌─────▼─────┐  ┌────▼────┐
│Supabase│  │ Supabase  │  │ Discord │
│  DB    │  │   Auth    │  │Webhooks │
└────────┘  └───────────┘  └─────────┘
```

### Deployment Process

1. **Code Push**
   ```bash
   git push origin main
   ```

2. **Automatic Build** (Vercel)
   - Install dependencies
   - Run type checking
   - Build production bundle
   - Generate static pages

3. **Deploy to Edge**
   - Deploy to global edge network
   - Update DNS
   - Automatic HTTPS

4. **Database Migration** (if needed)
   ```bash
   npx prisma migrate deploy
   ```

### Environment Separation

**Development**:
- Local PostgreSQL (Docker)
- Local Supabase emulator (optional)
- Test Discord webhook

**Production**:
- Supabase PostgreSQL
- Supabase Auth
- Production Discord webhook

### Monitoring & Logging

**Vercel Analytics**:
- Real User Monitoring (RUM)
- Web Vitals tracking
- Error tracking
- Performance insights

**Logs**:
- Server logs via Vercel dashboard
- Database logs via Supabase
- Custom logging with `console.log` (development)

### Backup Strategy

1. **Database**: Supabase automated daily backups
2. **Code**: Git version control
3. **Environment**: `.env.local.example` in repository
4. **Content**: Periodic Prisma Studio exports

## Scalability Considerations

### Horizontal Scaling

- **Serverless Functions**: Auto-scale with traffic
- **Edge Network**: Distributed globally
- **Database**: Supabase handles connection pooling

### Caching Strategy

```typescript
// Route-level caching
export const revalidate = 60

// Per-request caching
const projects = await prisma.project.findMany({
  where: { published: true },
  // Cached for 1 hour
  cache: 'force-cache',
  next: { revalidate: 3600 }
})
```

### Future Improvements

1. **Full-text Search**: PostgreSQL full-text search or Algolia
2. **CDN for Media**: Cloudinary or Imgix integration
3. **Email Service**: SendGrid or Resend for transactional emails
4. **Analytics**: PostHog or Plausible for privacy-friendly analytics
5. **CMS Integration**: Sanity or Contentful for non-technical users

## Conclusion

This architecture provides a modern, scalable, and maintainable foundation for a personal portfolio platform. Key benefits:

- **Developer Experience**: Type-safe, minimal boilerplate, fast iteration
- **Performance**: Server-first approach, edge caching, optimized assets
- **Cost-Effective**: Free tier covers most use cases ($0-27/month)
- **Secure**: Industry-standard auth, input validation, secure secrets
- **Scalable**: Serverless architecture, global CDN, efficient caching

The monolithic Next.js approach eliminates complexity of separate frontend/backend while maintaining flexibility through server components, server actions, and API routes where needed.
