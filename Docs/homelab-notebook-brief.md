# Homelab Notebook - Project Brief

## Project Overview

The Homelab Notebook is a lightweight, streamlined knowledge management system designed for hobbyist web developers who are actively learning through self-hosting infrastructure and building diverse projects. As learning accelerates and project complexity grows, valuable resources, code snippets, research findings, workflow notes, and brilliant fragments of insight become scattered across directories, text files, and physical notebooks. This scattered state creates friction when returning to paused projects, learning new technologies, or retrieving previously-discovered solutions.

The Homelab Notebook solves this problem by providing a unified, AI-enhanced capture and retrieval system organized around three integrated modes: **Research** (resource collection and link management), **Project** (raw lab notebook during active development), and **Reference** (distilled, tutorial-style documentation). The system enables easy entry with minimal friction and reliable search across all captured knowledge, supporting both active learning and future retrieval.

---

## Problem Statement

An eager hobbyist learner using Claude Code as a brainstorming, research, and coding partner accumulates vast amounts of valuable information: technology research, code snippets, step-by-step instructions, project ideas, timelines, task staging notes, to-do lists, and learning resources. This information currently exists across multiple directories as scattered text files, physical printed notebooks, and various digital formats. When projects are interrupted by other priorities and need to be resumed weeks or months later, critical context is lost. When learning new technologies like Docker, n8n, embeddings, or Claude Agents, previously-discovered solutions and references are difficult to locate.

**Why This Matters:**
- **Learning continuity suffers** when valuable insights and hard-won knowledge can't be retrieved reliably
- **Project momentum is lost** when resuming work requires re-discovering context that was documented but scattered
- **Cognitive overhead increases** when managing multiple storage locations instead of focusing on learning and building
- **Knowledge compounds poorly** when connections between related concepts, projects, and resources remain invisible

---

## Project Goals

### Primary Goal
Create a single, unified knowledge repository that minimizes friction for capturing information during active learning and maximizes reliability when retrieving that information during future projects or learning sessions.

### Secondary Goals
- **Preserve learning context** through raw project notes that capture not just steps, but observations, issues encountered, and decision rationale
- **Enable knowledge reuse** by distilling project experiences into tutorial-style reference documentation that future-you (or others) can follow
- **Reduce mental overhead** by using AI-powered auto-tagging to organize resources without manual categorization burden
- **Support flexible retrieval** through multiple search strategies (project, keyword, technology, date range, tags)
- **Maintain knowledge connections** by linking notes to projects and cross-referencing related concepts

---

## Functional Requirements

### Core Functionality

The system provides three integrated modes that represent different perspectives on captured knowledge, not strict sequential phases. A user can work fluidly across modes, moving content between them or creating Reference documentation while still actively working in Project mode.

**Key Features:**

- **Research Mode - Resource Collection**: Capture and organize external resources (links, articles, documentation, videos, tutorials) encountered during learning. AI automatically scans and tags resources by technology, topic, and concepts. Resources are searchable and can be organized into collections by project or technology area. Supports pasted links and file uploads. Example: While learning Docker networking, save multiple tutorial links, YouTube videos, and Stack Overflow threads all tagged automatically with "Docker," "networking," "containers," "infrastructure."

- **Project Mode - Lab Notebook**: Maintain raw, timestamped notes during active project work. Capture code snippets, step-by-step commands, checklists, observations about what works and what doesn't, issues encountered, and decision rationale. Supports markdown text entry, drag-and-drop file uploads, paste area for commands and snippets. AI assists with tag generation and markdown beautification (cleaning up spelling, grammar, formatting). Example: During Docker container setup, document specific commands for deployment to VPS, troubleshooting notes when something fails, checklist for start/stop procedures, and observations about why certain configuration choices were made.

- **Reference Mode - Distilled Documentation**: Transform project experience into clear, tutorial-style documentation that anyone (including future-you after months away) could follow to reproduce the setup or solve similar problems. Organized as step-by-step guides with code blocks, explanations, and best practices. Maintains connection back to original Project notes for deeper context when needed. Example: After successfully setting up multiple Docker containers, create a Reference guide titled "Docker Container Setup on VPS" that provides clean 1-2-3-4-5 steps anyone could follow, distilled from the messier Project notes.

- **AI-Powered Organization**: Automatic tag generation across all modes reduces manual categorization burden. Tags cover technology (Docker, n8n, embeddings), concepts (authentication, networking, deployment), and infrastructure types (VPS, self-hosted, Raspberry Pi). Users can add, edit, or remove AI-suggested tags but default behavior handles most organization automatically.

