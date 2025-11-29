-- ============================================================================
-- Migration: Search Functions and Additional Indexes
-- ============================================================================
-- Creates PostgreSQL functions for unified search across the application.
-- These functions can be called from Supabase client using .rpc()
--
-- Design Decisions:
-- 1. Use PostgreSQL functions for complex queries (better performance)
-- 2. Combine full-text search with filtering by mode, tags, project
-- 3. Return relevance scores for ranking
-- 4. Enable pg_trgm for fuzzy matching (typo tolerance)
-- ============================================================================

-- Enable pg_trgm extension for fuzzy text matching
-- This allows searching even with typos (similarity matching)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- Full-Text Search Function for Notes
-- ============================================================================
-- Search notes with full-text search, with optional filters

CREATE OR REPLACE FUNCTION search_notes(
    p_user_id UUID,
    p_query TEXT,
    p_mode note_mode DEFAULT NULL,
    p_project_id UUID DEFAULT NULL,
    p_tag_ids UUID[] DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    mode note_mode,
    project_id UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    rank REAL,
    headline TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.id,
        n.title,
        n.content,
        n.mode,
        n.project_id,
        n.created_at,
        n.updated_at,
        ts_rank(n.search_vector, websearch_to_tsquery('english', p_query)) AS rank,
        ts_headline(
            'english',
            coalesce(n.content, ''),
            websearch_to_tsquery('english', p_query),
            'StartSel=<mark>, StopSel=</mark>, MaxWords=50, MinWords=20'
        ) AS headline
    FROM notes n
    WHERE
        n.user_id = p_user_id
        AND (p_query IS NULL OR p_query = '' OR n.search_vector @@ websearch_to_tsquery('english', p_query))
        AND (p_mode IS NULL OR n.mode = p_mode)
        AND (p_project_id IS NULL OR n.project_id = p_project_id)
        AND (
            p_tag_ids IS NULL
            OR EXISTS (
                SELECT 1 FROM note_tags nt
                WHERE nt.note_id = n.id
                AND nt.tag_id = ANY(p_tag_ids)
            )
        )
    ORDER BY
        CASE WHEN p_query IS NOT NULL AND p_query != ''
            THEN ts_rank(n.search_vector, websearch_to_tsquery('english', p_query))
            ELSE 0
        END DESC,
        n.updated_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================================
-- Quick Search Function (Simpler, Faster)
-- ============================================================================
-- For autocomplete and quick lookups

CREATE OR REPLACE FUNCTION quick_search_notes(
    p_user_id UUID,
    p_query TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    mode note_mode,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.id,
        n.title,
        n.mode,
        n.updated_at
    FROM notes n
    WHERE
        n.user_id = p_user_id
        AND (
            n.search_vector @@ websearch_to_tsquery('english', p_query)
            OR n.title ILIKE '%' || p_query || '%'
        )
    ORDER BY
        -- Exact title match first
        CASE WHEN n.title ILIKE p_query || '%' THEN 0 ELSE 1 END,
        -- Then by relevance
        ts_rank(n.search_vector, websearch_to_tsquery('english', p_query)) DESC,
        n.updated_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================================
-- Search Tags (for autocomplete)
-- ============================================================================

CREATE OR REPLACE FUNCTION search_tags(
    p_user_id UUID,
    p_query TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    normalized_name TEXT,
    usage_count INTEGER,
    similarity REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.name,
        t.normalized_name,
        t.usage_count,
        similarity(t.normalized_name, lower(p_query)) AS similarity
    FROM tags t
    WHERE
        t.user_id = p_user_id
        AND (
            t.normalized_name ILIKE '%' || p_query || '%'
            OR similarity(t.normalized_name, lower(p_query)) > 0.3
        )
    ORDER BY
        -- Exact prefix match first
        CASE WHEN t.normalized_name ILIKE p_query || '%' THEN 0 ELSE 1 END,
        -- Then by usage count
        t.usage_count DESC,
        -- Then by similarity
        similarity(t.normalized_name, lower(p_query)) DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================================
-- Create trigram indexes for fuzzy matching
-- ============================================================================

-- Trigram index on note titles for fuzzy search
CREATE INDEX idx_notes_title_trgm ON notes USING GIN (title gin_trgm_ops);

-- Trigram index on tag names for fuzzy autocomplete
CREATE INDEX idx_tags_name_trgm ON tags USING GIN (normalized_name gin_trgm_ops);

-- ============================================================================
-- Grant execute permissions
-- ============================================================================
-- These functions use SECURITY DEFINER, but we still need to grant execute

GRANT EXECUTE ON FUNCTION search_notes TO authenticated;
GRANT EXECUTE ON FUNCTION quick_search_notes TO authenticated;
GRANT EXECUTE ON FUNCTION search_tags TO authenticated;

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON FUNCTION search_notes IS 'Full-text search across notes with filters for mode, project, and tags';
COMMENT ON FUNCTION quick_search_notes IS 'Fast search for autocomplete, returns title and basic info only';
COMMENT ON FUNCTION search_tags IS 'Search tags with fuzzy matching for autocomplete';
