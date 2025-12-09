import type { LayoutServerLoad } from './$types';
import type { Entry, Project, Tag } from '$lib/types';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Use the authenticated PocketBase instance from hooks.server.ts
	const pb = locals.pb;

	// Debug: Log connection info
	console.log('[DB Debug] PocketBase URL:', PUBLIC_POCKETBASE_URL);
	console.log('[DB Debug] Auth valid:', pb.authStore.isValid);
	console.log('[DB Debug] Auth token exists:', !!pb.authStore.token);
	console.log('[DB Debug] User:', pb.authStore.model?.email || 'none');

	try {
		// First, test basic connectivity
		console.log('[DB Debug] Testing PocketBase health...');
		const healthStart = Date.now();
		try {
			const health = await pb.health.check();
			console.log('[DB Debug] Health check passed in', Date.now() - healthStart, 'ms:', health);
		} catch (healthError) {
			console.error('[DB Debug] Health check FAILED:', healthError);
		}

		// Load all data in parallel using the server's authenticated connection
		console.log('[DB Debug] Fetching collections...');
		const fetchStart = Date.now();
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

		console.log('[DB Debug] Fetch completed in', Date.now() - fetchStart, 'ms');
		console.log('[DB Debug] Loaded:', entries.length, 'entries,', projects.length, 'projects,', tags.length, 'tags');

		return {
			entries,
			projects,
			tags
		};
	} catch (error) {
		console.error('[DB Debug] Failed to load data:', error);
		console.error('[DB Debug] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
		// Return empty arrays on error so the app still renders
		return {
			entries: [] as Entry[],
			projects: [] as Project[],
			tags: [] as Tag[]
		};
	}
};
