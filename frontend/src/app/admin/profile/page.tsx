'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    // Personal Info
    name: 'Your Name',
    title: 'AI Engineer & Software Developer',
    bio: 'Write a brief bio about yourself...',
    email: 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    
    // Social Links
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
    website: 'https://yourwebsite.com',
    
    // Hero Section
    heroTitle: 'Building AI Solutions',
    heroSubtitle: 'Specializing in machine learning, deep learning, and software engineering',
    
    // Profile Image
    profileImage: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement save to database
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Profile saved! (Note: Backend implementation pending)')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Implement image upload
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profileImage: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information and social links</p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Profile Image */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-6">Profile Photo</h2>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                {profileData.profileImage ? (
                  <img 
                    src={profileData.profileImage} 
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
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
              />
              <Input
                label="Title/Role"
                value={profileData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="AI Engineer & Software Developer"
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
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-6">Homepage Hero Section</h2>
            <div className="space-y-4">
              <Input
                label="Hero Title"
                value={profileData.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="Building AI Solutions"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <textarea
                  value={profileData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="Specializing in machine learning, deep learning, and software engineering"
                />
              </div>
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
                value={profileData.github}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="https://github.com/yourusername"
              />
              <Input
                label="LinkedIn"
                value={profileData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourusername"
              />
              <Input
                label="Twitter/X"
                value={profileData.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                placeholder="https://twitter.com/yourusername"
              />
              <Input
                label="Personal Website"
                value={profileData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
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
            onClick={() => window.location.reload()}
          >
            Cancel
          </Button>
        </div>

        {/* Note */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent>
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-semibold mb-1">Coming Soon</h3>
                <p className="text-sm text-gray-700">
                  Profile data saving will be implemented in the next phase. For now, you can preview how the form works.
                  The data will be stored in the database and displayed on your public portfolio pages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
