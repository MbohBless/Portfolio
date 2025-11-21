import { apiClient } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function ProjectsPage() {
  const projects = await apiClient.getProjects(true)

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Portfolio
          </Link>
          <div className="flex gap-6">
            <Link href="/projects" className="hover:underline font-semibold">
              Projects
            </Link>
            <Link href="/publications" className="hover:underline">
              Publications
            </Link>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Projects</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {project.thumbnailUrl && (
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="px-2 py-1 text-sm text-gray-500">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No projects yet. Check back soon!
          </div>
        )}
      </main>
    </div>
  )
}
