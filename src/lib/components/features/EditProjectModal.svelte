<script lang="ts">
	import { Modal, Button, Input } from '$lib/components/ui';
	import { editProjectId, projects, toasts } from '$lib/stores';
	import { projectService } from '$lib/services/pocketbase';
	import type { Project } from '$lib/types';

	let name = $state('');
	let description = $state('');
	let isSubmitting = $state(false);
	let originalProject = $state<Project | null>(null);

	// Load project data when editProjectId changes
	$effect(() => {
		const projectId = $editProjectId;
		if (projectId) {
			loadProject(projectId);
		} else {
			resetForm();
		}
	});

	async function loadProject(id: string) {
		try {
			const project = await projectService.getById(id);
			originalProject = project;
			name = project.name;
			description = project.description || '';
		} catch (error) {
			console.error('Failed to load project:', error);
			toasts.error('Failed to load project');
			close();
		}
	}

	function resetForm() {
		name = '';
		description = '';
		originalProject = null;
	}

	async function handleSubmit() {
		if (!name.trim()) {
			toasts.error('Project name is required');
			return;
		}

		if (!$editProjectId || !originalProject) return;

		isSubmitting = true;

		try {
			await projects.update($editProjectId, {
				name: name.trim(),
				description: description.trim() || undefined
			});
			toasts.success('Project updated');
			close();
		} catch (error) {
			console.error('Failed to update project:', error);
			toasts.error('Failed to update project');
		} finally {
			isSubmitting = false;
		}
	}

	function close() {
		$editProjectId = null;
		resetForm();
	}
</script>

<Modal open={$editProjectId !== null} title="Edit Project" onclose={close}>
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
		<div>
			<label for="edit-project-name" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Name <span class="text-red-500">*</span>
			</label>
			<Input
				id="edit-project-name"
				bind:value={name}
				placeholder="Project name..."
				required
			/>
		</div>

		<div>
			<label for="edit-project-description" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Description
			</label>
			<textarea
				id="edit-project-description"
				bind:value={description}
				placeholder="Brief description (optional)..."
				rows={3}
				class="w-full px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-border-strong)] resize-none"
			></textarea>
		</div>
	</form>

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={close}>Cancel</Button>
			<Button variant="primary" onclick={handleSubmit} disabled={isSubmitting}>
				{isSubmitting ? 'Saving...' : 'Save Changes'}
			</Button>
		</div>
	{/snippet}
</Modal>
