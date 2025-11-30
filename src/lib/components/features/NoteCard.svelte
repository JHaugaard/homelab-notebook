<script lang="ts">
	import { Link, Code, FileText, Copy, Check, ExternalLink } from 'lucide-svelte';
	import type { Note } from '$types';
	import { Tag } from '$components/ui';
	import { formatRelativeTime, truncate, extractDomain } from '$utils';

	interface Props {
		note: Note;
		onclick?: () => void;
	}

	let { note, onclick }: Props = $props();

	let copied = $state(false);

	const typeIcons = {
		url: Link,
		snippet: Code,
		note: FileText
	};

	const Icon = typeIcons[note.type];

	async function handleCopy(e: MouseEvent) {
		e.stopPropagation();
		const textToCopy = note.type === 'url' ? note.url : note.content;
		if (textToCopy) {
			await navigator.clipboard.writeText(textToCopy);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	function handleOpenUrl(e: MouseEvent) {
		e.stopPropagation();
		if (note.url) {
			window.open(note.url, '_blank');
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
	class="p-4 bg-surface border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
	{onclick}
>
	<div class="flex items-start gap-3">
		<div class="p-2 bg-surface-hover rounded-lg">
			<Icon class="w-4 h-4 text-text-muted" />
		</div>

		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2">
				<h3 class="font-medium text-text-primary truncate">{note.title}</h3>
				<span class="text-xs text-text-muted shrink-0">{formatRelativeTime(note.updated)}</span>
			</div>

			{#if note.type === 'url' && note.url}
				<p class="text-sm text-text-muted truncate mt-1">{extractDomain(note.url)}</p>
			{:else if note.content}
				<p class="text-sm text-text-muted line-clamp-2 mt-1">{truncate(note.content, 150)}</p>
			{/if}

			{#if note.expand?.tags && note.expand.tags.length > 0}
				<div class="flex flex-wrap gap-1 mt-2">
					{#each note.expand.tags as tag}
						<Tag name={tag.name} color={tag.color} />
					{/each}
				</div>
			{/if}
		</div>

		<div
			class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
		>
			{#if note.type === 'url' && note.url}
				<button
					type="button"
					class="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded"
					onclick={handleOpenUrl}
					title="Open URL"
				>
					<ExternalLink class="w-4 h-4" />
				</button>
			{/if}
			<button
				type="button"
				class="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded"
				onclick={handleCopy}
				title="Copy"
			>
				{#if copied}
					<Check class="w-4 h-4 text-green-500" />
				{:else}
					<Copy class="w-4 h-4" />
				{/if}
			</button>
		</div>
	</div>
</div>
