<script lang="ts">
	import { Download, FileText, FileSpreadsheet, Image, File, Trash2 } from 'lucide-svelte';

	interface Props {
		attachments: string[];
		entryId: string;
		baseUrl: string;
		editable?: boolean;
		onRemove?: (filename: string) => void;
	}

	let { attachments, entryId, baseUrl, editable = false, onRemove }: Props = $props();

	function getFileIcon(filename: string) {
		const ext = filename.split('.').pop()?.toLowerCase();
		if (['pdf'].includes(ext || '')) return { icon: FileText, color: 'text-red-500' };
		if (['doc', 'docx'].includes(ext || '')) return { icon: FileText, color: 'text-blue-500' };
		if (['xls', 'xlsx'].includes(ext || '')) return { icon: FileSpreadsheet, color: 'text-green-500' };
		if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return { icon: Image, color: 'text-purple-500' };
		return { icon: File, color: 'text-[var(--color-text-muted)]' };
	}

	function getFileUrl(filename: string): string {
		// PocketBase file URL format: /api/files/COLLECTION/RECORD_ID/FILENAME
		return `${baseUrl}/api/files/entries/${entryId}/${filename}`;
	}

	function getDisplayName(filename: string): string {
		// Remove any PocketBase-generated prefixes (timestamps etc)
		// PocketBase stores files as: originalname_timestamp.ext
		const parts = filename.split('_');
		if (parts.length > 1) {
			// Try to reconstruct original name
			const lastPart = parts[parts.length - 1];
			if (/^\d+\.\w+$/.test(lastPart)) {
				// Last part is timestamp.ext, return everything before
				return parts.slice(0, -1).join('_') + '.' + lastPart.split('.').pop();
			}
		}
		return filename;
	}
</script>

{#if attachments.length > 0}
	<div class="space-y-1">
		{#each attachments as filename}
			{@const { icon: FileIcon, color } = getFileIcon(filename)}
			<div class="flex items-center gap-2 px-2 py-1.5 text-xs bg-[var(--color-surface)] rounded border border-[var(--color-border)] group">
				<FileIcon class="w-3.5 h-3.5 flex-shrink-0 {color}" />
				<span class="flex-1 truncate text-[var(--color-text)]">{getDisplayName(filename)}</span>
				<a
					href={getFileUrl(filename)}
					download
					class="p-1 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
					title="Download"
				>
					<Download class="w-3.5 h-3.5" />
				</a>
				{#if editable && onRemove}
					<button
						type="button"
						class="p-1 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
						onclick={() => onRemove(filename)}
						title="Remove"
					>
						<Trash2 class="w-3.5 h-3.5" />
					</button>
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<p class="text-xs text-[var(--color-text-muted)] italic">No attachments</p>
{/if}
