'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
} from '@/app/actions/projects'

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  techStack: string[]
  githubUrl: string | null
  demoUrl: string | null
  thumbnailUrl: string | null
  images: string[]
  published: boolean
  displayOrder: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [techInput, setTechInput] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    techStack: [] as string[],
    githubUrl: '',
    demoUrl: '',
    thumbnailUrl: '',
    published: false,
    displayOrder: 0,
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setIsLoading(true)
    const result = await getProjects()
    if (result.success && result.data) {
      setProjects(result.data as Project[])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const result = editingId
      ? await updateProject(editingId, formData)
      : await createProject(formData)

    if (result.success) {
      setMessage(editingId ? 'Project updated successfully!' : 'Project created successfully!')
      resetForm()
      loadProjects()
    } else {
      setMessage(result.error || 'Failed to save project')
    }
  }

  const handleEdit = (project: Project) => {
    setIsEditing(true)
    setEditingId(project.id)
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description || '',
      techStack: project.techStack,
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      thumbnailUrl: project.thumbnailUrl || '',
      published: project.published,
      displayOrder: project.displayOrder,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    const result = await deleteProject(id)
    if (result.success) {
      setMessage('Project deleted successfully!')
      loadProjects()
    } else {
      setMessage(result.error || 'Failed to delete project')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      techStack: [],
      githubUrl: '',
      demoUrl: '',
      thumbnailUrl: '',
      published: false,
      displayOrder: 0,
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()],
      }))
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }))
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }))
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Projects</h1>
        <p className="text-gray-600">Manage your portfolio projects</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded ${
            message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />

              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))
                }
                helper="URL-friendly identifier"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tech Stack</label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTech()
                      }
                    }}
                    placeholder="Add technology..."
                  />
                  <Button type="button" onClick={addTech} variant="secondary">
                    Add
                  </Button>
                </div>
                {formData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm flex items-center gap-1"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="GitHub URL (optional)"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
              />

              <Input
                label="Demo URL (optional)"
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))}
              />

              <Input
                label="Thumbnail URL (optional)"
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, thumbnailUrl: e.target.value }))}
              />

              <Input
                label="Display Order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Published</span>
              </label>

              <div className="flex gap-2">
                <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
                {isEditing && (
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Projects</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id}>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-xs bg-gray-100 px-2 py-1">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-xs text-gray-500">+{project.techStack.length - 3}</span>
                        )}
                      </div>
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs ${
                          project.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(project)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No projects yet</p>
          )}
        </div>
      </div>
    </main>
  )
}