<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		variant = 'secondary',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		children,
		onclick
	}: Props = $props();

	const baseStyles =
		'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantStyles = {
		primary:
			'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)]',
		secondary:
			'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] focus-visible:ring-[var(--color-border-strong)]',
		ghost:
			'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] focus-visible:ring-[var(--color-border)]',
		danger:
			'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
	};

	const sizeStyles = {
		sm: 'text-sm px-2.5 py-1.5 gap-1.5',
		md: 'text-sm px-3.5 py-2 gap-2',
		lg: 'text-base px-4 py-2.5 gap-2'
	};
</script>

<button
	{type}
	{disabled}
	class="{baseStyles} {variantStyles[variant]} {sizeStyles[size]} {className}"
	onclick={onclick}
>
	{@render children()}
</button>