- **Unified Search & Retrieval**: Search across all modes simultaneously by project name, keyword, technology, date range, or tag combinations. Find all notes related to "Docker" regardless of whether they're Research links, Project lab notes, or Reference tutorials. Retrieve everything related to a specific project to resume work after interruption.

- **Project Linking & Cross-Referencing**: Associate notes with specific projects to enable project-centric views. Link related notes across modes (e.g., link Project notes to the Research resources that informed them, or link Reference documentation back to raw Project notes for additional context).

### User Experience Expectations

The interface should feel lightweight and fast, optimized for quick capture during active learning without interrupting flow. Entry mechanisms support typed markdown, drag-and-drop file uploads, and paste areas for code snippets or links. Search should return results quickly across potentially thousands of notes. The system should work seamlessly on desktop environments where the user does most development work.

Organization happens largely automatically through AI tagging, but users retain full control to override or supplement AI suggestions. The three modes (Research, Project, Reference) should be clearly distinguishable but fluid to move between - not rigid phases that require formal transitions.

---

## Success Criteria

**Essential Success Metrics:**

1. **Capture friction is minimized**: Time from "I want to save this" to "It's saved and tagged" is under 30 seconds for typical entries
2. **Retrieval reliability is high**: User can find previously-saved information 95%+ of the time using first search attempt
3. **Single source of truth achieved**: User stops maintaining scattered text files and physical notebooks in favor of unified system

**User Satisfaction Indicators:**
- "I can resume a month-old project by finding my notes and getting back up to speed in minutes, not hours"
- "When learning a new technology, I can pull up all my notes, resources, and previous project experiences on related topics without sorting through directories"
- "I trust that if I put something in the Homelab Notebook, I'll be able to find it later"

---

## Use Cases & Scenarios

### Use Case 1: Learning Docker Networking (Research → Project → Reference)
**Scenario**: User is exploring Docker networking for a new project and has never worked with Docker bridge networks before.

**Expected behavior**:
- **Research phase**: User finds 3 tutorial links, a YouTube video, and Docker documentation. Pastes each link into Research mode. AI automatically tags with "Docker," "networking," "containers," "bridge-network," "infrastructure." User adds to "Docker Learning" collection.
- **Project phase**: While setting up first container, user creates Project note titled "First Docker Bridge Network Setup." Documents each command executed, observations about what happened, troubleshooting when containers couldn't communicate, checklist for network inspection commands. Note is timestamped and auto-tagged by AI with similar tags as Research resources.
- **Reference phase**: After successful setup, user distills Project notes into Reference tutorial: "Docker Bridge Network Setup - Complete Guide" with clean 1-2-3 steps, explanations of each command, common gotchas section. Links back to original Project notes for deeper troubleshooting context.
- **Later retrieval**: Two months later, user needs to set up another bridge network. Searches "Docker bridge network" → finds Reference tutorial immediately → follows clean steps → refers back to Project notes when encountering new issue not covered in Reference.

### Use Case 2: Resuming Paused Project After One Month
**Scenario**: User was building an n8n workflow automation project but had to pause for a month due to other priorities. Needs to resume where they left off.

**Expected behavior**:
- User searches for project name "n8n Automation" or filters by project tag
- System returns all associated notes: Research resources on n8n workflows, Project notes with timeline and current status, partially-completed task checklist, code snippets for custom nodes already written
- User reviews most recent Project note (timestamped) to see last working session: "Got webhook trigger working, still need to add database write node. Issue: credentials not persisting - check config."
- Within 10 minutes of reviewing notes, user understands current state and can continue work

### Use Case 3: Cross-Technology Learning Pattern Recognition
**Scenario**: User notices authentication problems keep appearing across multiple projects (Docker containers, n8n workflows, custom web apps).

**Expected behavior**:
- User searches "authentication" across all modes
- Results show Research links about OAuth, JWT, session management from multiple projects
- Project notes reveal patterns: "authentication issue - forgot to set environment variable" appears in 3 different projects
- User creates new Reference note: "Authentication Setup Checklist - Common Gotchas" distilled from multiple project experiences
- Future projects benefit from consolidated authentication knowledge

### Use Case 4: Quick Snippet Capture During Tutorial
**Scenario**: User is watching YouTube tutorial on embeddings and instructor shares a useful code snippet. User wants to capture it without interrupting video.

**Expected behavior**:
- User pauses video, copies snippet
- Opens Homelab Notebook, creates new Project note (or adds to existing "Embeddings Learning" note)
- Pastes snippet, adds one-line context: "Vector similarity search - from YouTube tutorial at 12:34"
- Pastes YouTube link into same note
- AI auto-tags with "embeddings," "vector-search," "machine-learning"
- Total time: under 20 seconds
- User resumes video

---

## Edge Cases to Handle

