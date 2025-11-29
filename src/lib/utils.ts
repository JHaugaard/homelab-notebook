import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/*
 * cn() - Class Name Utility
 *
 * This is a helper function for merging Tailwind CSS classes.
 * It combines two libraries:
 *
 * 1. clsx: Conditionally joins class names together
 *    - Handles arrays, objects, booleans, and strings
 *    - Example: clsx('foo', { bar: true }) => 'foo bar'
 *
 * 2. tailwind-merge: Intelligently merges Tailwind classes
 *    - Resolves conflicts between utilities
 *    - Example: twMerge('px-4 px-6') => 'px-6' (last wins)
 *
 * Why use cn() instead of template literals?
 * - Handles conditional classes cleanly
 * - Prevents duplicate/conflicting Tailwind classes
 * - Essential for component variants
 *
 * Usage examples:
 *
 * // Conditional classes
 * cn('btn', isActive && 'btn-active')
 *
 * // Object syntax
 * cn('btn', { 'btn-disabled': isDisabled, 'btn-loading': isLoading })
 *
 * // Merging props with defaults (important for reusable components)
 * cn('px-4 py-2', className)  // className can override defaults
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
