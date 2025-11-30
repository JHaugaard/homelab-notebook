import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		throw error(400, 'URL parameter is required');
	}

	try {
		const response = await fetch(targetUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; HomelabNotebook/1.0)'
			}
		});

		if (!response.ok) {
			throw error(response.status, 'Failed to fetch URL');
		}

		const html = await response.text();

		// Extract title
		const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
		const title = titleMatch ? titleMatch[1].trim() : '';

		// Extract meta description
		const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
		const description = descMatch ? descMatch[1].trim() : '';

		// Extract favicon
		const faviconMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i);
		let favicon = faviconMatch ? faviconMatch[1] : '/favicon.ico';

		// Make favicon URL absolute
		if (favicon && !favicon.startsWith('http')) {
			const urlObj = new URL(targetUrl);
			favicon = favicon.startsWith('/')
				? `${urlObj.origin}${favicon}`
				: `${urlObj.origin}/${favicon}`;
		}

		return json({
			title: title || new URL(targetUrl).hostname,
			description,
			favicon
		});
	} catch (err) {
		console.error('Failed to fetch URL metadata:', err);
		throw error(500, 'Failed to fetch URL metadata');
	}
};
