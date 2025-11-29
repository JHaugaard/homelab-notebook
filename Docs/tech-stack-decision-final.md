# Tech Stack Decision: Homelab Notebook

**Date:** 2025-11-13
**Updated:** 2025-11-29
**Project:** Homelab Notebook - AI-Enhanced Knowledge Management System
**Mode:** LEARNING
**Status:** APPROVED - Ready for deployment-advisor
**Brief:** [Docs/homelab-notebook-brief.md](Docs/homelab-notebook-brief.md)

---

## Project Summary

**What:** Unified knowledge repository with three integrated modes (Research, Project, Reference) for capturing and retrieving learning notes, code snippets, resources, and documentation.

**Key Requirements:**
- AI-powered auto-tagging and organization
- Unified search across all content types
- Fast capture workflow (< 30 seconds)
- Markdown editing with code blocks
- File upload support
- Project linking and cross-referencing
- Desktop-focused, single-user

**Complexity:** Standard (multiple features, AI integration, rich search)
**Timeline:** Learning pace (flexible, education priority)
**Infrastructure:** Self-hosted on Hostinger VPS8 (Supabase, Ollama, PostgreSQL)

---

## Confirmed Tech Stack

**Next.js 15 + Supabase + Ollama**

A modern full-stack JavaScript application with server-side rendering, built-in API routes, and seamless integration with your self-hosted infrastructure.

### Stack Breakdown

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Next.js 15 (App Router) + React 19 | Server Components + Client Components |
| **Backend** | Next.js API Routes + Server Actions | Unified codebase |
| **Database** | PostgreSQL 15 via Supabase | Self-hosted, pgvector available |
| **Auth** | Supabase Auth | Email/password |
| **File Storage** | Supabase Storage | For file uploads |
| **AI/LLM** | Ollama (self-hosted) | llama3.2:3b for tagging, nomic-embed-text for embeddings |
| **Styling** | Tailwind CSS + shadcn/ui | Pre-built components |
| **Search** | PostgreSQL full-text search | pg_trgm + tsvector |
| **Testing** | Vitest (unit) + Playwright (e2e) | |
| **Deployment** | Docker + Caddy | Caddy handles HTTPS via Let's Encrypt |

### Why This Stack

**For Your Project:**
- AI Integration Native: Next.js API routes call Ollama directly
- Rich Interactive UI: React enables fast, responsive capture (< 30 seconds goal)
- Database + Auth Built-In: Supabase provides everything out of the box
- Unified Codebase: No CORS, no API versioning complexity
- Markdown Native: Excellent libraries (react-markdown, MDX)
- Search Capabilities: PostgreSQL full-text search + similarity extensions

**For Your Learning Goals:**
- Full-Stack Mastery: UI + backend in same framework
- Modern Architecture: Server Components, API Routes, data fetching
- AI/LLM Integration: Hands-on prompt engineering and API calls
- Industry-Relevant: Next.js + React is heavily used in production
- Self-Hosting Production App: Complete DevOps learning cycle

**For Your Infrastructure:**
- Uses existing Supabase ($0 marginal cost)
- Uses existing Ollama ($0 marginal cost)
- Deploys to VPS8 with Caddy reverse proxy (already configured)

---

## Infrastructure Reference

Your homelab (VPS8) already provides:

| Service | Status | URL | Purpose for This Project |
|---------|--------|-----|--------------------------|
| **Supabase** | Running | supabase.haugaard.dev | Database, Auth, Storage |
| **Ollama** | Running | ollama.haugaard.dev | AI tagging (llama3.2:3b), embeddings (nomic-embed-text) |
| **Caddy** | Running | - | Reverse proxy, automatic HTTPS |
| **PostgreSQL** | Running | via Supabase | Primary database (pgvector enabled) |

**VPS8 Specs:** 8 cores, 32GB RAM, 400GB storage
**Network:** homelab-net (Docker)
**Domain:** haugaard.dev

### AI Models Confirmed

| Model | Size | Purpose |
|-------|------|---------|
| llama3.2:3b | ~2GB | Auto-tagging note content |
| nomic-embed-text | ~274MB | Future: semantic search embeddings |

**Performance:** 10-25 tokens/sec (CPU inference), suitable for single-user

---

## Cost Analysis

**Monthly Cost: $0** (uses existing infrastructure)

| Item | Cost |
|------|------|
| Hostinger VPS8 | $0 marginal (already running) |
| Supabase | $0 marginal (self-hosted) |
| Ollama | $0 marginal (self-hosted) |
| Domain | $0 (subdomain of haugaard.dev) |
| SSL | $0 (Let's Encrypt via Caddy) |
| **Total** | **$0/month** |

**What you're NOT paying:**
- Managed Supabase: ~$25/month
- OpenAI API: ~$10-20/month
- Vercel Pro: ~$20/month

---

## Learning Opportunities

This project will develop skills in:

**Frontend:** React components, state management, Next.js patterns, form handling
**Backend:** API routes, database modeling, AI integration, file uploads, auth
**Database:** PostgreSQL queries, full-text search, schema design, migrations
**DevOps:** Docker, VPS deployment, Caddy configuration, environment management
**AI/ML:** Prompt engineering, LLM API patterns, embedding concepts
**Professional:** Git workflow, testing strategy, code organization

---

## Scope Decisions

**In Scope (v1):**
- Three-mode system (Research, Project, Reference)
- AI auto-tagging via Ollama
- Full-text search
- Markdown editing with code blocks
- File uploads
- Project linking

**Deferred (v2+):**
- n8n workflow integrations
- Wiki.js publishing for Reference docs
- Semantic search via embeddings
- Redis caching

---

## Checkpoints Satisfied

The LEARNING mode checkpoint questions have been addressed through discussion:

1. **Why Next.js over alternatives?** Unified codebase, rich React ecosystem, Supabase integration, job market relevance
2. **Why Supabase?** Already running, provides auth/storage/database, excellent DX with Next.js
3. **Why Ollama?** Self-hosted = $0 cost, full control over prompts, privacy, llama3.2:3b is capable for tagging
4. **Trade-offs accepted?** Medium learning curve (React/Next.js patterns), complexity justified by rich UI needs
5. **Infrastructure fit?** Perfect match with existing VPS8 services

---

## Next Step

**Invoke `deployment-advisor` skill**

Say: *"Use deployment-advisor skill for Next.js stack"*

The deployment-advisor will:
1. Review this tech-stack-decision
2. Recommend hosting strategy (VPS8 deployment)
3. Provide deployment workflow
4. Create deployment handoff document

---

**Decision Finalized:** 2025-11-29
**Ready for:** deployment-advisor skill
