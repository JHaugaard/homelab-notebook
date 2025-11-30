# Homelab Notebook

> A lightweight personal knowledge management app for organizing homelab resources, code snippets, project ideas, and learning materials.

**Status**: Active Development | **Developer**: John | **Philosophy**: Delivery-Focused, Best Practices

---

## Developer Profile

- **Experience**: Hobbyist developer, beginner-to-intermediate
- **Learning Goal**: Deep understanding of full-stack, professional practices
- **Reliance**: Heavy use of Claude Code for implementation
- **Common Tasks**: Feature implementation, debugging, refactoring, testing, deployment

---

## Project Overview

### What It Does
Homelab Notebook is a high-speed digital filing cabinet for technical knowledge. Users can instantly "dump" information (URLs, code snippets, markdown notes) and rely on powerful search and flexible tagging to retrieve it later.

### Core Features
- **Quick Capture**: < 5 seconds from opening app to saving entry
- **Flexible Organization**: Tags and collections without rigid hierarchy
- **Instant Search**: Client-side fuzzy search with FlexSearch.js
- **Content Types**: URLs (auto-fetch metadata), code snippets (syntax highlighting), markdown notes

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | **SvelteKit** | Fast hydration, built-in routing, excellent DX |
| Backend | **PocketBase** | Auth, database (SQLite), API in single binary |
| Styling | **Tailwind CSS v4** | Utility-first CSS for rapid iteration |
| Search | **FlexSearch.js** | Client-side instant fuzzy search |
| Code Editor | **CodeMirror 6** | Syntax highlighting for snippets |
| Icons | **Lucide Svelte** | Lightweight, consistent icon set |

### Architecture Decisions
- **Client-side search**: All note metadata loaded on startup, indexed with FlexSearch for 0ms search latency
- **Single-user**: No complex auth; simple PocketBase auth for access control
- **Docker-first**: Both dev and prod run in containers for consistency

---

## Development Environment

### Computers & Sync
- MacBook Pro and Mac Mini
- Sync via iCloud, portable SSDs, GitHub

### Prerequisites
- Node.js 20+ (via nvm recommended)
- Docker & Docker Compose
- pnpm (preferred package manager)

### First-Time Setup

```bash
# Clone and install
cd homelab-notebook-alt
pnpm install

# Copy environment file
cp .env.example .env.local

# Start PocketBase (local dev instance)
docker compose up -d pocketbase

# Run development server
pnpm dev
```

Open http://localhost:5173 to see the app.

### IDE Setup
- VS Code with extensions: Svelte for VS Code, Tailwind CSS IntelliSense, ESLint, Prettier

---

## Infrastructure & Hosting

### Self-Hosted Infrastructure (Hostinger VPS8)
- **VPS**: 8 cores, 32GB RAM, 400GB storage
- **Domain**: haugaard.dev
- **Reverse Proxy**: Caddy with automatic HTTPS
- **Docker Network**: homelab-net

### Available Backend Services
| Service | URL | Purpose |
|---------|-----|---------|
| Supabase | supabase.haugaard.dev | PostgreSQL, Auth (not used for this project) |
| PocketBase | pocketbase.haugaard.dev | Backend for this project |
| n8n | n8n.haugaard.dev | Workflow automation |
| Ollama | ollama.haugaard.dev | Local LLM inference |

### Project-Specific Hosting
- **Production URL**: notebook.haugaard.dev
- **Backend**: Existing PocketBase instance (pocketbase:8090 internal)
- **Frontend**: SvelteKit container on homelab-net

---

## Development Workflow

### Git Branching
- `main`: Production-ready code
- `dev`: Active development branch
- Feature branches: `feature/descriptive-name`

### Commit Convention
```
type(scope): description

feat(search): add fuzzy matching with FlexSearch
fix(capture): resolve paste formatting issues
chore(deps): update SvelteKit to latest
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Development Cycle
1. Create feature branch from `dev`
2. Implement with tests
3. PR to `dev`, squash merge
4. Periodic releases: `dev` → `main`

### Testing Strategy
- **Unit**: Vitest for utilities and stores
- **Component**: Svelte Testing Library
- **E2E**: Playwright (when needed)

---

## Code Conventions

### File Organization
```
src/
├── lib/
│   ├── components/
│   │   ├── ui/          # Generic UI components (Button, Input, Modal)
│   │   └── features/    # Feature-specific components (NoteCard, SearchBar)
│   ├── stores/          # Svelte stores (notes, search, ui)
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   └── server/          # Server-only code (PocketBase admin)
├── routes/
│   ├── (app)/           # App routes (protected)
│   └── api/             # API routes if needed
tests/
docs/
static/
```

### Naming Conventions
- Components: PascalCase (`NoteCard.svelte`)
- Files: kebab-case (`note-utils.ts`)
- Functions: camelCase (`formatDate()`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_TITLE_LENGTH`)
- Types: PascalCase (`NoteEntry`)

