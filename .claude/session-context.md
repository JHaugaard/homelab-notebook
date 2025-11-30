# Session Context: Homelab Notebook

## Current Phase: Guided Setup Step 11 Complete (Production Docker)

**Date:** 2025-11-30
**Mode:** LEARNING (Guided Setup approach)

---

## What We've Accomplished

### Phase 0-3: Planning & Foundation (Complete)
- Created project brief, tech stack decision, deployment strategy
- Generated CLAUDE.md with 11-step guided setup
- Created Docker configuration and directory structure

### Guided Setup Progress (Steps 1-9 Complete)

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

#### Step 6: Authentication ✅
Implemented complete Supabase Auth with email/password:

**Server Actions (src/lib/auth/actions.ts):**
- `signUp()` - Creates account, sends confirmation email
- `signIn()` - Authenticates user, sets session cookies
- `signOut()` - Clears session, redirects to login
- `getUser()` - Helper to get current authenticated user

**Middleware Route Protection (src/lib/supabase/middleware.ts):**
- Updated with route protection logic
- Protected routes: /dashboard, /research, /project, /reference, /notes, /settings
- Redirects unauthenticated users from protected routes to /login
- Redirects authenticated users away from /login, /signup to /dashboard
- Preserves `redirectTo` parameter for post-login navigation

**Pages Created:**
- `/login` (src/app/login/page.tsx) - Login form with Suspense boundary
- `/signup` (src/app/signup/page.tsx) - Signup form with email confirmation message
- `/auth/callback` (src/app/auth/callback/route.ts) - Handles email confirmation code exchange (PKCE)

**Components Created:**
- `AuthForm` (src/components/auth/auth-form.tsx) - Reusable form for both login and signup
- `SignOutButton` (src/components/auth/sign-out-button.tsx) - Button that triggers signOut action

#### Step 7: Note CRUD Operations ✅
Implemented complete note management with Server Actions and AI auto-tagging:

**Server Actions (src/lib/notes/actions.ts):**
- `createNote()` - Create note with optional AI auto-tagging
- `getNote()` - Fetch single note with tags
- `listNotes()` - List notes with filtering (mode, project, tags)
- `updateNote()` - Update note, optionally re-generate tags
- `deleteNote()` - Delete note (cascade deletes tags)
- `addTagToNote()` - Manually add a tag
- `removeTagFromNote()` - Remove a tag from note

**Components Created (src/components/notes/):**
- `NoteList` - Displays notes with tags, mode badges, timestamps
- `NoteEditor` - Create/edit form with mode selection, tag management (updated with `defaultMode` prop)
- `ModeBadge` - Color-coded badge for Research/Project/Reference
- `TagBadge` - Displays tag with AI indicator

#### Step 8: Search Implementation ✅
Implemented full-text search using PostgreSQL tsvector:

**Server Actions (src/lib/search/actions.ts):**
- `searchNotes()` - Full-text search with filters (mode, project, tags)
- `quickSearch()` - Fast autocomplete for dropdown
- `searchTags()` - Fuzzy tag search with pg_trgm
- `getPopularTags()` - Get frequently used tags

**Components Created (src/components/search/):**
- `SearchBar` - Client component with debounced input (300ms), keyboard navigation, quick results dropdown
- `SearchResults` - Displays results with highlighted snippets from ts_headline()

#### Step 9: Three-Mode Interface ✅
Implemented dedicated mode pages with shared layout:

**Shared Navigation (src/components/navigation/):**
- `MainNav` - Sticky header with logo, mode tabs (Research/Project/Reference), user menu
- Mode tabs with active state highlighting using consistent colors
- Mobile-responsive with horizontal scrolling tabs
- Uses `usePathname()` to detect current route for active state

**(auth) Route Group Layout (src/app/(auth)/layout.tsx):**
- Wraps all protected pages with shared MainNav
- Auth check with redirect to login if not authenticated
- Passes user email to navigation component

**Mode-Specific Landing Pages:**
- `/research` (src/app/(auth)/research/page.tsx) - Purple themed, for external resources
- `/project` (src/app/(auth)/project/page.tsx) - Blue themed, for active work notes
- `/reference` (src/app/(auth)/reference/page.tsx) - Green themed, for polished guides
- Each shows notes filtered by mode, mode-specific empty states, search scoped to mode

