# Portfolio System Architecture

## System Overview

Production-grade personal portfolio platform built with **Next.js 14**, **Prisma ORM**, and **PostgreSQL**.

### Key Features
- Public content (projects, publications, blog with MDX)
- Admin panel for content management (protected by Supabase Auth)
- Full-text search across all content
- File storage for PDFs and media
- Server-side rendering for optimal SEO
- Direct database access (no API layer)

---

## Technology Stack

### Frontend & Backend (Unified)
- **Framework**: Next.js 14+ (App Router, React Server Components)
- **Language**: TypeScript 5+
- **ORM**: Prisma 5
- **Styling**: TailwindCSS 3+
- **Content**: MDX for blog posts
- **Deployment**: Vercel (serverless)

### Data Layer
- **Database**: PostgreSQL 15+ (Supabase recommended)
- **Storage**: Supabase Storage (S3-compatible)
- **Auth**: Supabase Auth (JWT-based)

### Infrastructure
- **Local Dev**: Docker Compose (Postgres only)
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics + Supabase Dashboard

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                     (Browser/Mobile)                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS
                 │
    ┌────────────▼────────────┐
    │   Vercel Edge Network    │
    │   (CDN + Edge Runtime)   │
    └────────────┬─────────────┘
                 │
        ┌────────▼─────────┐
        │  Next.js App     │
        │  (Full-Stack)    │
        │                  │
        │  • Server        │
        │    Components    │
        │  • Server        │
        │    Actions       │
        │  • API Routes    │
        │  • Middleware    │
        └─────┬────────────┘
              │
              │ Prisma ORM
              │
    ┌─────────┼─────────────┐
    │         │             │
    │         │             │
