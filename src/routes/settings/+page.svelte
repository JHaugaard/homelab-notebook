<script lang="ts">
	import { Settings, Sun, Moon, Keyboard, Database, Cpu } from 'lucide-svelte';
	import { Header } from '$lib/components/layout';
	import { Button } from '$lib/components/ui';
	import { viewPreferences, toasts } from '$lib/stores';

	function resetPreferences() {
		viewPreferences.reset();
		toasts.success('Preferences reset to defaults');
	}
</script>

<svelte:head>
	<title>Settings | Homelab Notebook</title>
</svelte:head>

<Header title="Settings" subtitle="Customize your experience">
</Header>

<div class="flex-1 overflow-y-auto p-6">
	<div class="max-w-2xl space-y-8">
		<!-- View Preferences -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text)] mb-4">View Preferences</h2>

			<div class="space-y-4">
				<div class="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)]">
					<div>
						<h3 class="font-medium text-[var(--color-text)]">Project Timeline Order</h3>
						<p class="text-sm text-[var(--color-text-muted)]">
							How entries are sorted in project mode
						</p>
					</div>
					<select
						value={$viewPreferences.projectTimelineOrder}
						onchange={(e) => viewPreferences.update({ projectTimelineOrder: e.currentTarget.value as 'newest' | 'oldest' })}
						class="px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-border-strong)]"
					>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
					</select>
				</div>

				<div class="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)]">
					<div>
						<h3 class="font-medium text-[var(--color-text)]">Research View</h3>
						<p class="text-sm text-[var(--color-text-muted)]">
							Display style for research entries
						</p>
					</div>
					<select
						value={$viewPreferences.researchViewMode}
						onchange={(e) => viewPreferences.update({ researchViewMode: e.currentTarget.value as 'cards' | 'list' })}
						class="px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-border-strong)]"
					>
						<option value="cards">Cards</option>
						<option value="list">List</option>
					</select>
				</div>
			</div>
		</section>

		<!-- Keyboard Shortcuts -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
				<Keyboard class="w-5 h-5" />
				Keyboard Shortcuts
			</h2>

			<div class="rounded-lg border border-[var(--color-border)] overflow-hidden">
				<table class="w-full text-sm">
					<tbody>
						<tr class="border-b border-[var(--color-border)]">
							<td class="px-4 py-3 text-[var(--color-text)]">Open Search</td>
							<td class="px-4 py-3 text-right">
								<kbd class="px-2 py-1 bg-[var(--color-surface-hover)] rounded text-xs">⌘K</kbd>
							</td>
						</tr>
						<tr class="border-b border-[var(--color-border)]">
							<td class="px-4 py-3 text-[var(--color-text)]">New Entry</td>
							<td class="px-4 py-3 text-right">
								<kbd class="px-2 py-1 bg-[var(--color-surface-hover)] rounded text-xs">⌘N</kbd>
							</td>
						</tr>
						<tr class="border-b border-[var(--color-border)]">
							<td class="px-4 py-3 text-[var(--color-text)]">Research Mode</td>
							<td class="px-4 py-3 text-right">
								<kbd class="px-2 py-1 bg-[var(--color-surface-hover)] rounded text-xs">⌘1</kbd>
							</td>
						</tr>
						<tr class="border-b border-[var(--color-border)]">
							<td class="px-4 py-3 text-[var(--color-text)]">Project Mode</td>
							<td class="px-4 py-3 text-right">
								<kbd class="px-2 py-1 bg-[var(--color-surface-hover)] rounded text-xs">⌘2</kbd>
							</td>
						</tr>
						<tr>
							<td class="px-4 py-3 text-[var(--color-text)]">Reference Mode</td>
							<td class="px-4 py-3 text-right">
								<kbd class="px-2 py-1 bg-[var(--color-surface-hover)] rounded text-xs">⌘3</kbd>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- AI Features (Future) -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
				<Cpu class="w-5 h-5" />
				AI Features
				<span class="text-xs font-normal text-[var(--color-text-muted)] bg-[var(--color-surface-hover)] px-2 py-0.5 rounded">Coming Soon</span>
			</h2>

			<div class="p-4 rounded-lg border border-dashed border-[var(--color-border)] text-center">
				<p class="text-sm text-[var(--color-text-muted)]">
					Auto-tagging and content enhancement features will be available here once configured with your Ollama instance.
				</p>
			</div>
		</section>

		<!-- Data -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
				<Database class="w-5 h-5" />
				Data
			</h2>

			<div class="space-y-4">
				<div class="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)]">
					<div>
						<h3 class="font-medium text-[var(--color-text)]">Reset Preferences</h3>
						<p class="text-sm text-[var(--color-text-muted)]">
							Reset all view preferences to defaults
						</p>
					</div>
					<Button variant="secondary" onclick={resetPreferences}>
						Reset
					</Button>
				</div>
			</div>
		</section>
	</div>
</div>
