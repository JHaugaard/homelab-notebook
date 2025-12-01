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
		FolderKanban,
		ChevronDown,
		FlaskConical,
		X
	} from 'lucide-svelte';
	import {
		entryCounts,
		visibleProjects,
		recentEntries,
		showNewProjectModal,
		sidebarOpen
	} from '$lib/stores';
	import { MODE_CONFIGS, STATUS_CONFIGS } from '$lib/types';

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	const modeColors = {
		research: {
			icon: 'text-[var(--color-mode-research)]',
			bg: 'bg-[var(--color-mode-research-subtle)]',
			activeBg: 'bg-[var(--color-mode-research-muted)]'
		},
		project: {
			icon: 'text-[var(--color-mode-project)]',
			bg: 'bg-[var(--color-mode-project-subtle)]',
			activeBg: 'bg-[var(--color-mode-project-muted)]'
		},
		reference: {
			icon: 'text-[var(--color-mode-reference)]',
			bg: 'bg-[var(--color-mode-reference-subtle)]',
			activeBg: 'bg-[var(--color-mode-reference-muted)]'
		}
	};

	let projectsExpanded = $state(true);
	let recentExpanded = $state(true);

	function isActive(path: string): boolean {
		return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
	}

	function closeSidebarOnMobile() {
		if (window.innerWidth < 768) {
			$sidebarOpen = false;
		}
	}
</script>

