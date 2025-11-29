-- ============================================================================
-- Migration: Row Level Security (RLS) Policies
-- ============================================================================
-- RLS ensures users can only access their own data.
-- Even if someone has the anon key and knows table structure,
-- they can only read/write rows where user_id matches their auth.uid().
--
-- Why RLS is Essential:
-- 1. Defense in depth: Even if app code has bugs, data is protected
-- 2. Works at database level: Applies to all access paths
-- 3. Supabase requires it: Without RLS, tables are inaccessible by default
--
-- Policy Naming Convention:
-- - select_own: User can SELECT their own rows
-- - insert_own: User can INSERT with their user_id
-- - update_own: User can UPDATE their own rows
-- - delete_own: User can DELETE their own rows
-- ============================================================================

-- ============================================================================
-- Notes Table Policies
-- ============================================================================

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Users can read their own notes
CREATE POLICY notes_select_own ON notes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create notes (must set user_id to their own)
CREATE POLICY notes_insert_own ON notes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY notes_update_own ON notes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY notes_delete_own ON notes
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Tags Table Policies
-- ============================================================================

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY tags_select_own ON tags
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY tags_insert_own ON tags
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY tags_update_own ON tags
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY tags_delete_own ON tags
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Note-Tags Junction Table Policies
-- ============================================================================
-- Junction table needs policies that check BOTH related tables

ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Users can see note-tag relationships for their notes
CREATE POLICY note_tags_select_own ON note_tags
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = note_tags.note_id
            AND notes.user_id = auth.uid()
        )
    );

-- Users can create note-tag relationships for their notes and tags
CREATE POLICY note_tags_insert_own ON note_tags
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = note_tags.note_id
            AND notes.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM tags
            WHERE tags.id = note_tags.tag_id
            AND tags.user_id = auth.uid()
        )
    );

-- Users can delete note-tag relationships for their notes
CREATE POLICY note_tags_delete_own ON note_tags
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = note_tags.note_id
            AND notes.user_id = auth.uid()
        )
    );

-- ============================================================================
-- Projects Table Policies
-- ============================================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_select_own ON projects
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY projects_insert_own ON projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY projects_update_own ON projects
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY projects_delete_own ON projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Note-Projects Junction Table Policies
-- ============================================================================

ALTER TABLE note_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY note_projects_select_own ON note_projects
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = note_projects.note_id
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY note_projects_insert_own ON note_projects
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = note_projects.note_id
            AND notes.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = note_projects.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY note_projects_delete_own ON note_projects
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = note_projects.note_id
            AND notes.user_id = auth.uid()
        )
    );

-- ============================================================================
-- Resources Table Policies
-- ============================================================================

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY resources_select_own ON resources
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY resources_insert_own ON resources
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY resources_update_own ON resources
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY resources_delete_own ON resources
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Files Table Policies
-- ============================================================================

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY files_select_own ON files
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY files_insert_own ON files
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Files are immutable (no update policy - delete and re-upload instead)

CREATE POLICY files_delete_own ON files
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON POLICY notes_select_own ON notes IS 'Users can only read their own notes';
COMMENT ON POLICY notes_insert_own ON notes IS 'Users must set user_id to their own ID when creating notes';
COMMENT ON POLICY note_tags_insert_own ON note_tags IS 'Users can only link their own notes to their own tags';
