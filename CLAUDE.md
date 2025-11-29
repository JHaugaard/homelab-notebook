# Homelab Notebook

> AI-enhanced knowledge management system with three integrated modes: Research, Project, and Reference. Capture learning resources, document active projects, and distill knowledge into reusable tutorials.

**Status**: Active Development | **Developer**: John | **Philosophy**: Learning-Focused, Best Practices

---

## Developer Profile

**Experience:** Hobbyist developer, beginner-to-intermediate level
**Learning Goals:** Deep understanding of full-stack development, AI integration, professional practices
**Development Approach:** Heavy use of Claude Code for implementation guidance and pair programming
**Common Tasks:** Feature implementation, debugging, refactoring, testing, deployment

**Preferences:**
- Explain the "why" behind implementation choices
- Show trade-offs when multiple approaches exist
- Flag potential gotchas before they become problems
- Keep code simple and readable over clever

---

## Project Overview

### What This Project Does

A unified knowledge repository that minimizes friction for capturing information during active learning and maximizes reliability when retrieving that information later.

**Three Integrated Modes:**
1. **Research Mode** - Capture and organize external resources (links, articles, tutorials). AI auto-tags by technology and topic.
2. **Project Mode** - Raw lab notebook during active work. Timestamped notes, code snippets, checklists, observations.
3. **Reference Mode** - Distilled, tutorial-style documentation. Clean step-by-step guides derived from project experiences.

**Key Features:**
- AI-powered auto-tagging via Ollama (llama3.2:3b)
- Unified search across all content types
- Fast capture workflow (< 30 seconds target)
- Markdown editing with code blocks
- File upload support
- Project linking and cross-referencing

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 15 (App Router) + React 19 | Server Components + Client Components |
| Backend | Next.js API Routes + Server Actions | Unified codebase, no CORS |
| Database | PostgreSQL 15 via Supabase | Self-hosted on VPS8 |
| Auth | Supabase Auth | Email/password authentication |
| File Storage | Supabase Storage | File uploads |
| AI/LLM | Ollama | llama3.2:3b (tagging), nomic-embed-text (embeddings) |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS + pre-built components |
| Search | PostgreSQL full-text search | pg_trgm + tsvector |
| Testing | Vitest (unit) + Playwright (e2e) | |
| Deployment | Docker + Caddy on VPS2 | Container deployment with reverse proxy |

### Architecture Decisions

- **Unified Codebase:** Next.js handles both frontend and backend, eliminating CORS complexity
- **Remote Services:** Supabase and Ollama run on VPS8, accessed via HTTPS from VPS2
- **Server Components First:** Use Server Components by default, Client Components only when needed (interactivity)
- **PostgreSQL Full-Text Search:** Start simple, add semantic search (embeddings) in v2 if needed

---

## Development Environment

### Machines
- **MacBook Pro** - Primary development
- **Mac Mini** - Secondary development
- **Sync:** iCloud, GitHub, portable SSDs

### Prerequisites
- Node.js 20+ (LTS)
- pnpm (preferred) or npm
- Docker Desktop
- Git

### First-Time Setup

```bash
# Clone repository
git clone <repo-url> homelab-notebook
cd homelab-notebook

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your values (see Environment Variables section)

# Start development server
pnpm dev
```

Open http://localhost:3000

### IDE Setup (VS Code)

Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- GitLens

---

## Infrastructure & Hosting

### Deployment Target: VPS2

| Attribute | Value |
|-----------|-------|
| Hostname | srv993275.hstgr.cloud |
| IP | 31.97.131.163 |
| Specs | 2 cores, 8GB RAM, 100GB storage |
| OS | Ubuntu (Docker-ready via vps-ready skill) |
| Reverse Proxy | Caddy (installed, running) |
| SSH | Key-based auth, user "john" |

### Remote Services (on VPS8)

| Service | URL | Purpose |
|---------|-----|---------|
| Supabase | https://supabase.haugaard.dev | Database, Auth, Storage |
| Ollama | https://ollama.haugaard.dev | AI tagging, embeddings |

### Domain

- **URL:** https://notebook.haugaard.dev
- **DNS:** Cloudflare (gray cloud - direct to VPS2)
- **SSL:** Caddy auto-provisions via Let's Encrypt

