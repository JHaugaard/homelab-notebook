# Session Context: Homelab Notebook

## Current Phase: Guided Setup Step 8 (Search)

**Date:** 2025-11-29
**Mode:** LEARNING (Guided Setup approach)

---

## What We've Accomplished

### Phase 0-3: Planning & Foundation (Complete)
- Created project brief, tech stack decision, deployment strategy
- Generated CLAUDE.md with 11-step guided setup
- Created Docker configuration and directory structure

### Guided Setup Progress (Steps 1-7 Complete)

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
- `/dashboard` (src/app/dashboard/page.tsx) - Protected page with user info and sign-out

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
- `NoteEditor` - Create/edit form with mode selection, tag management
- `ModeBadge` - Color-coded badge for Research/Project/Reference
- `TagBadge` - Displays tag with AI indicator

**Pages Created:**
- `/notes` (src/app/notes/page.tsx) - Note list with mode filtering tabs
- `/notes/new` (src/app/notes/new/page.tsx) - New note creation page
- `/notes/[id]` (src/app/notes/[id]/page.tsx) - Note detail/edit page

**Dashboard Updated (src/app/dashboard/page.tsx):**
- Shows recent notes with tags
- Quick "New Note" button
- Mode cards now link to filtered note views

**Key Concepts Explained:**
- Server Actions vs API Routes (when to use each)
- Why Server Actions are preferred for internal React components
- Auto-tagging flow with Ollama integration

---

## Key Technical Details

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
│   │   ├── page.tsx             # Landing page
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts     # Email confirmation handler
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Protected dashboard with recent notes
│   │   └── notes/
│   │       ├── page.tsx         # Notes list with filtering
│   │       ├── new/
│   │       │   └── page.tsx     # New note page
│   │       └── [id]/
│   │           └── page.tsx     # Note detail/edit page
│   ├── components/
│   │   ├── auth/
│   │   │   ├── auth-form.tsx    # Reusable login/signup form
│   │   │   └── sign-out-button.tsx
│   │   ├── notes/
│   │   │   ├── index.ts         # Barrel exports
│   │   │   ├── note-list.tsx    # Note list component
│   │   │   └── note-editor.tsx  # Note create/edit form
│   │   └── ui/                  # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   ├── auth/
│   │   │   └── actions.ts       # signIn, signUp, signOut, getUser
│   │   ├── notes/
│   │   │   └── actions.ts       # CRUD + tag operations
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client
│   │   │   └── middleware.ts    # Session refresh + route protection
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

### Immediate: Step 8 - Search Implementation
Implement full-text search across notes:
- Search component with debounced input
- Use PostgreSQL tsvector (already set up in schema)
- Results display with highlighting

**Say to Claude Code:**
```
Implement full-text search across notes using PostgreSQL tsvector.
Create a search component with results display.
Explain how PostgreSQL full-text search works.
```

### Remaining Guided Setup Steps
| Step | Topic | Status |
|------|-------|--------|
| 1 | Next.js Project Structure | ✅ Complete |
| 2 | Supabase Client | ✅ Complete |
| 3 | Ollama Client | ✅ Complete |
| 4 | shadcn/ui Components | ✅ Complete |
| 5 | Database Schema | ✅ Complete |
| 6 | Authentication | ✅ Complete |
| 7 | Note CRUD + Auto-Tagging | ✅ Complete |
| 8 | Search | ⏭️ Next |
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
- date-fns (for timestamp formatting)
- Vitest, Playwright (for testing)

### Environment Variables Needed
See .env.example - requires:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OLLAMA_BASE_URL
- NEXT_PUBLIC_APP_URL (used for email confirmation redirects)

### Testing Notes CRUD
To verify notes work:
1. Run `pnpm dev`
2. Log in at `/login`
3. Visit `/notes` → Should show empty state
4. Click "New Note" → Create a note
5. Note should appear in list with AI-generated tags
6. Click note to edit, add/remove tags
7. Delete note and verify it's removed

### TypedRoutes Workaround
Next.js's experimental `typedRoutes` feature requires static href values.
For dynamic routes like `/notes/[id]`, we use `<a>` tags or `window.location`
instead of Next.js `<Link>` to bypass the type checker.

---

**Last Updated:** 2025-11-29
**Next Action:** Step 8 - Search Implementation
