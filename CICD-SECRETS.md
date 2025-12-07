# CI/CD Secrets Configuration

This document lists the secrets required for the CI/CD pipelines.

## GitHub Actions Secrets

Add these secrets in your repository settings:
**Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `FLY_API_TOKEN` | Fly.io deploy token | Run `flyctl tokens create deploy -x 999999h` |

### Storage Secrets

**Storage Type:** Tigris (S3-compatible, Fly.io managed)

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | Tigris access key | Auto-set by `fly storage create` |
| `AWS_SECRET_ACCESS_KEY` | Tigris secret key | Auto-set by `fly storage create` |
| `AWS_ENDPOINT_URL_S3` | Tigris endpoint | Auto-set (https://fly.storage.tigris.dev) |
| `AWS_REGION` | Storage region | Auto-set (auto) |
| `BUCKET_NAME` | Storage bucket name | Auto-set (homelab-notebook-files) |

These secrets are automatically configured when you create a Tigris bucket:
```bash
fly storage create --app homelab-notebook --name homelab-notebook-files --public
```

---

## Setup Instructions

### Fly.io Deploy Token

1. **Ensure you're logged in to Fly.io:**
   ```bash
   flyctl auth whoami
   ```
   If not logged in: `flyctl auth login`

2. **Create a deploy token:**
   ```bash
   flyctl tokens create deploy -x 999999h
   ```
   This creates a long-lived token specifically for deployments.

3. **Copy the token** - it starts with `FlyV1 ...`

4. **Add to GitHub:**
   - Go to your repository on GitHub
   - Navigate to **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - Name: `FLY_API_TOKEN`
   - Value: Paste the token from step 3
   - Click **Add secret**

---

## Verification

After adding the secret, verify your pipeline works:

```bash
# Make a small change or empty commit
git commit --allow-empty -m "ci: verify CI/CD pipeline"
git push origin main
```

Then check the **Actions** tab in your GitHub repository to watch the workflow run.

---

## Workflow Overview

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:** Push to `main` or `dev`, Pull requests to `main`

**Steps:**
1. Checkout code
2. Set up Node.js 20 + pnpm
3. Install dependencies (cached)
4. Run linting (`pnpm lint`)
5. Run type checking (`pnpm check`)
6. Run tests (`pnpm test run`)
7. Build application (`pnpm build`)

### Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:** Push to `main` only

**Steps:**
1. Run CI checks (reuses ci.yml)
2. If CI passes → Deploy to Fly.io
3. Verify deployment status

**Concurrency:** Only one deployment at a time (queued, not cancelled)

---

## Troubleshooting

### "Error: FLY_API_TOKEN is not set"
- Verify the secret name is exactly `FLY_API_TOKEN` (case-sensitive)
- Check the token was saved correctly in GitHub Secrets

### "Error: Could not find app"
- Ensure `fly.toml` exists in repository root
- Verify app name in `fly.toml` matches your Fly.io app

### CI fails but works locally
- Check Node.js version matches (should be 20)
- Ensure `pnpm-lock.yaml` is committed
- Run `pnpm install --frozen-lockfile` locally to test

### Deploy succeeds but app doesn't work
- Check Fly.io logs: `flyctl logs`
- Verify environment variables: `flyctl secrets list`
- Check app status: `flyctl status`

---

## Manual Deployment

If you need to deploy manually (bypassing CI/CD):

```bash
flyctl deploy
```

Or to deploy a specific commit:

```bash
git checkout <commit-hash>
flyctl deploy
```

---

## Rollback

To rollback to a previous deployment:

```bash
# List recent deployments
flyctl releases

# Rollback to previous release
flyctl releases rollback
```

Or redeploy a specific commit:

```bash
git checkout <previous-commit>
flyctl deploy
git checkout main
```
