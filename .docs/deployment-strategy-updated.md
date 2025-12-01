# Deployment Strategy - Homelab Notebook (Updated)

**Decision Date:** 2025-12-01
**Mode:** DELIVERY
**Advisor:** Claude (Deployment Advisor role)

---

## PRIMARY RECOMMENDATION: Fly.io

Deploy the SvelteKit frontend to Fly.io alongside your existing PocketBase instance, using private networking for backend communication.

### Why This Fits

- **Learning opportunity**: Experience a platform-managed deployment model while keeping VPS as fallback
- **Co-located backend**: PocketBase already running on Fly.io (`proposaltracker-api.fly.dev`) in `sjc` region eliminates the latency concern from the original strategy
- **Private networking**: App-to-API traffic stays within Fly's internal network (lower latency, more secure, no CORS)
- **Right-sized complexity**: Dockerfile + `fly deploy` — no Kubernetes, no multi-region, no over-engineering
- **Full portability**: Same Dockerfile deploys to VPS with `docker compose up` if you want to move later
- **Minimal cost**: Likely fits in free tier; worst case ~$5-7/month for small VM

### Hosting Details

| Aspect | Value |
|--------|-------|
| **Provider** | Fly.io |
| **Region** | `sjc` (San Jose) — matches existing PocketBase |
| **Frontend** | SvelteKit container (adapter-node) |
| **Backend** | Existing PocketBase (`proposaltracker-api.fly.dev`) |
| **Networking** | Private (`.internal` DNS for API calls) |
| **Domain** | `notebook.haugaard.app` |
| **Build** | Dockerfile |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Fly.io (sjc)                       │
│                                                         │
│  ┌─────────────────┐         ┌─────────────────────┐   │
│  │  homelab-notebook│  .internal  │ proposaltracker-api │   │
│  │   (SvelteKit)   │◄────────►│    (PocketBase)     │   │
│  └────────┬────────┘         └─────────────────────┘   │
│           │                                             │
└───────────┼─────────────────────────────────────────────┘
            │ HTTPS
            ▼
    notebook.haugaard.app
```

### Network Communication

| Route | Path | Notes |
|-------|------|-------|
| User → App | `notebook.haugaard.app` | Public HTTPS |
| App → PocketBase | `proposaltracker-api.internal:8080` | Private, within Fly |
| Admin → PocketBase | `proposaltracker-api.fly.dev/_/` | Public HTTPS (admin UI) |

---

## Deployment Workflow

### Regular Deployment (after initial setup)

**Option A: Manual**
```bash
fly deploy
```

**Option B: Automatic (recommended)**
- Connect GitHub repo to Fly.io dashboard
- Push to `main` → automatic deploy
- No GitHub Actions YAML to maintain

### Initial Setup (one-time)

1. **Fly CLI**: Install and authenticate
2. **Create app**: `fly apps create homelab-notebook`
3. **Configure**: Create `fly.toml` and `Dockerfile`
4. **Secrets**: Set `PUBLIC_POCKETBASE_URL` for internal networking
5. **DNS**: Add CNAME for `notebook.haugaard.app` → Fly.io
6. **Deploy**: `fly deploy`
7. **Connect GitHub**: Enable auto-deploy in Fly dashboard

### Rollback Procedure

```bash
# List recent deployments
fly releases

# Roll back to previous version
fly deploy --image <previous-image>
```

---

## Cost Breakdown

| Item | Cost |
|------|------|
| Fly.io (shared-cpu-1x) | $0-7/month |
| Domain | $0 (existing) |
| SSL | $0 (Fly.io auto-provisions) |
| **Estimated Total** | **$0-7/month** |

Fly.io free tier includes 3 shared-cpu-1x VMs with 256MB RAM. SvelteKit with adapter-node typically uses <100MB. You'll know actual costs within the first month.

---

## CI/CD Strategy

**Use Fly.io's built-in GitHub integration** rather than GitHub Actions.

| Feature | Fly.io Integration | GitHub Actions |
|---------|-------------------|----------------|
| Setup | Connect repo in dashboard | Write YAML workflow |
| Maintenance | None | You maintain the YAML |
| Customization | Limited | Full control |
| Good for | Simple auto-deploy | Complex pipelines |

For this app, Fly.io integration is sufficient. If you later want to run tests before deploy or add staging environments, you can switch to GitHub Actions then.

---

## Environment Variables

| Variable | Value | Where Set |
|----------|-------|-----------|
| `PUBLIC_POCKETBASE_URL` | `http://proposaltracker-api.internal:8080` | Fly secrets |
| `NODE_ENV` | `production` | Dockerfile |

```bash
# Set secrets on Fly.io
fly secrets set PUBLIC_POCKETBASE_URL="http://proposaltracker-api.internal:8080"
```

---

## PocketBase Configuration

### Reusing Existing Instance

The existing `proposaltracker-api` PocketBase instance will host Homelab Notebook collections alongside any existing data.

**Collections to add:**
- `entries` (main content)
- `projects` (organizers)
- `tags` (categorization)

**Auth rules:** Configure collection-level rules in PocketBase admin UI to restrict access appropriately.

### Why Not a Separate Instance

- Additional cost (volume storage)
- Additional maintenance
- No practical benefit for single-user apps
- PocketBase handles multiple collections cleanly

If you later want separation, migration is straightforward.

---

## Fallback: VPS Redeployment

If Fly.io doesn't work out, redeploy to Hostinger VPS8:

1. Point `notebook.haugaard.app` DNS to VPS IP (`72.60.27.146`)
2. Add Caddy entry:
   ```
   notebook.haugaard.app {
       reverse_proxy homelab-notebook:3000
   }
   ```
3. Use same Dockerfile with `docker compose up -d --build`
4. Update `PUBLIC_POCKETBASE_URL` to point to VPS PocketBase or keep using Fly.io PocketBase

**Estimated downtime:** 30-60 minutes (mostly DNS propagation)

---

## Security Considerations

### Handled by Fly.io
- HTTPS with auto-provisioned SSL certificates
- DDoS protection at edge
- Private networking isolation

### Your Responsibility
- Strong PocketBase admin password
- Appropriate collection auth rules
- No secrets in git (use `fly secrets`)

---

## Monitoring

| What | How |
|------|-----|
| Logs | `fly logs` or Fly.io dashboard |
| Status | `fly status` |
| Metrics | Fly.io dashboard (CPU, memory, requests) |
| Uptime | Fly.io includes basic health checks |

For a personal utility app, Fly.io's built-in monitoring is sufficient. No need for external monitoring services initially.

---

## Comparison: Original vs Updated Strategy

| Aspect | Original (VPS) | Updated (Fly.io) |
|--------|----------------|------------------|
| **Target** | Hostinger VPS8 | Fly.io |
| **Cost** | $0 (sunk cost) | $0-7/month |
| **Latency** | Minimal (same Docker network) | Minimal (same region, private network) |
| **Learning** | Familiar infrastructure | New platform experience |
| **Deploy command** | SSH + git pull + docker compose | `fly deploy` |
| **CI/CD** | Manual or GitHub Actions | Built-in GitHub integration |
| **Portability** | N/A | Can move to VPS anytime |

---

## Next Steps

**Handoff document created:** `.docs/deployment-strategy-updated.md`

When ready to deploy:
1. Invoke **deploy-guide** skill
2. It will read this strategy and guide you through:
   - Fly CLI setup
   - `fly.toml` and Dockerfile creation
   - DNS configuration
   - Deployment execution
   - Post-deployment verification
3. Optional: Enable GitHub auto-deploy in Fly dashboard

---

*Strategy refined through conversation with deployment-advisor*
