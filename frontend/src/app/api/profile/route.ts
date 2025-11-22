import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth-server'

// GET - Fetch profile data
export async function GET() {
  try {
    // Get the first (and only) profile record
    const profile = await prisma.profile.findFirst()
    
    if (!profile) {
      // Return default profile if none exists
      return NextResponse.json({
        name: 'Mbou Bless Pearl N',
        title: 'AI Engineer & Software Developer',
        bio: 'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
        email: 'contact@example.com',
        phone: '',
        location: '',
        profileImageUrl: '/images/profile.png',
        resumeUrl: '',
        heroTitle: 'AI Engineer & Software Developer',
        heroSubtitle: 'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
        availableForWork: true,
        githubUrl: '',
        linkedinUrl: '',
        twitterUrl: '',
        websiteUrl: '',
      })
    }
    
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update profile data
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.title || !data.email || !data.heroTitle || !data.heroSubtitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst()
    
    let profile
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          name: data.name,
          title: data.title,
          bio: data.bio || null,
          email: data.email,
          phone: data.phone || null,
          location: data.location || null,
          profileImageUrl: data.profileImageUrl || '/images/profile.png',
          resumeUrl: data.resumeUrl || null,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          availableForWork: data.availableForWork ?? true,
          githubUrl: data.githubUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          twitterUrl: data.twitterUrl || null,
          websiteUrl: data.websiteUrl || null,
        },
      })
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          name: data.name,
          title: data.title,
          bio: data.bio || null,
          email: data.email,
          phone: data.phone || null,
          location: data.location || null,
          profileImageUrl: data.profileImageUrl || '/images/profile.png',
          resumeUrl: data.resumeUrl || null,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          availableForWork: data.availableForWork ?? true,
          githubUrl: data.githubUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          twitterUrl: data.twitterUrl || null,
          websiteUrl: data.websiteUrl || null,
        },
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
