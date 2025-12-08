/**
 * Secure markdown rendering utility
 * Uses DOMPurify to sanitize HTML output and prevent XSS attacks
 */

import DOMPurify from 'dompurify';

/**
 * Renders markdown text to sanitized HTML
 * Safe for use with {@html} in Svelte templates
 */
export function renderMarkdown(text: string): string {
	if (!text) return '';

	const html = text
		.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
		.replace(
			/^## (.*$)/gim,
			'<h2 class="text-xl font-semibold mt-8 mb-3 pb-2 border-b border-[var(--color-border)]">$1</h2>'
		)
		.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
		.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/gim, '<em>$1</em>')
		.replace(
			/```(\w*)\n([\s\S]*?)```/gim,
			'<pre class="bg-[var(--color-surface-hover)] p-4 rounded-md my-4 overflow-x-auto text-sm"><code>$2</code></pre>'
		)
		.replace(
			/`(.*?)`/gim,
			'<code class="bg-[var(--color-surface-hover)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
		)
		.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 my-1">$1</li>')
		.replace(/\[x\]/gim, '<input type="checkbox" checked disabled class="mr-2">')
		.replace(/\[\s?\]/gim, '<input type="checkbox" disabled class="mr-2">')
		.replace(
			/\[([^\]]+)\]\(([^)]+)\)/gim,
			'<a href="$2" class="text-[var(--color-blue)] underline" target="_blank" rel="noopener noreferrer">$1</a>'
		)
		.replace(/\n\n/gim, '</p><p class="my-3">')
		.replace(/\n/gim, '<br>');

	// Sanitize with DOMPurify to prevent XSS
	// Allow safe HTML elements and attributes used in our markdown rendering
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'p',
			'br',
			'strong',
			'em',
			'code',
			'pre',
			'li',
			'ul',
			'ol',
			'a',
			'input'
		],
		ALLOWED_ATTR: ['class', 'href', 'target', 'rel', 'type', 'checked', 'disabled'],
		ALLOW_DATA_ATTR: false,
		// Block javascript: URLs
		ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
	});
}
