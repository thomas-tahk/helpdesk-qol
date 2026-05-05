# CLAUDE.md

This file is the project context for Claude Code. Treat it as authoritative for project decisions, working norms, and constraints.

## Project

Internal IT ticketing tool, built as a parallel/replacement layer over an existing enterprise ticketing system. The goal is felt smoothness and quality-of-life features the existing system doesn't deliver — particularly around speed, keyboard/screen-reader accessibility, and templated workflows for common ticket actions.

Built for the author and a small team of agents. A wider pilot is possible but not required. The repo is public on GitHub, but the project is **not** designed around an imagined recruiter or interviewer — portfolio use is incidental. README can be short and operational.

## Stack

**Frontend**
- React + Vite + TypeScript
- Tailwind CSS. The existing partial mockup at `~/Projects/helpdesk-automation/claude/` is loose inspiration for how the frontend is structured and styled — reference it for layout patterns and visual feel, not as a source of truth. No obligation to mirror its tokens, class names, or component breakdown.
- TanStack Query for caching, prefetching, optimistic updates
- shadcn/ui (Radix primitives + Tailwind styles, copied into the repo). Chosen specifically because Radix's ARIA correctness matters for screen-reader users on the team, not as a styling preference.

**Backend**
- Node + TypeScript
- Hono **or** Express — undecided; pick when there's code in front
- ORM: Drizzle, Prisma, or raw SQL — undecided; pick when there's code in front
- Postgres in a Docker container for local development. SQLite (local file or Turso) is an acceptable fallback if Postgres feels heavier than warranted, but Postgres is the default because it's the most transferable backend skill to build.

**Dev & deployment**
- Docker Compose for local DB
- Deployment is deferred indefinitely. If/when needed, $0 paths first; a Hetzner VPS at ~$4/mo is the floor. The dollars-cost concern is a deployment-time decision, not a stack decision.

## Performance standard

**Performance is not a feature; it's a standard every feature has to meet.** Felt smoothness is the load-bearing impression of the project.

- Every interaction visibly responds in <100ms — hard target for common UI actions (typing, clicks, navigation, mode toggles, opening templates)
- Operations complete in <500ms by default. If a path can't realistically hit this (complex search, large renders), flag it and decide together before accepting a slower budget.
- Spirit of the rule: nothing in the agent's daily flow should feel laggy. The numbers are the standard, not a literal ceiling on every code path.
- Optimistic updates: UI flips state instantly, server request happens in background, rolls back on failure
- Local caching and prefetching wherever applicable (TanStack Query handles much of this)

In local development, simulate a small randomized latency on backend calls (e.g., 50–300ms) to actually exercise optimistic-update flows.

## Accessibility

An accessibility-first user is part of the target audience — partially-sighted, heavy keyboard navigation, screen reader, large browser zoom. In the legacy tool today, that looks like tabbing many times to land on the right field, or taking stabs at clicking while heavily zoomed in. The new tool must not reproduce this. Concrete targets:

- Strong, high-contrast focus rings that survive heavy browser zoom
- Logical tab order; skip links to bypass long sequences
- Keyboard shortcuts and macros to jump directly to fields and actions — this is the QoL gap in the existing system, not "keyboard-first navigation" as an end in itself
- Possibly a command palette (cmd+K style) — high leverage for both accessibility and power-user workflow
- No hover-only interactions
- ARIA correctness comes from Radix/shadcn primitives, not rolled by hand

A dedicated session to inventory the specific friction points is still on the to-do list.

## MVP scope

Using the original feature numbering for continuity with prior planning notes.

In scope:
- **#1 — Ticket info display** (the at-a-glance view)
- **#3 — Ticket fields / contents** (the editable detail surface)
- **#4 — Ticket actions** (keyboard shortcuts and macros for common operations)
- **Templates** — live inside #3 and #4, not a separate bucket. Cover:
  - Closing-ticket templates for common issues
  - Emails to non-IT departments and third-party vendors (partially exist in ServiceNow already)
  - Documentation templates for work notes and descriptions
  - Customer-comms templates with external KB links, troubleshooting steps, diagnostic questions
- **#5 — Search** (built last, may be dropped if time runs out). Covers ticket and user-record search. KB search is out (see below).
- **#7 — Performance** is a standard, not a feature (see Performance standard above)

Out of MVP:
- **#6 — Knowledge base** (cut entirely; the real system has a portal-side KB element we are not replicating)
- KB search (was bundled with KB)
- Anything portal-side / non-agent-facing
- Live chat / virtual agent equivalents — observed in the legacy tool (used a couple times a month against hundreds-to-thousands of tickets), but not in scope here unless explicitly added later

## Mock data — strict rules

- All content is fake: names, ticket text, user IDs, timestamps. Generated via Faker or a hand-written seed script.
- Structure and patterns may mirror real-system conventions (categories, queue conventions, typical work-note shapes), but no real text.
- **No real ticket text in commits, ever, even temporarily. No real names as placeholders. Screenshots only on mock data.**
- Seed-data work happens in **separate Claude Code sessions** — fresh `claude` process started in this repo, no `/resume` from any session where the real system was discussed in detail. Build seed scripts from generic schema specs, not from screenshots or pasted real examples. Wariness about training-data leakage here is earned, not paranoid.
- If real ticket text, real names, or anything that looks copied from the real system surfaces mid-session (paste, screenshot, recall), do not write it to disk. Flag it and ask before continuing.

## Working norms with Claude

The pacing rule, verbatim: **"fastest I can be without oversight being taken from me."**

Practical translation:
- Setup, configs, boilerplate, deployment scaffolding: lean heavy on AI; generate-first is fine
- Application logic, data model, anything that will be maintained beyond first commit: AI as explainer and reviewer, not generator. Explain before generating.
- When unsure which side a task falls on, ask.
- When AI claims "this is the standard pattern" or similar, **cite a source or reference**
- **Small diffs over large drops.** The unit is "a diff I can read line by line," not "a generated file"
- I am piloting; AI is assisting

## Communication style

- Plain language. No jargon-for-jargon's-sake. If a term is doing real work, use it; if a plainer word fits, use the plainer word.
- My wording is canonical when I've chosen it. Don't tidy my categories into shapes that aren't mine — check rather than reshape.
- Free-form discussion is fine; don't force structured pickers when they get tedious.
- Clarifying questions are welcome from both directions.

## Claude Code setup (forward-looking)

- **CLAUDE.md** (this file) is the foundational context. Update as decisions firm up.
- **Hooks**: add lint/format hooks early so any file Claude Code writes goes through them automatically. Forces consistency without me remembering.
- **MCP**: add a Postgres MCP once the DB is up so Claude Code can inspect schema and run queries directly instead of guessing types from code.
- **Skills, subagents, agent teams, plugins**: defer until there's a specific need.

## Open decisions, to make when needed

- Hono vs Express
- ORM (Drizzle vs Prisma vs raw SQL)
- Whether to stay on Postgres or switch to SQLite (only if Postgres feels heavy in practice)
- Persistence shape during early dev (in-memory + reseed each load, vs persisted DB from day one)

## Still to discuss (planning thread)

The five-scoping-question framework had: Diagnosis, MVP scope, Audience/demo, Technical stack, Build discipline. The first four are essentially settled (with the open items above). **Build discipline** has not been worked through yet — project structure, commit hygiene conventions, testing approach, branching, how seed-data sessions stay separated from real-system-discussion sessions in practice. That's the next planning conversation, separate from build work itself.
