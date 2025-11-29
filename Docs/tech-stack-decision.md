# Tech Stack Decision: Homelab Notebook

**Date:** 2025-11-13
**Project:** Homelab Notebook - AI-Enhanced Knowledge Management System
**Mode:** LEARNING
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
**Infrastructure:** Self-hosted (Hostinger VPS, Supabase, Ollama, PostgreSQL, Redis)

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PRIMARY RECOMMENDATION: Next.js 15 + Supabase + Ollama
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A modern full-stack JavaScript application with server-side rendering, built-in API routes, and seamless integration with your self-hosted infrastructure. This stack balances learning value, development speed, and feature requirements perfectly.

WHY THIS FITS YOUR PROJECT:
• **AI Integration Native:** Next.js API routes can directly call your self-hosted Ollama for auto-tagging without external dependencies
• **Rich Interactive UI:** React components enable fast, responsive note capture and search interfaces that feel snappy (sub-30-second capture goal)
• **Database + Auth Built-In:** Supabase (already self-hosted) provides PostgreSQL database, authentication, file storage, and full-text search out of the box
• **Unified Codebase:** Frontend and backend in one project simplifies development and deployment - no CORS, no API versioning complexity
• **Markdown Native:** Excellent markdown libraries (react-markdown, MDX) with syntax highlighting for code blocks are battle-tested
• **Search Capabilities:** Supabase offers PostgreSQL full-text search + similarity search extensions, perfect for your multi-mode search requirements

WHY THIS FITS YOUR LEARNING GOALS:
• **Full-Stack Mastery:** You'll build both UI components (React) and backend logic (API routes) in the same framework, understanding data flow end-to-end
• **Modern Architecture Patterns:** Learn Server Components, API Routes, data fetching strategies, and state management - transferable to any modern web project
• **AI/LLM Integration Hands-On:** Direct experience calling LLMs via API, prompt engineering for auto-tagging, and handling AI responses
• **Industry-Relevant Stack:** Next.js + React is heavily used in production (Vercel, Airbnb, Netflix) - skills transfer directly to professional work
• **Self-Hosting Production App:** Deploy real full-stack application to your VPS, not just toy projects - complete DevOps learning cycle

WHY THIS FITS YOUR INFRASTRUCTURE:
• **Uses Your Supabase:** $0 marginal cost - Supabase handles database, auth, file storage, and real-time subscriptions (already running)
• **Uses Your Ollama:** $0 marginal cost - Local LLM for auto-tagging means no OpenAI API fees, full control over prompts and models
• **VPS-Ready:** Next.js runs on Node.js, deploys easily to your Hostinger VPS with PM2/Docker - straightforward production setup
• **Redis Optional Enhancement:** Can add Redis caching later for search results/AI responses using your existing Redis instance
• **Nginx Integration:** Standard reverse proxy setup for Next.js - patterns you'll reuse for other projects

TECH STACK BREAKDOWN:
─────────────────────────────────────────────────────────
Frontend:     Next.js 15 (App Router) + React 19
Backend:      Next.js API Routes + Server Actions
Database:     PostgreSQL via Supabase (self-hosted)
Auth:         Supabase Auth (email/password)
File Storage: Supabase Storage (for file uploads)
AI/LLM:       Ollama (self-hosted, llama3.2 or mistral)
Styling:      Tailwind CSS + shadcn/ui components
Search:       PostgreSQL full-text search (pg_trgm + tsvector)
Testing:      Vitest (unit) + Playwright (e2e)
Deployment:   Docker + Nginx on Hostinger VPS
─────────────────────────────────────────────────────────

LEARNING CURVE: 🟡 Medium
**Estimate:** 3-4 weeks to proficiency with Next.js patterns (Server Components, API Routes, data fetching)

**Why Medium:**
- React knowledge transfers, but Next.js adds framework-specific concepts
- Supabase client library is straightforward (similar to Firebase)
- Ollama API is simple REST/streaming interface
- Most complexity is in learning Next.js patterns, not overwhelming

**Learning Path:**
1. Week 1: Next.js fundamentals (routing, Server vs Client Components)
2. Week 2: Supabase integration (database queries, auth, storage)
3. Week 3: Ollama integration (API routes calling LLM, streaming responses)
4. Week 4: Search implementation (PostgreSQL full-text search, UI refinement)

DEVELOPMENT SPEED: 🟢 Fast
**First MVP:** 2-3 weeks for basic Research mode with AI tagging

