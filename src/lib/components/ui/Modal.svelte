<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
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
		class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/20"
		onclick={handleBackdropClick}
		transition:fade={{ duration: 150 }}
	>
		<div
			class="w-full max-w-lg bg-[var(--color-background)] rounded-lg shadow-lg overflow-hidden"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			transition:fly={{ y: -8, duration: 200 }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
				<h2 id="modal-title" class="text-lg font-serif font-semibold text-[var(--color-text)] tracking-tight">
					{title}
				</h2>
				<button
					type="button"
					class="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
					onclick={onclose}
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Content -->
			<div class="p-6">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
