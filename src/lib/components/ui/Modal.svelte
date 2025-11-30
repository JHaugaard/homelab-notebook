<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';
	import Button from './Button.svelte';

	interface Props {
		open?: boolean;
		title?: string;
		onclose?: () => void;
		children: Snippet;
	}

	let { open = false, title = '', onclose, children }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			onclose?.();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		onclick={handleBackdropClick}
	>
		<div
			class="w-full max-w-lg bg-surface border border-border rounded-xl shadow-xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border">
				<h2 id="modal-title" class="text-lg font-semibold text-text-primary">{title}</h2>
				<Button variant="ghost" size="sm" onclick={onclose}>
					<X class="w-5 h-5" />
				</Button>
			</div>
			<div class="p-6">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