### Code Style
- ESLint + Prettier for formatting
- Explicit types (avoid `any`)
- Prefer composition over inheritance
- Small, focused functions

---

## Common Commands

### Development
```bash
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm check            # Run svelte-check
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
```

### Testing
```bash
pnpm test             # Run Vitest
pnpm test:ui          # Vitest with UI
pnpm test:coverage    # Generate coverage report
```

### Docker
```bash
docker compose up -d              # Start all services
docker compose up -d pocketbase   # Start only PocketBase
docker compose logs -f            # Follow logs
docker compose down               # Stop services
```

### Database (PocketBase)
```bash
# Access PocketBase admin UI
open http://localhost:8090/_/

# Backup database (from container)
docker compose exec pocketbase cp /pb/pb_data/data.db /pb/pb_data/backup.db
```

---

## Project-Specific Notes

### PocketBase Collections

**notes** (main content collection)
| Field | Type | Notes |
|-------|------|-------|
| id | string | Auto-generated |
| type | select | 'url', 'snippet', 'note' |
| title | string | Required |
| content | text | Markdown or code |
| url | url | For URL type entries |
| language | string | For snippets (syntax highlighting) |
| tags | relation | Many-to-many with tags collection |
| collection_id | relation | Optional grouping |
| created | datetime | Auto |
| updated | datetime | Auto |

**tags**
| Field | Type | Notes |
|-------|------|-------|
| id | string | Auto-generated |
| name | string | Unique, lowercase |
| color | string | Hex color for UI |

**collections** (groupings)
| Field | Type | Notes |
|-------|------|-------|
| id | string | Auto-generated |
| name | string | Required |
| description | text | Optional |

### Environment Variables

```bash
# .env.local (development)
PUBLIC_POCKETBASE_URL=http://localhost:8090

# Production (set in Docker or hosting)
PUBLIC_POCKETBASE_URL=https://pocketbase.haugaard.dev
```

### Authentication Flow
1. User visits app → redirected to login if not authenticated
2. PocketBase handles auth (email/password for single user)
3. Auth token stored in cookie (httpOnly)
4. All API requests include auth token

### Search Implementation
1. On app load, fetch all notes metadata (id, title, tags, type)
2. Build FlexSearch index on client
3. Search queries filter locally (0ms latency)
4. Full note content fetched on selection

---

## Deployment

### Deployment Workflow
1. Push to `main` branch
2. SSH to VPS: `ssh john@72.60.27.146`
3. Pull and rebuild:
   ```bash
   cd ~/homelab-notebook
   git pull
   docker compose up -d --build
   ```

### Deployment Checklist
- [ ] All tests passing locally
- [ ] Build succeeds (`pnpm build`)
- [ ] Environment variables set in production
- [ ] PocketBase collections configured
- [ ] Caddy routing configured

### Rollback Procedure
```bash
# On VPS
docker compose down
git checkout <previous-tag>
docker compose up -d --build
```

---

## Resources & References

### Project Docs
- [SvelteKit Docs](https://svelte.dev/docs/kit)
- [PocketBase Docs](https://pocketbase.io/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [FlexSearch](https://github.com/nextapps-de/flexsearch)
- [CodeMirror 6](https://codemirror.net/)

### Homelab Infrastructure
- Caddy config: `/etc/caddy/Caddyfile` on VPS
- Docker network: `homelab-net`
- Backups: Backblaze B2

---

## Troubleshooting

### PocketBase Connection Failed
```
Error: Failed to connect to PocketBase
```
**Solution**: Ensure PocketBase container is running: `docker compose up -d pocketbase`

### Tailwind Classes Not Working
**Solution**: Check that the file is included in `tailwind.config.ts` content paths

### Search Not Finding Results
**Solution**: FlexSearch index may be stale. Refresh the page to rebuild index.

### Build Fails with Type Errors
```bash
pnpm check  # See detailed type errors
```

---

## Skill Location

When there is a specific reference to a Claude Skill, or the context indicates that a Claude Skill should be invoked, note that all skills used in this project are personal skills and located at: /Users/john/.claude/skills
