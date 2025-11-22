import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent } from '@/components/Card'

export const dynamic = 'force-dynamic'

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    where: { published: true },
    orderBy: { year: 'desc' },
  })

  // Group publications by year
  const byYear = publications.reduce((acc: Record<number, typeof publications>, pub) => {
    if (!acc[pub.year]) acc[pub.year] = []
    acc[pub.year].push(pub)
    return acc
  }, {} as Record<number, typeof publications>)

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <main className="flex-1">
      <section className="container mx-auto px-6 py-20 border-b border-gray-200">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Research & Publications
          </h1>
          <p className="text-xl text-gray-600">
            Academic papers, research publications, and technical contributions 
            to the field of artificial intelligence and machine learning.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        {years.length > 0 ? (
          <div className="max-w-5xl space-y-16">
            {years.map((year) => (
              <div key={year}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bold">{year}</h2>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="space-y-6">
                  {byYear[year].map((pub) => (
                    <Link key={pub.id} href={`/publications/${pub.slug}`}>
                      <Card hoverable>
                        <CardContent>
                          <h3 className="text-xl font-semibold mb-3 hover:underline">
                            {pub.title}
                          </h3>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {pub.authors.join(', ')}
                          </div>
                          
                          {pub.venue && (
                            <div className="text-sm text-gray-500 italic mb-4">
                              {pub.venue}
                            </div>
                          )}

                          {pub.abstract && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {pub.abstract}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm">
                            {pub.pdfUrl && (
                              <span className="font-medium hover:underline">
                                PDF →
                              </span>
                            )}
                            {pub.doi && (
                              <span className="font-medium hover:underline">
                                DOI →
                              </span>
                            )}
                            {pub.arxivId && (
                              <span className="font-medium hover:underline">
                                arXiv →
                              </span>
                            )}
                          </div>

                          {pub.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                              {pub.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-gray-500 text-lg">No publications yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
