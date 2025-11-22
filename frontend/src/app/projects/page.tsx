import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/Card'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <main className="flex-1">
      <section className="container mx-auto px-6 py-20 border-b border-gray-200">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Projects
          </h1>
          <p className="text-xl text-gray-600">
            A collection of software projects, experiments, and technical work.
            Focused on AI/ML, web development, and system design.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <Card hoverable className="h-full flex flex-col">
                  {project.thumbnailUrl && (
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Image
                        src={project.thumbnailUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="flex-1 flex flex-col">
                    <h2 className="text-xl font-bold mb-3">{project.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 text-sm">
                      {project.githubUrl && (
                        <span className="text-gray-600 hover:text-black transition-colors">
                          GitHub →
                        </span>
                      )}
                      {project.demoUrl && (
                        <span className="text-gray-600 hover:text-black transition-colors">
                          Demo →
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-gray-500 text-lg">No projects published yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