### Network Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           INTERNET                                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│            VPS2               │   │            VPS8               │
│   (srv993275.hstgr.cloud)     │   │     (Homelab Services)        │
│                               │   │                               │
│  ┌─────────┐  ┌────────────┐  │   │  ┌─────────┐  ┌─────────┐    │
│  │  Caddy  │─▶│  Homelab   │  │   │  │ Supabase│  │ Ollama  │    │
│  │         │  │  Notebook  │──┼───┼─▶│  (DB,   │  │ (AI/LLM)│    │
│  └─────────┘  │ (Next.js)  │  │   │  │  Auth)  │  └─────────┘    │
│               └────────────┘  │   │  └─────────┘                  │
│                               │   │                               │
│  notebook.haugaard.dev        │   │  supabase.haugaard.dev        │
│                               │   │  ollama.haugaard.dev          │
└───────────────────────────────┘   └───────────────────────────────┘
```

---

## Development Workflow

### Git Branching

- **main** - Production-ready code, deploys to VPS2
- **dev** - Active development branch
- Feature branches from dev: `feature/add-search`, `fix/tag-normalization`

### Commit Convention

```
type(scope): description

feat(search): add full-text search for notes
fix(auth): handle expired session gracefully
docs(readme): update deployment instructions
refactor(api): extract tag generation to service
test(notes): add unit tests for CRUD operations
chore(deps): update Next.js to 15.1
```

### Development Cycle

1. Create feature branch from dev
2. Implement feature with tests
3. Run `pnpm lint && pnpm test`
4. Create PR to dev
5. After review, merge to dev
6. Periodically merge dev to main for deployment

---

## Code Conventions

### File Organization

```
homelab-notebook/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth-required routes (grouped)
│   │   │   ├── research/       # Research mode pages
│   │   │   ├── project/        # Project mode pages
│   │   │   └── reference/      # Reference mode pages
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── [feature]/          # Feature-specific components
│   ├── lib/
│   │   ├── supabase/           # Supabase client config
│   │   ├── ollama/             # Ollama client config
│   │   └── utils.ts            # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # Global styles
├── tests/
│   ├── unit/                   # Vitest unit tests
│   └── e2e/                    # Playwright e2e tests
├── docs/                       # Project documentation
├── public/                     # Static assets
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production deployment
├── Dockerfile                  # Production image
└── Docs/                       # Workflow handoff documents
```

### Naming Conventions

- **Files:** kebab-case (`note-editor.tsx`, `use-search.ts`)
- **Components:** PascalCase (`NoteEditor`, `SearchBar`)
- **Functions/Variables:** camelCase (`getNotes`, `isLoading`)
- **Constants:** SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces:** PascalCase (`Note`, `SearchResult`)

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Prefer named exports over default exports
- Use async/await over .then() chains
- Extract complex logic into custom hooks or utility functions

---

## Common Commands

### Development

```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server locally
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Run Prettier
pnpm typecheck        # Run TypeScript compiler check
```

### Testing

```bash
pnpm test             # Run Vitest unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
pnpm test:e2e         # Run Playwright e2e tests
pnpm test:e2e:ui      # Run Playwright with UI
```

### Docker (Local Development)

```bash
docker compose up -d          # Start local environment
docker compose down           # Stop local environment
docker compose logs -f        # View logs
docker compose build          # Rebuild images
```

### Docker (Production - VPS2)

```bash
# SSH to VPS2
ssh john@31.97.131.163

# Deploy
cd ~/homelab-notebook
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Rollback
git checkout <previous-commit>
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

---

## Environment Variables

### Required Variables

```bash
# Supabase (Remote - VPS8)
NEXT_PUBLIC_SUPABASE_URL=https://supabase.haugaard.dev
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Ollama (Remote - VPS8)
OLLAMA_BASE_URL=https://ollama.haugaard.dev

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or https://notebook.haugaard.dev in prod
```

### Optional Variables

```bash
# Development
NODE_ENV=development

# Logging
LOG_LEVEL=debug
```

**Security Notes:**
- Never commit `.env.local` or `.env` files
- Use different keys for development and production
- Service role key is server-side only (never expose to client)

---

## Project-Specific Notes

### Database Schema (Planned)

```sql
-- Core tables
notes (id, title, content, mode, created_at, updated_at)
tags (id, name, normalized_name)
note_tags (note_id, tag_id)
projects (id, name, description, status)
note_projects (note_id, project_id)
resources (id, url, title, description, note_id)
files (id, note_id, storage_path, filename, mime_type)
```

### AI Integration Patterns

**Auto-Tagging Flow:**
1. User creates/updates note
2. Server Action calls Ollama API
3. Ollama analyzes content, suggests tags
4. Tags normalized and saved
5. User can edit/remove suggestions

**Ollama API Call:**
```typescript
const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3.2:3b',
    prompt: `Extract technology tags from: ${content}`,
    stream: false
  })
});
```

