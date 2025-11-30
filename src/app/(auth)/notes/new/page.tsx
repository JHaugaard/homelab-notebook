import Link from "next/link";
import { NoteEditor } from "@/components/notes";

/*
 * New Note Page
 *
 * A simple page that wraps the NoteEditor component for creating new notes.
 * Auth protection is handled by the (auth) layout wrapper.
 *
 * After creating a note, the editor will redirect to the note's detail page.
 */

export const metadata = {
  title: "New Note",
  description: "Create a new note in your notebook.",
};

export default function NewNotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/notes" className="hover:text-gray-900">
          Notes
        </Link>
        <span>/</span>
        <span className="text-gray-900">New</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
        <p className="text-sm text-gray-500 mt-1">
          Start capturing your thoughts, research, or documentation.
        </p>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <NoteEditor />
      </div>
    </div>
  );
}
