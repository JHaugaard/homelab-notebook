import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { pb } from '$lib/services/pocketbase';
import type { RecordModel } from 'pocketbase';

// User store
function createAuthStore() {
	const { subscribe, set } = writable<RecordModel | null>(null);

	// Initialize from PocketBase auth store if in browser
	if (browser && pb.authStore.isValid) {
		set(pb.authStore.model);
	}

	// Listen for auth changes
	if (browser) {
		pb.authStore.onChange((token, model) => {
			set(model);
		});
	}

	return {
		subscribe,
		set,
		logout: async () => {
			pb.authStore.clear();
			set(null);
			if (browser) {
				goto('/login');
			}
		},
		refresh: () => {
			if (browser && pb.authStore.isValid) {
				set(pb.authStore.model);
			}
		}
	};
}

export const user = createAuthStore();

// Derived store for checking if user is authenticated
export const isAuthenticated = derived(user, ($user) => $user !== null);
