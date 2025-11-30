<script lang="ts">
	import { Plus, Tags as TagsIcon, Edit2, Trash2, Merge } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge, Modal, Input } from '$lib/components/ui';
	import { tags, toasts } from '$lib/stores';
	import type { Tag, TagCategory } from '$lib/types';

	let showNewTagModal = $state(false);
	let editingTag = $state<Tag | null>(null);
	let tagToDelete = $state<string | null>(null);

	// New/Edit tag form
	let tagName = $state('');
	let tagCategory = $state<TagCategory | undefined>(undefined);
	let tagColor = $state('');
	let isSubmitting = $state(false);

	// Group tags by category
	let groupedTags = $derived.by(() => {
		const groups: Record<string, Tag[]> = {
			technology: [],
			concept: [],
			infrastructure: [],
			other: []
		};

		for (const tag of $tags) {
			const category = tag.category || 'other';
			if (category in groups) {
				groups[category].push(tag);
			}
		}

		return groups;
	});

	const categoryLabels: Record<string, string> = {
		technology: 'Technology',
		concept: 'Concepts',
		infrastructure: 'Infrastructure',
		other: 'Other'
	};

	function openNewTagModal() {
		tagName = '';
		tagCategory = undefined;
		tagColor = '';
		editingTag = null;
		showNewTagModal = true;
	}

	function openEditModal(tag: Tag) {
		tagName = tag.name;
		tagCategory = tag.category;
		tagColor = tag.color || '';
		editingTag = tag;
		showNewTagModal = true;
	}

	function closeModal() {
		showNewTagModal = false;
		editingTag = null;
		tagName = '';
		tagCategory = undefined;
		tagColor = '';
	}

	async function handleSubmit() {
		if (!tagName.trim()) {
			toasts.error('Tag name is required');
			return;
		}

		isSubmitting = true;

		try {
			if (editingTag) {
				await tags.update(editingTag.id, {
					name: tagName.trim(),
					category: tagCategory,
					color: tagColor || undefined
				});
				toasts.success('Tag updated');
			} else {
				await tags.create({
					name: tagName.trim(),
					category: tagCategory,
					color: tagColor || undefined
				});
				toasts.success('Tag created');
			}
			closeModal();
		} catch (error) {
			console.error('Failed to save tag:', error);
			toasts.error('Failed to save tag');
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete() {
		if (!tagToDelete) return;

		try {
			await tags.delete(tagToDelete);
			toasts.success('Tag deleted');
		} catch (error) {
			console.error('Failed to delete tag:', error);
			toasts.error('Failed to delete tag');
		} finally {
			tagToDelete = null;
		}
	}
</script>

<svelte:head>
	<title>Tags | Homelab Notebook</title>
</svelte:head>

<Header title="Tags" subtitle="Organize and manage your tags">
	{#snippet actions()}
		<Button variant="primary" onclick={openNewTagModal}>
			<Plus class="w-4 h-4" />
			New Tag
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto p-6">
	{#if $tags.length > 0}
		<div class="space-y-8 max-w-3xl">
			{#each Object.entries(groupedTags) as [category, categoryTags]}
				{#if categoryTags.length > 0}
					<section>
						<h2 class="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
							{categoryLabels[category]}
							<span class="text-xs font-normal">({categoryTags.length})</span>
						</h2>

						<div class="flex flex-wrap gap-2">
							{#each categoryTags as tag}
								<div class="group relative">
									<Badge size="md" class="pr-8">
										{tag.name}
									</Badge>
									<div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											class="p-0.5 rounded hover:bg-black/10"
											onclick={() => openEditModal(tag)}
											aria-label="Edit tag"
										>
											<Edit2 class="w-3 h-3" />
										</button>
										<button
											class="p-0.5 rounded hover:bg-black/10 text-red-600"
											onclick={() => (tagToDelete = tag.id)}
											aria-label="Delete tag"
										>
											<Trash2 class="w-3 h-3" />
										</button>
									</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<div class="p-4 rounded-full bg-[var(--color-surface-hover)] mb-4">
				<TagsIcon class="w-8 h-8 text-[var(--color-text-muted)]" />
			</div>
			<h3 class="text-lg font-medium text-[var(--color-text)] mb-2">No tags yet</h3>
			<p class="text-sm text-[var(--color-text-muted)] mb-4 max-w-md">
				Tags help organize your entries. They'll be created automatically as you add entries, or you can create them manually.
			</p>
			<Button variant="primary" onclick={openNewTagModal}>
				<Plus class="w-4 h-4" />
				Create your first tag
			</Button>
		</div>
	{/if}
</div>

<!-- New/Edit Tag Modal -->
<Modal
	open={showNewTagModal}
	title={editingTag ? 'Edit Tag' : 'New Tag'}
	onclose={closeModal}
>
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
		<div>
			<label for="tag-name" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Name <span class="text-red-500">*</span>
			</label>
			<Input
				id="tag-name"
				bind:value={tagName}
				placeholder="Tag name..."
				required
			/>
		</div>

		<div>
			<label for="tag-category" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Category
			</label>
			<select
				id="tag-category"
				bind:value={tagCategory}
				class="w-full px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-border-strong)]"
			>
				<option value={undefined}>Uncategorized</option>
				<option value="technology">Technology</option>
				<option value="concept">Concept</option>
				<option value="infrastructure">Infrastructure</option>
				<option value="other">Other</option>
			</select>
		</div>

		<div>
			<label for="tag-color" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Color (optional)
			</label>
			<div class="flex gap-2">
				<Input
					id="tag-color"
					type="text"
					bind:value={tagColor}
					placeholder="#3B82F6"
					class="flex-1"
				/>
				{#if tagColor}
					<div
						class="w-10 h-10 rounded-md border border-[var(--color-border)]"
						style="background-color: {tagColor}"
					></div>
				{/if}
			</div>
		</div>
	</form>

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={closeModal}>Cancel</Button>
			<Button variant="primary" onclick={handleSubmit} disabled={isSubmitting}>
				{isSubmitting ? 'Saving...' : editingTag ? 'Update Tag' : 'Create Tag'}
			</Button>
		</div>
	{/snippet}
</Modal>

<!-- Delete confirmation modal -->
<Modal
	open={tagToDelete !== null}
	title="Delete Tag"
	onclose={() => (tagToDelete = null)}
>
	<p class="text-sm text-[var(--color-text-secondary)]">
		Are you sure you want to delete this tag? It will be removed from all entries.
	</p>

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={() => (tagToDelete = null)}>Cancel</Button>
			<Button variant="danger" onclick={handleDelete}>Delete</Button>
		</div>
	{/snippet}
</Modal>
