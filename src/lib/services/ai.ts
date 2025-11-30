/**
 * AI Service - Ollama Integration Stubs
 *
 * This module provides extension points for future AI integration
 * with the local Ollama instance. Features planned:
 * - Auto-tagging based on content
 * - Content summarization
 * - Related entry suggestions
 * - Smart search enhancements
 */

import { browser } from '$app/environment';

// Configuration for AI features
export interface AIConfig {
	enabled: boolean;
	ollamaUrl: string;
	model: string;
}

// Default configuration (disabled until Ollama is configured)
const defaultConfig: AIConfig = {
	enabled: false,
	ollamaUrl: 'http://ollama.haugaard.dev',
	model: 'llama3.2'
};

let config: AIConfig = { ...defaultConfig };

/**
 * Initialize AI service with configuration
 */
export function initAI(customConfig?: Partial<AIConfig>) {
	if (customConfig) {
		config = { ...config, ...customConfig };
	}
}

/**
 * Check if AI features are available
 */
export function isAIEnabled(): boolean {
	return config.enabled && browser;
}

/**
 * Suggest tags for given content
 * @stub Returns empty array until AI is configured
 */
export async function suggestTags(content: string): Promise<string[]> {
	if (!isAIEnabled()) {
		return [];
	}

	// TODO: Implement Ollama integration
	// const response = await fetch(`${config.ollamaUrl}/api/generate`, {
	//   method: 'POST',
	//   body: JSON.stringify({
	//     model: config.model,
	//     prompt: `Suggest 3-5 relevant tags for the following content. Return only the tags as a comma-separated list:\n\n${content}`,
	//     stream: false
	//   })
	// });

	console.log('[AI] Tag suggestion requested but AI is not configured');
	return [];
}

/**
 * Generate a summary for given content
 * @stub Returns null until AI is configured
 */
export async function summarizeContent(content: string): Promise<string | null> {
	if (!isAIEnabled()) {
		return null;
	}

	// TODO: Implement Ollama integration
	console.log('[AI] Summarization requested but AI is not configured');
	return null;
}

/**
 * Find related entries based on content similarity
 * @stub Returns empty array until AI is configured
 */
export async function findRelatedEntries(
	content: string,
	_existingEntryIds: string[]
): Promise<string[]> {
	if (!isAIEnabled()) {
		return [];
	}

	// TODO: Implement vector similarity search
	console.log('[AI] Related entries requested but AI is not configured');
	return [];
}

/**
 * Enhance search query with AI-powered expansion
 * @stub Returns original query until AI is configured
 */
export async function enhanceSearchQuery(query: string): Promise<string> {
	if (!isAIEnabled()) {
		return query;
	}

	// TODO: Implement query expansion
	console.log('[AI] Search enhancement requested but AI is not configured');
	return query;
}

/**
 * Extract key information from a URL
 * @stub Returns null until AI is configured
 */
export async function extractUrlInfo(
	url: string
): Promise<{ title?: string; summary?: string; tags?: string[] } | null> {
	if (!isAIEnabled()) {
		return null;
	}

	// TODO: Implement URL content extraction and analysis
	console.log('[AI] URL extraction requested but AI is not configured');
	return null;
}