┌───▼─────┐ ┌─▼──────────┐ ┌▼────────────┐
│Supabase │ │ Supabase   │ │  Supabase   │
│Auth     │ │ Postgres   │ │  Storage    │
│         │ │            │ │             │
│• JWT    │ │• users     │ │• PDFs       │
│• OAuth  │ │• projects  │ │• Images     │
│         │ │• pubs      │ │• MDX files  │
│         │ │• blog_posts│ │             │
└─────────┘ └────────────┘ └─────────────┘
```

---

## Request Flow Examples

### Public Page (Server Component)
```
1. User visits /projects
2. Next.js Server Component executes
3. Prisma queries: prisma.project.findMany({ where: { published: true }})
4. HTML rendered on server with data
5. Static HTML sent to browser
6. React hydrates client-side
```

**Advantages:**
- No API roundtrip delay
- SEO-friendly (fully rendered HTML)
- Faster Time to First Byte (TTFB)

### Admin Action (Server Action)
```
1. Admin submits form to create project
2. Form calls createProject() Server Action
3. Next.js validates JWT via middleware
4. Server Action: prisma.project.create({ data })
5. revalidatePath('/projects') clears cache
6. Success response returned
7. Page auto-updates with new data
```

**Advantages:**
- No REST API needed
- Type-safe end-to-end
- Progressive enhancement (works without JS)

### Search (API Route)
```
1. User types in search box
2. Frontend calls GET /api/search?q=keyword
3. API route queries Prisma across all tables
4. Returns unified JSON results
5. Frontend displays results
```

**Use Case:** External access or complex operations not suited for Server Actions.

### File Upload (API Route)
```
1. Admin uploads file via form
2. POST /api/upload (multipart/form-data)
3. API route uploads to Supabase Storage
4. Saves metadata to media_files table
5. Returns public URL
6. Admin uses URL in project/publication
```

---

## Database Schema

### Tables

#### users
```prisma
model User {
  id         String   @id @default(dbgenerated("gen_random_uuid()"))
  email      String   @unique
  name       String?
  avatarUrl  String?
  role       String   @default("admin")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  mediaFiles MediaFile[]
}
```

#### projects
```prisma
model Project {
  id           String   @id @default(dbgenerated("gen_random_uuid()"))
  title        String
  slug         String   @unique
  description  String?
  techStack    String[] @default([])
  githubUrl    String?
  demoUrl      String?
  thumbnailUrl String?
  images       String[] @default([])
  published    Boolean  @default(false)
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### publications
```prisma
model Publication {
  id        String   @id @default(dbgenerated("gen_random_uuid()"))
  title     String
  slug      String   @unique
  authors   String[]
  year      Int
  venue     String?
  doi       String?
  arxivId   String?
  pdfUrl    String?
  abstract  String?
  tags      String[] @default([])
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### blog_posts
```prisma
model BlogPost {
  id            String    @id @default(dbgenerated("gen_random_uuid()"))
  title         String
  slug          String    @unique
  excerpt       String?
  contentUrl    String?
  coverImageUrl String?
  tags          String[]  @default([])
  published     Boolean   @default(false)
  publishedAt   DateTime?
  readingTime   Int       @default(0)
  views         Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### media_files
```prisma
model MediaFile {
  id           String   @id @default(dbgenerated("gen_random_uuid()"))
  originalName String
  storagePath  String
  url          String
  mimeType     String
  sizeBytes    BigInt
  uploadedBy   String?  @db.Uuid
  metadata     Json     @default("{}")
  createdAt    DateTime @default(now())

  user User? @relation(fields: [uploadedBy], references: [id])
}
```

### Indexes

Automatically managed by Prisma:
```prisma
@@index([slug])
@@index([published])
@@index([publishedAt(sort: Desc)])
@@index([createdAt(sort: Desc)])
```

---

## Folder Structure

```
portfolio/
├── frontend/                      # Next.js monorepo (all code)
│   ├── src/
│   │   ├── app/                  # App Router
│   │   │   ├── (pages)/
│   │   │   │   ├── page.tsx     # Home
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx              # List
│   │   │   │   │   └── [slug]/page.tsx       # Detail
│   │   │   │   ├── publications/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   └── admin/
│   │   │   │       ├── page.tsx              # Dashboard
│   │   │   │       ├── projects/
│   │   │   │       ├── publications/
│   │   │   │       └── blog/
│   │   │   ├── actions/          # Server Actions (mutations)
│   │   │   │   ├── projects.ts
│   │   │   │   ├── publications.ts
│   │   │   │   └── blog.ts
│   │   │   ├── api/              # API Routes (external)
│   │   │   │   ├── search/
│   │   │   │   │   └── route.ts
│   │   │   │   └── upload/
│   │   │   │       └── route.ts
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/           # React components
│   │   │   ├── ui/               # Reusable UI components
│   │   │   ├── layout/
│   │   │   └── admin/
│   │   ├── lib/
│   │   │   ├── prisma.ts         # Prisma client singleton
│   │   │   ├── supabase.ts       # Supabase client
│   │   │   ├── auth.ts           # Auth helpers
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types
│   │   └── middleware.ts         # Route protection
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
├── migrations/                    # Legacy SQL (reference only)
├── .github/workflows/
│   └── frontend.yml              # CI/CD pipeline
├── docker-compose.yml            # Local Postgres
├── .env.example
└── README.md
```

---

## Data Flow Patterns

### Pattern 1: Server Component (Read)

**Use Case:** Display public content

```typescript
// app/projects/page.tsx
import { prisma } from '@/lib/prisma'

export default async function ProjectsPage() {
  // Direct database query in Server Component
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { displayOrder: 'asc' }
  })

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

**Execution:** Server-side only, no client bundle impact

### Pattern 2: Server Action (Write)

**Use Case:** Admin creates/updates content

```typescript
// app/actions/projects.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const project = await prisma.project.create({
    data: {
      title: formData.get('title'),
      slug: formData.get('slug'),
      // ... other fields
    }
  })

  revalidatePath('/projects') // Clear cache
  return { success: true, project }
}
```

**Usage in Client Component:**
```typescript
'use client'

import { createProject } from '@/app/actions/projects'

export function CreateProjectForm() {
  return (
    <form action={createProject}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  )
}
```

### Pattern 3: API Route (Complex Operations)

**Use Case:** Search, file upload, webhooks

```typescript
// app/api/search/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')

  const results = await prisma.$queryRaw`
    SELECT * FROM search_all(${query}, 20)
  `

  return NextResponse.json({ results })
}
```

**Usage:** Standard fetch from client or external services

---

## Authentication & Authorization

### Flow

1. **Login**: User authenticates via Supabase Auth (email/OAuth)
2. **JWT Storage**: Token stored in HTTP-only cookie
3. **Middleware**: `middleware.ts` validates JWT on protected routes
4. **Authorization**: Check user role in Server Actions

### Implementation

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { session } } = await supabase.auth.getSession()

  if (request.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect('/login')
  }
}
```

### Protected Routes

- `/admin/*` - Requires authentication
- All API routes in `/api/upload/*` - Requires JWT

---

## Performance Optimizations

### Server Components
- ✅ **No JavaScript sent to client** for data fetching
- ✅ **Parallel data fetching** with React Suspense
- ✅ **Automatic code splitting** at component level

### Caching Strategy
```typescript
// Revalidate every 60 seconds
export const revalidate = 60

// Or on-demand revalidation
revalidatePath('/projects')
revalidateTag('projects-list')
```

### Database
- **Connection Pooling**: Prisma handles automatically
- **Prepared Statements**: All queries are parameterized
- **Indexes**: Defined in Prisma schema, auto-created on migration