### Large File Uploads
**Problem**: User wants to upload PDF documentation, large code files, or exported configuration files that might exceed typical size limits.

**Solution**: System should handle files up to reasonable size (e.g., 50MB) and provide clear error messaging if file exceeds limits. Consider storing large files separately with links/references in notes rather than inline.

### Duplicate Detection
**Problem**: User pastes the same tutorial link or resource multiple times across different sessions, creating duplicate entries.

**Solution**: System should detect duplicate URLs and offer to navigate to existing entry or confirm creation of new entry if user intends to capture it in different context.

### Tag Explosion
**Problem**: As notes accumulate into thousands, AI-generated tags could proliferate into hundreds of slightly-different variations (e.g., "Docker," "docker," "Docker-compose," "docker-compose," "containers").

**Solution**: Implement tag normalization (lowercase, consistent separators) and tag merging suggestions. Provide tag management interface to review, merge, and clean up tags periodically.

### Markdown Rendering Failures
**Problem**: User pastes code snippets or commands with special characters that break markdown rendering.

**Solution**: Provide both rendered markdown view and raw text view toggle. Auto-detect code blocks and wrap in proper markdown code fences. Escape special characters that could break rendering.

### Search Result Overload
**Problem**: When user searches common term like "setup" or "error," system returns hundreds of results making retrieval difficult.

**Solution**: Provide relevance ranking (most recent, most referenced, best tag match). Enable search filtering by mode (Research only, Project only, Reference only), date range, and tag combinations. Support search result preview snippets to scan without opening.

### Project Abandonment
**Problem**: User starts Project notes for something that never gets finished or moves to Reference state. These incomplete projects clutter the system.

**Solution**: Allow archiving of projects without deleting them. Provide "stale project" detection (no activity in X months) with suggestions to archive. Archived projects remain searchable but don't appear in default views.

---

## Constraints & Assumptions

### Constraints
- **Timeline**: Flexible learning timeline - no commercial pressure or hard deadline
- **Budget**: Self-hosted infrastructure preferred (Hostinger VPS or similar) to minimize ongoing costs and maintain ownership
- **Infrastructure**: Must work with existing self-hosting infrastructure and tools
- **User count**: Single-user system, no multi-user collaboration requirements
- **Platform**: Desktop-focused, no mobile optimization required for v1

### Assumptions
- User is comfortable with markdown syntax for text entry
- User has access to AI services (self-hosted Ollama or API-based like OpenAI) for auto-tagging features
- User's learning process generates dozens of notes per week, scaling to thousands over months/years
- Desktop browser is primary interaction environment
- User values learning process and documentation as much as finished product outcomes
- Content is primarily technical (code, commands, infrastructure) rather than general note-taking

---

## Out of Scope (For Initial Version)

The following features are explicitly not included:

- **Voice input integration** (WhisperFlow or similar) - valuable future enhancement but adds complexity to v1
- **Mobile application or mobile-optimized interface** - desktop web is sufficient for primary workflow
- **Graphical knowledge maps or visualization** - interesting "nice-to-have" inspired by video example but not essential for core functionality
- **Multi-user collaboration or sharing** - single-user system is sufficient
- **Version history or time-travel** for note content - timestamps capture when notes were created but tracking changes within notes adds complexity
- **External API integrations** beyond AI tagging (e.g., automatic GitHub repo linking, Stack Overflow integration)
- **Advanced permissions or privacy controls** - single user on self-hosted infrastructure provides inherent privacy

These can be considered for future iterations after core functionality proves valuable.

---

## Learning Goals

**What I Want to Learn:**
- Building a full-stack application with AI integration from the ground up
- Implementing effective search and retrieval systems for text-based content
- Understanding trade-offs in knowledge management system design
- Exploring self-hosting architecture and deployment for production personal use
- Practicing workflow-driven development where the tool solves my own real pain point

**Skills to Practice:**
- Full-stack web development (frontend UI, backend API, database design)
- AI/LLM integration for practical auto-tagging and content processing
- Search implementation and relevance ranking
- Data modeling for flexible, searchable knowledge structures
- Self-hosting deployment and infrastructure management
- Building tools that support learning workflows rather than just task completion

---

## Next Steps

**Recommended workflow:**

1. **Review this brief** - Ensure it captures your vision accurately
2. **Invoke tech-stack-advisor skill** - Explore technology options based on these requirements (LEARNING mode will provide detailed exploration and trade-off analysis)
3. **Invoke deployment-advisor skill** - Plan deployment strategy for your self-hosted infrastructure
4. **Invoke project-spinup skill** - Create foundation and learning roadmap

**Ready to proceed?** Invoke the tech-stack-advisor skill to explore technology options for this project.
