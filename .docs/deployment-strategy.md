# Deployment Strategy - Homelab Notebook

**Decision Date:** 2025-11-30
**Mode:** DELIVERY
**Model Used:** gemini-3-pro-preview

---

## PRIMARY RECOMMENDATION: VPS/Docker (Hostinger VPS8)

This is the optimal choice. You already possess a high-performance VPS (32GB RAM) that is underutilized, with the exact infrastructure (Caddy, Docker Network, PocketBase) required to run this application immediately at zero marginal cost.

### Why This Fits

- **Zero Latency:** Backend (PocketBase) and frontend (SvelteKit) sit on the same internal Docker network (`homelab-net`), eliminating public internet round-trips for API calls.
- **Pre-Existing Backend:** PocketBase is already running (`pocketbase:8090`). You only need to deploy the SvelteKit frontend.
- **Data Sovereignty:** Data stays on your encrypted VPS volume, not a third-party cloud.
- **Instant Mobile Access:** Existing Caddy setup handles SSL termination automatically, meeting the "capture from anywhere" requirement immediately.
- **Resource Efficiency:** SvelteKit Node adapter container will consume <100MB RAM, barely a blip on your 32GB server.

### Hosting Details

| Aspect | Value |
|--------|-------|
| **Provider** | Hostinger (Existing VPS8) |
| **Server Type** | Docker Container (Node.js runtime for SvelteKit) |
| **Container Network** | `homelab-net` (Internal communication with PocketBase) |
| **Database** | Existing PocketBase instance (SQLite) |
| **SSL** | Caddy (Automatic Let's Encrypt) |
| **Domain** | `notebook.haugaard.dev` |

---

## Deployment Workflow

### Initial Setup (one-time)

1. **DNS:** Add A record for `notebook.haugaard.dev` pointing to VPS IP (`72.60.27.146`)
2. **Caddy:** Add entry to `Caddyfile` routing `notebook.haugaard.dev` to the new container name:
   ```
   notebook.haugaard.dev {
       reverse_proxy homelab-notebook:3000
   }
   ```
3. **Docker:** Create a `docker-compose.yml` for the SvelteKit app using `adapter-node`

### Regular Deployment (updates)

1. **Local:** `npm run build` → Commit changes
2. **Server:** SSH into VPS
3. **Update:** `git pull` → `docker compose up -d --build`

### Rollback Procedure

1. Retain the previous Docker image tag (e.g., `:v1`)
2. Update `docker-compose.yml` to point to previous tag
3. `docker compose up -d`

**Deployment Speed:** Fast
**Maintenance Burden:** Low

---

## Cost Breakdown

| Item | Cost |
|------|------|
| VPS Hosting | $0/month (existing sunk cost) |
| Domain | $0/month (existing) |
| SSL | $0/month (Caddy/Let's Encrypt) |
| **Total** | **$0/month** |

---

## Alternative Options

### Cloudflare Pages (Static/Adapter-Static)

**Why consider it:**
- Offload frontend assets to global CDN for faster initial load times in different regions

**Trade-offs vs Primary:**
- **Complexity:** Must configure CORS on PocketBase to allow requests from Cloudflare domain
- **Auth Friction:** Handling authentication cookies across domains is more complex
- **Build Pipeline:** Requires GitHub Actions or Cloudflare build hooks vs simple `docker compose` command

**When to choose instead:**
- Only if VPS bandwidth is saturated (unlikely) or you want to shut down frontend container to save 50MB RAM

---

## Ruled Out Options

| Option | Why Ruled Out |
|--------|---------------|
| **fly.io** | Unnecessary cost & latency. Moving frontend to Fly.io introduces network latency between frontend and PocketBase backend on Hostinger, plus adds billing for persistent volumes. |
| **Hostinger Shared Hosting** | Incompatible. Shared hosting is optimized for PHP/MySQL. Running long-lived Node.js process (SvelteKit) or Go binary (PocketBase) is typically restricted or killed by resource monitors. |
| **Localhost** | Violates requirements. Project requires "HTTPS access from anywhere (mobile capture)." Localhost restricts usage to your desk, defeating mobile capture use case. |

---

## Scaling Path

### Current State (Phase 1)
- **Architecture:** Single SvelteKit Container + Existing PocketBase Container
- **Capacity:** More than sufficient for single-user usage

### Phase 2: High Volume/Attachments
- **Trigger:** Storing gigabytes of PDFs/Images
- **Action:** Configure PocketBase to offload file storage to Backblaze B2 bucket (S3 compatible) instead of local disk

### Phase 3: Performance Optimization (if needed)
- **Trigger:** Noticeable latency on search with >10k items
- **Action:** Implement server-side search indexing or move to Supabase with pgvector

---

## Backup Strategy

### Database Backups
- **Frequency:** Daily at 3 AM (existing PocketBase backup)
- **Destination:** Backblaze B2 (`pocketbase_data_YYYYMMDD...`)
- **Verification:** Ensure new "Notebook" collection is included in volume path (`/pb/pb_data`)

### Disaster Recovery
1. Re-provision Docker on new VPS
2. Pull backup from B2
3. Restore volume
4. Start containers

**Estimated Recovery Time:** 30-60 minutes

---

## Security Considerations

### Already Implemented (via existing infrastructure)
- HTTPS via Caddy/Let's Encrypt
- Firewall (UFW) - only ports 80/443 exposed
- Docker network isolation
- SSH key-based authentication

### Recommended Additions
- PocketBase admin password (strong, unique)
- Optional: Basic auth or IP whitelist for admin panel

---

## Monitoring & Maintenance

| Frequency | Tasks |
|-----------|-------|
| **Daily** | Automated backups (already configured) |
| **Weekly** | Check Docker logs for errors |
| **Monthly** | Update Docker images, review disk usage |

---

## Summary

Stick to the **VPS/Docker** strategy. You have a "Ferrari" of a VPS (32GB RAM) that is currently underutilized. Deploying the SvelteKit app as a Docker container alongside your existing PocketBase instance is the fastest, cheapest, and most robust path. It keeps all traffic within your internal Docker network, ensuring the "under 5 seconds" performance goal is met by eliminating public internet latency for database fetches.

---

## Next Steps

**Handoff document created:** .docs/deployment-strategy.md

1. Review this strategy
2. If agreed → Invoke **project-spinup** skill
3. Build your features
4. When ready → Use **deploy-guide** to deploy
5. Optional → Use **ci-cd-implement** for automation

---

*Generated with gemini-3-pro-preview via Zen MCP*
