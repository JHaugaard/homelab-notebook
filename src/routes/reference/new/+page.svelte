<script lang="ts">
	import { goto } from '$app/navigation';
	import { Header } from '$lib/components/layout';
	import { Button, Input, AttachmentDropZone } from '$lib/components/ui';
	import { entries, tags, projects, toasts } from '$lib/stores';
	import type { EntryFormData } from '$lib/types';
	import TagInput from '$lib/components/editor/TagInput.svelte';
	import MarkdownEditor from '$lib/components/editor/MarkdownEditor.svelte';

	let title = $state('');
	let content = $state('');
	let selectedTags = $state<string[]>([]);
	let selectedProject = $state<string | undefined>(undefined);
	let attachmentFiles = $state<File[]>([]);
	let isSubmitting = $state(false);

	const templateContent = `## Overview

Brief description of what this guide covers.

## Prerequisites

- Requirement 1
- Requirement 2

## Steps

### Step 1: Title

Instructions for step 1.

\`\`\`bash
# Example command
\`\`\`

### Step 2: Title

Instructions for step 2.

## Common Issues

### Issue 1

How to resolve this issue.

## Summary

Key takeaways from this guide.
`;

	async function handleSubmit() {
		if (!title.trim()) {
			toasts.error('Title is required');
			return;
		}

		isSubmitting = true;

		try {
			const data: EntryFormData = {
				mode: 'reference',
				title: title.trim(),
				content: content.trim(),
				tags: selectedTags,
				project: selectedProject,
				attachments: attachmentFiles.length > 0 ? attachmentFiles : undefined
			};

			const entry = await entries.create(data);
			toasts.success('Guide saved');
			goto(`/reference/${entry.id}`);
		} catch (error) {
			console.error('Failed to create entry:', error);
			toasts.error('Failed to save guide');
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		goto('/reference');
	}

	function useTemplate() {
		if (content.trim() && !confirm('This will replace your current content. Continue?')) {
			return;
		}
		content = templateContent;
	}
</script>

<svelte:head>
	<title>New Guide | Reference | Homelab Notebook</title>
</svelte:head>

<Header title="New Guide" mode="reference" subtitle="Create tutorial-style documentation">
	{#snippet actions()}
		<Button variant="ghost" onclick={handleCancel}>Cancel</Button>
		<Button variant="primary" onclick={handleSubmit} disabled={isSubmitting}>
			{isSubmitting ? 'Saving...' : 'Save Guide'}
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto p-6">
	<div class="max-w-3xl mx-auto space-y-6">
		<!-- Title -->
		<div>
			<label for="title" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Title <span class="text-red-500">*</span>
			</label>
			<Input
				id="title"
				bind:value={title}
				placeholder="Guide title..."
				required
			/>
		</div>

		<!-- Content -->
		<div>
			<div class="flex items-center justify-between mb-1.5">
				<label for="content" class="block text-sm font-medium text-[var(--color-text)]">
					Content
				</label>
				<button
					type="button"
					class="text-xs text-[var(--color-blue)] hover:underline"
					onclick={useTemplate}
				>
					Use template
				</button>
			</div>
			<MarkdownEditor
				bind:value={content}
				placeholder="Write your guide here. Use markdown for formatting..."
				minRows={20}
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

		<!-- Tags and Attachments side by side -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<!-- Tags -->
			<div>
				<label class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
					Tags
				</label>
				<TagInput bind:selectedTags availableTags={$tags} />
			</div>

			<!-- Attachments -->
			<div>
				<label class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
					Attachments
				</label>
				<AttachmentDropZone bind:files={attachmentFiles} />
			</div>
		</div>
	</div>
</div>
