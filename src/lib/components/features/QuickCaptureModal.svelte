<script lang="ts">
	import { BookOpen, Wrench, FileText } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { showQuickCapture, quickCaptureMode } from '$lib/stores';
	import { MODE_CONFIGS, type EntryMode } from '$lib/types';
	import { Modal } from '$lib/components/ui';
	import { fade } from 'svelte/transition';

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	function selectMode(mode: EntryMode) {
		$quickCaptureMode = mode;
		$showQuickCapture = false;
		goto(`/${mode}/new`);
	}

	function close() {
		$showQuickCapture = false;
	}
</script>

<Modal open={$showQuickCapture} title="New Entry" onclose={close}>
	<p class="text-sm text-[var(--color-text-secondary)] mb-4">
		What type of entry would you like to create?
	</p>

	<div class="grid grid-cols-1 gap-3">
		{#each Object.values(MODE_CONFIGS) as mode}
			{@const Icon = modeIcons[mode.id]}
			<button
				class="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)] transition-all text-left group"
				onclick={() => selectMode(mode.id)}
			>
				<div class="p-3 rounded-lg {mode.bgColor} group-hover:scale-105 transition-transform">
					<Icon class="w-6 h-6 {mode.color}" />
				</div>
				<div class="flex-1">
					<h3 class="font-medium text-[var(--color-text)]">{mode.label}</h3>
					<p class="text-sm text-[var(--color-text-muted)]">{mode.description}</p>
				</div>
			</button>
		{/each}
	</div>
</Modal>
