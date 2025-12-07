<script lang="ts">
	import { Download, FileText, FileSpreadsheet, Image, File, Trash2 } from 'lucide-svelte';

	interface Attachment {
		key: string;
		publicUrl: string;
		filename: string;
	}

	interface Props {
		attachments: Attachment[];
		editable?: boolean;
		onRemove?: (attachment: Attachment) => void;
	}

	let { attachments, editable = false, onRemove }: Props = $props();

	function getFileIcon(filename: string) {
		const ext = filename.split('.').pop()?.toLowerCase();
		if (['pdf'].includes(ext || '')) return { icon: FileText, color: 'text-red-500' };
		if (['doc', 'docx'].includes(ext || '')) return { icon: FileText, color: 'text-blue-500' };
		if (['xls', 'xlsx'].includes(ext || '')) return { icon: FileSpreadsheet, color: 'text-green-500' };
		if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return { icon: Image, color: 'text-purple-500' };
		return { icon: File, color: 'text-[var(--color-text-muted)]' };
	}
</script>

{#if attachments.length > 0}
	<div class="space-y-1">
		{#each attachments as attachment}
			{@const { icon: FileIcon, color } = getFileIcon(attachment.filename)}
			<div class="flex items-center gap-2 px-2 py-1.5 text-xs bg-[var(--color-surface)] rounded border border-[var(--color-border)] group">
				<FileIcon class="w-3.5 h-3.5 flex-shrink-0 {color}" />
				<span class="flex-1 truncate text-[var(--color-text)]">{attachment.filename}</span>
				<a
					href={attachment.publicUrl}
					download={attachment.filename}
					class="p-1 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
					title="Download"
				>
					<Download class="w-3.5 h-3.5" />
				</a>
				{#if editable && onRemove}
					<button
						type="button"
						class="p-1 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
						onclick={() => onRemove(attachment)}
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
