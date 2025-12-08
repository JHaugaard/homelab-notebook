import type { LayoutServerLoad } from './$types';
import type { Entry, Project, Tag } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Use the authenticated PocketBase instance from hooks.server.ts
	const pb = locals.pb;

	try {
		// Load all data in parallel using the server's authenticated connection
		const [entries, projects, tags] = await Promise.all([
			pb.collection('entries').getFullList<Entry>({
				filter: 'archived = false',
				sort: '-created',
				expand: 'project,tags'
			}),
			pb.collection('projects').getFullList<Project>({
				filter: 'status != "archived"',
				sort: '-updated'
			}),
			pb.collection('tags').getFullList<Tag>({
				sort: 'name'
			})
		]);

		return {
			entries,
			projects,
			tags
		};
	} catch (error) {
		console.error('Failed to load data:', error);
		// Return empty arrays on error so the app still renders
		return {
			entries: [] as Entry[],
			projects: [] as Project[],
			tags: [] as Tag[]
		};
	}
};
