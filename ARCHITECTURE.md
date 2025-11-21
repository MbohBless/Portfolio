# Portfolio System Architecture

## System Overview

Production-grade personal portfolio platform with:
- Public content (projects, publications, blog)
- Admin panel for content management
- Full-text search
- File storage for PDFs and media

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: TailwindCSS 3+
- **Content**: MDX for blog posts
- **Deployment**: Vercel

### Backend
- **Framework**: Ktor 2.3+
- **Language**: Kotlin 1.9+
- **Runtime**: JVM 17+
- **Deployment**: Render (Docker container)

### Data Layer
- **Database**: PostgreSQL 15+ (Supabase)
- **Storage**: Supabase Storage (S3-compatible)
- **Auth**: Supabase Auth (JWT)

### Infrastructure
- **Local Dev**: Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Supabase Dashboard + Vercel Analytics

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
        │  Next.js Frontend │
        │  (App Router)     │
        │                   │
        │  • SSR Pages      │
        │  • Server Actions │
        │  • Static Assets  │
        └─────┬─────────────┘
              │
              │ REST API
              │ (Auth: JWT Bearer Token)
              │
        ┌─────▼──────────────┐
        │  Ktor Backend      │
        │  (Render/Docker)   │
        │                    │
        │  • /auth           │
        │  • /projects       │
        │  • /publications   │
        │  • /blog-posts     │
        │  • /upload         │
        │  • /search         │
        └─────┬──────────────┘
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
└─────────┘ │• pubs      │ └─────────────┘
            │• blog_posts│
            └────────────┘
```

---

## API Contract

### Base URL
- **Production**: `https://api.yourdomain.com`
- **Local**: `http://localhost:8080`

### Authentication
All admin endpoints require JWT in header:
```
Authorization: Bearer <supabase_jwt_token>
```

### Endpoints

#### Auth
```
POST   /auth/login
POST   /auth/refresh
```

#### Projects
```
GET    /projects           # Public - list all
GET    /projects/:id       # Public - get one
POST   /projects           # Admin - create
PUT    /projects/:id       # Admin - update
DELETE /projects/:id       # Admin - delete
```

#### Publications
```
GET    /publications       # Public - list all
GET    /publications/:id   # Public - get one
POST   /publications       # Admin - create
PUT    /publications/:id   # Admin - update
DELETE /publications/:id   # Admin - delete
```

#### Blog Posts
```
GET    /blog-posts         # Public - list all (with pagination)
GET    /blog-posts/:slug   # Public - get one by slug
POST   /blog-posts         # Admin - create
PUT    /blog-posts/:id     # Admin - update
DELETE /blog-posts/:id     # Admin - delete
```

#### File Upload
```
POST   /upload             # Admin - upload to Supabase Storage
DELETE /upload/:file_id    # Admin - delete file
```

#### Search
```
GET    /search?q=keyword   # Public - keyword search across all content
```

---

## Database Schema

### Tables

#### users
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
email           TEXT UNIQUE NOT NULL
name            TEXT
avatar_url      TEXT
role            TEXT DEFAULT 'admin' -- extendable for multi-user
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### projects
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
title           TEXT NOT NULL
slug            TEXT UNIQUE NOT NULL
description     TEXT
tech_stack      TEXT[] -- Array of technologies
github_url      TEXT
demo_url        TEXT
thumbnail_url   TEXT
images          TEXT[] -- Array of image URLs
published       BOOLEAN DEFAULT false
display_order   INTEGER
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### publications
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
title           TEXT NOT NULL
slug            TEXT UNIQUE NOT NULL
authors         TEXT[] NOT NULL
year            INTEGER NOT NULL
venue           TEXT -- Conference/Journal name
doi             TEXT
arxiv_id        TEXT
pdf_url         TEXT -- Supabase Storage URL
abstract        TEXT
tags            TEXT[]
published       BOOLEAN DEFAULT false
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### blog_posts
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
title           TEXT NOT NULL
slug            TEXT UNIQUE NOT NULL
excerpt         TEXT
content_url     TEXT -- Supabase Storage URL to .mdx file
cover_image_url TEXT
tags            TEXT[]
published       BOOLEAN DEFAULT false
published_at    TIMESTAMPTZ
reading_time    INTEGER -- minutes
views           INTEGER DEFAULT 0
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### media_files
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
original_name   TEXT NOT NULL
storage_path    TEXT NOT NULL -- Supabase Storage path
url             TEXT NOT NULL -- Public URL
mime_type       TEXT NOT NULL
size_bytes      INTEGER NOT NULL
uploaded_by     UUID REFERENCES users(id)
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### analytics_events (optional)
```sql
id              BIGSERIAL PRIMARY KEY
event_type      TEXT NOT NULL -- 'page_view', 'download', etc.
resource_type   TEXT -- 'blog_post', 'publication', etc.
resource_id     UUID
ip_hash         TEXT -- Hashed IP for privacy
user_agent      TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### Indexes
```sql
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published) WHERE published = true;
CREATE INDEX idx_publications_slug ON publications(slug);
CREATE INDEX idx_publications_year ON publications(year DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC) WHERE published = true;
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
```

### Full-Text Search
```sql
-- Add tsvector columns for efficient search
ALTER TABLE projects ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED;

