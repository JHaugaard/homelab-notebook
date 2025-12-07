<script lang="ts">
	import { goto } from '$app/navigation';
	import { Header } from '$lib/components/layout';
	import { Button, Input } from '$lib/components/ui';
	import { entries, tags, projects, toasts } from '$lib/stores';
	import type { EntryFormData } from '$lib/types';
	import TagInput from '$lib/components/editor/TagInput.svelte';
	import MarkdownEditor from '$lib/components/editor/MarkdownEditor.svelte';
	import { Paperclip } from 'lucide-svelte';

	let title = $state('');
	let url = $state('');
	let content = $state('');
	let selectedTags = $state<string[]>([]);
	let selectedProject = $state<string | undefined>(undefined);
	let isSubmitting = $state(false);

	async function handleSubmit() {
		if (!title.trim()) {
			toasts.error('Title is required');
			return;
		}

		isSubmitting = true;

		try {
			const data: EntryFormData = {
				mode: 'research',
				title: title.trim(),
				content: content.trim(),
				url: url.trim() || undefined,
				tags: selectedTags,
				project: selectedProject
			};

			const entry = await entries.create(data);
			toasts.success('Resource saved');
			goto(`/research/${entry.id}`);
		} catch (error) {
			console.error('Failed to create entry:', error);
			toasts.error('Failed to save resource');
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		goto('/research');
	}
</script>

<svelte:head>
	<title>New Resource | Research | Homelab Notebook</title>
</svelte:head>

<Header title="New Resource" mode="research" subtitle="Add a new research resource">
	{#snippet actions()}
		<Button variant="ghost" onclick={handleCancel}>Cancel</Button>
		<Button variant="primary" onclick={handleSubmit} disabled={isSubmitting}>
			{isSubmitting ? 'Saving...' : 'Save Resource'}
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto p-6">
	<div class="max-w-2xl mx-auto space-y-6">
		<!-- Title -->
		<div>
			<label for="title" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Title <span class="text-red-500">*</span>
			</label>
			<Input
				id="title"
				bind:value={title}
				placeholder="Enter a descriptive title..."
				required
			/>
		</div>

		<!-- URL -->
		<div>
			<label for="url" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				URL
			</label>
			<Input
				id="url"
				type="url"
				bind:value={url}
				placeholder="https://..."
			/>
		</div>

		<!-- Project (narrower) -->
		<div class="max-w-xs">
			<label for="project" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Project
			</label>
			<select
				id="project"
				bind:value={selectedProject}
				class="w-full px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-border-strong)]"
			>
				<option value={undefined}>No project</option>
				{#each $projects as project}
					<option value={project.id}>{project.name}</option>
				{/each}
			</select>
		</div>

		<!-- Notes -->
		<div>
			<label for="content" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Notes
			</label>
			<MarkdownEditor bind:value={content} placeholder="Add notes about this resource..." />
		</div>

		<!-- Tags and Attachments side by side -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<!-- Tags -->
			<div>
				<label for="tags-input" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
					Tags
				</label>
				<TagInput bind:selectedTags availableTags={$tags} id="tags-input" />
			</div>

			<!-- Attachments placeholder -->
			<div>
				<label class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
					Attachments
				</label>
				<div class="flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
					<Paperclip class="w-4 h-4" />
					<span>Save entry first to add attachments</span>
				</div>
			</div>
		</div>
	</div>
</div>
