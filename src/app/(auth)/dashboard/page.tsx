import Link from "next/link";
import type { Route } from "next";
import { listNotes } from "@/lib/notes/actions";

/*
 * Dashboard Page (Protected)
 *
 * This is the main landing page after login. It provides:
 * - Welcome message with note count
 * - Quick actions for creating notes
 * - Recent notes preview
 * - Mode navigation cards
 *
 * This is a Server Component that fetches data directly.
 * Auth protection is handled by the (auth) layout wrapper.
 */
export default async function DashboardPage() {
  // Fetch recent notes for the dashboard
  const { data: recentNotes } = await listNotes({ limit: 5 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
          href="/research"
          color="purple"
        />
        <ModeCard
          title="Project"
          description="Raw lab notebook for active work. Timestamped notes and checklists."
          href="/project"
          color="blue"
        />
        <ModeCard
          title="Reference"
          description="Distilled, tutorial-style documentation from your projects."
          href="/reference"
          color="green"
        />
      </div>
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
 * Links to the dedicated mode pages.
 */
function ModeCard({
  title,
  description,
  href,
  color,
}: {
  title: string;
  description: string;
  href: Route<string>;
  color: "purple" | "blue" | "green";
}) {
  const colorClasses = {
    purple: "hover:border-purple-300 hover:bg-purple-50/50",
    blue: "hover:border-blue-300 hover:bg-blue-50/50",
    green: "hover:border-green-300 hover:bg-green-50/50",
  };

  const badgeClasses = {
    purple: "bg-purple-100 text-purple-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <Link
      href={href}
      className={`block rounded-lg border bg-white p-6 shadow-sm transition-all ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${badgeClasses[color]}`}>
          {title}
        </span>
      </div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </Link>
  );
}
