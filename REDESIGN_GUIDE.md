# Portfolio Redesign - Professional Black & White Theme

## 🎨 Design Overview

This portfolio has been completely redesigned with a **minimalist black and white theme** focused on professionalism and clarity, perfect for an AI Engineer and Software Developer. The design draws inspiration from modern portfolio sites while maintaining clean, uncluttered layouts.

### Design Principles
- ✨ **Minimalism First**: Clean layouts, generous whitespace, subtle interactions
- 🖤 **Black & White Palette**: Professional monochrome with subtle grays
- 📐 **Typography-Driven**: Bold headlines, clear hierarchy, readable body text
- 🎯 **Content-Focused**: Design enhances content without distraction
- 📱 **Responsive**: Mobile-first approach, works on all screen sizes

---

## 🏗️ Architecture

### Component Structure
```
frontend/src/
├── components/           # Reusable UI components
│   ├── Navigation.tsx   # Fixed header navigation with active states
│   ├── Footer.tsx       # Site footer with links and info
│   ├── Button.tsx       # Primary, secondary, ghost variants
│   ├── Input.tsx        # Form input with label and error states
│   └── Card.tsx         # Card container with hover effects
├── app/
│   ├── page.tsx         # Homepage with hero, featured content
│   ├── projects/        # Projects listing and detail pages
│   ├── publications/    # Research publications by year
│   ├── blog/           # Blog listing and article pages
│   └── admin/          # Admin dashboard for content management
```

---

## 🎯 Key Features

### Public Pages

#### 1. **Homepage** (`/`)
- Hero section with availability indicator
- Featured projects (top 3)
- Recent publications (latest 3)
- Latest blog posts (recent 3)
- Call-to-action section
- Dynamic content from database

#### 2. **Projects** (`/projects`)
- Grid layout of project cards
- Tech stack badges
- Hover effects with image zoom
- Links to GitHub and live demos
- Responsive 1-2-3 column grid

#### 3. **Publications** (`/publications`)
- Grouped by year with dividers
- Paper titles, authors, venues
- Links to PDF, DOI, arXiv
- Abstract previews
- Tags for categorization

#### 4. **Blog** (`/blog`)
- Card-based blog post grid
- Cover images with hover effects
- Reading time estimates
- Tag filtering
- Pagination support

### Admin Pages (Content Management)

#### 5. **Admin Dashboard** (`/admin`)
- Overview statistics (counts)
- Quick access cards to each section
- Links to create new content
- Authentication status warning

#### 6. **Projects Management** (`/admin/projects`)
- List all projects (published & drafts)
- Status indicators
- Quick edit/view buttons
- Create new project button

#### 7. **Publications Management** (`/admin/publications`)
- List all research papers
- Year and publication status
- DOI/arXiv IDs visible
- Quick access to edit

#### 8. **Blog Management** (`/admin/blog`)
- All blog posts with status
- View counts and reading times
- Published date display
- Draft/Published badges

---

## 🎨 Design System

### Colors
```css
Primary:     #000000 (Black)
Background:  #FFFFFF (White)
Gray-50:     #F9FAFB (Light backgrounds)
Gray-100:    #F3F4F6 (Subtle elements)
Gray-200:    #E5E7EB (Borders)
Gray-600:    #4B5563 (Secondary text)
Green-500:   #10B981 (Status indicator)
Yellow-50:   #FFFBEB (Warning backgrounds)
```

### Typography
```css
Headings:    -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
Body:        Same stack for consistency
Font Weight: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
Letter Spacing: -0.02em for large headings
```

### Component Variants

**Buttons:**
- `primary`: Black background, white text
- `secondary`: White background, black border
- `ghost`: Transparent with hover background

**Cards:**
- White background with gray border
- Optional hover effect (border + shadow)
- Consistent padding (24px)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### 2. Installation
```bash
# Clone and navigate
cd /workspaces/Portfolio

# Start database
docker-compose up -d postgres

# Install dependencies
cd frontend
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Initialize database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### 3. Access
- **Public Site**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Prisma Studio**: `npm run db:studio`

---

## 📊 Content Management

### Adding Content via Prisma Studio

The easiest way to add content initially:

```bash
cd frontend
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can:
- ✏️ Create projects with tech stacks
- 📄 Add publications with DOIs/arXiv
- ✍️ Write blog posts
- 👤 Manage user accounts

### Admin Interface

Navigate to `/admin` to manage content through the web interface:

