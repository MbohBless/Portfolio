'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import {
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getWorkExperiences,
} from '@/app/actions/experience'

interface WorkExperience {
  id: string
  company: string
  position: string
  location: string | null
  startDate: Date
  endDate: Date | null
  current: boolean
  description: string | null
  achievements: string[]
  technologies: string[]
  companyUrl: string | null
  displayOrder: number
  published: boolean
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [] as string[],
    technologies: [] as string[],
    companyUrl: '',
    displayOrder: 0,
    published: false,
  })

  const [achievementInput, setAchievementInput] = useState('')
  const [technologyInput, setTechnologyInput] = useState('')

  useEffect(() => {
    loadExperiences()
  }, [])

  const loadExperiences = async () => {
    setIsLoading(true)
    const result = await getWorkExperiences()
    if (result.success && result.data) {
      setExperiences(result.data as WorkExperience[])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const result = editingId
      ? await updateWorkExperience(editingId, formData)
      : await createWorkExperience(formData)

    if (result.success) {
      setMessage(editingId ? 'Experience updated successfully!' : 'Experience created successfully!')
      resetForm()
      loadExperiences()
    } else {
      setMessage(result.error || 'Failed to save experience')
    }
  }

  const handleEdit = (experience: WorkExperience) => {
    setIsEditing(true)
    setEditingId(experience.id)
    setFormData({
      company: experience.company,
      position: experience.position,
      location: experience.location || '',
      startDate: new Date(experience.startDate).toISOString().split('T')[0],
      endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
      current: experience.current,
      description: experience.description || '',
      achievements: experience.achievements,
      technologies: experience.technologies,
      companyUrl: experience.companyUrl || '',
      displayOrder: experience.displayOrder,
      published: experience.published,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    const result = await deleteWorkExperience(id)
    if (result.success) {
      setMessage('Experience deleted successfully!')
      loadExperiences()
    } else {
      setMessage(result.error || 'Failed to delete experience')
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      technologies: [],
      companyUrl: '',
      displayOrder: 0,
      published: false,
    })
    setAchievementInput('')
    setTechnologyInput('')
  }

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }))
      setAchievementInput('')
    }
  }

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  const addTechnology = () => {
    if (technologyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, technologyInput.trim()],
      }))
      setTechnologyInput('')
    }
  }

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }))
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Work Experience</h1>
        <p className="text-gray-600">Manage your professional work history</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-6">
              {isEditing ? 'Edit Experience' : 'Add New Experience'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Google"
                required
              />

              <Input
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Senior Software Engineer"
                required
              />

              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />

                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : formData.endDate,
                    })
                  }
                  className="w-5 h-5"
                />
                <label htmlFor="current" className="text-sm font-medium cursor-pointer">
                  Currently working here
                </label>
              </div>

              <Input
                label="Company URL"
                type="url"
                value={formData.companyUrl}
                onChange={(e) => setFormData({ ...formData, companyUrl: e.target.value })}
                placeholder="https://company.com"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="Brief overview of your role and responsibilities..."
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium mb-2">Key Achievements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    placeholder="Add achievement"
                    className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <Button type="button" onClick={addAchievement} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1 text-sm">• {achievement}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium mb-2">Technologies Used</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={technologyInput}
                    onChange={(e) => setTechnologyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    placeholder="Add technology"
                    className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <Button type="button" onClick={addTechnology} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-sm font-medium flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Input
                label="Display Order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                }
                helper="Lower numbers appear first"
              />

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="published" className="text-sm font-medium cursor-pointer">
                  Published (visible on homepage)
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary">
                  {isEditing ? 'Update Experience' : 'Create Experience'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All Experiences ({experiences.length})</h2>
          {experiences.length === 0 ? (
            <Card>
              <CardContent>
                <p className="text-center text-gray-600 py-8">
                  No work experiences yet. Add your first experience!
                </p>
              </CardContent>
            </Card>
          ) : (
            experiences.map((exp) => (
              <Card key={exp.id}>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                        </div>
                        <div className="flex gap-2">
                          {exp.published && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium">
                              Published
                            </span>
                          )}
                          {exp.current && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {formatDate(exp.startDate)} -{' '}
                        {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'N/A'}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-700 mb-3">{exp.description}</p>
                      )}
                      {exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {exp.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(exp)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(exp.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
