<script lang="ts">
	import { Search, Link2, X, BookOpen, Wrench, FileText, Check } from 'lucide-svelte';
	import { Modal, Button, Badge } from '$lib/components/ui';
	import { entries, toasts } from '$lib/stores';
	import { MODE_CONFIGS, type Entry } from '$lib/types';

	interface Props {
		open: boolean;
		entry: Entry | null;
		onclose: () => void;
	}

	let { open = $bindable(), entry, onclose }: Props = $props();

	let searchQuery = $state('');
	let selectedEntries = $state<string[]>([]);
	let saving = $state(false);

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	// Filter entries that can be linked (exclude self and already linked)
	let availableEntries = $derived.by(() => {
		if (!entry) return [];

		return $entries
			.filter((e) => {
				// Exclude self
				if (e.id === entry.id) return false;
				// Apply search filter
				if (searchQuery) {
					return e.title.toLowerCase().includes(searchQuery.toLowerCase());
				}
				return true;
			})
			.slice(0, 20); // Limit results
	});

	// Pre-select currently linked entries
	$effect(() => {
		if (entry && open) {
			selectedEntries = entry.linked_entries || [];
		}
	});

	function toggleEntry(id: string) {
		if (selectedEntries.includes(id)) {
			selectedEntries = selectedEntries.filter((e) => e !== id);
		} else {
			selectedEntries = [...selectedEntries, id];
		}
	}

	function handleClose() {
		searchQuery = '';
		selectedEntries = [];
		onclose();
	}

	async function handleSave() {
		if (!entry) return;

		saving = true;
		try {
			await entries.update(entry.id, {
				linked_entries: selectedEntries
			});
			toasts.success('Links updated');
			handleClose();
		} catch (error) {
			console.error('Failed to update links:', error);
			toasts.error('Failed to update links');
		} finally {
			saving = false;
		}
	}
</script>

<Modal {open} title="Link Related Entries" onclose={handleClose}>
	{#if entry}
		<div class="space-y-4">
			<!-- Current entry info -->
			<div class="p-3 rounded-lg bg-[var(--color-surface-hover)]">
				<p class="text-sm text-[var(--color-text-muted)] mb-1">Linking from</p>
				<p class="font-medium text-[var(--color-text)]">{entry.title}</p>
			</div>

			<!-- Search -->
			<div class="relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search entries to link..."
					class="w-full pl-10 pr-4 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-border-strong)]"
				/>
			</div>

			<!-- Selected count -->
			{#if selectedEntries.length > 0}
				<div class="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
					<Link2 class="w-4 h-4" />
					<span>{selectedEntries.length} entries selected</span>
				</div>
			{/if}

			<!-- Entry list -->
			<div class="max-h-64 overflow-y-auto space-y-1">
				{#each availableEntries as availableEntry}
					{@const Icon = modeIcons[availableEntry.mode]}
					{@const config = MODE_CONFIGS[availableEntry.mode]}
					{@const isSelected = selectedEntries.includes(availableEntry.id)}
					<button
						type="button"
						onclick={() => toggleEntry(availableEntry.id)}
						class="w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors
							{isSelected
								? 'bg-[var(--color-surface-active)] border border-[var(--color-border-strong)]'
								: 'hover:bg-[var(--color-surface-hover)]'}"
					>
						<div class="p-1.5 rounded {config.bgColor}">
							<Icon class="w-3.5 h-3.5 {config.color}" />
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm text-[var(--color-text)] truncate">{availableEntry.title}</p>
							<p class="text-xs text-[var(--color-text-muted)] capitalize">{config.label}</p>
						</div>
						{#if isSelected}
							<Check class="w-4 h-4 text-green-600" />
						{/if}
					</button>
				{:else}
					<p class="text-center text-sm text-[var(--color-text-muted)] py-4">
						{searchQuery ? 'No entries match your search' : 'No other entries available'}
					</p>
				{/each}
			</div>
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={handleClose}>Cancel</Button>
			<Button onclick={handleSave} disabled={saving}>
				{saving ? 'Saving...' : 'Save Links'}
			</Button>
		</div>
	{/snippet}
</Modal>
