<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { AppShell, Toast } from '$lib/components/layout';
	import { entries, projects, tags, showGlobalSearch, showQuickCapture, showNewProjectModal } from '$lib/stores';
	import { isMac } from '$lib/utils';
	import GlobalSearch from '$lib/components/nav/GlobalSearch.svelte';
	import QuickCaptureModal from '$lib/components/features/QuickCaptureModal.svelte';
	import NewProjectModal from '$lib/components/features/NewProjectModal.svelte';
	import type { LayoutData } from './$types';

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	// Initialize stores with server-loaded data
	$effect(() => {
		if (data.entries) {
			entries.set(data.entries);
		}
		if (data.projects) {
			projects.set(data.projects);
		}
		if (data.tags) {
			tags.set(data.tags);
		}
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
