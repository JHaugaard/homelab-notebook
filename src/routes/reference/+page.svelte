<script lang="ts">
	import { Plus, FileText, FolderOpen, Clock, Link2 } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge } from '$lib/components/ui';
	import { referenceEntries } from '$lib/stores';
	import { formatRelativeTime, truncate, estimateReadingTime } from '$lib/utils';
</script>

<svelte:head>
	<title>Reference | Homelab Notebook</title>
</svelte:head>

<Header title="Reference" mode="reference" subtitle="Tutorials and documentation">
	{#snippet actions()}
		<Button variant="primary" onclick={() => window.location.href = '/reference/new'}>
			<Plus class="w-4 h-4" />
			New Guide
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto p-6">
	{#if $referenceEntries.length > 0}
		<div class="space-y-4 max-w-4xl">
			{#each $referenceEntries as entry}
				<a
					href="/reference/{entry.id}"
					class="flex flex-col p-5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-sm transition-all no-underline group"
				>
					<!-- Title row -->
					<div class="flex items-start gap-3 mb-2">
						<div class="p-2 rounded-md bg-green-50 text-green-600 mt-0.5">
							<FileText class="w-5 h-5" />
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
								{entry.title}
							</h3>

							<!-- Meta info -->
							<div class="flex items-center gap-3 mt-1 text-sm text-[var(--color-text-muted)]">
								{#if entry.expand?.project}
									<div class="flex items-center gap-1">
										<FolderOpen class="w-3.5 h-3.5" />
										<span>{entry.expand.project.name}</span>
									</div>
									<span>·</span>
								{/if}
								<div class="flex items-center gap-1">
									<Clock class="w-3.5 h-3.5" />
									<span>Updated {formatRelativeTime(entry.updated)}</span>
								</div>
								{#if entry.content}
									<span>·</span>
									<span>{estimateReadingTime(entry.content)} min read</span>
								{/if}
							</div>
						</div>
					</div>

					<!-- Description preview -->
					{#if entry.content}
						<p class="text-sm text-[var(--color-text-secondary)] mb-3 ml-12 line-clamp-2">
							{truncate(entry.content.replace(/[#*`_\[\]]/g, ''), 200)}
						</p>
					{/if}

					<!-- Tags and linked entries -->
					<div class="flex items-center gap-4 ml-12">
						{#if entry.expand?.tags && entry.expand.tags.length > 0}
							<div class="flex flex-wrap gap-1">
								{#each entry.expand.tags.slice(0, 5) as tag}
									<Badge size="sm" variant="reference">{tag.name}</Badge>
								{/each}
								{#if entry.expand.tags.length > 5}
									<Badge size="sm" variant="outline">+{entry.expand.tags.length - 5}</Badge>
								{/if}
							</div>
						{/if}

						{#if entry.promoted_from || (entry.linked_entries && entry.linked_entries.length > 0)}
							<div class="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
								<Link2 class="w-3.5 h-3.5" />
								<span>
									{#if entry.promoted_from}
										Distilled from project notes
									{:else}
										{entry.linked_entries.length} linked entries
									{/if}
								</span>
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<div class="p-4 rounded-full bg-green-50 mb-4">
				<FileText class="w-8 h-8 text-green-600" />
			</div>
			<h3 class="text-lg font-medium text-[var(--color-text)] mb-2">No reference guides yet</h3>
			<p class="text-sm text-[var(--color-text-muted)] mb-4 max-w-md">
				Create tutorial-style documentation that captures what you've learned.
				Distill your project notes into guides anyone can follow.
			</p>
			<Button variant="primary" onclick={() => window.location.href = '/reference/new'}>
				<Plus class="w-4 h-4" />
				Create your first guide
			</Button>
		</div>
	{/if}
</div>
