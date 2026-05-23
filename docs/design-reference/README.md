# Design reference

Visual reference material for the redesign target — what the existing customer-facing portal looks like today, used as the baseline we're improving against.

## What belongs here

Public-portal surface captures only:

- Unauthenticated entry pages (e.g. the `/esc` landing)
- Navigation, section labels, blank/empty forms, layout, branding
- Empty-state screens

## What does NOT belong here

- Agent-side / internal UI of any kind
- Any view of a specific ticket, user record, or search result
- Any capture that contains real ticket text, real names, real IDs, or any content reached by drilling into a record
- PDFs, exports, or pastes from the real system

See `CLAUDE.md` → "Mock data — strict rules" → "Design-reference carve-out" for the full policy.

## Hygiene before committing a new image

1. Open the image and scan for: visible ticket numbers, named users (caller/agent/manager), ticket body text, search results, autocomplete suggestions, tooltip content, browser chrome (URL bar showing a deep link, autofill, extension icons revealing context).
2. If any of the above is visible, do not commit. Recapture from a clean browser profile in a private window, signed out.
3. Filename: short, descriptive, kebab-case. Example: `esc-landing.png`, `esc-submit-request-form.png`.

## Session hygiene

Don't edit `api/src/seeds/` (or anywhere else that touches mock ticket content) in the same session where you've opened images in this folder. Open a fresh `claude` session for seed work, with no `/resume` from a design-reference session.
