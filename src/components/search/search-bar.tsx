"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { quickSearch, type QuickSearchResult } from "@/lib/search/actions";
import type { NoteMode } from "@/types/database";

/*
 * SearchBar Component
 *
 * A search input with debounced autocomplete suggestions.
 *
 * Debouncing Explained:
 * ---------------------
 * When the user types, we don't want to fire a search request on every keystroke.
 * That would overwhelm the server and create a laggy experience.
 *
 * Instead, we "debounce" - wait until the user stops typing for 300ms before
 * searching. This balances responsiveness with efficiency.
 *
 * Implementation:
 * 1. User types "doc"
 * 2. Timer starts (300ms)
 * 3. User types "k" (now "dock")
 * 4. Timer resets (300ms from now)
 * 5. User stops typing
 * 6. Timer fires, search runs for "dock"
 *
 * The useEffect cleanup function ensures we cancel pending searches
 * when the component unmounts or the query changes.
 */

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  showQuickResults?: boolean;
}

export function SearchBar({
  placeholder = "Search notes...",
  className = "",
  onSearch,
  showQuickResults = true,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial query from URL if present
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [quickResults, setQuickResults] = useState<QuickSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    // Don't search if query is too short
    if (query.trim().length < 2) {
      setQuickResults([]);
      return;
    }

    // Set up debounce timer
    const timer = setTimeout(async () => {
      if (!showQuickResults) return;

      setIsLoading(true);
      const { data } = await quickSearch(query);
      setQuickResults(data || []);
      setIsLoading(false);
      setShowDropdown(true);
    }, 300);

    // Cleanup: cancel timer if query changes before it fires
    return () => clearTimeout(timer);
  }, [query, showQuickResults]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle form submission (full search)
  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();

      if (query.trim().length < 2) return;

      setShowDropdown(false);

      if (onSearch) {
        onSearch(query);
      } else {
        // Navigate to search results page
        const params = new URLSearchParams(searchParams.toString());
        params.set("q", query);
        router.push(`/notes?${params.toString()}`);
      }
    },
    [query, onSearch, router, searchParams]
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || quickResults.length === 0) {
      if (e.key === "Enter") {
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < quickResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && quickResults[selectedIndex]) {
          navigateToNote(quickResults[selectedIndex].id);
        } else {
          handleSubmit();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const navigateToNote = (noteId: string) => {
    setShowDropdown(false);
    router.push(`/notes/${noteId}`);
  };

  // Mode badge colors
  const getModeColor = (mode: NoteMode) => {
    switch (mode) {
      case "research":
        return "bg-blue-100 text-blue-700";
      case "project":
        return "bg-green-100 text-green-700";
      case "reference":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10 pr-4"
            aria-label="Search notes"
            aria-expanded={showDropdown}
            aria-controls="search-results"
            role="combobox"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </form>

      {/* Quick Results Dropdown */}
      {showDropdown && quickResults.length > 0 && (
        <div
          ref={dropdownRef}
          id="search-results"
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg"
        >
          <ul className="py-1">
            {quickResults.map((result, index) => (
              <li
                key={result.id}
                role="option"
                aria-selected={index === selectedIndex}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                  index === selectedIndex
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => navigateToNote(result.id)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="truncate text-sm">{result.title}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getModeColor(
                    result.mode
                  )}`}
                >
                  {result.mode}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t px-3 py-2 text-xs text-gray-500">
            Press Enter to see all results
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showDropdown && query.length >= 2 && quickResults.length === 0 && !isLoading && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg"
        >
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            No notes found for &ldquo;{query}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Icon Components
// ============================================================================

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
