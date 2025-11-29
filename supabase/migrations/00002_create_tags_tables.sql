-- ============================================================================
-- Migration: Create Tags and Note-Tags Junction Table
-- ============================================================================
-- Tags are used for categorizing notes by technology, topic, etc.
-- AI-generated tags are stored here alongside user-created tags.
--
-- Design Decisions:
-- 1. Separate tags table: Enables tag reuse, autocomplete, and normalization
-- 2. normalized_name: Lowercase, trimmed version for deduplication
-- 3. Junction table (note_tags): Many-to-many relationship
-- 4. user_id on tags: Tags are per-user, not global
-- 5. source field: Track if tag was AI-generated or user-created
-- ============================================================================

-- Create enum for tag source
CREATE TYPE tag_source AS ENUM ('ai', 'user');

-- Create the tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Owner of the tag
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Tag name as displayed (preserves casing)
    name TEXT NOT NULL,

    -- Normalized name for deduplication (lowercase, trimmed)
    normalized_name TEXT NOT NULL,

    -- Track origin of the tag
    source tag_source NOT NULL DEFAULT 'user',

    -- Usage count (denormalized for performance)
    -- Updated via trigger when notes are tagged/untagged
    usage_count INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    -- Unique per user: same user can't have duplicate normalized tags
    CONSTRAINT unique_user_tag UNIQUE (user_id, normalized_name),
    CONSTRAINT name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT normalized_name_not_empty CHECK (char_length(normalized_name) > 0)
);

-- Index for user's tags (autocomplete, listing)
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Index for finding tags by normalized name (deduplication)
CREATE INDEX idx_tags_normalized ON tags(user_id, normalized_name);

-- Index for sorting by usage (popular tags first)
CREATE INDEX idx_tags_usage ON tags(user_id, usage_count DESC);

-- ============================================================================
-- Note-Tags Junction Table
-- ============================================================================
-- Links notes to tags (many-to-many relationship)

CREATE TABLE note_tags (
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,

    -- When was this tag applied
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Composite primary key
    PRIMARY KEY (note_id, tag_id)
);

-- Index for finding all tags for a note
CREATE INDEX idx_note_tags_note ON note_tags(note_id);

-- Index for finding all notes with a specific tag
CREATE INDEX idx_note_tags_tag ON note_tags(tag_id);

-- ============================================================================
-- Trigger to update tag usage_count
-- ============================================================================
-- Keeps usage_count in sync when tags are added/removed from notes

CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER note_tags_usage_count
    AFTER INSERT OR DELETE ON note_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_usage_count();

-- ============================================================================
-- Helper function for tag normalization
-- ============================================================================
-- Use this when inserting/updating tags to ensure consistent normalization

CREATE OR REPLACE FUNCTION normalize_tag_name(tag_name TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Lowercase, trim whitespace, replace spaces with hyphens
    RETURN lower(trim(regexp_replace(tag_name, '\s+', '-', 'g')));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE tags IS 'Technology tags for categorizing notes';
COMMENT ON COLUMN tags.normalized_name IS 'Lowercase, hyphenated version of name for deduplication';
COMMENT ON COLUMN tags.source IS 'Whether tag was created by AI auto-tagging or user';
COMMENT ON COLUMN tags.usage_count IS 'Denormalized count of notes using this tag';
COMMENT ON TABLE note_tags IS 'Junction table linking notes to their tags (many-to-many)';
