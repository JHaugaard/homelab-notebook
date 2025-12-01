<script lang="ts">
	import { BookOpen, Wrench, FileText, Plus, ArrowRight } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button } from '$lib/components/ui';
	import { entryCounts, activeProjects, showQuickCapture, tags } from '$lib/stores';
	import { MODE_CONFIGS } from '$lib/types';

	const modeIcons = {
		research: BookOpen,
		project: Wrench,
		reference: FileText
	};

	const modeColors = {
		research: {
			icon: 'text-[var(--color-mode-research)]',
			bg: 'bg-[var(--color-mode-research-subtle)]',
			border: 'border-[var(--color-mode-research)]',
			hoverBorder: 'hover:border-[var(--color-mode-research)]'
		},
		project: {
			icon: 'text-[var(--color-mode-project)]',
			bg: 'bg-[var(--color-mode-project-subtle)]',
			border: 'border-[var(--color-mode-project)]',
			hoverBorder: 'hover:border-[var(--color-mode-project)]'
		},
		reference: {
			icon: 'text-[var(--color-mode-reference)]',
			bg: 'bg-[var(--color-mode-reference-subtle)]',
			border: 'border-[var(--color-mode-reference)]',
			hoverBorder: 'hover:border-[var(--color-mode-reference)]'
		}
	};

	// Calculate total entries
	let totalEntries = $derived(
		$entryCounts.research + $entryCounts.project + $entryCounts.reference
	);
</script>

<svelte:head>
	<title>Haugaard Homelab | Homelab Notebook</title>
</svelte:head>

<Header title="Haugaard Homelab">
	{#snippet actions()}
		<Button variant="primary" onclick={() => ($showQuickCapture = true)}>
			<Plus class="w-4 h-4" />
			New Entry
		</Button>
	{/snippet}
</Header>

<div class="flex-1 overflow-y-auto">
	<div class="max-w-4xl mx-auto px-6 py-8">
		<!-- Welcome Card -->
		<section class="mb-10">
			<div class="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background-secondary)] p-8">
				<!-- Subtle decorative element -->
				<div class="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none">
					<svg viewBox="0 0 200 200" class="w-full h-full">
						<circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="0.5" />
						<circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="0.5" />
						<circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="0.5" />
					</svg>
				</div>

				<div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
					<div>
						<h2 class="text-2xl mb-2">Welcome back!</h2>
						<p class="text-[var(--color-text-secondary)]">
							{#if totalEntries === 0}
								Start capturing your knowledge. Create your first entry to get started.
							{:else}
								You have <span class="font-semibold text-[var(--color-text)]">{totalEntries}</span>
								{totalEntries === 1 ? 'entry' : 'entries'} across
								<span class="font-semibold text-[var(--color-text)]">{$activeProjects.length}</span>
								{$activeProjects.length === 1 ? 'project' : 'projects'}.
							{/if}
						</p>
					</div>
					<Button
						variant="primary"
						size="lg"
						onclick={() => ($showQuickCapture = true)}
						class="shrink-0"
					>
						<Plus class="w-4 h-4" />
						New Entry
					</Button>
				</div>
			</div>
		</section>

		<!-- Mode Cards -->
		<section>
			<h3 class="text-sm font-semibold text-[var(--color-text-muted)] tracking-wider mb-4">
				Browse by Mode
			</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each Object.values(MODE_CONFIGS) as mode}
					{@const Icon = modeIcons[mode.id]}
					{@const colors = modeColors[mode.id]}
					{@const count = $entryCounts[mode.id]}
					<a
						href="/{mode.id}"
						class="
							group relative p-5 rounded-xl
							border border-[var(--color-border)] {colors.hoverBorder}
							bg-[var(--color-surface)]
							transition-all duration-200
							hover:shadow-[var(--shadow-md)]
						"
					>
						<!-- Mode icon with subtle background -->
						<div class="flex items-start justify-between mb-4">
							<div class="p-2.5 rounded-lg {colors.bg}">
								<Icon class="w-5 h-5 {colors.icon}" />
							</div>
							<ArrowRight class="w-4 h-4 text-[var(--color-text-light)] opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>

						<!-- Mode name and count -->
						<h4 class="font-display text-xl text-[var(--color-text)] mb-1">
							{mode.label}
						</h4>
						<p class="text-sm text-[var(--color-text-muted)] mb-3">
							{mode.description}
						</p>

						<!-- Entry count badge -->
						<div class="flex items-center gap-2">
							<span class="text-2xl font-semibold text-[var(--color-text)] tabular-nums">
								{count}
							</span>
							<span class="text-sm text-[var(--color-text-muted)]">
								{count === 1 ? 'entry' : 'entries'}
							</span>
						</div>

						<!-- Subtle bottom accent line on hover -->
						<div class="absolute bottom-0 left-4 right-4 h-0.5 rounded-full {colors.bg} opacity-0 group-hover:opacity-100 transition-opacity"></div>
					</a>
				{/each}
			</div>
		</section>
	</div>
</div>
