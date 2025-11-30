import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getNote } from "@/lib/notes/actions";
import { NoteEditor, ModeBadge, TagBadge } from "@/components/notes";
import { formatDistanceToNow, format } from "date-fns";
import type { NoteMode } from "@/types/database";

/*
 * Note Detail/Edit Page
 *
 * This page shows a single note and allows editing it.
 * It's a Server Component that fetches the note data, then renders
 * the client-side NoteEditor component for editing.
 *
 * Auth protection is handled by the (auth) layout wrapper.
 *
 * Dynamic Route:
 * - [id] is a dynamic segment that captures the note ID from the URL
 * - Example: /notes/abc123 -> id = "abc123"
 */

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  // Await params (Next.js 15 requirement for dynamic routes)
  const { id } = await params;

  // Fetch the note
  const { data: note, error } = await getNote(id);

  // Handle not found
  if (error || !note) {
    notFound();
  }

  // Determine the back link based on mode
  const modeLinks: Record<NoteMode, Route<string>> = {
    research: "/research" as Route<string>,
    project: "/project" as Route<string>,
    reference: "/reference" as Route<string>,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={modeLinks[note.mode]} className="hover:text-gray-900 capitalize">
          {note.mode}
        </Link>
        <ChevronIcon />
        <span className="text-gray-900 truncate max-w-[200px]">
          {note.title}
        </span>
      </nav>

      {/* Note Metadata */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ModeBadge mode={note.mode} />
          <span className="text-sm text-gray-500">
            Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Created {format(new Date(note.created_at), "MMM d, yyyy")}
        </div>
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6">
          {note.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}

      {/* Editor Card */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <NoteEditor
          note={note}
          onSave={() => {
            // Note: The editor handles its own refresh via revalidatePath
          }}
        />
      </div>
    </div>
  );
}

/*
 * Chevron Icon for breadcrumb
 */
function ChevronIcon() {
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
      className="text-gray-300"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
