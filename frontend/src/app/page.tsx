import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { ContactForm } from '@/components/ContactForm'
import { HeroBackground } from '@/components/HeroBackground'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch featured content, profile, work experience, education, and skills
  const [featuredProjects, recentPublications, recentPosts, profile, workExperiences, education, skills] = await Promise.all([
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
    prisma.workExperience.findMany({
      where: { published: true },
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' },
      ],
    }),
    prisma.education.findMany({
      where: { published: true },
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' },
      ],
    }),
    prisma.skill.findMany({
      where: { published: true },
      orderBy: [
        { category: 'asc' },
        { displayOrder: 'asc' },
      ],
    }),
  ])

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  // Default profile values if none exists
  const defaultProfile = {
    name: 'Mbou Bless Pearl N',
    title: 'AI Engineer & Software Developer',
    bio: 'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
    heroTitle: 'AI Engineer & Software Developer',
    heroSubtitle: 'Building intelligent systems and scalable software solutions.',
    availableForWork: true,
    email: 'contact@example.com',
    phone: null,
    location: null,
    profileImageUrl: null,
    resumeUrl: null,
    githubUrl: 'https://github.com',
    linkedinUrl: null,
    twitterUrl: null,
    websiteUrl: null,
  }

  const profileData = profile || defaultProfile

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-32 md:py-40">
        <HeroBackground />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between animate-fade-in">
            {/* Profile Information */}
            <div className="flex-1 space-y-6 order-2 md:order-1">
              {profileData.availableForWork && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Available for opportunities</span>
                </div>
              )}

              <div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-2">
                  {profileData.name}
                </h1>
                <p className="text-2xl md:text-3xl text-gray-600 font-medium">
                  {profileData.title}
                </p>
              </div>

              {profileData.bio && (
                <p className="text-lg text-gray-600 leading-relaxed">
                  {profileData.bio}
                </p>
              )}

              {/* Location and Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {profileData.location && (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{profileData.location}</span>
                  </div>
                )}
                {profileData.email && (
                  <div className="flex items-center gap-2">
                    <span>✉️</span>
                    <a href={`mailto:${profileData.email}`} className="hover:text-black hover:underline">
                      {profileData.email}
                    </a>
                  </div>
                )}
                {profileData.phone && (
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {profileData.githubUrl && (
                  <a
                    href={profileData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    GitHub
                  </a>
                )}
                {profileData.linkedinUrl && (
                  <a
                    href={profileData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    LinkedIn
                  </a>
                )}
                {profileData.twitterUrl && (
                  <a
                    href={profileData.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Twitter
                  </a>
                )}
                {profileData.websiteUrl && (
                  <a
                    href={profileData.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Website
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
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
                {profileData.resumeUrl && (
                  <a
                    href={profileData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button size="lg" variant="ghost">
                      📄 Download Resume
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Profile Picture - Large Circle on Right */}
            <div className="flex-shrink-0 order-1 md:order-2">
              <img
                src={profileData.profileImageUrl || '/images/profile.png'}
                alt={profileData.name}
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-gray-200">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Work Experience</h2>
            <p className="text-gray-600">Professional journey and career highlights</p>
          </div>

          <div className="max-w-4xl space-y-8">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="relative pl-8 border-l-2 border-gray-200">
                {/* Timeline dot */}
                <div className="absolute left-0 top-0 w-4 h-4 -ml-[9px] rounded-full bg-black border-4 border-white shadow" />

                <div className="pb-8">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-gray-600">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-black hover:underline"
                          >
                            {exp.company}
                          </a>
                        ) : (
                          <span className="font-medium">{exp.company}</span>
                        )}
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span>{exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {new Date(exp.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {exp.current
                          ? 'Present'
                          : exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </span>
                      {exp.current && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">{exp.description}</p>
                  )}

                  {/* Achievements */}
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="text-black mt-1">▸</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-gray-200">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Education</h2>
            <p className="text-gray-600">Academic background and qualifications</p>
          </div>

          <div className="max-w-4xl space-y-8">
            {education.map((edu) => (
              <div key={edu.id} className="relative pl-8 border-l-2 border-gray-200">
                {/* Timeline dot */}
                <div className="absolute left-0 top-0 w-4 h-4 -ml-[9px] rounded-full bg-black border-4 border-white shadow" />

                <div className="pb-8">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-gray-600">
                        {edu.institutionUrl ? (
                          <a
                            href={edu.institutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-black hover:underline"
                          >
                            {edu.institution}
                          </a>
                        ) : (
                          <span className="font-medium">{edu.institution}</span>
                        )}
                        {edu.location && (
                          <>
                            <span>•</span>
                            <span>{edu.location}</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{edu.fieldOfStudy}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-gray-600">
                        {new Date(edu.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {edu.current
                          ? 'Present'
                          : edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </span>
                      <div className="flex gap-2">
                        {edu.grade && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium">
                            {edu.grade}
                          </span>
                        )}
                        {edu.current && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">{edu.description}</p>
                  )}

                  {/* Achievements */}
                  {edu.achievements.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {edu.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="text-black mt-1">▸</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Relevant Courses */}
                  {edu.courses.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Relevant Courses:</p>
                      <div className="flex flex-wrap gap-2">
                        {edu.courses.map((course, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {Object.keys(groupedSkills).length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-gray-200">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Skills & Expertise</h2>
            <p className="text-gray-600">Technical proficiencies and capabilities</p>
          </div>

          <div className="max-w-4xl space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">{category}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {skill.iconUrl && (
                            <img
                              src={skill.iconUrl}
                              alt={skill.name}
                              className="w-5 h-5 object-contain"
                            />
                          )}
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      {skill.description && (
                        <p className="text-sm text-gray-600">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
              <Card key={pub.id}>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="text-gray-400 dark:text-gray-500 font-bold text-lg min-w-[4rem]">
                      {pub.year}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 text-black dark:text-white">
                        {pub.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {pub.authors.join(', ')}
                      </p>
                      {pub.venue && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{pub.venue}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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

      {/* Contact Section */}
      <section className="container mx-auto px-6 py-32 border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">
              Have a project in mind or want to collaborate? I'd love to hear from you.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  )
}
