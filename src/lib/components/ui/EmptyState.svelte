<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	interface Props {
		icon?: Component;
		title: string;
		description?: string;
		class?: string;
		children?: Snippet;
	}

	let { icon: Icon, title, description, class: className = '', children }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 text-center {className}">
	{#if Icon}
		<div class="p-4 rounded-full bg-[var(--color-surface-hover)] mb-4">
			<Icon class="w-8 h-8 text-[var(--color-text-muted)]" />
		</div>
	{/if}
	<h3 class="text-lg font-medium text-[var(--color-text)] mb-2">{title}</h3>
	{#if description}
		<p class="text-sm text-[var(--color-text-muted)] max-w-sm">{description}</p>
	{/if}
	{#if children}
		<div class="mt-4">
			{@render children()}
		</div>
	{/if}
</div>
