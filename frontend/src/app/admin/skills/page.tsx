'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkills,
} from '@/app/actions/skills'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  iconUrl: string | null
  description: string | null
  displayOrder: number
  published: boolean
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 50,
    iconUrl: '',
    description: '',
    displayOrder: 0,
    published: false,
  })

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    setIsLoading(true)
    const result = await getSkills()
    if (result.success && result.data) {
      setSkills(result.data as Skill[])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const result = editingId
      ? await updateSkill(editingId, formData)
      : await createSkill(formData)

    if (result.success) {
      setMessage(editingId ? 'Skill updated!' : 'Skill created!')
      resetForm()
      loadSkills()
    } else {
      setMessage(result.error || 'Failed to save skill')
    }
  }

  const handleEdit = (skill: Skill) => {
    setIsEditing(true)
    setEditingId(skill.id)
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      iconUrl: skill.iconUrl || '',
      description: skill.description || '',
      displayOrder: skill.displayOrder,
      published: skill.published,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return

    const result = await deleteSkill(id)
    if (result.success) {
      setMessage('Skill deleted!')
      loadSkills()
    } else {
      setMessage(result.error || 'Failed to delete')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      proficiency: 50,
      iconUrl: '',
      description: '',
      displayOrder: 0,
      published: false,
    })
    setIsEditing(false)
    setEditingId(null)
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Skills</h1>
        <p className="text-gray-600">Manage your technical skills and expertise</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded ${message.includes('success') || message.includes('created') || message.includes('updated') || message.includes('deleted') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Skill' : 'Add Skill'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Python, React, Docker"
                required
              />

              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Programming Languages, Frameworks, Tools"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Proficiency: {formData.proficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <Input
                label="Icon URL (optional)"
                type="url"
                value={formData.iconUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, iconUrl: e.target.value }))}
                placeholder="https://example.com/icon.png"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  rows={2}
                  placeholder="Brief description of your proficiency..."
                />
              </div>

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
                {isEditing && <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">All Skills</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : Object.keys(groupedSkills).length > 0 ? (
            Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <Card key={category}>
                <CardContent>
                  <h3 className="font-semibold mb-3">{category}</h3>
                  <div className="space-y-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-xs text-gray-500">({skill.proficiency}%)</span>
                            <span className={`text-xs px-2 py-0.5 ${skill.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {skill.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 mt-1 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full" 
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(skill)}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No skills yet</p>
          )}
        </div>
      </div>
    </main>
  )
}