### Static Generation (ISR)
- Blog posts: Statically generated, revalidated on change
- Projects/Publications: ISR with 60s revalidation
- Admin pages: Dynamic (always fresh)

---

## Security

### SQL Injection
✅ **Protected**: Prisma uses prepared statements automatically

### XSS
✅ **Protected**: React escapes content by default
⚠️ **Note**: Sanitize MDX content before storing

### CSRF
✅ **Protected**: Server Actions use built-in CSRF tokens

### JWT Validation
✅ **Protected**: Middleware validates all admin requests

### Rate Limiting
⚠️ **TODO**: Add rate limiting middleware for API routes

---

## Deployment

### Vercel (Recommended)

**Step 1:** Connect GitHub repo

**Step 2:** Configure project
```
Root Directory: frontend
Framework: Next.js
Build Command: npm run build
```

**Step 3:** Environment Variables
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Step 4:** Deploy
- Automatic on push to `main`
- Preview deployments on PRs

### Database Migrations

```bash
# Option 1: Prisma Migrate (production)
npx prisma migrate deploy

# Option 2: Prisma Push (development)
npx prisma db push
```

Run from Vercel Build Command:
```json
{
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

---

## Monitoring & Observability

### Logs
- **Server-side**: Vercel Functions logs
- **Client-side**: Vercel Web Analytics
- **Database**: Supabase Dashboard (query performance)

### Metrics
- **Web Vitals**: Tracked by Vercel Analytics
- **Database**: Connection pool, query latency (Supabase)
- **Errors**: Console logs → Sentry (optional)

### Alerts
- Vercel: Deployment failures, quota warnings
- Supabase: Disk usage, slow queries

---

## Cost Analysis

### Monthly Costs

| Service | Tier | Features | Cost |
|---------|------|----------|------|
| **Vercel** | Hobby | 100GB bandwidth, serverless functions | **$0** |
| **Supabase** | Free | 500MB DB, 1GB storage, 50K auth users | **$0** |
| **Domain** | - | .com from Namecheap | **$1-2** |
| **Total** | | | **$1-2/mo** |

### Scaling Costs

| Tier | Traffic | Cost |
|------|---------|------|
| Hobby/Free | <100K visitors/mo | **$0-2** |
| Pro | 100K-1M visitors/mo | **$20-50** |
| Enterprise | >1M visitors/mo | **Custom** |

---

## Development Workflow

### Local Setup
```bash
# 1. Start database
docker-compose up -d

# 2. Install dependencies
cd frontend && npm install

# 3. Setup database
npm run db:push

# 4. Start dev server
npm run dev
```

### Making Schema Changes
```bash
# 1. Edit prisma/schema.prisma
# 2. Push changes
npm run db:push

# 3. Regenerate client
npm run db:generate
```

### Adding New Features
```bash
# 1. Create Server Action in app/actions/
# 2. Create page in app/(pages)/
# 3. Test locally
# 4. Commit and push (auto-deploys)
```

---

## Why This Architecture?

### Advantages Over Microservices

| **Microservices** (Old) | **Monolith** (Current) |
|--------------------------|------------------------|
| Multiple repos to sync | Single source of truth |
| Network latency between services | In-process function calls |
| Complex deployment coordination | One-click deployment |
| Polyglot infrastructure overhead | Unified TypeScript stack |
| $25-50/mo minimum cost | $0 with free tiers |

### When to Consider Splitting

Only if you need:
1. **Independent scaling** of different services (unlikely for portfolio)
2. **Polyglot teams** (different languages per service)
3. **Strict isolation** between business domains
4. **Compliance** requirements (data locality, separate audit logs)

For a portfolio site: **Monolith is optimal.**

---

## Future Enhancements

### Phase 1 (Immediate)
- [ ] Admin UI forms for CRUD operations
- [ ] MDX rendering with `next-mdx-remote`
- [ ] Login page with Supabase Auth

### Phase 2 (Short-term)
- [ ] Newsletter integration (Resend/SendGrid)
- [ ] Comment system (Giscus/GitHub Discussions)
- [ ] Dark mode toggle

### Phase 3 (Long-term)
- [ ] Full-text search with PostgreSQL `tsvector` (already in schema)
- [ ] Analytics dashboard (view counts, popular posts)
- [ ] RSS feed generation
- [ ] Sitemap auto-generation
- [ ] E2E tests with Playwright

---

## References

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Deployment**: https://vercel.com/docs

---

## Support

For issues or questions:
1. Check README.md for common problems
2. Review Prisma schema for database structure
3. Inspect Server Actions for mutation logic
4. Check middleware.ts for auth flow
