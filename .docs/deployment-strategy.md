# Deployment Strategy: Homelab Notebook

**Date:** 2025-11-29
**Project:** Homelab Notebook - AI-Enhanced Knowledge Management System
**Mode:** LEARNING
**Status:** APPROVED - Ready for project-spinup
**Tech Stack:** [Docs/tech-stack-decision-final.md](../Docs/tech-stack-decision-final.md)
**Brief:** [Docs/homelab-notebook-brief.md](../Docs/homelab-notebook-brief.md)

---

## PRIMARY HOSTING RECOMMENDATION: VPS Docker (Self-Hosted)

Deploy the Next.js application as a Docker container on your existing VPS8, leveraging Supabase and Ollama services already running on the same host. Caddy handles HTTPS and reverse proxy routing.

### Why This Fits Your Project

- **Zero network latency to AI:** Next.js container communicates with Ollama via Docker network (sub-millisecond)
- **Database co-location:** Direct connection to self-hosted Supabase PostgreSQL
- **Unified infrastructure:** Single deployment target, consistent with existing services
- **Full control:** Debug, inspect, and modify any layer of the stack

### Why This Fits Your Infrastructure

- **Uses existing VPS8:** 8 cores, 32GB RAM has ample headroom for Next.js
- **Integrates with homelab-net:** Docker network already connects Supabase, Ollama, Caddy
- **Caddy already configured:** Just add a new site block for the notebook subdomain
- **B2 ready:** File storage can use Supabase Storage or new B2 bucket via S3-compatible API

### Hosting Details

