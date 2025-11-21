import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 60

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    where: { published: true },
    orderBy: { year: 'desc' },
  })

  // Group publications by year
  const byYear = publications.reduce((acc, pub) => {
    if (!acc[pub.year]) acc[pub.year] = []
    acc[pub.year].push(pub)
    return acc
  }, {} as Record<number, typeof publications>)

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Portfolio
          </Link>
          <div className="flex gap-6">
            <Link href="/projects" className="hover:underline">
              Projects
            </Link>
            <Link href="/publications" className="hover:underline font-semibold">
              Publications
            </Link>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Publications</h1>

        {years.map((year) => (
          <div key={year} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">{year}</h2>
            <div className="space-y-8">
              {byYear[year].map((pub) => (
                <article key={pub.id} className="border-l-4 border-blue-500 pl-6">
                  <Link
                    href={`/publications/${pub.slug}`}
                    className="text-xl font-semibold hover:text-blue-600"
                  >
                    {pub.title}
                  </Link>
                  <div className="text-gray-600 mt-2">
                    {pub.authors.join(', ')}
                  </div>
                  {pub.venue && (
                    <div className="text-gray-500 italic mt-1">{pub.venue}</div>
                  )}
                  <div className="flex gap-4 mt-3">
                    {pub.pdfUrl && (
                      <a
                        href={pub.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        PDF
                      </a>
                    )}
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        DOI
                      </a>
                    )}
                    {pub.arxivId && (
                      <a
                        href={`https://arxiv.org/abs/${pub.arxivId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        arXiv
                      </a>
                    )}
                  </div>
                  {pub.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {pub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        ))}

        {publications.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No publications yet. Check back soon!
          </div>
        )}
      </main>
    </div>
  )
}
