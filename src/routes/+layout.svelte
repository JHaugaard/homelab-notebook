<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { AppShell, Toast } from '$lib/components/layout';
	import { entries, projects, tags, showGlobalSearch, showQuickCapture, showNewProjectModal, toasts } from '$lib/stores';
	import { isMac } from '$lib/utils';
	import GlobalSearch from '$lib/components/nav/GlobalSearch.svelte';
	import QuickCaptureModal from '$lib/components/features/QuickCaptureModal.svelte';
	import NewProjectModal from '$lib/components/features/NewProjectModal.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let error = $state<string | null>(null);

	onMount(() => {
		// Load data in the background - don't block rendering
		Promise.all([
			entries.load().catch((e) => console.error('Failed to load entries:', e)),
			projects.load().catch((e) => console.error('Failed to load projects:', e)),
			tags.load().catch((e) => console.error('Failed to load tags:', e))
		]).catch((e) => {
			console.error('Data loading failed:', e);
			toasts.warning('Could not connect to database. Some features may be unavailable.');
		});
	});

	// Global keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
		if (!browser) return;

		const isMod = isMac() ? e.metaKey : e.ctrlKey;

		// Cmd/Ctrl + K - Global search
		if (isMod && e.key === 'k') {
			e.preventDefault();
			$showGlobalSearch = !$showGlobalSearch;
		}

		// Cmd/Ctrl + N - Quick capture
		if (isMod && e.key === 'n') {
			e.preventDefault();
			$showQuickCapture = true;
		}

		// Escape to close modals
		if (e.key === 'Escape') {
			if ($showGlobalSearch) {
				$showGlobalSearch = false;
			} else if ($showQuickCapture) {
				$showQuickCapture = false;
			} else if ($showNewProjectModal) {
				$showNewProjectModal = false;
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<AppShell>
	{@render children()}
</AppShell>

<!-- Global modals -->
<GlobalSearch />
<QuickCaptureModal />
<NewProjectModal />

<!-- Toast notifications -->
<Toast />
