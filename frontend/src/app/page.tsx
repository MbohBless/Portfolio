import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch featured content and profile
  const [featuredProjects, recentPublications, recentPosts, profile] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: { displayOrder: 'asc' },
      take: 3,
    }),
    prisma.publication.findMany({
      where: { published: true },
      orderBy: { year: 'desc' },
      take: 3,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    prisma.profile.findFirst(),
  ])

  // Default profile values if none exists
  const defaultProfile = {
    name: 'Mbou Bless Pearl N',
    title: 'AI Engineer & Software Developer',
    heroTitle: 'AI Engineer &\nSoftware Developer',
    heroSubtitle: 'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
    availableForWork: true,
    email: 'contact@example.com',
    githubUrl: 'https://github.com',
  }

  const profileData = profile || defaultProfile

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32 md:py-40">
        <div className="max-w-4xl">
          <div className="space-y-6 animate-fade-in">
            {profileData.availableForWork && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Available for opportunities</span>
              </div>
            )}
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              {profileData.heroTitle}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              {profileData.heroSubtitle}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/projects">
                <Button size="lg" variant="primary">
                  View Projects
                </Button>
              </Link>
              <Link href="/publications">
                <Button size="lg" variant="secondary">
                  Research Papers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-gray-200">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
              <p className="text-gray-600">Selected works showcasing technical expertise</p>
            </div>
            <Link href="/projects" className="text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <Card hoverable className="h-full">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Publications */}
      {recentPublications.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-gray-200">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recent Research</h2>
              <p className="text-gray-600">Latest publications and academic work</p>
            </div>
            <Link href="/publications" className="text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-6 max-w-3xl">
            {recentPublications.map((pub) => (
              <Link key={pub.id} href={`/publications/${pub.slug}`}>
                <Card hoverable>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="text-gray-400 font-bold text-lg min-w-[4rem]">
                        {pub.year}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 hover:underline">
                          {pub.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {pub.authors.join(', ')}
                        </p>
                        {pub.venue && (
                          <p className="text-sm text-gray-500 italic">{pub.venue}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-gray-200">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Writing</h2>
              <p className="text-gray-600">Thoughts on AI, engineering, and technology</p>
            </div>
            <Link href="/blog" className="text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card hoverable className="h-full">
                  <CardContent>
                    <div className="text-sm text-gray-500 mb-3">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })
                        : 'Draft'}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="text-xs text-gray-500">
                      {post.readingTime} min read
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-32 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Let's Work Together</h2>
          <p className="text-xl text-gray-600">
            Interested in collaboration or have a project in mind? Let's connect.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a href={`mailto:${profileData.email}`}>
              <Button size="lg" variant="primary">
                Get in Touch
              </Button>
            </a>
            {profileData.githubUrl && (
              <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary">
                  View GitHub
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
