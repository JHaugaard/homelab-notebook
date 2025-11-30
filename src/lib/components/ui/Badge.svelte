<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'research' | 'project' | 'reference' | 'outline';
		size?: 'sm' | 'md';
		removable?: boolean;
		class?: string;
		children: Snippet;
		onremove?: () => void;
	}

	let {
		variant = 'default',
		size = 'sm',
		removable = false,
		class: className = '',
		children,
		onremove
	}: Props = $props();

	const baseStyles = 'inline-flex items-center font-medium rounded-md transition-colors';

	const variantStyles = {
		default: 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]',
		research: 'bg-blue-50 text-blue-700',
		project: 'bg-amber-50 text-amber-700',
		reference: 'bg-green-50 text-green-700',
		outline: 'border border-[var(--color-border)] text-[var(--color-text-secondary)]'
	};

	const sizeStyles = {
		sm: 'text-xs px-2 py-0.5 gap-1',
		md: 'text-sm px-2.5 py-1 gap-1.5'
	};
</script>

<span class="{baseStyles} {variantStyles[variant]} {sizeStyles[size]} {className}">
	{@render children()}
	{#if removable}
		<button
			type="button"
			class="ml-0.5 -mr-1 p-0.5 rounded hover:bg-black/10 transition-colors"
			onclick={onremove}
			aria-label="Remove"
		>
			<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	{/if}
</span>
