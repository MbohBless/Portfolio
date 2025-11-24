# AI/ML Portfolio Platform

A modern, production-ready personal portfolio system built for AI engineers, researchers, and software developers. Features a powerful admin panel, markdown blog, publication management, and real-time Discord notifications.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

- **Dynamic Content Management** - Projects, blog posts, publications, work experience, education, and skills
- **Markdown Support** - Write blog posts and project descriptions in markdown with syntax highlighting
- **Admin Dashboard** - Secure admin panel with authentication and content management
- **Production-Grade Security** - Rate limiting, input validation, CORS, security headers, and XSS protection
- **Theme System** - Light, dark, and system theme modes with smooth transitions
- **Discord Notifications** - Real-time contact form notifications via Discord webhooks
- **Background Animations** - Page-specific canvas animations (network graphs, matrix effects, code rain)
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **SEO Optimized** - Dynamic sitemap, robots.txt, llms.txt, meta tags, Open Graph, and semantic HTML
- **Type-Safe** - Full TypeScript coverage with Prisma-generated types
- **Zero-Cost Hosting** - Deploy for free on Vercel

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | Tailwind CSS |
| **Database** | PostgreSQL 15+ |
| **ORM** | Prisma 5 |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Deployment** | Vercel |
| **Validation** | Zod |

## Security & API Protection

This portfolio includes production-grade security measures to protect against common web vulnerabilities:

### Built-in Security Features

- **Rate Limiting**
  - Contact form: 5 submissions per hour per IP
  - Profile updates: 20 updates per hour
  - Automatic IP detection (supports Cloudflare, reverse proxies)
  - Standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

- **Input Validation (Zod)**
  - Type-safe validation for all API endpoints
  - Contact form: Name (2-100 chars), valid email, message (10-5000 chars)
  - Profile data: Email format, URL validation, field length limits
  - Detailed validation error messages

- **URL Sanitization**
  - Prevents XSS attacks via malicious URLs
  - Only allows `http://` and `https://` protocols
  - Validates all social links and external URLs

- **Security Headers**
  - `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
  - `X-Frame-Options: DENY` - Prevents clickjacking
  - `X-XSS-Protection: 1; mode=block` - XSS protection
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` - Restricts browser features

- **CORS Configuration**
  - Configurable allowed origins
  - Preflight request handling (OPTIONS)
  - Proper credential handling

- **Authentication & Authorization**
  - Supabase JWT tokens
  - Protected admin routes via middleware
  - Session management
  - Single admin account enforcement

- **Error Handling**
  - Sanitized error messages in production
  - Detailed errors in development
  - Prevents information leakage
  - Standardized error format with timestamps

### Protected Endpoints

#### `/api/contact` (Public)
- Rate limiting: 5 submissions/hour per IP
- Validates name, email, message
- Discord webhook integration
- Returns: 201 Created or 429 Too Many Requests

#### `/api/profile` (GET: Public, PUT: Protected)
- GET: Returns profile data
- PUT: Requires authentication
- Rate limiting: 20 updates/hour
- Validates all profile fields
- URL sanitization for links

### What This Protects Against

✅ **SQL Injection** - Prisma ORM with parameterized queries
✅ **XSS Attacks** - URL sanitization + security headers
✅ **CSRF** - CORS configuration + SameSite cookies
✅ **DoS/Spam** - Rate limiting on all endpoints
✅ **Injection Attacks** - Zod validation with strict schemas
✅ **Malicious URLs** - Protocol validation (http/https only)
✅ **Information Leakage** - Error sanitization in production
✅ **Invalid Data** - Type-safe validation with detailed errors

### Security Files

- `src/lib/validations.ts` - Zod schemas for input validation
- `src/lib/rate-limit.ts` - In-memory rate limiter
- `src/lib/api-utils.ts` - Security headers, CORS, error handling
- `src/proxy.ts` - Authentication middleware

### Rate Limit Response Example

```json
HTTP 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-11-23T13:00:00.000Z
Retry-After: 3600

{
  "error": "Rate limit exceeded. Please try again in 60 minutes.",
  "timestamp": "2025-11-23T12:00:00.000Z"
}
```

