import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-gray-600">Manage your portfolio projects</p>
          </div>
          <Link href="/admin/projects/new">
            <Button size="lg">+ New Project</Button>
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium ${
                            project.published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {project.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 5 && (
                          <span className="text-xs text-gray-500">
                            +{project.techStack.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/projects/${project.id}/edit`}>
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
              <p className="text-gray-500 mb-4">No projects yet</p>
              <Link href="/admin/projects/new">
                <Button>Create Your First Project</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
  )
}
