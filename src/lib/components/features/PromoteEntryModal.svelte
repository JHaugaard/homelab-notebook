<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRight, BookOpen, Wrench, FileText, Check } from 'lucide-svelte';
	import { Modal, Button, Badge } from '$lib/components/ui';
	import { entries, toasts } from '$lib/stores';
	import { entryService } from '$lib/services/pocketbase';
	import { MODE_CONFIGS, type Entry, type EntryMode } from '$lib/types';

	interface Props {
		open: boolean;
		entry: Entry | null;
		onclose: () => void;
	}

	let { open = $bindable(), entry, onclose }: Props = $props();

	let promoting = $state(false);
	let selectedMode = $state<EntryMode | null>(null);
	let keepOriginal = $state(false);

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	// Determine available promotion targets based on current mode
	let availableModes = $derived.by(() => {
		if (!entry) return [];

		const modes: { mode: EntryMode; description: string }[] = [];

		if (entry.mode === 'research') {
			modes.push({
				mode: 'project',
				description: 'Convert to a project log entry for active development'
			});
			modes.push({
				mode: 'reference',
				description: 'Convert to polished reference documentation'
			});
		} else if (entry.mode === 'project') {
			modes.push({
				mode: 'reference',
				description: 'Distill into clean reference documentation'
			});
			modes.push({
				mode: 'research',
				description: 'Move back to research for further exploration'
			});
		} else if (entry.mode === 'reference') {
			modes.push({
				mode: 'project',
				description: 'Convert to project log entry'
			});
			modes.push({
				mode: 'research',
				description: 'Move back to research collection'
			});
		}

		return modes;
	});

	function handleClose() {
		selectedMode = null;
		keepOriginal = false;
		onclose();
	}

	async function handlePromote() {
		if (!entry || !selectedMode) return;

		promoting = true;
		try {
			if (keepOriginal) {
				// Create a copy in the new mode
				const newEntry = await entryService.create({
					mode: selectedMode,
					title: entry.title,
					content: entry.content,
					url: entry.url,
					project: entry.project,
					tags: entry.tags,
					promoted_from: entry.id
				});

				// Update local store
				await entries.load();

				toasts.success(`Entry copied to ${MODE_CONFIGS[selectedMode].label}`);
				handleClose();
				goto(`/${selectedMode}/${newEntry.id}`);
			} else {
				// Move the entry (update mode)
				await entries.update(entry.id, { mode: selectedMode });
				toasts.success(`Entry moved to ${MODE_CONFIGS[selectedMode].label}`);
				handleClose();
				goto(`/${selectedMode}/${entry.id}`);
			}
		} catch (error) {
			console.error('Failed to promote entry:', error);
			toasts.error('Failed to promote entry');
		} finally {
			promoting = false;
		}
	}
</script>

<Modal {open} title="Promote Entry" onclose={handleClose}>
	{#if entry}
		<div class="space-y-4">
			<!-- Current entry info -->
			<div class="p-3 rounded-lg bg-[var(--color-surface-hover)]">
				<p class="text-sm text-[var(--color-text-muted)] mb-1">Current entry</p>
				<p class="font-medium text-[var(--color-text)]">{entry.title}</p>
				<Badge variant={entry.mode} size="sm" class="mt-2">{MODE_CONFIGS[entry.mode].label}</Badge>
			</div>

			<!-- Mode selection -->
			<div>
				<p class="text-sm font-medium text-[var(--color-text)] mb-3">Promote to:</p>
				<div class="space-y-2">
					{#each availableModes as { mode, description }}
						{@const Icon = modeIcons[mode]}
						{@const config = MODE_CONFIGS[mode]}
						<button
							type="button"
							onclick={() => (selectedMode = mode)}
							class="w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left
								{selectedMode === mode
									? 'border-[var(--color-border-strong)] bg-[var(--color-surface-active)]'
									: 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'}"
						>
							<div class="p-2 rounded-md {config.bgColor}">
								<Icon class="w-4 h-4 {config.color}" />
							</div>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<span class="font-medium text-[var(--color-text)]">{config.label}</span>
									{#if selectedMode === mode}
										<Check class="w-4 h-4 text-green-600" />
									{/if}
								</div>
								<p class="text-sm text-[var(--color-text-muted)] mt-0.5">{description}</p>
							</div>
							<ArrowRight class="w-4 h-4 text-[var(--color-text-muted)] mt-2" />
						</button>
					{/each}
				</div>
			</div>

			<!-- Keep original option -->
			{#if selectedMode}
				<label class="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-hover)]">
					<input
						type="checkbox"
						bind:checked={keepOriginal}
						class="w-4 h-4 rounded border-[var(--color-border)]"
					/>
					<div>
						<span class="text-sm font-medium text-[var(--color-text)]">Keep original entry</span>
						<p class="text-xs text-[var(--color-text-muted)]">
							Create a copy instead of moving. The original will be linked as a reference.
						</p>
					</div>
				</label>
			{/if}
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={handleClose}>Cancel</Button>
			<Button onclick={handlePromote} disabled={!selectedMode || promoting}>
				{#if promoting}
					Promoting...
				{:else if keepOriginal}
					Copy to {selectedMode ? MODE_CONFIGS[selectedMode].label : '...'}
				{:else}
					Move to {selectedMode ? MODE_CONFIGS[selectedMode].label : '...'}
				{/if}
			</Button>
		</div>
	{/snippet}
</Modal>
