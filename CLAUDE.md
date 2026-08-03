# PathFinder — Claude Code Project Memory

This file is auto-loaded by Claude Code at the start of every session. Keep it lean — full decision history and rationale lives in `master-spec-doc.md`, not here. Read that file for deeper context; treat this one as the fast-load summary.

## What this is
A free, student-owned app guiding immigrant and first-generation students (and their families) through college prep, grades 6–12. Core differentiator: real, honest, specific content — not generic AI-generated advice. See `master-spec-doc.md` Section 1 for the full mission.

## Tech stack
- Frontend: React (currently a single-file prototype — `pathfinder-app.jsx` — not yet split into a real Next.js app)
- Target production stack: Next.js (App Router), Tailwind CSS, Supabase (auth + database)
- Backend/DB: Supabase project — URL `https://kvnmydvsffjvrsndnawd.supabase.co` — DO NOT create a new project, this one has real signups
- Hosting: Vercel (connect to GitHub repo for auto-deploy on push) — not yet fully wired
- Repo: `atharv146/pathfinder` (public) — https://github.com/atharv146/pathfinder

## Current status (update this section, keep it current — don't let it go stale)
- **The real app now exists and runs.** Scaffolded at `app/` — Next.js (App Router) + Tailwind v4 + TypeScript. `npm run dev` (via `.claude/launch.json`) and `npm run build` both work clean (TypeScript + ESLint pass). Live pages: `/`, `/roadmap`, `/roadmap/[grade]` (all 7 grades, real content, expand + localStorage mark-as-done), `/guide`, `/guide/[slug]` (all 6 parent guide articles, quick-answer box + key-term glossary), `/ask-ai` (honest placeholder, not wired to a backend).
- **Content:** roadmap got a real depth + prose pass — source of truth is `content/roadmap-content-v4.md`, which parses into `app/src/data/roadmap.json` (47 items, grades 6–12). Parent guide content was ported **unmodified** into `app/src/data/guide-articles.json` (don't touch it without separate direction, per standing rule). `pathfinder-app.jsx` at the repo root is now historical reference only — the real content lives in `app/src/data/`.
- **Design:** first real pass done, directed by user-supplied references (zypsy.com, ethicallifeworld.com, igloo.inc, a WLT Design screenshot) — near-black canvas, amber/ember glow + signal-teal accents, Space Grotesk/IBM Plex Mono/Inter. Reading surfaces stay calmer than hero/nav chrome by design. See `app/src/app/globals.css` for tokens. This replaces the old cream/terracotta/Fraunces placeholder — that palette is gone from the live app now, though the warning below stays relevant for future visual decisions not yet covered by a real reference.
- **Not yet built**: Supabase wiring (auth, profiles), working chatbot backend, git remote connection, deployment. All deliberately deferred — see Next Steps Sequence.
- **Known loose end:** `create-next-app` auto-ran `git init` inside `app/`, creating a nested repo separate from the working-directory root. Needs a decision (flatten vs. treat `app/` as the real repo root) before connecting to `atharv146/pathfinder` — don't just connect blindly.
- **Build order (see `master-spec-doc.md` Section 16, "Next Steps Sequence"):** (1) fix/finish app content — first pass done, (2) fix the generic-AI-look design — first pass done, (3) improve content further, (4) full design pass (incl. mobile/responsive — not yet checked), (5) more features/polish incl. shrinking the AI chat UI, (6) accounts/database/backend (Supabase auth + real chatbot backend), (7) more complex features. Currently between steps 2 and 3 — don't jump ahead to step 6 without the user explicitly redirecting.

## ⚠️ Design direction — read before touching any UI
The live app's design (near-black canvas, amber/ember glow, Space Grotesk/IBM Plex Mono/Inter — see "Current status" above) was built from real reference sites the user provided, not a default. That's what makes it legitimate despite sitting close to the "near-black + neon accent" cliché flagged below — a directed choice grounded in real references is fine; guessing at "futuristic/sci-fi" without one is not. Before doing further major visual work:
1. Check if the user has provided specific reference sites/screenshots — use those as the real brief, same as this pass did.
2. Do NOT default to cream+serif+terracotta, generic purple-gradient-on-black neon, or generic card-grid-with-hairline-dividers layouts — these are exactly the clichés to avoid when there's no real reference to follow.
3. Ask what's changing (palette? layout? both?) if it's not specified.

## Content rules
- Never invent statistics, organization names, or policy specifics. If unsure, flag it for verification rather than guessing.
- All roadmap/guide content must be genuinely researched and specific — generic "study hard and get good grades" filler is a regression, not a feature.
- Content stays general/major-agnostic for V1. Major-specific personalization is V2/V3 — see `master-spec-doc.md` Section 3B. Don't build it early.

## Do NOT
- Add features outside V1 scope (see `master-spec-doc.md` Section 2) without the user explicitly approving the scope change first.
- Regenerate or "improve" the roadmap/parent-guide content without being asked — it's already been through multiple real revision passes.
- Make irreversible or costly decisions (recreating the Supabase project, force-pushing, deleting data) without explicit confirmation.

## After material changes
Update the Decisions Log and Current Build Status sections in `master-spec-doc.md` — this is a standing user instruction, not optional.

## Reference files in this repo
- `master-spec-doc.md` — full mission, scope, decisions log, build status (the deep-context doc)
- `app/` — the real Next.js app (source of truth going forward)
- `content/roadmap-content-v4.md` — human-readable source of truth for roadmap content (parses into `app/src/data/roadmap.json`)
- `pathfinder-app.jsx` — historical prototype, superseded by `app/`. Still useful as a record of the original UI interaction patterns, but no longer the source of truth for content or code.
