<script lang="ts">
	import type { Snippet } from 'svelte';
	import { BookOpen, Wrench, FileText, Search } from 'lucide-svelte';
	import type { EntryMode } from '$lib/types';
	import { showGlobalSearch } from '$lib/stores';
	import { getModifierKey } from '$lib/utils';

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

	const modeColors = {
		research: {
			icon: 'text-[var(--color-mode-research)]',
			bg: 'bg-[var(--color-mode-research-subtle)]'
		},
		project: {
			icon: 'text-[var(--color-mode-project)]',
			bg: 'bg-[var(--color-mode-project-subtle)]'
		},
		reference: {
			icon: 'text-[var(--color-mode-reference)]',
			bg: 'bg-[var(--color-mode-reference-subtle)]'
		}
	};
</script>

<header class="hidden md:flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
	<!-- Left: Title and mode icon -->
	<div class="flex items-center gap-3 min-w-0 flex-shrink-0">
		{#if mode}
			{@const Icon = modeIcons[mode]}
			{@const colors = modeColors[mode]}
			<div class="p-2 rounded-lg {colors.bg}">
				<Icon class="w-5 h-5 {colors.icon}" />
			</div>
		{/if}
		<div class="min-w-0">
			<h1 class="text-xl text-[var(--color-text)] truncate">{title}</h1>
			{#if subtitle}
				<p class="text-sm text-[var(--color-text-muted)] truncate">{subtitle}</p>
			{/if}
		</div>
	</div>

	<!-- Center: Search -->
	<div class="flex-1 flex justify-center px-4">
		<button
			class="
				flex items-center gap-2 px-4 py-2
				max-w-md w-full
				rounded-lg text-sm text-[var(--color-text-muted)]
				bg-[var(--color-background)] border border-[var(--color-border)]
				hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]
				transition-colors
			"
			onclick={() => ($showGlobalSearch = true)}
		>
			<Search class="w-4 h-4" />
			<span class="flex-1 text-left">Search...</span>
			<kbd class="text-[10px] font-sans font-medium bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
				{getModifierKey()}K
			</kbd>
		</button>
	</div>

	<!-- Right: Actions -->
	{#if actions}
		<div class="flex items-center gap-2 flex-shrink-0">
			{@render actions()}
		</div>
	{/if}
</header>

<!-- Mobile header is simpler - title only, actions in a different location -->
<header class="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
	<div class="flex items-center gap-2">
		{#if mode}
			{@const Icon = modeIcons[mode]}
			{@const colors = modeColors[mode]}
			<div class="p-1.5 rounded-md {colors.bg}">
				<Icon class="w-4 h-4 {colors.icon}" />
			</div>
		{/if}
		<h1 class="text-lg text-[var(--color-text)]">{title}</h1>
	</div>

	{#if actions}
		<div class="flex items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</header>