<aside
	class="
		fixed md:relative inset-y-0 left-0 z-40
		w-[var(--sidebar-width)] h-screen
		flex flex-col
		bg-[var(--color-background-secondary)]
		border-r border-[var(--color-border)]
		transform transition-transform duration-200 ease-out
		{$sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hidden'}
	"
>
	<!-- Logo/Brand -->
	<div class="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
		<a
			href="/"
			class="flex items-center gap-2.5 text-[var(--color-text)]"
			onclick={closeSidebarOnMobile}
		>
			<div class="p-1.5 rounded-lg bg-[var(--color-primary-subtle)]">
				<FlaskConical class="w-5 h-5 text-[var(--color-primary)]" />
			</div>
			<span class="font-display text-lg">Homelab Notebook</span>
		</a>
		<!-- Mobile close button -->
		<button
			class="md:hidden p-1.5 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
			onclick={() => ($sidebarOpen = false)}
			aria-label="Close sidebar"
		>
			<X class="w-5 h-5" />
		</button>
	</div>

	<!-- Scrollable content -->
	<div class="flex-1 overflow-y-auto py-4">
		<!-- Modes Section -->
		<div class="px-3 mb-6">
			<h3 class="px-3 mb-2 text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wider">
				Modes
			</h3>
			<nav class="space-y-0.5">
				{#each Object.values(MODE_CONFIGS) as mode}
					{@const Icon = modeIcons[mode.id]}
					{@const colors = modeColors[mode.id]}
					{@const count = $entryCounts[mode.id]}
					{@const active = isActive('/' + mode.id)}
					<a
						href="/{mode.id}"
						onclick={closeSidebarOnMobile}
						class="
							flex items-center gap-3 px-3 py-2 rounded-lg text-sm
							{active
								? colors.activeBg + ' text-[var(--color-text)]'
								: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}
						"
					>
						<div class="p-1 rounded-md {active ? colors.bg : ''}">
							<Icon class="w-4 h-4 {colors.icon}" />
						</div>
						<span class="flex-1 font-medium">{mode.label}</span>
						{#if count > 0}
							<span class="text-xs text-[var(--color-text-muted)] tabular-nums px-1.5 py-0.5 rounded-full bg-[var(--color-surface-hover)]">
								{count}
							</span>
						{/if}
					</a>
				{/each}
			</nav>
		</div>

		<!-- Projects Section -->
		<div class="px-3 mb-6">
			<div class="flex items-center gap-2 px-3 mb-2">
				<button
					class="flex items-center gap-2 flex-1 text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wider hover:text-[var(--color-text-secondary)]"
					onclick={() => (projectsExpanded = !projectsExpanded)}
				>
					<ChevronDown
						class="w-3 h-3 transition-transform duration-200 {projectsExpanded ? '' : '-rotate-90'}"
					/>
					<span>Projects</span>
				</button>
				<button
					class="p-1 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
					onclick={() => ($showNewProjectModal = true)}
					aria-label="New project"
				>
					<Plus class="w-3.5 h-3.5" />
				</button>
			</div>

			{#if projectsExpanded}
				<nav class="space-y-0.5 animate-fade-in">
					{#each $visibleProjects.slice(0, 5) as project}
						{@const statusConfig = STATUS_CONFIGS[project.status]}
						{@const active = isActive('/projects/' + project.id)}
						<a
							href="/projects/{project.id}"
							onclick={closeSidebarOnMobile}
							class="
								flex items-center gap-3 px-3 py-2 rounded-lg text-sm
								{active
									? 'bg-[var(--color-surface-active)] text-[var(--color-text)]'
									: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}
							"
						>
							<span
								class="w-2 h-2 rounded-full flex-shrink-0 {statusConfig.dotColor}"
								title={statusConfig.label}
							></span>
							<span class="flex-1 truncate">{project.name}</span>
						</a>
					{:else}
						<p class="px-3 py-2 text-xs text-[var(--color-text-muted)] italic">No projects yet</p>
					{/each}
					{#if $visibleProjects.length > 5}
						<a
							href="/projects"
							onclick={closeSidebarOnMobile}
							class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]"
						>
							<FolderKanban class="w-4 h-4" />
							<span>View all ({$visibleProjects.length})</span>
						</a>
					{:else if $visibleProjects.length > 0}
						<a
							href="/projects"
							onclick={closeSidebarOnMobile}
							class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]"
						>
							<FolderKanban class="w-4 h-4" />
							<span>All Projects</span>
						</a>
					{/if}
				</nav>
			{/if}
		</div>

		<!-- Recent Entries Section -->
		<div class="px-3 mb-6">
			<div class="flex items-center gap-2 px-3 mb-2">
				<button
					class="flex items-center gap-2 flex-1 text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wider hover:text-[var(--color-text-secondary)]"
					onclick={() => (recentExpanded = !recentExpanded)}
				>
					<ChevronDown
						class="w-3 h-3 transition-transform duration-200 {recentExpanded ? '' : '-rotate-90'}"
					/>
					<span>Recent</span>
				</button>
			</div>

			{#if recentExpanded}
				<nav class="space-y-0.5 animate-fade-in">
					{#each $recentEntries.slice(0, 4) as entry}
						{@const Icon = modeIcons[entry.mode]}
						{@const colors = modeColors[entry.mode]}
						<a
							href="/{entry.mode}/{entry.id}"
							onclick={closeSidebarOnMobile}
							class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] group"
						>
							<Icon class="w-3.5 h-3.5 {colors.icon} flex-shrink-0 opacity-60 group-hover:opacity-100" />
							<span class="flex-1 truncate text-[13px]">{entry.title}</span>
						</a>
					{:else}
						<p class="px-3 py-2 text-xs text-[var(--color-text-muted)] italic">No recent entries</p>
					{/each}
					{#if $recentEntries.length > 4}
						<a
							href="/recent"
							onclick={closeSidebarOnMobile}
							class="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]"
						>
							<Clock class="w-3.5 h-3.5" />
							<span>View all recent</span>
						</a>
					{/if}
				</nav>
			{/if}
		</div>

		<!-- Quick Access Section -->
		<div class="px-3">
			<h3 class="px-3 mb-2 text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wider">
				Quick Access
			</h3>
			<nav class="space-y-0.5">
				<a
					href="/tags"
					onclick={closeSidebarOnMobile}
					class="
						flex items-center gap-3 px-3 py-2 rounded-lg text-sm
						{isActive('/tags')
							? 'bg-[var(--color-surface-active)] text-[var(--color-text)]'
							: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}
					"
				>
					<Tags class="w-4 h-4 text-[var(--color-text-muted)]" />
					<span>Tags</span>
				</a>
				<a
					href="/archived"
					onclick={closeSidebarOnMobile}
					class="
						flex items-center gap-3 px-3 py-2 rounded-lg text-sm
						{isActive('/archived')
							? 'bg-[var(--color-surface-active)] text-[var(--color-text)]'
							: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}
					"
				>
					<Archive class="w-4 h-4 text-[var(--color-text-muted)]" />
					<span>Archived</span>
				</a>
			</nav>
		</div>
	</div>

</aside>
