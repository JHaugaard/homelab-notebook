import { writable, derived } from 'svelte/store';
import type { Entry, EntryMode, EntryFormData } from '$lib/types';
import { entryService } from '$lib/services/pocketbase';
import { browser } from '$app/environment';

// Core entries store
function createEntriesStore() {
	const { subscribe, set, update } = writable<Entry[]>([]);

	return {
		subscribe,
		set,

		async load() {
			if (!browser) return;
			try {
				const entries = await entryService.getAll();
				set(entries);
			} catch (error) {
				console.error('Failed to load entries:', error);
			}
		},

		async loadByMode(mode: EntryMode) {
			if (!browser) return;
			try {
				const entries = await entryService.getByMode(mode);
				set(entries);
			} catch (error) {
				console.error(`Failed to load ${mode} entries:`, error);
			}
		},

		async create(data: EntryFormData) {
			const entry = await entryService.create(data);
			update((entries) => [entry, ...entries]);
			return entry;
		},

		async update(id: string, data: Partial<EntryFormData>) {
			const updated = await entryService.update(id, data);
			update((entries) => entries.map((e) => (e.id === id ? updated : e)));
			return updated;
		},

		async archive(id: string) {
			await entryService.archive(id);
			update((entries) => entries.filter((e) => e.id !== id));
		},

		async restore(id: string) {
			const restored = await entryService.restore(id);
			update((entries) => [restored, ...entries]);
		},

		async delete(id: string) {
			await entryService.delete(id);
			update((entries) => entries.filter((e) => e.id !== id));
		},

		async promote(id: string, toMode: EntryMode) {
			const newEntry = await entryService.promote(id, toMode);
			update((entries) => [newEntry, ...entries]);
			return newEntry;
		},

		// Handle real-time updates
		handleRealtimeUpdate(action: string, record: Entry) {
			update((entries) => {
				switch (action) {
					case 'create':
						return [record, ...entries];
					case 'update':
						return entries.map((e) => (e.id === record.id ? record : e));
					case 'delete':
						return entries.filter((e) => e.id !== record.id);
					default:
						return entries;
				}
			});
		}
	};
}

export const entries = createEntriesStore();

// Derived stores for mode-specific views
export const researchEntries = derived(entries, ($entries) =>
	$entries.filter((e) => e.mode === 'research')
);

export const projectEntries = derived(entries, ($entries) =>
	$entries.filter((e) => e.mode === 'project')
);

export const referenceEntries = derived(entries, ($entries) =>
	$entries.filter((e) => e.mode === 'reference')
);

// Entry counts by mode
export const entryCounts = derived(entries, ($entries) => ({
	research: $entries.filter((e) => e.mode === 'research').length,
	project: $entries.filter((e) => e.mode === 'project').length,
	reference: $entries.filter((e) => e.mode === 'reference').length,
	total: $entries.length
}));

// Recent entries (last 10)
export const recentEntries = derived(entries, ($entries) => $entries.slice(0, 10));

// Current entry being viewed/edited
export const currentEntry = writable<Entry | null>(null);
