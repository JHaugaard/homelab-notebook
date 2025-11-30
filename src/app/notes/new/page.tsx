import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/actions";
import { NoteEditor } from "@/components/notes";

/*
 * New Note Page
 *
 * A simple page that wraps the NoteEditor component for creating new notes.
 * This is a Server Component that renders the client-side editor.
 *
 * After creating a note, the editor will redirect to the note's detail page.
 */

export default async function NewNotePage() {
  // Check authentication
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xl font-semibold text-gray-900 hover:text-blue-600"
            >
              Homelab Notebook
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/notes" className="text-gray-600 hover:text-gray-900">
              Notes
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">New</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
          <p className="text-sm text-gray-500 mt-1">
            Start capturing your thoughts, research, or documentation.
          </p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <NoteEditor />
        </div>
      </main>
    </div>
  );
}
