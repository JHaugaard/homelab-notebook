"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateTags } from "@/lib/ollama/tags";
import type {
  Note,
  NoteWithTags,
  UpdateNote,
  NoteMode,
  Tag,
} from "@/types/database";

/*
 * Note CRUD Server Actions
 *
 * These are the core database operations for notes. They run on the server
 * and can be called directly from client components or forms.
 *
 * Server Actions vs API Routes:
 * -----------------------------
 * Server Actions (used here):
 * - Simpler syntax: just add "use server" and export a function
 * - Built-in CSRF protection (no manual token handling)
 * - Full TypeScript inference between client and server
 * - Works seamlessly with React forms and useTransition
 * - Automatic request deduplication
 *
 * API Routes (alternative):
 * - Better for external consumers (mobile apps, webhooks)
 * - More control over HTTP response (headers, status codes)
 * - Needed for streaming responses or long-polling
 *
 * For our use case (internal app, React forms), Server Actions are cleaner.
 *
 * Pattern used:
 * - Each action returns { data, error } for consistent error handling
 * - revalidatePath() refreshes cached data after mutations
 * - getUser() check ensures the user is authenticated
 */

// ============================================================================
// Response Types
// ============================================================================

interface ActionResponse<T> {
  data: T | null;
  error: string | null;
}

// ============================================================================
// Helper: Get authenticated user or throw
// ============================================================================

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be logged in to perform this action");
  }

  return { supabase, user };
}

// ============================================================================
// CREATE: Create a new note
// ============================================================================

export interface CreateNoteInput {
  title: string;
  content?: string;
  mode?: NoteMode;
  projectId?: string;
  autoTag?: boolean; // Whether to auto-generate tags with AI
}

/*
 * Create a new note with optional AI auto-tagging
 *
 * The auto-tagging flow:
 * 1. Save the note to the database first (user sees immediate feedback)
 * 2. Generate tags asynchronously using Ollama
 * 3. Save the generated tags to the database
 *
 * Why save first, then tag?
 * - User gets immediate confirmation their note is saved
 * - Tag generation can take 2-5 seconds (Ollama processing)
 * - If tagging fails, the note is still saved
 */
export async function createNote(
  input: CreateNoteInput
): Promise<ActionResponse<NoteWithTags>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Insert the note
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title: input.title,
        content: input.content || null,
        mode: input.mode || "project",
        project_id: input.projectId || null,
      })
      .select()
      .single();

    if (noteError) {
      console.error("Failed to create note:", noteError);
      return { data: null, error: noteError.message };
    }

    // Auto-tag if enabled and there's content to analyze
    let tags: Tag[] = [];
    if (input.autoTag !== false && (input.content || input.title)) {
      tags = await generateAndSaveTags(
        supabase,
        user.id,
        note.id,
        input.content || "",
        input.title
      );
    }

    // Revalidate the notes list so it shows the new note
    revalidatePath("/notes");
    revalidatePath("/dashboard");

    return {
      data: { ...note, tags },
      error: null,
    };
  } catch (error) {
    console.error("createNote error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create note",
    };
  }
}

// ============================================================================
// READ: Get a single note by ID
// ============================================================================

export async function getNote(
  noteId: string
): Promise<ActionResponse<NoteWithTags>> {
  try {
    const { supabase } = await getAuthenticatedUser();

    // Fetch the note
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select()
      .eq("id", noteId)
      .single();

    if (noteError) {
      console.error("Failed to get note:", noteError);
      return { data: null, error: noteError.message };
    }

    // Fetch associated tags
    const tags = await getNoteTags(supabase, noteId);

    return {
      data: { ...note, tags },
      error: null,
    };
  } catch (error) {
    console.error("getNote error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to get note",
    };
  }
}

// ============================================================================
// READ: List notes with optional filters
// ============================================================================

export interface ListNotesInput {
  mode?: NoteMode;
  projectId?: string;
  tagIds?: string[];
  limit?: number;
  offset?: number;
  orderBy?: "created_at" | "updated_at";
  orderDirection?: "asc" | "desc";
}

