# PathFinder — Claude Code Project Memory

This file is auto-loaded by Claude Code at the start of every session. Keep it lean — full decision history and rationale lives in `master-spec-doc.md`, not here. Read that file for deeper context; treat this one as the fast-load summary.

## What this is
A free, student-owned app guiding immigrant and first-generation students (and their families) through college prep, grades 6–12. Core differentiator: real, honest, specific content — not generic AI-generated advice. See `master-spec-doc.md` Section 1 for the full mission.

## Tech stack
- Frontend: Next.js (App Router) + Tailwind v4 + TypeScript, at `app/` — the real production app, not a prototype. `pathfinder-app.jsx` at the repo root is historical reference only.
- Backend/DB: Supabase project — URL `https://kvnmydvsffjvrsndnawd.supabase.co` — DO NOT create a new project, this one has real signups. Not yet wired into the Next.js app (deliberately deferred).
- Hosting: **Vercel — live and auto-deploying on every push to `master`.** Project name `pathfinder`, connected to the GitHub repo via the Vercel GitHub App (repo access granted explicitly, separate from account login). Deployed Aug 11, 2026.
- Repo: `atharv146/pathfinder` (public) — https://github.com/atharv146/pathfinder

## Current status (update this section, keep it current — don't let it go stale)
- **The real app exists and runs.** Scaffolded at `app/` — Next.js (App Router) + Tailwind v4 + TypeScript. `npm run dev` (via `.claude/launch.json`) and `npm run build` both work clean. Live pages: `/`, `/roadmap`, `/roadmap/[grade]` (all 7 grades, real content, expand + localStorage mark-as-done), `/guide`, `/guide/[slug]` (all 6 parent guide articles), `/ask-ai` (honest placeholder, not wired to a backend). Repo is connected and pushed — `atharv146/pathfinder`, local and `origin/master` in sync.
- **Content:** roadmap source of truth is `content/roadmap-content-v4.md`, parses into `app/src/data/roadmap.json` (47 items, grades 6–12). Parent guide content ported **unmodified** into `app/src/data/guide-articles.json`. No content pass has happened since v4 — the deeper pass (Next Steps Sequence step 3) hasn't started.
- **Design (as of Aug 3, 2026 — read `master-spec-doc.md` Section 5 in full before touching styling):** went through two rejected iterations (amber/ember-on-near-black, then a bolder orange-gradient version) before the user supplied three reference videos, which were frame-extracted with ffmpeg and matched directly. Current system: true black (`#000`) grounds, Instrument Serif display type, hairline `OrbitField` orbital graphic, IBM Plex Mono corner labels, monochrome numbered stat index. This is the first pass not immediately rejected, but **not explicitly signed off as final** — confirm with the user before building further on top of it or treating it as settled.
- **Two real bugs were found and fixed in the design work, not just style opinions:** (1) a word-spacing bug in the scroll-reveal text component (whitespace-collapse inside an overflow-hidden wrapper — fixed with margin instead of a space character), (2) a genuine low-contrast bug (muted text measured 2.98:1 against the background, below WCAG AA's 4.5:1 minimum) — this was the real cause of the "text sinking into the screen" complaint, not animation or clipping. When tuning any muted/secondary text color, check computed contrast ratio, don't eyeball it.
- **Preview-tool caveat:** the sandboxed browser pane used for verification has `document.hidden === true`, which freezes `requestAnimationFrame` and can make working animations look broken during automated checks. `RevealText`/`FadeIn` carry a timed fallback that force-reveals content regardless, so this can't cause a real user-facing bug — but don't mistake the preview tool's own limitation for an app bug during verification.
- **Not yet built**: Supabase wiring (auth, profiles), working chatbot backend, deployment. Deliberately deferred — see Next Steps Sequence.
- **Platform note:** user is moving primary development to a MacBook. No project migration needed — clone the repo fresh, `npm install` in `app/`. Nothing machine-specific is checked in.
- **Build order (see `master-spec-doc.md` Section 16, "Next Steps Sequence"):** (1) fix/finish app content — done, (2) fix the generic-AI-look design — done but unconfirmed as final, (3) improve content further, (4) full design pass (incl. mobile/responsive — not yet checked), (5) more features/polish incl. shrinking the AI chat UI, (6) accounts/database/backend, (7) more complex features. Don't jump ahead to step 6 without the user explicitly redirecting.

## ⚠️ Design direction — read before touching any UI
The current design (true black, Instrument Serif, hairline orbital graphic — see "Current status" above and `master-spec-doc.md` Section 5 for full history) was built by matching real reference videos frame-by-frame, not from a verbal brief — that's what made this pass land after two earlier ones didn't. Before doing further major visual work:
1. Check if the user has provided specific reference sites/videos/screenshots — use those as the literal brief, matched closely, same as this pass did.
2. Do NOT default to cream+serif+terracotta, near-black+neon-accent, purple-gradient-on-black, blurred gradient-blob heroes, or generic card-grid-with-hairline-dividers layouts — all flagged as clichés during this project's design iterations.
3. Ask what's changing if it's not specified, and don't treat the current system as final without the user explicitly confirming it.

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
