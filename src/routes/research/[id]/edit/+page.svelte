<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ArrowLeft, Save, LinkIcon, FolderOpen, Sparkles } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Input } from '$lib/components/ui';
	import { TagInput, MarkdownEditor } from '$lib/components/editor';
	import { entries, projects, toasts } from '$lib/stores';
	import { entryService } from '$lib/services/pocketbase';
	import type { Entry } from '$lib/types';

	let entry = $state<Entry | null>(null);
	let loading = $state(true);
	let saving = $state(false);

	let title = $state('');
	let url = $state('');
	let content = $state('');
	let selectedTags = $state<string[]>([]);
	let selectedProject = $state('');

	const id = $derived($page.params.id);

	onMount(async () => {
		try {
			entry = await entryService.getById(id);
			if (entry) {
				title = entry.title;
				url = entry.url || '';
				content = entry.content || '';
				selectedTags = entry.tags || [];
				selectedProject = entry.project || '';
			}
		} catch (error) {
			console.error('Failed to load entry:', error);
			toasts.error('Entry not found');
			goto('/research');
		} finally {
			loading = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!title.trim()) {
			toasts.error('Title is required');
			return;
		}

		saving = true;
		try {
			await entries.update(id, {
				title: title.trim(),
				url: url.trim() || undefined,
				content: content.trim() || undefined,
				tags: selectedTags,
				project: selectedProject || undefined
			});
			toasts.success('Resource updated');
			goto(`/research/${id}`);
		} catch (error) {
			console.error('Failed to update entry:', error);
			toasts.error('Failed to update resource');
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Edit {entry?.title || 'Resource'} | Research | Homelab Notebook</title>
</svelte:head>

{#if loading}
	<div class="flex-1 flex items-center justify-center">
		<p class="text-[var(--color-text-muted)]">Loading...</p>
	</div>
{:else if entry}
	<Header title="Edit Resource" mode="research">
		{#snippet actions()}
			<Button variant="ghost" onclick={() => goto(`/research/${id}`)}>
				<ArrowLeft class="w-4 h-4" />
				Cancel
			</Button>
		{/snippet}
	</Header>

	<div class="flex-1 overflow-y-auto p-6">
		<form onsubmit={handleSubmit} class="max-w-2xl mx-auto space-y-6">
			<!-- Title -->
			<div>
				<label for="title" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
					Title <span class="text-red-500">*</span>
				</label>
				<Input id="title" bind:value={title} placeholder="Resource title" required />
			</div>

			<!-- URL -->
			<div>
				<label for="url" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
					<span class="flex items-center gap-1.5">
						<LinkIcon class="w-4 h-4" />
						URL
					</span>
				</label>
				<Input id="url" type="url" bind:value={url} placeholder="https://..." />
			</div>

			<!-- Project -->
			<div>
				<label for="project" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
					<span class="flex items-center gap-1.5">
						<FolderOpen class="w-4 h-4" />
						Project
					</span>
				</label>
				<select
					id="project"
					bind:value={selectedProject}
					class="w-full px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-border-strong)]"
				>
					<option value="">No project</option>
					{#each $projects.filter((p) => p.status === 'active') as project}
						<option value={project.id}>{project.name}</option>
					{/each}
				</select>
			</div>

			<!-- Tags -->
			<div>
				<label class="block text-sm font-medium text-[var(--color-text)] mb-1.5">Tags</label>
				<TagInput bind:selectedTags />
			</div>

			<!-- Content -->
			<div>
				<label class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
					<span class="flex items-center gap-1.5">
						<Sparkles class="w-4 h-4" />
						Notes
					</span>
				</label>
				<MarkdownEditor bind:value={content} placeholder="Add notes about this resource..." />
			</div>

			<!-- Submit -->
			<div class="flex items-center justify-end gap-3 pt-4">
				<Button type="button" variant="ghost" onclick={() => goto(`/research/${id}`)}>
					Cancel
				</Button>
				<Button type="submit" disabled={saving}>
					<Save class="w-4 h-4" />
					{saving ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>
		</form>
	</div>
{/if}
