import Link from "next/link";
import { Suspense } from "react";
import { listNotes } from "@/lib/notes/actions";
import { searchNotes } from "@/lib/search/actions";
import { NoteList } from "@/components/notes";
import { SearchBar, SearchResults } from "@/components/search";
import { Button } from "@/components/ui/button";

/*
 * Research Mode Page
 *
 * The Research mode is for capturing and organizing external resources.
 * Think: articles, tutorials, documentation links, learning resources.
 *
 * This is a dedicated landing page for Research mode that:
 * - Shows only research notes
 * - Provides a "New Research Note" quick action
 * - Has search scoped to research notes
 * - Displays mode-specific guidance and tips
 */

export const metadata = {
  title: "Research",
  description: "Capture and organize external resources, links, and articles.",
};

interface ResearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ResearchPage({ searchParams }: ResearchPageProps) {
  const params = await searchParams;
  const searchQuery = params.q?.trim();
  const isSearching = Boolean(searchQuery && searchQuery.length >= 2);

  // Fetch notes filtered to research mode
  let content;
  if (isSearching) {
    const { data: results, error } = await searchNotes({
      query: searchQuery!,
      mode: "research",
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
      mode: "research",
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
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-700">
            Research Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Research</h1>
        <p className="text-gray-600 mt-1">
          Capture and organize external resources, links, and articles.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link href="/research/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusIcon />
            New Research Note
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar className="max-w-md" placeholder="Search research notes..." />
        </Suspense>
      </div>

      {/* Notes List */}
      <div className="mt-6">{content}</div>

      {/* Clear Search */}
      {isSearching && (
        <div className="mt-4 text-center">
          <Link href="/research" className="text-sm text-purple-600 hover:text-purple-800">
            Clear search
          </Link>
        </div>
      )}
    </div>
  );
}

/*
 * Empty State for Research Mode
 */
function EmptyState() {
  return (
    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
      <BookOpenIcon className="mx-auto h-12 w-12 text-purple-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No research notes yet</h3>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">
        Start capturing links to articles, tutorials, and documentation you want to reference later.
      </p>
      <div className="mt-6">
        <Link href="/research/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusIcon />
            Create your first research note
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

function BookOpenIcon({ className }: { className?: string }) {
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
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
