<script lang="ts">
	import { Plus, Link, ExternalLink, FolderOpen } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge } from '$lib/components/ui';
	import { researchEntries } from '$lib/stores';
	import { formatRelativeTime, extractDomain, truncate } from '$lib/utils';
</script>

<svelte:head>
	<title>Research | Homelab Notebook</title>
</svelte:head>

<Header title="Research" mode="research" subtitle="Resources, links, and articles">
	{#snippet actions()}
		<Button variant="primary" onclick={() => window.location.href = '/research/new'}>
			<Plus class="w-4 h-4" />
			New Resource
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto p-6">
	{#if $researchEntries.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each $researchEntries as entry}
				<a
					href="/research/{entry.id}"
					class="flex flex-col p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-sm transition-all no-underline group"
				>
					<!-- Icon and title -->
					<div class="flex items-start gap-3 mb-2">
						<div class="p-2 rounded-md bg-blue-50 text-blue-600">
							<Link class="w-4 h-4" />
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)]">
								{entry.title}
							</h3>
							{#if entry.url}
								<div class="flex items-center gap-1 mt-0.5">
									<span class="text-xs text-[var(--color-text-muted)] truncate">
										{extractDomain(entry.url)}
									</span>
									<ExternalLink class="w-3 h-3 text-[var(--color-text-muted)]" />
								</div>
							{/if}
						</div>
					</div>

					<!-- Content preview -->
					{#if entry.content}
						<p class="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
							{truncate(entry.content, 120)}
						</p>
					{/if}

					<!-- Tags -->
					{#if entry.expand?.tags && entry.expand.tags.length > 0}
						<div class="flex flex-wrap gap-1 mb-3">
							{#each entry.expand.tags.slice(0, 4) as tag}
								<Badge size="sm">{tag.name}</Badge>
							{/each}
							{#if entry.expand.tags.length > 4}
								<Badge size="sm" variant="outline">+{entry.expand.tags.length - 4}</Badge>
							{/if}
						</div>
					{/if}

					<!-- Footer -->
					<div class="flex items-center justify-between mt-auto pt-2 border-t border-[var(--color-border)]">
						{#if entry.expand?.project}
							<div class="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
								<FolderOpen class="w-3 h-3" />
								<span class="truncate max-w-24">{entry.expand.project.name}</span>
							</div>
						{:else}
							<div></div>
						{/if}
						<span class="text-xs text-[var(--color-text-muted)]">
							{formatRelativeTime(entry.created)}
						</span>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<div class="p-4 rounded-full bg-blue-50 mb-4">
				<Link class="w-8 h-8 text-blue-600" />
			</div>
			<h3 class="text-lg font-medium text-[var(--color-text)] mb-2">No research entries yet</h3>
			<p class="text-sm text-[var(--color-text-muted)] mb-4 max-w-md">
				Start capturing resources, links, and articles you discover while learning.
			</p>
			<Button variant="primary" onclick={() => window.location.href = '/research/new'}>
				<Plus class="w-4 h-4" />
				Add your first resource
			</Button>
		</div>
	{/if}
</div>
