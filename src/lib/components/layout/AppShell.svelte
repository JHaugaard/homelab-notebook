<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import Toast from './Toast.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex h-screen bg-[var(--color-background)]">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content area -->
	<main class="flex-1 flex flex-col overflow-hidden">
		{@render children()}
	</main>

	<!-- Toast notifications -->
	<Toast />
</div>