### Validation Error Example

```json
HTTP 400 Bad Request

{
  "error": "email: Invalid email address",
  "timestamp": "2025-11-23T12:00:00.000Z"
}
```

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL (or Supabase account)
- Discord server (optional, for notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your credentials (see [Environment Variables](#environment-variables) section below for details)

4. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Seed sample data** (Optional but recommended)

   Populate the database with sample content to see how the portfolio looks:
   ```bash
   npm run db:seed
   ```

   This creates:
   - Sample profile with contact info
   - 3 project showcases
   - 2 blog posts
   - 2 research publications
   - Work experience and education
   - Skills with proficiency levels

   **Note**: You can customize or delete this sample data later through the admin panel.

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Create your admin account**
   - Navigate to `http://localhost:3000/admin/signup`
   - Create your account (only one admin allowed)
   - Verify email via Supabase
   - Login at `/admin/login`

8. **Explore your portfolio**
   - View sample content at `http://localhost:3000`
   - Edit/delete sample data via admin panel
   - Replace with your actual content

## Environment Variables

All environment variables needed to run this portfolio system:

### Required Variables

```bash
# Database Connection
DATABASE_URL="postgresql://user:password@host:5432/database"
# For local development: postgresql://postgres:postgres@localhost:5432/portfolio
# For production (Supabase): Use connection pooling URL for serverless environments
# Format: postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Supabase Authentication (Required)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
# Get from: Supabase Dashboard → Settings → API → Project URL

NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
# Get from: Supabase Dashboard → Settings → API → Project API keys → anon public

SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
# Get from: Supabase Dashboard → Settings → API → Project API keys → service_role (Keep secret!)

# Supabase Storage (Required for file uploads)
SUPABASE_STORAGE_BUCKET="documents_bucket"
# Create bucket in: Supabase Dashboard → Storage → New bucket
```

### Optional Variables

```bash
# Discord Webhook Notifications (Optional but recommended)
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN"
# Get from: Discord Server → Settings → Integrations → Webhooks → New Webhook
# Sends real-time notifications when users submit the contact form

# Site URL (Required for SEO)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
# For local dev: http://localhost:3000
# For production: Your actual domain (used in sitemap.xml and robots.txt)
```

### Alternative: Appwrite Backend (Instead of Supabase)

If using Appwrite instead of Supabase for authentication and storage:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
# For Appwrite Cloud: https://cloud.appwrite.io/v1
# For Self-hosted: https://your-appwrite-domain.com/v1

NEXT_PUBLIC_APPWRITE_PROJECT_ID="your-project-id"
# Get from: Appwrite Console → Project Settings → Project ID

APPWRITE_API_KEY="your-api-key"
# Get from: Appwrite Console → Project Settings → API Keys → Create API Key
# Scopes needed: sessions.write, users.read, storage.write

# Database (Still use PostgreSQL with Appwrite)
DATABASE_URL="postgresql://user:password@host:5432/database"
# Appwrite's database uses NoSQL collections - keep PostgreSQL for relational data

# Optional
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

**Note**: When using Appwrite, you'll need to modify the authentication logic in `src/lib/auth-client.ts`, `src/proxy.ts`, and storage logic. See the [Appwrite Integration](#appwrite-integration) section for detailed migration steps.

### Environment Variable Purposes

| Variable | Purpose | Visibility | Required |
|----------|---------|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Server-only | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client & Server | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public API key | Client & Server | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (bypass RLS) | Server-only | ✅ Yes |
| `SUPABASE_STORAGE_BUCKET` | File storage bucket name | Server-only | ✅ Yes |
| `DISCORD_WEBHOOK_URL` | Discord notifications endpoint | Server-only | ⚠️ Optional |
| `NEXT_PUBLIC_SITE_URL` | Your domain for SEO | Client & Server | ⚠️ Optional |

### Setting Up Variables

#### Local Development

Create `.env.local` in the `frontend/` directory:

```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your values
```

#### Production (Vercel, Railway, etc.)

Add environment variables through your platform's dashboard:
- **Vercel**: Settings → Environment Variables
- **Railway**: Variables tab
- **Render**: Environment → Environment Variables
- **AWS/Docker**: Use secrets management or `.env` file

### Getting Supabase Credentials

1. **Create a Supabase project**: https://supabase.com/dashboard
2. **Get your credentials**:
   - Go to Settings → API
   - Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy service_role key → `SUPABASE_SERVICE_ROLE_KEY`

3. **Set up Database**:
   - Supabase automatically provides PostgreSQL
   - Get connection string from Settings → Database
   - **For serverless (Vercel/Railway)**: Use "Connection Pooling" URL (port 6543)
   - **For local/VPS**: Use "Direct Connection" URL (port 5432)

4. **Create Storage Bucket**:
   - Go to Storage → New Bucket
   - Name: `documents_bucket`
   - Set to Public or Private based on your needs
   - Copy bucket name → `SUPABASE_STORAGE_BUCKET`

### Security Notes

⚠️ **Never commit these files**:
- `.env`
- `.env.local`
- `.env.production`

✅ **Safe to commit**:
- `.env.example` (template without actual values)
- `.env.local.example` (template without actual values)

🔒 **Keep secret** (server-only):
- `SUPABASE_SERVICE_ROLE_KEY` - Bypasses Row Level Security
- `DATABASE_URL` - Contains database password
- `DISCORD_WEBHOOK_URL` - Can be used to spam your Discord

✅ **Safe to expose** (public):
- `NEXT_PUBLIC_SUPABASE_URL` - Public project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Limited by RLS policies
- `NEXT_PUBLIC_SITE_URL` - Your public domain

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (pages)/           # Public pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── projects/      # Projects showcase
│   │   │   ├── blog/          # Blog posts
│   │   │   └── publications/  # Research papers
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── profile/       # Profile settings
│   │   │   ├── projects/      # Manage projects
│   │   │   ├── blog/          # Manage blog posts
│   │   │   ├── publications/  # Manage publications
│   │   │   └── contacts/      # View submissions
│   │   ├── api/               # API routes
│   │   │   ├── contact/       # Contact form + Discord
│   │   │   └── profile/       # Profile data
│   │   └── actions/           # Server actions
│   ├── components/            # React components
│   │   ├── animations/        # Canvas animations
│   │   ├── Button.tsx         # UI components
│   │   └── ...
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth-client.ts     # Auth helpers
│   │   ├── validations.ts     # Zod validation schemas
│   │   ├── rate-limit.ts      # Rate limiting middleware
│   │   └── api-utils.ts       # Security & API utilities
│   └── proxy.ts               # Auth middleware
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
└── package.json
```

## Usage Guide

### Managing Your Profile

1. Navigate to `/admin/profile`
2. Configure:
   - Personal information (name, title, bio)
   - Contact details (email, phone, location)
   - Social links (GitHub, LinkedIn, Twitter)
   - Profile image and resume URLs
   - Hero section text
   - Availability status

### Adding Projects

1. Go to `/admin/projects` → **New Project**
2. Fill in project details:
   - Title and description
   - Markdown content with code examples
   - Tech stack (comma-separated)
   - Links (GitHub, demo, docs)
   - Display order
3. Toggle **Published** to make it visible

**Note**: First 3 published projects appear on homepage

### Writing Blog Posts

1. Go to `/admin/blog` → **New Post**
2. Write in markdown:
   - Supports code blocks with syntax highlighting
   - Images via markdown syntax
   - Custom components (if configured)
3. Set excerpt, tags, and reading time
4. Choose publication date
5. Toggle **Published** when ready

**Note**: 3 most recent posts appear on homepage

### Adding Publications

1. Go to `/admin/publications`
2. Add research papers with:
   - Title, authors, venue, year
   - Abstract
   - PDF URL, DOI, arXiv ID
   - Tags for categorization

**Note**: Cards link to external resources (PDF/DOI/arXiv)

### Contact Form Notifications

Get instant Discord notifications when someone contacts you:

1. **Create Discord Webhook**:
   - Server Settings → Integrations → Webhooks
   - Create new webhook
   - Copy webhook URL

2. **Add to environment**:
   ```bash
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ```

3. **Restart server** to apply changes

You'll receive formatted Discord messages with:
- Sender name and email
- Message content
- Direct link to admin panel
- Timestamp and contact ID

### Viewing Contact Submissions

Navigate to `/admin/contacts` to:
- View all messages
- Filter by read/unread status
- Mark as read/unread
- Delete old submissions
- Click email to reply directly

## Customization

### Theme Settings

Change default theme in `src/app/layout.tsx`:

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="light"  // Options: "light", "dark", "system"
  enableSystem
>
```

### Background Animations

Page-specific animations in `src/components/animations/`:

- **MatrixAnimation** - Publications page (floating matrices)
- **CodeAnimation** - Blog pages (code snippets + binary rain)
- **NetworkAnimation** - Projects page (network graph)
- **HeroBackground** - Homepage (gradient effects)

Customize by editing animation files or remove component from page.

### Color Scheme

Modify `tailwind.config.ts` to change:
- Primary/secondary colors
- Dark mode variants
- Typography styles
- Spacing/sizing

### Adding New Sections

1. **Update database schema**:
   ```bash
   # Edit prisma/schema.prisma
   npm run db:push
   npm run db:generate
   ```

2. **Create admin UI**: Add page in `src/app/admin/`
3. **Create public view**: Add page in `src/app/`
4. **Add server actions**: Create mutations in `src/app/actions/`

### SEO Configuration

The portfolio includes comprehensive SEO features out of the box:

#### Dynamic Sitemap (`/sitemap.xml`)

Automatically generated sitemap that includes:
- All published blog posts
- All published projects
- Main section pages (blog, projects, publications)
- Proper priority and change frequency settings
- Last modified dates for each page

The sitemap is generated from `src/app/sitemap.ts` and automatically updates when you publish new content.

#### Robots.txt (`/robots.txt`)

Controls search engine and AI crawler access:
- **Allows**: Public pages (blog, projects, publications)
- **Blocks**: Admin dashboard, API endpoints, auth routes
- **Supports**: Google, Bing, ChatGPT, Claude, Perplexity, etc.
- **Features**: Crawl delays to protect server resources

Located at: `public/robots.txt`

#### LLMs.txt (`/llms.txt`)

Helps AI systems understand your portfolio:
- Your professional information and expertise
- Site structure and content descriptions
- Usage guidelines for AI training
- Attribution requirements
- Technical stack information

Located at: `public/llms.txt`

**Important**: Update both files with your actual domain and information:
1. Edit `public/robots.txt` - Replace `yourdomain.com` with your actual domain
2. Edit `public/llms.txt` - Update personal information and URLs
3. Set `NEXT_PUBLIC_SITE_URL` in `.env` for the sitemap

#### SEO Best Practices

- **Meta Tags**: Each page has proper title, description, and Open Graph tags
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Image Optimization**: Next.js Image component with lazy loading
- **Performance**: Server-side rendering, static generation where possible
- **Mobile-First**: Responsive design for better mobile rankings
- **Structured Data**: Consider adding JSON-LD for rich snippets

#### Verify SEO Setup

After deployment:
1. Check sitemap: `https://yourdomain.com/sitemap.xml`
2. Check robots.txt: `https://yourdomain.com/robots.txt`
3. Check llms.txt: `https://yourdomain.com/llms.txt`
4. Submit sitemap to Google Search Console
5. Verify with Bing Webmaster Tools
6. Test with: [Google Rich Results Test](https://search.google.com/test/rich-results)

## Deployment

### Vercel (Recommended)

1. **Import project to Vercel**
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Framework preset: Next.js

2. **Configure environment variables**

   Add all variables from `.env.local`:
   ```
   DATABASE_URL
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   DISCORD_WEBHOOK_URL (optional)
   NEXT_PUBLIC_SITE_URL
   ```

3. **Set up database**
   - Use Supabase PostgreSQL (recommended)
   - After first deploy, run migrations:
     ```bash
     npm run db:push
     ```

4. **Configure Supabase Storage**
   - Create bucket: `portfolio-files`
   - Set appropriate access policies

5. **Deploy**
   - Push to `main` branch
   - Vercel auto-deploys on commits

### Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records with your registrar
3. SSL certificate auto-provisioned
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

### Alternative Deployment Options

While Vercel is recommended for its seamless Next.js integration, this portfolio can be deployed to other platforms:

#### Railway (Recommended Alternative)

Railway provides excellent PostgreSQL and Next.js support with automatic deployments:

1. **Create Railway Project**
   - Connect your GitHub repository
   - Railway auto-detects Next.js

2. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway provides `DATABASE_URL` automatically

3. **Configure Environment Variables**
   ```bash
   # Railway provides DATABASE_URL automatically
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_STORAGE_BUCKET=documents_bucket
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   NEXT_PUBLIC_SITE_URL=https://your-app.railway.app
   ```

4. **Set Root Directory**
   - Settings → Set `Root Directory` to `frontend`

5. **Deploy**
   - Railway auto-builds and deploys on every commit
   - Get your app URL from the deployment
   - Run migrations: Railway CLI or connect via Prisma Studio

**Note**: Railway requires **connection pooling** for PostgreSQL. If using external database (Supabase), use the pooling URL with port 6543.

#### Render

1. **Create New Web Service**
   - Connect repository
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Add PostgreSQL Database** (optional)
   - Create PostgreSQL database in Render
   - Or use external database (Supabase)

3. **Set Environment Variables** (same as above)

4. **Deploy** - Render auto-deploys from your branch

#### Docker / Self-Hosted

For VPS, AWS EC2, DigitalOcean, etc.:

1. **Create `Dockerfile` in `frontend/` directory**:
   ```dockerfile
   FROM node:20-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   WORKDIR /app

   COPY package*.json ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .

   # Generate Prisma Client
   RUN npx prisma generate

   # Build Next.js
   ENV NEXT_TELEMETRY_DISABLED 1
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV production
   ENV NEXT_TELEMETRY_DISABLED 1

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000

   ENV PORT 3000
   ENV HOSTNAME "0.0.0.0"

   CMD ["node", "server.js"]
   ```

2. **Update `next.config.js`**:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'standalone',
     // ... rest of config
   }

   module.exports = nextConfig
   ```

3. **Build and Run**:
   ```bash
   # Build image
   docker build -t portfolio-app .

   # Run container
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://..." \
     -e NEXT_PUBLIC_SUPABASE_URL="https://..." \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY="..." \
     -e SUPABASE_SERVICE_ROLE_KEY="..." \
     -e SUPABASE_STORAGE_BUCKET="documents_bucket" \
     -e NEXT_PUBLIC_SITE_URL="https://yourdomain.com" \
     portfolio-app
   ```

4. **Or use Docker Compose**:
   ```yaml
   # docker-compose.yml
   version: '3.8'

   services:
     app:
       build:
         context: ./frontend
         dockerfile: Dockerfile
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
         - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
         - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
         - SUPABASE_STORAGE_BUCKET=${SUPABASE_STORAGE_BUCKET}
         - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
       depends_on:
         - db

     db:
       image: postgres:15-alpine
       environment:
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=postgres
         - POSTGRES_DB=portfolio
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"

   volumes:
     postgres_data:
   ```

   Run with: `docker-compose up -d`

#### Appwrite Integration

**Note**: This portfolio currently uses Supabase for authentication and storage. If you want to use Appwrite instead, you'll need to modify the authentication and storage logic. Here's how:

##### Option 1: Appwrite Cloud (Backend Only)

Appwrite Cloud provides authentication and storage but doesn't host Next.js apps. You can:
1. Use Appwrite for auth/storage
2. Host Next.js on Vercel/Railway/Render
3. Keep PostgreSQL for your database (Appwrite's database uses collections, not relational tables)

**Required Changes**:

1. **Install Appwrite SDK**:
   ```bash
   npm install appwrite
   ```

2. **Replace Supabase Client** (`src/lib/appwrite.ts`):
   ```typescript
   import { Client, Account, Storage } from 'appwrite';

   const client = new Client()
     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // 'https://cloud.appwrite.io/v1'
     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

   export const account = new Account(client);
   export const storage = new Storage(client);
   ```

3. **Environment Variables**:
   ```bash
   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   APPWRITE_API_KEY=your-api-key

   # Keep PostgreSQL for database
   DATABASE_URL=postgresql://user:password@host:5432/database

   # Optional
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

4. **Update Authentication** (`src/lib/auth-client.ts` and `src/proxy.ts`):
   - Replace Supabase auth calls with Appwrite's `account.createSession()`
   - Update middleware to verify Appwrite sessions
   - Modify login/signup pages to use Appwrite SDK

5. **Update File Storage**:
   - Replace Supabase Storage with Appwrite Storage
   - Update upload endpoints to use `storage.createFile()`

**Deployment with Appwrite**:
- **Frontend**: Deploy to Vercel/Railway/Render (see deployment options above)
- **Auth & Storage**: Managed by Appwrite Cloud
- **Database**: Keep PostgreSQL on Supabase or Railway

##### Option 2: Self-Hosted Appwrite

For full control, self-host Appwrite on your own infrastructure:

1. **Install Appwrite** (requires Docker):
   ```bash
   docker run -it --rm \
     --volume /var/run/docker.sock:/var/run/docker.sock \
     --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
     --entrypoint="install" \
     appwrite/appwrite:1.5.7
   ```

2. **Configure Appwrite**:
   - Access Appwrite Console at `http://localhost:80`
   - Create project and get credentials
   - Set up authentication providers (Email/Password)
   - Create storage buckets
   - Configure OAuth providers if needed

3. **Deploy Appwrite**:
   - **VPS/Cloud**: Run on AWS EC2, DigitalOcean Droplet, etc.
   - **Docker Compose**: Manages all Appwrite services
   - **Requires**: Docker, Docker Compose, 2GB+ RAM

4. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-domain.com/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   APPWRITE_API_KEY=your-api-key
   ```

##### Appwrite vs. Supabase Comparison

| Feature | Supabase (Current) | Appwrite Alternative |
|---------|-------------------|---------------------|
| **Auth** | Built-in JWT | Email, OAuth, Magic Links |
| **Storage** | S3-compatible | Built-in file storage |
| **Database** | PostgreSQL (relational) | Collections (NoSQL) or keep PostgreSQL |
| **Realtime** | PostgreSQL subscriptions | WebSocket subscriptions |
| **Functions** | Edge Functions | Cloud Functions |
| **Hosting** | None (use Vercel) | None (use Vercel/Railway) |
| **Free Tier** | 500MB DB, 1GB storage | 75K users, 2GB storage |
| **Open Source** | Yes | Yes |

##### Migration Effort

**Low effort** (Keep PostgreSQL, use Appwrite for auth only):
- ✅ 2-3 hours for auth migration
- ✅ Keep all database logic unchanged
- ✅ Keep Prisma ORM
- ⚠️ Need to update auth middleware and login pages

**High effort** (Full migration to Appwrite):
- ❌ Rewrite all database logic (Prisma → Appwrite SDK)
- ❌ Convert relational schema to collections
- ❌ Rewrite queries and relationships
- ❌ 2-3 days of development
- ⚠️ Not recommended for this project

**Recommended**: Use Appwrite for auth/storage + keep PostgreSQL for data.

#### AWS / Azure / Google Cloud

For enterprise deployments:

1. **AWS Elastic Beanstalk** or **ECS**:
   - Use Docker deployment (see above)
   - Connect to RDS PostgreSQL
   - Set environment variables in console
   - Configure load balancer for HTTPS

2. **Azure App Service**:
   - Deploy from GitHub
   - Use Azure Database for PostgreSQL
   - Configure app settings for env vars

3. **Google Cloud Run**:
   - Build container image
   - Push to Google Container Registry
   - Deploy with Cloud SQL PostgreSQL
   - Set environment variables

### Database Considerations for Different Platforms

| Platform | Database Option | Connection Type | Notes |
|----------|----------------|-----------------|-------|
| **Vercel** | Supabase/Neon/Planetscale | Connection Pooling (6543) | Serverless requires pooling |
| **Railway** | Railway PostgreSQL | Direct or Pooling | Both work, pooling recommended |
| **Render** | Render PostgreSQL | Direct Connection (5432) | Not serverless, direct works |
| **Docker/VPS** | Self-hosted or Supabase | Direct Connection (5432) | Long-running process, direct connection |
| **AWS Lambda** | RDS/Aurora | Connection Pooling | Serverless, use RDS Proxy |

### When to Use Connection Pooling vs Direct Connection

**Use Connection Pooling (port 6543)** when:
- ✅ Deploying to serverless platforms (Vercel, AWS Lambda)
- ✅ Application creates many short-lived connections
- ✅ Need to limit database connections

**Use Direct Connection (port 5432)** when:
- ✅ Running on traditional servers (VPS, Docker)
- ✅ Long-running Node.js process
- ✅ Need better performance (pooling adds latency)

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Push schema changes (no migration)
npm run db:migrate       # Create migration files
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Populate database with sample data

# Build
npm run build            # Production build
npm start                # Start production server

# Code Quality
npm run type-check       # TypeScript validation
npm run lint             # ESLint
```

### Database Operations

**Development workflow** (faster, no migration files):
```bash
# Make schema changes
npm run db:push
npm run db:generate
```

**Production workflow** (creates migration history):
```bash
# Make schema changes
npm run db:migrate
npm run db:generate
```

### Architecture Pattern

This portfolio uses modern Next.js patterns:

- **Server Components**: Direct database access, no API calls
- **Server Actions**: Form mutations without REST endpoints
- **Client Components**: Interactive UI (theme toggle, forms)
- **API Routes**: External access only (contact form, webhooks)

Example Server Component:
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

## Best Practices

### Content

- **SEO-friendly slugs**: Keep short, descriptive
- **Image optimization**: Compress before upload
- **Good excerpts**: Shown in cards and search results
- **Consistent tags**: Use standard naming conventions
- **Display order**: Control featured content on homepage

### Performance

- Uses Incremental Static Regeneration (ISR)
- Image optimization with Next.js Image
- Edge runtime for auth middleware
- Automatic code splitting

### Security

See the [Security & API Protection](#security--api-protection) section above for comprehensive security documentation.

Key security practices:
- Rate limiting on all public endpoints (prevents DoS/spam)
- Input validation with Zod schemas
- URL sanitization (prevents XSS)
- Security headers on all responses
- Single admin account enforcement
- Environment variables never committed
- Service role key kept server-side only
- Authentication on all admin routes
- Error sanitization in production

### Backup

- **Database**: Supabase provides automatic backups
- **Content**: Export via Prisma Studio regularly
- **Files**: Download from Supabase Storage
- **Config**: Keep `.env.local.example` updated

## Troubleshooting

### Styles not updating
```bash
rm -rf .next
npm run dev
```

### Database out of sync
```bash
npm run db:push
npm run db:generate
```

### Authentication issues
- Verify Supabase credentials in `.env.local`
- Check email confirmation in Supabase dashboard
- Clear browser cookies
- Review `src/proxy.ts` middleware configuration

### Build failures
```bash
npm run type-check  # Check TypeScript errors
# Review Vercel build logs for specific errors
```

### Discord notifications not working
- Verify `DISCORD_WEBHOOK_URL` is set correctly
- Check webhook channel permissions
- Test webhook manually with curl
- Review server logs for error messages

## Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| **Vercel** | Hobby | $0 |
| **Supabase** | Free/Pro | $0-25 |
| **Domain** | Various | $1-2 |
| **Total** | | **$1-27/mo** |

Free tier includes:
- Unlimited deployments
- SSL certificates
- CDN
- 500MB Postgres storage
- 1GB file storage
- Email auth

## Support

- **Documentation**: See detailed guides above
- **Issues**: Open GitHub issue for bugs
- **Architecture**: See `ARCHITECTURE.md` for system design

## License

MIT License - feel free to use for your own portfolio

---

Built with ❤️ using Next.js, TypeScript, and Prisma
