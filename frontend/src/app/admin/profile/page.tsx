'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    // Personal Info
    name: 'Mboh Bless Pearl N',
    title: 'AI Engineer & Software Developer',
    bio: 'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
    email: 'mbohblesspearl@gmail.com',
    phone: '+250798287701',
    location: 'Kigali, RWA',
    resumeUrl: '',

    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    websiteUrl: '',
    
    // Hero Section
    heroTitle: 'AI Engineer & Software Developer',
    heroSubtitle: 'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
    availableForWork: true,
    
    // Profile Image
    profileImageUrl: '/images/profile.png',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')

  // Load profile data on mount
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setMessage('Error loading profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        setMessage('Profile saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage('Error saving profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setProfileData(prev => ({ ...prev, profileImageUrl: data.url }))
          setMessage('Image uploaded successfully!')
          setTimeout(() => setMessage(''), 3000)
        } else {
          setMessage('Failed to upload image')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        setMessage('Error uploading image')
      }
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information and social links</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="max-w-4xl space-y-8">
        {/* Profile Image */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-6">Profile Photo</h2>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                {profileData.profileImageUrl ? (
                  <img 
                    src={profileData.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-400">👤</span>
                )}
              </div>
              <div>
                <label htmlFor="profile-image" className="cursor-pointer">
                  <div className="inline-block px-4 py-2 border border-gray-300 hover:border-black transition-colors font-medium">
                    Upload Photo
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded mb-4">
                <input
                  type="checkbox"
                  id="availableForWork"
                  checked={profileData.availableForWork}
                  onChange={(e) => handleChange('availableForWork', e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="availableForWork" className="text-sm font-medium cursor-pointer">
                  Available for opportunities
                  <span className="block text-xs text-gray-600 mt-1">Shows a green dot indicator on the homepage</span>
                </label>
              </div>

              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                helper="Displayed prominently on the homepage"
              />
              <Input
                label="Title/Role"
                value={profileData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="AI Engineer & Software Developer"
                helper="Your professional title shown on the homepage"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="Write a brief bio about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">This appears on your homepage below your name and title</p>
              </div>
              <Input
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
              <Input
                label="Phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <Input
                label="Location"
                value={profileData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
              <Input
                label="Resume/CV URL"
                value={profileData.resumeUrl}
                onChange={(e) => handleChange('resumeUrl', e.target.value)}
                placeholder="https://example.com/resume.pdf"
                helper="Upload your resume to Supabase storage or provide a link"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-6">Social Links</h2>
            <div className="space-y-4">
              <Input
                label="GitHub"
                value={profileData.githubUrl}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
                placeholder="https://github.com/yourusername"
              />
              <Input
                label="LinkedIn"
                value={profileData.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/yourusername"
              />
              <Input
                label="Twitter/X"
                value={profileData.twitterUrl}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/yourusername"
              />
              <Input
                label="Personal Website"
                value={profileData.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            className="px-8"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="ghost"
            onClick={loadProfile}
          >
            Reset
          </Button>
        </div>
      </div>
    </main>
  )
}
