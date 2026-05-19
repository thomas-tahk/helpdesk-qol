# helpdesk-qol MVP — Design (Draft)

**Status:** Draft. Brainstorming session paused 2026-05-14 before the "propose approaches" step. This document captures what's settled, what's proposed-but-unconfirmed, and what's still open. When the session resumes, continue from §5.

> **2026-05-19 update — build-first pivot.** §5 defaults are no longer treated as a gate; decisions in that section are made when we hit them in code. The "propose approaches" step is deferred to the **Phase 2 Request unified view**, where design risk is real. Slice 0 (a minimum clickable Incident view) is specified in `2026-05-19-slice-0-walking-skeleton.md`. §3 / §4 locked decisions still stand. §6 open items are revisited in Phase 2 brainstorming, not before.

---

## 1. Project framing

helpdesk-qol is a parallel/replacement layer over a legacy enterprise ticketing system, built for the daily flow of a service desk agent. The north star is **felt smoothness** for the agent and their teammates — particularly an accessibility-first teammate who relies on keyboard navigation, high-contrast focus, and screen-reader-correct UI. The agent and a small team are the only users; portfolio framing is incidental.

Stack and constraints are defined in `CLAUDE.md` and are not restated here.

---

## 2. Headline pain and design pivot

The user named the daily pains in priority order:

1. **A — Request flow.** The legacy ticketing system models a Request as a 3-level hierarchy (REQ → RITM → SCTASK), and forces a page load between levels. In practice the cardinality is almost always 1:1:1; REQ carries almost no useful data; RITM is the only level customer comms happens at; SCTASK is the level the agent actually owns and works on; SCTASK and RITM share most field data; work-notes don't cross levels. Net effect: constant bouncing between near-duplicate pages.
2. **D — Hotkeys / jumps.** No way to land directly on a needed field or action. The mouse is hostile at high zoom levels.
3. **B — Templates.** Group-shared templates exist; the agent wants personal templates too. Templates should also pre-fill new tickets, not just inject text into composer.
4. **C — Context assembly.** Real but lower-priority; the agent's multi-monitor setup mostly handles it. **Out of scope.**

Additionally: even Incidents in the legacy tool have friction — they default to an "Overview" tab that gates the working surface. Our record views must land directly on the working surface, no interstitial summary tab.

**The design pivot:** the unified Request view collapses the artificial 3-level hierarchy into one logical record. REQ becomes a header label / breadcrumb. RITM and SCTASK fields render as a single merged section. Work notes from both levels flow into one activity timeline, tagged by origin. Customer comms is its own clearly-labeled channel on the same page. Team reassignment is an inline action.

---

## 3. MVP scope (locked)

**In scope:**
- **Incident view** (single-record). Lands directly on the working surface. Same chassis as Request.
- **Request unified view** (the headline feature). Merged REQ/RITM/SCTASK in one page; tagged work-notes timeline; inline reassignment.
- **Templates.** Group-shared and personal scopes. Cover *both* ticket pre-fill (start a new ticket from a template) AND composer insert (canned text into work notes or customer comms). Templates are record-type-aware (Incident-closing template ≠ Request-fulfillment template).
- **Hotkeys / command palette.** Hotkey registry baked into the chassis from day one. `cmd+K` command palette enumerates registered actions/hotkeys; doubles as the discoverable shortcut list.
- **Accessibility.** Focus rings survive heavy browser zoom; logical tab order; ARIA correctness via Radix/shadcn primitives; skip links; no hover-only interactions.
- **Performance.** <100ms felt response for common UI; <500ms operation default with flag-and-discuss when a path can't hit it. Optimistic updates with rollback. TanStack Query for caching/prefetching. Simulated 50–300ms randomized latency in dev to exercise optimistic flows.
- **Search.** Field-level filter refinement (chip/token-style query) plus per-user unified ticket history. Phase 3, not optional.

**Out of MVP:**
- Knowledge base, portal-side surfaces, live chat / virtual-agent equivalents (already settled in `CLAUDE.md`).
- Real ServiceNow data integration. All data is mock; structure may mirror real conventions, content does not.
- In-app template editor. Personal/group templates are JSON files on disk for MVP; editor lands post-MVP.
- Reporting / export / multi-row search operations.

---

## 4. Locked technical decisions

- **API framework** — Hono (already scaffolded).
- **Web framework** — React 19 + Vite + TS + Tailwind v4 + shadcn nova preset (already scaffolded).
- **Data fetching** — TanStack Query.
- **Persistence shape (chassis pass)** — In-memory + seed-on-reload. API is a real HTTP layer returning mock data with simulated latency, so UI wiring (TanStack Query, optimistic updates) is real from day one.
- **Persistence shape (post-chassis)** — Postgres in Docker. ORM choice (Drizzle / Prisma / raw SQL) deferred to when real data shape is in front of us.
- **Mock-data hygiene** — Per `CLAUDE.md`: seed-data work in fresh sessions; no real ticket text, names, or screenshots in commits. Operational rule: header comment in every seed file noting it was built in an isolated session.

