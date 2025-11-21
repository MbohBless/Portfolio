# Portfolio System

Production-grade personal portfolio platform built with Next.js, Prisma, and PostgreSQL.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript, Tailwind CSS, MDX)
- **ORM**: Prisma 5
- **Database**: PostgreSQL 15+ (Supabase recommended)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth (JWT)
- **Deployment**: Vercel

## Project Structure

```
portfolio/
├── frontend/              # Next.js monorepo (all code here)
│   ├── src/
│   │   ├── app/          # Pages & API routes
│   │   │   ├── actions/  # Server Actions (mutations)
│   │   │   └── api/      # API routes (search, upload)
│   │   ├── lib/          # Prisma, Supabase, utilities
│   │   └── types/        # TypeScript definitions
│   ├── prisma/           # Database schema
│   └── public/           # Static assets
├── migrations/           # Legacy SQL migrations (reference)
├── .github/workflows/   # CI/CD pipeline
└── docker-compose.yml   # Local Postgres
```

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Supabase account

## Quick Start

### 1. Clone and Configure

```bash
git clone <your-repo-url>
cd portfolio

# Copy environment file
cp frontend/.env.local.example frontend/.env.local

# Edit with your Supabase credentials
```

### 2. Start Local Database

```bash
docker-compose up -d postgres
```

### 3. Set up Prisma

```bash
cd frontend

# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or run migrations
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev

# Frontend runs on http://localhost:3000
```

## Development Workflow

### Database Operations

```bash
cd frontend

# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema to database (no migration files)
npm run db:push

# Create migration (for production)
npm run db:migrate

# Open Prisma Studio (GUI for database)
npm run db:studio
```

### Frontend Development

```bash
cd frontend

# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build
npm start
```

## Key Features

### Server Components (Direct DB Access)

Pages query the database directly—no API calls needed:

```typescript
// app/projects/page.tsx
import { prisma } from '@/lib/prisma'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
  })
  return <ProjectGrid projects={projects} />
}
```

### Server Actions (Mutations)

Forms use Server Actions instead of API routes:

```typescript
// app/actions/projects.ts
'use server'

export async function createProject(data) {
  const project = await prisma.project.create({ data })
  revalidatePath('/projects')
  return { success: true, data: project }
}
```

### API Routes (External Access)

Only needed for external calls or complex operations:

- `GET /api/search` - Full-text search
- `POST /api/upload` - File upload to Supabase Storage

## Environment Variables

### Required (frontend/.env.local)

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio

# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (Server-only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=portfolio-files
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to `main`

### Required Secrets

- `DATABASE_URL` - Production Postgres connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### Database Setup (Supabase)

1. Create Supabase project
2. In Vercel, set `DATABASE_URL` to Supabase connection string
3. Run `npm run db:push` to create tables
4. Create storage bucket: `portfolio-files`
5. Enable Auth providers (Email, OAuth, etc.)

## Common Tasks

### Adding Content

Use Prisma Studio for easy data management:

```bash
cd frontend
npm run db:studio
```

Or use Server Actions from the admin panel (once auth is set up).

### Creating a Blog Post

1. Write MDX content
2. Upload to Supabase Storage
3. Create blog post entry with `contentUrl` pointing to file

### Running Search

```bash
curl "http://localhost:3000/api/search?q=keyword"
```

## Schema Changes

When you modify `frontend/prisma/schema.prisma`:

```bash
# Development (instant, no migration files)
npm run db:push

# Production (creates migration)
npm run db:migrate

# Then regenerate client
npm run db:generate
```

## Testing

```bash
cd frontend
npm run type-check  # TypeScript validation
npm run lint        # ESLint
```

## Troubleshooting

### Database Connection Failed

- Ensure Postgres is running: `docker-compose ps`
- Check `DATABASE_URL` in `.env.local`
- Verify Prisma schema: `npx prisma validate`

### Prisma Client Not Found

```bash
npm run db:generate
```

### Auth Not Working

- Verify Supabase credentials in `.env.local`
- Check middleware is enabled (`frontend/src/middleware.ts`)
- Ensure `/admin` routes are protected

## Architecture Benefits

### vs. Separate Backend

| **Before** (Ktor Backend) | **Now** (Next.js Only) |
|---------------------------|------------------------|
| 2 repos to maintain | 1 monorepo |
| API calls between services | Direct DB access |
| Separate deployments | Single deployment |
| JVM cold starts | Edge/Node.js (fast) |
| ~$25-50/mo hosting | $0 on Vercel Free |

### Performance

- **Server Components**: No API roundtrips, data fetched directly
- **Server Actions**: Form mutations without REST endpoints
- **ISR**: Static generation with 60s revalidation
- **Edge Runtime**: Auth middleware runs on edge

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Supabase | Free/Pro | $0-25 |
| Domain | Namecheap | $1-2 |
| **Total** | | **$1-27/mo** |

## Contributing

1. Create feature branch
2. Make changes
3. Run `npm run type-check && npm run lint`
4. Submit pull request

## License

MIT
