# Portfolio Frontend

Next.js 14 application with App Router, TypeScript, and Tailwind CSS.

## Structure

```
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── projects/
│   │   ├── publications/
│   │   ├── blog/
│   │   └── admin/              # Admin dashboard
│   ├── components/             # React components
│   ├── lib/
│   │   ├── api.ts              # Backend API client
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts            # Utility functions
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
└── content/                    # Optional: Git-based MDX files
```

## Development

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Run ESLint
npm run type-check # TypeScript check
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment

Optimized for Vercel:

1. Connect GitHub repo
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy
