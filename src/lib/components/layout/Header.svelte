<script lang="ts">
	import type { Snippet } from 'svelte';
	import { BookOpen, Wrench, FileText } from 'lucide-svelte';
	import type { EntryMode } from '$lib/types';
	import { MODE_CONFIGS } from '$lib/types';

	interface Props {
		title: string;
		mode?: EntryMode;
		subtitle?: string;
		actions?: Snippet;
	}

	let { title, mode, subtitle, actions }: Props = $props();

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};
</script>

<header class="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
	<div class="flex items-center gap-3">
		{#if mode}
			{@const Icon = modeIcons[mode]}
			{@const config = MODE_CONFIGS[mode]}
			<div class="p-2 rounded-lg {config.bgColor}">
				<Icon class="w-5 h-5 {config.color}" />
			</div>
		{/if}
		<div>
			<h1 class="text-xl font-semibold text-[var(--color-text)]">{title}</h1>
			{#if subtitle}
				<p class="text-sm text-[var(--color-text-muted)]">{subtitle}</p>
			{/if}
		</div>
	</div>

	{#if actions}
		<div class="flex items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</header>
