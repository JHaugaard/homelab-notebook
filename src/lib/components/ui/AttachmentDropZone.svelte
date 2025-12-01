<script lang="ts">
	import { Upload, X, FileText, FileSpreadsheet, Image, File as FileIcon } from 'lucide-svelte';

	interface Props {
		files?: globalThis.File[];
		onFilesChange?: (files: globalThis.File[]) => void;
		accept?: string;
		maxSizeMB?: number;
	}

	let { files = $bindable([]), onFilesChange, accept, maxSizeMB = 10 }: Props = $props();

	let isDragging = $state(false);
	let error = $state<string | null>(null);

	function getFileIcon(file: globalThis.File) {
		const ext = file.name.split('.').pop()?.toLowerCase();
		if (['pdf'].includes(ext || '')) return { icon: FileText, color: 'text-red-500' };
		if (['doc', 'docx'].includes(ext || '')) return { icon: FileText, color: 'text-blue-500' };
		if (['xls', 'xlsx'].includes(ext || '')) return { icon: FileSpreadsheet, color: 'text-green-500' };
		if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return { icon: Image, color: 'text-purple-500' };
		return { icon: FileIcon, color: 'text-[var(--color-text-muted)]' };
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function validateFile(file: globalThis.File): string | null {
		const maxBytes = maxSizeMB * 1024 * 1024;
		if (file.size > maxBytes) {
			return `${file.name} exceeds ${maxSizeMB}MB limit`;
		}
		return null;
	}

	function addFiles(newFiles: FileList | File[]) {
		error = null;
		const fileArray: File[] = Array.from(newFiles as Iterable<File>);

		for (const file of fileArray) {
			const validationError = validateFile(file);
			if (validationError) {
				error = validationError;
				return;
			}
		}

		// Avoid duplicates by name
		const existingNames = new Set(files.map(f => f.name));
		const uniqueNewFiles = fileArray.filter(f => !existingNames.has(f.name));

		files = [...files, ...uniqueNewFiles];
		onFilesChange?.(files);
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
		onFilesChange?.(files);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			addFiles(e.dataTransfer.files);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			addFiles(input.files);
			input.value = ''; // Reset for same file selection
		}
	}
</script>

<div class="space-y-2">
	<!-- Drop zone -->
	<div
		class="
			relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer
			{isDragging
				? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)]'
				: 'border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]'}
		"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
	>
		<input
			id="file-input"
			type="file"
			multiple
			{accept}
			class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
			onchange={handleFileInput}
		/>
		<Upload class="w-5 h-5 mx-auto mb-1.5 text-[var(--color-text-muted)]" />
		<p class="text-xs text-[var(--color-text-muted)]">
			Drop files or <span class="text-[var(--color-primary)]">browse</span>
		</p>
	</div>

	<!-- Error message -->
	{#if error}
		<p class="text-xs text-red-500">{error}</p>
	{/if}

	<!-- File list -->
	{#if files.length > 0}
		<ul class="space-y-1">
			{#each files as file, index}
				{@const { icon: FileIcon, color } = getFileIcon(file)}
				<li class="flex items-center gap-2 px-2 py-1.5 text-xs bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
					<FileIcon class="w-3.5 h-3.5 flex-shrink-0 {color}" />
					<span class="flex-1 truncate text-[var(--color-text)]">{file.name}</span>
					<span class="text-[var(--color-text-muted)] flex-shrink-0">{formatFileSize(file.size)}</span>
					<button
						type="button"
						class="p-0.5 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-red-500"
						onclick={() => removeFile(index)}
						aria-label="Remove {file.name}"
					>
						<X class="w-3.5 h-3.5" />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
