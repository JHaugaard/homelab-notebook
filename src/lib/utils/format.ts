// Date and time formatting utilities

/**
 * Format a date string to a relative time (e.g., "2 hours ago", "Yesterday")
 */
export function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSecs < 60) {
		return 'Just now';
	} else if (diffMins < 60) {
		return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
	} else if (diffHours < 24) {
		return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
	} else if (diffDays === 1) {
		return 'Yesterday';
	} else if (diffDays < 7) {
		return `${diffDays} days ago`;
	} else if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return `${months} month${months === 1 ? '' : 's'} ago`;
	} else {
		const years = Math.floor(diffDays / 365);
		return `${years} year${years === 1 ? '' : 's'} ago`;
	}
}

/**
 * Format a date for display (e.g., "Nov 30, 2025")
 */
export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

/**
 * Format a time for display (e.g., "3:45 PM")
 */
export function formatTime(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

/**
 * Format date for timeline headers (e.g., "TODAY - November 30, 2025")
 */
export function formatTimelineDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);

	const isToday = date.toDateString() === now.toDateString();
	const isYesterday = date.toDateString() === yesterday.toDateString();

	const formattedDate = date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});

	if (isToday) {
		return `TODAY - ${formattedDate}`;
	} else if (isYesterday) {
		return `YESTERDAY - ${formattedDate}`;
	}
	return formattedDate.toUpperCase();
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: string, date2: string): boolean {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	return d1.toDateString() === d2.toDateString();
}

/**
 * Group entries by date for timeline view
 */
export function groupByDate<T extends { created: string }>(items: T[]): Map<string, T[]> {
	const groups = new Map<string, T[]>();

	for (const item of items) {
		const dateKey = new Date(item.created).toDateString();
		const existing = groups.get(dateKey) || [];
		existing.push(item);
		groups.set(dateKey, existing);
	}

	return groups;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + '...';
}

/**
 * Extract domain from URL
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
 * Generate a URL-friendly slug from text
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
}

/**
 * Count words in text
 */
export function wordCount(text: string): number {
	return text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(text: string): number {
	const wordsPerMinute = 200;
	const words = wordCount(text);
	return Math.ceil(words / wordsPerMinute);
}