---

## 5. Proposed defaults — awaiting confirmation on resume

These were presented in the paused session but not explicitly confirmed item-by-item. Resume by reading this section and pushing back on anything wrong.

**Repo structure**
- Keep `api/` and `web/` as siblings. Add a `shared/` (TypeScript-only) workspace for cross-cutting types: `Ticket`, `Field`, `Template`, etc. Either pnpm workspaces or a TS path alias.

**Testing**
- Vitest for targeted unit/component tests in `web/` and `api/`. Focus on the field renderer, the unified-Request collapse logic, the hotkey registry, and the mock API + simulated-latency wrapper.
- Playwright for one or two end-to-end happy paths once the chassis works.
- No snapshot-everything coverage chasing.

**Branching & commits**
- Trunk-based on `main`; feature branches for non-trivial work.
- Keep existing commit-prefix style (`scaffold(web):`, `docs:`, `chore:`).

**Seed-data session hygiene**
- All seed-data work happens in a fresh `claude` session in this repo.
- Header comment in every seed file: `// Built in isolated session; no real-system data referenced.`
- Real-system *structural* notes (e.g., "RITM holds customer comments") may live in memory / `CLAUDE.md`; real-system *content* never.

**Templates UX (MVP)**
- `seeds/templates/group.json` and `seeds/templates/personal/<agent-id>.json`. Hand-edited / seeded like tickets.
- No in-app editor in MVP.

**Command palette**
- Use `cmdk` (small library). Enumerates registered hotkeys/actions; type to filter.

**Search UX (Phase 3)**
- Gmail/Linear-style: a search input that supports inline filter tokens (e.g., `category:password state:open assignee:me`). Familiar pattern, screen-reader-friendly with proper ARIA.
- User view = the record-chassis pattern with different content: profile header + filterable ticket list (Incidents + Requests, all states).
- Opening a user from any context (ticket caller field, search result, `cmd+K`) takes you to the user view in one step. No "search returns a link, click, page-load, click again" pattern.

**Phasing within the MVP**
1. **Phase 1 — Incident view, end-to-end.** Validates the chassis: header, field sections, activity feed, composer, tool rail, templates panel, hotkey registry, command palette, focus styling. Demoable on its own.
2. **Phase 2 — Request unified view.** Mostly: model REQ/RITM/SCTASK, write merge logic, add tree-aware actions (inline team reassignment). Same chassis renders it.
3. **Phase 3 — Search.** Field-scoped filter tokens + per-user unified ticket history.

**Relationship to inspiration prototype** (`~/Projects/helpdesk-automation/claude/`)
- Use it as the **structural** blueprint: same primitives — `RecordHeader`, `RecordPageLayout`, `CollapsibleSection`, `FieldRenderer` driven by `FieldSpec`, `ComposeBox`, `ActivityFeed`, `ToolRail` with panels.
- Build them fresh in our Tailwind v4 + shadcn stack. Do not port code wholesale.
- Bake in hotkeys, a11y, optimistic updates, simulated latency, and the Request merge logic — none of which the prototype has.
- Mock data lives in our own `seeds/` (built in isolated sessions), not copied from the prototype's data files.

---

## 6. Open items for next session

1. **Confirm or push back on every item in §5.** Each is a default, not a decision.
2. **Propose 2-3 approaches with tradeoffs.** This step was skipped at pause. Candidates to present properly:
   - **A.** Chassis-first generic primitives, then specialize record types.
   - **B.** Vertical Incident slice first (full feature stack on one record type), refactor toward shared primitives when building Requests.
   - **C.** Hybrid — adopt the inspiration prototype's component *structure* as the architectural blueprint, build fresh in our stack, bake in what the prototype lacks (hotkeys, a11y hardening, perf, Request merge).
   - The hybrid is the leading recommendation but needs to be presented properly with tradeoffs.
3. **Section-by-section design approval** per the brainstorming checklist: architecture, components, data flow, mock-data + seed strategy, performance instrumentation, accessibility, testing.
4. **Finalize this spec** (replace draft with approved version) and run the spec self-review.
5. **Hand off to `writing-plans`** to produce the implementation plan.

---

## 7. Resume protocol

A fresh `claude` session in this repo can pick up by:
- Reading this file end-to-end.
- Reading the project memory files: `project_request_shape.md`, `project_incident_overview_tab.md`, `project_search_requirements.md`, `feedback_legacy_baseline_vs_dropping.md`, `project_brainstorm_resume_2026_05_14.md`.
- Re-invoking `superpowers:brainstorming` and continuing from §6 above.

Do not treat §5 as approved on resume. The user should re-confirm.
