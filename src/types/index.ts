/*
 * Type Definitions
 *
 * This file exports TypeScript types used throughout the application.
 * Centralizing types here makes them easy to import and maintain.
 *
 * Usage: import type { Note, Tag } from '@/types'
 *
 * These are placeholder types that will be expanded as we build
 * the database schema and API.
 */

// Note mode types
export type NoteMode = "research" | "project" | "reference";

// Base note structure (will match database schema)
export interface Note {
  id: string;
  title: string;
  content: string;
  mode: NoteMode;
  createdAt: Date;
  updatedAt: Date;
}

// Tag structure
export interface Tag {
  id: string;
  name: string;
  normalizedName: string;
}

// Note with tags (joined data)
export interface NoteWithTags extends Note {
  tags: Tag[];
}

// Search result
export interface SearchResult {
  note: Note;
  score: number;
  highlightedContent?: string;
}
