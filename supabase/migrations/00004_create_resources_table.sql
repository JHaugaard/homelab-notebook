-- ============================================================================
-- Migration: Create Resources Table
-- ============================================================================
-- Resources store external links associated with notes.
-- Particularly useful for Research mode notes that collect articles,
-- tutorials, documentation links, etc.
--
-- Design Decisions:
-- 1. Resources belong to a note (not standalone)
-- 2. Store metadata for link previews (title, description, favicon)
-- 3. Track if resource has been "read" or "archived"
-- 4. Optional rating/priority for organizing resources
-- ============================================================================

-- Create enum for resource status
CREATE TYPE resource_status AS ENUM ('unread', 'reading', 'read', 'archived');

-- Create the resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parent note (required)
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,

    -- Owner (denormalized from note for RLS performance)
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Resource URL (required)
    url TEXT NOT NULL,

    -- Metadata (can be fetched/updated asynchronously)
    title TEXT, -- Page title
    description TEXT, -- Meta description
    favicon_url TEXT, -- Site favicon
    image_url TEXT, -- Open Graph image

    -- User annotations
    status resource_status NOT NULL DEFAULT 'unread',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Optional 1-5 rating
    user_notes TEXT, -- User's notes about this resource

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT url_not_empty CHECK (char_length(trim(url)) > 0),
    CONSTRAINT valid_url CHECK (url ~* '^https?://')
);

-- Index for finding resources by note
CREATE INDEX idx_resources_note_id ON resources(note_id);

-- Index for user's resources (for RLS)
CREATE INDEX idx_resources_user_id ON resources(user_id);

-- Index for filtering by status
CREATE INDEX idx_resources_status ON resources(user_id, status);

-- Index for finding unread resources (common query)
CREATE INDEX idx_resources_unread ON resources(user_id, created_at DESC)
    WHERE status = 'unread';

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE TRIGGER resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Full-text search on resources
-- ============================================================================
-- Allow searching resources by title and description

ALTER TABLE resources ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(user_notes, '')), 'C')
    ) STORED;

CREATE INDEX idx_resources_search ON resources USING GIN(search_vector);

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE resources IS 'External links and references attached to notes';
COMMENT ON COLUMN resources.url IS 'Full URL of the external resource';
COMMENT ON COLUMN resources.title IS 'Page title (from og:title or <title>)';
COMMENT ON COLUMN resources.status IS 'Reading status: unread, reading, read, archived';
COMMENT ON COLUMN resources.rating IS 'User rating 1-5 stars';
COMMENT ON COLUMN resources.user_notes IS 'User annotations about this resource';
