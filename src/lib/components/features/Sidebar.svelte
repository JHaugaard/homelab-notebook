<script lang="ts">
	import { Book, Tag as TagIcon, FolderOpen, Plus, ChevronDown, ChevronRight } from 'lucide-svelte';
	import { tags, collections, ui } from '$stores';
	import { Tag } from '$components/ui';

	let tagsOpen = $state(true);
	let collectionsOpen = $state(true);
</script>

<aside class="w-64 h-full bg-surface border-r border-border flex flex-col">
	<!-- Logo -->
	<div class="p-4 border-b border-border">
		<div class="flex items-center gap-2">
			<Book class="w-6 h-6 text-primary" />
			<span class="font-semibold text-text-primary">Notebook</span>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 overflow-y-auto p-4 space-y-6">
		<!-- Quick Actions -->
		<div>
			<button
				type="button"
				class="w-full flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
				onclick={() => ui.openModal('note')}
			>
				<Plus class="w-4 h-4" />
				<span>New Entry</span>
			</button>
		</div>

		<!-- Tags Section -->
		<div>
			<button
				type="button"
				class="flex items-center gap-2 w-full text-sm font-medium text-text-muted hover:text-text-primary"
				onclick={() => (tagsOpen = !tagsOpen)}
			>
				{#if tagsOpen}
					<ChevronDown class="w-4 h-4" />
				{:else}
					<ChevronRight class="w-4 h-4" />
				{/if}
				<TagIcon class="w-4 h-4" />
				<span>Tags</span>
				<span class="ml-auto text-xs bg-surface-hover px-1.5 py-0.5 rounded">
					{$tags.length}
				</span>
			</button>

			{#if tagsOpen}
				<div class="mt-2 space-y-1 pl-6">
					{#each $tags as tag}
						<button
							type="button"
							class="w-full text-left px-2 py-1 rounded hover:bg-surface-hover transition-colors"
						>
							<Tag name={tag.name} color={tag.color} />
						</button>
					{/each}
					{#if $tags.length === 0}
						<p class="text-xs text-text-muted px-2 py-1">No tags yet</p>
					{/if}
					<button
						type="button"
						class="flex items-center gap-1 text-xs text-text-muted hover:text-primary px-2 py-1"
						onclick={() => ui.openModal('tag')}
					>
						<Plus class="w-3 h-3" />
						<span>Add tag</span>
					</button>
				</div>
			{/if}
		</div>

		<!-- Collections Section -->
		<div>
			<button
				type="button"
				class="flex items-center gap-2 w-full text-sm font-medium text-text-muted hover:text-text-primary"
				onclick={() => (collectionsOpen = !collectionsOpen)}
			>
				{#if collectionsOpen}
					<ChevronDown class="w-4 h-4" />
				{:else}
					<ChevronRight class="w-4 h-4" />
				{/if}
				<FolderOpen class="w-4 h-4" />
				<span>Collections</span>
				<span class="ml-auto text-xs bg-surface-hover px-1.5 py-0.5 rounded">
					{$collections.length}
				</span>
			</button>

			{#if collectionsOpen}
				<div class="mt-2 space-y-1 pl-6">
					{#each $collections as collection}
						<button
							type="button"
							class="w-full text-left px-2 py-1.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-hover rounded transition-colors"
						>
							{collection.name}
						</button>
					{/each}
					{#if $collections.length === 0}
						<p class="text-xs text-text-muted px-2 py-1">No collections yet</p>
					{/if}
					<button
						type="button"
						class="flex items-center gap-1 text-xs text-text-muted hover:text-primary px-2 py-1"
						onclick={() => ui.openModal('collection')}
					>
						<Plus class="w-3 h-3" />
						<span>Add collection</span>
					</button>
				</div>
			{/if}
		</div>
	</nav>
</aside>
