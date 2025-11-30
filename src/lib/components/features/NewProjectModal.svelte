<script lang="ts">
	import { goto } from '$app/navigation';
	import { Modal, Button, Input } from '$lib/components/ui';
	import { showNewProjectModal, projects, toasts } from '$lib/stores';
	import type { ProjectFormData } from '$lib/types';

	let name = $state('');
	let description = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit() {
		if (!name.trim()) {
			toasts.error('Project name is required');
			return;
		}

		isSubmitting = true;

		try {
			const data: ProjectFormData = {
				name: name.trim(),
				description: description.trim() || undefined,
				status: 'active'
			};

			const project = await projects.create(data);
			toasts.success('Project created');
			close();
			goto(`/projects/${project.id}`);
		} catch (error) {
			console.error('Failed to create project:', error);
			toasts.error('Failed to create project');
		} finally {
			isSubmitting = false;
		}
	}

	function close() {
		$showNewProjectModal = false;
		name = '';
		description = '';
	}
</script>

<Modal open={$showNewProjectModal} title="New Project" onclose={close}>
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
		<div>
			<label for="project-name" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Name <span class="text-red-500">*</span>
			</label>
			<Input
				id="project-name"
				bind:value={name}
				placeholder="Project name..."
				required
			/>
		</div>

		<div>
			<label for="project-description" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
				Description
			</label>
			<textarea
				id="project-description"
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
				{isSubmitting ? 'Creating...' : 'Create Project'}
			</Button>
		</div>
	{/snippet}
</Modal>
