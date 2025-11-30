<script lang="ts">
	import {
		BookOpen,
		Tag as TagIcon,
		FolderOpen,
		Plus,
		ChevronDown,
		ChevronRight,
		Search
	} from 'lucide-svelte';
	import { tags, collections, ui } from '$stores';
	import { Tag } from '$components/ui';

	let tagsOpen = $state(true);
	let collectionsOpen = $state(true);
</script>

<aside
	class="w-60 h-full bg-[var(--color-background-secondary)] border-r border-[var(--color-border)] flex flex-col"
>
	<!-- Logo -->
	<div class="px-4 py-4">
		<div class="flex items-center gap-2.5">
			<div class="p-1.5 bg-[var(--color-primary-subtle)] rounded">
				<BookOpen class="w-4 h-4 text-[var(--color-primary)]" />
			</div>
			<span class="font-serif font-semibold text-[var(--color-text)] tracking-tight"
				>Notebook</span
			>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 overflow-y-auto px-2 pb-4 space-y-6">
		<!-- Quick Actions -->
		<div class="space-y-1">
			<button
				type="button"
				class="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-[var(--color-text)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
				onclick={() => ui.openModal('note')}
			>
				<Plus class="w-4 h-4 text-[var(--color-text-muted)]" />
				<span>New page</span>
			</button>

			<button
				type="button"
				class="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-[var(--color-text-muted)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
			>
				<Search class="w-4 h-4" />
				<span>Search</span>
				<kbd
					class="ml-auto text-[10px] px-1.5 py-0.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-[var(--color-text-light)]"
					>&#8984;K</kbd
				>
			</button>
		</div>

		<!-- Tags Section -->
		<div>
			<button
				type="button"
				class="flex items-center gap-1.5 w-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
				onclick={() => (tagsOpen = !tagsOpen)}
			>
				{#if tagsOpen}
					<ChevronDown class="w-3 h-3" />
				{:else}
					<ChevronRight class="w-3 h-3" />
				{/if}
				<TagIcon class="w-3 h-3" />
				<span>Tags</span>
				<span
					class="ml-auto text-[10px] font-normal normal-case tracking-normal text-[var(--color-text-light)]"
				>
					{$tags.length}
				</span>
			</button>

			{#if tagsOpen}
				<div class="mt-1 space-y-0.5 ml-3">
					{#each $tags as tag}
						<button
							type="button"
							class="w-full text-left px-3 py-1 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
						>
							<Tag name={tag.name} color={tag.color} />
						</button>
					{/each}
					{#if $tags.length === 0}
						<p class="text-xs text-[var(--color-text-light)] px-3 py-1 italic">No tags yet</p>
					{/if}
					<button
						type="button"
						class="flex items-center gap-1.5 w-full text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] px-3 py-1 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
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
				class="flex items-center gap-1.5 w-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
				onclick={() => (collectionsOpen = !collectionsOpen)}
			>
				{#if collectionsOpen}
					<ChevronDown class="w-3 h-3" />
				{:else}
					<ChevronRight class="w-3 h-3" />
				{/if}
				<FolderOpen class="w-3 h-3" />
				<span>Collections</span>
				<span
					class="ml-auto text-[10px] font-normal normal-case tracking-normal text-[var(--color-text-light)]"
				>
					{$collections.length}
				</span>
			</button>

			{#if collectionsOpen}
				<div class="mt-1 space-y-0.5 ml-3">
					{#each $collections as collection}
						<button
							type="button"
							class="w-full text-left px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] rounded-md transition-colors"
						>
							{collection.name}
						</button>
					{/each}
					{#if $collections.length === 0}
						<p class="text-xs text-[var(--color-text-light)] px-3 py-1 italic">No collections yet</p>
					{/if}
					<button
						type="button"
						class="flex items-center gap-1.5 w-full text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] px-3 py-1 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
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
