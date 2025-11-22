'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import {
  createPublication,
  updatePublication,
  deletePublication,
  getPublications,
} from '@/app/actions/publications'

interface Publication {
  id: string
  title: string
  slug: string
  authors: string[]
  year: number
  venue: string | null
  doi: string | null
  arxivId: string | null
  pdfUrl: string | null
  abstract: string | null
  tags: string[]
  published: boolean
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [authorInput, setAuthorInput] = useState('')
  const [tagInput, setTagInput] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    authors: [] as string[],
    year: new Date().getFullYear(),
    venue: '',
    doi: '',
    arxivId: '',
    pdfUrl: '',
    abstract: '',
    tags: [] as string[],
    published: false,
  })

  useEffect(() => {
    loadPublications()
  }, [])

  const loadPublications = async () => {
    setIsLoading(true)
    const result = await getPublications()
    if (result.success && result.data) {
      setPublications(result.data as Publication[])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const result = editingId
      ? await updatePublication(editingId, formData)
      : await createPublication(formData)

    if (result.success) {
      setMessage(editingId ? 'Publication updated!' : 'Publication created!')
      resetForm()
      loadPublications()
    } else {
      setMessage(result.error || 'Failed to save publication')
    }
  }

  const handleEdit = (pub: Publication) => {
    setIsEditing(true)
    setEditingId(pub.id)
    setFormData({
      title: pub.title,
      slug: pub.slug,
      authors: pub.authors,
      year: pub.year,
      venue: pub.venue || '',
      doi: pub.doi || '',
      arxivId: pub.arxivId || '',
      pdfUrl: pub.pdfUrl || '',
      abstract: pub.abstract || '',
      tags: pub.tags,
      published: pub.published,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this publication?')) return

    const result = await deletePublication(id)
    if (result.success) {
      setMessage('Publication deleted!')
      loadPublications()
    } else {
      setMessage(result.error || 'Failed to delete')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      authors: [],
      year: new Date().getFullYear(),
      venue: '',
      doi: '',
      arxivId: '',
      pdfUrl: '',
      abstract: '',
      tags: [],
      published: false,
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const addAuthor = () => {
    if (authorInput.trim() && !formData.authors.includes(authorInput.trim())) {
      setFormData((prev) => ({ ...prev, authors: [...prev.authors, authorInput.trim()] }))
      setAuthorInput('')
    }
  }

  const removeAuthor = (author: string) => {
    setFormData((prev) => ({ ...prev, authors: prev.authors.filter((a) => a !== author) }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
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
        <h1 className="text-4xl font-bold mb-2">Publications</h1>
        <p className="text-gray-600">Manage your research publications</p>
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
              {isEditing ? 'Edit Publication' : 'Add Publication'}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2">Authors *</label>
                <div className="flex gap-2">
                  <Input
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                    placeholder="Add author..."
                  />
                  <Button type="button" onClick={addAuthor} variant="secondary">Add</Button>
                </div>
                {formData.authors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.authors.map((author) => (
                      <span key={author} className="px-2 py-1 bg-gray-100 text-sm flex items-center gap-1">
                        {author}
                        <button type="button" onClick={() => removeAuthor(author)} className="text-red-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                required
              />

              <Input
                label="Venue"
                value={formData.venue}
                onChange={(e) => setFormData((prev) => ({ ...prev, venue: e.target.value }))}
                placeholder="e.g., NeurIPS, ICML"
              />

              <Input
                label="DOI"
                value={formData.doi}
                onChange={(e) => setFormData((prev) => ({ ...prev, doi: e.target.value }))}
              />

              <Input
                label="ArXiv ID"
                value={formData.arxivId}
                onChange={(e) => setFormData((prev) => ({ ...prev, arxivId: e.target.value }))}
              />

              <Input
                label="PDF URL"
                type="url"
                value={formData.pdfUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, pdfUrl: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium mb-2">Abstract</label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) => setFormData((prev) => ({ ...prev, abstract: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                  />
                  <Button type="button" onClick={addTag} variant="secondary">Add</Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-sm flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-red-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Publications</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : publications.length > 0 ? (
            publications.map((pub) => (
              <Card key={pub.id}>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{pub.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{pub.authors.join(', ')}</p>
                      <p className="text-sm text-gray-500 mt-1">{pub.venue} ({pub.year})</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs ${pub.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {pub.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(pub)}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(pub.id)}>Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No publications yet</p>
          )}
        </div>
      </div>
    </main>
  )
}