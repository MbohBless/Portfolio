-- Migration 002: Create projects table
-- Stores portfolio projects with metadata, links, and media

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    tech_stack TEXT[] DEFAULT '{}', -- Array of technology names
    github_url TEXT,
    demo_url TEXT,
    thumbnail_url TEXT, -- Primary image for cards
    images TEXT[] DEFAULT '{}', -- Additional screenshots/images
    published BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0, -- For manual ordering
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT valid_github_url CHECK (github_url IS NULL OR github_url ~* '^https?://'),
    CONSTRAINT valid_demo_url CHECK (demo_url IS NULL OR demo_url ~* '^https?://')
);

-- Trigger for updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published) WHERE published = true;
CREATE INDEX idx_projects_display_order ON projects(display_order);

-- Default display order trigger (auto-increment)
CREATE OR REPLACE FUNCTION set_default_display_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.display_order = 0 THEN
        SELECT COALESCE(MAX(display_order), 0) + 1 INTO NEW.display_order FROM projects;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_projects_display_order
    BEFORE INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION set_default_display_order();

COMMENT ON TABLE projects IS 'Portfolio projects with tech stack and links';
COMMENT ON COLUMN projects.slug IS 'URL-friendly identifier, must be lowercase alphanumeric with hyphens';
COMMENT ON COLUMN projects.display_order IS 'Manual ordering for projects page, lower numbers appear first';
