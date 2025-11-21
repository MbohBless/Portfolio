# Portfolio Frontend

Next.js 14 full-stack application with Prisma ORM, Server Components, and Server Actions.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Styling**: Tailwind CSS 3
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Database**: PostgreSQL (via Prisma)

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (pages)/              # Public & admin pages
│   │   ├── actions/              # Server Actions (mutations)
│   │   ├── api/                  # API Routes (search, upload)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/               # React components
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client
│   │   ├── supabase.ts          # Supabase client
│   │   ├── auth.ts              # Auth helpers
│   │   └── utils.ts
│   ├── types/                    # TypeScript types
│   └── middleware.ts             # Auth middleware
├── prisma/
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL (via Docker or Supabase)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Initialize database
npm run db:push

# Start development server
npm run dev
```

Access at http://localhost:3000

## Available Scripts

### Development
```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

### Database (Prisma)
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Sync schema to DB (dev)
npm run db:migrate   # Create migration (prod)
npm run db:studio    # Open Prisma Studio GUI
```

## Key Features

### 1. Server Components (Direct DB Access)

Pages query the database directly without API calls:

```typescript
// app/projects/page.tsx
import { prisma } from '@/lib/prisma'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true }
  })
  return <ProjectGrid projects={projects} />
}
```

**Benefits**: No API roundtrips, better SEO, faster TTFB

### 2. Server Actions (Mutations)

Forms use Server Actions instead of REST endpoints:

```typescript
// app/actions/projects.ts
'use server'

export async function createProject(data) {
  const project = await prisma.project.create({ data })
  revalidatePath('/projects')
  return { success: true, project }
}
```

**Benefits**: Type-safe, no API client needed, progressive enhancement

### 3. API Routes (External Access)

Only for operations that need external access:

- `GET /api/search` - Full-text search
- `POST /api/upload` - File uploads

### 4. Authentication Middleware

Protected routes (`/admin/*`) require Supabase Auth:

```typescript
// middleware.ts
export async function middleware(request) {
  const session = await supabase.auth.getSession()
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect('/login')
  }
}
```

## Environment Variables

Create `.env.local` with:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio

# Supabase (Public - exposed to browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (Server-only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=portfolio-files
```

## Database Schema

Managed by Prisma. See `prisma/schema.prisma` for full schema.

### Main Models

- **Project**: Portfolio projects
- **Publication**: Academic papers
- **BlogPost**: Blog articles (MDX)
- **MediaFile**: Uploaded files
- **User**: Admin users

### Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Push changes (dev)
npm run db:push

# 3. Or create migration (prod)
npm run db:migrate

# 4. Regenerate client
npm run db:generate
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repo
2. Set root directory: `frontend`
3. Add environment variables
4. Deploy automatically on push

### Environment Variables (Vercel)

Required secrets:
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Build Command

Vercel auto-detects Next.js. Custom build:

```json
{
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

## Adding Content

### Option 1: Prisma Studio (GUI)

```bash
npm run db:studio
```

Opens GUI at http://localhost:5555 for easy data management.

### Option 2: Server Actions (Admin Panel)

Use admin panel once auth is implemented.

### Option 3: Direct SQL

```bash
# Connect to database
psql $DATABASE_URL

# Insert data
INSERT INTO projects (...) VALUES (...);
```

## Troubleshooting

### Prisma Client Not Found

```bash
npm run db:generate
```

### Database Connection Failed

Check `DATABASE_URL` in `.env.local` and ensure Postgres is running:

```bash
docker-compose up -d postgres  # Or use Supabase
```

### Build Errors

Clear cache and rebuild:

```bash
rm -rf .next
npm run build
```

## Architecture Benefits

### vs. Separate Backend

| Before (2-tier) | Now (Monolith) |
|----------------|----------------|
| API calls | Direct DB access |
| 2 deployments | 1 deployment |
| $25-50/mo | $0/mo |
| Network latency | In-process calls |

### Performance

- Server Components: No client JS for data fetching
- ISR: Static generation with 60s revalidation
- Prisma: Connection pooling & prepared statements

## Next Steps

1. Run `npm run db:studio` to add sample content
2. Implement admin UI forms
3. Add MDX rendering for blog posts
4. Set up Supabase Auth for login

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Parent README](../README.md)
