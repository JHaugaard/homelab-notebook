/*
 * Ollama Module Exports
 *
 * This barrel file provides clean imports for the Ollama functionality.
 *
 * Usage:
 *   import { ollama, generateTags } from "@/lib/ollama";
 */

// Client
export { ollama, OllamaClient } from "./client";

// Tag generation
export { generateTags } from "./tags";

// Types
export type {
  OllamaGenerateRequest,
  OllamaGenerateResponse,
  OllamaEmbedRequest,
  OllamaEmbedResponse,
  OllamaTagsResponse,
  OllamaModel,
  OllamaOptions,
  TagGenerationResult,
  OllamaError,
} from "./types";
