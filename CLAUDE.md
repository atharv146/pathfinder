# PathFinder — Claude Code Project Memory

This file is auto-loaded by Claude Code at the start of every session. Keep it lean — full decision history and rationale lives in `master-spec-doc.md`, not here. Read that file for deeper context; treat this one as the fast-load summary.

## What this is
A free, student-owned app guiding immigrant and first-generation students (and their families) through college prep, grades 6–12. Core differentiator: real, honest, specific content — not generic AI-generated advice. See `master-spec-doc.md` Section 1 for the full mission.

## Tech stack
- Frontend: Next.js (App Router) + Tailwind v4 + TypeScript, at `app/` — the real production app, not a prototype. `pathfinder-app.jsx` at the repo root is historical reference only.
- Backend/DB: Supabase project — URL `https://kvnmydvsffjvrsndnawd.supabase.co` — DO NOT create a new project, this one has real signups. Not yet wired into the Next.js app (deliberately deferred).
- Hosting: **Vercel — live at https://pathfinder-atharv.vercel.app, auto-deploying on every push to `master`.** Project name `pathfinder`, connected to the GitHub repo via the Vercel GitHub App. Root Directory is explicitly set to `app` (don't let it revert to auto-detect — breaks path aliases on git-triggered builds). SSO/Deployment Protection is off (public app). See `master-spec-doc.md` Decisions Log, Aug 11 entry, for the full setup story if this ever needs revisiting.
- Repo: `atharv146/pathfinder` (public) — https://github.com/atharv146/pathfinder

