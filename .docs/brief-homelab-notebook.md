# Homelab Notebook - Project Brief

## Project Overview
**Homelab Notebook** is a lightweight, self-hosted Personal Knowledge Management (PKM) tool designed specifically for a homelab engineer. It serves as a "second brain" to capture, organize, and retrieve the technical resources, code snippets, project ideas, and workflows that are currently scattered across browser tabs, temporary text files, and mental notes. It prioritizes speed and low friction over complex features, ensuring that saving a snippet is as easy as thinking of it.

## Problem Statement
Valuable technical knowledge—such as server configurations, debugging steps, and inspiration for future projects—is currently fragmented and difficult to retrieve. The friction of organizing this data often leads to it being lost or ignored, resulting in repeated research for the same problems and stalled project momentum.

**Why This Matters:**
- **Context Switching Costs:** Time is wasted re-discovering solutions or searching for "that one tutorial" found weeks ago.
- **Lost Innovation:** Fleeting ideas for projects or improvements are forgotten before they can be recorded.
- **Workflow Interruption:** The lack of a central, trusted repository creates hesitation when starting new tasks.

---

## Project Goals

### Primary Goal
Build a streamlined, web-based application that reduces the time to capture or retrieve a piece of technical knowledge to under 5 seconds.

### Secondary Goals
- **Infrastructure Integration:** Leverage the existing VPS and Docker ecosystem for zero-cost hosting and easy maintenance.
- **Developer-Centric Design:** First-class support for code snippets, Markdown, and keyboard shortcuts.
- **Data Sovereignty:** Ensure all data is stored in a portable format (e.g., JSON/SQL/Markdown) within the user's control.

---

## Functional Requirements

### Core Functionality
The system acts as a high-speed digital filing cabinet. Users can instantly "dump" information into the system and rely on powerful search and flexible tagging to find it later. It avoids rigid hierarchy in favor of fluid associations.

**Key Features:**
- **Quick Capture:** A minimalist input interface allowing rapid entry of URLs, text notes, or code blocks without navigating complex menus.
- **Flexible Organization:** A robust tagging system and "collections" to group related resources (e.g., "Docker", "Security", "Project X") without enforcing strict folder structures.
- **Powerful Search:** Instant, full-text search across titles, content, tags, and code snippets with fuzzy matching capabilities.
- **Content Types:** Native support for:
    - **URLs:** Auto-fetching metadata (title/description) where possible.
    - **Code Snippets:** Syntax highlighting for common languages (YAML, JSON, Python, JS, Bash).
    - **Markdown Notes:** Rich text formatting for documentation and checklists.

### User Experience Expectations
- **Keyboard First:** Global hotkeys for creating new entries and focusing the search bar.
- **Low Latency:** UI interactions (opening a note, searching) should feel instantaneous.
- **Mobile Responsive:** Fully functional on mobile browsers for capturing ideas on the go.

---

## Success Criteria

**Essential Success Metrics:**
1. **Capture Time:** < 5 seconds from opening the app to saving an entry.
2. **Retrieval Time:** < 3 seconds to find a specific item via search.
3. **Reliability:** Zero data loss during capture; 99.9% uptime via Docker restart policies.

**User Satisfaction Indicators:**
- The user defaults to the Notebook instead of opening a new browser tab for temporary notes.
- The user trusts the search function enough to stop bookmarking pages in the browser.

---

## Use Cases & Scenarios

### Use Case 1: Quick Resource Capture
**Scenario:** User is reading a technical article on Nginx configuration and wants to save it for later.

**Expected behavior:**
- User opens Notebook, clicks "New Link", pastes URL
- System auto-fetches the title
- User adds tags "nginx", "proxy", "reference" and hits Enter
- Entry is saved

### Use Case 2: Idea Capture
**Scenario:** User has a sudden idea for a home automation workflow while away from the desk.

**Expected behavior:**
- User opens Notebook on mobile
- Taps "New Note"
- Types "Idea: Auto-dim lights when Plex starts"
- Adds bullet points for implementation steps
- Saves

### Use Case 3: Knowledge Retrieval
**Scenario:** User is configuring a new container and needs a specific `docker-compose` snippet saved months ago.

**Expected behavior:**
- User types "compose snippet" or "docker network" into the search bar
- The list filters instantly
- User selects the entry, clicks a "Copy Code" button, and pastes it into their terminal

---

## Edge Cases to Handle

### 1. Paste Formatting Issues
**Problem:** Pasting code from a terminal or IDE often carries unwanted formatting or loses indentation.
**Solution:** Input fields for code must support "Paste as Plain Text" or auto-detect code blocks to preserve indentation/syntax.

### 2. Duplicate Resources
**Problem:** User accidentally saves the same URL or snippet twice.
**Solution:** System detects duplicate URLs upon entry and prompts to "Edit Existing" or "Save Anyway" to prevent clutter.

### 3. Network Interruption
**Problem:** User tries to save a note while the internet connection is flaky.
**Solution:** UI should optimistically show "Saved" but queue the request, retrying automatically if the backend is temporarily unreachable.

---

## Constraints & Assumptions

### Constraints
- **Single User:** No authentication complexity beyond simple access control; no multi-user collaboration features.
- **Self-Hosted:** Must run within the existing Hostinger VPS8 limits (32GB RAM is plenty, but CPU/Storage efficiency is desired).
- **Tech Stack:** Must run as a Docker container behind Caddy.

### Assumptions
- The user is comfortable with Markdown.
- The user prefers a web interface over a native desktop app.
- Existing backups (if any) on the VPS will cover the database/volume data.

---

## Out of Scope (For Initial Version)

- **Multi-user / Teams:** No sharing permissions or team workspaces.
- **AI Integration:** No LLM-based summarization or auto-tagging (can be added later via Ollama).
- **File Uploads:** No hosting of images or PDFs (link to external storage instead).
- **Browser Extension:** A standalone extension is out of scope; a responsive web app is sufficient.
- **Public Sharing:** No "publish to web" feature for notes.

---

## Deployment Intent

**Target Environment:** Public Deployment (Self-Hosted)

- **Infrastructure:** Hostinger KVM VPS8
- **Domain:** `notebook.haugaard.dev` (proxied via Caddy to VPS)
- **Reverse Proxy:** Existing Caddy instance handles SSL termination and routing
- **Network:** Connects to the existing `homelab-net` Docker network to communicate with the chosen backend (Supabase or PocketBase)
- **Storage:** Docker volumes mapped to the host filesystem for persistence

---

## Next Steps

**Recommended workflow:**
1. Review this brief to confirm alignment with personal goals
2. Invoke **tech-stack-advisor** to select the frontend framework and backend (Supabase vs. PocketBase) based on the "lightweight" constraint
3. Invoke **deployment-advisor** to generate the deployment strategy
4. Invoke **project-spinup** to scaffold the codebase

---

*Generated with gemini-3-pro-preview via Zen MCP*
*Date: 2025-11-30*
