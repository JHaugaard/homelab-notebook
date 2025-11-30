<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseStyles =
		'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-blue)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]';

	const variants = {
		primary:
			'bg-[var(--color-blue)] text-white hover:bg-[#1a73d1] shadow-sm hover:shadow-md',
		secondary:
			'bg-transparent text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]',
		ghost:
			'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]',
		danger:
			'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm'
	};

	const sizes = {
		sm: 'px-2.5 py-1 text-sm gap-1',
		md: 'px-3.5 py-1.5 text-sm gap-1.5',
		lg: 'px-5 py-2.5 text-base gap-2'
	};
</script>

<button
	{type}
	{disabled}
	class="{baseStyles} {variants[variant]} {sizes[size]} {className}"
	onclick={onclick}
>
	{@render children()}
</button>
