import Link from "next/link";
import { Suspense } from "react";
import { listNotes } from "@/lib/notes/actions";
import { searchNotes } from "@/lib/search/actions";
import { NoteList } from "@/components/notes";
import { SearchBar, SearchResults } from "@/components/search";
import { Button } from "@/components/ui/button";

/*
 * Project Mode Page
 *
 * The Project mode is for active work - a raw lab notebook.
 * Think: timestamped notes, code snippets, checklists, observations.
 *
 * This is a dedicated landing page for Project mode that:
 * - Shows only project notes
 * - Provides a "New Project Note" quick action
 * - Has search scoped to project notes
 * - Emphasizes quick capture workflow
 */

export const metadata = {
  title: "Project",
  description: "Raw lab notebook for active work. Timestamped notes and checklists.",
};

interface ProjectPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProjectPage({ searchParams }: ProjectPageProps) {
  const params = await searchParams;
  const searchQuery = params.q?.trim();
  const isSearching = Boolean(searchQuery && searchQuery.length >= 2);

  // Fetch notes filtered to project mode
  let content;
  if (isSearching) {
    const { data: results, error } = await searchNotes({
      query: searchQuery!,
      mode: "project",
    });

    if (error) {
      content = (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          Search failed: {error}
        </div>
      );
    } else {
      content = <SearchResults results={results || []} query={searchQuery!} />;
    }
  } else {
    const { data: notes, error } = await listNotes({
      mode: "project",
      orderBy: "updated_at",
      orderDirection: "desc",
    });

    if (error) {
      content = (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          Failed to load notes: {error}
        </div>
      );
    } else if (!notes || notes.length === 0) {
      content = <EmptyState />;
    } else {
      content = <NoteList notes={notes} />;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Mode Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
            Project Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Project</h1>
        <p className="text-gray-600 mt-1">
          Raw lab notebook for active work. Timestamped notes, code snippets, and checklists.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link href="/project/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon />
            New Project Note
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar className="max-w-md" placeholder="Search project notes..." />
        </Suspense>
      </div>

      {/* Notes List */}
      <div className="mt-6">{content}</div>

      {/* Clear Search */}
      {isSearching && (
        <div className="mt-4 text-center">
          <Link href="/project" className="text-sm text-blue-600 hover:text-blue-800">
            Clear search
          </Link>
        </div>
      )}
    </div>
  );
}

/*
 * Empty State for Project Mode
 */
function EmptyState() {
  return (
    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
      <ClipboardIcon className="mx-auto h-12 w-12 text-blue-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No project notes yet</h3>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">
        Start a lab notebook for your active work. Capture observations, code snippets, and progress notes.
      </p>
      <div className="mt-6">
        <Link href="/project/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon />
            Start your first project note
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SearchBarFallback() {
  return <div className="max-w-md h-9 bg-gray-100 rounded-md animate-pulse" />;
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

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
