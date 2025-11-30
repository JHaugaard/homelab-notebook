<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';

	interface Props {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		closeOnOverlay?: boolean;
		showClose?: boolean;
		children: Snippet;
		footer?: Snippet;
		onclose: () => void;
	}

	let {
		open = $bindable(),
		title,
		size = 'md',
		closeOnOverlay = true,
		showClose = true,
		children,
		footer,
		onclose
	}: Props = $props();

	const sizeStyles = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl'
	};

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			onclose();
		}
	}

	function handleOverlayClick() {
		if (closeOnOverlay) {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/50"
			transition:fade={{ duration: 150 }}
			onclick={handleOverlayClick}
			onkeydown={(e) => e.key === 'Enter' && handleOverlayClick()}
			role="button"
			tabindex="-1"
		></div>

		<!-- Modal content -->
		<div
			class="relative w-full {sizeStyles[size]} bg-[var(--color-surface)] rounded-lg shadow-xl"
			transition:fly={{ y: 10, duration: 200 }}
		>
			<!-- Header -->
			{#if title || showClose}
				<div class="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
					{#if title}
						<h2 class="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
					{:else}
						<div></div>
					{/if}
					{#if showClose}
						<button
							type="button"
							class="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
							onclick={onclose}
							aria-label="Close"
						>
							<X class="w-5 h-5" />
						</button>
					{/if}
				</div>
			{/if}

			<!-- Body -->
			<div class="px-4 py-4">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)]">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
