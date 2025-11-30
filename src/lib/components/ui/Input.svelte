<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'text' | 'email' | 'password' | 'url' | 'search';
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		id?: string;
		name?: string;
		class?: string;
		icon?: Snippet;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		onfocus?: (e: FocusEvent) => void;
		onblur?: (e: FocusEvent) => void;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		required = false,
		id,
		name,
		class: className = '',
		icon,
		oninput,
		onkeydown,
		onfocus,
		onblur
	}: Props = $props();

	const baseStyles =
		'w-full px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-strong)] focus:ring-1 focus:ring-[var(--color-border-strong)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
</script>

{#if icon}
	<div class="relative">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
			{@render icon()}
		</div>
		<input
			{type}
			bind:value
			{placeholder}
			{disabled}
			{required}
			{id}
			{name}
			class="{baseStyles} pl-10 {className}"
			oninput={oninput}
			onkeydown={onkeydown}
			onfocus={onfocus}
			onblur={onblur}
		/>
	</div>
{:else}
	<input
		{type}
		bind:value
		{placeholder}
		{disabled}
		{required}
		{id}
		{name}
		class="{baseStyles} {className}"
		oninput={oninput}
		onkeydown={onkeydown}
		onfocus={onfocus}
		onblur={onblur}
	/>
{/if}
