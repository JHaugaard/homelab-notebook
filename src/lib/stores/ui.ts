import { writable } from 'svelte/store';
import type { EntryMode } from '$lib/types';

// Sidebar state
export const sidebarOpen = writable(true);

// Current active mode (for navigation highlighting)
export const activeMode = writable<EntryMode | null>(null);

// Modal states
export const showQuickCapture = writable(false);
export const showGlobalSearch = writable(false);
export const showNewProjectModal = writable(false);

// Quick capture default mode
export const quickCaptureMode = writable<EntryMode>('research');

// Toast notifications
export interface Toast {
	id: string;
	type: 'success' | 'error' | 'info' | 'warning';
	message: string;
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,

		add(toast: Omit<Toast, 'id'>) {
			const id = Math.random().toString(36).substring(2, 9);
			const newToast = { ...toast, id };

			update((toasts) => [...toasts, newToast]);

			// Auto-remove after duration
			const duration = toast.duration ?? 3000;
			if (duration > 0) {
				setTimeout(() => {
					this.remove(id);
				}, duration);
			}

			return id;
		},

		remove(id: string) {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},

		success(message: string, duration?: number) {
			return this.add({ type: 'success', message, duration });
		},

		error(message: string, duration?: number) {
			return this.add({ type: 'error', message, duration: duration ?? 5000 });
		},

		info(message: string, duration?: number) {
			return this.add({ type: 'info', message, duration });
		},

		warning(message: string, duration?: number) {
			return this.add({ type: 'warning', message, duration: duration ?? 4000 });
		}
	};
}

export const toasts = createToastStore();

// Loading states
export const isLoading = writable(false);
export const loadingMessage = writable('');

export function setLoading(loading: boolean, message = '') {
	isLoading.set(loading);
	loadingMessage.set(message);
}

// Keyboard shortcut state
export const isCommandPaletteOpen = writable(false);

// View preferences
export interface ViewPreferences {
	projectTimelineOrder: 'newest' | 'oldest';
	researchViewMode: 'cards' | 'list';
	referenceViewMode: 'cards' | 'list';
}

const defaultPreferences: ViewPreferences = {
	projectTimelineOrder: 'newest',
	researchViewMode: 'cards',
	referenceViewMode: 'cards'
};

function createPreferencesStore() {
	const stored =
		typeof localStorage !== 'undefined' ? localStorage.getItem('viewPreferences') : null;

	const initial = stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;

	const { subscribe, set, update } = writable<ViewPreferences>(initial);

	return {
		subscribe,

		update(newPrefs: Partial<ViewPreferences>) {
			update((prefs) => {
				const updated = { ...prefs, ...newPrefs };
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('viewPreferences', JSON.stringify(updated));
				}
				return updated;
			});
		},

		reset() {
			set(defaultPreferences);
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('viewPreferences');
			}
		}
	};
}

export const viewPreferences = createPreferencesStore();
