<script lang="ts">
	import { X, Plus } from 'lucide-svelte';
	import type { Tag } from '$lib/types';
	import { Badge } from '$lib/components/ui';
	import { tags as tagsStore } from '$lib/stores';

	interface Props {
		selectedTags: string[];
		availableTags?: Tag[];
		placeholder?: string;
	}

	let { selectedTags = $bindable([]), availableTags, placeholder = 'Add tags...' }: Props = $props();

	// Use provided tags or fall back to store
	let allTags = $derived(availableTags ?? $tagsStore);

	let inputValue = $state('');
	let showSuggestions = $state(false);
	let inputEl: HTMLInputElement;

	// Filter suggestions based on input
	let suggestions = $derived.by(() => {
		if (!inputValue.trim()) return [];
		const query = inputValue.toLowerCase();
		return allTags
			.filter(
				(tag) =>
					tag.name.toLowerCase().includes(query) && !selectedTags.includes(tag.id)
			)
			.slice(0, 5);
	});

	// Get tag objects for selected IDs
	let selectedTagObjects = $derived(
		selectedTags
			.map((id) => allTags.find((t) => t.id === id))
			.filter((t): t is Tag => t !== undefined)
	);

	function addTag(tagId: string) {
		if (!selectedTags.includes(tagId)) {
			selectedTags = [...selectedTags, tagId];
		}
		inputValue = '';
		showSuggestions = false;
		inputEl?.focus();
	}

	function removeTag(tagId: string) {
		selectedTags = selectedTags.filter((id) => id !== tagId);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && inputValue.trim()) {
			e.preventDefault();
			// If there's a matching suggestion, use it
			if (suggestions.length > 0) {
				addTag(suggestions[0].id);
			}
		} else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
			// Remove last tag on backspace when input is empty
			selectedTags = selectedTags.slice(0, -1);
		} else if (e.key === 'Escape') {
			showSuggestions = false;
		}
	}

	function handleFocus() {
		showSuggestions = true;
	}

	function handleBlur() {
		// Delay to allow click on suggestion
		setTimeout(() => {
			showSuggestions = false;
		}, 150);
	}
</script>

<div class="relative">
	<!-- Selected tags and input -->
	<div
		class="flex flex-wrap gap-1.5 p-2 min-h-[42px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus-within:border-[var(--color-border-strong)] focus-within:ring-1 focus-within:ring-[var(--color-border-strong)]"
	>
		{#each selectedTagObjects as tag}
			<Badge size="sm" removable onremove={() => removeTag(tag.id)}>
				{tag.name}
			</Badge>
		{/each}

		<input
			bind:this={inputEl}
			bind:value={inputValue}
			type="text"
			{placeholder}
			class="flex-1 min-w-24 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
			onkeydown={handleKeydown}
			onfocus={handleFocus}
			onblur={handleBlur}
		/>
	</div>

	<!-- Suggestions dropdown -->
	{#if showSuggestions && suggestions.length > 0}
		<div class="absolute z-10 w-full mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-lg overflow-hidden">
			{#each suggestions as tag}
				<button
					type="button"
					class="w-full px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
					onclick={() => addTag(tag.id)}
				>
					{tag.name}
					{#if tag.category}
						<span class="text-xs text-[var(--color-text-muted)] ml-2">({tag.category})</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
