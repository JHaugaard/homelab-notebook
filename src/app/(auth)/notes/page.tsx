import Link from "next/link";
import type { Route } from "next";
import { Suspense } from "react";
import { listNotes } from "@/lib/notes/actions";
import { searchNotes } from "@/lib/search/actions";
import { NoteList } from "@/components/notes";
import { SearchBar, SearchResults } from "@/components/search";
import { Button } from "@/components/ui/button";
import type { NoteMode } from "@/types/database";

/*
 * Notes List Page with Search
 *
 * This page handles two views:
 * 1. Default view: Shows all notes (optionally filtered by mode)
 * 2. Search view: Shows search results when ?q= param is present
 *
 * Auth protection is handled by the (auth) layout wrapper.
 *
 * The SearchBar is a Client Component wrapped in Suspense because it
 * uses useSearchParams(), which requires client-side JavaScript.
 */

interface NotesPageProps {
  searchParams: Promise<{ mode?: NoteMode; q?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;
  const searchQuery = params.q?.trim();
  const isSearching = Boolean(searchQuery && searchQuery.length >= 2);

  // Fetch either search results or regular notes
  let content;
  if (isSearching) {
    const { data: results, error } = await searchNotes({
      query: searchQuery!,
      mode: params.mode,
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
      mode: params.mode,
      orderBy: "updated_at",
      orderDirection: "desc",
    });

    if (error) {
      content = (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          Failed to load notes: {error}
        </div>
      );
    } else {
      content = <NoteList notes={notes || []} />;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Page Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Notes</h1>
          {isSearching ? (
            <p className="text-sm text-gray-500 mt-1">
              Search results for &ldquo;{searchQuery}&rdquo;
              {params.mode ? ` in ${params.mode} mode` : ""}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              {params.mode ? `Showing ${params.mode} notes` : "Showing all notes across modes"}
            </p>
          )}
        </div>
        <Link href="/notes/new">
          <Button>
            <PlusIcon />
            New Note
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar className="max-w-md" />
        </Suspense>
      </div>

      {/* Mode Filter Tabs */}
      <ModeFilterTabs currentMode={params.mode} searchQuery={searchQuery} />

      {/* Notes List or Search Results */}
      <div className="mt-6">{content}</div>

      {/* Clear Search Link (when searching) */}
      {isSearching && (
        <div className="mt-4 text-center">
          <Link
            href={params.mode ? `/notes?mode=${params.mode}` : "/notes"}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear search and show all notes
          </Link>
        </div>
      )}
    </div>
  );
}

/*
 * Mode Filter Tabs
 *
 * Preserves search query when switching modes.
 */
function ModeFilterTabs({
  currentMode,
  searchQuery,
}: {
  currentMode?: NoteMode;
  searchQuery?: string;
}) {
  const tabClass = (isActive: boolean) =>
    `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-600 hover:text-gray-900"
    }`;

  // Build href that preserves search query
  const buildHref = (mode?: NoteMode): Route<string> => {
    const params = new URLSearchParams();
    if (mode) params.set("mode", mode);
    if (searchQuery) params.set("q", searchQuery);
    const queryString = params.toString();
    return (queryString ? `/notes?${queryString}` : "/notes") as Route<string>;
  };

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
      <Link href={buildHref()} className={tabClass(!currentMode)}>
        All
      </Link>
      <Link
        href={buildHref("research")}
        className={tabClass(currentMode === "research")}
      >
        Research
      </Link>
      <Link
        href={buildHref("project")}
        className={tabClass(currentMode === "project")}
      >
        Project
      </Link>
      <Link
        href={buildHref("reference")}
        className={tabClass(currentMode === "reference")}
      >
        Reference
      </Link>
    </div>
  );
}

/*
 * Search Bar Fallback (for Suspense)
 */
function SearchBarFallback() {
  return (
    <div className="max-w-md h-9 bg-gray-100 rounded-md animate-pulse" />
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