1. **Projects**: Add title, description, tech stack, GitHub/demo URLs
2. **Publications**: Add authors, year, venue, DOI, arXiv ID, PDF link
3. **Blog Posts**: Write posts, add tags, set reading time, publish/draft

---

## 🔒 Authentication (To Be Implemented)

The admin pages are currently **unprotected**. To secure them:

### Step 1: Configure Supabase
```bash
# In frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 2: Create Auth Pages
```bash
# Create login page
mkdir -p frontend/src/app/admin/login
# Add authentication forms using Supabase Auth
```

### Step 3: Enable Middleware Protection
```typescript
// frontend/src/middleware.ts
// Uncomment the admin route protection
export const config = {
  matcher: ['/admin/:path*']
}
```

---

## 🎨 Customization

### Update Personal Info

**Footer Links:**
Edit `frontend/src/components/Footer.tsx`:
```typescript
<a href="https://github.com/yourusername">GitHub</a>
<a href="mailto:your@email.com">Email</a>
```

**Hero Section:**
Edit `frontend/src/app/page.tsx`:
```typescript
<h1>Your Name & Title</h1>
<p>Your bio and specialization</p>
```

### Color Scheme

To adjust the black/white theme, edit:
- `frontend/src/app/globals.css` (CSS variables)
- `frontend/tailwind.config.ts` (Tailwind colors)

### Typography

Customize fonts in `frontend/tailwind.config.ts`:
```typescript
fontFamily: {
  sans: ['Your Font', 'sans-serif'],
}
```

---

## 📱 Responsive Design

The design is fully responsive with breakpoints:
- **Mobile**: Single column, stacked navigation
- **Tablet (md: 768px)**: 2-column grids
- **Desktop (lg: 1024px)**: 3-column grids, expanded navigation

Tested on:
- iPhone SE (375px)
- iPad (768px)
- Desktop (1920px)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: App Router, Server Components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Prisma**: Type-safe database ORM

### Backend
- **PostgreSQL 15**: Relational database
- **Supabase**: Auth & Storage (optional)
- **Server Actions**: Form handling without API routes

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Homepage
│   │   ├── projects/          # Projects pages
│   │   ├── publications/      # Publications pages
│   │   ├── blog/              # Blog pages
│   │   └── admin/             # Admin dashboard
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utilities, Prisma client
│   └── types/                 # TypeScript definitions
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

---

## 🎯 Next Steps

### Recommended Priorities

1. **Add Your Content**
   - Use Prisma Studio to add projects, publications, blog posts
   - Upload images to Supabase Storage

2. **Implement Authentication**
   - Set up Supabase Auth
   - Create login page
   - Enable middleware protection

3. **Create Blog Post Editor**
   - Build rich text editor for blog posts
   - Add MDX support for code snippets
   - Implement image uploads

4. **Enhance Features**
   - Add search functionality
   - Implement tag filtering on blog
   - Add contact form
   - Set up analytics

5. **Deploy**
   - Connect to Vercel
   - Set environment variables
   - Deploy to production

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Verify Postgres is running
docker-compose ps

# Check connection string
cat frontend/.env.local | grep DATABASE_URL

# Restart database
docker-compose restart postgres
```

### Prisma Client Errors
```bash
# Regenerate Prisma Client
cd frontend
npm run db:generate

# Reset database (WARNING: deletes data)
npm run db:push -- --force-reset
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## 📝 Design Inspiration

This design was influenced by:
- **aksh-ai.com**: Clean hero sections, professional layouts
- **mitchellsparrow.com**: Minimalist aesthetic, clear typography
- **Modern Portfolio Trends**: Grid-based layouts, subtle animations

---

## 🎉 Features Implemented

✅ Professional black/white minimalist theme  
✅ Responsive navigation with active states  
✅ Hero section with availability indicator  
✅ Featured projects, publications, blog sections  
✅ Grid-based layouts for all content types  
✅ Admin dashboard for content management  
✅ Project, publication, blog management pages  
✅ Status indicators (Published/Draft)  
✅ Hover effects and transitions  
✅ Typography-driven design  
✅ Mobile-responsive layouts  
✅ Reusable component library  
✅ Server Components for performance  
✅ Database integration via Prisma  

---

## 📧 Support

For questions or issues:
1. Check existing GitHub issues
2. Review `ARCHITECTURE.md` for system design
3. Consult Next.js 14 documentation
4. Check Prisma documentation for database queries

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
