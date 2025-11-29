/*
 * Ollama API Type Definitions
 *
 * These types match the Ollama REST API responses.
 * Ollama provides a simple HTTP API for generating text and embeddings.
 *
 * API Documentation: https://github.com/ollama/ollama/blob/main/docs/api.md
 */

/*
 * Generate Endpoint Request
 * POST /api/generate
 *
 * Used for text generation (our tag extraction use case)
 */
export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: OllamaOptions;
  system?: string;
  template?: string;
  context?: number[];
  format?: "json";
}

/*
 * Generate Endpoint Response
 * Returns the generated text and metadata
 */
export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/*
 * Embeddings Endpoint Request
 * POST /api/embed (Ollama 0.4+) or /api/embeddings (legacy)
 *
 * Used for semantic search (v2 feature)
 */
export interface OllamaEmbedRequest {
  model: string;
  input: string | string[];
}

/*
 * Embeddings Endpoint Response
 */
export interface OllamaEmbedResponse {
  model: string;
  embeddings: number[][];
}

/*
 * Model Options
 * Fine-tune generation behavior
 */
export interface OllamaOptions {
  temperature?: number; // 0-1, higher = more creative
  top_p?: number; // Nucleus sampling threshold
  top_k?: number; // Limit vocabulary per step
  num_predict?: number; // Max tokens to generate
  stop?: string[]; // Stop sequences
  seed?: number; // For reproducibility
}

/*
 * Tags Endpoint Response
 * GET /api/tags
 *
 * Lists available models
 */
export interface OllamaTagsResponse {
  models: OllamaModel[];
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

/*
 * Tag Generation Result
 * Our application-specific type for the tag extraction response
 */
export interface TagGenerationResult {
  tags: string[];
  confidence: "high" | "medium" | "low";
  rawResponse?: string;
}

/*
 * Ollama Error Response
 */
export interface OllamaError {
  error: string;
}
