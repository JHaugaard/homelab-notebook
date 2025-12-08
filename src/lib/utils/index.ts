// Re-export all utilities
export * from './format';
export * from './markdown';

/**
 * Debounce a function call
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
	return Math.random().toString(36).substring(2, 15);
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

/**
 * Safely parse JSON with a fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
	try {
		return JSON.parse(json);
	} catch {
		return fallback;
	}
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if two arrays have the same elements (order-independent)
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length) return false;
	const sortedA = [...a].sort();
	const sortedB = [...b].sort();
	return sortedA.every((val, idx) => val === sortedB[idx]);
}

/**
 * Remove duplicates from an array
 */
export function unique<T>(arr: T[]): T[] {
	return [...new Set(arr)];
}

/**
 * Sort array by property
 */
export function sortBy<T>(arr: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
	return [...arr].sort((a, b) => {
		const aVal = a[key];
		const bVal = b[key];
		if (aVal < bVal) return direction === 'asc' ? -1 : 1;
		if (aVal > bVal) return direction === 'asc' ? 1 : -1;
		return 0;
	});
}

/**
 * Group array by property
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
	return arr.reduce(
		(groups, item) => {
			const groupKey = String(item[key]);
			groups[groupKey] = groups[groupKey] || [];
			groups[groupKey].push(item);
			return groups;
		},
		{} as Record<string, T[]>
	);
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Platform detection for keyboard shortcuts
 */
export function isMac(): boolean {
	if (!isBrowser()) return false;
	return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/**
 * Get modifier key label based on platform
 */
export function getModifierKey(): string {
	return isMac() ? '⌘' : 'Ctrl';
}