| Aspect | Value |
|--------|-------|
| Provider | Hostinger VPS8 (existing) |
| Server Type | VPS with Docker |
| Container | Docker (standalone or Compose) |
| Database | Self-hosted PostgreSQL via Supabase |
| File Storage | Supabase Storage (or B2 bucket) |
| CDN | Cloudflare (DNS proxy) |
| SSL | Caddy (automatic Let's Encrypt) |
| Domain | notebook.haugaard.dev (suggested) |

---

## Deployment Workflow

### Initial Setup (One-time)

1. **Create subdomain DNS record**
   - Add `notebook` A record pointing to VPS8 IP in Cloudflare
   - Enable proxy (orange cloud) for DDoS protection

2. **Prepare Docker configuration**
   - Create `docker-compose.yml` for homelab-notebook
   - Configure environment variables (Supabase URL, Ollama URL, secrets)
   - Connect to `homelab-net` Docker network

3. **Configure Caddy**
   - Add site block for `notebook.haugaard.dev`
   - Reverse proxy to Next.js container port (e.g., 3000)
   - Caddy auto-provisions SSL certificate

4. **Database setup**
   - Create new database in Supabase for homelab-notebook
   - Run initial migrations
   - Configure Supabase Auth (email/password)

5. **Build and deploy**
   - Build Docker image locally or on VPS
   - Pull/run container
   - Verify application accessible via HTTPS

### Regular Deployment (Updates)

```bash
# On VPS8 (SSH as john)
cd ~/homelab-notebook
git pull origin main
docker compose build
docker compose up -d
```

**Deployment time:** ~2-5 minutes (build + restart)

### Rollback Procedure

```bash
# Quick rollback to previous image
docker compose down
docker tag homelab-notebook:latest homelab-notebook:rollback
git checkout <previous-commit>
docker compose build
docker compose up -d

# If needed, restore from rollback tag
docker tag homelab-notebook:rollback homelab-notebook:latest
docker compose up -d
```

**Deployment Speed:** Moderate (manual SSH + build)
**Maintenance Burden:** Medium (updates, monitoring, backups)

---

## Cost Breakdown

### Setup Costs
| Item | Cost |
|------|------|
| Domain (subdomain) | $0 (existing haugaard.dev) |
| SSL Certificate | $0 (Let's Encrypt via Caddy) |
| Initial configuration | $0 (your time) |

### Monthly Ongoing
| Item | Cost |
|------|------|
| VPS8 | $0 marginal (already running) |
| Supabase | $0 marginal (self-hosted) |
| Ollama | $0 marginal (self-hosted) |
| Cloudflare DNS | $0 (free tier) |
| B2 Storage | $0-5/month (if used, 10GB free) |
| **Total** | **$0-5/month** |

### Cost Scaling

| Traffic Level | Infrastructure Change | Cost Impact |
|---------------|----------------------|-------------|
| Current (single user) | As designed | $0/month |
| 10x (10 users) | No change needed | $0/month |
| 100x (100 users) | Consider Redis caching | $0/month |
| 1000x | Unlikely for personal tool | Consider Fly.io |

---

## Scaling Path

### Current State
Single-user deployment on VPS8 with direct database and AI access. No caching layer, synchronous AI calls.

### Phase 1 Optimization (When Needed)
**Trigger:** Noticeable UI lag during AI tagging (>3 seconds)

- Add Redis container for caching frequent queries
- Implement background job queue for AI tagging (non-blocking)
- Cost impact: $0 (Redis runs on same VPS)

### Phase 2 Scaling (Unlikely for Personal Tool)
**Trigger:** Multiple concurrent users causing resource contention

- Upgrade VPS or add second node
- Consider managed database (Supabase Cloud)
- Cost impact: $25-50/month

**Realistic assessment:** For a single-user knowledge management tool, Phase 1 optimization may never be needed. The current VPS8 has significant headroom.

---

## Alternative Hosting Options Considered

### Alternative 1: Fly.io

**What it is:** Platform-as-a-Service with global edge deployment and managed PostgreSQL.

**Pros:**
- Easy `fly deploy` workflow
- Managed database backups
- Auto-scaling
- 35 global regions

**Cons:**
- Adds $20-30/month cost for redundant services
- Network latency to your Ollama instance (~50-100ms per AI call)
- Defeats purpose of self-hosted infrastructure

**Cost:** ~$25/month (app + managed Postgres)

**When to Choose:** If you wanted to abandon self-hosting and go fully managed, or if you needed global distribution for multiple users.

**Verdict:** Not recommended. You'd pay for managed DB while Supabase sits unused, and AI latency would degrade user experience.

### Alternative 2: Cloudflare Pages (Hybrid)

**What it is:** Static frontend on Cloudflare edge, API routes on VPS.

**Pros:**
- Global CDN for static assets
- Zero frontend hosting cost
- Potentially faster initial page loads

**Cons:**
- Next.js App Router doesn't cleanly split (Server Components, Server Actions)
- CORS configuration between CF and VPS
- Two deployment targets to manage
- More complex debugging

**Cost:** $0 (Pages) + $0 (VPS backend)

**When to Choose:** If building a static-heavy marketing site with occasional API calls.

**Verdict:** Not recommended. Architectural complexity outweighs benefits for a full-stack Next.js app with heavy server-side features.

### Alternative 3: Localhost Only

**What it is:** Run entirely on your development machine.

**Pros:**
- Maximum simplicity
- No deployment complexity
- Instant development iteration

**Cons:**
- Not accessible when away from machine
- No integration with existing VPS services
- Defeats learning goals around deployment

**Verdict:** Not recommended. You want to learn deployment, and the app should be accessible from anywhere.

---

## Monitoring & Maintenance

### Daily
- None required (check if issues arise)

### Weekly
- Review Caddy access logs for anomalies
- Check VPS disk space (`df -h`)
- Verify backups completed

### Monthly
- Update Docker images (`docker compose pull`)
- Review and apply OS security updates
- Check Supabase database size
- Prune old Docker images (`docker system prune`)

### Monitoring Setup (Recommended)
- **Uptime:** Use existing monitoring or add UptimeRobot (free tier)
- **Logs:** Docker logs, Caddy logs
- **Alerts:** Email notification on container restart

---

## Backup Strategy

### Database Backups
- **Method:** Supabase built-in backups OR pg_dump cron job
- **Frequency:** Daily
- **Storage:** B2 bucket (encrypted)
- **Retention:** 30 days rolling

### File Storage Backups
- **Method:** Supabase Storage sync to B2 OR direct B2 bucket
- **Frequency:** Daily incremental
- **Retention:** 30 days

### Configuration Backups
- **Method:** Git repository (docker-compose.yml, Caddyfile additions)
- **Storage:** GitHub/GitLab (private repo)
- **Frequency:** On every change (committed)

### Disaster Recovery
- **Procedure:** Fresh VPS + restore from B2 backups + redeploy from Git
- **Estimated Recovery Time:** 1-2 hours
- **Last known good state:** Database backup + Git commit

---

## Security Considerations

### Implemented (via existing infrastructure)
- HTTPS everywhere (Caddy + Let's Encrypt)
- Cloudflare DDoS protection
- SSH key-only authentication
- Docker network isolation

### Recommended Additions
- Rate limiting on API routes (prevent abuse)
- Environment variable management (use Docker secrets or `.env` not in Git)
- Regular dependency updates (Dependabot or manual)
- Supabase Row Level Security (RLS) policies
- Content Security Policy headers

### Single-User Security Note
Since this is a single-user personal tool, some enterprise security concerns (RBAC, audit logs) are not applicable. Focus on: preventing unauthorized access, protecting credentials, and maintaining backups.

---

## Architecture Diagram

```
                                    ┌─────────────────────────────────────────────────────┐
                                    │                      VPS8                           │
                                    │              (Hostinger KVM 8)                      │
┌──────────┐                        │                                                     │
│          │     HTTPS              │  ┌─────────┐    ┌──────────────────┐               │
│  Browser │ ───────────────────────┼─▶│  Caddy  │───▶│ homelab-notebook │               │
│          │                        │  └─────────┘    │   (Next.js 15)   │               │
└──────────┘                        │       │         └────────┬─────────┘               │
                                    │       │                  │                          │
                                    │       │         ┌────────┴─────────┐               │
                                    │       │         │                  │               │
                                    │       │         ▼                  ▼               │
                                    │       │    ┌─────────┐       ┌─────────┐           │
                                    │       │    │ Supabase│       │ Ollama  │           │
                                    │       │    │  (DB,   │       │ (AI/LLM)│           │
                                    │       └───▶│  Auth,  │       └─────────┘           │
                                    │            │ Storage)│                              │
                                    │            └─────────┘                              │
                                    │                                                     │
                                    │            Docker Network: homelab-net              │
                                    └─────────────────────────────────────────────────────┘
                                                          │
                                                          │ Backups
                                                          ▼
                                                    ┌───────────┐
                                                    │ Backblaze │
                                                    │    B2     │
                                                    └───────────┘
```

---

## Next Steps

**Handoff document created:** `.docs/deployment-strategy.md`

### Workflow Continuation

1. **Review this strategy** - Ask questions if anything is unclear
2. **Complete LEARNING checkpoint** - Answer comprehension questions below
3. **Invoke project-spinup skill** - Generate project foundation with Docker config
4. **Build features** - Develop the homelab-notebook application
5. **Use deploy-guide** - Execute actual deployment when ready
6. **Optional: ci-cd-implement** - Add GitHub Actions for automated deployment

---

## LEARNING Mode Checkpoint

Before proceeding, please answer these comprehension questions:

### Question 1
**Why does VPS Docker deployment fit this project's core needs better than Fly.io or Cloudflare Pages?**

*(Hint: Consider latency to AI services, existing infrastructure, and cost)*

### Question 2
**What is the single most important trade-off of choosing VPS Docker over Fly.io?**

*(Hint: Think about what you gain vs. what responsibility you accept)*

### Question 3
**What is the biggest maintenance responsibility this deployment approach introduces?**

*(Hint: Consider what happens if you don't maintain it)*

---

**Answer these questions to proceed to project-spinup.**

Short but complete answers are fine. You may skip individual questions if needed.
