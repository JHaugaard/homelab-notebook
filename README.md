# Homelab Notebook

A lightweight personal knowledge management app for organizing homelab resources, code snippets, project ideas, and learning materials.

## Features

- **Quick Capture**: Add URLs, code snippets, or markdown notes in seconds
- **Instant Search**: Client-side fuzzy search for zero-latency filtering
- **Flexible Organization**: Tags and collections without rigid hierarchy
- **Syntax Highlighting**: CodeMirror 6 for code snippets
- **Mobile Responsive**: Capture ideas on the go

## Tech Stack

- **Frontend**: SvelteKit + Tailwind CSS
- **Backend**: PocketBase (Auth, Database, API)
- **Search**: FlexSearch.js (client-side)
- **Editor**: CodeMirror 6

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm

### Development Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Start PocketBase
docker compose up -d pocketbase

# Start development server
pnpm dev
```

Open http://localhost:5173 to see the app.

### PocketBase Setup

1. Open http://localhost:8090/_/ to access PocketBase admin
2. Create an admin account
3. Create the following collections:
   - `notes` (type, title, content, url, language, tags, collection_id)
   - `tags` (name, color)
   - `collections` (name, description)

See `CLAUDE.md` for detailed schema information.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
```

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/          # Generic UI components
│   │   └── features/    # Feature components
│   ├── stores/          # Svelte stores
│   ├── utils/           # Helper functions
│   └── types/           # TypeScript types
├── routes/              # SvelteKit routes
tests/                   # Test files
```

## Deployment

See `CLAUDE.md` for deployment instructions to Hostinger VPS.

## License

MIT
