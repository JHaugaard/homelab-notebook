import { ollama } from "./client";
import type { TagGenerationResult } from "./types";

/*
 * Tag Generation Helper
 *
 * This module extracts technology tags from note content using Ollama.
 * It's designed to be called from Server Actions when a user saves a note.
 *
 * Why Server Actions (not API routes)?
 * - Server Actions are simpler: no API route boilerplate
 * - They're automatically secure (no CSRF needed)
 * - They can be called directly from forms or client code
 * - They run on the server, keeping the Ollama URL private
 *
 * The tag extraction prompt is carefully designed to:
 * - Extract ONLY technology-related tags (languages, frameworks, tools)
 * - Return consistent, lowercase, normalized tags
 * - Work well with llama3.2:3b (small, fast model)
 */

/*
 * System prompt for tag extraction
 *
 * This prompt instructs the model to act as a tag extractor.
 * Key design decisions:
 * - JSON output format for reliable parsing
 * - Limited to 5 tags to avoid over-tagging
 * - Focus on technologies, not general topics
 * - Examples help the model understand the format
 */
const TAG_EXTRACTION_SYSTEM_PROMPT = `You are a technology tag extractor. Your job is to identify technology-related tags from text content.

Rules:
1. Extract ONLY technology tags (programming languages, frameworks, libraries, tools, platforms)
2. Return 1-5 tags maximum
3. Tags should be lowercase, single words or hyphenated (e.g., "react", "next-js", "postgresql")
4. Do NOT include generic terms like "programming", "coding", "development"
5. Return your response as a JSON object with a "tags" array

Examples:
- "Setting up a Next.js app with Tailwind" → {"tags": ["next-js", "tailwind"]}
- "Docker container running PostgreSQL" → {"tags": ["docker", "postgresql"]}
- "Python script using pandas for data analysis" → {"tags": ["python", "pandas"]}`;

/*
 * Generate tags from note content
 *
 * @param content - The note content to analyze
 * @param title - Optional title for additional context
 * @returns TagGenerationResult with extracted tags
 *
 * Usage from a Server Action:
 *
 * "use server";
 * import { generateTags } from "@/lib/ollama/tags";
 *
 * export async function saveNote(formData: FormData) {
 *   const title = formData.get("title") as string;
 *   const content = formData.get("content") as string;
 *
 *   // Generate tags using AI
 *   const { tags } = await generateTags(content, title);
 *
 *   // Save note with tags to database...
 * }
 */
export async function generateTags(
  content: string,
  title?: string
): Promise<TagGenerationResult> {
  // Handle empty content
  if (!content.trim() && !title?.trim()) {
    return { tags: [], confidence: "low" };
  }

  // Combine title and content for analysis
  // Title often contains key technology mentions
  const textToAnalyze = title ? `Title: ${title}\n\nContent: ${content}` : content;

  // Truncate very long content to avoid slow responses
  // First 2000 chars usually contain the key technologies
  const truncatedText =
    textToAnalyze.length > 2000
      ? textToAnalyze.substring(0, 2000) + "..."
      : textToAnalyze;

  try {
    const response = await ollama.generate(
      `Extract technology tags from this text:\n\n${truncatedText}`,
      {
        systemPrompt: TAG_EXTRACTION_SYSTEM_PROMPT,
        format: "json",
        generationOptions: {
          temperature: 0.1, // Low temperature for consistent output
          num_predict: 100, // Tags don't need many tokens
        },
      }
    );

    // Parse the JSON response
    const parsed = parseTagResponse(response.response);

    return {
      tags: parsed.tags,
      confidence: determineConfidence(parsed.tags, content),
      rawResponse: response.response,
    };
  } catch (error) {
    console.error("Tag generation failed:", error);

    // Fallback: extract common technology keywords manually
    const fallbackTags = extractFallbackTags(textToAnalyze);

    return {
      tags: fallbackTags,
      confidence: "low",
      rawResponse: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/*
 * Parse the model's JSON response
 *
 * The model should return {"tags": ["tag1", "tag2"]}, but we need
 * to handle cases where the JSON is malformed or wrapped in text.
 */
function parseTagResponse(response: string): { tags: string[] } {
  try {
    // Try direct JSON parse first
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed.tags)) {
      return { tags: normalizeTags(parsed.tags) };
    }
    // Handle case where model returns just an array
    if (Array.isArray(parsed)) {
      return { tags: normalizeTags(parsed) };
    }
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed.tags)) {
          return { tags: normalizeTags(parsed.tags) };
        }
      } catch {
        // Fall through to empty tags
      }
    }
  }

  return { tags: [] };
}

/*
 * Normalize tags to consistent format
 * - Lowercase
 * - Trim whitespace
 * - Remove duplicates
 * - Filter out empty strings
 * - Limit to 5 tags
 */
function normalizeTags(tags: unknown[]): string[] {
  const normalized = tags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.toLowerCase().trim().replace(/\s+/g, "-"))
    .filter((tag) => tag.length > 0 && tag.length <= 30);

  // Remove duplicates and limit to 5
  return [...new Set(normalized)].slice(0, 5);
}

/*
 * Determine confidence level based on tag quality
 */
function determineConfidence(
  tags: string[],
  content: string
): "high" | "medium" | "low" {
  if (tags.length === 0) return "low";

  // Check if tags actually appear in the content (case-insensitive)
  const contentLower = content.toLowerCase();
  const matchingTags = tags.filter(
    (tag) =>
      contentLower.includes(tag) ||
      contentLower.includes(tag.replace(/-/g, " "))
  );

  if (matchingTags.length === tags.length) return "high";
  if (matchingTags.length >= tags.length / 2) return "medium";
  return "low";
}

/*
 * Fallback tag extraction using keyword matching
 *
 * When Ollama is unavailable, we can still extract some tags
 * by looking for known technology keywords.
 */
const KNOWN_TECHNOLOGIES = [
  // Languages
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "ruby",
  "php",
  "swift",
  "kotlin",
  // Frontend
  "react",
  "vue",
  "angular",
  "svelte",
  "next",
  "nuxt",
  "tailwind",
  // Backend
  "node",
  "express",
  "fastapi",
  "django",
  "rails",
  "spring",
  // Databases
  "postgresql",
  "postgres",
  "mysql",
  "mongodb",
  "redis",
  "supabase",
  // DevOps
  "docker",
  "kubernetes",
  "nginx",
  "caddy",
  "github",
  "gitlab",
  // Other
  "graphql",
  "rest",
  "api",
  "linux",
  "macos",
  "windows",
];

function extractFallbackTags(text: string): string[] {
  const textLower = text.toLowerCase();
  const found = KNOWN_TECHNOLOGIES.filter((tech) => textLower.includes(tech));

  // Normalize and deduplicate
  const normalized = found.map((tech) => {
    // Handle common variations
    if (tech === "postgres") return "postgresql";
    if (tech === "next") return "next-js";
    if (tech === "nuxt") return "nuxt-js";
    if (tech === "node") return "node-js";
    return tech;
  });

  return [...new Set(normalized)].slice(0, 5);
}

/*
 * Re-export types for convenience
 */
export type { TagGenerationResult };