### File Storage Strategy (Hybrid)

**Supabase Storage** - Small, frequently-accessed files:
- Screenshots, images attached to notes
- Small PDFs, code snippets
- Benefits from Supabase Auth integration (RLS policies)

**Backblaze B2** - Large files and archival:
- Large PDFs, video tutorials
- Backup/archival storage
- Cost-effective for infrequent access
- Access via S3-compatible API (credentials in .env)

Implementation note: Configure this during Step 7 (Note CRUD with file uploads).

### Search Implementation

**Phase 1 (v1):** PostgreSQL full-text search
- tsvector columns on notes.title and notes.content
- pg_trgm for fuzzy matching
- Combined with tag filtering

**Phase 2 (v2):** Semantic search
- Generate embeddings via nomic-embed-text
- Store in pgvector column
- Hybrid: full-text + semantic ranking

---

## Deployment

### Production Checklist

- [ ] Environment variables set in `.env` on VPS2
- [ ] Database migrations run on Supabase
- [ ] Caddy configured for notebook.haugaard.dev
- [ ] Docker image built and running
- [ ] SSL certificate provisioned
- [ ] Health check endpoint responding

### Caddy Configuration (VPS2)

Add to Caddyfile:
```
notebook.haugaard.dev {
    reverse_proxy localhost:3000
}
```

Then reload: `sudo systemctl reload caddy`

### Rollback Procedure

```bash
# On VPS2
cd ~/homelab-notebook
docker compose -f docker-compose.prod.yml down
git log --oneline -5  # Find previous good commit
git checkout <commit-hash>
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

---

## Resources & References

### Project Documents
- [Project Brief](Docs/homelab-notebook-brief.md)
- [Tech Stack Decision](Docs/tech-stack-decision-final.md)
- [Deployment Strategy](.docs/deployment-strategy.md)

### External Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Learning Resources
- [Next.js App Router Tutorial](https://nextjs.org/learn)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## Troubleshooting

### Common Issues

**"Cannot connect to Supabase"**
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Verify Supabase is running on VPS8
- Check network connectivity between VPS2 and VPS8

**"Ollama request timeout"**
- Ollama may be loading model on first request (can take 30-60s)
- Check Ollama is running: `curl https://ollama.haugaard.dev/api/tags`
- Verify model is pulled: `llama3.2:3b`

**"Docker build fails"**
- Check Node.js version in Dockerfile matches local
- Clear Docker cache: `docker builder prune`
- Check for missing dependencies in package.json

**"Hydration mismatch" errors**
- Usually caused by Server/Client Component boundary issues
- Ensure dynamic content uses `use client` directive
- Check for browser-only APIs in Server Components

---

## Next Steps (Guided Setup)

You now have the project foundation. Complete the setup by asking Claude Code to build out the structure step-by-step.

### Learning Philosophy

Each step teaches about a specific part of the stack. Take your time, review what gets created, ask questions about why things are structured this way.

---

### Step 1: Initialize Next.js Project Structure

**What you'll learn:** How Next.js 15 projects are organized, App Router structure, TypeScript configuration

**Say to Claude Code:**
```
Initialize the Next.js 15 project with TypeScript, Tailwind CSS, and the App Router.
Set up the basic file structure as specified in CLAUDE.md.
Please explain the purpose of each major configuration file.
```

**What will be created:**
- package.json with dependencies
- tsconfig.json (TypeScript config)
- next.config.ts (Next.js config)
- tailwind.config.ts + postcss.config.mjs
- src/app/layout.tsx (root layout)
- src/app/page.tsx (landing page)
- Basic directory structure

**Verification:** `pnpm dev` should start server at http://localhost:3000

---

### Step 2: Set Up Supabase Client

**What you'll learn:** How to configure Supabase for Next.js, Server vs Client components, environment variables

**Say to Claude Code:**
```
Set up the Supabase client configuration for both Server Components and Client Components.
Create the client files in src/lib/supabase/ as specified in CLAUDE.md.
Explain the difference between the server and client configurations.
```

**What will be created:**
- src/lib/supabase/client.ts (browser client)
- src/lib/supabase/server.ts (server client)
- Type definitions for Supabase

**Verification:** Can import clients without errors

---

### Step 3: Configure Ollama Client

**What you'll learn:** How to call external AI APIs from Next.js, API route patterns

**Say to Claude Code:**
```
Create the Ollama client configuration in src/lib/ollama/.
Include a helper function for generating tags from content.
Explain how we'll call this from Server Actions.
```

**What will be created:**
- src/lib/ollama/client.ts
- Type definitions for Ollama responses
- Tag generation helper function

