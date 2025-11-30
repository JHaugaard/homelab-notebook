<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Edit, Trash2, ArrowLeft, FolderOpen, Calendar, Clock, Link2, ArrowUp } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge, Modal } from '$lib/components/ui';
	import { PromoteEntryModal, LinkEntriesModal } from '$lib/components/features';
	import { entries, toasts } from '$lib/stores';
	import { entryService } from '$lib/services/pocketbase';
	import type { Entry } from '$lib/types';
	import { formatDate, estimateReadingTime } from '$lib/utils';

	let entry = $state<Entry | null>(null);
	let loading = $state(true);
	let showDeleteModal = $state(false);
	let showPromoteModal = $state(false);
	let showLinkModal = $state(false);

	const id = $derived($page.params.id);

	onMount(async () => {
		try {
			entry = await entryService.getById(id);
		} catch (error) {
			console.error('Failed to load entry:', error);
			toasts.error('Guide not found');
			goto('/reference');
		} finally {
			loading = false;
		}
	});

	async function handleDelete() {
		if (!entry) return;

		try {
			await entries.delete(entry.id);
			toasts.success('Guide deleted');
			goto('/reference');
		} catch (error) {
			console.error('Failed to delete entry:', error);
			toasts.error('Failed to delete guide');
		}
	}

	function renderMarkdown(text: string): string {
		if (!text) return '';

		return text
			.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
			.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-3 pb-2 border-b border-[var(--color-border)]">$1</h2>')
			.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
			.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/gim, '<em>$1</em>')
			.replace(
				/```(\w*)\n([\s\S]*?)```/gim,
				'<pre class="bg-[var(--color-surface-hover)] p-4 rounded-md my-4 overflow-x-auto text-sm"><code>$2</code></pre>'
			)
			.replace(
				/`(.*?)`/gim,
				'<code class="bg-[var(--color-surface-hover)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
			)
			.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 my-1">$1</li>')
			.replace(/\[x\]/gim, '<input type="checkbox" checked disabled class="mr-2">')
			.replace(/\[\s?\]/gim, '<input type="checkbox" disabled class="mr-2">')
			.replace(
				/\[([^\]]+)\]\(([^)]+)\)/gim,
				'<a href="$2" class="text-[var(--color-blue)] underline" target="_blank" rel="noopener">$1</a>'
			)
			.replace(/\n\n/gim, '</p><p class="my-3">')
			.replace(/\n/gim, '<br>');
	}
</script>

<svelte:head>
	<title>{entry?.title || 'Loading...'} | Reference | Homelab Notebook</title>
</svelte:head>

{#if loading}
	<div class="flex-1 flex items-center justify-center">
		<p class="text-[var(--color-text-muted)]">Loading...</p>
	</div>
{:else if entry}
	<Header title={entry.title} mode="reference">
		{#snippet actions()}
			<Button variant="ghost" onclick={() => goto('/reference')}>
				<ArrowLeft class="w-4 h-4" />
				Back
			</Button>
			<Button variant="secondary" onclick={() => (showPromoteModal = true)}>
				<ArrowUp class="w-4 h-4" />
				Move
			</Button>
			<Button variant="ghost" onclick={() => (showLinkModal = true)}>
				<Link2 class="w-4 h-4" />
			</Button>
			<Button variant="secondary" onclick={() => goto(`/reference/${entry.id}/edit`)}>
				<Edit class="w-4 h-4" />
				Edit
			</Button>
			<Button variant="ghost" onclick={() => (showDeleteModal = true)}>
				<Trash2 class="w-4 h-4 text-red-500" />
			</Button>
		{/snippet}
	</Header>

	<div class="flex-1 overflow-y-auto">
		<article class="max-w-3xl mx-auto px-6 py-8">
			<!-- Meta info -->
			<div class="flex flex-wrap items-center gap-4 mb-6 text-sm text-[var(--color-text-muted)]">
				{#if entry.expand?.project}
					<div class="flex items-center gap-1.5">
						<FolderOpen class="w-4 h-4" />
						<a
							href="/projects/{entry.expand.project.id}"
							class="hover:text-[var(--color-text)]"
						>
							{entry.expand.project.name}
						</a>
					</div>
				{/if}
				<div class="flex items-center gap-1.5">
					<Calendar class="w-4 h-4" />
					<span>Updated {formatDate(entry.updated)}</span>
				</div>
				{#if entry.content}
					<div class="flex items-center gap-1.5">
						<Clock class="w-4 h-4" />
						<span>{estimateReadingTime(entry.content)} min read</span>
					</div>
				{/if}
			</div>

			<!-- Tags -->
			{#if entry.expand?.tags && entry.expand.tags.length > 0}
				<div class="flex flex-wrap gap-2 mb-8">
					{#each entry.expand.tags as tag}
						<Badge variant="reference">{tag.name}</Badge>
					{/each}
				</div>
			{/if}

			<!-- Content -->
			{#if entry.content}
				<div class="prose prose-lg max-w-none text-[var(--color-text)] leading-relaxed">
					{@html renderMarkdown(entry.content)}
				</div>
			{:else}
				<p class="text-[var(--color-text-muted)] italic">No content</p>
			{/if}

			<!-- Related project notes -->
			{#if entry.expand?.promoted_from || (entry.expand?.linked_entries && entry.expand.linked_entries.length > 0)}
				<div class="mt-12 pt-6 border-t border-[var(--color-border)]">
					<h3 class="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] mb-4">
						<Link2 class="w-4 h-4" />
						Related Project Notes
					</h3>
					<div class="space-y-2">
						{#if entry.expand?.promoted_from}
							<a
								href="/project/{entry.expand.promoted_from.id}"
								class="block p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors no-underline"
							>
								<p class="text-sm font-medium text-[var(--color-text)]">
									{entry.expand.promoted_from.title}
								</p>
								<p class="text-xs text-[var(--color-text-muted)]">Original source</p>
							</a>
						{/if}
						{#if entry.expand?.linked_entries}
							{#each entry.expand.linked_entries as linked}
								<a
									href="/{linked.mode}/{linked.id}"
									class="block p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors no-underline"
								>
									<p class="text-sm font-medium text-[var(--color-text)]">{linked.title}</p>
									<p class="text-xs text-[var(--color-text-muted)] capitalize">{linked.mode}</p>
								</a>
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		</article>
	</div>

	<!-- Delete confirmation modal -->
	<Modal open={showDeleteModal} title="Delete Guide" onclose={() => (showDeleteModal = false)}>
		<p class="text-sm text-[var(--color-text-secondary)]">
			Are you sure you want to delete "{entry.title}"? This action cannot be undone.
		</p>

		{#snippet footer()}
			<div class="flex justify-end gap-2">
				<Button variant="ghost" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="danger" onclick={handleDelete}>Delete</Button>
			</div>
		{/snippet}
	</Modal>

	<!-- Promote modal -->
	<PromoteEntryModal
		bind:open={showPromoteModal}
		{entry}
		onclose={() => (showPromoteModal = false)}
	/>

	<!-- Link entries modal -->
	<LinkEntriesModal
		bind:open={showLinkModal}
		{entry}
		onclose={() => (showLinkModal = false)}
	/>
{/if}
