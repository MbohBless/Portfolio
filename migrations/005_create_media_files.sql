-- Migration 005: Create media_files table
-- Tracks all uploaded files (PDFs, images, etc.) stored in Supabase Storage

CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_name TEXT NOT NULL, -- Original filename from upload
    storage_path TEXT NOT NULL, -- Full path in Supabase Storage
    url TEXT NOT NULL, -- Public URL
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}', -- Flexible field for width/height/etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_size CHECK (size_bytes > 0 AND size_bytes <= 104857600), -- Max 100MB
    CONSTRAINT valid_mime_type CHECK (
        mime_type IN (
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'application/pdf',
            'video/mp4', 'video/webm'
        )
    )
);

-- Indexes
CREATE INDEX idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX idx_media_files_mime_type ON media_files(mime_type);
CREATE INDEX idx_media_files_created_at ON media_files(created_at DESC);

-- Function to get storage usage by user
CREATE OR REPLACE FUNCTION get_storage_usage(user_id UUID)
RETURNS BIGINT AS $$
    SELECT COALESCE(SUM(size_bytes), 0)::BIGINT
    FROM media_files
    WHERE uploaded_by = user_id;
$$ LANGUAGE SQL STABLE;

-- View for storage stats
CREATE OR REPLACE VIEW storage_stats AS
SELECT
    COUNT(*) as total_files,
    SUM(size_bytes)::BIGINT as total_bytes,
    AVG(size_bytes)::INTEGER as avg_bytes,
    mime_type,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as recent_uploads
FROM media_files
GROUP BY mime_type;

COMMENT ON TABLE media_files IS 'Metadata for all uploaded files in Supabase Storage';
COMMENT ON COLUMN media_files.storage_path IS 'Path within Supabase Storage bucket (e.g., "uploads/2024/image.jpg")';
COMMENT ON COLUMN media_files.metadata IS 'JSON field for extra data like image dimensions, video duration, etc.';
COMMENT ON FUNCTION get_storage_usage IS 'Returns total bytes used by a specific user';
