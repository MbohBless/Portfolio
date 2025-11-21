-- Migration 003: Create publications table
-- Stores academic publications, papers, and research work

CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    authors TEXT[] NOT NULL, -- Array of author names in order
    year INTEGER NOT NULL,
    venue TEXT, -- Conference or journal name
    doi TEXT, -- Digital Object Identifier
    arxiv_id TEXT, -- arXiv identifier (e.g., "2103.12345")
    pdf_url TEXT, -- Link to PDF in Supabase Storage or external
    abstract TEXT,
    tags TEXT[] DEFAULT '{}', -- e.g., ['machine-learning', 'nlp']
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT valid_year CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 5),
    CONSTRAINT valid_doi CHECK (doi IS NULL OR doi ~* '^10\.[0-9]{4,}'),
    CONSTRAINT valid_arxiv CHECK (arxiv_id IS NULL OR arxiv_id ~* '^[0-9]{4}\.[0-9]{4,5}$')
);

-- Trigger for updated_at
CREATE TRIGGER update_publications_updated_at
    BEFORE UPDATE ON publications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_publications_slug ON publications(slug);
CREATE INDEX idx_publications_year ON publications(year DESC);
CREATE INDEX idx_publications_published ON publications(published) WHERE published = true;
CREATE INDEX idx_publications_tags ON publications USING GIN(tags);

-- Helper function to generate slug from title and year
CREATE OR REPLACE FUNCTION generate_publication_slug(p_title TEXT, p_year INTEGER)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(p_title, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        )
    ) || '-' || p_year::TEXT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON TABLE publications IS 'Academic publications and research papers';
COMMENT ON COLUMN publications.authors IS 'Ordered list of author names';
COMMENT ON COLUMN publications.venue IS 'Conference abbreviation or journal name (e.g., "NeurIPS 2023", "Nature")';
COMMENT ON COLUMN publications.doi IS 'DOI without the https://doi.org/ prefix';
COMMENT ON COLUMN publications.arxiv_id IS 'arXiv ID in format YYMM.NNNNN';
