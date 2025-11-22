'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you! Your message has been sent successfully.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        required
        disabled={status === 'loading'}
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        required
        disabled={status === 'loading'}
      />

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          rows={5}
          required
          disabled={status === 'loading'}
          placeholder="Tell me about your project or inquiry..."
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded ${
            status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <Button type="submit" size="lg" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}