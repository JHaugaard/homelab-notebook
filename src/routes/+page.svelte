<script lang="ts">
	import { BookOpen, Wrench, FileText, Plus, Clock, ArrowRight, Search, Keyboard } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button } from '$lib/components/ui';
	import { entryCounts, recentEntries, activeProjects, showQuickCapture, showGlobalSearch, tags } from '$lib/stores';
	import { MODE_CONFIGS, STATUS_CONFIGS } from '$lib/types';
	import { formatRelativeTime } from '$lib/utils';

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	// Calculate total entries
	let totalEntries = $derived(
		$entryCounts.research + $entryCounts.project + $entryCounts.reference
	);
</script>

<svelte:head>
	<title>Dashboard | Homelab Notebook</title>
</svelte:head>

<Header title="Dashboard" subtitle="Your knowledge at a glance">
	{#snippet actions()}
		<Button variant="primary" onclick={() => ($showQuickCapture = true)}>
			<Plus class="w-4 h-4" />
			New Entry
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto p-6">
	<!-- Quick Actions Bar -->
	<section class="mb-8">
		<div class="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-[var(--color-surface-hover)]">
			<div class="flex-1">
				<p class="text-sm text-[var(--color-text-muted)]">
					<span class="font-medium text-[var(--color-text)]">{totalEntries}</span> total entries across {$activeProjects.length} projects with {$tags.length} tags
				</p>
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => ($showGlobalSearch = true)}
					class="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-muted)] bg-[var(--color-surface)] rounded-md border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
				>
					<Search class="w-4 h-4" />
					<span>Search</span>
					<kbd class="ml-2 px-1.5 py-0.5 text-xs bg-[var(--color-background)] rounded">⌘K</kbd>
				</button>
				<Button variant="primary" onclick={() => ($showQuickCapture = true)}>
					<Plus class="w-4 h-4" />
					<span class="hidden sm:inline">New</span>
					<kbd class="ml-1 px-1.5 py-0.5 text-xs bg-[var(--color-primary-dark)] rounded hidden sm:inline">⌘N</kbd>
				</Button>
			</div>
		</div>
	</section>

	<!-- Mode Stats -->
	<section class="mb-8">
		<h2 class="text-lg font-semibold text-[var(--color-text)] mb-4">Overview</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each Object.values(MODE_CONFIGS) as mode}
				{@const Icon = modeIcons[mode.id]}
				{@const count = $entryCounts[mode.id]}
				<a
					href="/{mode.id}"
					class="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-sm transition-all no-underline group"
				>
					<div class="p-3 rounded-lg {mode.bgColor}">
						<Icon class="w-6 h-6 {mode.color}" />
					</div>
					<div class="flex-1">
						<h3 class="font-medium text-[var(--color-text)]">{mode.label}</h3>
						<p class="text-2xl font-semibold text-[var(--color-text)] tabular-nums">{count}</p>
					</div>
					<ArrowRight class="w-5 h-5 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
				</a>
			{/each}
		</div>
	</section>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Recent Entries -->
		<section>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold text-[var(--color-text)]">Recent Entries</h2>
				<a href="/recent" class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
					View all
				</a>
			</div>
			<div class="space-y-2">
				{#each $recentEntries.slice(0, 5) as entry}
					{@const Icon = modeIcons[entry.mode]}
					{@const config = MODE_CONFIGS[entry.mode]}
					<a
						href="/{entry.mode}/{entry.id}"
						class="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all no-underline"
					>
						<Icon class="w-4 h-4 {config.color}" />
						<span class="flex-1 truncate text-sm text-[var(--color-text)]">{entry.title}</span>
						<span class="text-xs text-[var(--color-text-muted)]">
							{formatRelativeTime(entry.created)}
						</span>
					</a>
				{:else}
					<div class="p-8 text-center border border-dashed border-[var(--color-border)] rounded-lg">
						<Clock class="w-8 h-8 mx-auto mb-2 text-[var(--color-text-muted)]" />
						<p class="text-sm text-[var(--color-text-muted)]">No entries yet</p>
						<Button
							variant="ghost"
							size="sm"
							class="mt-2"
							onclick={() => ($showQuickCapture = true)}
						>
							Create your first entry
						</Button>
					</div>
				{/each}
			</div>
		</section>

		<!-- Active Projects -->
		<section>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold text-[var(--color-text)]">Active Projects</h2>
				<a href="/projects" class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
					View all
				</a>
			</div>
			<div class="space-y-2">
				{#each $activeProjects.slice(0, 5) as project}
					{@const status = STATUS_CONFIGS[project.status]}
					<a
						href="/projects/{project.id}"
						class="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all no-underline"
					>
						<span class="w-2 h-2 rounded-full {status.dotColor}"></span>
						<span class="flex-1 truncate text-sm text-[var(--color-text)]">{project.name}</span>
						<span class="text-xs text-[var(--color-text-muted)]">
							{formatRelativeTime(project.updated)}
						</span>
					</a>
				{:else}
					<div class="p-8 text-center border border-dashed border-[var(--color-border)] rounded-lg">
						<Wrench class="w-8 h-8 mx-auto mb-2 text-[var(--color-text-muted)]" />
						<p class="text-sm text-[var(--color-text-muted)]">No active projects</p>
						<a
							href="/projects/new"
							class="inline-flex items-center gap-1 mt-2 text-sm text-[var(--color-primary)] hover:underline"
						>
							<Plus class="w-4 h-4" />
							Create a project
						</a>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
