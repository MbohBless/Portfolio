-- Migration 006: Add full-text search capabilities
-- Uses PostgreSQL's built-in full-text search with tsvector

-- Add search vector columns (auto-generated from content)
ALTER TABLE projects
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(tech_stack, ' ')), 'C')
) STORED;

ALTER TABLE publications
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(abstract, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(authors, ' ')), 'C') ||
    setweight(to_tsvector('english', coalesce(venue, '')), 'D')
) STORED;

ALTER TABLE blog_posts
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(tags, ' ')), 'C')
) STORED;

-- Create GIN indexes for fast full-text search
CREATE INDEX idx_projects_search ON projects USING GIN(search_vector);
CREATE INDEX idx_publications_search ON publications USING GIN(search_vector);
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_vector);

-- Unified search function that queries all tables
CREATE OR REPLACE FUNCTION search_all(query_text TEXT, max_results INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    title TEXT,
    excerpt TEXT,
    type TEXT,
    slug TEXT,
    rank REAL
) AS $$
DECLARE
    tsquery_text tsquery;
BEGIN
    -- Convert search query to tsquery
    tsquery_text := websearch_to_tsquery('english', query_text);

    RETURN QUERY
    -- Search projects
    SELECT
        p.id,
        p.title,
        SUBSTRING(p.description, 1, 200) as excerpt,
        'project'::TEXT as type,
        p.slug,
        ts_rank(p.search_vector, tsquery_text) as rank
    FROM projects p
    WHERE p.published = true AND p.search_vector @@ tsquery_text

    UNION ALL

    -- Search publications
    SELECT
        pub.id,
        pub.title,
        SUBSTRING(pub.abstract, 1, 200) as excerpt,
        'publication'::TEXT as type,
        pub.slug,
        ts_rank(pub.search_vector, tsquery_text) as rank
    FROM publications pub
    WHERE pub.published = true AND pub.search_vector @@ tsquery_text

    UNION ALL

    -- Search blog posts
    SELECT
        bp.id,
        bp.title,
        bp.excerpt,
        'blog'::TEXT as type,
        bp.slug,
        ts_rank(bp.search_vector, tsquery_text) as rank
    FROM blog_posts bp
    WHERE bp.published = true AND bp.search_vector @@ tsquery_text

    ORDER BY rank DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- Example usage:
-- SELECT * FROM search_all('machine learning');
-- SELECT * FROM search_all('kotlin web framework', 10);

COMMENT ON FUNCTION search_all IS 'Unified full-text search across projects, publications, and blog posts';
COMMENT ON COLUMN projects.search_vector IS 'Auto-generated tsvector for full-text search (weighted: title > description > tech_stack)';
COMMENT ON COLUMN publications.search_vector IS 'Auto-generated tsvector for full-text search (weighted: title > abstract > authors > venue)';
COMMENT ON COLUMN blog_posts.search_vector IS 'Auto-generated tsvector for full-text search (weighted: title > excerpt > tags)';
