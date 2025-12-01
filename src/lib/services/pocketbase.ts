import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { Entry, Project, Tag, EntryFormData, ProjectFormData, TagFormData } from '$lib/types';

// Initialize PocketBase client
export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

// Export the base URL for file access
export const pocketbaseUrl = PUBLIC_POCKETBASE_URL;

// Disable auto-cancellation for better UX
pb.autoCancellation(false);

// Type-safe collection helpers
export const collections = {
	entries: 'entries',
	projects: 'projects',
	tags: 'tags'
} as const;

// Entry operations
export const entryService = {
	async getAll(options?: { filter?: string; sort?: string; expand?: string }): Promise<Entry[]> {
		const records = await pb.collection(collections.entries).getFullList<Entry>({
			filter: options?.filter ?? 'archived = false',
			sort: options?.sort ?? '-created',
			expand: options?.expand ?? 'project,tags'
		});
		return records;
	},

	async getById(id: string): Promise<Entry> {
		return await pb.collection(collections.entries).getOne<Entry>(id, {
			expand: 'project,tags,linked_entries,promoted_from'
		});
	},

	async getByMode(mode: string): Promise<Entry[]> {
		return await pb.collection(collections.entries).getFullList<Entry>({
			filter: `mode = "${mode}" && archived = false`,
			sort: '-created',
			expand: 'project,tags'
		});
	},

	async getByProject(projectId: string): Promise<Entry[]> {
		return await pb.collection(collections.entries).getFullList<Entry>({
			filter: `project = "${projectId}" && archived = false`,
			sort: '-created',
			expand: 'tags'
		});
	},

	async create(data: EntryFormData): Promise<Entry> {
		// If there are file attachments, use FormData
		if (data.attachments && data.attachments.length > 0) {
			const formData = new FormData();
			formData.append('mode', data.mode);
			formData.append('title', data.title);
			formData.append('content', data.content);
			formData.append('archived', 'false');

			if (data.url) formData.append('url', data.url);
			if (data.language) formData.append('language', data.language);
			if (data.project) formData.append('project', data.project);
			if (data.promoted_from) formData.append('promoted_from', data.promoted_from);

			// Tags are a relation array
			data.tags.forEach((tag) => formData.append('tags', tag));

			// Linked entries
			data.linked_entries?.forEach((entry) => formData.append('linked_entries', entry));

			// Append each file
			data.attachments.forEach((file) => {
				formData.append('attachments', file);
			});

			return await pb.collection(collections.entries).create<Entry>(formData);
		}

		// No attachments, use regular object
		const { attachments, ...rest } = data;
		return await pb.collection(collections.entries).create<Entry>({
			...rest,
			archived: false
		});
	},

	async update(id: string, data: Partial<EntryFormData>): Promise<Entry> {
		// If there are new file attachments, use FormData
		if (data.attachments && data.attachments.length > 0) {
			const formData = new FormData();

			if (data.mode) formData.append('mode', data.mode);
			if (data.title) formData.append('title', data.title);
			if (data.content !== undefined) formData.append('content', data.content);
			if (data.url !== undefined) formData.append('url', data.url || '');
			if (data.language !== undefined) formData.append('language', data.language || '');
			if (data.project !== undefined) formData.append('project', data.project || '');
			if (data.promoted_from) formData.append('promoted_from', data.promoted_from);

			// Tags are a relation array
			data.tags?.forEach((tag) => formData.append('tags', tag));

			// Linked entries
			data.linked_entries?.forEach((entry) => formData.append('linked_entries', entry));

			// Append each new file
			data.attachments.forEach((file) => {
				formData.append('attachments', file);
			});

			return await pb.collection(collections.entries).update<Entry>(id, formData);
		}

		// No new attachments, use regular object
		const { attachments, ...rest } = data;
		return await pb.collection(collections.entries).update<Entry>(id, rest);
	},

	async removeAttachment(id: string, filename: string): Promise<Entry> {
		// To remove a file in PocketBase, set the field to the remaining files
		const entry = await this.getById(id);
		const remainingAttachments = entry.attachments.filter((f) => f !== filename);

		// PocketBase requires setting 'attachments-' to remove files
		return await pb.collection(collections.entries).update<Entry>(id, {
			'attachments-': [filename]
		});
	},

	async archive(id: string): Promise<Entry> {
		return await pb.collection(collections.entries).update<Entry>(id, { archived: true });
	},

	async restore(id: string): Promise<Entry> {
		return await pb.collection(collections.entries).update<Entry>(id, { archived: false });
	},

	async delete(id: string): Promise<boolean> {
		return await pb.collection(collections.entries).delete(id);
	},

	async promote(id: string, toMode: Entry['mode']): Promise<Entry> {
		const original = await this.getById(id);
		const newEntry = await this.create({
			mode: toMode,
			title: original.title,
			content: original.content,
			url: original.url,
			language: original.language,
			project: original.project,
			tags: original.tags
		});
		// Link back to original
		await this.update(newEntry.id, { promoted_from: id } as Partial<EntryFormData>);
		return newEntry;
	}
};

