import { writable } from 'svelte/store';
import type { UIState } from '$types';

const initialState: UIState = {
	sidebarOpen: true,
	modalOpen: false,
	modalType: null,
	editingId: null
};

function createUIStore() {
	const { subscribe, set, update } = writable<UIState>(initialState);

	return {
		subscribe,

		toggleSidebar() {
			update((state) => ({ ...state, sidebarOpen: !state.sidebarOpen }));
		},

		openModal(type: UIState['modalType'], editingId: string | null = null) {
			update((state) => ({
				...state,
				modalOpen: true,
				modalType: type,
				editingId
			}));
		},

		closeModal() {
			update((state) => ({
				...state,
				modalOpen: false,
				modalType: null,
				editingId: null
			}));
		},

		reset() {
			set(initialState);
		}
	};
}

export const ui = createUIStore();
