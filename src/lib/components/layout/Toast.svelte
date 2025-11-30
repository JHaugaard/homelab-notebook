<script lang="ts">
	import { fly } from 'svelte/transition';
	import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-svelte';
	import { toasts } from '$lib/stores';

	const icons = {
		success: CheckCircle,
		error: XCircle,
		warning: AlertCircle,
		info: Info
	};

	const styles = {
		success: 'bg-green-50 border-green-200 text-green-800',
		error: 'bg-red-50 border-red-200 text-red-800',
		warning: 'bg-amber-50 border-amber-200 text-amber-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800'
	};

	const iconStyles = {
		success: 'text-green-500',
		error: 'text-red-500',
		warning: 'text-amber-500',
		info: 'text-blue-500'
	};
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
	{#each $toasts as toast (toast.id)}
		{@const Icon = icons[toast.type]}
		<div
			class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg {styles[toast.type]}"
			transition:fly={{ x: 100, duration: 200 }}
		>
			<Icon class="w-5 h-5 flex-shrink-0 {iconStyles[toast.type]}" />
			<p class="text-sm font-medium">{toast.message}</p>
			<button
				class="p-1 rounded hover:bg-black/10 transition-colors"
				onclick={() => toasts.remove(toast.id)}
				aria-label="Dismiss"
			>
				<X class="w-4 h-4" />
			</button>
		</div>
	{/each}
</div>
