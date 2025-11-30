import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/actions";
import { listNotes } from "@/lib/notes/actions";
import { NoteList } from "@/components/notes";
import { Button } from "@/components/ui/button";
import type { NoteMode } from "@/types/database";

/*
 * Notes List Page
 *
 * This is a Server Component - it fetches data directly on the server.
 * No loading states needed because the HTML is generated with the data.
 *
 * Benefits of Server Components for data fetching:
 * - No client-side loading spinners
 * - Data fetched at request time (always fresh)
 * - Database calls stay on the server (secure)
 * - Reduces JavaScript bundle size
 *
 * The searchParams are used for filtering notes by mode.
 */

interface NotesPageProps {
  searchParams: Promise<{ mode?: NoteMode }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  // Check authentication
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;

  // Fetch notes with optional mode filter
  const { data: notes, error } = await listNotes({
    mode: params.mode,
    orderBy: "updated_at",
    orderDirection: "desc",
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NotesHeader user={user} />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="p-4 text-red-600 bg-red-50 rounded-lg">
            Failed to load notes: {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotesHeader user={user} />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            <p className="text-sm text-gray-500 mt-1">
              {notes?.length || 0} notes{params.mode ? ` in ${params.mode} mode` : ""}
            </p>
          </div>
          <Link href="/notes/new">
            <Button>
              <PlusIcon />
              New Note
            </Button>
          </Link>
        </div>

        {/* Mode Filter Tabs */}
        <ModeFilterTabs currentMode={params.mode} />

        {/* Notes List */}
        <div className="mt-6">
          <NoteList notes={notes || []} />
        </div>
      </main>
    </div>
  );
}

/*
 * Header Component (reused from dashboard)
 */
function NotesHeader({ user }: { user: { email?: string } }) {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
            Homelab Notebook
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/notes" className="text-gray-600 hover:text-gray-900">
              Notes
            </Link>
          </nav>
        </div>
        <span className="text-sm text-gray-600">{user.email}</span>
      </div>
    </header>
  );
}

/*
 * Mode Filter Tabs
 * Allow filtering notes by their mode
 *
 * Note: Using explicit links instead of dynamic string construction
 * because Next.js typedRoutes requires static href values.
 */
function ModeFilterTabs({ currentMode }: { currentMode?: NoteMode }) {
  const tabClass = (isActive: boolean) =>
    `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
      <Link href="/notes" className={tabClass(!currentMode)}>
        All
      </Link>
      <Link href="/notes?mode=research" className={tabClass(currentMode === "research")}>
        Research
      </Link>
      <Link href="/notes?mode=project" className={tabClass(currentMode === "project")}>
        Project
      </Link>
      <Link href="/notes?mode=reference" className={tabClass(currentMode === "reference")}>
        Reference
      </Link>
    </div>
  );
}

/*
 * Plus Icon
 */
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
