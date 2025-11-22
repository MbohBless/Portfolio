import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper function to create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { getUser } = await import('@/lib/auth-server')
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseClient()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB for blog images)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max size is 5MB' },
        { status: 400 }
      )
    }

    // Validate MIME type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'video/mp4',
      'video/webm',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.type}` },
        { status: 400 }
      )
    }

    // Generate storage path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const storagePath = `blog/${new Date().toISOString().split('T')[0]}/${fileName}`

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents_bucket')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Upload failed' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents_bucket')
      .getPublicUrl(storagePath)

    // Save metadata to database
    const mediaFile = await prisma.mediaFile.create({
      data: {
        originalName: file.name,
        storagePath,
        url: urlData.publicUrl,
        mimeType: file.type,
        sizeBytes: BigInt(file.size),
        uploadedBy: user.id,
      },
    })

    return NextResponse.json({
      id: mediaFile.id,
      url: mediaFile.url,
      storagePath: mediaFile.storagePath,
      mimeType: mediaFile.mimeType,
      sizeBytes: Number(mediaFile.sizeBytes),
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authentication check
    const { getUser } = await import('@/lib/auth-server')
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseClient()

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID required' },
        { status: 400 }
      )
    }

    // Get file from database
    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id: fileId },
    })

    if (!mediaFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from('documents_bucket')
      .remove([mediaFile.storagePath])

    if (deleteError) {
      console.error('Delete error:', deleteError)
    }

    // Delete from database
    await prisma.mediaFile.delete({
      where: { id: fileId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}
