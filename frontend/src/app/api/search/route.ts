import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters' },
      { status: 400 }
    )
  }

  try {
    // Search across all content using simple text matching
    // For production, consider adding full-text search with PostgreSQL or a search service
    const searchTerm = query.toLowerCase()

    const [projects, publications, blogPosts] = await Promise.all([
      prisma.project.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
        take: Math.floor(limit / 3),
      }),
      prisma.publication.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { abstract: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          abstract: true,
        },
        take: Math.floor(limit / 3),
      }),
      prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { excerpt: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
        },
        take: Math.floor(limit / 3),
      }),
    ])

    const results = [
      ...projects.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.description || '',
        type: 'project' as const,
        slug: p.slug,
      })),
      ...publications.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.abstract ? p.abstract.substring(0, 200) : '',
        type: 'publication' as const,
        slug: p.slug,
      })),
      ...blogPosts.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt || '',
        type: 'blog' as const,
        slug: p.slug,
      })),
    ]

    return NextResponse.json({
      results,
      query,
      totalResults: results.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
