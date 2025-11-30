# Tech Stack Decision - Homelab Notebook

**Decision Date:** 2025-11-30
**Mode:** DELIVERY
**Model Used:** gemini-3-pro-preview

---

## PRIMARY RECOMMENDATION: The "Hyper-Light" Stack

### PocketBase + SvelteKit + Tailwind CSS

This stack is optimized purely for the "Delivery Mode" constraint. It combines a single-binary backend (PocketBase) with the most performant frontend framework (SvelteKit), ensuring the "under 5 seconds" capture goal is met through raw speed and minimal architectural overhead.

### Why This Fits

- **Zero-Friction Backend:** PocketBase provides Auth, Database (SQLite), and API in a single Docker container (~15MB RAM), perfectly matching the "Lightweight" constraint.
- **Instant UI State:** SvelteKit's compiled nature results in tiny bundles, ensuring the UI loads instantly on mobile networks for quick capture.
- **Rapid Development:** PocketBase eliminates the need to write backend boilerplate (controllers, ORMs). You just define the schema in the UI and consume the SDK.
- **Single-User Optimization:** PocketBase's auth model is simple enough for a single user but robust enough to secure the endpoint.
- **Search Speed:** SQLite (embedded in PocketBase) is faster for this scale than a network round-trip to Postgres, and Svelte stores make local state management for "instant" filtering trivial.

### Tech Stack Breakdown

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | **SvelteKit** | Fastest hydration, built-in API routes if needed, and "use what you need" architecture. Excellent for "keyboard-first" event handling. |
| **Backend/DB** | **PocketBase** | Embedded SQLite + Go. Handles Auth, API, and persistence in one binary. Zero maintenance compared to Postgres. |
| **Styling** | **Tailwind CSS** | Utility-first CSS allows rapid UI iteration without context switching to CSS files. Essential for "Delivery Mode". |
| **Search** | **FlexSearch.js** (Client-side) | For a personal notebook (<10k items), server-side search introduces latency. Loading note metadata into a client-side memory index enables *true* zero-latency fuzzy search as you type. |
| **Icons** | **Lucide Svelte** | Lightweight, consistent icon set for the UI. |
| **Editor** | **CodeMirror 6** | Best-in-class for code snippets with syntax highlighting; lighter and more mobile-friendly than Monaco (VS Code's editor). |

**Learning Curve:** Low (PocketBase is intuitive; Svelte is close to vanilla HTML/JS)
**Development Speed:** Very Fast

---

## ALTERNATIVE 1: The "Future-Proof" Stack

### Supabase (Self-Hosted) + Next.js (App Router)

Leverages your existing Supabase infrastructure.

**Why Consider This:**
- **Existing Infrastructure:** You already have Supabase running; no new backend container to manage.
- **AI Readiness:** Supabase has `pgvector` built-in. If the "AI Integration" (future scope) involves vector embeddings for semantic search, this is the superior choice.
- **Ecosystem:** Next.js has the largest ecosystem of pre-built components.

**Trade-offs vs Primary:**
- **Heavier:** Next.js bundles are significantly larger than SvelteKit's.
- **Complexity:** Self-hosted Supabase is complex to maintain/upgrade compared to a single PocketBase binary.
- **Overhead:** For a simple "capture text" app, React Server Components can feel like over-engineering.

**When to Choose Instead:**
- If you plan to implement AI Vector Search *immediately* after v1.
- If you strongly prefer React over Svelte.

---

## ALTERNATIVE 2: The "No-Build" Stack

### Go (Standard Lib + Chi) + HTMX + Templ

A classic server-side rendered approach.

**Why Consider This:**
- **Simplicity:** No Node.js build steps, no hydration issues, no client-side state complexity.
- **Raw Performance:** Go renders HTML incredibly fast.

**Trade-offs vs Primary:**
- **Rich Interaction Friction:** Building a sophisticated "keyboard-first" UI with complex code editors and instant fuzzy search is significantly harder with HTMX than with a reactive framework like Svelte.
- **Mobile Experience:** Achieving an "app-like" feel (optimistic UI updates) requires more manual work.

**When to Choose Instead:**
- If you despise JavaScript build tools and want a pure Go codebase.

---

## RULED OUT OPTIONS

| Technology | Why Ruled Out |
|------------|---------------|
| **Elasticsearch / MeiliSearch** | Violates "Lightweight" constraint. Running a dedicated search engine container for a personal notebook is resource overkill when SQLite or client-side indexing works for <100k records. |
| **Obsidian / Logseq (Sync)** | The brief specifies a "Web-based application" accessible via browser/mobile without installing native apps. |
| **MongoDB / NoSQL** | Relational data (Tags <-> Notes <-> Collections) is better handled by SQL. PocketBase (SQLite) handles JSON fields natively if unstructured data is needed. |

---

## Critical Technical Strategy

**Client-Side Search Architecture:**

Do **not** rely solely on backend SQL queries for the "Instant Search" requirement. For v1:

1. Fetch a lightweight JSON summary of all notes (ID, Title, Tags) on load
2. Use **FlexSearch.js** on the client side
3. This guarantees the "under 3 seconds" retrieval goal by making search instantaneous (0ms network latency) as the user types

---

## Summary

For a "Delivery Mode" project where the goal is speed—both in terms of application latency (<5s capture) and development time—**PocketBase + SvelteKit** is the optimal choice. PocketBase gives you a backend in seconds, not hours. SvelteKit ensures the UI feels native and snappy.

---

## Next Steps

1. Review this recommendation
2. If agreed → Invoke **deployment-advisor** skill
3. After deployment planning → Invoke **project-spinup** skill

---

*Generated with gemini-3-pro-preview via Zen MCP*
