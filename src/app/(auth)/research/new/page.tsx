import Link from "next/link";
import { NoteEditor } from "@/components/notes";

/*
 * New Research Note Page
 *
 * Pre-selects Research mode for faster note creation.
 * The (auth) layout provides navigation and auth protection.
 */

export const metadata = {
  title: "New Research Note",
  description: "Create a new research note to capture external resources.",
};

export default function NewResearchNotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/research" className="hover:text-purple-600">
          Research
        </Link>
        <span>/</span>
        <span className="text-gray-900">New Note</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
            Research Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">New Research Note</h1>
        <p className="text-sm text-gray-500 mt-1">
          Capture links to articles, tutorials, and documentation you want to reference later.
        </p>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <NoteEditor defaultMode="research" />
      </div>
    </div>
  );
}