ALTER TABLE publications ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(abstract, ''))
  ) STORED;

ALTER TABLE blog_posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
  ) STORED;

CREATE INDEX idx_projects_search ON projects USING GIN(search_vector);
CREATE INDEX idx_publications_search ON publications USING GIN(search_vector);
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_vector);
```

---

## Folder Structure

```
portfolio/
├── .github/
│   └── workflows/
│       ├── frontend.yml       # Vercel deployment
│       ├── backend.yml        # Render deployment + tests
│       └── migrations.yml     # DB migrations on merge
├── frontend/                  # Next.js app
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── page.tsx      # Home
│   │   │   ├── projects/
│   │   │   ├── publications/
│   │   │   ├── blog/
│   │   │   │   └── [slug]/
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── projects/
│   │   │       ├── publications/
│   │   │       └── blog/
│   │   ├── components/       # React components
│   │   │   ├── ui/           # Shadcn-style primitives
│   │   │   ├── layout/
│   │   │   └── admin/
│   │   ├── lib/
│   │   │   ├── api.ts        # Backend API client
│   │   │   ├── supabase.ts   # Supabase client
│   │   │   └── utils.ts
│   │   └── types/            # TypeScript types
│   ├── public/
│   ├── content/              # Optional: Git-based MDX files
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
├── backend/                   # Kotlin + Ktor
│   ├── src/
│   │   └── main/
│   │       └── kotlin/
│   │           └── com/
│   │               └── portfolio/
│   │                   ├── Application.kt
│   │                   ├── config/
│   │                   │   ├── Database.kt
│   │                   │   └── Security.kt
│   │                   ├── routes/
│   │                   │   ├── AuthRoutes.kt
│   │                   │   ├── ProjectRoutes.kt
│   │                   │   ├── PublicationRoutes.kt
│   │                   │   ├── BlogPostRoutes.kt
│   │                   │   ├── UploadRoutes.kt
│   │                   │   └── SearchRoutes.kt
│   │                   ├── models/      # Data classes
│   │                   ├── services/    # Business logic
│   │                   ├── repositories/ # Database layer
│   │                   └── utils/
│   ├── resources/
│   │   └── application.conf
│   ├── build.gradle.kts
│   └── Dockerfile
├── migrations/                # SQL migrations
│   ├── 001_init_users.sql
│   ├── 002_create_projects.sql
│   ├── 003_create_publications.sql
│   ├── 004_create_blog_posts.sql
│   ├── 005_create_media_files.sql
│   └── 006_add_search_indexes.sql
├── docker-compose.yml         # Local Postgres + (optional) Ktor
├── .env.example
├── .env.local.example
├── README.md
└── ARCHITECTURE.md
```

---

## Data Flow Examples

### Public Blog Post Rendering
1. User visits `/blog/my-post-slug`
2. Next.js Server Component fetches from Ktor: `GET /blog-posts/my-post-slug`
3. Ktor queries Postgres for metadata + `content_url`
4. Next.js fetches MDX from `content_url` (Supabase Storage)
5. Next.js compiles MDX and renders page

### Admin Creating a Project
1. Admin logs in → Supabase Auth → JWT stored in cookie
2. Admin submits form in `/admin/projects/new`
3. Next.js Server Action POSTs to Ktor: `POST /projects` (with JWT)
4. Ktor validates JWT with Supabase
5. Ktor inserts into `projects` table
6. Returns created project
7. Next.js revalidates cache and redirects

### File Upload
1. Admin uploads file in admin panel
2. Next.js sends to Ktor: `POST /upload` (multipart)
3. Ktor uploads to Supabase Storage
4. Ktor inserts record into `media_files` table
5. Returns public URL
6. Frontend uses URL in project/publication form

### Search
1. User types "machine learning" in search box
2. Frontend calls `GET /search?q=machine+learning`
3. Ktor performs `ts_rank` query across all `search_vector` columns
4. Returns ranked results from projects, publications, blog posts
5. Frontend displays unified results

---

## Security Considerations

### Authentication Flow
1. User logs in via Supabase Auth (email/password or OAuth)
2. Supabase returns JWT with user metadata
3. Next.js stores JWT in HTTP-only cookie
4. All admin API calls include JWT in `Authorization` header
5. Ktor validates JWT using Supabase public key (JWKS)

### Authorization
- **Public routes**: No auth required
- **Admin routes**: Require valid JWT with role check
- **File uploads**: Validate file types, scan for malware (optional)
- **SQL Injection**: Use prepared statements (Exposed ORM)
- **XSS**: Sanitize MDX content before storage

### Rate Limiting
- Implement rate limiting on Ktor (e.g., `ktor-rate-limit` plugin)
- Vercel has built-in DDoS protection
- Supabase has connection pooling

---

## Performance Optimizations

### Frontend
- **ISR**: Incremental Static Regeneration for blog posts
- **Image Optimization**: Next.js `<Image>` component with Supabase CDN
- **Code Splitting**: Dynamic imports for admin components
- **Edge Runtime**: Use for auth middleware

### Backend
- **Connection Pooling**: HikariCP for Postgres
- **Caching**: Redis or in-memory cache for frequently accessed data
- **Pagination**: Limit queries to 20-50 items per page
- **Compression**: Gzip/Brotli responses

### Database
- **Indexes**: Already defined above
- **Materialized Views**: For complex analytics queries
- **Read Replicas**: Supabase Pro tier supports this

---

## Deployment Strategy

### Frontend (Vercel)
1. Push to `main` branch → auto-deploy
2. Preview deployments for PRs
3. Environment variables in Vercel dashboard
4. Custom domain with SSL

### Backend (Render)
1. Dockerfile builds fat JAR
2. Push to `main` → auto-deploy Docker container
3. Environment variables in Render dashboard
4. Health check endpoint: `GET /health`

### Database (Supabase)
1. Migrations run via CI/CD or Supabase CLI
2. Automated backups (Supabase handles this)
3. Connection string in backend env vars

### CI/CD
- **Tests**: Run unit tests on PR
- **Linting**: ESLint (frontend), ktlint (backend)
- **Type Checking**: `tsc --noEmit` (frontend)
- **Build**: Ensure builds succeed before merge

---

## Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- JDK 17+
- Gradle 8+
- Supabase CLI (optional)

### Steps
1. Clone repo
2. Copy `.env.example` → `.env`
3. Run `docker-compose up -d` (starts Postgres)
4. Run migrations: `psql -h localhost -U postgres -f migrations/*.sql`
5. Start backend: `cd backend && ./gradlew run`
6. Start frontend: `cd frontend && npm run dev`
7. Access at `http://localhost:3000`

---

## Monitoring & Observability

### Logs
- **Frontend**: Vercel logs + `console.error` → Sentry
- **Backend**: Ktor logs → Render logs or external service

### Metrics
- **Frontend**: Vercel Analytics (Web Vitals)
- **Backend**: Health endpoint + Render metrics
- **Database**: Supabase dashboard (query performance, connections)

### Alerts
- **Downtime**: Render alerts
- **Errors**: Sentry
- **Database**: Supabase disk usage alerts

---

## Future Enhancements

1. **Newsletter**: Integrate with Resend/SendGrid
2. **Comments**: Add Giscus (GitHub Discussions)
3. **Analytics**: Replace optional table with Plausible/Umami
4. **Multi-language**: i18n support
5. **Dark Mode**: Toggle with Tailwind
6. **RSS Feed**: Generate from blog posts
7. **Sitemap**: Auto-generate for SEO
8. **E2E Tests**: Playwright for critical flows

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | $0 (free) |
| Render | Free/Starter | $0-7 |
| Supabase | Free/Pro | $0-25 |
| Domain | Namecheap | $1-2 |
| **Total** | | **$1-34/mo** |

Scale up as needed.
