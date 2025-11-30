<script lang="ts">
	import { BookOpen, Wrench, FileText, Clock } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Badge } from '$lib/components/ui';
	import { recentEntries } from '$lib/stores';
	import { MODE_CONFIGS } from '$lib/types';
	import { formatRelativeTime, truncate } from '$lib/utils';

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};
</script>

<svelte:head>
	<title>Recent | Homelab Notebook</title>
</svelte:head>

<Header title="Recent" subtitle="Your latest entries">
</Header>

<div class="flex-1 overflow-y-auto p-6">
	{#if $recentEntries.length > 0}
		<div class="space-y-3 max-w-3xl">
			{#each $recentEntries as entry}
				{@const Icon = modeIcons[entry.mode]}
				{@const config = MODE_CONFIGS[entry.mode]}
				<a
					href="/{entry.mode}/{entry.id}"
					class="flex items-start gap-4 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all no-underline group"
				>
					<div class="p-2 rounded-md {config.bgColor}">
						<Icon class="w-4 h-4 {config.color}" />
					</div>

					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<h3 class="font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)]">
								{entry.title}
							</h3>
							<Badge size="sm" variant={entry.mode}>{config.label}</Badge>
						</div>

						{#if entry.content}
							<p class="text-sm text-[var(--color-text-secondary)] line-clamp-2">
								{truncate(entry.content.replace(/[#*`_\[\]]/g, ''), 150)}
							</p>
						{/if}

						{#if entry.expand?.tags && entry.expand.tags.length > 0}
							<div class="flex flex-wrap gap-1 mt-2">
								{#each entry.expand.tags.slice(0, 4) as tag}
									<Badge size="sm">{tag.name}</Badge>
								{/each}
							</div>
						{/if}
					</div>

					<span class="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
						{formatRelativeTime(entry.created)}
					</span>
				</a>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<div class="p-4 rounded-full bg-[var(--color-surface-hover)] mb-4">
				<Clock class="w-8 h-8 text-[var(--color-text-muted)]" />
			</div>
			<h3 class="text-lg font-medium text-[var(--color-text)] mb-2">No recent entries</h3>
			<p class="text-sm text-[var(--color-text-muted)]">
				Entries you create will appear here.
			</p>
		</div>
	{/if}
</div>
