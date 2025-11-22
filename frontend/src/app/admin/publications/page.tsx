import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'

export const dynamic = 'force-dynamic'

export default async function AdminPublicationsPage() {
  const publications = await prisma.publication.findMany({
    orderBy: { year: 'desc' },
  })

  return (
    <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Publications</h1>
            <p className="text-gray-600">Manage your research publications</p>
          </div>
          <Link href="/admin/publications/new">
            <Button size="lg">+ New Publication</Button>
          </Link>
        </div>

        {publications.length > 0 ? (
          <div className="space-y-4">
            {publications.map((pub) => (
              <Card key={pub.id}>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-400">
                          {pub.year}
                        </span>
                        <h3 className="text-xl font-semibold">{pub.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium ${
                            pub.published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {pub.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {pub.authors.join(', ')}
                      </p>
                      {pub.venue && (
                        <p className="text-sm text-gray-500 italic mb-3">
                          {pub.venue}
                        </p>
                      )}
                      <div className="flex gap-3 text-sm">
                        {pub.doi && (
                          <span className="text-gray-600">DOI: {pub.doi}</span>
                        )}
                        {pub.arxivId && (
                          <span className="text-gray-600">arXiv: {pub.arxivId}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/publications/${pub.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/publications/${pub.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No publications yet</p>
              <Link href="/admin/publications/new">
                <Button>Add Your First Publication</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
  )
}