export async function listNotes(
  input?: ListNotesInput
): Promise<ActionResponse<NoteWithTags[]>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Build query
    let query = supabase
      .from("notes")
      .select()
      .eq("user_id", user.id)
      .order(input?.orderBy || "updated_at", {
        ascending: input?.orderDirection === "asc",
      });

    // Apply filters
    if (input?.mode) {
      query = query.eq("mode", input.mode);
    }

    if (input?.projectId) {
      query = query.eq("project_id", input.projectId);
    }

    // Apply pagination
    if (input?.limit) {
      query = query.limit(input.limit);
    }

    if (input?.offset) {
      query = query.range(input.offset, input.offset + (input.limit || 20) - 1);
    }

    const { data: notes, error: notesError } = await query;

    if (notesError) {
      console.error("Failed to list notes:", notesError);
      return { data: null, error: notesError.message };
    }

    // Fetch tags for all notes in a single query (more efficient)
    const notesWithTags = await addTagsToNotes(supabase, notes);

    // If filtering by tags, filter in-memory after fetching
    // (Supabase doesn't support filtering by junction table easily)
    if (input?.tagIds && input.tagIds.length > 0) {
      const filtered = notesWithTags.filter((note) =>
        note.tags.some((tag) => input.tagIds!.includes(tag.id))
      );
      return { data: filtered, error: null };
    }

    return { data: notesWithTags, error: null };
  } catch (error) {
    console.error("listNotes error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to list notes",
    };
  }
}

// ============================================================================
// UPDATE: Update an existing note
// ============================================================================

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  mode?: NoteMode;
  projectId?: string | null;
  autoTag?: boolean; // Re-generate tags based on new content
}

export async function updateNote(
  input: UpdateNoteInput
): Promise<ActionResponse<NoteWithTags>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Build update object (only include provided fields)
    const updates: UpdateNote = {};
    if (input.title !== undefined) updates.title = input.title;
    if (input.content !== undefined) updates.content = input.content;
    if (input.mode !== undefined) updates.mode = input.mode;
    if (input.projectId !== undefined) updates.project_id = input.projectId;

    // Update the note
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", input.id)
      .eq("user_id", user.id) // Ensure user owns the note
      .select()
      .single();

    if (noteError) {
      console.error("Failed to update note:", noteError);
      return { data: null, error: noteError.message };
    }

    // Re-generate tags if requested
    let tags: Tag[] = [];
    if (input.autoTag && (input.content || input.title)) {
      // Remove existing AI-generated tags first
      await supabase
        .from("note_tags")
        .delete()
        .eq("note_id", input.id)
        .in(
          "tag_id",
          (
            await supabase
              .from("tags")
              .select("id")
              .eq("user_id", user.id)
              .eq("source", "ai")
          ).data?.map((t) => t.id) || []
        );

      // Generate new tags
      tags = await generateAndSaveTags(
        supabase,
        user.id,
        note.id,
        input.content || note.content || "",
        input.title || note.title
      );
    } else {
      // Just fetch existing tags
      tags = await getNoteTags(supabase, note.id);
    }

    // Revalidate paths
    revalidatePath("/notes");
    revalidatePath(`/notes/${input.id}`);
    revalidatePath("/dashboard");

    return {
      data: { ...note, tags },
      error: null,
    };
  } catch (error) {
    console.error("updateNote error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update note",
    };
  }
}

// ============================================================================
// DELETE: Delete a note
// ============================================================================

export async function deleteNote(
  noteId: string
): Promise<ActionResponse<{ id: string }>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Note: Junction table entries (note_tags) are deleted automatically
    // via ON DELETE CASCADE in the database schema

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", user.id); // Ensure user owns the note

    if (error) {
      console.error("Failed to delete note:", error);
      return { data: null, error: error.message };
    }

    // Revalidate paths
    revalidatePath("/notes");
    revalidatePath("/dashboard");

    return { data: { id: noteId }, error: null };
  } catch (error) {
    console.error("deleteNote error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete note",
    };
  }
}

// ============================================================================
// TAG OPERATIONS
// ============================================================================

/*
 * Add a tag to a note
 *
 * This handles the case where the tag already exists (reuse it)
 * or needs to be created (create and link it).
 */
