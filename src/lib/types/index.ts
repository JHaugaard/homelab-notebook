// PocketBase Record Types

export type NoteType = 'url' | 'snippet' | 'note';

export interface Tag {
	id: string;
	name: string;
	color: string;
	created: string;
	updated: string;
}

export interface Collection {
	id: string;
	name: string;
	description?: string;
	created: string;
	updated: string;
}

export interface Note {
	id: string;
	type: NoteType;
	title: string;
	content: string;
	url?: string;
	language?: string;
	tags: string[]; // Tag IDs
	collection_id?: string;
	created: string;
	updated: string;
	// Expanded relations (when fetched with expand)
	expand?: {
		tags?: Tag[];
		collection_id?: Collection;
	};
}

// Search index types
export interface NoteSearchIndex {
	id: string;
	title: string;
	type: NoteType;
	tags: string[]; // Tag names for search
}

// Form types
export interface NoteFormData {
	type: NoteType;
	title: string;
	content: string;
	url?: string;
	language?: string;
	tags: string[];
	collection_id?: string;
}

export interface TagFormData {
	name: string;
	color: string;
}

export interface CollectionFormData {
	name: string;
	description?: string;
}

// UI State types
export interface SearchState {
	query: string;
	results: NoteSearchIndex[];
	isSearching: boolean;
}

export interface UIState {
	sidebarOpen: boolean;
	modalOpen: boolean;
	modalType: 'note' | 'tag' | 'collection' | null;
	editingId: string | null;
}

// API Response types
export interface PaginatedResponse<T> {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: T[];
}
