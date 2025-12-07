<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		ExternalLink,
		Edit,
		Trash2,
		ArrowLeft,
		FolderOpen,
		Calendar,
		ArrowUpRight,
		ArrowUp,
		Link2,
		Paperclip
	} from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge, Modal, AttachmentList } from '$lib/components/ui';
	import { PromoteEntryModal, LinkEntriesModal } from '$lib/components/features';
	import { entries, toasts } from '$lib/stores';
	import { entryService } from '$lib/services/pocketbase';
	import type { Entry } from '$lib/types';
	import { formatDate, extractDomain } from '$lib/utils';

	let entry = $state<Entry | null>(null);
	let loading = $state(true);
	let showDeleteModal = $state(false);
	let showPromoteModal = $state(false);
	let showLinkModal = $state(false);

	const id = $derived($page.params.id);

	onMount(async () => {
		if (!id) {
			toasts.error('Entry not found');
			goto('/research');
			return;
		}
		try {
			entry = await entryService.getById(id);
		} catch (error) {
			console.error('Failed to load entry:', error);
			toasts.error('Entry not found');
			goto('/research');
		} finally {
			loading = false;
		}
	});

	async function handleDelete() {
		if (!entry) return;

		try {
			await entries.delete(entry.id);
			toasts.success('Resource deleted');
			goto('/research');
		} catch (error) {
			console.error('Failed to delete entry:', error);
			toasts.error('Failed to delete resource');
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
			.replace(
				/\[([^\]]+)\]\(([^)]+)\)/gim,
				'<a href="$2" class="text-[var(--color-blue)] underline" target="_blank" rel="noopener">$1</a>'
			)
			.replace(/\n/gim, '<br>');
	}
</script>

<svelte:head>
	<title>{entry?.title || 'Loading...'} | Research | Homelab Notebook</title>
</svelte:head>

{#if loading}
	<div class="flex-1 flex items-center justify-center">
		<p class="text-[var(--color-text-muted)]">Loading...</p>
	</div>
{:else if entry}
	<Header title={entry.title} mode="research">
		{#snippet actions()}
			<Button variant="ghost" onclick={() => goto('/research')}>
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
			<Button variant="secondary" onclick={() => entry && goto(`/research/${entry.id}/edit`)}>
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
			<!-- URL Card -->
			{#if entry.url}
				<a
					href={entry.url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-3 p-4 mb-6 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-[var(--color-surface-hover)] transition-all no-underline group"
				>
					<ExternalLink class="w-5 h-5 text-blue-600" />
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-[var(--color-text)] truncate group-hover:text-blue-600">
							{entry.url}
						</p>
						<p class="text-xs text-[var(--color-text-muted)]">{extractDomain(entry.url)}</p>
					</div>
					<ArrowUpRight class="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-blue-600" />
				</a>
			{/if}

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
					<span>Added {formatDate(entry.created)}</span>
				</div>
			</div>

			<!-- Tags -->
			{#if entry.expand?.tags && entry.expand.tags.length > 0}
				<div class="flex flex-wrap gap-2 mb-6">
					{#each entry.expand.tags as tag}
						<Badge variant="research">{tag.name}</Badge>
					{/each}
				</div>
			{/if}

			<!-- Content -->
			{#if entry.content}
				<div class="prose prose-sm max-w-none text-[var(--color-text)]">
					{@html renderMarkdown(entry.content)}
				</div>
			{:else}
				<p class="text-[var(--color-text-muted)] italic">No notes added</p>
			{/if}

			<!-- Attachments -->
			{#if entry.attachments && entry.attachments.length > 0}
				<div class="mt-6 pt-6 border-t border-[var(--color-border)]">
					<h3 class="flex items-center gap-2 text-sm font-medium text-[var(--color-text)] mb-3">
						<Paperclip class="w-4 h-4" />
						Attachments ({entry.attachments.length})
					</h3>
					<AttachmentList attachments={entry.attachments} />
				</div>
			{/if}
		</div>
	</div>

	<!-- Delete confirmation modal -->
	<Modal open={showDeleteModal} title="Delete Resource" onclose={() => (showDeleteModal = false)}>
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
