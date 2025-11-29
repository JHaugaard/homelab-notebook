# Homelab Notebook

AI-enhanced knowledge management system with three integrated modes: Research, Project, and Reference.

## Overview

Homelab Notebook is a unified knowledge repository designed to minimize friction when capturing information during active learning and maximize reliability when retrieving it later.

**Three Modes:**

- **Research** - Capture and organize external resources (links, articles, tutorials)
- **Project** - Raw lab notebook during active work (code snippets, observations, checklists)
- **Reference** - Distilled, tutorial-style documentation

**Key Features:**

- AI-powered auto-tagging via Ollama
- Unified search across all content types
- Fast capture workflow (< 30 seconds)
- Markdown editing with code blocks
- File upload support

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router) + React 19 |
| Backend | Next.js API Routes + Server Actions |
| Database | PostgreSQL via Supabase (self-hosted) |
| Auth | Supabase Auth |
| AI/LLM | Ollama (llama3.2:3b) |
| Styling | Tailwind CSS + shadcn/ui |

## Prerequisites

- Node.js 20+ (LTS)
- pnpm (recommended) or npm
- Docker Desktop (optional, for containerized development)
- Access to Supabase instance
- Access to Ollama instance

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd homelab-notebook

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Ollama credentials

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run tests
pnpm typecheck    # TypeScript check
```

## Project Structure

```text
homelab-notebook/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities and clients
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript definitions
├── tests/             # Test files
├── docs/              # Project documentation
└── public/            # Static assets
```

## Deployment

This application deploys as a Docker container to VPS2, with Caddy as reverse proxy.

```bash
# Build production image
docker compose -f docker-compose.prod.yml build

# Deploy
docker compose -f docker-compose.prod.yml up -d
```

See [CLAUDE.md](CLAUDE.md) for detailed deployment instructions.

## Documentation

- [CLAUDE.md](CLAUDE.md) - Comprehensive project context and guided setup
- [Project Brief](Docs/homelab-notebook-brief.md) - Original requirements
- [Tech Stack Decision](Docs/tech-stack-decision-final.md) - Technology choices
- [Deployment Strategy](.docs/deployment-strategy.md) - Hosting approach

## License

Private project - All rights reserved.
