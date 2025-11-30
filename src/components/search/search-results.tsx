import Link from "next/link";
import type { SearchResult, NoteMode } from "@/types/database";

/*
 * SearchResults Component
 *
 * Displays full search results with highlighted snippets.
 *
 * The "headline" field from PostgreSQL's ts_headline() function contains
 * HTML with <mark> tags around matching terms. We use dangerouslySetInnerHTML
 * to render these highlights.
 *
 * Why dangerouslySetInnerHTML is safe here:
 * - The headline comes from PostgreSQL's ts_headline() function
 * - ts_headline() only adds our configured tags (<mark>...</mark>)
 * - The original content is escaped by PostgreSQL
 * - We never render user input directly
 */

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
}

export function SearchResults({
  results,
  query,
  isLoading = false,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <SearchResultSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <SearchEmptyIcon className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No results found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          No notes match &ldquo;{query}&rdquo;. Try different keywords or check your
          spelling.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          <p className="font-medium">Search tips:</p>
          <ul className="mt-2 space-y-1">
            <li>&bull; Use specific keywords like &ldquo;docker&rdquo; or &ldquo;postgres&rdquo;</li>
            <li>&bull; Try partial words: &ldquo;post&rdquo; matches &ldquo;PostgreSQL&rdquo;</li>
            <li>&bull; Use OR for alternatives: &ldquo;docker OR kubernetes&rdquo;</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Found {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
      </p>
      <ul className="space-y-3">
        {results.map((result) => (
          <SearchResultItem key={result.id} result={result} />
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Individual Search Result
// ============================================================================

interface SearchResultItemProps {
  result: SearchResult;
}

function SearchResultItem({ result }: SearchResultItemProps) {
  const getModeColor = (mode: NoteMode) => {
    switch (mode) {
      case "research":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "project":
        return "bg-green-100 text-green-700 border-green-200";
      case "reference":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Format the date relative to now
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <li>
      <Link
        href={`/notes/${result.id}`}
        className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-base font-medium text-gray-900 truncate">
              {result.title}
            </h3>

            {/* Headline/Snippet with highlights */}
            {result.headline && (
              <p
                className="mt-1 text-sm text-gray-600 line-clamp-2 search-headline"
                dangerouslySetInnerHTML={{ __html: result.headline }}
              />
            )}

            {/* Metadata */}
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              <span
                className={`px-2 py-0.5 rounded-full border ${getModeColor(
                  result.mode
                )}`}
              >
                {result.mode}
              </span>
              <span>{formatDate(result.updated_at)}</span>
              {result.rank > 0 && (
                <span className="text-gray-400">
                  Relevance: {Math.round(result.rank * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Arrow indicator */}
          <ArrowRightIcon className="h-5 w-5 text-gray-300 flex-shrink-0" />
        </div>
      </Link>
    </li>
  );
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function SearchResultSkeleton() {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-2/3" />
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-4/5" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-5 bg-gray-100 rounded-full w-16" />
        <div className="h-5 bg-gray-100 rounded w-20" />
      </div>
    </div>
  );
}

// ============================================================================
// Icons
// ============================================================================

function SearchEmptyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8 11h6" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
