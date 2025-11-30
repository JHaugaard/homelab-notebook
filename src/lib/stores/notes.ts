import { writable, derived, get } from 'svelte/store';
import type { Note, Tag, Collection, NoteSearchIndex } from '$types';
import { pb } from './pocketbase';
import { searchIndex, searchNotes } from './search';

// Notes store
function createNotesStore() {
	const { subscribe, set, update } = writable<Note[]>([]);

	return {
		subscribe,
		set,

		async fetchAll() {
			if (!pb) return;
			try {
				const records = await pb.collection('notes').getFullList<Note>({
					sort: '-updated',
					expand: 'tags,collection_id'
				});
				set(records);

				// Update search index
				const indexData: NoteSearchIndex[] = records.map((note) => ({
					id: note.id,
					title: note.title,
					type: note.type,
					tags: note.expand?.tags?.map((t) => t.name) ?? []
				}));
				searchIndex.build(indexData);
			} catch (err) {
				console.error('Failed to fetch notes:', err);
			}
		},

		async create(data: Partial<Note>) {
			if (!pb) return null;
			try {
				const record = await pb.collection('notes').create<Note>(data);
				update((notes) => [record, ...notes]);
				return record;
			} catch (err) {
				console.error('Failed to create note:', err);
				return null;
			}
		},

		async update(id: string, data: Partial<Note>) {
			if (!pb) return null;
			try {
				const record = await pb.collection('notes').update<Note>(id, data);
				update((notes) => notes.map((n) => (n.id === id ? record : n)));
				return record;
			} catch (err) {
				console.error('Failed to update note:', err);
				return null;
			}
		},

		async delete(id: string) {
			if (!pb) return false;
			try {
				await pb.collection('notes').delete(id);
				update((notes) => notes.filter((n) => n.id !== id));
				return true;
			} catch (err) {
				console.error('Failed to delete note:', err);
				return false;
			}
		}
	};
}

// Tags store
function createTagsStore() {
	const { subscribe, set, update } = writable<Tag[]>([]);

	return {
		subscribe,
		set,

		async fetchAll() {
			if (!pb) return;
			try {
				const records = await pb.collection('tags').getFullList<Tag>({
					sort: 'name'
				});
				set(records);
			} catch (err) {
				console.error('Failed to fetch tags:', err);
			}
		},

		async create(data: Partial<Tag>) {
			if (!pb) return null;
			try {
				const record = await pb.collection('tags').create<Tag>(data);
				update((tags) => [...tags, record].sort((a, b) => a.name.localeCompare(b.name)));
				return record;
			} catch (err) {
				console.error('Failed to create tag:', err);
				return null;
			}
		},

		async delete(id: string) {
			if (!pb) return false;
			try {
				await pb.collection('tags').delete(id);
				update((tags) => tags.filter((t) => t.id !== id));
				return true;
			} catch (err) {
				console.error('Failed to delete tag:', err);
				return false;
			}
		}
	};
}

// Collections store
function createCollectionsStore() {
	const { subscribe, set, update } = writable<Collection[]>([]);

	return {
		subscribe,
		set,

		async fetchAll() {
			if (!pb) return;
			try {
				const records = await pb.collection('collections').getFullList<Collection>({
					sort: 'name'
				});
				set(records);
			} catch (err) {
				console.error('Failed to fetch collections:', err);
			}
		},

		async create(data: Partial<Collection>) {
			if (!pb) return null;
			try {
				const record = await pb.collection('collections').create<Collection>(data);
				update((cols) => [...cols, record].sort((a, b) => a.name.localeCompare(b.name)));
				return record;
			} catch (err) {
				console.error('Failed to create collection:', err);
				return null;
			}
		},

		async delete(id: string) {
			if (!pb) return false;
			try {
				await pb.collection('collections').delete(id);
				update((cols) => cols.filter((c) => c.id !== id));
				return true;
			} catch (err) {
				console.error('Failed to delete collection:', err);
				return false;
			}
		}
	};
}

// Export stores
export const notes = createNotesStore();
export const tags = createTagsStore();
export const collections = createCollectionsStore();

// Search query store
export const searchQuery = writable('');

// Derived store for filtered notes
export const filteredNotes = derived([notes, searchQuery], ([$notes, $query]) => {
	if (!$query.trim()) {
		return $notes;
	}

	const resultIds = searchNotes($query);
	const idSet = new Set(resultIds);
	return $notes.filter((note) => idSet.has(note.id));
});

// Initialize all data
export async function initializeStores() {
	await Promise.all([notes.fetchAll(), tags.fetchAll(), collections.fetchAll()]);
}