**Mode-Specific New Note Pages:**
- `/research/new` - Pre-selects Research mode
- `/project/new` - Pre-selects Project mode
- `/reference/new` - Pre-selects Reference mode

**Updated Core Pages (moved to (auth) route group):**
- `/dashboard` - Uses shared layout, links to mode pages with colored cards
- `/notes` - Shows all notes across modes with mode filter tabs
- `/notes/[id]` - Breadcrumbs link back to note's mode page
- `/notes/new` - Generic new note (defaults to Project)

**Key Concepts:**
- Route Groups: Folders in parentheses `(auth)` don't affect URL but allow shared layouts
- Layout Hierarchy: Root → (auth) → Page, navigation persists across mode pages
- Consistent Color Coding: Research=Purple, Project=Blue, Reference=Green

#### Step 11: Production Docker Setup ✅
Prepared production-ready Docker configuration for VPS2 deployment:

**Files Created/Updated:**
- `src/app/api/health/route.ts` - Health check endpoint for Docker healthcheck
- `Dockerfile` - Added `curl` for health checks in production stage
- `.dockerignore` - Added `.claude/` and `supabase/.temp`

**Docker Configuration:**
- Multi-stage build: base → deps → development → builder → production
- Uses `node:20-alpine` for minimal image size (387MB final)
- Non-root user (`nextjs:nodejs`) in production
- Standalone output mode for optimized deployment
- Health check at `/api/health` returns JSON: `{status, timestamp, uptime}`

**docker-compose.prod.yml Features:**
- Health check: `curl -f http://localhost:3000/api/health`
- Logging with rotation: max 10MB, 3 files
- Auto-restart: `unless-stopped`
- Environment via `.env` file

**Verified:**
- `pnpm build` succeeds (creates standalone output)
- `docker compose -f docker-compose.prod.yml build` succeeds
- Container starts and health endpoint responds correctly
- Landing page returns HTTP 200

---

## Workflow Decision: Testing Deferred

**Decision:** Testing (Step 10) has been deferred until after Docker setup is complete.

**Rationale:**
1. More code to test - After Step 9, the application has substantial functionality
2. Clearer patterns - Testing the finalized application structure is more valuable
3. Avoid test rewrites - Docker setup may reveal issues that affect tests
4. test-orchestrator skill is explicitly marked "optional" and supports flexible entry

**Next Action:** Invoke `test-orchestrator` skill to set up testing infrastructure.

---

## Key Technical Details

### Route Groups (Parentheses Folders)
```
src/app/
├── (auth)/           # Route group - doesn't affect URL
│   ├── layout.tsx    # Shared layout for all routes inside
│   ├── dashboard/    # URL: /dashboard
│   ├── research/     # URL: /research
│   ├── project/      # URL: /project
│   ├── reference/    # URL: /reference
│   └── notes/        # URL: /notes
├── login/            # URL: /login (outside group, no shared layout)
└── signup/           # URL: /signup
```
The `(auth)` folder creates a logical grouping without adding to the URL path.

### Layout Hierarchy
```
Root Layout (fonts, global styles)
  └── (auth) Layout (MainNav, auth check)
        └── Page Content
```
Layouts wrap their children. The auth layout provides navigation that persists across all mode pages without re-rendering on navigation.

### Server Actions vs API Routes
| Aspect | Server Actions | API Routes |
|--------|---------------|------------|
| Syntax | Functions with `"use server"` | `/app/api/*/route.ts` files |
| Invocation | Direct function call | HTTP fetch request |
| Type Safety | Full TypeScript inference | Manual type definitions |
| Security | Automatic CSRF protection | Manual CSRF handling |
| Use Case | Internal React components | External consumers, webhooks |

### Authentication Flow
```
Signup:
User → signUp() → Supabase → Confirmation Email → /auth/callback → Session → /dashboard

Login:
User → signIn() → Supabase validates → Cookies set → Redirect to /dashboard

Protected Routes:
Request → Middleware → getUser() → No user? → Redirect to /login?redirectTo=...
```

### Auto-Tagging Flow
```
User saves note → Server Action → Save to DB (immediate) → Call Ollama → Parse tags →
Normalize & dedupe → Save to tags table → Link via note_tags → Return to user
```

### Search Flow
```
User types → Debounce (300ms) → quickSearch() → Dropdown results
User presses Enter → Navigate to /notes?q=... → searchNotes() → Full results with highlights
```

