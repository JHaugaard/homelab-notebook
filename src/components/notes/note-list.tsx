"use client";

import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import type { NoteWithTags, NoteMode } from "@/types/database";
import { deleteNote } from "@/lib/notes/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/*
 * Note List Component
 *
 * Displays a list of notes with their titles, tags, and metadata.
 * This is a Client Component because it needs:
 * - useState for managing the selected note
 * - useTransition for non-blocking delete operations
 * - Event handlers for user interactions
 *
 * Why "use client"?
 * - Server Components can't have state or event handlers
 * - The parent page fetches notes (Server Component)
 * - This component receives notes as props and handles interactions
 */

interface NoteListProps {
  notes: NoteWithTags[];
  onNoteSelect?: (note: NoteWithTags) => void;
  selectedNoteId?: string;
}

export function NoteList({
  notes,
  onNoteSelect,
  selectedNoteId,
}: NoteListProps) {
  const [, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (noteId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setDeletingId(noteId);
    startTransition(async () => {
      const result = await deleteNote(noteId);
      if (result.error) {
        console.error("Failed to delete:", result.error);
        alert("Failed to delete note: " + result.error);
      }
      setDeletingId(null);
    });
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          isDeleting={note.id === deletingId}
          onSelect={() => onNoteSelect?.(note)}
          onDelete={(e) => handleDelete(note.id, e)}
        />
      ))}
    </div>
  );
}

/*
 * Individual Note List Item
 */
interface NoteListItemProps {
  note: NoteWithTags;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

function NoteListItem({
  note,
  isSelected,
  isDeleting,
  onSelect,
  onDelete,
}: NoteListItemProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
      } ${isDeleting ? "opacity-50" : ""}`}
      onClick={onSelect}
    >
      <CardHeader className="py-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {/* Using <a> instead of Link for dynamic routes with typedRoutes */}
            <a
              href={`/notes/${note.id}`}
              className="block hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <CardTitle className="text-base font-medium truncate">
                {note.title}
              </CardTitle>
            </a>
            <CardDescription className="text-xs mt-1 flex items-center gap-2">
              <ModeBadge mode={note.mode} />
              <span className="text-gray-400">
                {formatDistanceToNow(new Date(note.updated_at), {
                  addSuffix: true,
                })}
              </span>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500 h-8 w-8 p-0"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <TrashIcon />
          </Button>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}

        {/* Content preview */}
        {note.content && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {note.content.substring(0, 150)}
            {note.content.length > 150 ? "..." : ""}
          </p>
        )}
      </CardHeader>
    </Card>
  );
}

/*
 * Mode Badge
 * Shows which mode the note belongs to (Research, Project, Reference)
 */
function ModeBadge({ mode }: { mode: NoteMode }) {
  const config = {
    research: { label: "Research", className: "bg-purple-100 text-purple-700" },
    project: { label: "Project", className: "bg-blue-100 text-blue-700" },
    reference: { label: "Reference", className: "bg-green-100 text-green-700" },
  };

  const { label, className } = config[mode];

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${className}`}
    >
      {label}
    </span>
  );
}

/*
 * Tag Badge
 * Shows a single tag with AI indicator if applicable
 */
function TagBadge({ tag }: { tag: { id: string; name: string; source: string } }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
      {tag.source === "ai" && (
        <span className="text-[8px] text-purple-500" title="AI-generated">
          AI
        </span>
      )}
      {tag.name}
    </span>
  );
}

/*
 * Trash Icon
 */
function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// Export for use in other components
export { ModeBadge, TagBadge };