**Verification:** TypeScript compiles without errors

---

### Step 4: Add shadcn/ui Components

**What you'll learn:** Component library integration, Tailwind theming, reusable UI patterns

**Say to Claude Code:**
```
Initialize shadcn/ui and add these base components: Button, Input, Card, Dialog, Textarea.
Set up the components in src/components/ui/.
Explain how shadcn/ui differs from traditional component libraries.
```

**What will be created:**
- components.json (shadcn config)
- src/components/ui/*.tsx (base components)
- Updated tailwind.config.ts with shadcn presets
- src/lib/utils.ts (cn helper)

**Verification:** Components render correctly in browser

---

### Step 5: Create Database Schema

**What you'll learn:** PostgreSQL schema design, Supabase migrations, Row Level Security

**Say to Claude Code:**
```
Design and create the database schema for notes, tags, projects, and resources.
Generate Supabase migration files.
Explain the relationships and why we structure it this way.
Include RLS policies for single-user security.
```

**What will be created:**
- supabase/migrations/*.sql
- Database schema documentation
- RLS policies

**Verification:** Migrations run successfully on Supabase

---

### Step 6: Implement Authentication

**What you'll learn:** Supabase Auth patterns, protected routes, middleware in Next.js

**Say to Claude Code:**
```
Implement authentication using Supabase Auth with email/password.
Create login and signup pages, plus middleware for protected routes.
Explain how Next.js middleware works for auth protection.
```

**What will be created:**
- src/app/(auth)/login/page.tsx
- src/app/(auth)/signup/page.tsx
- src/middleware.ts
- Auth utility functions

**Verification:** Can register, login, and access protected routes

---

### Step 7: Build Note CRUD Operations

**What you'll learn:** Server Actions, form handling, optimistic updates, data fetching patterns

**Say to Claude Code:**
```
Create CRUD operations for notes using Server Actions.
Build a simple note list and editor interface.
Include AI auto-tagging when saving notes.
Explain Server Actions vs API routes.
```

**What will be created:**
- src/app/(auth)/notes/page.tsx
- src/app/(auth)/notes/[id]/page.tsx
- src/components/notes/*.tsx
- Server Actions for note operations

**Verification:** Can create, read, update, delete notes with auto-tagging

---

### Step 8: Implement Search

**What you'll learn:** PostgreSQL full-text search, search UI patterns, debouncing

**Say to Claude Code:**
```
Implement full-text search across notes using PostgreSQL tsvector.
Create a search component with results display.
Explain how PostgreSQL full-text search works.
```

**What will be created:**
- Search API route or Server Action
- src/components/search/*.tsx
- Database functions for search

**Verification:** Search returns relevant results across notes

---

### Step 9: Add Three-Mode Interface

**What you'll learn:** Route organization, shared layouts, mode-specific UI

**Say to Claude Code:**
```
Implement the three-mode interface: Research, Project, Reference.
Create mode-specific pages and navigation.
Explain how to share layouts while having distinct modes.
```

**What will be created:**
- src/app/(auth)/research/*.tsx
- src/app/(auth)/project/*.tsx
- src/app/(auth)/reference/*.tsx
- Navigation component
- Mode-specific layouts

**Verification:** Can navigate between modes, create mode-specific notes

---

### Step 10: Set Up Testing

**What you'll learn:** Vitest configuration, testing React components, mocking Supabase

**Say to Claude Code:**
```
Set up Vitest for unit testing and write example tests for the note CRUD operations.
Explain testing patterns for Next.js Server Actions.
```

**What will be created:**
- vitest.config.ts
- tests/unit/*.test.ts
- Test utilities and mocks

**Verification:** `pnpm test` passes

---

### Step 11: Prepare Production Docker Setup

**What you'll learn:** Multi-stage Docker builds, production optimization, compose files

**Say to Claude Code:**
```
Review and finalize the Dockerfile and docker-compose.prod.yml for VPS2 deployment.
Explain multi-stage builds and production optimizations.
```

**What will be created:**
- Optimized Dockerfile
- docker-compose.prod.yml
- .dockerignore

**Verification:** `docker compose -f docker-compose.prod.yml build` succeeds

---

### You're Ready to Deploy!

After completing these steps, you'll have:
- Complete Next.js 15 project with TypeScript
- Supabase integration (auth, database, storage)
- Ollama integration for AI tagging
- Three-mode interface (Research, Project, Reference)
- Full-text search
- Unit tests
- Production-ready Docker configuration

**Next workflow phase:** Use `deploy-guide` skill when ready to deploy to VPS2.