export async function addTagToNote(
  noteId: string,
  tagName: string
): Promise<ActionResponse<Tag>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Normalize the tag name
    const normalizedName = tagName.toLowerCase().trim().replace(/\s+/g, "-");

    // Try to find existing tag
    let { data: existingTag } = await supabase
      .from("tags")
      .select()
      .eq("user_id", user.id)
      .eq("normalized_name", normalizedName)
      .single();

    // Create tag if it doesn't exist
    if (!existingTag) {
      const { data: newTag, error: tagError } = await supabase
        .from("tags")
        .insert({
          user_id: user.id,
          name: tagName.trim(),
          normalized_name: normalizedName,
          source: "user",
        })
        .select()
        .single();

      if (tagError) {
        console.error("Failed to create tag:", tagError);
        return { data: null, error: tagError.message };
      }
      existingTag = newTag;
    }

    // Link tag to note (ignore if already linked)
    await supabase.from("note_tags").upsert(
      {
        note_id: noteId,
        tag_id: existingTag.id,
      },
      { onConflict: "note_id,tag_id" }
    );

    revalidatePath(`/notes/${noteId}`);
    revalidatePath("/notes");

    return { data: existingTag, error: null };
  } catch (error) {
    console.error("addTagToNote error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to add tag",
    };
  }
}

/*
 * Remove a tag from a note
 */
export async function removeTagFromNote(
  noteId: string,
  tagId: string
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const { supabase } = await getAuthenticatedUser();

    const { error } = await supabase
      .from("note_tags")
      .delete()
      .eq("note_id", noteId)
      .eq("tag_id", tagId);

    if (error) {
      console.error("Failed to remove tag:", error);
      return { data: null, error: error.message };
    }

    revalidatePath(`/notes/${noteId}`);
    revalidatePath("/notes");

    return { data: { success: true }, error: null };
  } catch (error) {
    console.error("removeTagFromNote error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to remove tag",
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/*
 * Generate tags using Ollama and save them to the database
 */
async function generateAndSaveTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  noteId: string,
  content: string,
  title: string
): Promise<Tag[]> {
  try {
    // Generate tags using AI
    const result = await generateTags(content, title);

    if (result.tags.length === 0) {
      return [];
    }

    const savedTags: Tag[] = [];

    for (const tagName of result.tags) {
      const normalizedName = tagName.toLowerCase().trim().replace(/\s+/g, "-");

      // Find or create tag
      let { data: existingTag } = await supabase
        .from("tags")
        .select()
        .eq("user_id", userId)
        .eq("normalized_name", normalizedName)
        .single();

      if (!existingTag) {
        const { data: newTag, error } = await supabase
          .from("tags")
          .insert({
            user_id: userId,
            name: tagName,
            normalized_name: normalizedName,
            source: "ai",
          })
          .select()
          .single();

        if (!error && newTag) {
          existingTag = newTag;
        }
      }

      if (existingTag) {
        // Link to note
        await supabase.from("note_tags").upsert(
          {
            note_id: noteId,
            tag_id: existingTag.id,
          },
          { onConflict: "note_id,tag_id" }
        );

        savedTags.push(existingTag);
      }
    }

    return savedTags;
  } catch (error) {
    console.error("Failed to generate and save tags:", error);
    return []; // Fail silently - tags are optional
  }
}

/*
 * Get tags for a single note
 */
async function getNoteTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  noteId: string
): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("note_tags")
    .select("tag_id, tags(*)")
    .eq("note_id", noteId);

  if (error || !data) return [];

  return data
    .map((nt) => nt.tags as unknown as Tag)
    .filter((tag): tag is Tag => tag !== null);
}

/*
 * Add tags to multiple notes efficiently
 *
 * This uses a single query to get all tags for all notes,
 * then distributes them in memory. Much faster than N+1 queries.
 */
async function addTagsToNotes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  notes: Note[]
): Promise<NoteWithTags[]> {
  if (notes.length === 0) return [];

  const noteIds = notes.map((n) => n.id);

  // Get all note_tags for these notes in one query
  const { data: noteTags, error } = await supabase
    .from("note_tags")
    .select("note_id, tag_id, tags(*)")
    .in("note_id", noteIds);

  if (error || !noteTags) {
    // Return notes without tags on error
    return notes.map((note) => ({ ...note, tags: [] }));
  }

  // Group tags by note_id
  const tagsByNoteId = new Map<string, Tag[]>();
  for (const nt of noteTags) {
    const tag = nt.tags as unknown as Tag;
    if (!tag) continue;

    const existing = tagsByNoteId.get(nt.note_id) || [];
    existing.push(tag);
    tagsByNoteId.set(nt.note_id, existing);
  }

  // Merge tags into notes
  return notes.map((note) => ({
    ...note,
    tags: tagsByNoteId.get(note.id) || [],
  }));
}
