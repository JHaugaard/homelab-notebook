import Link from "next/link";
import { NoteEditor } from "@/components/notes";

/*
 * New Project Note Page
 *
 * Pre-selects Project mode for faster note creation.
 * The (auth) layout provides navigation and auth protection.
 */

export const metadata = {
  title: "New Project Note",
  description: "Start a new project note for active work documentation.",
};

export default function NewProjectNotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/project" className="hover:text-blue-600">
          Project
        </Link>
        <span>/</span>
        <span className="text-gray-900">New Note</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
            Project Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">New Project Note</h1>
        <p className="text-sm text-gray-500 mt-1">
          Document your active work with observations, code snippets, and progress notes.
        </p>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <NoteEditor defaultMode="project" />
      </div>
    </div>
  );
}
