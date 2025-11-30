import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

// Client-side PocketBase singleton
function createPocketBaseStore() {
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	// Load auth from cookie on client
	if (browser) {
		pb.authStore.loadFromCookie(document.cookie);

		// Update cookie whenever auth changes
		pb.authStore.onChange(() => {
			document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
		});
	}

	return pb;
}

// Export singleton instance
export const pb = browser ? createPocketBaseStore() : null;

// Current user store
export const currentUser = writable(pb?.authStore.model ?? null);

// Update current user when auth changes
if (browser && pb) {
	pb.authStore.onChange((_, model) => {
		currentUser.set(model);
	});
}
