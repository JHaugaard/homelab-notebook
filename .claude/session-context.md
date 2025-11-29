# Session Context: Homelab Notebook

## Current Phase: Guided Setup Step 6 (Authentication)

**Date:** 2025-11-29
**Mode:** LEARNING (Guided Setup approach)

---

## What We've Accomplished

### Phase 0-3: Planning & Foundation (Complete)
- Created project brief, tech stack decision, deployment strategy
- Generated CLAUDE.md with 11-step guided setup
- Created Docker configuration and directory structure

### Guided Setup Progress (Steps 1-5 Complete)

#### Step 1: Next.js Project Structure ✅
- Initialized Next.js 15 with React 19, TypeScript, Tailwind CSS
- Created package.json with all dependencies
- Set up tsconfig.json with path aliases (`@/*` → `./src/*`)
- Created next.config.ts with standalone output for Docker
- Configured Tailwind, PostCSS, ESLint (flat config), Prettier
- Created root layout.tsx and landing page.tsx
- Added src/lib/utils.ts with cn() helper

#### Step 2: Supabase Client ✅
- Installed @supabase/supabase-js and @supabase/ssr
- Created browser client (src/lib/supabase/client.ts)
- Created server client (src/lib/supabase/server.ts)
- Created middleware for session refresh (src/middleware.ts)
- Added TypeScript types placeholder (src/types/database.ts)

#### Step 3: Ollama Client ✅
- Created Ollama client class (src/lib/ollama/client.ts)
- Created tag generation helper (src/lib/ollama/tags.ts)
- Added TypeScript types for API responses (src/lib/ollama/types.ts)
- Includes fallback tag extraction when Ollama unavailable

#### Step 4: shadcn/ui Components ✅
- Initialized shadcn/ui with CLI (new-york style)
- Added components: Button, Input, Card, Dialog, Textarea
- Updated globals.css with theme variables (light/dark mode ready)
- Updated landing page to use shadcn/ui components

#### Step 5: Database Schema ✅
Created 7 migration files in supabase/migrations/:
- 00001_create_notes_table.sql - Core notes with full-text search
- 00002_create_tags_tables.sql - Tags + note_tags junction
- 00003_create_projects_tables.sql - Projects + note_projects junction
- 00004_create_resources_table.sql - External links/resources
- 00005_create_files_table.sql - File attachment metadata
- 00006_create_rls_policies.sql - Row Level Security
- 00007_create_search_functions.sql - Search functions + pg_trgm

Updated src/types/database.ts with complete types matching schema.

---

## Key Technical Details

### Database Schema Overview
```
users (auth.users)
  │
  ├── notes (research/project/reference modes)
  │     ├── resources (external links)
  │     ├── files (attachments)
  │     └── note_tags ←→ tags
  │
  └── projects
        └── note_projects ←→ notes
```

### RLS Policies
All tables have Row Level Security enabled:
- Users can only SELECT/INSERT/UPDATE/DELETE their own rows
- Junction tables check parent ownership
- Prevents data access even with anon key

### Search Capabilities
- PostgreSQL full-text search (tsvector + GIN index)
- pg_trgm for fuzzy matching (typo tolerance)
- Three RPC functions: search_notes, quick_search_notes, search_tags

---

## Current Project Structure

```
homelab-notebook/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind + shadcn theme
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client
│   │   │   └── middleware.ts    # Session refresh
│   │   ├── ollama/
│   │   │   ├── index.ts
│   │   │   ├── client.ts        # API client
│   │   │   ├── tags.ts          # Tag generation
│   │   │   └── types.ts
│   │   └── utils.ts             # cn() helper
│   ├── hooks/                   # (empty, ready for custom hooks)
│   ├── types/
│   │   ├── database.ts          # Supabase types
│   │   └── index.ts             # App types
│   └── middleware.ts            # Next.js middleware entry
├── supabase/
│   └── migrations/              # 7 SQL migration files
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── components.json              # shadcn/ui config
└── ... (Docker, env, etc.)
```

---

## Next Steps

### Immediate: Step 6 - Authentication
Implement Supabase Auth with email/password:
- Login and signup pages
- Middleware for protected routes
- Auth utility functions

**Say to Claude Code:**
```
Implement authentication using Supabase Auth with email/password.
Create login and signup pages, plus middleware for protected routes.
Explain how Next.js middleware works for auth protection.
```

### Remaining Guided Setup Steps
| Step | Topic | Status |
|------|-------|--------|
| 1 | Next.js Project Structure | ✅ Complete |
| 2 | Supabase Client | ✅ Complete |
| 3 | Ollama Client | ✅ Complete |
| 4 | shadcn/ui Components | ✅ Complete |
| 5 | Database Schema | ✅ Complete |
| 6 | Authentication | ⏭️ Next |
| 7 | Note CRUD + File Uploads | Pending |
| 8 | Search | Pending |
| 9 | Three-Mode Interface | Pending |
| 10 | Testing | Pending |
| 11 | Production Docker | Pending |

---

## Important Notes

### Before Running Migrations
The migration files are created but NOT yet applied. To apply:
1. Via Supabase Dashboard SQL Editor (paste each file)
2. Or via CLI: `npx supabase db push`

### Dependencies Installed
- Next.js 15.1.3, React 19.0.0
- @supabase/supabase-js, @supabase/ssr
- Tailwind CSS 3.4.17
- shadcn/ui (new-york style) with Radix primitives
- class-variance-authority, clsx, tailwind-merge
- Vitest, Playwright (for testing)

### Environment Variables Needed
See .env.example - requires:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OLLAMA_BASE_URL

---

**Last Updated:** 2025-11-29
**Next Action:** Step 6 - Implement Authentication
