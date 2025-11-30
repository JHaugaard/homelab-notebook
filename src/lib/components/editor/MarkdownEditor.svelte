<script lang="ts">
	import { Eye, Edit3 } from 'lucide-svelte';

	interface Props {
		value: string;
		placeholder?: string;
		minRows?: number;
		maxRows?: number;
		minHeight?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Write your content here...',
		minRows = 6,
		maxRows = 20,
		minHeight
	}: Props = $props();

	// Calculate min height from rows or explicit minHeight
	let calculatedMinHeight = $derived(minHeight ?? `${minRows * 24}px`);

	let showPreview = $state(false);

	// Simple markdown to HTML conversion for preview
	function renderMarkdown(text: string): string {
		if (!text) return '';

		return text
			// Headers
			.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
			.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
			.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
			// Bold and italic
			.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
			.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/gim, '<em>$1</em>')
			// Code blocks
			.replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre class="bg-[var(--color-surface-hover)] p-3 rounded-md my-2 overflow-x-auto"><code>$2</code></pre>')
			// Inline code
			.replace(/`(.*?)`/gim, '<code class="bg-[var(--color-surface-hover)] px-1.5 py-0.5 rounded text-sm">$1</code>')
			// Lists
			.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4">$1</li>')
			.replace(/(<li.*<\/li>)/gim, '<ul class="list-disc my-2">$1</ul>')
			// Checkboxes
			.replace(/\[x\]/gim, '<input type="checkbox" checked disabled class="mr-2">')
			.replace(/\[\s?\]/gim, '<input type="checkbox" disabled class="mr-2">')
			// Links
			.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-[var(--color-blue)] underline" target="_blank" rel="noopener">$1</a>')
			// Line breaks
			.replace(/\n/gim, '<br>');
	}
</script>

<div class="border border-[var(--color-border)] rounded-md overflow-hidden">
	<!-- Toolbar -->
	<div class="flex items-center justify-between px-3 py-2 bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
		<span class="text-xs text-[var(--color-text-muted)]">Markdown supported</span>
		<button
			type="button"
			class="flex items-center gap-1.5 px-2 py-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] rounded transition-colors"
			onclick={() => (showPreview = !showPreview)}
		>
			{#if showPreview}
				<Edit3 class="w-3.5 h-3.5" />
				Edit
			{:else}
				<Eye class="w-3.5 h-3.5" />
				Preview
			{/if}
		</button>
	</div>

	<!-- Editor / Preview -->
	{#if showPreview}
		<div
			class="p-3 min-h-[150px] max-h-[400px] overflow-y-auto prose prose-sm text-[var(--color-text)]"
		>
			{#if value.trim()}
				{@html renderMarkdown(value)}
			{:else}
				<p class="text-[var(--color-text-muted)] italic">Nothing to preview</p>
			{/if}
		</div>
	{:else}
		<textarea
			bind:value
			{placeholder}
			rows={minRows}
			class="w-full p-3 text-sm bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none resize-y"
			style="min-height: {calculatedMinHeight}; max-height: {maxRows * 24}px;"
		></textarea>
	{/if}
</div>
