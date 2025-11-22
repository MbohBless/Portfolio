'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { MarkdownEditor } from '@/components/blog/MarkdownEditor'
import { createBlogPost } from '@/app/actions/blog'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [tagInput, setTagInput] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    tags: [] as string[],
    published: false,
    publishedAt: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const result = await createBlogPost(formData)

    if (result.success) {
      setMessage('Blog post created successfully!')
      setTimeout(() => {
        router.push('/admin/blog')
      }, 1000)
    } else {
      setMessage(result.error || 'Failed to create blog post')
      setIsLoading(false)
    }
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create New Blog Post</h1>
        <p className="text-gray-600">Write your content in Markdown with live preview</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
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
                  setFormData((prev) => ({
                    ...prev,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                  }))
                }
                helper="URL-friendly identifier (auto-generated from title)"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                  rows={3}
                  placeholder="Brief summary of your post..."
                />
              </div>

              <Input
                label="Cover Image URL (optional)"
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, coverImageUrl: e.target.value }))}
                helper="Or paste an image directly into the editor below"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Content</h2>
            <MarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Add a tag..."
                />
                <Button type="button" onClick={addTag} variant="secondary">
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Publishing</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Publish immediately</span>
              </label>

              {formData.published && (
                <Input
                  label="Published Date (optional)"
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))}
                  helper="Leave empty to use current date/time"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Post'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  )
}