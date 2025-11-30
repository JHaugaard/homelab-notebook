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
	class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed {className}"
/>
