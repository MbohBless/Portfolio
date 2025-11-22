'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

// Import MDEditor dynamically to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export function MarkdownEditor({ value, onChange, height = 600 }: MarkdownEditorProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }, [])

  // Handle paste event for images
  const handlePaste = useCallback(
    async (event: React.ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf('image') !== -1) {
          event.preventDefault()
          const file = item.getAsFile()
          if (file) {
            try {
              const url = await handleImageUpload(file)
              const imageMarkdown = `\n![Image](${url})\n`
              onChange(value + imageMarkdown)
            } catch (error) {
              alert('Failed to upload image')
            }
          }
        }
      }
    },
    [value, onChange, handleImageUpload]
  )

  // Handle drop event for images
  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault()
      const files = event.dataTransfer?.files
      if (!files || files.length === 0) return

      const file = files[0]
      if (file.type.indexOf('image') !== -1) {
        try {
          const url = await handleImageUpload(file)
          const imageMarkdown = `\n![Image](${url})\n`
          onChange(value + imageMarkdown)
        } catch (error) {
          alert('Failed to upload image')
        }
      }
    },
    [value, onChange, handleImageUpload]
  )

  // Handle file input change
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const url = await handleImageUpload(file)
        const imageMarkdown = `\n![Image](${url})\n`
        onChange(value + imageMarkdown)
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        alert('Failed to upload image')
      }
    },
    [value, onChange, handleImageUpload]
  )

  return (
    <div
      className="relative"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      data-color-mode="light"
    >
      {uploading && (
        <div className="absolute top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
          Uploading image...
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image upload button */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      <div data-color-mode="light">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          preview="live"
        />
      </div>

      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <p className="font-semibold mb-2">💡 Quick Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click "Upload Image" button above or paste/drag images directly</li>
          <li>Use # for headings, **bold**, *italic*</li>
          <li>Create tables: | Column 1 | Column 2 |</li>
          <li>Code blocks: ```javascript</li>
        </ul>
      </div>
    </div>
  )
}
