import Link from "next/link";
import { Suspense } from "react";
import { listNotes } from "@/lib/notes/actions";
import { searchNotes } from "@/lib/search/actions";
import { NoteList } from "@/components/notes";
import { SearchBar, SearchResults } from "@/components/search";
import { Button } from "@/components/ui/button";

/*
 * Reference Mode Page
 *
 * The Reference mode is for distilled, tutorial-style documentation.
 * Think: clean step-by-step guides derived from project experiences.
 *
 * This is a dedicated landing page for Reference mode that:
 * - Shows only reference notes
 * - Provides a "New Reference Note" quick action
 * - Has search scoped to reference notes
 * - Emphasizes polished, reusable documentation
 */

export const metadata = {
  title: "Reference",
  description: "Distilled, tutorial-style documentation from your projects.",
};

interface ReferencePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ReferencePage({ searchParams }: ReferencePageProps) {
  const params = await searchParams;
  const searchQuery = params.q?.trim();
  const isSearching = Boolean(searchQuery && searchQuery.length >= 2);

  // Fetch notes filtered to reference mode
  let content;
  if (isSearching) {
    const { data: results, error } = await searchNotes({
      query: searchQuery!,
      mode: "reference",
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
      mode: "reference",
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
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700">
            Reference Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Reference</h1>
        <p className="text-gray-600 mt-1">
          Distilled, tutorial-style documentation from your project experiences.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link href="/reference/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusIcon />
            New Reference Guide
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar className="max-w-md" placeholder="Search reference guides..." />
        </Suspense>
      </div>

      {/* Notes List */}
      <div className="mt-6">{content}</div>

      {/* Clear Search */}
      {isSearching && (
        <div className="mt-4 text-center">
          <Link href="/reference" className="text-sm text-green-600 hover:text-green-800">
            Clear search
          </Link>
        </div>
      )}
    </div>
  );
}

/*
 * Empty State for Reference Mode
 */
function EmptyState() {
  return (
    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
      <FileTextIcon className="mx-auto h-12 w-12 text-green-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No reference guides yet</h3>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">
        Create polished, step-by-step guides from your project experiences. These become your personal documentation library.
      </p>
      <div className="mt-6">
        <Link href="/reference/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusIcon />
            Create your first reference guide
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

function FileTextIcon({ className }: { className?: string }) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
