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

   Edit `.env.local` with your credentials:
   ```bash
   # Database
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Optional: Discord Notifications
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

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
