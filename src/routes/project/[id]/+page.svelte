<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Edit, Trash2, ArrowLeft, FolderOpen, Calendar, Clock, ArrowUpRight, ArrowUp, Link2 } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge, Modal } from '$lib/components/ui';
	import { PromoteEntryModal, LinkEntriesModal } from '$lib/components/features';
	import { entries, toasts } from '$lib/stores';
	import { entryService } from '$lib/services/pocketbase';
	import type { Entry } from '$lib/types';
	import { formatDate, formatTime } from '$lib/utils';

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
			toasts.error('Entry not found');
			goto('/project');
		} finally {
			loading = false;
		}
	});

	async function handleDelete() {
		if (!entry) return;

		try {
			await entries.delete(entry.id);
			toasts.success('Entry deleted');
			goto('/project');
		} catch (error) {
			console.error('Failed to delete entry:', error);
			toasts.error('Failed to delete entry');
		}
	}

	function renderMarkdown(text: string): string {
		if (!text) return '';

		return text
			.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
			.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
			.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
			.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/gim, '<em>$1</em>')
			.replace(
				/```(\w*)\n([\s\S]*?)```/gim,
				'<pre class="bg-[var(--color-surface-hover)] p-3 rounded-md my-2 overflow-x-auto"><code>$2</code></pre>'
			)
			.replace(
				/`(.*?)`/gim,
				'<code class="bg-[var(--color-surface-hover)] px-1.5 py-0.5 rounded text-sm">$1</code>'
			)
			.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4">$1</li>')
			.replace(/\[x\]/gim, '<input type="checkbox" checked disabled class="mr-2">')
			.replace(/\[\s?\]/gim, '<input type="checkbox" disabled class="mr-2">')
			.replace(
				/\[([^\]]+)\]\(([^)]+)\)/gim,
				'<a href="$2" class="text-[var(--color-blue)] underline" target="_blank" rel="noopener">$1</a>'
			)
			.replace(/\n/gim, '<br>');
	}
</script>

<svelte:head>
	<title>{entry?.title || 'Loading...'} | Project | Homelab Notebook</title>
</svelte:head>

{#if loading}
	<div class="flex-1 flex items-center justify-center">
		<p class="text-[var(--color-text-muted)]">Loading...</p>
	</div>
{:else if entry}
	<Header title={entry.title} mode="project">
		{#snippet actions()}
			<Button variant="ghost" onclick={() => goto('/project')}>
				<ArrowLeft class="w-4 h-4" />
				Back
			</Button>
			<Button variant="secondary" onclick={() => (showPromoteModal = true)}>
				<ArrowUp class="w-4 h-4" />
				Promote
			</Button>
			<Button variant="ghost" onclick={() => (showLinkModal = true)}>
				<Link2 class="w-4 h-4" />
			</Button>
			<Button variant="secondary" onclick={() => goto(`/project/${entry.id}/edit`)}>
				<Edit class="w-4 h-4" />
				Edit
			</Button>
			<Button variant="ghost" onclick={() => (showDeleteModal = true)}>
				<Trash2 class="w-4 h-4 text-red-500" />
			</Button>
		{/snippet}
	</Header>

	<div class="flex-1 overflow-y-auto p-6">
		<div class="max-w-3xl mx-auto">
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
					<span>{formatDate(entry.created)}</span>
				</div>
				<div class="flex items-center gap-1.5">
					<Clock class="w-4 h-4" />
					<span>{formatTime(entry.created)}</span>
				</div>
			</div>

			<!-- Tags -->
			{#if entry.expand?.tags && entry.expand.tags.length > 0}
				<div class="flex flex-wrap gap-2 mb-6">
					{#each entry.expand.tags as tag}
						<Badge variant="project">{tag.name}</Badge>
					{/each}
				</div>
			{/if}

			<!-- Content -->
			{#if entry.content}
				<div class="prose prose-sm max-w-none text-[var(--color-text)]">
					{@html renderMarkdown(entry.content)}
				</div>
			{:else}
				<p class="text-[var(--color-text-muted)] italic">No content</p>
			{/if}

			<!-- Actions -->
			<div class="mt-8 pt-6 border-t border-[var(--color-border)]">
				<h3 class="text-sm font-medium text-[var(--color-text-muted)] mb-3">Actions</h3>
				<div class="flex gap-2">
					<Button variant="secondary" onclick={() => goto(`/reference/new?from=${entry.id}`)}>
						<ArrowUpRight class="w-4 h-4" />
						Distill to Reference
					</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- Delete confirmation modal -->
	<Modal open={showDeleteModal} title="Delete Entry" onclose={() => (showDeleteModal = false)}>
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
