import { writable, derived, get } from 'svelte/store';
import FlexSearch from 'flexsearch';
import type { Entry, EntryMode, SearchFilters, SearchResult } from '$lib/types';
import { entries } from './entries';
import { browser } from '$app/environment';

// FlexSearch index
let searchIndex: FlexSearch.Index | null = null;

// Search query and results
export const searchQuery = writable('');
export const searchFilters = writable<SearchFilters>({});
export const isSearching = writable(false);

// Initialize FlexSearch index
function createIndex() {
	return new FlexSearch.Index({
		tokenize: 'forward',
		resolution: 9,
		cache: 100
	});
}

// Build or rebuild the search index
export async function buildSearchIndex(entriesList: Entry[]) {
	if (!browser) return;

	searchIndex = createIndex();

	for (const entry of entriesList) {
		const searchableText = [
			entry.title,
			entry.content || '',
			entry.url || '',
			entry.expand?.tags?.map((t) => t.name).join(' ') || '',
			entry.expand?.project?.name || ''
		].join(' ');

		searchIndex.add(entry.id, searchableText);
	}
}

// Search function
export function search(query: string, filters: SearchFilters = {}): SearchResult[] {
	if (!searchIndex || !query.trim()) return [];

	const entriesList = get(entries);

	// Get matching IDs from FlexSearch
	const matchingIds = searchIndex.search(query, { limit: 50 }) as string[];

	// Filter and map to results
	let results = entriesList
		.filter((entry) => matchingIds.includes(entry.id))
		.map((entry) => ({
			entry,
			score: matchingIds.indexOf(entry.id),
			matches: [query] // Simplified - could be enhanced to show actual matches
		}));

	// Apply filters
	if (filters.mode) {
		results = results.filter((r) => r.entry.mode === filters.mode);
	}

	if (filters.project) {
		results = results.filter((r) => r.entry.project === filters.project);
	}

	if (filters.tags && filters.tags.length > 0) {
		results = results.filter((r) =>
			filters.tags!.some((tagId) => r.entry.tags.includes(tagId))
		);
	}

	if (filters.archived !== undefined) {
		results = results.filter((r) => r.entry.archived === filters.archived);
	}

	// Sort by score (lower is better for FlexSearch)
	results.sort((a, b) => a.score - b.score);

	return results;
}

// Derived store for search results
export const searchResults = derived(
	[searchQuery, searchFilters, entries],
	([$query, $filters]) => {
		if (!$query.trim()) return [];
		return search($query, $filters);
	}
);

// Group search results by mode
export const searchResultsByMode = derived(searchResults, ($results) => {
	const groups: Record<EntryMode, SearchResult[]> = {
		research: [],
		project: [],
		reference: []
	};

	for (const result of $results) {
		groups[result.entry.mode].push(result);
	}

	return groups;
});

// Subscribe to entries changes and rebuild index
if (browser) {
	entries.subscribe((entriesList) => {
		if (entriesList.length > 0) {
			buildSearchIndex(entriesList);
		}
	});
}

// Clear search
export function clearSearch() {
	searchQuery.set('');
	searchFilters.set({});
}
