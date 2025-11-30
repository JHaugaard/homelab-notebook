import FlexSearch from 'flexsearch';
import type { NoteSearchIndex } from '$types';

// FlexSearch index for instant client-side search
class SearchIndex {
	private index: FlexSearch.Document<NoteSearchIndex, string[]>;
	private data: Map<string, NoteSearchIndex> = new Map();

	constructor() {
		this.index = new FlexSearch.Document({
			document: {
				id: 'id',
				index: ['title', 'tags'],
				store: ['id', 'title', 'type', 'tags']
			},
			tokenize: 'forward',
			resolution: 9,
			cache: true
		});
	}

	build(notes: NoteSearchIndex[]) {
		// Clear existing index
		this.data.clear();

		// Add all notes to index
		for (const note of notes) {
			this.index.add(note);
			this.data.set(note.id, note);
		}
	}

	search(query: string): string[] {
		if (!query.trim()) {
			return Array.from(this.data.keys());
		}

		const results = this.index.search(query, {
			limit: 100,
			enrich: true
		});

		// Collect unique IDs from all field results
		const ids = new Set<string>();
		for (const result of results) {
			for (const item of result.result) {
				if (typeof item === 'string') {
					ids.add(item);
				} else if (item && typeof item === 'object' && 'id' in item) {
					ids.add(item.id as string);
				}
			}
		}

		return Array.from(ids);
	}

	add(note: NoteSearchIndex) {
		this.index.add(note);
		this.data.set(note.id, note);
	}

	remove(id: string) {
		this.index.remove(id);
		this.data.delete(id);
	}

	update(note: NoteSearchIndex) {
		this.index.update(note);
		this.data.set(note.id, note);
	}
}

// Singleton search index
export const searchIndex = new SearchIndex();

// Convenience function for searching
export function searchNotes(query: string): string[] {
	return searchIndex.search(query);
}
