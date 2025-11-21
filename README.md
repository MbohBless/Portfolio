# Portfolio System

Production-grade personal portfolio platform with Next.js frontend, Kotlin + Ktor backend, and PostgreSQL database.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design, API contracts, and database schema.

## Tech Stack

- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS, MDX)
- **Backend**: Kotlin + Ktor 2.3
- **Database**: PostgreSQL 15+ (Supabase)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth (JWT)
- **Deployment**: Vercel (frontend) + Render (backend)

## Project Structure

```
portfolio/
├── frontend/          # Next.js application
├── backend/           # Kotlin + Ktor API server
├── migrations/        # SQL database migrations
├── .github/workflows/ # CI/CD pipelines
└── docker-compose.yml # Local development environment
```

## Prerequisites

- Node.js 20+
- JDK 17+
- Docker & Docker Compose
- PostgreSQL client (for migrations)
- Supabase account

## Quick Start

### 1. Clone and Configure

```bash
git clone <your-repo-url>
cd portfolio

# Copy environment files
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit .env files with your Supabase credentials
```

### 2. Start Local Database

```bash
docker-compose up -d postgres
```

### 3. Run Migrations

```bash
# Using psql
for file in migrations/*.sql; do
  psql -h localhost -U postgres -d portfolio -f "$file"
done

# Or connect and run manually
psql -h localhost -U postgres -d portfolio
\i migrations/001_init_users.sql
\i migrations/002_create_projects.sql
# ... etc
```

### 4. Start Backend

```bash
cd backend
./gradlew run

# Backend runs on http://localhost:8080
# Health check: curl http://localhost:8080/health
```

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev

# Frontend runs on http://localhost:3000
```

## Development Workflow

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

### Backend Development

```bash
cd backend

# Run server
./gradlew run

# Run tests
./gradlew test

# Build fat JAR
./gradlew buildFatJar

# Build Docker image
docker build -t portfolio-backend .
```

### Database Migrations

Always create new migrations sequentially:

```bash
# Create new migration
touch migrations/007_add_new_feature.sql

# Run migration
psql -h localhost -U postgres -d portfolio -f migrations/007_add_new_feature.sql
```

## API Endpoints

### Public Endpoints

```
GET  /health                    # Health check
GET  /projects                  # List projects
GET  /projects/:slug            # Get project
GET  /publications              # List publications
GET  /publications/:slug        # Get publication
GET  /blog-posts                # List blog posts (paginated)
GET  /blog-posts/:slug          # Get blog post
GET  /search?q=keyword          # Search all content
```

### Admin Endpoints (Require JWT)

```
POST   /auth/login              # Login
POST   /projects                # Create project
PUT    /projects/:id            # Update project
DELETE /projects/:id            # Delete project
POST   /publications            # Create publication
PUT    /publications/:id        # Update publication
DELETE /publications/:id        # Delete publication
POST   /blog-posts              # Create blog post
PUT    /blog-posts/:id          # Update blog post
DELETE /blog-posts/:id          # Delete blog post
POST   /upload                  # Upload file
DELETE /upload/:fileId          # Delete file
```

## Deployment

### Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically on push to `main`

### Backend (Render)

1. Create new Web Service in Render
2. Connect GitHub repo
3. Docker build detected automatically
4. Set environment variables:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_JWT_SECRET`
5. Deploy automatically on push to `main`

### Database (Supabase)

1. Create Supabase project
2. Run migrations via Supabase SQL Editor or psql
3. Enable Storage and create `portfolio-files` bucket
4. Configure Auth providers (Email, OAuth, etc.)

## Environment Variables

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env)

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/portfolio
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_STORAGE_BUCKET=portfolio-files
PORT=8080
```

## Common Tasks

### Adding a Project (via API)

```bash
curl -X POST http://localhost:8080/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My Project",
    "slug": "my-project",
    "description": "A cool project",
    "techStack": ["TypeScript", "React"],
    "githubUrl": "https://github.com/user/repo",
    "published": true
  }'
```

### Creating a Blog Post

1. Write MDX content
2. Upload to Supabase Storage
3. Create blog post entry with `contentUrl` pointing to uploaded file

### Running Search

```bash
curl "http://localhost:8080/search?q=machine+learning"
```

## Testing

### Backend Tests

```bash
cd backend
./gradlew test
```

### Frontend Tests

```bash
cd frontend
npm test  # Add test scripts as needed
```

## Troubleshooting

### Database Connection Failed

- Ensure Postgres is running: `docker-compose ps`
- Check connection string in `.env`
- Verify migrations ran: `psql -h localhost -U postgres -d portfolio -c "\dt"`

### JWT Authentication Failed

- Verify `SUPABASE_JWT_SECRET` matches Supabase dashboard
- Check token expiration
- Ensure Authorization header format: `Bearer <token>`

### File Upload Not Working

- Verify Supabase Storage bucket exists: `portfolio-files`
- Check bucket permissions (public vs authenticated)
- Verify `SUPABASE_KEY` has storage permissions

## Contributing

1. Create feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request

## License

MIT