## Current status (update this section, keep it current — don't let it go stale)
- **The real app exists and runs.** Scaffolded at `app/` — Next.js (App Router) + Tailwind v4 + TypeScript. `npm run dev` (via `.claude/launch.json`) and `npm run build` both work clean. Live pages: `/`, `/roadmap`, `/roadmap/[grade]` (all 7 grades, real content, expand + localStorage mark-as-done), `/guide`, `/guide/[slug]` (all 6 parent guide articles), `/ask-ai` (honest placeholder, not wired to a backend). Repo is connected and pushed — `atharv146/pathfinder`, local and `origin/master` in sync.
- **Content:** roadmap source of truth is `content/roadmap-content-v4.md`, parses into `app/src/data/roadmap.json` (47 items, grades 6–12). Parent guide content ported **unmodified** into `app/src/data/guide-articles.json`. No content pass has happened since v4 — the deeper pass (Next Steps Sequence step 3) hasn't started.
- **Design (as of Aug 3, 2026 — read `master-spec-doc.md` Section 5 in full before touching styling):** went through two rejected iterations (amber/ember-on-near-black, then a bolder orange-gradient version) before the user supplied three reference videos, which were frame-extracted with ffmpeg and matched directly. Current system: true black (`#000`) grounds, Instrument Serif display type, hairline `OrbitField` orbital graphic, IBM Plex Mono corner labels, monochrome numbered stat index. This is the first pass not immediately rejected, but **not explicitly signed off as final** — confirm with the user before building further on top of it or treating it as settled.
- **Two real bugs were found and fixed in the design work, not just style opinions:** (1) a word-spacing bug in the scroll-reveal text component (whitespace-collapse inside an overflow-hidden wrapper — fixed with margin instead of a space character), (2) a genuine low-contrast bug (muted text measured 2.98:1 against the background, below WCAG AA's 4.5:1 minimum) — this was the real cause of the "text sinking into the screen" complaint, not animation or clipping. When tuning any muted/secondary text color, check computed contrast ratio, don't eyeball it.
- **Preview-tool caveat:** the sandboxed browser pane used for verification has `document.hidden === true`, which freezes `requestAnimationFrame` and can make working animations look broken during automated checks. `RevealText`/`FadeIn` carry a timed fallback that force-reveals content regardless, so this can't cause a real user-facing bug — but don't mistake the preview tool's own limitation for an app bug during verification.
- **Motion/3D layer (Aug 14, 2026 — uncommitted, needs a real-browser look):** GSAP (+ ScrollTrigger/SplitText/DrawSVG — all free now), Lenis smooth scroll synced to the GSAP ticker, and React Three Fiber are installed. Added `SmoothScroll`, `SplitReveal`, `CountUp`, `ScrollProgress`, `CustomCursor`, `Starfield`, `RoadmapPath` (scrubbed DrawSVG path, nodes sampled via `getPointAtLength`), `TruthSpotlight` (cursor-as-torch), `hero/HeroScene` + `hero/HeroVisual` (WebGL hero, **progressive enhancement only** — device-capability + reduced-motion gated, SVG `OrbitField` is the floor). All GSAP plugins register in `src/lib/gsap.ts` — import from there, not from `gsap` directly. **Rule learned twice now: never author reveal-dependent content with inline `opacity: 0`** — hide at runtime via JS and add a failsafe timeout, so a missed trigger leaves content visible instead of permanently blank. See `master-spec-doc.md` Aug 14 log entry.
- **Verification caveat got worse:** the preview pane now reports *both* `document.hidden === true` (rAF frozen — measured 0 frames/1.5s) *and* `prefers-reduced-motion: reduce`, so GSAP/framer/WebGL animation cannot be observed there at all, and post-scroll screenshots come back stale/black. Verify animated work with `npm run build` + programmatic DOM/geometry checks, and ask the user to eyeball the real browser. `?force3d=1` overrides the reduced-motion gate on the 3D hero for QA.
- **Not yet built**: Supabase wiring (auth, profiles), working chatbot backend, deployment. Deliberately deferred — see Next Steps Sequence.
- **Platform note:** user is moving primary development to a MacBook. No project migration needed — clone the repo fresh, `npm install` in `app/`. Nothing machine-specific is checked in.
- **Build order (see `master-spec-doc.md` Section 16, "Next Steps Sequence"):** (1) fix/finish app content — done, (2) fix the generic-AI-look design — done but unconfirmed as final, (3) improve content further, (4) full design pass (incl. mobile/responsive — not yet checked), (5) more features/polish incl. shrinking the AI chat UI, (6) accounts/database/backend, (7) more complex features. Don't jump ahead to step 6 without the user explicitly redirecting.

## 🚨 READ FIRST — motion levels, and the bug that wasted several sessions
**The user's machine has macOS "Reduce Motion" enabled.** Every animated surface used to gate on `prefers-reduced-motion` directly, so the 3D hero, physics pit, all page backdrops, the wire cage and every scroll reveal were correctly and silently switched **off** for them. They spent multiple rounds reporting "I don't see any 3D, nothing moves, it's static" — and they were right. Measured proof: same page, `canvasCount` went 0 → 4 after the fix.

**Never gate animation on `matchMedia("(prefers-reduced-motion: reduce)")` directly again.** Use `src/lib/motion.ts`:
- `shouldRender3D()` — true at `full` *and* `calm`; only `still` removes geometry.
- `shouldAnimateAggressively()` — `full` only. Gate bounce/overshoot, scroll-scrub, parallax and Lenis behind this.
- OS reduced-motion maps to **`calm`, never `still`** — reduce motion means calmer motion, not a dead page.
- An explicit user choice (localStorage `pf-motion`) always beats the OS. `MotionToggle` renders the control plus a first-run notice explaining the situation when the OS is suppressing things.

## ⚠️ Typography changed (Aug 14, 2026) — the serif is gone
**Display face is now Figtree (bold geometric sans), not Instrument Serif.** The serif was the single biggest reason the site read as a generic template beside the user's references (intrepidautomation.com, zypsy.com, rejouice.com) — all of which run a bold geometric sans. Use the `.display` / `.display-md` classes (weight 800/700, tight negative tracking), **not** `font-display` + `font-normal`. Instrument Serif is retained only as `--font-serif` for rare accents.

Also added and load-bearing:
- **Light-section inversion** (`bg-bone` `#eef0ed`, dark type inside). Intrepid alternates dark → light → dark, and this does more to break up a long page than any single animation. Use it; don't let the page become one black slab again.
- **`IntroLoader`** — colour-wash + counter + panel-wipe opening, once per tab via sessionStorage, with a hard 4.5s failsafe that always restores `body` overflow. It renders *over* a complete page, never as a gate in front of an empty one.
- **`WireCage`** — morphing hyperboloid built from straight lines (twist angle animates); `ClosingWire` sets huge type inside it.
- **`Marquee`** is full-bleed (`left-1/2 w-screen -translate-x-1/2`) with Zypsy-style boxed cards.

## ⚠️ Palette update (Aug 14, 2026) — colour is now allowed, as light
The strict near-monochrome rule below was **relaxed by the user**, who rejected the monochrome result repeatedly as "plain / boring / just black white and stars." Colour now enters as *light over true black*, never as flat pigment: `.aurora` (multi-stop drifting gradient field), `.glow-signal` / `.glow-ember` (emissive type — **single words only, never paragraphs**), `.edge-glow` (gradient-masked panel borders), `.scanlines`. True black grounds, Instrument Serif, hairline geometry and the editorial structure all still stand. The one deliberate exception is `.paper` (cream) in `ResumePaper`, justified contextually because an application is physically a document — it is not licence for a cream site palette. Also added: `ResumePaper`, `physics/GradePit` + `GradePitSection` (Rapier physics, canvas-texture numbers — do not swap to troika/Text3D, they fetch a font at runtime), `Marquee`.

## Design direction (rewritten Aug 14, 2026 — the old restrictive version was retired at the user's explicit request)
The user's direction is now **maximalist and premium**: heavy 3D, real physics, bold per-page colour, kinetic type. The earlier "stay near-monochrome, ask before major visual work" rules were blocking that and the user asked for them gone. What replaced them:

1. **Every page commits to ONE bold accent**, set via `data-accent` on `PageFrame` (`teal` home · `lime` roadmap · `coral` guide · `violet` ask-ai). Taken from the Intrepid reference, which uses a single coral against monochrome. Use `.glow-accent`, `.aurora-accent`, `.text-accent` — never hardcode a hex.
2. **Each page gets its own 3D geometry, not the same scene recoloured** — `Backdrop variant="grid" | "sheets" | "swarm"`. Add a new variant for a new page rather than reusing one.
3. **Text arrives, it doesn't fade** — `KineticText` (GSAP `back.out` overshoot) for headings; `SplitReveal` for calmer body-adjacent lines.
4. Reference sites the user supplied and liked: zypsy.com (boxed marquee cards, tight/small), intrepidautomation.com (corner brackets, mono index labels, one bold accent), studio-size.com, edpnc.com, collectiveoffice.com (fonts/design). Match these, not generic AI-landing-page conventions.
5. **Still true, and non-negotiable:** all WebGL is progressive enhancement behind a capability + reduced-motion gate with a real fallback; and **never author reveal-dependent content with inline `opacity: 0`** — hide at runtime, add a failsafe timeout, so failure leaves content visible rather than blank.

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
