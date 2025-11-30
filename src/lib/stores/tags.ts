import { writable, derived } from 'svelte/store';
import type { Tag, TagFormData, TagCategory } from '$lib/types';
import { tagService } from '$lib/services/pocketbase';
import { browser } from '$app/environment';

// Core tags store
function createTagsStore() {
	const { subscribe, set, update } = writable<Tag[]>([]);

	return {
		subscribe,
		set,

		async load() {
			if (!browser) return;
			try {
				const tags = await tagService.getAll();
				set(tags);
			} catch (error) {
				console.error('Failed to load tags:', error);
			}
		},

		async create(data: TagFormData) {
			const tag = await tagService.create(data);
			update((tags) => [...tags, tag].sort((a, b) => a.name.localeCompare(b.name)));
			return tag;
		},

		async findOrCreate(name: string) {
			const tag = await tagService.findOrCreate(name);
			update((tags) => {
				if (tags.find((t) => t.id === tag.id)) return tags;
				return [...tags, tag].sort((a, b) => a.name.localeCompare(b.name));
			});
			return tag;
		},

		async update(id: string, data: Partial<TagFormData>) {
			const updated = await tagService.update(id, data);
			update((tags) =>
				tags.map((t) => (t.id === id ? updated : t)).sort((a, b) => a.name.localeCompare(b.name))
			);
			return updated;
		},

		async delete(id: string) {
			await tagService.delete(id);
			update((tags) => tags.filter((t) => t.id !== id));
		},

		async merge(sourceId: string, targetId: string) {
			await tagService.merge(sourceId, targetId);
			update((tags) => tags.filter((t) => t.id !== sourceId));
		}
	};
}

export const tags = createTagsStore();

// Derived stores by category
export const technologyTags = derived(tags, ($tags) =>
	$tags.filter((t) => t.category === 'technology')
);

export const conceptTags = derived(tags, ($tags) => $tags.filter((t) => t.category === 'concept'));

export const infrastructureTags = derived(tags, ($tags) =>
	$tags.filter((t) => t.category === 'infrastructure')
);

export const otherTags = derived(tags, ($tags) =>
	$tags.filter((t) => !t.category || t.category === 'other')
);

// Tags grouped by category
export const tagsByCategory = derived(tags, ($tags) => {
	const groups: Record<TagCategory | 'uncategorized', Tag[]> = {
		technology: [],
		concept: [],
		infrastructure: [],
		other: [],
		uncategorized: []
	};

	for (const tag of $tags) {
		const category = tag.category || 'uncategorized';
		if (category in groups) {
			groups[category as keyof typeof groups].push(tag);
		} else {
			groups.uncategorized.push(tag);
		}
	}

	return groups;
});

// Tag name lookup map
export const tagNameMap = derived(tags, ($tags) => {
	const map = new Map<string, Tag>();
	for (const tag of $tags) {
		map.set(tag.id, tag);
	}
	return map;
});

// Get tag by ID helper
export function getTagById(tags: Tag[], id: string): Tag | undefined {
	return tags.find((t) => t.id === id);
}

// Get tag by name helper
export function getTagByName(tags: Tag[], name: string): Tag | undefined {
	return tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
}
