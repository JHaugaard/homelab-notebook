# Homelab Notebook

AI-enhanced knowledge management system with three integrated modes: Research, Project, and Reference.

## Project Overview

- **Stack:** Next.js 15 + Supabase + Ollama
- **Mode:** LEARNING (education priority, flexible timeline)
- **Infrastructure:** Self-hosted on VPS8 (haugaard.dev)

## Key Documents

- **Project Brief:** [Docs/homelab-notebook-brief.md](Docs/homelab-notebook-brief.md)
- **Tech Stack Decision:** [Docs/tech-stack-decision-final.md](Docs/tech-stack-decision-final.md)
- **Infrastructure Reference:** [.claude/homelab-summary.xml](.claude/homelab-summary.xml)
- **Session Context:** [.claude/session-context.md](.claude/session-context.md)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router) + React 19 |
| Backend | Next.js API Routes + Server Actions |
| Database | PostgreSQL 15 via Supabase (self-hosted) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| AI/LLM | Ollama (llama3.2:3b, nomic-embed-text) |
| Styling | Tailwind CSS + shadcn/ui |
| Search | PostgreSQL full-text search (pg_trgm + tsvector) |
| Deployment | Docker + Caddy on VPS8 |

## Infrastructure

**VPS8 (Hostinger KVM 8):** 8 cores, 32GB RAM, 400GB storage

| Service | URL | Purpose |
|---------|-----|---------|
| Supabase | supabase.haugaard.dev | Database, Auth, Storage |
| Ollama | ollama.haugaard.dev | AI tagging, embeddings |
| Caddy | - | Reverse proxy, HTTPS |

## External Resources

- Shared assets: [placeholder]
- Design files: [placeholder]

## Skill Location

When there is a specific reference to a Claude Skill, or the context indicates that a Claude Skill should be invoked, note that all skills used in this project are personal skills and located at: /Users/john/.claude/skills

## Workflow Status

**Current Phase:** Tech Stack Selection complete, ready for deployment-advisor

**Skills Workflow:**
1. project-brief-writer - Complete
2. tech-stack-advisor - Complete
3. deployment-advisor - Next
4. project-spinup - Pending
5. test-orchestrator - Pending
6. deploy-guide - Pending
