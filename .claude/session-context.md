# Session Context: Homelab Notebook

## Current Phase: Tech Stack Selection (Phase 1 of 3)

**Date:** 2025-01-13
**Mode:** LEARNING (declared in PROJECT-MODE.md)

---

## What We've Accomplished

### Phase 0: Project Brief 
- Created comprehensive project brief: [Docs/homelab-notebook-brief.md](Docs/homelab-notebook-brief.md)
- Defined three-mode system: Research / Project / Reference
- Established success criteria: < 30 second capture, 95%+ retrieval reliability
- Documented learning goals: full-stack development with AI integration
- Brainstormed initial concepts: [Docs/brainstorm.md](Docs/brainstorm.md)

### Phase 1: Tech Stack Advisory  (Pending Checkpoint)
- Analyzed project requirements against 4 viable tech stacks
- **Primary Recommendation:** Next.js 15 + Supabase + Ollama
  - Full-stack JavaScript (React + API routes)
  - Uses self-hosted infrastructure ($0 marginal cost)
  - 3-4 week learning curve, 2-3 week MVP timeline
  - Excellent AI/LLM integration, rich UI capabilities
- **Alternatives Analyzed:**
  1. Laravel 11 + Livewire (rapid CRUD, server-side rendering)
  2. FastAPI + React (API-first, advanced AI features)
  3. SvelteKit + Supabase (simpler code, smaller ecosystem)
- **Ruled Out:** Wiki.js, WordPress, Django REST (wrong learning goals)
- Complete analysis: [Docs/tech-stack-decision.md](Docs/tech-stack-decision.md)

**Status:** Awaiting checkpoint questions (LEARNING mode requires comprehension verification before proceeding to deployment-advisor)

---

## Key Decisions Made

1. **Project Mode:** LEARNING (detailed exploration, checkpoints enabled)
2. **Tech Stack Direction:** Next.js + Supabase + Ollama (pending final confirmation)
3. **Infrastructure Strategy:** Leverage self-hosted VPS assets (Supabase, Ollama, PostgreSQL, Redis)
4. **Cost Target:** $0 marginal cost (use existing infrastructure)

---

## Next Steps

### Immediate (Before Phase 2)
- [ ] User reviews [Docs/tech-stack-decision.md](Docs/tech-stack-decision.md) for understanding
- [ ] User answers 5 checkpoint questions (or acknowledges skip with understanding)
- [ ] Finalize tech stack choice (confirm primary or select alternative)

### Phase 2: Deployment Strategy (deployment-advisor skill)
- [ ] Invoke deployment-advisor skill with chosen stack
- [ ] Analyze Docker vs PM2 vs other deployment options
- [ ] Plan VPS deployment architecture (Nginx, SSL, monitoring)
- [ ] Document deployment workflow

### Phase 3: Project Foundation (project-spinup skill)
- [ ] Invoke project-spinup skill
- [ ] Scaffold project structure
- [ ] Create personalized claude.md with project context
- [ ] Generate learning roadmap

### Infrastructure Buildout (User's Next Days)
- User will be working on infrastructure setup in parallel
- Project development will follow after infrastructure is ready

---

## Important Context for Future Sessions

**Self-Hosted Infrastructure Available:**
- Hostinger VPS (~$30-40/month)
- Supabase (self-hosted PostgreSQL + Auth + Storage)
- Ollama (local LLM - llama3.2, mistral)
- Redis (caching/queues)
- Nginx (reverse proxy)
- n8n (workflow automation)
- Backblaze B2 (file storage)

**Learning Goals:**
- Full-stack application development (frontend + backend)
- AI/LLM integration (prompt engineering, auto-tagging)
- Search system implementation (PostgreSQL full-text search)
- Self-hosted deployment (VPS, Docker, Nginx, SSL)
- Professional development practices (testing, git workflow, documentation)

**Project Constraints:**
- Single-user system (personal knowledge management)
- Desktop-focused (no mobile optimization for v1)
- Timeline: Flexible learning pace (weeks to months)
- Budget: $0 marginal cost (use existing infrastructure)

**Success Criteria:**
1. Capture friction minimized (< 30 seconds from idea to saved+tagged)
2. Retrieval reliability high (95%+ find rate on first search)
3. Single source of truth (replace scattered text files and notebooks)

---

## Files Created This Session

- [PROJECT-MODE.md](PROJECT-MODE.md) - Workflow mode declaration (LEARNING)
- [Docs/homelab-notebook-brief.md](Docs/homelab-notebook-brief.md) - Comprehensive project requirements
- [Docs/brainstorm.md](Docs/brainstorm.md) - Initial brainstorming notes
- [Docs/tech-stack-decision.md](Docs/tech-stack-decision.md) - Complete tech stack analysis with trade-offs

---

## Checkpoint Questions (LEARNING Mode - Pending)

When ready, user will answer 5 comprehension questions:
1. Why does Next.js fit this project specifically?
2. Key trade-off between Next.js vs Laravel?
3. When would you choose FastAPI instead?
4. What skill are you most excited to learn?
5. How does this leverage your infrastructure?

**Note:** User is aware checkpoints are collaborative (not enforced), will answer when ready.

---

**Last Updated:** 2025-01-13
**Skills Workflow Progress:** Phase 1 of 3 (Tech Stack Advisory complete, pending checkpoint)
