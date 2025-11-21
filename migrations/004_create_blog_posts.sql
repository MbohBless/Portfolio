-- Migration 004: Create blog_posts table
-- Stores blog post metadata; MDX content stored in Supabase Storage

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT, -- Short description for cards/SEO
    content_url TEXT, -- Supabase Storage URL to .mdx file
    cover_image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ, -- When post was first published (for sorting)
    reading_time INTEGER DEFAULT 0, -- Estimated reading time in minutes
    views INTEGER DEFAULT 0, -- Simple view counter
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT valid_reading_time CHECK (reading_time >= 0),
    CONSTRAINT valid_views CHECK (views >= 0)
);

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-set published_at on first publish
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.published = true AND OLD.published = false AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_blog_posts_published_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION set_published_at();

-- Indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC NULLS LAST) WHERE published = true;
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- View for public blog posts (commonly queried)
CREATE OR REPLACE VIEW public_blog_posts AS
SELECT
    id,
    title,
    slug,
    excerpt,
    content_url,
    cover_image_url,
    tags,
    published_at,
    reading_time,
    views
FROM blog_posts
WHERE published = true
ORDER BY published_at DESC NULLS LAST;

COMMENT ON TABLE blog_posts IS 'Blog post metadata; actual MDX content stored in Supabase Storage';
COMMENT ON COLUMN blog_posts.content_url IS 'URL to .mdx file in Supabase Storage bucket';
COMMENT ON COLUMN blog_posts.published_at IS 'First publish timestamp; used for sorting (does not change on edits)';
COMMENT ON VIEW public_blog_posts IS 'Published blog posts for public consumption';
