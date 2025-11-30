<script lang="ts">
	import { Plus, Wrench, FolderOpen, ChevronDown } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button, Badge } from '$lib/components/ui';
	import { projectEntries, visibleProjects, viewPreferences } from '$lib/stores';
	import { formatTimelineDate, formatTime, groupByDate, truncate } from '$lib/utils';

	let selectedProject = $state<string | null>(null);

	// Filter entries by selected project
	let filteredEntries = $derived.by(() => {
		if (!selectedProject) return $projectEntries;
		return $projectEntries.filter((e) => e.project === selectedProject);
	});

	// Sort entries based on preference
	let sortedEntries = $derived.by(() => {
		const sorted = [...filteredEntries];
		if ($viewPreferences.projectTimelineOrder === 'oldest') {
			sorted.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
		}
		return sorted;
	});

	// Group entries by date
	let groupedEntries = $derived(groupByDate(sortedEntries));

	function toggleOrder() {
		viewPreferences.update({
			projectTimelineOrder:
				$viewPreferences.projectTimelineOrder === 'newest' ? 'oldest' : 'newest'
		});
	}
</script>

<svelte:head>
	<title>Project Log | Homelab Notebook</title>
</svelte:head>

<Header title="Project Log" mode="project" subtitle="Developer journal and notes">
	{#snippet actions()}
		<Button variant="primary" onclick={() => window.location.href = '/project/new'}>
			<Plus class="w-4 h-4" />
			New Entry
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto">
	<!-- Filters bar -->
	<div class="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 bg-[var(--color-background)] border-b border-[var(--color-border)]">
		<div class="flex items-center gap-2">
			<label for="project-filter" class="text-sm text-[var(--color-text-muted)]">Project:</label>
			<select
				id="project-filter"
				bind:value={selectedProject}
				class="px-3 py-1.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-border-strong)]"
			>
				<option value={null}>All Projects</option>
				{#each $visibleProjects as project}
					<option value={project.id}>{project.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex-1"></div>

		<button
			class="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
			onclick={toggleOrder}
		>
			{$viewPreferences.projectTimelineOrder === 'newest' ? 'Newest First' : 'Oldest First'}
			<ChevronDown class="w-4 h-4" />
		</button>
	</div>

	<!-- Timeline -->
	<div class="p-6">
		{#if sortedEntries.length > 0}
			{#each groupedEntries as [dateKey, entries]}
				<!-- Date header -->
				<div class="flex items-center gap-4 mb-4 mt-8 first:mt-0">
					<h3 class="text-sm font-semibold text-[var(--color-text-muted)] tracking-wide">
						{formatTimelineDate(entries[0].created)}
					</h3>
					<div class="flex-1 h-px bg-[var(--color-border)]"></div>
				</div>

				<!-- Entries for this date -->
				<div class="space-y-4 ml-2 pl-6 border-l-2 border-[var(--color-border)]">
					{#each entries as entry}
						<a
							href="/project/{entry.id}"
							class="block relative p-4 -ml-[9px] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-sm bg-[var(--color-surface)] transition-all no-underline group"
						>
							<!-- Timeline dot -->
							<div class="absolute -left-[23px] top-5 w-3 h-3 rounded-full bg-amber-500 border-2 border-[var(--color-background)]"></div>

							<!-- Header -->
							<div class="flex items-start justify-between gap-3 mb-2">
								<div class="flex items-center gap-2">
									<span class="text-sm font-medium text-amber-600">
										{formatTime(entry.created)}
									</span>
									{#if entry.expand?.project}
										<span class="text-[var(--color-text-muted)]">·</span>
										<span class="text-sm text-[var(--color-text-muted)]">
											{entry.expand.project.name}
										</span>
									{/if}
								</div>
								<span class="text-xs text-[var(--color-text-light)] opacity-0 group-hover:opacity-100 transition-opacity">
									Edit
								</span>
							</div>

							<!-- Title -->
							<h4 class="font-medium text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)]">
								{entry.title}
							</h4>

							<!-- Content preview -->
							{#if entry.content}
								<p class="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-3">
									{truncate(entry.content.replace(/[#*`_]/g, ''), 200)}
								</p>
							{/if}

							<!-- Tags -->
							{#if entry.expand?.tags && entry.expand.tags.length > 0}
								<div class="flex flex-wrap gap-1">
									{#each entry.expand.tags.slice(0, 5) as tag}
										<Badge size="sm" variant="project">{tag.name}</Badge>
									{/each}
									{#if entry.expand.tags.length > 5}
										<Badge size="sm" variant="outline">+{entry.expand.tags.length - 5}</Badge>
									{/if}
								</div>
							{/if}
						</a>
					{/each}
				</div>
			{/each}
		{:else}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="p-4 rounded-full bg-amber-50 mb-4">
					<Wrench class="w-8 h-8 text-amber-600" />
				</div>
				<h3 class="text-lg font-medium text-[var(--color-text)] mb-2">No project log entries yet</h3>
				<p class="text-sm text-[var(--color-text-muted)] mb-4 max-w-md">
					Start documenting your work sessions, discoveries, and progress.
				</p>
				<Button variant="primary" onclick={() => window.location.href = '/project/new'}>
					<Plus class="w-4 h-4" />
					Create your first log entry
				</Button>
			</div>
		{/if}
	</div>
</div>
