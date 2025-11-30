<script lang="ts">
	import { goto } from '$app/navigation';
	import { Header } from '$lib/components/layout';
	import { Button, Input } from '$lib/components/ui';
	import { entries, tags, projects, toasts } from '$lib/stores';
	import type { EntryFormData } from '$lib/types';
	import TagInput from '$lib/components/editor/TagInput.svelte';
	import MarkdownEditor from '$lib/components/editor/MarkdownEditor.svelte';

	let title = $state('');
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
				mode: 'project',
				title: title.trim(),
				content: content.trim(),
				tags: selectedTags,
				project: selectedProject
			};

			const entry = await entries.create(data);
			toasts.success('Log entry saved');
			goto(`/project/${entry.id}`);
		} catch (error) {
			console.error('Failed to create entry:', error);
			toasts.error('Failed to save entry');
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		goto('/project');
	}
</script>

<svelte:head>
	<title>New Log Entry | Project | Homelab Notebook</title>
</svelte:head>

<Header title="New Log Entry" mode="project" subtitle="Document your work session">
	{#snippet actions()}
		<Button variant="ghost" onclick={handleCancel}>Cancel</Button>
		<Button variant="primary" onclick={handleSubmit} disabled={isSubmitting}>
			{isSubmitting ? 'Saving...' : 'Save Entry'}
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto p-6">
	<div class="max-w-2xl mx-auto space-y-6">
		<!-- Project (first for context) -->
		<div>
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

		<!-- Title -->
		<div>
			<label for="title" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Title <span class="text-red-500">*</span>
			</label>
			<Input
				id="title"
				bind:value={title}
				placeholder="What are you working on?"
				required
			/>
			<p class="mt-1 text-xs text-[var(--color-text-muted)]">
				A short description of this work session or task
			</p>
		</div>

		<!-- Content -->
		<div>
			<label for="content" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Notes
			</label>
			<MarkdownEditor
				bind:value={content}
				placeholder="Document your progress, discoveries, issues, and next steps..."
				minRows={12}
			/>
		</div>

		<!-- Tags -->
		<div>
			<label class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Tags
			</label>
			<TagInput bind:selectedTags availableTags={$tags} />
		</div>
	</div>
</div>
