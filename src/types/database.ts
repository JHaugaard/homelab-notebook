/*
 * Supabase Database Types
 *
 * This file contains TypeScript types that match your Supabase database schema.
 * These types enable autocomplete and type-checking when querying the database.
 *
 * How to generate these types automatically:
 *
 * 1. Install the Supabase CLI:
 *    pnpm add -D supabase
 *
 * 2. Login to Supabase:
 *    npx supabase login
 *
 * 3. Generate types from your remote database:
 *    npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 *
 * For now, this is a placeholder. After creating the database schema in Step 5,
 * you'll regenerate this file with the actual types.
 *
 * Usage with Supabase client:
 * - The createClient() functions are already typed with Database
 * - This gives you autocomplete: supabase.from("notes").select() knows the columns
 * - TypeScript will catch typos: supabase.from("notess") // Error!
 */

export interface Database {
  public: {
    Tables: {
      /*
       * Notes Table (placeholder)
       * Will be populated after running migrations in Step 5
       */
      notes: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          mode: "research" | "project" | "reference";
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string | null;
          mode: "research" | "project" | "reference";
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string | null;
          mode?: "research" | "project" | "reference";
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      /*
       * Tags Table (placeholder)
       */
      tags: {
        Row: {
          id: string;
          name: string;
          normalized_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          normalized_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          normalized_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      /*
       * Note-Tags Junction Table (placeholder)
       */
      note_tags: {
        Row: {
          note_id: string;
          tag_id: string;
        };
        Insert: {
          note_id: string;
          tag_id: string;
        };
        Update: {
          note_id?: string;
          tag_id?: string;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/*
 * Convenience type aliases
 * These make it easier to type function parameters and return values
 */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Specific table types for common use
export type Note = Tables<"notes">;
export type Tag = Tables<"tags">;
export type NoteTag = Tables<"note_tags">;
