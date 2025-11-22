import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent } from '@/components/Card'
import { MatrixAnimation } from '@/components/animations/MatrixAnimation'

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
    <main className="flex-1 relative">
      <MatrixAnimation />
      <section className="container mx-auto px-6 py-20 border-b border-gray-200 dark:border-gray-800 relative z-10">
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

      <section className="container mx-auto px-6 py-20 relative z-10">
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
                    <Card key={pub.id}>
                      <CardContent>
                        <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                          {pub.title}
                        </h3>

                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {pub.authors.join(', ')}
                        </div>

                        {pub.venue && (
                          <div className="text-sm text-gray-500 dark:text-gray-500 italic mb-4">
                            {pub.venue}
                          </div>
                        )}

                        {pub.abstract && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {pub.abstract}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm">
                          {pub.pdfUrl && (
                            <a
                              href={pub.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              PDF →
                            </a>
                          )}
                          {pub.doi && (
                            <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              DOI →
                            </a>
                          )}
                          {pub.arxivId && (
                            <a
                              href={`https://arxiv.org/abs/${pub.arxivId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              arXiv →
                            </a>
                          )}
                        </div>

                        {pub.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            {pub.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
