<script lang="ts">
	import { Search, BookOpen, Wrench, FileText, X } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { showGlobalSearch, searchQuery as searchQueryStore, searchResultsByMode, clearSearch } from '$lib/stores';
	import { MODE_CONFIGS } from '$lib/types';
	import { fade, fly } from 'svelte/transition';

	let localQuery = $state('');
	let inputEl: HTMLInputElement;
	let selectedIndex = $state(-1);

	// Sync local query to store with debounce
	$effect(() => {
		const timeout = setTimeout(() => {
			searchQueryStore.set(localQuery);
		}, 150);
		return () => clearTimeout(timeout);
	});

	// Get grouped results from store
	let groupedResults = $derived($searchResultsByMode);

	// Flatten results for keyboard navigation
	let flatResults = $derived.by(() => {
		return [
			...groupedResults.research.map((r) => r.entry),
			...groupedResults.project.map((r) => r.entry),
			...groupedResults.reference.map((r) => r.entry)
		];
	});

	let totalResults = $derived(flatResults.length);

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	function close() {
		$showGlobalSearch = false;
		localQuery = '';
		clearSearch();
		selectedIndex = -1;
	}

	function selectEntry(id: string, mode: string) {
		close();
		goto(`/${mode}/${id}`);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, totalResults - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, -1);
		} else if (e.key === 'Enter' && selectedIndex >= 0) {
			e.preventDefault();
			const entry = flatResults[selectedIndex];
			if (entry) {
				selectEntry(entry.id, entry.mode);
			}
		}
	}

	$effect(() => {
		if ($showGlobalSearch && inputEl) {
			inputEl.focus();
		}
	});

	// Reset selected index when results change
	$effect(() => {
		if (totalResults > 0) {
			selectedIndex = -1;
		}
	});
</script>

{#if $showGlobalSearch}
	<div
		class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
		transition:fade={{ duration: 100 }}
	>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/50"
			onclick={close}
			onkeydown={(e) => e.key === 'Enter' && close()}
			role="button"
			tabindex="-1"
		></div>

		<!-- Search modal -->
		<div
			class="relative w-full max-w-xl bg-[var(--color-surface)] rounded-lg shadow-2xl overflow-hidden"
			transition:fly={{ y: -20, duration: 150 }}
		>
			<!-- Search input -->
			<div class="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
				<Search class="w-5 h-5 text-[var(--color-text-muted)]" />
				<input
					bind:this={inputEl}
					bind:value={localQuery}
					type="text"
					placeholder="Search entries..."
					class="flex-1 bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
					onkeydown={handleKeydown}
				/>
				<button
					class="p-1 rounded hover:bg-[var(--color-surface-hover)]"
					onclick={close}
				>
					<X class="w-4 h-4 text-[var(--color-text-muted)]" />
				</button>
			</div>

			<!-- Results -->
			<div class="max-h-96 overflow-y-auto">
				{#if localQuery.trim()}
					{@const resultIndex = { current: 0 }}
					{#each Object.entries(groupedResults) as [mode, modeResults]}
						{#if modeResults.length > 0}
							{@const Icon = modeIcons[mode as keyof typeof modeIcons]}
							{@const config = MODE_CONFIGS[mode as keyof typeof MODE_CONFIGS]}
							<div class="px-3 py-2">
								<h3 class="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
									<Icon class="w-3.5 h-3.5 {config.color}" />
									{config.label}
								</h3>
								{#each modeResults as result, i}
									{@const globalIndex = resultIndex.current++}
									<button
										class="w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors
											{selectedIndex === globalIndex ? 'bg-[var(--color-surface-active)]' : 'hover:bg-[var(--color-surface-hover)]'}"
										onclick={() => selectEntry(result.entry.id, result.entry.mode)}
									>
										<span class="flex-1 truncate text-sm text-[var(--color-text)]">
											{result.entry.title}
										</span>
									</button>
								{/each}
							</div>
						{/if}
					{/each}

					{#if totalResults === 0}
						<div class="px-4 py-8 text-center text-[var(--color-text-muted)]">
							<p>No results found for "{localQuery}"</p>
						</div>
					{/if}
				{:else}
					<div class="px-4 py-8 text-center text-[var(--color-text-muted)]">
						<p>Type to search across all entries...</p>
					</div>
				{/if}
			</div>

			<!-- Footer hint -->
			<div class="px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)]">
				<p class="text-xs text-[var(--color-text-muted)]">
					<kbd class="px-1.5 py-0.5 bg-[var(--color-surface-hover)] rounded">Enter</kbd> to select
					<span class="mx-2">·</span>
					<kbd class="px-1.5 py-0.5 bg-[var(--color-surface-hover)] rounded">Esc</kbd> to close
				</p>
			</div>
		</div>
	</div>
{/if}
