<script lang="ts">
	import { Plus, FolderKanban, MoreVertical, Archive, Trash2 } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge, Modal } from '$lib/components/ui';
	import { projects, showNewProjectModal, toasts } from '$lib/stores';
	import { STATUS_CONFIGS, type ProjectStatus } from '$lib/types';
	import { formatRelativeTime } from '$lib/utils';
	import NewProjectModal from '$lib/components/features/NewProjectModal.svelte';

	let showArchived = $state(false);
	let projectToDelete = $state<string | null>(null);

	// Filter projects based on archived toggle
	let filteredProjects = $derived.by(() => {
		if (showArchived) {
			return $projects;
		}
		return $projects.filter((p) => p.status !== 'archived');
	});

	// Group by status
	let groupedProjects = $derived.by(() => {
		const groups: Record<ProjectStatus, typeof filteredProjects> = {
			active: [],
			paused: [],
			completed: [],
			archived: []
		};

		for (const project of filteredProjects) {
			groups[project.status].push(project);
		}

		return groups;
	});

	async function handleDelete() {
		if (!projectToDelete) return;

		try {
			await projects.delete(projectToDelete);
			toasts.success('Project deleted');
		} catch (error) {
			console.error('Failed to delete project:', error);
			toasts.error('Failed to delete project');
		} finally {
			projectToDelete = null;
		}
	}

	async function updateStatus(id: string, status: ProjectStatus) {
		try {
			await projects.updateStatus(id, status);
			toasts.success(`Project ${status}`);
		} catch (error) {
			console.error('Failed to update project:', error);
			toasts.error('Failed to update project');
		}
	}
</script>

<svelte:head>
	<title>Projects | Homelab Notebook</title>
</svelte:head>

<Header title="Projects" subtitle="Organize your work">
	{#snippet actions()}
		<label class="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
			<input
				type="checkbox"
				bind:checked={showArchived}
				class="rounded border-[var(--color-border)]"
			/>
			Show archived
		</label>
		<Button variant="primary" onclick={() => ($showNewProjectModal = true)}>
			<Plus class="w-4 h-4" />
			New Project
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto p-6">
	{#if filteredProjects.length > 0}
		<div class="space-y-8 max-w-4xl">
			{#each Object.entries(groupedProjects) as [status, statusProjects]}
				{#if statusProjects.length > 0}
					{@const config = STATUS_CONFIGS[status as ProjectStatus]}
					<section>
						<h2 class="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
							<span class="w-2 h-2 rounded-full {config.dotColor}"></span>
							{config.label}
							<span class="text-xs font-normal">({statusProjects.length})</span>
						</h2>

						<div class="space-y-3">
							{#each statusProjects as project}
								<div class="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all">
									<a
										href="/projects/{project.id}"
										class="flex-1 min-w-0 no-underline"
									>
										<h3 class="font-medium text-[var(--color-text)] hover:text-[var(--color-primary)]">
											{project.name}
										</h3>
										{#if project.description}
											<p class="text-sm text-[var(--color-text-muted)] truncate mt-0.5">
												{project.description}
											</p>
										{/if}
									</a>

									<span class="text-xs text-[var(--color-text-muted)]">
										{formatRelativeTime(project.updated)}
									</span>

									<!-- Status actions dropdown -->
									<div class="relative group">
										<button class="p-1.5 rounded hover:bg-[var(--color-surface-hover)]">
											<MoreVertical class="w-4 h-4 text-[var(--color-text-muted)]" />
										</button>

										<div class="absolute right-0 mt-1 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
											{#if project.status !== 'active'}
												<button
													class="w-full px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
													onclick={() => updateStatus(project.id, 'active')}
												>
													Mark Active
												</button>
											{/if}
											{#if project.status !== 'paused'}
												<button
													class="w-full px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
													onclick={() => updateStatus(project.id, 'paused')}
												>
													Mark Paused
												</button>
											{/if}
											{#if project.status !== 'completed'}
												<button
													class="w-full px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
													onclick={() => updateStatus(project.id, 'completed')}
												>
													Mark Completed
												</button>
											{/if}
											{#if project.status !== 'archived'}
												<button
													class="w-full px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
													onclick={() => updateStatus(project.id, 'archived')}
												>
													<Archive class="w-3.5 h-3.5 inline mr-1.5" />
													Archive
												</button>
											{/if}
											<hr class="my-1 border-[var(--color-border)]" />
											<button
												class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
												onclick={() => (projectToDelete = project.id)}
											>
												<Trash2 class="w-3.5 h-3.5 inline mr-1.5" />
												Delete
											</button>
										</div>
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
				<FolderKanban class="w-8 h-8 text-[var(--color-text-muted)]" />
			</div>
			<h3 class="text-lg font-medium text-[var(--color-text)] mb-2">No projects yet</h3>
			<p class="text-sm text-[var(--color-text-muted)] mb-4 max-w-md">
				Projects help you organize related entries across all modes.
			</p>
			<Button variant="primary" onclick={() => ($showNewProjectModal = true)}>
				<Plus class="w-4 h-4" />
				Create your first project
			</Button>
		</div>
	{/if}
</div>

<!-- New Project Modal -->
<NewProjectModal />

<!-- Delete confirmation modal -->
<Modal
	open={projectToDelete !== null}
	title="Delete Project"
	onclose={() => (projectToDelete = null)}
>
	<p class="text-sm text-[var(--color-text-secondary)]">
		Are you sure you want to delete this project? Entries associated with this project will not be deleted, but will no longer be linked to any project.
	</p>

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={() => (projectToDelete = null)}>Cancel</Button>
			<Button variant="danger" onclick={handleDelete}>Delete</Button>
		</div>
	{/snippet}
</Modal>
