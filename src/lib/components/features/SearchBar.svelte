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

<div class="relative">
	<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
	<input
		bind:this={inputRef}
		type="search"
		placeholder="Search notes... (⌘K)"
		bind:value={$searchQuery}
		class="w-full pl-10 pr-10 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
	/>
	{#if $searchQuery}
		<button
			type="button"
			class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
			onclick={handleClear}
		>
			<X class="w-4 h-4" />
		</button>
	{/if}
</div>