### Why getUser() not getSession()?
- `getUser()` validates JWT against Supabase servers (secure)
- `getSession()` only reads local cookie (can be forged)
- Always use `getUser()` on the server for security decisions

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

---

## Current Project Structure

```
homelab-notebook/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind + shadcn theme + search highlights
│   │   ├── layout.tsx           # Root layout (fonts)
│   │   ├── page.tsx             # Public landing page
│   │   ├── login/page.tsx       # Login page
│   │   ├── signup/page.tsx      # Signup page
│   │   ├── auth/callback/route.ts  # Email confirmation handler
│   │   └── (auth)/              # Route group for protected pages
│   │       ├── layout.tsx       # Shared layout with MainNav
│   │       ├── dashboard/page.tsx
│   │       ├── notes/
│   │       │   ├── page.tsx     # All notes list
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── research/
│   │       │   ├── page.tsx     # Research mode landing
│   │       │   └── new/page.tsx
│   │       ├── project/
│   │       │   ├── page.tsx     # Project mode landing
│   │       │   └── new/page.tsx
│   │       └── reference/
│   │           ├── page.tsx     # Reference mode landing
│   │           └── new/page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── auth-form.tsx
│   │   │   └── sign-out-button.tsx
│   │   ├── navigation/
│   │   │   ├── index.ts
│   │   │   └── main-nav.tsx     # Shared navigation with mode switcher
│   │   ├── notes/
│   │   │   ├── index.ts
│   │   │   ├── note-list.tsx
│   │   │   └── note-editor.tsx  # Updated with defaultMode prop
│   │   ├── search/
│   │   │   ├── index.ts
│   │   │   ├── search-bar.tsx
│   │   │   └── search-results.tsx
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── auth/actions.ts
│   │   ├── notes/actions.ts
│   │   ├── search/actions.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── ollama/
│   │   └── utils.ts
│   ├── types/
│   │   ├── database.ts
│   │   └── index.ts
│   └── middleware.ts
├── supabase/migrations/         # 7 SQL migration files
├── package.json
└── ... (configs)
```

---

## Next Steps

### Immediate: Testing Setup

Invoke the `test-orchestrator` skill to set up testing infrastructure.

### Guided Setup Steps Summary

| Step | Topic | Status |
|------|-------|--------|
| 1 | Next.js Project Structure | ✅ Complete |
| 2 | Supabase Client | ✅ Complete |
| 3 | Ollama Client | ✅ Complete |
| 4 | shadcn/ui Components | ✅ Complete |
| 5 | Database Schema | ✅ Complete |
| 6 | Authentication | ✅ Complete |
| 7 | Note CRUD + Auto-Tagging | ✅ Complete |
| 8 | Search | ✅ Complete |
| 9 | Three-Mode Interface | ✅ Complete |
| 10 | Testing | ⏭️ Deferred (invoke test-orchestrator) |
| 11 | Production Docker | ✅ Complete |

---

## Important Notes

### Mode Color Coding (Consistent Across App)
- **Research:** Purple (`bg-purple-100 text-purple-700`)
- **Project:** Blue (`bg-blue-100 text-blue-700`)
- **Reference:** Green (`bg-green-100 text-green-700`)

Used in: Navigation tabs, mode badges, buttons, empty state icons

### ⚠️ Required Migration for Search
Before testing search, ensure migration `00007_create_search_functions.sql` is applied.

### Dependencies Installed
- Next.js 15.1.3, React 19.0.0
- @supabase/supabase-js, @supabase/ssr
- Tailwind CSS 3.4.17
- shadcn/ui (new-york style) with Radix primitives
- class-variance-authority, clsx, tailwind-merge
- date-fns (for timestamp formatting)
- Vitest, Playwright (for testing - not yet configured)

### Environment Variables Needed
See .env.example - requires:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OLLAMA_BASE_URL
- NEXT_PUBLIC_APP_URL (used for email confirmation redirects)

### TypedRoutes Workaround
Next.js's experimental `typedRoutes` feature requires static href values.
For dynamic routes, we cast to `Route<string>` type:
```typescript
const modeLinks: Record<NoteMode, Route<string>> = {
  research: "/research" as Route<string>,
  project: "/project" as Route<string>,
  reference: "/reference" as Route<string>,
};
```

---

**Last Updated:** 2025-11-30
**Next Action:** Invoke test-orchestrator skill for testing setup
