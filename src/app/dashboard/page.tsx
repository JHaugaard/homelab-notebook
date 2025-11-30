import Link from "next/link";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { listNotes } from "@/lib/notes/actions";

/*
 * Dashboard Page (Protected)
 *
 * This is the main landing page after login. It's protected by middleware,
 * meaning unauthenticated users are redirected to /login before this page
 * even renders.
 *
 * This is a Server Component, so we can:
 * - Fetch the user directly using getUser()
 * - Access the database without client-side loading states
 * - Keep sensitive logic server-side
 *
 * The double-check for user here is a defense-in-depth pattern:
 * - Middleware should catch unauthenticated requests
 * - But if something goes wrong, we redirect here too
 * - This prevents accidentally rendering protected content
 */
export default async function DashboardPage() {
  const user = await getUser();

  // Defense in depth: redirect if somehow got past middleware
  if (!user) {
    redirect("/login");
  }

  // Fetch recent notes for the dashboard
  const { data: recentNotes } = await listNotes({ limit: 5 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Homelab Notebook
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/notes" className="text-sm text-gray-600 hover:text-blue-600">
              All Notes
            </Link>
            <span className="text-sm text-gray-600">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Welcome back!
              </h2>
              <p className="mt-1 text-gray-600">
                You have {recentNotes?.length || 0} notes in your notebook.
              </p>
            </div>
            <Link
              href="/notes/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon />
              New Note
            </Link>
          </div>
        </div>

        {/* Recent Notes */}
        {recentNotes && recentNotes.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Notes</h3>
              <Link href="/notes" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid gap-3">
              {/* Using <a> instead of Link for dynamic note IDs with typedRoutes */}
              {recentNotes.map((note) => (
                <a
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{note.title}</h4>
                      {note.content && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {note.content.substring(0, 100)}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      note.mode === "research" ? "bg-purple-100 text-purple-700" :
                      note.mode === "project" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {note.mode}
                    </span>
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span key={tag.id} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {tag.name}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{note.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Mode Navigation */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ModeCard
            title="Research"
            description="Capture and organize external resources, links, and articles."
            href="/notes?mode=research"
          />
          <ModeCard
            title="Project"
            description="Raw lab notebook for active work. Timestamped notes and checklists."
            href="/notes?mode=project"
          />
          <ModeCard
            title="Reference"
            description="Distilled, tutorial-style documentation from your projects."
            href="/notes?mode=reference"
          />
        </div>
      </main>
    </div>
  );
}

function PlusIcon() {
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
      className="mr-2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/*
 * Mode Card Component
 *
 * Displays a preview card for each of the three notebook modes.
 * These link to the respective mode pages (to be implemented in Step 9).
 */
function ModeCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </a>
  );
}
