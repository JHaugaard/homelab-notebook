<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import 'carta-md/default.css';

	interface Props {
		value: string;
		placeholder?: string;
		minHeight?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Write your content here...',
		minHeight = '200px'
	}: Props = $props();

	// Create Carta instance with DOMPurify sanitizer
	const carta = new Carta({
		sanitizer: (html) => DOMPurify.sanitize(html)
	});
</script>

<div class="carta-wrapper" style="--min-height: {minHeight}">
	<MarkdownEditor {carta} bind:value {placeholder} mode="tabs" />
</div>

<style>
	.carta-wrapper {
		/* Override Carta's default styles to match app theme */
		--carta-bg: var(--color-surface);
		--carta-bg-secondary: var(--color-background-secondary);
		--carta-border: var(--color-border);
		--carta-border-hover: var(--color-border-strong);
		--carta-text: var(--color-text);
		--carta-text-secondary: var(--color-text-secondary);
		--carta-text-muted: var(--color-text-muted);
	}

	.carta-wrapper :global(.carta-editor) {
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.carta-wrapper :global(.carta-toolbar) {
		background: var(--color-background-secondary);
		border-bottom: 1px solid var(--color-border);
		padding: 0.5rem;
	}

	.carta-wrapper :global(.carta-input) {
		background: var(--color-surface);
		color: var(--color-text);
		min-height: var(--min-height);
		padding: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.carta-wrapper :global(.carta-input::placeholder) {
		color: var(--color-text-muted);
	}

	.carta-wrapper :global(.carta-renderer) {
		background: var(--color-surface);
		color: var(--color-text);
		min-height: var(--min-height);
		padding: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	/* Tab styles */
	.carta-wrapper :global(.carta-tabs) {
		display: flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background: var(--color-background-secondary);
		border-bottom: 1px solid var(--color-border);
	}

	.carta-wrapper :global(.carta-tab) {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.carta-wrapper :global(.carta-tab:hover) {
		color: var(--color-text);
		background: var(--color-surface-hover);
	}

	.carta-wrapper :global(.carta-tab[data-active='true']) {
		color: var(--color-text);
		background: var(--color-surface);
	}

	/* Rendered markdown styles */
	.carta-wrapper :global(.carta-renderer h1) {
		font-size: 1.5rem;
		font-weight: 700;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	.carta-wrapper :global(.carta-renderer h2) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	.carta-wrapper :global(.carta-renderer h3) {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.carta-wrapper :global(.carta-renderer p) {
		margin-bottom: 0.75rem;
	}

	.carta-wrapper :global(.carta-renderer code) {
		background: var(--color-surface-hover);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
	}

	.carta-wrapper :global(.carta-renderer pre) {
		background: var(--color-surface-hover);
		padding: 0.75rem;
		border-radius: 0.375rem;
		overflow-x: auto;
		margin: 0.75rem 0;
	}

	.carta-wrapper :global(.carta-renderer pre code) {
		background: transparent;
		padding: 0;
	}

	.carta-wrapper :global(.carta-renderer ul),
	.carta-wrapper :global(.carta-renderer ol) {
		margin-left: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.carta-wrapper :global(.carta-renderer ul) {
		list-style-type: disc;
	}

	.carta-wrapper :global(.carta-renderer ol) {
		list-style-type: decimal;
	}

	.carta-wrapper :global(.carta-renderer a) {
		color: var(--color-blue);
		text-decoration: underline;
	}

	.carta-wrapper :global(.carta-renderer blockquote) {
		border-left: 3px solid var(--color-border-strong);
		padding-left: 1rem;
		margin: 0.75rem 0;
		color: var(--color-text-secondary);
	}
</style>
