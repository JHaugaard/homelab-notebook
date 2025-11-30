<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { AppShell, Toast } from '$lib/components/layout';
	import { entries, projects, tags, showGlobalSearch, showQuickCapture, toasts } from '$lib/stores';
	import { isMac } from '$lib/utils';
	import GlobalSearch from '$lib/components/nav/GlobalSearch.svelte';
	import QuickCaptureModal from '$lib/components/features/QuickCaptureModal.svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		// Load data with timeout - don't block indefinitely
		const timeout = (ms: number) => new Promise((_, reject) =>
			setTimeout(() => reject(new Error('Timeout')), ms)
		);

		const loadWithTimeout = async () => {
			const loadPromises = [
				entries.load().catch((e) => console.error('Failed to load entries:', e)),
				projects.load().catch((e) => console.error('Failed to load projects:', e)),
				tags.load().catch((e) => console.error('Failed to load tags:', e))
			];

			await Promise.race([
				Promise.all(loadPromises),
				timeout(5000) // 5 second timeout
			]);
		};

		try {
			await loadWithTimeout();
		} catch (e) {
			console.error('Data loading failed or timed out:', e);
			toasts.warning('Could not connect to database. Running in offline mode.');
		}

		loading = false;
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
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if loading}
	<div class="fixed inset-0 flex items-center justify-center bg-[var(--color-background)]" transition:fade={{ duration: 200 }}>
		<div class="text-center">
			<div class="w-10 h-10 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mx-auto"></div>
			<p class="mt-4 text-sm text-[var(--color-text-muted)]">Loading your notebook...</p>
		</div>
	</div>
{:else}
	<AppShell>
		{@render children()}
	</AppShell>

	<!-- Global modals -->
	<GlobalSearch />
	<QuickCaptureModal />

	<!-- Toast notifications -->
	<Toast />
{/if}
