<script lang="ts">
	import { X } from 'lucide-svelte';

	interface Props {
		name: string;
		color?: string;
		removable?: boolean;
		onremove?: () => void;
		onclick?: () => void;
	}

	let { name, color = '#3b82f6', removable = false, onremove, onclick }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<span
	class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
	style="background-color: {color}20; color: {color}; border: 1px solid {color}40;"
	onclick={onclick}
	class:cursor-pointer={!!onclick}
>
	{name}
	{#if removable}
		<button
			type="button"
			class="ml-0.5 hover:opacity-70 focus:outline-none"
			onclick={(e) => {
				e.stopPropagation();
				onremove?.();
			}}
		>
			<X class="w-3 h-3" />
		</button>
	{/if}
</span>
