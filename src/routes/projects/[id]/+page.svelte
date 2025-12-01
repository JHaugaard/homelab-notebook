<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		ArrowLeft,
		Edit,
		BookOpen,
		Wrench,
		FileText,
		Calendar,
		Play,
		Pause,
		CheckCircle,
		Plus
	} from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge } from '$lib/components/ui';
	import { projects, entries, toasts } from '$lib/stores';
	import { projectService, entryService } from '$lib/services/pocketbase';
	import { STATUS_CONFIGS, MODE_CONFIGS, type Project, type Entry, type ProjectStatus } from '$lib/types';
	import { formatDate, formatRelativeTime } from '$lib/utils';

	let project = $state<Project | null>(null);
	let projectEntries = $state<Entry[]>([]);
	let loading = $state(true);

	const id = $derived($page.params.id);

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	// Group entries by mode
	let entriesByMode = $derived.by(() => {
		const groups = {
			research: projectEntries.filter((e) => e.mode === 'research'),
			project: projectEntries.filter((e) => e.mode === 'project'),
			reference: projectEntries.filter((e) => e.mode === 'reference')
		};
		return groups;
	});

	async function loadProject(projectId: string) {
		loading = true;
		try {
			project = await projectService.getById(projectId);
			projectEntries = await entryService.getByProject(projectId);
		} catch (error) {
			console.error('Failed to load project:', error);
			toasts.error('Project not found');
			goto('/projects');
		} finally {
			loading = false;
		}
	}

	// React to id changes (handles both initial load and navigation between projects)
	$effect(() => {
		if (id) {
			loadProject(id);
		}
	});

	async function updateStatus(status: ProjectStatus) {
		if (!project) return;

		try {
			await projects.updateStatus(project.id, status);
			project = { ...project, status };
			toasts.success(`Project ${status}`);
		} catch (error) {
			console.error('Failed to update project:', error);
			toasts.error('Failed to update project');
		}
	}
</script>

<svelte:head>
	<title>{project?.name || 'Loading...'} | Projects | Homelab Notebook</title>
</svelte:head>

{#if loading}
	<div class="flex-1 flex items-center justify-center">
		<p class="text-[var(--color-text-muted)]">Loading...</p>
	</div>
{:else if project}
	{@const status = STATUS_CONFIGS[project.status]}

	<Header title={project.name} subtitle={project.description}>
		{#snippet actions()}
			<Button variant="ghost" onclick={() => goto('/projects')}>
				<ArrowLeft class="w-4 h-4" />
				Back
			</Button>

			<!-- Status toggle buttons -->
			{#if project.status !== 'active'}
				<Button variant="secondary" onclick={() => updateStatus('active')}>
					<Play class="w-4 h-4" />
					Activate
				</Button>
			{/if}
			{#if project.status === 'active'}
				<Button variant="secondary" onclick={() => updateStatus('paused')}>
					<Pause class="w-4 h-4" />
					Pause
				</Button>
			{/if}
			{#if project.status !== 'completed'}
				<Button variant="secondary" onclick={() => updateStatus('completed')}>
					<CheckCircle class="w-4 h-4" />
					Complete
				</Button>
			{/if}
		{/snippet}
	</Header>

	<div class="flex-1 overflow-y-auto p-6">
		<div class="max-w-4xl mx-auto">
			<!-- Status and meta -->
			<div class="flex items-center gap-4 mb-8">
				<Badge>
					<span class="w-2 h-2 rounded-full {status.dotColor} mr-1.5"></span>
					{status.label}
				</Badge>
				<span class="text-sm text-[var(--color-text-muted)] flex items-center gap-1.5">
					<Calendar class="w-4 h-4" />
					Created {formatDate(project.created)}
				</span>
				<span class="text-sm text-[var(--color-text-muted)]">
					Last updated {formatRelativeTime(project.updated)}
				</span>
			</div>

			<!-- Entries by mode -->
			<div class="space-y-8">
				{#each Object.entries(entriesByMode) as [mode, modeEntries]}
					{@const Icon = modeIcons[mode as keyof typeof modeIcons]}
					{@const config = MODE_CONFIGS[mode as keyof typeof MODE_CONFIGS]}

					<section>
						<div class="flex items-center justify-between mb-4">
							<h2 class="flex items-center gap-2 text-lg font-semibold text-[var(--color-text)]">
								<Icon class="w-5 h-5 {config.color}" />
								{config.label}
								<span class="text-sm font-normal text-[var(--color-text-muted)]">
									({modeEntries.length})
								</span>
							</h2>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => goto(`/${mode}/new?project=${project.id}`)}
							>
								<Plus class="w-4 h-4" />
								Add
							</Button>
						</div>

						{#if modeEntries.length > 0}
							<div class="space-y-2">
								{#each modeEntries as entry}
									<a
										href="/{entry.mode}/{entry.id}"
										class="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all no-underline"
									>
										<span class="flex-1 text-sm text-[var(--color-text)] truncate">
											{entry.title}
										</span>
										<span class="text-xs text-[var(--color-text-muted)]">
											{formatRelativeTime(entry.created)}
										</span>
									</a>
								{/each}
							</div>
						{:else}
							<div class="p-6 text-center border border-dashed border-[var(--color-border)] rounded-lg">
								<p class="text-sm text-[var(--color-text-muted)]">
									No {config.label.toLowerCase()} entries yet
								</p>
							</div>
						{/if}
					</section>
				{/each}
			</div>

			<!-- Quick actions -->
			<div class="mt-12 pt-6 border-t border-[var(--color-border)]">
				<h3 class="text-sm font-medium text-[var(--color-text-muted)] mb-4">Quick Add</h3>
				<div class="flex flex-wrap gap-2">
					{#each Object.values(MODE_CONFIGS) as mode}
						{@const Icon = modeIcons[mode.id]}
						<Button
							variant="secondary"
							onclick={() => goto(`/${mode.id}/new?project=${project.id}`)}
						>
							<Icon class="w-4 h-4 {mode.color}" />
							New {mode.label}
						</Button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
