<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, RefreshCw } from 'lucide-svelte';
	import { Sidebar, SearchBar, NoteCard } from '$components/features';
	import { Button, Modal } from '$components/ui';
	import { filteredNotes, ui, initializeStores, currentUser } from '$stores';
	import { browser } from '$app/environment';

	let loading = $state(true);

	onMount(async () => {
		if (browser) {
			await initializeStores();
			loading = false;
		}
	});
</script>

<div class="flex h-screen bg-background">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main Content -->
	<main class="flex-1 flex flex-col overflow-hidden">
		<!-- Header -->
		<header class="flex items-center gap-4 p-4 border-b border-border">
			<div class="flex-1 max-w-xl">
				<SearchBar />
			</div>
			<Button onclick={() => ui.openModal('note')}>
				<Plus class="w-4 h-4 mr-2" />
				New Entry
			</Button>
		</header>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto p-4">
			{#if loading}
				<div class="flex items-center justify-center h-full">
					<RefreshCw class="w-6 h-6 text-text-muted animate-spin" />
				</div>
			{:else if $filteredNotes.length === 0}
				<div class="flex flex-col items-center justify-center h-full text-center">
					<div class="p-4 bg-surface rounded-full mb-4">
						<Plus class="w-8 h-8 text-text-muted" />
					</div>
					<h2 class="text-lg font-medium text-text-primary mb-2">No notes yet</h2>
					<p class="text-text-muted mb-4">
						Start by adding a URL, code snippet, or note.
					</p>
					<Button onclick={() => ui.openModal('note')}>
						<Plus class="w-4 h-4 mr-2" />
						Create your first entry
					</Button>
				</div>
			{:else}
				<div class="grid gap-3 max-w-4xl">
					{#each $filteredNotes as note (note.id)}
						<NoteCard {note} onclick={() => ui.openModal('note', note.id)} />
					{/each}
				</div>
			{/if}
		</div>
	</main>
</div>

<!-- Modals -->
<Modal
	open={$ui.modalOpen && $ui.modalType === 'note'}
	title={$ui.editingId ? 'Edit Entry' : 'New Entry'}
	onclose={() => ui.closeModal()}
>
	<p class="text-text-muted">Note form will be implemented here.</p>
</Modal>

<Modal
	open={$ui.modalOpen && $ui.modalType === 'tag'}
	title="New Tag"
	onclose={() => ui.closeModal()}
>
	<p class="text-text-muted">Tag form will be implemented here.</p>
</Modal>

<Modal
	open={$ui.modalOpen && $ui.modalType === 'collection'}
	title="New Collection"
	onclose={() => ui.closeModal()}
>
	<p class="text-text-muted">Collection form will be implemented here.</p>
</Modal>
