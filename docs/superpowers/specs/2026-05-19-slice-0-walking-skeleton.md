# Slice 0 — Minimum Walking Skeleton

**Status:** Active. Companion to `2026-05-14-helpdesk-qol-mvp-design.md` (the brainstorm draft).

## Why this exists

The 2026-05-14 brainstorm paused before the "propose approaches" step. On resume (2026-05-19), the user redirected: confirming a list of textual defaults without a clickable artifact is low-signal. The Incident chassis (Phase 1) is well-trodden territory — iteration against running code beats design-on-paper. The brainstorm proper is deferred to Phase 2 (Request unified-view merge), where design risk is real.

## Goal

A single clickable Incident in a browser, end-to-end, in one session. We then iterate against it.

**Done when:**
- `api` serves `GET /incidents/:id` returning one mock Incident with 50–300ms simulated latency.
- `web` renders that Incident: header (number, short description, state, priority), a small field grid, a work-notes list, a no-op composer textarea.
- TanStack Query wired up with a visible loading skeleton.
- A hotkey registry stub with one binding (`c` focuses the composer) proves the registry works.
- Focus styling visible (relies on existing ring tokens in `index.css`).

## Out of slice 0 (intentionally)

- Editing, mutations, optimistic updates.
- Command palette (`cmd+K`).
- Templates.
- Request unified view (Phase 2).
- Search (Phase 3).
- `shared/` workspace — `web` declares its own response type to match `api`. Deduplicate when there's a second cross-cutting type.
- Tests — no Vitest/Playwright yet. Add when chassis stops moving daily.

## Data model (slice 0 only — not load-bearing)

```ts
type IncidentState = 'new' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
type WorkNoteKind = 'work_note' | 'comment';

interface WorkNote {
  id: string;
  author: string;
  kind: WorkNoteKind;
  body: string;
  createdAt: string; // ISO
}

interface Incident {
  id: string;             // e.g. INC0001234
  shortDescription: string;
  description: string;
  state: IncidentState;
  priority: 1 | 2 | 3 | 4 | 5;
  caller: string;
  category: string;
  assignmentGroup: string;
  assignedTo: string;
  openedAt: string;       // ISO
  workNotes: WorkNote[];
}
```

This shape will change when real ServiceNow conventions are modeled. Slice 0 only needs enough to drive layout decisions.

## Files

```
api/src/index.ts              # add GET /incidents/:id + latency middleware
api/src/seeds/incidents.ts    # one mock Incident; header comment per CLAUDE.md
api/src/types.ts              # Incident, WorkNote types (api-local)

web/src/main.tsx              # wrap with QueryClientProvider
web/src/lib/api.ts            # fetch wrapper; API base URL
web/src/lib/hotkeys.ts        # tiny hotkey registry (stub: Map<key, handler>)
web/src/types.ts              # web-local Incident type matching api
web/src/App.tsx               # routes to IncidentView for now
web/src/components/IncidentView.tsx
```

## Endpoint

- `GET /incidents/:id` → 200 with Incident JSON, or 404.
- Simulated latency middleware: 50–300ms uniform random, applied to all non-`/health` routes.

## Hotkey choice (one binding)

- `c` → focus the composer textarea (provided no input/textarea is currently focused — avoid stealing keystrokes from typing).

Tiny registry shape so we don't paint into a corner:

```ts
type HotkeyBinding = { key: string; handler: (e: KeyboardEvent) => void; description: string };
function registerHotkey(b: HotkeyBinding): () => void;
```

A single keydown listener at the document level iterates registered bindings. No modifier handling yet (we'll add it when we need it — the `cmd+K` palette will force the question).

## Verification (handed to user)

The user runs verification commands; the assistant does not (per memory).

```bash
# terminal 1 — api
cd api && npm run dev

# terminal 2 — web
cd web && npm install @tanstack/react-query
cd web && npm run dev
```

Expected: `web` dev URL renders the Incident view with a brief skeleton on load. Pressing `c` focuses the composer. Refreshing shows the loading state again (no caching across reloads at slice 0).

## After slice 0

Likely next steps (decide when slice 0 is clickable):
- Field editing with optimistic updates (real test of the perf standard).
- A second Incident + route to switch between them (introduces routing).
- Command palette skeleton (`cmdk`).
- Template insertion into composer.

The Phase 2 brainstorm (Request unified view) reopens when we have the chassis to merge into.
