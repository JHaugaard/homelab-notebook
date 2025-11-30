<script lang="ts">
	import { X } from 'lucide-svelte';

	interface Props {
		name: string;
		color?: string;
		removable?: boolean;
		onremove?: () => void;
		onclick?: () => void;
	}

	let { name, color = '#2383e2', removable = false, onremove, onclick }: Props = $props();

	// Create a subtle background with low opacity
	const bgOpacity = '14';
	const borderOpacity = '30';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<span
	class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-all duration-100"
	style="background-color: {color}{bgOpacity}; color: {color}; border: 1px solid {color}{borderOpacity};"
	onclick={onclick}
	class:cursor-pointer={!!onclick}
	class:hover:opacity-80={!!onclick}
>
	{name}
	{#if removable}
		<button
			type="button"
			class="ml-0.5 opacity-60 hover:opacity-100 focus:outline-none transition-opacity"
			onclick={(e) => {
				e.stopPropagation();
				onremove?.();
			}}
		>
			<X class="w-3 h-3" />
		</button>
	{/if}
</span>
