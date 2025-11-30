import Link from "next/link";
import { NoteEditor } from "@/components/notes";

/*
 * New Reference Guide Page
 *
 * Pre-selects Reference mode for faster note creation.
 * The (auth) layout provides navigation and auth protection.
 */

export const metadata = {
  title: "New Reference Guide",
  description: "Create a polished reference guide from your project experiences.",
};

export default function NewReferenceNotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/reference" className="hover:text-green-600">
          Reference
        </Link>
        <span>/</span>
        <span className="text-gray-900">New Guide</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
            Reference Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">New Reference Guide</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a polished, step-by-step guide that distills knowledge from your projects.
        </p>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <NoteEditor defaultMode="reference" />
      </div>
    </div>
  );
}
