import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { Entry, Project, Tag, EntryFormData, ProjectFormData, TagFormData, Attachment } from '$lib/types';

// Use internal URL for server-side, public URL for browser
// The internal URL (http://...internal:8080) only works within Fly's network
// Browser requests must use the public HTTPS URL
const POCKETBASE_PUBLIC_URL = 'https://proposaltracker-api.fly.dev';
const pocketbaseUrl = browser ? POCKETBASE_PUBLIC_URL : PUBLIC_POCKETBASE_URL;

// Initialize PocketBase client
export const pb = new PocketBase(pocketbaseUrl);

// Export the base URL for file access (always use public URL for browser file downloads)
export { pocketbaseUrl };

// Load auth from cookies in the browser
// This ensures the client-side auth state is synced with the server-side session
if (browser) {
	pb.authStore.loadFromCookie(document.cookie);
}

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
		// Attachments are now stored as JSON (files already uploaded to Tigris)
		return await pb.collection(collections.entries).create<Entry>({
			mode: data.mode,
			title: data.title,
			content: data.content,
			url: data.url || '',
			language: data.language || '',
			project: data.project || '',
			tags: data.tags,
			linked_entries: data.linked_entries || [],
			promoted_from: data.promoted_from || '',
			attachments: data.attachments || [],
			archived: false
		});
	},

	async update(id: string, data: Partial<EntryFormData>): Promise<Entry> {
		// Attachments are now stored as JSON (files already uploaded to Tigris)
		return await pb.collection(collections.entries).update<Entry>(id, data);
	},

	async removeAttachment(id: string, attachmentKey: string): Promise<Entry> {
		// Remove attachment from the JSON array
		const entry = await this.getById(id);
		const remainingAttachments = entry.attachments.filter((a) => a.key !== attachmentKey);
		return await pb.collection(collections.entries).update<Entry>(id, {
			attachments: remainingAttachments
		});
	},

	async addAttachment(id: string, attachment: Attachment): Promise<Entry> {
		// Add attachment to the JSON array
		const entry = await this.getById(id);
		const updatedAttachments = [...entry.attachments, attachment];
		return await pb.collection(collections.entries).update<Entry>(id, {
			attachments: updatedAttachments
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
