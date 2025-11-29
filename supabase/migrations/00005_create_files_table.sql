-- ============================================================================
-- Migration: Create Files Table
-- ============================================================================
-- Files track uploaded attachments associated with notes.
-- Actual file storage is handled by Supabase Storage or Backblaze B2.
-- This table stores metadata and references.
--
-- Design Decisions:
-- 1. Files belong to a note (not standalone)
-- 2. storage_provider tracks where file is stored (supabase vs b2)
-- 3. storage_path is the path/key in the storage bucket
-- 4. Store metadata for display (filename, mime_type, size)
-- 5. Optional thumbnail_url for images
-- ============================================================================

-- Create enum for storage provider
CREATE TYPE storage_provider AS ENUM ('supabase', 'b2');

-- Create the files table
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parent note (required)
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,

    -- Owner (denormalized from note for RLS performance)
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Original filename (as uploaded)
    filename TEXT NOT NULL,

    -- MIME type (e.g., "image/png", "application/pdf")
    mime_type TEXT NOT NULL,

    -- File size in bytes
    size_bytes BIGINT NOT NULL,

    -- Storage location
    storage_provider storage_provider NOT NULL DEFAULT 'supabase',
    storage_path TEXT NOT NULL, -- Path within the bucket
    storage_bucket TEXT NOT NULL DEFAULT 'attachments', -- Bucket name

    -- Optional thumbnail for images
    thumbnail_url TEXT,

    -- Optional alt text for accessibility
    alt_text TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT filename_not_empty CHECK (char_length(trim(filename)) > 0),
    CONSTRAINT storage_path_not_empty CHECK (char_length(trim(storage_path)) > 0),
    CONSTRAINT positive_size CHECK (size_bytes > 0)
);

-- Index for finding files by note
CREATE INDEX idx_files_note_id ON files(note_id);

-- Index for user's files (for RLS and quotas)
CREATE INDEX idx_files_user_id ON files(user_id);

-- Index for finding files by storage provider
CREATE INDEX idx_files_storage ON files(storage_provider, storage_path);

-- ============================================================================
-- Helper function to calculate user's storage usage
-- ============================================================================
-- Useful for implementing storage quotas

CREATE OR REPLACE FUNCTION get_user_storage_bytes(p_user_id UUID)
RETURNS BIGINT AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(size_bytes) FROM files WHERE user_id = p_user_id),
        0
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE files IS 'Metadata for file attachments stored in Supabase Storage or B2';
COMMENT ON COLUMN files.storage_provider IS 'Where the file is stored: supabase or b2';
COMMENT ON COLUMN files.storage_path IS 'Path/key within the storage bucket';
COMMENT ON COLUMN files.storage_bucket IS 'Name of the storage bucket';
COMMENT ON COLUMN files.thumbnail_url IS 'URL to thumbnail for image files';
