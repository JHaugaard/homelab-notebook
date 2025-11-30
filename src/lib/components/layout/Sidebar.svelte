<script lang="ts">
	import { page } from '$app/stores';
	import {
		BookOpen,
		Wrench,
		FileText,
		Clock,
		Tags,
		Archive,
		Plus,
		Search,
		FolderKanban,
		ChevronDown,
		FlaskConical
	} from 'lucide-svelte';
	import { entryCounts, visibleProjects, showGlobalSearch, showNewProjectModal } from '$lib/stores';
	import { MODE_CONFIGS, STATUS_CONFIGS } from '$lib/types';
	import { getModifierKey } from '$lib/utils';

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	let projectsExpanded = $state(true);

	function isActive(path: string): boolean {
		return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
	}
</script>

<aside class="w-64 h-screen flex flex-col bg-[var(--color-background-secondary)] border-r border-[var(--color-border)]">
	<!-- Logo/Brand -->
	<div class="px-4 py-4 border-b border-[var(--color-border)]">
		<a href="/" class="flex items-center gap-2 text-[var(--color-text)] no-underline">
			<FlaskConical class="w-6 h-6 text-[var(--color-primary)]" />
			<span class="font-semibold text-lg">Homelab Notebook</span>
		</a>
	</div>

	<!-- Scrollable content -->
	<div class="flex-1 overflow-y-auto py-4">
		<!-- Modes Section -->
		<div class="px-3 mb-6">
			<h3 class="px-2 mb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
				Modes
			</h3>
			<nav class="space-y-1">
				{#each Object.values(MODE_CONFIGS) as mode}
					{@const Icon = modeIcons[mode.id]}
					{@const count = $entryCounts[mode.id]}
					<a
						href="/{mode.id}"
						class="flex items-center gap-3 px-2 py-2 rounded-md text-sm no-underline transition-colors
							{isActive('/' + mode.id)
								? 'bg-[var(--color-surface-active)] text-[var(--color-text)]'
								: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}"
					>
						<Icon class="w-4 h-4 {mode.color}" />
						<span class="flex-1">{mode.label}</span>
						{#if count > 0}
							<span class="text-xs text-[var(--color-text-muted)] tabular-nums">{count}</span>
						{/if}
					</a>
				{/each}
			</nav>
		</div>

		<!-- Projects Section -->
		<div class="px-3 mb-6">
			<div class="w-full flex items-center gap-2 px-2 mb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
				<button
					class="flex items-center gap-2 flex-1 hover:text-[var(--color-text)] transition-colors"
					onclick={() => (projectsExpanded = !projectsExpanded)}
				>
					<ChevronDown
						class="w-3 h-3 transition-transform {projectsExpanded ? '' : '-rotate-90'}"
					/>
					<span class="flex-1 text-left">Projects</span>
				</button>
				<button
					class="p-0.5 rounded hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
					onclick={() => ($showNewProjectModal = true)}
					aria-label="New project"
				>
					<Plus class="w-3.5 h-3.5" />
				</button>
			</div>

			{#if projectsExpanded}
				<nav class="space-y-1">
					{#each $visibleProjects as project}
						{@const statusConfig = STATUS_CONFIGS[project.status]}
						<a
							href="/projects/{project.id}"
							class="flex items-center gap-3 px-2 py-2 rounded-md text-sm no-underline transition-colors
								{isActive('/projects/' + project.id)
									? 'bg-[var(--color-surface-active)] text-[var(--color-text)]'
									: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}"
						>
							<span
								class="w-2 h-2 rounded-full {statusConfig.dotColor}"
								title={statusConfig.label}
							></span>
							<span class="flex-1 truncate">{project.name}</span>
						</a>
					{:else}
						<p class="px-2 py-2 text-xs text-[var(--color-text-muted)]">No projects yet</p>
					{/each}
					<a
						href="/projects"
						class="flex items-center gap-3 px-2 py-2 rounded-md text-sm no-underline text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)] transition-colors"
					>
						<FolderKanban class="w-4 h-4" />
						<span>All Projects</span>
					</a>
				</nav>
			{/if}
		</div>

		<!-- Quick Access Section -->
		<div class="px-3">
			<h3 class="px-2 mb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
				Quick Access
			</h3>
			<nav class="space-y-1">
				<a
					href="/recent"
					class="flex items-center gap-3 px-2 py-2 rounded-md text-sm no-underline transition-colors
						{isActive('/recent')
							? 'bg-[var(--color-surface-active)] text-[var(--color-text)]'
							: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}"
				>
					<Clock class="w-4 h-4" />
					<span>Recent</span>
				</a>
				<a
					href="/tags"
					class="flex items-center gap-3 px-2 py-2 rounded-md text-sm no-underline transition-colors
						{isActive('/tags')
							? 'bg-[var(--color-surface-active)] text-[var(--color-text)]'
							: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}"
				>
					<Tags class="w-4 h-4" />
					<span>Tags</span>
				</a>
				<a
					href="/archived"
					class="flex items-center gap-3 px-2 py-2 rounded-md text-sm no-underline transition-colors
						{isActive('/archived')
							? 'bg-[var(--color-surface-active)] text-[var(--color-text)]'
							: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}"
				>
					<Archive class="w-4 h-4" />
					<span>Archived</span>
				</a>
			</nav>
		</div>
	</div>

	<!-- Search footer -->
	<div class="px-3 py-3 border-t border-[var(--color-border)]">
		<button
			class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
			onclick={() => ($showGlobalSearch = true)}
		>
			<Search class="w-4 h-4" />
			<span class="flex-1 text-left">Search...</span>
			<kbd class="text-xs bg-[var(--color-surface-hover)] px-1.5 py-0.5 rounded">
				{getModifierKey()}K
			</kbd>
		</button>
	</div>
</aside>