**Why Fast:**
- Next.js + Supabase = rapid prototyping (minimal boilerplate)
- shadcn/ui provides pre-built components (forms, dialogs, search)
- Supabase handles auth/file storage (don't build from scratch)
- Rich ecosystem: markdown rendering, syntax highlighting, date formatting all have excellent libraries

**Milestone Timeline:**
- Week 1-2: Authentication, basic note CRUD, markdown editor
- Week 3: Ollama integration for auto-tagging
- Week 4: Search implementation across modes
- Week 5-6: Project linking, cross-referencing, UI polish

MONTHLY COST: $0 (uses existing infrastructure)
**Breakdown:**
• Hostinger VPS: Already running ($0 marginal cost)
• Supabase: Self-hosted ($0 marginal cost)
• Ollama: Self-hosted ($0 marginal cost)
• Domain: Existing or ~$1/month if new subdomain
• SSL: Let's Encrypt ($0)
• **Total New Cost: $0-1/month**

**Cost Comparison:**
- Managed Supabase (cloud): $25/month (Pro tier for production)
- OpenAI API for tagging: ~$5-20/month depending on usage
- Vercel hosting: $0-20/month (hobby tier sufficient but limits)
- **Your Self-Hosted Advantage: ~$30-45/month savings**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ALTERNATIVE 1: Laravel 11 + Livewire + PostgreSQL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-stack PHP framework with reactive components - "batteries-included" approach that handles everything from auth to file uploads with minimal configuration.

WHY CONSIDER THIS:
+ **Rapid Development:** Laravel scaffolds auth, CRUD, file uploads, queues out-of-the-box - less code to write
+ **Server-Side Rendering:** No JavaScript build step required, simpler deployment, faster page loads for traditional interactions
+ **Excellent ORM:** Eloquent makes database queries elegant and intuitive - great for learning database design patterns
+ **Job Queues Built-In:** Queue AI tagging jobs easily with Laravel Queues + Redis (already have Redis) - process heavy LLM calls asynchronously
+ **Strong Conventions:** "The Laravel Way" teaches professional PHP patterns - less decision fatigue about project structure

TRADE-OFFS VS PRIMARY:
- **Less Modern Frontend:** Livewire is reactive but not as rich as React - complex UI interactions (drag-drop, real-time search previews) are harder
- **Smaller Ecosystem:** PHP packages for AI/LLM are less mature than JavaScript/Python ecosystems - more manual integration work with Ollama
- **Heavier Server Load:** Server-side rendering on every interaction (no client-side state) - Livewire sends AJAX for everything
- **Less Transferable to Frontend Jobs:** PHP backend skills are valuable, but React skills open more frontend/full-stack opportunities

TECH STACK DETAILS:
─────────────────────────────────────────────────────────
Frontend:     Laravel Blade + Livewire 3 (reactive components)
Backend:      Laravel 11 (PHP 8.3)
Database:     PostgreSQL (self-hosted or via Supabase)
Auth:         Laravel Breeze (scaffolded auth system)
File Storage: Laravel Storage (S3-compatible, use Supabase/B2)
AI/LLM:       HTTP Client → Ollama API (manual integration)
Styling:      Tailwind CSS (Laravel Breeze default)
Search:       Laravel Scout + PostgreSQL full-text search
Job Queues:   Laravel Queues + Redis (self-hosted)
Testing:      Pest (PHPUnit successor, modern syntax)
Deployment:   PHP-FPM + Nginx on Hostinger VPS
─────────────────────────────────────────────────────────

LEARNING CURVE: 🟡 Medium
- Laravel has many concepts (routing, middleware, controllers, Eloquent, queues, events)
- But documentation is excellent and conventions reduce decision paralysis
- Livewire is easier than learning React

DEVELOPMENT SPEED: 🟢 Fast
- Laravel scaffolding generates auth, CRUD faster than Next.js
- But complex UI features take longer without React component ecosystem

MONTHLY COST: $0 (uses existing infrastructure)

BEST FOR: Developers who prefer server-side rendering, want to learn professional PHP, or prioritize rapid CRUD development over rich client-side interactions.

WHEN TO CHOOSE THIS INSTEAD:
• You want to deepen PHP expertise (already know JavaScript well)
• You prefer convention-over-configuration frameworks
• You're building mostly form-based CRUD with less complex UI interactions
• You want minimal JavaScript tooling complexity (no build step debugging)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ALTERNATIVE 2: FastAPI + React + PostgreSQL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API-first architecture with Python backend (excellent for AI/ML integration) and React frontend (rich interactivity) - separate but coordinated codebases.

WHY CONSIDER THIS:
+ **Best AI/ML Ecosystem:** Python has superior libraries for LLM integration, embeddings, vector search (langchain, sentence-transformers)
+ **Future AI Expansion:** If you later want semantic search, RAG, or advanced AI features, Python ecosystem dominates
+ **Clean Separation:** Frontend and backend are truly independent - easier to swap React for mobile app later, or add multiple frontends
+ **Type Safety Everywhere:** FastAPI (Pydantic) + TypeScript (React) = end-to-end type checking and auto-generated API docs
+ **Async Performance:** FastAPI async capabilities handle multiple Ollama requests concurrently - good for AI-heavy operations

TRADE-OFFS VS PRIMARY:
- **Two Codebases:** Separate repos for frontend/backend = more complexity (CORS, API versioning, deployment coordination)
- **Slower Initial Development:** Must build API endpoints explicitly for every feature - Next.js API routes are faster for simple cases
- **More Moving Parts:** Need to run two dev servers, manage two deployments, handle API authentication separately
- **Steeper Learning Curve:** Learn Python async patterns + React + FastAPI + API design simultaneously - more concepts than unified framework

TECH STACK DETAILS:
─────────────────────────────────────────────────────────
Frontend:     React 19 + Vite + TanStack Query
Backend:      FastAPI (Python 3.12) + SQLAlchemy
Database:     PostgreSQL (self-hosted)
Auth:         JWT tokens + FastAPI Security utilities
File Storage: S3-compatible (Supabase Storage or B2)
AI/LLM:       Python OpenAI-compatible client → Ollama
Styling:      Tailwind CSS + shadcn/ui
Search:       PostgreSQL full-text search + pgvector (embeddings)
Task Queue:   Celery + Redis (for async AI processing)
Testing:      Pytest (backend) + Vitest (frontend)
Deployment:   Docker Compose (FastAPI + React Nginx) on VPS
─────────────────────────────────────────────────────────

LEARNING CURVE: 🔴 High
- Two separate codebases and technology stacks to learn
- Python async/await patterns
- API design principles (RESTful conventions, versioning)
- React state management for API interactions
- More deployment complexity (two containers, CORS, proxy config)

DEVELOPMENT SPEED: 🟡 Moderate
- Initial setup slower (scaffold two projects, API contracts)
- Once established, parallel frontend/backend work possible
- First MVP: 4-5 weeks (vs 2-3 weeks for Next.js)

MONTHLY COST: $0 (uses existing infrastructure)

BEST FOR: Developers who want maximum AI/ML flexibility, plan to add advanced features (semantic search, embeddings), or need truly independent frontend/backend for multiple clients.

WHEN TO CHOOSE THIS INSTEAD:
• You want to master Python for AI/ML work (transferable to data science)
• You plan advanced AI features (vector search, embeddings, RAG)
• You might build mobile app later (API-first makes this easy)
• You value clean separation of concerns over rapid development

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ALTERNATIVE 3: SvelteKit + Supabase + Ollama
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Modern full-stack framework with simpler mental model than React - "write less code" philosophy with reactive state management built into the language.

WHY CONSIDER THIS:
+ **Simpler Than React:** No hooks, no useEffect complexity, no virtual DOM - state reactivity is built into the language ($variable syntax)
+ **Less Boilerplate:** SvelteKit routes are file-based like Next.js but require less code for same functionality
+ **Excellent Performance:** Compiled framework (not runtime) = smaller bundle sizes, faster page loads
+ **Great DX:** Transitions, animations, forms are easier to build than React equivalents
+ **Growing Ecosystem:** Mature enough for production, community is active and growing

TRADE-OFFS VS PRIMARY:
- **Smaller Job Market:** React dominates job postings 10:1 - Svelte skills are valuable but less directly marketable
- **Fewer Pre-Built Components:** shadcn/ui exists for Svelte but library ecosystem is smaller than React's
- **Less AI/LLM Examples:** Most AI integration tutorials use React/Next.js or Python - you'll adapt examples yourself
- **Less Mature:** SvelteKit 1.0 released 2022 (Next.js released 2016) - fewer production battle scars, less Stack Overflow history

TECH STACK DETAILS:
─────────────────────────────────────────────────────────
Frontend:     SvelteKit 2 (Svelte 5)
Backend:      SvelteKit server routes (similar to Next.js API routes)
Database:     PostgreSQL via Supabase (self-hosted)
Auth:         Supabase Auth (same as Next.js option)
File Storage: Supabase Storage
AI/LLM:       Ollama (self-hosted) via server routes
Styling:      Tailwind CSS + shadcn-svelte
Search:       PostgreSQL full-text search
Testing:      Vitest + Playwright
Deployment:   Node.js adapter + Docker on Hostinger VPS
─────────────────────────────────────────────────────────

LEARNING CURVE: 🟢 Low-Medium
- Svelte is easier to learn than React (less framework concepts)
- SvelteKit patterns similar to Next.js (file-based routing, server routes)
- Smaller ecosystem means less choice paralysis

DEVELOPMENT SPEED: 🟢 Fast
- Often faster than React due to less boilerplate
- First MVP: 2-3 weeks (similar to Next.js)

MONTHLY COST: $0 (uses existing infrastructure)

BEST FOR: Developers who find React's complexity frustrating, want cleaner code with less boilerplate, or prioritize learning simplicity over job market relevance.

WHEN TO CHOOSE THIS INSTEAD:
• React's hooks/useEffect patterns feel unnecessarily complex
• You want to write less code for same functionality
• You're building for personal use (job market relevance less important)
• You value framework simplicity and performance over ecosystem size

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ NOT RECOMMENDED: Wiki.js or Notion-like Clones
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Existing knowledge management platforms (Wiki.js, Outline, BookStack, etc.)

WHY RULED OUT:
• **Wrong Learning Goals:** Using existing platform teaches you how to configure/customize, not how to build full-stack applications with AI integration
• **Limited Customization:** These platforms have their own data models - implementing your specific three-mode system (Research/Project/Reference) would require fighting the platform
• **No AI Integration Control:** Adding custom Ollama-powered auto-tagging to Wiki.js means learning Wiki.js plugin system, not learning AI/LLM integration generally
• **Misses Full-Stack Learning:** Your explicit goal is "building a full-stack application with AI integration from the ground up" - using Wiki.js skips this entirely

WHEN TO RECONSIDER:
• If your goal shifts from learning full-stack development to "I just need a working knowledge base quickly"
• If you've already built several full-stack apps and want to focus on content organization workflow instead of code
• If timeline changes to "must be production-ready in 1 week"

**Verdict:** These are great tools, but they don't serve your learning objectives for this project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ NOT RECOMMENDED: WordPress + Custom Plugin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WordPress as base with custom plugin for note management and AI integration.

WHY RULED OUT:
• **Legacy Architecture:** WordPress core is 20+ years old - you'd learn outdated PHP patterns that don't transfer to modern development
• **Wrong Problem Domain:** WordPress solves content publishing/CMS - your project is knowledge management with AI, different architectural needs
• **Plugin System Friction:** WordPress plugin API is complex and idiosyncratic - you'd spend time learning WordPress-specific patterns instead of general full-stack concepts
• **Overkill for Single User:** WordPress shines with multiple users, roles, permissions - unnecessary complexity for personal knowledge base
• **Poor AI Integration Story:** No native support for LLM integration - you'd build everything custom anyway, why carry WordPress weight?

WHEN TO RECONSIDER:
• If project requirements expand to public-facing blog + knowledge base hybrid
• If you need WordPress CMS features (post scheduling, revisions, multi-user editing)
• If you're specifically trying to learn WordPress development for client work

**Verdict:** Wrong tool for this problem domain and learning goals.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ NOT RECOMMENDED: Django + Django REST Framework
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Python full-stack framework with separate API for frontend (similar to FastAPI option but heavier).

WHY RULED OUT:
• **Heavier Than Needed:** Django is comprehensive (admin panel, ORM, migrations, templating) but much is unnecessary for single-user app - you'd learn to ignore 40% of the framework
• **Slower Than FastAPI:** If going Python API route, FastAPI is modern standard (async, better performance, auto-docs) - Django REST is legacy approach
• **Less AI/ML Native:** Django wasn't designed for async AI operations - FastAPI handles streaming LLM responses more naturally
• **Steeper Learning Curve:** Django has more concepts than FastAPI (class-based views, middleware, signals, apps) without clear benefit for this project
• **Synchronous by Default:** Django ORM is synchronous - async support exists but feels bolted-on compared to FastAPI

WHEN TO RECONSIDER:
• If you need Django admin panel for manual data management
• If you're learning Django specifically for job requirements
• If project grows to need Django's comprehensive feature set (complex permissions, multi-tenant, etc.)

**Verdict:** If you want Python backend, FastAPI is better fit. Django is overkill for this use case.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 LEARNING OPPORTUNITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

With the PRIMARY recommendation (Next.js + Supabase + Ollama), you'll learn:

FRONTEND SKILLS:
• **React Component Architecture:** Building reusable UI components (note editor, search interface, tag selector, mode switcher)
• **State Management:** Client-side state with React hooks (useState, useEffect) and server state with TanStack Query
• **Next.js Patterns:** Server Components vs Client Components, data fetching strategies, API routes, server actions
• **Form Handling:** Capturing note content, file uploads, markdown editing with preview
• **Real-Time UI Updates:** Optimistic updates, loading states, error handling for better UX

BACKEND SKILLS:
• **API Route Design:** RESTful endpoints for CRUD operations on notes, search, tagging
• **Database Modeling:** Designing schema for flexible three-mode system (Research/Project/Reference) with shared search
• **AI/LLM Integration:** Calling Ollama API from backend, prompt engineering for auto-tagging, streaming responses, error handling
• **File Upload Handling:** Multipart form data, file validation, storage integration
• **Authentication Flow:** Supabase Auth integration, protected routes, session management

ARCHITECTURE CONCEPTS:
• **Full-Stack Data Flow:** Understanding how data moves from database → API route → React component → user interaction → back to database
• **Search System Design:** Full-text search implementation, relevance ranking, multi-field search, tag filtering
• **Database Indexing:** Optimizing PostgreSQL queries, understanding indexes for search performance
• **AI Integration Patterns:** When to call LLM (client-side vs server-side), handling async AI operations, retry logic
• **File Storage Architecture:** Separating file storage from database, handling uploads/downloads, CDN concepts

DATABASE & SQL SKILLS:
• **PostgreSQL Mastery:** Complex queries joining notes/tags/projects, full-text search (tsvector), trigram similarity (pg_trgm)
• **Schema Design:** Many-to-many relationships (notes ↔ tags), polymorphic associations (all modes share tag system)
• **Migration Patterns:** Evolving database schema over time without data loss
• **Performance Optimization:** Query analysis with EXPLAIN, adding indexes strategically

DEVOPS & DEPLOYMENT:
• **Docker Containerization:** Creating Dockerfile for Next.js app, docker-compose for local development with Supabase
• **VPS Deployment:** Deploying to Hostinger VPS, PM2 or Docker in production, Nginx reverse proxy configuration
• **Environment Management:** Environment variables for database connections, API keys, deployment-specific config
• **SSL/TLS Setup:** Let's Encrypt certificates, HTTPS configuration with Nginx
• **Monitoring & Logging:** Application logging, error tracking, performance monitoring

AI/ML INTEGRATION SKILLS:
• **Prompt Engineering:** Crafting prompts for Ollama to generate relevant tags from note content
• **LLM API Patterns:** Calling local LLM vs cloud APIs, handling rate limits, streaming vs batch responses
• **Embedding Concepts:** (Optional future enhancement) Vector embeddings for semantic search beyond keyword matching
• **Model Selection:** Understanding trade-offs between llama3.2, mistral, codellama for tagging tasks

PROFESSIONAL DEVELOPMENT PRACTICES:
• **Git Workflow:** Feature branches, conventional commits, pull requests (even solo dev)
• **Testing Strategy:** Unit tests for utility functions, integration tests for API routes, e2e tests for critical user flows
• **Code Organization:** Feature-based file structure, separation of concerns (components, hooks, utils, API)
• **Documentation:** README, API documentation, deployment guides - practicing documentation-as-you-go

TRANSFERABLE SKILLS:
• **Full-Stack Thinking:** Understanding how frontend needs drive backend design and vice versa
• **Product Development:** Building feature from user need → UI mockup → data model → implementation → testing
• **Problem Decomposition:** Breaking complex features (unified search, AI tagging) into manageable tasks
• **Performance Mindset:** Thinking about speed (30-second capture goal) from beginning, not as afterthought

REAL-WORLD PATTERNS YOU'LL ENCOUNTER:
• **Markdown Rendering:** Handling user-generated markdown safely (XSS prevention), code syntax highlighting
• **Tag Management:** Auto-generated tags + user overrides, tag normalization (case, spacing), merge/dedupe logic
• **Search Relevance:** Balancing recency, tag matches, full-text matches for result ranking
• **File Upload UX:** Drag-and-drop, progress indicators, file type validation, size limits
• **Error Handling:** Graceful degradation when Ollama is down, retry logic, user-friendly error messages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 COST ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIMARY RECOMMENDATION COSTS (Next.js + Supabase + Ollama):

**Initial Setup:**
• Domain: $0 (use subdomain of existing domain)
• SSL: $0 (Let's Encrypt)
• Development tools: $0 (VS Code, Node.js, Docker Desktop - already have)
**Total Initial: $0**

**Monthly Ongoing:**
• Hostinger VPS: $0 marginal cost (already running Supabase, Ollama, PostgreSQL)
• Supabase (self-hosted): $0 marginal cost
• Ollama (self-hosted): $0 marginal cost
• Database storage: $0 marginal cost (notes are small, fits in existing PostgreSQL)
• File storage: $0 marginal cost (use Supabase Storage on VPS, or add Backblaze B2 if needed: $0.005/GB)
**Total Monthly: $0-1/month**

**Self-Hosted Advantage - What You're NOT Paying:**
• Managed Supabase (cloud): $25/month (Pro tier)
• OpenAI API for tagging: $5-20/month (depends on usage, could be higher)
• Vercel Pro (if exceeding hobby limits): $20/month
• Managed PostgreSQL: $15-50/month (depending on provider)
• **Total Savings: $65-115/month** 🎯

**COMPARE TO ALTERNATIVES:**

**Alternative 1: Laravel + Livewire + PostgreSQL**
• Same infrastructure costs: $0/month
• Identical to primary (uses same VPS, database, Ollama)

**Alternative 2: FastAPI + React + PostgreSQL**
• Same infrastructure costs: $0/month
• Identical to primary (uses same VPS, database, Ollama)

**Alternative 3: SvelteKit + Supabase + Ollama**
• Same infrastructure costs: $0/month
• Identical to primary (uses same VPS, database, Ollama)

**If You DIDN'T Have Self-Hosted Infrastructure:**

**Option A: Fully Cloud-Managed (Vercel + Supabase Cloud + OpenAI)**
• Vercel Hobby: $0 (with limits) or Pro: $20/month
• Supabase Pro: $25/month (need Pro for production usage limits)
• OpenAI API (gpt-4o-mini for tagging): ~$10/month
• File storage (Supabase): Included in Pro
• **Total: $35-55/month**

**Option B: Shared Hosting (Budget Option)**
• Shared hosting (PHP): $5-10/month
• MySQL database: Included
• Limited to Laravel/PHP stack (no Node.js)
• No self-hosted LLM (must use OpenAI API): ~$10/month
• **Total: $15-20/month**

**Option C: VPS Fresh (No Existing Infrastructure)**
• Hostinger VPS KVM 4: $30/month (what you have)
• Self-host everything: $0 additional
• Same as your current setup
• **Total: $30/month**

**BREAK-EVEN ANALYSIS:**

Your existing VPS costs ~$30-40/month and runs:
- Supabase (replaces $25/month cloud)
- Ollama (replaces $10-20/month OpenAI)
- PostgreSQL (replaces $15-50/month managed DB)
- n8n, Redis, Nginx, Wiki.js (bonus services)

**Value of your VPS for this project alone: $50-95/month**
**Actual VPS cost: $30-40/month**
**ROI on self-hosting: 125-237%** 🎯

Even if this was the ONLY project on your VPS, you'd break even. Since you're running multiple services, the marginal cost for Homelab Notebook is effectively $0.

**COST VERDICT:**
Self-hosting makes ALL the recommended stacks essentially free to run. The technology choice doesn't impact costs - choose based on learning goals and development speed, not budget.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RECOMMENDED NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 **HANDOFF DOCUMENT CREATED:** tech-stack-decision.md
This file contains the complete analysis and can be referenced in new sessions.

**1. Review this recommendation and ask any questions**
   - Not sure about a choice? Ask me to explain trade-offs
   - Want to see alternative in more detail? Just ask
   - Curious about ruled-out option? I can explain when it's better
   - Want to discuss learning path or timeline? Let's talk

**2. If you agree with PRIMARY recommendation (Next.js + Supabase + Ollama):**
   → Invoke `deployment-advisor` skill next
   Say: *"Use deployment-advisor skill for Next.js stack"*
   Note: deployment-advisor will read this tech-stack-decision.md automatically

**3. If you want to explore alternatives:**
   → Tell me which alternative interests you
   Say: *"Tell me more about Alternative 1"* or *"Compare Alternative 1 vs 2"*
   → I can provide deeper analysis, code examples, or learning path comparisons

**4. After hosting decision:**
   → Invoke `project-spinup` skill
   Say: *"Use project-spinup skill with [chosen stack] and [hosting plan]"*
   Note: project-spinup creates project foundation, claude.md, and learning roadmap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DECISION MATRIX (For Quick Reference)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Criteria                  | Next.js | Laravel | FastAPI | SvelteKit |
|---------------------------|---------|---------|---------|-----------|
| **Learning Curve**        | 🟡 Med  | 🟡 Med  | 🔴 High | 🟢 Low    |
| **Development Speed**     | 🟢 Fast | 🟢 Fast | 🟡 Mod  | 🟢 Fast   |
| **Job Market Relevance**  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐    | ⭐⭐⭐⭐    | ⭐⭐⭐       |
| **AI/LLM Integration**    | ⭐⭐⭐⭐    | ⭐⭐⭐     | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐    |
| **Rich UI Capabilities**  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐   |
| **Rapid CRUD**            | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐   | ⭐⭐⭐     | ⭐⭐⭐⭐    |
| **Future Extensibility**  | ⭐⭐⭐⭐    | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐    |
| **Uses Your Infra**       | ✅ Yes  | ✅ Yes  | ✅ Yes  | ✅ Yes    |
| **Monthly Cost**          | $0      | $0      | $0      | $0        |

**Legend:**
⭐ = Poor, ⭐⭐ = Fair, ⭐⭐⭐ = Good, ⭐⭐⭐⭐ = Very Good, ⭐⭐⭐⭐⭐ = Excellent

---

## Why Next.js Wins for This Project

**TL;DR:** Next.js + Supabase + Ollama balances all competing priorities:

1. **Learning Value:** Full-stack JavaScript (frontend + backend) teaches modern patterns, React dominates job market, AI integration is hands-on
2. **Development Speed:** Rapid prototyping with unified codebase, Supabase handles auth/storage, rich component ecosystem (shadcn/ui)
3. **Feature Fit:** Rich UI for fast note capture, real-time search, markdown editing with syntax highlighting - React excels here
4. **Infrastructure Match:** Uses your Supabase ($0), uses your Ollama ($0), deploys to your VPS easily
5. **Future-Proof:** If you want mobile app later, Next.js API routes can serve it; if you want to add vector search, TypeScript ecosystem has libraries

**The alternatives are viable, but:**
- **Laravel:** Better for rapid CRUD, worse for rich client-side interactions (your search UI will feel less snappy)
- **FastAPI:** Best for AI-heavy features, but two codebases slow initial development and add deployment complexity
- **SvelteKit:** Simpler code, but smaller ecosystem and less job market relevance

**For a learning project that must also be production-useful and leverage your self-hosted infrastructure, Next.js hits the sweet spot.**

---

## Confidence Level: ⭐⭐⭐⭐⭐ (Very High)

I'm highly confident Next.js is the right choice because:
1. Your brief emphasizes fast capture (< 30 seconds) → needs rich client-side UI → React is best-in-class
2. Your learning goals say "full-stack application with AI integration" → Next.js is full-stack JS with excellent LLM integration examples
3. Your infrastructure has Supabase → Next.js + Supabase is battle-tested pattern with great DX
4. Your timeline is learning-paced → Next.js learning curve is manageable, resources are abundant
5. Single-user desktop app → Next.js strengths (SSR, SEO, performance) aren't wasted, and complexity is justified by rich UI needs

**If your brief was different, I'd recommend differently:**
- "I want to learn Python for AI/ML" → FastAPI
- "I want minimal JavaScript tooling" → Laravel
- "I find React frustrating" → SvelteKit

But given YOUR specific brief, Next.js is the clear winner.

---

**Analysis Complete.** 🎯

Ready for checkpoint questions? (LEARNING mode requires answering 5 comprehension questions before proceeding to deployment-advisor.)
