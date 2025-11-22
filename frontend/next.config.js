/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },

  // Performance optimizations
  experimental: {
    mdxRs: true,
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['@supabase/supabase-js', '@supabase/ssr'],
  },

  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Empty config to acknowledge we're using Turbopack
    // File watching is automatically optimized by Turbopack
  },

  // Reduce memory usage
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // TypeScript config for better performance
  typescript: {
    // Only run type checking in production builds, not during dev
    // This significantly reduces CPU usage during development
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
