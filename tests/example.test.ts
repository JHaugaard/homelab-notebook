import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, truncate, slugify } from '../src/lib/utils/format';

describe('format utilities', () => {
	describe('formatDate', () => {
		it('formats date string correctly', () => {
			const result = formatDate('2024-01-15T12:00:00Z');
			expect(result).toContain('Jan');
			expect(result).toContain('15');
			expect(result).toContain('2024');
		});
	});

	describe('truncate', () => {
		it('returns original text if shorter than max length', () => {
			expect(truncate('hello', 10)).toBe('hello');
		});

		it('truncates text with ellipsis', () => {
			expect(truncate('hello world', 8)).toBe('hello...');
		});
	});

	describe('slugify', () => {
		it('converts text to slug format', () => {
			expect(slugify('Hello World')).toBe('hello-world');
			expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
			expect(slugify('Special!@#Characters')).toBe('specialcharacters');
		});
	});
});
