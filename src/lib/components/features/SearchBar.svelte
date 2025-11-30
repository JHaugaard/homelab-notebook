<script lang="ts">
	import { Search, X } from 'lucide-svelte';
	import { searchQuery } from '$stores';

	let inputRef: HTMLInputElement;

	function handleClear() {
		$searchQuery = '';
		inputRef?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		// Global shortcut: Cmd/Ctrl + K to focus search
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			inputRef?.focus();
		}
		// Escape to clear search
		if (e.key === 'Escape' && $searchQuery) {
			handleClear();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative group">
	<Search
		class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-text)] transition-colors"
	/>
	<input
		bind:this={inputRef}
		type="search"
		placeholder="Search notes..."
		bind:value={$searchQuery}
		class="w-full pl-10 pr-16 py-2 bg-[var(--color-surface-hover)] border-none rounded-md text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:bg-[var(--color-background)] focus:ring-1 focus:ring-[var(--color-border-strong)] transition-all"
	/>
	<kbd
		class="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)] bg-[var(--color-background)] border border-[var(--color-border)] rounded"
	>
		<span class="text-xs">&#8984;</span>K
	</kbd>
	{#if $searchQuery}
		<button
			type="button"
			class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded transition-colors"
			onclick={handleClear}
		>
			<X class="w-4 h-4" />
		</button>
	{/if}
</div>
