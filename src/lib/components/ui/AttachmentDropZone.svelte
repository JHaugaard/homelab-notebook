<script lang="ts">
	import { Upload, X, FileText, FileSpreadsheet, Image, File as FileIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-svelte';
	import type { Attachment } from '$lib/types';

	interface UploadingFile {
		file: File;
		progress: 'pending' | 'uploading' | 'done' | 'error';
		error?: string;
		key?: string;
		publicUrl?: string;
	}

	interface Props {
		entryId: string;
		uploadedFiles?: Attachment[];
		onFilesChange?: (files: Attachment[]) => void;
		accept?: string;
		maxSizeMB?: number;
		id?: string;
	}

	let {
		entryId,
		uploadedFiles = $bindable([]),
		onFilesChange,
		accept,
		maxSizeMB = 10,
		id
	}: Props = $props();

	let isDragging = $state(false);
	let error = $state<string | null>(null);
	let uploadingFiles = $state<UploadingFile[]>([]);

	function getFileIcon(filename: string) {
		const ext = filename.split('.').pop()?.toLowerCase();
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

	function validateFile(file: File): string | null {
		const maxBytes = maxSizeMB * 1024 * 1024;
		if (file.size > maxBytes) {
			return `${file.name} exceeds ${maxSizeMB}MB limit`;
		}
		return null;
	}

	async function uploadFile(uploadingFile: UploadingFile): Promise<void> {
		const file = uploadingFile.file;
		uploadingFile.progress = 'uploading';

		try {
			// Step 1: Get presigned URL from our API
			const urlResponse = await fetch('/api/attachments/upload-url', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					entryId,
					filename: file.name,
					contentType: file.type || 'application/octet-stream',
					size: file.size
				})
			});

			if (!urlResponse.ok) {
				const errorData = await urlResponse.json().catch(() => ({}));
				throw new Error(errorData.message || `Failed to get upload URL: ${urlResponse.status}`);
			}

			const { uploadUrl, key, publicUrl } = await urlResponse.json();

			// Step 2: Upload directly to Tigris
			const uploadResponse = await fetch(uploadUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': file.type || 'application/octet-stream'
				},
				body: file
			});

			if (!uploadResponse.ok) {
				throw new Error(`Upload failed: ${uploadResponse.status}`);
			}

			// Success!
			uploadingFile.progress = 'done';
			uploadingFile.key = key;
			uploadingFile.publicUrl = publicUrl;

			// Add to uploaded files
			const newFile: Attachment = {
				key,
				publicUrl,
				filename: file.name,
				size: file.size
			};
			uploadedFiles = [...uploadedFiles, newFile];
			onFilesChange?.(uploadedFiles);

		} catch (err) {
			uploadingFile.progress = 'error';
			uploadingFile.error = err instanceof Error ? err.message : 'Upload failed';
		}
	}

	async function addFiles(newFiles: FileList | File[]) {
		error = null;
		const fileArray: File[] = Array.from(newFiles as Iterable<File>);

		// Validate all files first
		for (const file of fileArray) {
			const validationError = validateFile(file);
			if (validationError) {
				error = validationError;
				return;
			}
		}

		// Avoid duplicates by name
		const existingNames = new Set([
			...uploadedFiles.map(f => f.filename),
			...uploadingFiles.map(f => f.file.name)
		]);
		const uniqueNewFiles = fileArray.filter(f => !existingNames.has(f.name));

		if (uniqueNewFiles.length === 0) return;

		// Add to uploading queue
		const newUploadingFiles: UploadingFile[] = uniqueNewFiles.map(file => ({
			file,
			progress: 'pending' as const
		}));
		uploadingFiles = [...uploadingFiles, ...newUploadingFiles];

		// Upload all files in parallel
		await Promise.all(newUploadingFiles.map(uploadFile));

		// Clean up completed uploads from the uploading list
		uploadingFiles = uploadingFiles.filter(f => f.progress !== 'done');
	}

	function removeUploadedFile(index: number) {
		const file = uploadedFiles[index];
		uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
		onFilesChange?.(uploadedFiles);

		// Optionally delete from storage (fire and forget)
		fetch('/api/attachments/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key: file.key })
		}).catch(console.error);
	}

	function retryUpload(index: number) {
		const file = uploadingFiles[index];
		file.progress = 'pending';
		file.error = undefined;
		uploadFile(file);
	}

	function cancelUpload(index: number) {
		uploadingFiles = uploadingFiles.filter((_, i) => i !== index);
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
		onkeydown={(e) => e.key === 'Enter' && document.getElementById(id || 'file-input')?.click()}
	>
		<input
			id={id || 'file-input'}
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

	<!-- Uploading files -->
	{#if uploadingFiles.length > 0}
		<ul class="space-y-1">
			{#each uploadingFiles as uploadingFile, index}
				{@const { icon: Icon, color } = getFileIcon(uploadingFile.file.name)}
				<li class="flex items-center gap-2 px-2 py-1.5 text-xs bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
					{#if uploadingFile.progress === 'uploading' || uploadingFile.progress === 'pending'}
						<Loader2 class="w-3.5 h-3.5 flex-shrink-0 text-[var(--color-primary)] animate-spin" />
					{:else if uploadingFile.progress === 'error'}
						<AlertCircle class="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
					{:else}
						<Icon class="w-3.5 h-3.5 flex-shrink-0 {color}" />
					{/if}
					<span class="flex-1 truncate text-[var(--color-text)]">{uploadingFile.file.name}</span>
					<span class="text-[var(--color-text-muted)] flex-shrink-0">{formatFileSize(uploadingFile.file.size)}</span>
					{#if uploadingFile.progress === 'error'}
						<button
							type="button"
							class="text-xs text-[var(--color-primary)] hover:underline"
							onclick={() => retryUpload(index)}
						>
							Retry
						</button>
					{/if}
					<button
						type="button"
						class="p-0.5 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-red-500"
						onclick={() => cancelUpload(index)}
						aria-label="Cancel upload"
					>
						<X class="w-3.5 h-3.5" />
					</button>
				</li>
				{#if uploadingFile.error}
					<li class="text-xs text-red-500 pl-6">{uploadingFile.error}</li>
				{/if}
			{/each}
		</ul>
	{/if}

	<!-- Uploaded files -->
	{#if uploadedFiles.length > 0}
		<ul class="space-y-1">
			{#each uploadedFiles as file, index}
				{@const { icon: Icon, color } = getFileIcon(file.filename)}
				<li class="flex items-center gap-2 px-2 py-1.5 text-xs bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
					<CheckCircle2 class="w-3.5 h-3.5 flex-shrink-0 text-green-500" />
					<Icon class="w-3.5 h-3.5 flex-shrink-0 {color}" />
					<span class="flex-1 truncate text-[var(--color-text)]">{file.filename}</span>
					{#if file.size}
						<span class="text-[var(--color-text-muted)] flex-shrink-0">{formatFileSize(file.size)}</span>
					{/if}
					<button
						type="button"
						class="p-0.5 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-red-500"
						onclick={() => removeUploadedFile(index)}
						aria-label="Remove {file.filename}"
					>
						<X class="w-3.5 h-3.5" />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
