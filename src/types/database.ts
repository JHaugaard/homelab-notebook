/*
 * Supabase Database Types
 *
 * These types match your Supabase database schema.
 * They enable autocomplete and type-checking when querying the database.
 *
 * IMPORTANT: After running migrations, regenerate these types:
 *
 * 1. Install Supabase CLI: pnpm add -D supabase
 * 2. Login: npx supabase login
 * 3. Generate types:
 *    npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 *
 * For now, these are manually defined to match the migration files.
 */

// ============================================================================
// Enum Types
// ============================================================================

export type NoteMode = "research" | "project" | "reference";
export type TagSource = "ai" | "user";
export type ProjectStatus = "active" | "paused" | "completed" | "archived";
export type ResourceStatus = "unread" | "reading" | "read" | "archived";
export type StorageProvider = "supabase" | "b2";

// ============================================================================
// Database Schema
// ============================================================================

export interface Database {
  public: {
    Tables: {
      // Notes Table
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string | null;
          mode: NoteMode;
          project_id: string | null;
          created_at: string;
          updated_at: string;
          search_vector: unknown; // tsvector type
        };
        Insert: {
          id?: string;
          user_id?: string; // Defaults to auth.uid() in RLS
          title: string;
          content?: string | null;
          mode?: NoteMode;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string | null;
          mode?: NoteMode;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notes_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };

      // Tags Table
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          normalized_name: string;
          source: TagSource;
          usage_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          normalized_name: string;
          source?: TagSource;
          usage_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          normalized_name?: string;
          source?: TagSource;
          usage_count?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // Note-Tags Junction Table
      note_tags: {
        Row: {
          note_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          note_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          note_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "note_tags_note_id_fkey";
            columns: ["note_id"];
            referencedRelation: "notes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "note_tags_tag_id_fkey";
            columns: ["tag_id"];
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };

      // Projects Table
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: ProjectStatus;
          target_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          description?: string | null;
          status?: ProjectStatus;
          target_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: ProjectStatus;
          target_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // Note-Projects Junction Table
      note_projects: {
        Row: {
          note_id: string;
          project_id: string;
          created_at: string;
          role: string | null;
        };
        Insert: {
          note_id: string;
          project_id: string;
          created_at?: string;
          role?: string | null;
        };
        Update: {
          note_id?: string;
          project_id?: string;
          created_at?: string;
          role?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "note_projects_note_id_fkey";
            columns: ["note_id"];
            referencedRelation: "notes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "note_projects_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };

      // Resources Table
      resources: {
        Row: {
          id: string;
          note_id: string;
          user_id: string;
          url: string;
          title: string | null;
          description: string | null;
          favicon_url: string | null;
          image_url: string | null;
          status: ResourceStatus;
          rating: number | null;
          user_notes: string | null;
          created_at: string;
          updated_at: string;
          search_vector: unknown;
        };
        Insert: {
          id?: string;
          note_id: string;
          user_id?: string;
          url: string;
          title?: string | null;
          description?: string | null;
          favicon_url?: string | null;
          image_url?: string | null;
          status?: ResourceStatus;
          rating?: number | null;
          user_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          user_id?: string;
          url?: string;
          title?: string | null;
          description?: string | null;
          favicon_url?: string | null;
          image_url?: string | null;
          status?: ResourceStatus;
          rating?: number | null;
          user_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "resources_note_id_fkey";
            columns: ["note_id"];
            referencedRelation: "notes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "resources_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // Files Table
      files: {
        Row: {
          id: string;
          note_id: string;
          user_id: string;
          filename: string;
          mime_type: string;
          size_bytes: number;
          storage_provider: StorageProvider;
          storage_path: string;
          storage_bucket: string;
          thumbnail_url: string | null;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          user_id?: string;
          filename: string;
          mime_type: string;
          size_bytes: number;
          storage_provider?: StorageProvider;
          storage_path: string;
          storage_bucket?: string;
          thumbnail_url?: string | null;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          user_id?: string;
          filename?: string;
          mime_type?: string;
          size_bytes?: number;
          storage_provider?: StorageProvider;
          storage_path?: string;
          storage_bucket?: string;
          thumbnail_url?: string | null;
          alt_text?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "files_note_id_fkey";
            columns: ["note_id"];
            referencedRelation: "notes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "files_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: Record<string, never>;

    Functions: {
      search_notes: {
        Args: {
          p_user_id: string;
          p_query: string;
          p_mode?: NoteMode | null;
          p_project_id?: string | null;
          p_tag_ids?: string[] | null;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          id: string;
          title: string;
          content: string | null;
          mode: NoteMode;
          project_id: string | null;
          created_at: string;
          updated_at: string;
          rank: number;
          headline: string;
        }[];
      };
      quick_search_notes: {
        Args: {
          p_user_id: string;
          p_query: string;
          p_limit?: number;
        };
        Returns: {
          id: string;
          title: string;
          mode: NoteMode;
          updated_at: string;
        }[];
      };
      search_tags: {
        Args: {
          p_user_id: string;
          p_query: string;
          p_limit?: number;
        };
        Returns: {
          id: string;
          name: string;
          normalized_name: string;
          usage_count: number;
          similarity: number;
        }[];
      };
      normalize_tag_name: {
        Args: { tag_name: string };
        Returns: string;
      };
      get_user_storage_bytes: {
        Args: { p_user_id: string };
        Returns: number;
      };
    };

    Enums: {
      note_mode: NoteMode;
      tag_source: TagSource;
      project_status: ProjectStatus;
      resource_status: ResourceStatus;
      storage_provider: StorageProvider;
    };

    CompositeTypes: Record<string, never>;
  };
}

// ============================================================================
// Convenience Type Aliases
// ============================================================================

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Table row types
export type Note = Tables<"notes">;
export type Tag = Tables<"tags">;
export type NoteTag = Tables<"note_tags">;
export type Project = Tables<"projects">;
export type NoteProject = Tables<"note_projects">;
export type Resource = Tables<"resources">;
export type File = Tables<"files">;

// Insert types
export type InsertNote = InsertTables<"notes">;
export type InsertTag = InsertTables<"tags">;
export type InsertProject = InsertTables<"projects">;
export type InsertResource = InsertTables<"resources">;
export type InsertFile = InsertTables<"files">;

// Update types
export type UpdateNote = UpdateTables<"notes">;
export type UpdateTag = UpdateTables<"tags">;
export type UpdateProject = UpdateTables<"projects">;
export type UpdateResource = UpdateTables<"resources">;

// ============================================================================
// Extended Types (with relationships)
// ============================================================================

export interface NoteWithTags extends Note {
  tags: Tag[];
}

export interface NoteWithRelations extends Note {
  tags: Tag[];
  project: Project | null;
  resources: Resource[];
  files: File[];
}

export interface ProjectWithNotes extends Project {
  notes: Note[];
  note_count: number;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string | null;
  mode: NoteMode;
  project_id: string | null;
  created_at: string;
  updated_at: string;
  rank: number;
  headline: string;
}
