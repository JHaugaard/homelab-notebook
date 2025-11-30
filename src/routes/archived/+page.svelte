<script lang="ts">
	import { onMount } from 'svelte';
	import { BookOpen, Wrench, FileText, Archive, RotateCcw, Trash2 } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge, Modal } from '$lib/components/ui';
	import { entries, toasts } from '$lib/stores';
	import { entryService } from '$lib/services/pocketbase';
	import { MODE_CONFIGS, type Entry } from '$lib/types';
	import { formatRelativeTime } from '$lib/utils';

	let archivedEntries = $state<Entry[]>([]);
	let loading = $state(true);
	let entryToDelete = $state<string | null>(null);

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	onMount(async () => {
		try {
			archivedEntries = await entryService.getAll({
				filter: 'archived = true',
				sort: '-updated'
			});
		} catch (error) {
			console.error('Failed to load archived entries:', error);
			toasts.error('Failed to load archived entries');
		} finally {
			loading = false;
		}
	});

	async function restoreEntry(id: string) {
		try {
			await entries.restore(id);
			archivedEntries = archivedEntries.filter((e) => e.id !== id);
			toasts.success('Entry restored');
		} catch (error) {
			console.error('Failed to restore entry:', error);
			toasts.error('Failed to restore entry');
		}
	}

	async function deleteEntry() {
		if (!entryToDelete) return;

		try {
			await entryService.delete(entryToDelete);
			archivedEntries = archivedEntries.filter((e) => e.id !== entryToDelete);
			toasts.success('Entry permanently deleted');
		} catch (error) {
			console.error('Failed to delete entry:', error);
			toasts.error('Failed to delete entry');
		} finally {
			entryToDelete = null;
		}
	}
</script>

<svelte:head>
	<title>Archived | Homelab Notebook</title>
</svelte:head>

<Header title="Archived" subtitle="Entries you've archived">
</Header>

<div class="flex-1 overflow-y-auto p-6">
	{#if loading}
		<div class="flex items-center justify-center py-16">
			<p class="text-[var(--color-text-muted)]">Loading...</p>
		</div>
	{:else if archivedEntries.length > 0}
		<div class="space-y-3 max-w-3xl">
			{#each archivedEntries as entry}
				{@const Icon = modeIcons[entry.mode]}
				{@const config = MODE_CONFIGS[entry.mode]}
				<div class="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
					<div class="p-2 rounded-md bg-gray-100">
						<Icon class="w-4 h-4 text-gray-500" />
					</div>

					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<h3 class="font-medium text-[var(--color-text-secondary)] truncate">
								{entry.title}
							</h3>
							<Badge size="sm" variant="outline">{config.label}</Badge>
						</div>
						<p class="text-xs text-[var(--color-text-muted)] mt-0.5">
							Archived {formatRelativeTime(entry.updated)}
						</p>
					</div>

					<div class="flex items-center gap-2">
						<Button variant="ghost" size="sm" onclick={() => restoreEntry(entry.id)}>
							<RotateCcw class="w-4 h-4" />
							Restore
						</Button>
						<Button variant="ghost" size="sm" onclick={() => (entryToDelete = entry.id)}>
							<Trash2 class="w-4 h-4 text-red-500" />
						</Button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<div class="p-4 rounded-full bg-[var(--color-surface-hover)] mb-4">
				<Archive class="w-8 h-8 text-[var(--color-text-muted)]" />
			</div>
			<h3 class="text-lg font-medium text-[var(--color-text)] mb-2">No archived entries</h3>
			<p class="text-sm text-[var(--color-text-muted)]">
				Entries you archive will appear here.
			</p>
		</div>
	{/if}
</div>

<!-- Delete confirmation modal -->
<Modal
	open={entryToDelete !== null}
	title="Permanently Delete"
	onclose={() => (entryToDelete = null)}
>
	<p class="text-sm text-[var(--color-text-secondary)]">
		Are you sure you want to permanently delete this entry? This action cannot be undone.
	</p>

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={() => (entryToDelete = null)}>Cancel</Button>
			<Button variant="danger" onclick={deleteEntry}>Delete Permanently</Button>
		</div>
	{/snippet}
</Modal>
