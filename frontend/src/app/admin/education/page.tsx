'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import {
  createEducation,
  updateEducation,
  deleteEducation,
  getEducation,
} from '@/app/actions/education'

interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  location: string | null
  startDate: Date
  endDate: Date | null
  current: boolean
  grade: string | null
  description: string | null
  achievements: string[]
  courses: string[]
  institutionUrl: string | null
  displayOrder: number
  published: boolean
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    grade: '',
    description: '',
    achievements: [] as string[],
    courses: [] as string[],
    institutionUrl: '',
    displayOrder: 0,
    published: false,
  })

  const [achievementInput, setAchievementInput] = useState('')
  const [courseInput, setCourseInput] = useState('')

  useEffect(() => {
    loadEducation()
  }, [])

  const loadEducation = async () => {
    setIsLoading(true)
    const result = await getEducation()
    if (result.success && result.data) {
      setEducation(result.data as Education[])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const result = editingId
      ? await updateEducation(editingId, formData)
      : await createEducation(formData)

    if (result.success) {
      setMessage(editingId ? 'Education updated successfully!' : 'Education created successfully!')
      resetForm()
      loadEducation()
    } else {
      setMessage(result.error || 'Failed to save education')
    }
  }

  const handleEdit = (edu: Education) => {
    setIsEditing(true)
    setEditingId(edu.id)
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      location: edu.location || '',
      startDate: new Date(edu.startDate).toISOString().split('T')[0],
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      current: edu.current,
      grade: edu.grade || '',
      description: edu.description || '',
      achievements: edu.achievements,
      courses: edu.courses,
      institutionUrl: edu.institutionUrl || '',
      displayOrder: edu.displayOrder,
      published: edu.published,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education record?')) return

    const result = await deleteEducation(id)
    if (result.success) {
      setMessage('Education deleted successfully!')
      loadEducation()
    } else {
      setMessage(result.error || 'Failed to delete education')
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      grade: '',
      description: '',
      achievements: [],
      courses: [],
      institutionUrl: '',
      displayOrder: 0,
      published: false,
    })
    setAchievementInput('')
    setCourseInput('')
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

  const addCourse = () => {
    if (courseInput.trim()) {
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, courseInput.trim()],
      }))
      setCourseInput('')
    }
  }

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index),
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
        <h1 className="text-4xl font-bold mb-2">Education</h1>
        <p className="text-gray-600">Manage your academic background</p>
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
              {isEditing ? 'Edit Education' : 'Add New Education'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Stanford University"
                required
              />

              <Input
                label="Degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Master of Science"
                required
              />

              <Input
                label="Field of Study"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                placeholder="Computer Science"
                required
              />

              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Stanford, CA"
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
                  Currently studying here
                </label>
              </div>

              <Input
                label="Grade/GPA"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="3.9 GPA"
              />

              <Input
                label="Institution URL"
                type="url"
                value={formData.institutionUrl}
                onChange={(e) => setFormData({ ...formData, institutionUrl: e.target.value })}
                placeholder="https://institution.edu"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="Brief description of your studies..."
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium mb-2">Achievements & Honors</label>
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

              {/* Relevant Courses */}
              <div>
                <label className="block text-sm font-medium mb-2">Relevant Courses</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
                    placeholder="Add course"
                    className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <Button type="button" onClick={addCourse} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.courses.map((course, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-sm font-medium flex items-center gap-2"
                    >
                      {course}
                      <button
                        type="button"
                        onClick={() => removeCourse(index)}
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
                  {isEditing ? 'Update Education' : 'Create Education'}
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
          <h2 className="text-2xl font-bold">All Education ({education.length})</h2>
          {education.length === 0 ? (
            <Card>
              <CardContent>
                <p className="text-center text-gray-600 py-8">
                  No education records yet. Add your first one!
                </p>
              </CardContent>
            </Card>
          ) : (
            education.map((edu) => (
              <Card key={edu.id}>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                          {edu.location && <p className="text-sm text-gray-500">{edu.location}</p>}
                        </div>
                        <div className="flex gap-2">
                          {edu.published && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium">
                              Published
                            </span>
                          )}
                          {edu.current && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {formatDate(edu.startDate)} -{' '}
                        {edu.current ? 'Present' : edu.endDate ? formatDate(edu.endDate) : 'N/A'}
                        {edu.grade && ` • ${edu.grade}`}
                      </p>
                      {edu.description && (
                        <p className="text-sm text-gray-700 mb-3">{edu.description}</p>
                      )}
                      {edu.courses.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {edu.courses.map((course, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(edu)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(edu.id)}
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
