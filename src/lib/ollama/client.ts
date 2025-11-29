import type {
  OllamaGenerateRequest,
  OllamaGenerateResponse,
  OllamaEmbedRequest,
  OllamaEmbedResponse,
  OllamaTagsResponse,
  OllamaOptions,
} from "./types";

/*
 * Ollama Client Configuration
 *
 * This client handles communication with the Ollama API running on VPS8.
 * It provides methods for:
 * - Text generation (for tag extraction)
 * - Embeddings (for semantic search in v2)
 * - Model listing (for health checks)
 *
 * Environment Variables:
 * - OLLAMA_BASE_URL: Base URL for the Ollama API (default: http://localhost:11434)
 * - OLLAMA_MODEL: Default model for generation (default: llama3.2:3b)
 * - OLLAMA_EMBEDDING_MODEL: Model for embeddings (default: nomic-embed-text)
 *
 * Why a class instead of functions?
 * - Encapsulates configuration in one place
 * - Easier to mock in tests
 * - Can add request interceptors, retries, etc. later
 */

class OllamaClient {
  private baseUrl: string;
  private defaultModel: string;
  private embeddingModel: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl =
      process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.defaultModel = process.env.OLLAMA_MODEL || "llama3.2:3b";
    this.embeddingModel =
      process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";
    this.defaultTimeout = 60000; // 60 seconds - models can be slow on first load
  }

  /*
   * Generate text from a prompt
   *
   * This is the core method for text generation. We use stream: false
   * to get the complete response in one request (simpler for our use case).
   *
   * @param prompt - The prompt to send to the model
   * @param options - Optional generation parameters
   * @returns The generated text response
   */
  async generate(
    prompt: string,
    options?: {
      model?: string;
      systemPrompt?: string;
      generationOptions?: OllamaOptions;
      format?: "json";
    }
  ): Promise<OllamaGenerateResponse> {
    const request: OllamaGenerateRequest = {
      model: options?.model || this.defaultModel,
      prompt,
      stream: false,
      system: options?.systemPrompt,
      options: options?.generationOptions,
      format: options?.format,
    };

    const response = await this.fetch<OllamaGenerateResponse>(
      "/api/generate",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );

    return response;
  }

  /*
   * Generate embeddings for text
   *
   * Used for semantic search. Embeddings are numerical representations
   * of text that capture meaning, allowing similarity comparisons.
   *
   * @param input - Text or array of texts to embed
   * @returns Array of embedding vectors
   */
  async embed(input: string | string[]): Promise<number[][]> {
    const request: OllamaEmbedRequest = {
      model: this.embeddingModel,
      input,
    };

    const response = await this.fetch<OllamaEmbedResponse>("/api/embed", {
      method: "POST",
      body: JSON.stringify(request),
    });

    return response.embeddings;
  }

  /*
   * List available models
   *
   * Useful for health checks and verifying required models are pulled.
   */
  async listModels(): Promise<OllamaTagsResponse> {
    return this.fetch<OllamaTagsResponse>("/api/tags", {
      method: "GET",
    });
  }

  /*
   * Check if Ollama is reachable and the required model is available
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    modelAvailable: boolean;
    error?: string;
  }> {
    try {
      const { models } = await this.listModels();
      const modelAvailable = models.some(
        (m) =>
          m.name === this.defaultModel ||
          m.name.startsWith(this.defaultModel.split(":")[0])
      );

      return {
        healthy: true,
        modelAvailable,
      };
    } catch (error) {
      return {
        healthy: false,
        modelAvailable: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /*
   * Internal fetch wrapper with error handling and timeout
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.defaultTimeout
    );

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Ollama API error (${response.status}): ${errorBody}`
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `Ollama request timed out after ${this.defaultTimeout}ms`
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/*
 * Export a singleton instance
 *
 * Why a singleton?
 * - Configuration is read once from environment
 * - No state to worry about between requests
 * - Easy to import and use: import { ollama } from "@/lib/ollama/client"
 */
export const ollama = new OllamaClient();

// Also export the class for testing purposes
export { OllamaClient };
