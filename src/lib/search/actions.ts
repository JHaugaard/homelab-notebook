"use server";

import { createClient } from "@/lib/supabase/server";
import type { NoteMode, SearchResult, Tag } from "@/types/database";

/*
 * Search Server Actions
 *
 * These actions wrap the PostgreSQL search functions defined in migration 00007.
 * They use Supabase's .rpc() method to call database functions.
 *
 * How PostgreSQL Full-Text Search Works:
 * ======================================
 *
 * 1. TSVECTOR: PostgreSQL converts text into a "tsvector" - a sorted list of
 *    normalized words (lexemes). For example:
 *    "The quick brown fox" -> 'brown':3 'fox':4 'quick':2
 *
 * 2. TSQUERY: Your search query is converted to a "tsquery" format:
 *    "quick fox" -> 'quick' & 'fox'
 *
 * 3. MATCHING: The @@ operator checks if a tsvector matches a tsquery.
 *    The search_vector column is pre-computed on INSERT/UPDATE via a trigger.
 *
 * 4. RANKING: ts_rank() scores how well a document matches the query.
 *    Higher rank = more relevant match.
 *
 * 5. HEADLINES: ts_headline() generates a snippet with matching terms highlighted.
 *    We use <mark> tags for highlighting.
 *
 * Benefits over ILIKE:
 * - Much faster (uses GIN index)
 * - Understands word stems ("running" matches "run")
 * - Handles stop words ("the", "a", "is")
 * - Supports complex queries ("cat OR dog", "cat AND NOT dog")
 * - Provides relevance ranking
 *
 * We also use pg_trgm (trigram matching) for fuzzy search on titles,
 * which catches typos like "postgrsql" matching "postgresql".
 */

// ============================================================================
// Response Types
// ============================================================================

interface ActionResponse<T> {
  data: T | null;
  error: string | null;
}

// ============================================================================
// Helper: Get authenticated user
// ============================================================================

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be logged in to search");
  }

  return { supabase, user };
}

// ============================================================================
// Full-Text Search
// ============================================================================

export interface SearchNotesInput {
  query: string;
  mode?: NoteMode;
  projectId?: string;
  tagIds?: string[];
  limit?: number;
  offset?: number;
}

/*
 * Search notes with full-text search and optional filters
 *
 * This calls the search_notes() PostgreSQL function which:
 * - Uses websearch_to_tsquery() to parse natural language queries
 * - Filters by mode, project, and tags
 * - Returns results ranked by relevance
 * - Generates highlighted snippets
 *
 * Example queries that work:
 * - "docker container" - finds notes with both words
 * - "docker OR kubernetes" - finds notes with either word
 * - "docker -swarm" - finds docker notes but not swarm
 * - "next.js" - handles punctuation in tech terms
 */
export async function searchNotes(
  input: SearchNotesInput
): Promise<ActionResponse<SearchResult[]>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Don't search if query is too short
    if (!input.query || input.query.trim().length < 2) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase.rpc("search_notes", {
      p_user_id: user.id,
      p_query: input.query.trim(),
      p_mode: input.mode || null,
      p_project_id: input.projectId || null,
      p_tag_ids: input.tagIds || null,
      p_limit: input.limit || 20,
      p_offset: input.offset || 0,
    });

    if (error) {
      console.error("Search error:", error);
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("searchNotes error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Search failed",
    };
  }
}

// ============================================================================
// Quick Search (for autocomplete/command palette)
// ============================================================================

export interface QuickSearchResult {
  id: string;
  title: string;
  mode: NoteMode;
  updated_at: string;
}

/*
 * Fast search for autocomplete and command palette
 *
 * This is optimized for speed:
 * - Returns only essential fields (id, title, mode, updated_at)
 * - Limits results to 10 by default
 * - Uses both full-text search AND ILIKE for title prefix matching
 *
 * The dual approach ensures:
 * - "post" matches "PostgreSQL" (prefix match)
 * - "database" matches notes about databases (full-text)
 */
export async function quickSearch(
  query: string
): Promise<ActionResponse<QuickSearchResult[]>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    if (!query || query.trim().length < 2) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase.rpc("quick_search_notes", {
      p_user_id: user.id,
      p_query: query.trim(),
      p_limit: 10,
    });

    if (error) {
      console.error("Quick search error:", error);
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("quickSearch error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Search failed",
    };
  }
}

// ============================================================================
// Tag Search (for autocomplete)
// ============================================================================

export interface TagSearchResult {
  id: string;
  name: string;
  normalized_name: string;
  usage_count: number;
  similarity: number;
}

/*
 * Search tags with fuzzy matching
 *
 * Uses pg_trgm (trigram similarity) to find tags even with typos.
 * For example, "javscript" will still match "javascript".
 *
 * Results are ordered by:
 * 1. Exact prefix matches first
 * 2. Then by usage count (popular tags first)
 * 3. Then by similarity score
 */
export async function searchTags(
  query: string
): Promise<ActionResponse<TagSearchResult[]>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    if (!query || query.trim().length < 1) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase.rpc("search_tags", {
      p_user_id: user.id,
      p_query: query.trim(),
      p_limit: 10,
    });

    if (error) {
      console.error("Tag search error:", error);
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("searchTags error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Search failed",
    };
  }
}

// ============================================================================
// Get Popular Tags (for suggestions)
// ============================================================================

/*
 * Get the user's most frequently used tags
 *
 * Useful for tag suggestions when creating notes or filtering.
 */
export async function getPopularTags(
  limit: number = 10
): Promise<ActionResponse<Tag[]>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("tags")
      .select()
      .eq("user_id", user.id)
      .order("usage_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Get popular tags error:", error);
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("getPopularTags error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to get tags",
    };
  }
}
