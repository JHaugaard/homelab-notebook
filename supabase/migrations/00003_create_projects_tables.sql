-- ============================================================================
-- Migration: Create Projects and Note-Projects Junction Table
-- ============================================================================
-- Projects group related notes together, especially useful for:
-- - Multi-session lab work
-- - Ongoing learning topics
-- - Reference documentation collections
--
-- Design Decisions:
-- 1. Projects can contain notes of any mode (research, project, reference)
-- 2. A note can belong to multiple projects (junction table)
-- 3. Projects have status for tracking progress
-- 4. Projects can have a description for context
-- ============================================================================

-- Create enum for project status
CREATE TYPE project_status AS ENUM ('active', 'paused', 'completed', 'archived');

-- Create the projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Owner of the project
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Project details
    name TEXT NOT NULL,
    description TEXT, -- Optional longer description

    -- Status tracking
    status project_status NOT NULL DEFAULT 'active',

    -- Optional: Target completion date
    target_date DATE,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT project_name_not_empty CHECK (char_length(trim(name)) > 0)
);

-- Index for user's projects
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Index for filtering by status
CREATE INDEX idx_projects_status ON projects(user_id, status);

-- Index for sorting by update time
CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC);

-- ============================================================================
-- Note-Projects Junction Table
-- ============================================================================
-- Links notes to projects (many-to-many relationship)
-- A note can be part of multiple projects

CREATE TABLE note_projects (
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

    -- When was this note added to the project
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Optional: Note's role/category within the project
    -- e.g., "research", "implementation", "documentation"
    role TEXT,

    -- Composite primary key
    PRIMARY KEY (note_id, project_id)
);

-- Index for finding all projects a note belongs to
CREATE INDEX idx_note_projects_note ON note_projects(note_id);

-- Index for finding all notes in a project
CREATE INDEX idx_note_projects_project ON note_projects(project_id);

-- ============================================================================
-- Add project_id to notes table (optional direct link)
-- ============================================================================
-- For "project mode" notes, we can have a primary project association
-- This is in addition to the many-to-many relationship

ALTER TABLE notes ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Index for finding notes by primary project
CREATE INDEX idx_notes_project_id ON notes(project_id);

-- ============================================================================
-- Trigger for projects.updated_at
-- ============================================================================

CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE projects IS 'Groups related notes for multi-session work and learning topics';
COMMENT ON COLUMN projects.status IS 'Project lifecycle: active, paused, completed, archived';
COMMENT ON TABLE note_projects IS 'Junction table linking notes to projects (many-to-many)';
COMMENT ON COLUMN note_projects.role IS 'Optional categorization of note within project (research, implementation, etc.)';
COMMENT ON COLUMN notes.project_id IS 'Primary project for project-mode notes (optional)';
