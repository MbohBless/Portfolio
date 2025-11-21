import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: `${project.title} - Projects`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <Link href="/projects" className="text-blue-600 hover:underline">
            ← Back to Projects
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl font-bold mb-4">{project.title}</h1>

        {project.description && (
          <p className="text-xl text-gray-600 mb-8">{project.description}</p>
        )}

        <div className="flex gap-4 mb-8">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              View on GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Live Demo
            </a>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech: string) => (
              <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {project.images.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Screenshots</h2>
            <div className="grid gap-4">
              {project.images.map((image: string, i: number) => (
                <div key={i} className="relative w-full h-96">
                  <Image
                    src={image}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    className="object-contain rounded-lg border"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
