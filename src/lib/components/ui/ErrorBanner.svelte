<script lang="ts">
	import { AlertTriangle, RefreshCw, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui';

	interface Props {
		title?: string;
		message: string;
		onRetry?: () => void;
		onDismiss?: () => void;
	}

	let { title = 'Something went wrong', message, onRetry, onDismiss }: Props = $props();
</script>

<div class="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
	<div class="flex items-start gap-3">
		<AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
		<div class="flex-1 min-w-0">
			<h3 class="font-medium text-red-800 dark:text-red-200">{title}</h3>
			<p class="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
			{#if onRetry}
				<Button variant="ghost" size="sm" onclick={onRetry} class="mt-2">
					<RefreshCw class="w-4 h-4" />
					Try again
				</Button>
			{/if}
		</div>
		{#if onDismiss}
			<button
				onclick={onDismiss}
				class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
			>
				<X class="w-4 h-4 text-red-600 dark:text-red-400" />
			</button>
		{/if}
	</div>
</div>
