<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Loader2, FileText } from 'lucide-svelte';
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

<div class="flex h-screen bg-[var(--color-background)]">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main Content -->
	<main class="flex-1 flex flex-col overflow-hidden">
		<!-- Header -->
		<header
			class="flex items-center gap-4 px-8 py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]"
		>
			<div class="flex-1 max-w-md">
				<SearchBar />
			</div>
			<Button onclick={() => ui.openModal('note')}>
				<Plus class="w-4 h-4" />
				New Entry
			</Button>
		</header>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto">
			<div class="max-w-3xl mx-auto px-8 py-8">
				{#if loading}
					<div class="flex items-center justify-center h-64">
						<Loader2 class="w-5 h-5 text-[var(--color-text-muted)] animate-spin" />
					</div>
				{:else if $filteredNotes.length === 0}
					<div class="flex flex-col items-center justify-center h-64 text-center">
						<div
							class="w-12 h-12 flex items-center justify-center bg-[var(--color-surface-hover)] rounded-full mb-4"
						>
							<FileText class="w-6 h-6 text-[var(--color-text-muted)]" />
						</div>
						<h2 class="font-serif text-xl font-semibold text-[var(--color-text)] mb-2">
							No notes yet
						</h2>
						<p class="text-[var(--color-text-muted)] mb-6 max-w-sm">
							Start by adding a URL, code snippet, or note to your collection.
						</p>
						<Button onclick={() => ui.openModal('note')}>
							<Plus class="w-4 h-4" />
							Create your first entry
						</Button>
					</div>
				{:else}
					<div class="space-y-1">
						{#each $filteredNotes as note (note.id)}
							<NoteCard {note} onclick={() => ui.openModal('note', note.id)} />
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>

<!-- Modals -->
<Modal
	open={$ui.modalOpen && $ui.modalType === 'note'}
	title={$ui.editingId ? 'Edit Entry' : 'New Entry'}
	onclose={() => ui.closeModal()}
>
	<p class="text-[var(--color-text-muted)]">Note form will be implemented here.</p>
</Modal>

<Modal
	open={$ui.modalOpen && $ui.modalType === 'tag'}
	title="New Tag"
	onclose={() => ui.closeModal()}
>
	<p class="text-[var(--color-text-muted)]">Tag form will be implemented here.</p>
</Modal>

<Modal
	open={$ui.modalOpen && $ui.modalType === 'collection'}
	title="New Collection"
	onclose={() => ui.closeModal()}
>
	<p class="text-[var(--color-text-muted)]">Collection form will be implemented here.</p>
</Modal>
