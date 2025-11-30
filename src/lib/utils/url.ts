/**
 * Extract domain from a URL
 */
export function extractDomain(url: string): string {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname.replace('www.', '');
	} catch {
		return url;
	}
}

/**
 * Validate a URL string
 */
export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

/**
 * Fetch metadata from a URL (title, description)
 * Note: This should be called from a server endpoint to avoid CORS issues
 */
export interface UrlMetadata {
	title: string;
	description?: string;
	favicon?: string;
}

export async function fetchUrlMetadata(url: string): Promise<UrlMetadata | null> {
	try {
		const response = await fetch(`/api/url-metadata?url=${encodeURIComponent(url)}`);
		if (!response.ok) return null;
		return await response.json();
	} catch {
		return null;
	}
}