// Project operations
export const projectService = {
	async getAll(includeArchived = false): Promise<Project[]> {
		const filter = includeArchived ? '' : 'status != "archived"';
		return await pb.collection(collections.projects).getFullList<Project>({
			filter,
			sort: '-updated'
		});
	},

	async getById(id: string): Promise<Project> {
		return await pb.collection(collections.projects).getOne<Project>(id);
	},

	async create(data: ProjectFormData): Promise<Project> {
		return await pb.collection(collections.projects).create<Project>(data);
	},

	async update(id: string, data: Partial<ProjectFormData>): Promise<Project> {
		return await pb.collection(collections.projects).update<Project>(id, data);
	},

	async delete(id: string): Promise<boolean> {
		return await pb.collection(collections.projects).delete(id);
	},

	async getEntryCounts(projectId: string): Promise<Record<string, number>> {
		const entries = await entryService.getByProject(projectId);
		return entries.reduce(
			(acc, entry) => {
				acc[entry.mode] = (acc[entry.mode] || 0) + 1;
				acc.total = (acc.total || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);
	}
};

// Tag operations
export const tagService = {
	async getAll(): Promise<Tag[]> {
		return await pb.collection(collections.tags).getFullList<Tag>({
			sort: 'name'
		});
	},

	async getById(id: string): Promise<Tag> {
		return await pb.collection(collections.tags).getOne<Tag>(id);
	},

	async getByName(name: string): Promise<Tag | null> {
		try {
			const records = await pb.collection(collections.tags).getList<Tag>(1, 1, {
				filter: `name = "${name.toLowerCase()}"`
			});
			return records.items[0] || null;
		} catch {
			return null;
		}
	},

	async create(data: TagFormData): Promise<Tag> {
		return await pb.collection(collections.tags).create<Tag>({
			...data,
			name: data.name.toLowerCase(),
			auto_generated: false
		});
	},

	async findOrCreate(name: string): Promise<Tag> {
		const existing = await this.getByName(name);
		if (existing) return existing;
		return await this.create({ name });
	},

	async update(id: string, data: Partial<TagFormData>): Promise<Tag> {
		if (data.name) {
			data.name = data.name.toLowerCase();
		}
		return await pb.collection(collections.tags).update<Tag>(id, data);
	},

	async delete(id: string): Promise<boolean> {
		return await pb.collection(collections.tags).delete(id);
	},

	async merge(sourceId: string, targetId: string): Promise<void> {
		// Get all entries with source tag
		const entries = await pb.collection(collections.entries).getFullList<Entry>({
			filter: `tags ~ "${sourceId}"`
		});

		// Update each entry to use target tag instead
		for (const entry of entries) {
			const newTags = entry.tags.filter((t) => t !== sourceId);
			if (!newTags.includes(targetId)) {
				newTags.push(targetId);
			}
			await entryService.update(entry.id, { tags: newTags } as Partial<EntryFormData>);
		}

		// Delete source tag
		await this.delete(sourceId);
	}
};

// Auth helpers
export const authService = {
	get isLoggedIn(): boolean {
		return pb.authStore.isValid;
	},

	get user() {
		return pb.authStore.model;
	},

	async login(email: string, password: string) {
		return await pb.collection('users').authWithPassword(email, password);
	},

	logout() {
		pb.authStore.clear();
	},

	onAuthChange(callback: (isLoggedIn: boolean) => void) {
		return pb.authStore.onChange(() => {
			callback(pb.authStore.isValid);
		});
	}
};

// Real-time subscriptions
export const subscribeToEntries = (callback: (data: { action: string; record: Entry }) => void) => {
	if (!browser) return () => {};
	return pb.collection(collections.entries).subscribe('*', callback);
};

export const subscribeToProjects = (
	callback: (data: { action: string; record: Project }) => void
) => {
	if (!browser) return () => {};
	return pb.collection(collections.projects).subscribe('*', callback);
};

export const unsubscribeAll = () => {
	pb.collection(collections.entries).unsubscribe();
	pb.collection(collections.projects).unsubscribe();
	pb.collection(collections.tags).unsubscribe();
};
