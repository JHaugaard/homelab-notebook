"use client";

import { useState, useTransition, useCallback } from "react";
import type { NoteWithTags, NoteMode } from "@/types/database";
import {
  createNote,
  updateNote,
  addTagToNote,
  removeTagFromNote,
} from "@/lib/notes/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/*
 * Note Editor Component
 *
 * A form for creating and editing notes. Supports:
 * - Title and content editing
 * - Mode selection (Research, Project, Reference)
 * - Tag management (add/remove)
 * - AI auto-tagging on save
 *
 * This is a Client Component because it needs:
 * - Form state management (useState)
 * - useTransition for non-blocking saves
 * - Event handlers for user interactions
 *
 * Form Pattern:
 * - Uncontrolled inputs with defaultValue for performance
 * - Controlled state only for dynamic UI (tags, mode)
 * - useTransition keeps UI responsive during save
 */

interface NoteEditorProps {
  note?: NoteWithTags; // Existing note for editing, undefined for new note
  onSave?: (note: NoteWithTags) => void;
  onCancel?: () => void;
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [mode, setMode] = useState<NoteMode>(note?.mode || "project");
  const [tags, setTags] = useState(note?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [autoTag, setAutoTag] = useState(true);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const content = formData.get("content") as string;

      if (!title.trim()) {
        setError("Title is required");
        return;
      }

      startTransition(async () => {
        if (note) {
          // Update existing note
          const result = await updateNote({
            id: note.id,
            title,
            content,
            mode,
            autoTag,
          });

          if (result.error) {
            setError(result.error);
          } else if (result.data) {
            setTags(result.data.tags);
            onSave?.(result.data);
          }
        } else {
          // Create new note
          const result = await createNote({
            title,
            content,
            mode,
            autoTag,
          });

          if (result.error) {
            setError(result.error);
          } else if (result.data) {
            onSave?.(result.data);
            // Use window.location for navigation to bypass typedRoutes
            window.location.href = `/notes/${result.data.id}`;
          }
        }
      });
    },
    [note, mode, autoTag, onSave]
  );

  const handleAddTag = useCallback(async () => {
    if (!note || !newTag.trim()) return;

    startTransition(async () => {
      const result = await addTagToNote(note.id, newTag.trim());
      if (result.data) {
        setTags((prev) => [...prev, result.data!]);
        setNewTag("");
      } else if (result.error) {
        setError(result.error);
      }
    });
  }, [note, newTag]);

  const handleRemoveTag = useCallback(
    async (tagId: string) => {
      if (!note) return;

      startTransition(async () => {
        const result = await removeTagFromNote(note.id, tagId);
        if (result.data) {
          setTags((prev) => prev.filter((t) => t.id !== tagId));
        }
      });
    },
    [note]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          id="title"
          name="title"
          defaultValue={note?.title || ""}
          placeholder="Enter note title..."
          required
          autoFocus={!note}
        />
      </div>

      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mode
        </label>
        <div className="flex gap-2">
          <ModeButton
            mode="research"
            currentMode={mode}
            onClick={() => setMode("research")}
            label="Research"
            description="External resources & links"
          />
          <ModeButton
            mode="project"
            currentMode={mode}
            onClick={() => setMode("project")}
            label="Project"
            description="Active work notes"
          />
          <ModeButton
            mode="reference"
            currentMode={mode}
            onClick={() => setMode("reference")}
            label="Reference"
            description="Tutorials & guides"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <Textarea
          id="content"
          name="content"
          defaultValue={note?.content || ""}
          placeholder="Write your note content here... (Markdown supported)"
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      {/* Tags Section (only for existing notes) */}
      {note && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag.source === "ai" && (
                  <span className="text-[10px] text-purple-500">AI</span>
                )}
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="text-gray-400 hover:text-red-500 ml-1"
                  disabled={isPending}
                >
                  <XIcon />
                </button>
              </span>
            ))}
            {tags.length === 0 && (
              <span className="text-sm text-gray-400">No tags yet</span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!newTag.trim() || isPending}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Auto-tag toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoTag"
          checked={autoTag}
          onChange={(e) => setAutoTag(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="autoTag" className="text-sm text-gray-600">
          Auto-generate tags with AI on save
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <LoadingSpinner />
              {note ? "Saving..." : "Creating..."}
            </>
          ) : note ? (
            "Save Changes"
          ) : (
            "Create Note"
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

/*
 * Mode Selection Button
 */
interface ModeButtonProps {
  mode: NoteMode;
  currentMode: NoteMode;
  onClick: () => void;
  label: string;
  description: string;
}

function ModeButton({
  mode,
  currentMode,
  onClick,
  label,
  description,
}: ModeButtonProps) {
  const isSelected = mode === currentMode;

  const colorConfig = {
    research: "border-purple-500 bg-purple-50 text-purple-700",
    project: "border-blue-500 bg-blue-50 text-blue-700",
    reference: "border-green-500 bg-green-50 text-green-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 p-3 rounded-lg border-2 text-left transition-colors ${
        isSelected
          ? colorConfig[mode]
          : "border-gray-200 hover:border-gray-300 text-gray-600"
      }`}
    >
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs opacity-70">{description}</div>
    </button>
  );
}

/*
 * X Icon for tag removal
 */
function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/*
 * Loading Spinner
 */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
