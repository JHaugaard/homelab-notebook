<script lang="ts">
	interface Props {
		type?: 'text' | 'email' | 'password' | 'url' | 'search';
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		id?: string;
		name?: string;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		required = false,
		class: className = '',
		id,
		name,
		oninput,
		onkeydown
	}: Props = $props();
</script>

<input
	{type}
	{id}
	{name}
	{placeholder}
	{disabled}
	{required}
	bind:value
	{oninput}
	{onkeydown}
	class="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-md text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-border-strong)] {className}"
/>
