# PathFinder — Master Spec Doc

> **How to use this doc:** Paste the relevant section(s) into any AI tool (Lovable, Bolt, Claude, etc.) at the start of a new session, or share the whole doc when starting a big feature. Update "Current Build Status" and "Decisions Log" after every real work session. This doc is the source of truth — if it's not written here, it didn't happen, no matter what any AI tool remembers.

---

## 1. Mission

A single, student-owned app that guides immigrant and first-generation students and their families through the *entire* education-to-career journey — starting with college prep (6th–12th grade), and eventually expanding to community college transfer, and post-college immigrant career navigation. Built to fill the gap left by school counselors (who average ~38 minutes of guidance per student over 4 years) and existing tools that are either institution-first (colleges/schools are the paying customer) or narrow point-solutions (just scholarships, just a chatbot). This app is free-first, student/family-first, and specifically designed around immigrant-family friction points: visa/status-aware guidance, language/cultural gaps, parents without US education background.

---

## 2. V1 Scope — What We Are Building NOW

Do not add anything beyond this list without moving it here first and noting the date in the Decisions Log.

- **Auth / signup & login** (Supabase Auth)
- **Student profile** — grade level, target major(s)/college(s), GPA, extracurriculars, standardized test scores, special circumstances (immigration status category, first-gen status, language spoken at home)
- **Roadmap engine** — grade-by-grade checklist/guide (6th–12th), adjustable based on profile inputs (major/college goals)
- **AI chatbot** — answers student/family questions, handles "special case" concerns, routed to a free/cheap open model (see Section 6)
- **Parent-guidance section** — plain-language content explaining the US education system, written for parents without US college background; ideally available in-language later, but English-only is acceptable for v1
- **Basic content library** — curated, vetted guide articles (this is core IP — you are aggregating and simplifying scattered internet advice, not linking out to it)

---

## 3. Explicitly OUT of V1 (future modules — do not build yet)

Kept here so mid-session excitement doesn't cause scope creep. These are the future "lifecycle" modules once V1 is validated with real users:

- Community college → 4-year transfer roadmap module
- Post-college immigrant career navigation (OPT/H-1B timelines, credential translation, resume/interview coaching)
- Adult/non-traditional degree-completion pathways
- Skilled-trade / non-college pathway guidance
- In-language translation of full app content
- Peer/near-peer mentorship matching
- Institutional (B2B) tier for schools/counselors/nonprofits to license the platform
- Deadline tracker synced to external calendars
- Financial literacy module (net price calculators, loan basics)

When V1 is validated, promote items from this list into a "V2 Scope" section — don't build them early.

---

## 3B. Future Phases — Personalization & Pathway System (V2 / V3 — NOT v1)

This is the bigger long-term vision, captured here so it isn't lost, but explicitly deferred until V1 is built, tested with real users, and content is real (not AI-generated placeholder text).

**V2 — Personalization Engine**
- Onboarding captures dream college + major (or "undecided")
- Recommendation logic shows target / safety / reach schools based on the student's actual stats, compared against real admissions data (requires sourcing real data — not something an AI tool can accurately improvise)
- Past-admit example profiles for context ("students like you who got into X")
- Undecided-major users get a general template roadmap instead of a personalized one

**V3 — Major-Specific Pathway System**
- Wide selectable list of majors
- Each major has its own multi-year pathway: specific activities, coursework suggestions, relevant ECs, past-admit examples for that major
- Essentially a "system within the system" — many parallel roadmaps instead of one general one

**Why these are deferred, not declined:** both require real researched content/data behind them (admissions stats, major-specific pathways) rather than AI-improvised text — building this with placeholder content would repeat the exact "generic, low-trust content" problem already identified in V1. Build V1 well, validate with real users, then invest in sourcing real data/content for V2/V3.

---

## 3C. Deferred Polish Items (V1, but later — not scope creep, just sequencing)

- **Graphics/visuals** (charts, stats, illustrations for both student and parent sections — e.g., a graphic showing engagement benefits of starting early, or average pathway visuals). Deliberately sequenced *after* real content is finalized, since a polished chart illustrating a vague or unverified stat is worse than no chart — verify any statistic before visualizing it.

## 4. Data Model (plain language — translate to actual schema in Supabase)

**User / Student Profile**
- id, name, email, account type (student / parent)
- grade level (6–12)
- target major(s), target college(s)
- GPA, test scores (optional/self-reported)
- extracurriculars (list, freeform + tags)
- immigration/status category (optional, self-disclosed, sensitive — see Section 7 on privacy)
- first-gen status (yes/no)
- language spoken at home

**Roadmap Item**
- id, grade level, category (academics / ECs / tests / applications / financial aid)
- title, description
- applicable major/college tags (so it can filter/personalize)
- status (not started / in progress / done) — per user

**Chat Message**
- id, user id, timestamp, role (user/assistant), content
- flagged topics (e.g., if it touches immigration status/legal advice, for review/escalation logic)

**Content Article**
- id, title, body, category (roadmap / financial aid / parent guide / FAQ), source notes (for your own reference, not shown to user — see copyright note in Section 8)

---

## 5. Design Decisions

- App name (working): **PathFinder**
- **Current state (as of Aug 3, 2026, in `app/`):** the design system was rebuilt from three reference videos the user supplied (a DOSS ARP-style product site, a SHAGA controller site, a wine/hospitality site) plus a luxury-residence screenshot. It went through several iterations first (amber/ember-on-near-black, then a bolder orange-gradient version) that the user rejected as still looking generic — the frame reset came when actual reference videos were provided and matched frame-by-frame instead of working from a verbal "make it futuristic" brief.
- **Current palette/type:** true black (`#000000`) grounds, off-white "chalk" text, hairline `#1c1c20` borders, colour used only as a rare accent (ember `#d46438`, signal teal `#7fd4c6`) — not as full-bleed gradient sections. Display face is **Instrument Serif** (roman + italic pairing for headline couplets), body is Inter, labels/mono captions are IBM Plex Mono in small tracked-out uppercase pinned to viewport corners (`CornerLabels` component). Decorative graphic is `OrbitField` — hairline elliptical orbits with pulsing nodes and a wireframe cube core, replacing an earlier blurred-gradient-blob hero treatment that was itself flagged as a generic-AI pattern.
- **Superseded palettes, kept here only so they don't get reintroduced by accident:** cream/terracotta/Fraunces (the original placeholder), amber/ember-on-near-black with Space Grotesk (first real pass), full orange-gradient stat sections (second pass, felt too close to a template).
- **A real bug was found and fixed in this palette's first working version, not a style opinion — worth remembering the lesson:** dim text (`text-text-faint` at the time) measured 2.98:1 contrast against the background, below the WCAG AA minimum of 4.5:1 — genuinely too faint to read, which is what surfaced as "text sinking into the screen." Verify contrast with actual computed luminance ratios when tuning muted text colors, not by eye.
- Reveal/fade components (`RevealText`, `FadeIn`) carry a timed fallback that force-reveals content if `IntersectionObserver` never reports, so text can never be left permanently invisible — added after a preview-tool false alarm (the sandboxed browser pane had `document.hidden === true`, freezing `requestAnimationFrame`, which looked like a real bug in early verification passes but wasn't one in the actual deployed app).
- Before doing major visual work: check if the user has provided specific reference sites/videos/screenshots (real brief beats defaults — this is what turned the design around), and ask explicitly what's changing if it's not specified.
- Tone of voice: warm, plain-language, never condescending, avoids jargon or explains it immediately when used.
- Mobile-first is still the target — not yet verified at mobile viewports as of Aug 3, 2026. Known gap for the next design/responsive pass.

---

## 6. Chatbot Plan

- **Current state — not functional.** `pathfinder-app.jsx` has a `SYSTEM_PROMPT` drafted and a chat UI, but the send handler makes a raw client-side `fetch` directly to `https://api.anthropic.com/v1/messages` with no API key — this will always fail as written (401/network error), and even if a key were added, embedding an API key in client-side code would expose it publicly. This needs a real backend (e.g. a Next.js API route or Supabase Edge Function that holds the key server-side) before the chatbot can work at all — tracked as part of the "accounts/database/backend" step in the Next Steps Sequence below.
- **Model routing:** not yet decided for the real build. Two options on the table: (a) the original plan to route through OpenRouter to a free/cheap open model (DeepSeek/MiniMax), or (b) call the Anthropic API directly from a server-side route. Decide once the backend step starts — don't build the client-side call further until then.
- **System prompt draft (refine before launch):**
  > You are a warm, knowledgeable guide helping immigrant and first-generation students and their families navigate the U.S. college process. Explain things in plain language, assuming no prior familiarity with the U.S. education system. Never give legal immigration advice — for status-specific or legal questions, direct the user to consult a school counselor, immigration attorney, or a vetted nonprofit resource. Be encouraging but realistic. Ask clarifying questions when a request is ambiguous.
- **Escalation rule:** any message touching legal immigration status, mental health crisis, or abuse/safety concerns should be flagged and given a clear resource pointer, not just an AI answer.

---

## 7. Privacy & Trust Notes (critical for this specific audience)

- Be explicit and visible about what data is stored and why — this population is often wary of institutions.
- Immigration/status fields should be optional, clearly marked as "only used to personalize your guidance, never shared."
- Avoid any data-sharing/selling model (this is a core differentiator vs. Scoir/CollegeVine's B2B data models) — at least for personal/sensitive fields.
- Have a simple, honest privacy policy before any real users sign up, even in beta.

---

## 8. Content & Copyright Note

The core value of this app is *aggregating and simplifying* scattered advice — not copy-pasting other sites. All roadmap/guide content should be written in your own words based on research, never lifted verbatim from other sources.

---

## 9. Monetization Plan (sequenced, not immediate)

1. **Now → early users:** fully free, no paywall, to build trust and initial adoption.
2. **After traction:** optional premium tier (deeper/unlimited chatbot use, essay review, advanced tracking) — priced modestly.
3. **Parallel path:** B2B/institutional tier — schools, counselors, or nonprofits license the platform for their students (mirrors CollegeVine/Scoir's model, but keep the individual free tier intact).
4. **Do not charge individual families for the core roadmap/guide/basic chatbot** — this conflicts with the mission and your core differentiator.

---

## 10. Distribution Plan (for after V1 is built and tested)

Priority order:
1. High school counselors / college & career centers (especially high immigrant/first-gen districts)
2. TRIO / GEAR UP program coordinators
3. Immigrant/refugee community orgs, resettlement agencies, cultural centers
4. ESL / adult education programs (parent-side entry point)
5. Local trusted community touchpoints (ethnic grocery stores, community bulletin boards — vetted, not predatory ones like some notario services)
6. Targeted social content (TikTok/Instagram, r/ApplyingToCollege, r/FirstGenCollegeStudents, community Facebook groups)

First concrete move: outreach to 5–10 local counselors/community org directors, offer free access, gather feedback, let word of mouth start the spread.

---

## 11. Tech Stack (all free-tier to start)

- **App build:** Claude Code, writing directly against the target production stack (no more Lovable/Bolt AI-scaffolding tools — that path was abandoned; see Section 14).
- **Frontend:** Next.js (App Router), Tailwind CSS. `pathfinder-app.jsx` is the reference prototype for content + UI/interaction patterns, not code to ship as-is.
- **Backend/DB/Auth:** Supabase — existing project (`https://kvnmydvsffjvrsndnawd.supabase.co`), contains real signups from earlier testing, do not recreate.
- **Chatbot model:** not yet decided — see Section 6.
- **Hosting:** Vercel, connected to the GitHub repo for auto-deploy on push — not yet wired.
- **Version control:** GitHub (repo: `atharv146/pathfinder`, public, https://github.com/atharv146/pathfinder) — single source of truth.

Dedicated project email/accounts previously set up for: GitHub, Figma, Supabase, Vercel, Lovable/Bolt, OpenRouter — the Figma/Lovable/Bolt/OpenRouter accounts are no longer part of the active workflow but were kept rather than deleted.

**GitHub Student Developer Pack (claimed via education.github.com/pack):**
- Free domain (1 year) — claim early, use a `.app`, `.dev`, or `.tech` domain for legitimacy with schools/orgs
- GitHub Pro — free while a student
- $200 DigitalOcean credit (through 7/31/26) — good for hosting once past free tiers; does NOT cover third-party AI model API costs (Anthropic/OpenAI), so this won't offset Claude API usage
- $100 Azure credit — backup cloud option, DigitalOcean credit is the bigger one
- Note: Copilot Student sign-ups paused as of April 2026 — not essential to this workflow anyway
- Hold off starting the DigitalOcean credit clock until actually needed past free-tier limits

---

## 12. Known Free-Tier Limits to Watch (so nothing is a surprise later)

- Supabase: free tier caps on database rows/storage and monthly active users for auth
- Vercel/Netlify: free tier caps on monthly bandwidth
- OpenRouter free models: rate limits per day/hour
- Plan to monitor usage as real users onboard; budget for paid tiers once usage grows (this is expected and fine — not a sign of failure)

---

## 13. Build Sequence Checklist

*(Superseded by the "Next Steps Sequence" section below, which is the current authoritative order. Kept here as a literal step checklist for the Next.js rebuild.)*

- [x] Master doc and CLAUDE.md exist and are kept current
- [x] V1 general/undecided-major content fully written (roadmap grades 6–12 + all 6 parent guide articles) in `pathfinder-app.jsx`
- [ ] Scaffold Next.js (App Router) app with Tailwind configured
- [ ] Set up Supabase client via env vars (`.env.local`, gitignored, `.env.local.example` committed)
- [ ] Port roadmap + parent guide content from `pathfinder-app.jsx` into the real app structure
- [ ] Fix/finish content accuracy pass (see Next Steps Sequence, step 1)
- [ ] Design pass to replace the generic-AI-look palette/font/nav (see Next Steps Sequence, step 2)
- [ ] Build real chatbot backend (server-side API route, no client-exposed keys) and fix the currently-broken client-side call
- [ ] Wire Supabase auth + student/parent profile (account type branching, optional immigration-status field per Section 14)
- [ ] Make roadmap dynamic based on profile inputs
- [ ] Connect GitHub repo to Vercel for auto-deploy
- [ ] Test with 5–10 real users before adding anything beyond V1 scope

---

## 14. Decisions Log

*(Add one dated line per meaningful decision, so you never lose track of "why" later.)*

- **July 21, 2026:** Named the app "PathFinder." Decided V1 scope excludes career navigation, community college transfer, and in-language translation (future modules — Section 3). Bigger personalization/pathway vision (dream college+major matching, target/safety/reach schools, major-specific pathways) captured as V2/V3 (Section 3B) — deferred until V1 is validated, since it needs real sourced data, not placeholder text.
- **July 21, 2026:** Finalized real, authored V1 content: full general/undecided-major roadmap (grades 6–12 + summers) and all 6 parent guide articles (combined student+parent reads, covering the U.S. college system, financial aid, supporting applications, GPA, extracurriculars, immigrant-family-specific resources). Deliberately included honest caveats on state/policy-dependent facts (financial aid eligibility, test policies) rather than stating them as universal — e.g. removed blanket "take the PSAT/SAT" advice since testing policy varies by school. This content is final — don't regenerate it.
- **July 21, 2026:** Decided immigration status stays an optional, separate field filled in later if the student chooses — not part of required onboarding (shouldn't be a signup barrier or feel like an interrogation) and not removed entirely (still valuable for personalization).
- **July 21, 2026:** Decided parent accounts are standalone (not linked to a specific student's progress) — protects student autonomy, avoids enabling constant parental monitoring. Future idea (not built): a student-initiated, revocable "share my progress" link.
- **July 21 – Aug 2, 2026 (compressed):** Built and abandoned a Lovable → Bolt AI-scaffolding path (real Supabase project connected, real test signups exist — do not recreate the Supabase project). That build surfaced real UX lessons now treated as standing requirements for the rebuild: grades as separate pages (not a dropdown), no aggregate progress bar (students start at different grades) but keep per-item "mark as done," working logout, real email verification, profile setup must branch by account type (student vs. parent fields), and "N/A is okay" guidance on uncertain fields (GPA, test scores). Abandoned Lovable/Bolt in favor of Claude Code writing the frontend directly against Next.js + the same existing Supabase project — no user data lost, only the frontend implementation changed.
- **Aug 2, 2026:** Confirmed the pivot above is final (not just "under consideration"): active development is now a fresh Next.js/Tailwind rebuild via Claude Code, using `pathfinder-app.jsx` as the content/UI reference, not a codebase to patch. Reconciled this master doc against `CLAUDE.md` and the actual `pathfinder-app.jsx` — the design description (Section 5), chatbot plan (Section 6), tech stack (Section 11), and build checklist (Section 13) had drifted from the Lovable era and didn't match reality; corrected. Added an explicit "Next Steps Sequence" section per user request so the build order doesn't need re-deciding each session. GitHub repo name corrected to `atharv146/pathfinder` (was `pathplanner-pro`).
- **Aug 2, 2026 (same session, build):** Executed Next Steps Sequence steps 1 and 2 for the first time. Content: rewrote the user-authored roadmap-content-v3 draft into `content/roadmap-content-v4.md` — cut the dash-heavy AI-sounding prose the user flagged, kept all the real research (brag sheets, essay brainstorming, waitlist/LOCI mechanics, senioritis risk, the Cost-of-Attendance-minus-grants comparison method, scholarship strategy, Decision Day mechanics), and added status-aware texture (financial aid eligibility by immigration status, test registration friction for international/no-SSN students, family conversations about status) into the sections where it actually changes the guidance. Scaffolded the real Next.js app at `app/`, ported both content sets into working pages with real interactivity (expand, localStorage mark-as-done). Flattened the repo (removed the nested `.git` `create-next-app` had created inside `app/`), connected to `atharv146/pathfinder`, confirmed the remote was empty via `git ls-remote` before pushing.
- **Aug 2–3, 2026 (design iteration, compressed):** The Aug 2 design pass (near-black + amber/ember glow, Space Grotesk) did not land — user feedback across several rounds: "looks like AI slop," a real word-spacing bug in the scroll-reveal text (margin/whitespace-collapse issue, fixed and verified with pixel measurements), a genuine low-contrast bug (`text-text-faint` measured 2.98:1 against the background, below WCAG AA's 4.5:1 — this was the real cause of "text sinking into the screen," not animation or clipping as initially assumed), and a full palette rejection ("still isn't advanced enough," "no uniqueness"). Iterated through a bolder orange-gradient version (also rejected) before the user supplied three actual reference videos (a DOSS ARP-style product site, a SHAGA controller site, a wine/hospitality site) plus a luxury-residence screenshot. Installed a portable ffmpeg, extracted real frames, and rebuilt the design system to match what the videos actually show: true black grounds, Instrument Serif display type, hairline `OrbitField` orbital graphic, mono corner labels, monochrome numbered stat index — replacing the amber/ember system entirely. Added timed fallbacks to the reveal/fade components after discovering the sandboxed preview browser has `document.hidden === true` (freezing `requestAnimationFrame`), which had been producing false-negative "animation is broken" readings during verification — a real lesson: verify contrast/opacity with actual computed values, and account for the preview tool's own limitations before concluding the app itself is broken. This is the first design pass the user has not immediately rejected, but has not been explicitly signed off as final either — confirm before building further on top of it. Full detail in Section 5.
- **Aug 3, 2026:** User is moving primary development to a MacBook after a Windows-session connection failure (unrelated to this project — a bridged-process disconnect). No project-side migration needed: repo is fully pushed to `origin/master`, clone fresh on the new machine and `npm install` in `app/`. This master doc and `CLAUDE.md` were brought fully current specifically so a new session on the new machine can pick up cold without needing this session's transcript.
- **Aug 14, 2026 (premium motion/3D pass — Next Steps step 5, partial):** User asked to push the site toward award-site production values, supplying landonorris.com and webdesign-inspiration.com/modern as references, plus a long AI-generated "Design Elevation" stack recommendation to evaluate. Audited that list rather than executing it wholesale: **adopted** GSAP + all plugins (verified genuinely free since the Webflow acquisition — `SplitText.js`, `ScrollSmoother.js`, `DrawSVGPlugin.js` confirmed present in `node_modules/gsap/`), Lenis, and the React Three Fiber stack (`@react-three/fiber`, `drei`, `postprocessing`, `rapier`). **Rejected** shadcn/ui init (a second styling system competing with the existing Tailwind setup, for no current need) and the "Claude Design MCP" (unvetted personal repo requiring `uv` + a Playwright Chromium download, duplicating browser tooling already available). Reversed an earlier same-session "skip GSAP" call once the goal changed from light touch-up to maximum polish — that recommendation was scoped to the old goal, not wrong in general. Landed on landonorris.com being an agency build (commissioned 3D face scan, custom photography) whose gap versus PathFinder is asset production and art direction, not library choice — so effort went into motion quality, interaction, and typography instead of trying to clone its neon-lime-on-white register, which also conflicts with the calm/trustworthy tone this audience needs. Built: site-wide Lenis smooth scroll synced to the GSAP ticker (single scroll loop — two competing loops is the classic jitter cause), GSAP `SplitText` line-masked headline reveals, scroll-triggered stat count-ups, a scrubbed `DrawSVG` "seven years, one line" roadmap path whose node coordinates are sampled off the real path geometry via `getPointAtLength()` (hand-placed dots drift the moment the path data changes), a cursor-as-torch "what you were told / what's true" section that dramatizes the product thesis, a two-part custom cursor, a hairline scroll-progress bar, a seeded starfield (fixed seed, not `Math.random()` at render — otherwise a real hydration mismatch), film grain, and a real 3D WebGL hero (wireframe icosahedron core, hairline orbit rings, pointer-driven tilt, low bloom) held to the existing monochrome + single-accent palette. **The WebGL hero is progressive enhancement, not the baseline** — gated behind a device-capability + reduced-motion check and lazy-loaded, with the existing SVG `OrbitField` as the guaranteed floor, because this audience includes families on budget phones and metered data. Two real bugs caught and fixed during the pass, both the same class as the project's earlier "text stuck invisible" incident: reveal-dependent content was authored with inline `opacity: 0` in the markup (now hidden at runtime by GSAP instead, so a failed trigger or missing JS leaves content *visible* rather than permanently blank, plus explicit failsafe timeouts), and Lenis' `prevent` option was being misused to try to disable smooth scroll under reduced-motion — it actually only excludes individual nested nodes, so the provider is now conditionally unmounted instead. Verification caveat compounded this session: the preview pane reports **both** `document.hidden === true` (freezing rAF — measured 0 frames in 1.5s) **and** `prefers-reduced-motion: reduce`, so no GSAP/framer/WebGL animation can be observed there at all, and post-scroll screenshots return stale black frames. Correctness was verified via clean `npm run build` (TypeScript + 20 static pages) and programmatic DOM/geometry assertions (7/7 path nodes sampled and positioned, all reduced-motion fallbacks rendering visible content, no console errors); **the animated paths themselves remain unverified by eye and need a real browser check.** A `?force3d` query param exists to override the reduced-motion gate for exactly this QA problem.
- **Aug 14, 2026 (second pass — colour, physics, the paper section):** User's verdict on the first motion pass was that it still read "plain — black white and just stars," explicitly asked for far more animation, futuristic 3D physics, and the two ideas they'd raised earlier, and told me not to stop to ask. Searched current award-site trends (glowing/neon gradient fields, textured surfaces, kinetic typography, oversized type, real-time 3D worlds) and built against that. **Colour was finally introduced — as light, not as pigment:** a drifting multi-stop `.aurora` field (several offset radial gradients rather than one blurred blob, since blob heroes were rejected earlier in this project), `.glow-signal`/`.glow-ember` emissive type used on single words only, `.edge-glow` gradient-masked panel borders, and `.scanlines`. This is a real softening of the near-monochrome rule in Section 5 — done because the user rejected the monochrome result across several rounds, not because the earlier reasoning was wrong. Structure, type and true-black ground all survive. Built: `ResumePaper` — the user's "parchment/résumé reveal" idea, reframed as a toggle between how most students write an activities list and the specific version of the *same student doing the same things* (the sheet develops in via `clipPath` rather than a fade, and the paper stock is a deliberate contextual inversion — an application is physically paper — not a palette change; it also breaks up a long run of black sections). `GradePit` — grades 6–12 as Rapier rigid bodies in a walled slab, with a kinematic sphere riding the pointer to shove them and a "throw them again" impulse button; grade numbers are drawn to **canvas textures rather than 3D text**, because troika/Text3D fetch a font at runtime and a blocked request would leave blank blocks. `Marquee` — seamless kinetic-type band (duplicated row + exact -50% translate; any other distance visibly jumps at the wrap). Physics section carries the same progressive-enhancement contract as the 3D hero, with a real navigable grade grid as the fallback rather than an empty box. Verified: clean build, both WebGL canvases mount with **zero console errors** (so Rapier's WASM loads), and DOM assertions confirm the aurora/marquee/paper/glow/controls all render. Still unverifiable by eye in-pane for the same rAF-frozen reason — the hero screenshot confirms the colour work landed, but no scroll-driven or physics behaviour has been watched running.
- **Aug 14, 2026 (third pass — per-page identity, reference-matched):** User supplied five reference sites (zypsy.com, intrepidautomation.com, studio-size.com, edpnc.com, collectiveoffice.com), asked for per-page uniqueness rather than one treatment repeated, and **explicitly instructed that `CLAUDE.md`'s design rules be ignored as "too restraining."** Rather than silently violating that file, its design section was rewritten to match the new direction so future sessions aren't fighting stale guidance — the old "stay near-monochrome / ask before major visual work" rules are retired; the WebGL-gating and never-inline-`opacity:0` rules were kept because they're correctness, not taste. Browsed the references directly: **Intrepid** renders as black cinematic ground, fixed corner brackets framing the viewport, mono index labels (A01/A02), and crucially **one** bold coral accent against otherwise monochrome — that single-accent discipline became the mechanism for differentiating pages. **Zypsy** (from the user's screenshot) uses small boxed cards in a marquee band, so the oversized bare-text marquee was rebuilt as tight bordered cards at the user's direct request. studio-size / collectiveoffice could not be captured — the preview pane stopped compositing entirely on those (video-heavy, and the pane reported "not displayed"), so they informed nothing and that was stated rather than bluffed. Built: a **per-route accent system** (`data-accent` → `--accent`/`--accent-rgb`, driving `.glow-accent` / `.aurora-accent` / `.text-accent`) with teal=home, lime=roadmap, coral=guide, violet=ask-ai; `PageFrame` (accent + Intrepid corner brackets + mono route label/index); `KineticText` (GSAP `back.out(1.4)` overshoot so words *arrive* rather than fade — the user's "bouncing into frame, not just appearing"); and `SceneBackdrop`, a per-page 3D background with **three genuinely different geometries rather than one scene recoloured** — `grid` (instanced digital terrain on offset sine fields, roadmap), `sheets` (drifting planes, guide), `swarm` (instanced particle field that leans toward the cursor, proximity-weighted so it doesn't move as one rigid sheet, ask-ai). All use InstancedMesh (one draw call) since these are backgrounds, not the main event. Verified per page via DOM assertions: correct `--accent` resolving (`#d4ff4f` / `#ff7a4d` / `#b18cff`), 4 corner brackets, backdrop canvas mounted, headings visible, **zero console errors on every page**. Animation itself still unwatchable in-pane (rAF frozen + forced reduced-motion), so the user remains the only one who has actually seen any of this move.
- **Aug 14, 2026 (fourth pass — typography, the actual root cause):** User was still unsatisfied after the third pass ("still looks bland… all u did was add colors", "looks like ai slop again") and supplied more references including rejouice.com, the studio credited in Intrepid's own footer. Diagnosis this round was a **typography** problem, not an animation one: every reference (Intrepid, Zypsy, Rejouice) runs a **bold geometric sans**, while PathFinder was running Instrument Serif — an editorial serif that reads as generic-template regardless of how much motion sits on top of it. Swapped the display face to **Figtree** (closest free match to the Aeonik/Söhne register, weights to 900) via a new `.display` class at weight 800 with -0.035em tracking, and bulk-migrated 36 `font-display` usages, stripping the `font-normal`/`font-semibold`/`italic` classes that would have fought the new weight. (Two failed sed passes first: BSD sed doesn't support `\b`, and a Perl lookahead misfired — worth knowing before attempting another bulk class migration on macOS.) This one change did more visually than everything in the previous two passes combined. Also added, all from direct observation of the references rather than description: **light-section inversion** (`--color-bone` `#eef0ed`) because Intrepid alternates dark→light→dark and that rhythm is what stops a long page reading as one endless black slab; **`IntroLoader`**, the opening sequence the user specifically called out on Intrepid — accent-cycling colour wash, 000→100 counter, staggered panel wipe, shown once per tab, rendering *over* a complete page and carrying a hard 4.5s failsafe that always restores `body` overflow so the site can never be left behind a stuck curtain; **`WireCage`** — a morphing hyperboloid built entirely from *straight* lines between two offset circles, so animating one twist value makes the form inflate and pinch with no morph targets or vertex math (this is the shape behind Intrepid's closing headline), with `ClosingWire` setting huge type inside it; and a rebuilt full-bleed boxed `Marquee` per the user's explicit request. Verified: clean build, `Figtree`/800/-3.36px computed on the h1, light section present, marquee spanning the full viewport with **no horizontal overflow**, zero console errors. **Explicitly NOT done this pass** and still open: hexagon/line fade fields, page transitions, the deadline countdown and cost-of-college interactive, and any real-browser confirmation of the intro sequence or physics.
- **Aug 14, 2026 (fifth pass — THE BUG: reduced-motion was disabling the entire site):** After four passes of building 3D and motion, the user reported for the third time that they saw "no 3D shapes, no movement, it's just static." Root cause found: **their MacBook has macOS Reduce Motion enabled** (the preview pane, which runs on their machine, had been reporting `reducedMotion: true` alongside `deviceMemory: 16, hardwareConcurrency: 10` — real-machine values that should have been read as a signal several sessions earlier, not dismissed as a sandbox artifact). Every animated surface gated directly on `prefers-reduced-motion`, so the WebGL hero, the Rapier physics pit, all three page backdrops, the wire cage, Lenis smooth scroll and every GSAP reveal were being correctly and invisibly switched off for them. They were describing the software accurately the whole time; the repeated response of "add more animation" was treating a delivery bug as a taste problem. Measured before/after on the identical page: `canvasCount` 0 → 4. Fix: `src/lib/motion.ts` replaces the boolean kill switch with three levels — `full` (everything), `calm` (**3D still renders and drifts; no overshoot, scrub, parallax or scroll hijack**), `still` (nothing). OS reduced-motion now maps to `calm`, never `still`, on the principle that "reduce motion" means calmer motion rather than a dead page; an explicit user choice in localStorage always overrides the OS. Added `MotionToggle` — a persistent full/calm/still control plus a first-run notice that appears *only* when the OS is suppressing motion and the user hasn't chosen, so nobody else can silently get a static site and conclude it was built that way. All 13 gating call sites migrated to `shouldRender3D()` / `shouldAnimateAggressively()`; pointer-driven interactions (custom cursor, the TruthSpotlight torch) now survive `calm` since they're interactions rather than animations. Also this pass, per direct user request: marquee expanded to 12 non-repeating attributes with a new ping-pong sweep (`alternate` + ease-in-out, single row since it doesn't wrap), and the flat off-white light section rebuilt as `.bone-surface` — blueprint grid + warm/cool gradient wash + vignette, with the wire cage reused in dark line-art form over it. Verified: clean build, 4 canvases mounting, 12 marquee items on `marquee-sweep`, 5-layer bone surface, toggle and notice both present, zero console errors.
- **Aug 14, 2026 (sixth pass — scroll regression + the owed features):** User reported the page could not be scrolled at all and the scrollbar never appeared. **Real regression, found and fixed:** `SmoothScroll` ran Lenis with `autoRaf: false` and drove it from the GSAP ticker, but the effect bailed early (`if (!lenis) return`) when `lenisRef.current?.lenis` wasn't populated yet — ReactLenis fills that ref during its own mount and it is not guaranteed ready on first effect run. The result was Lenis mounted and owning the scroll with nothing advancing it: a completely frozen page. Lenis now runs its own rAF and the ScrollTrigger sync retries on a frame, so a missed sync costs slightly stale trigger positions instead of breaking scrolling outright. Verified `window.scrollY` actually moves (0 → 1500) with `lenis` mounted and overflow visible. **`TruthSpotlight` redesigned** — the cursor-torch masked the answer behind a moving hole, so the user correctly reported they could not read it; reading is the entire point of that section, so it became a hover/focus/tap card-flip: the myth stays visible and struck through, the answer expands beneath it via a `grid-template-rows: 0fr→1fr` transition (animates height with no fixed pixel value, so long answers are never clipped), and it is now a real `<button>` with `aria-expanded`, making it keyboard- and touch-accessible where the mask version was mouse-only. **Delivered the previously-owed features:** `DeadlineOrbit`/`DeadlineSection` — the user's 3D-clock idea, an orrery where each deadline is a ring with a marker at the elapsed fraction and **ring colour driven by real urgency** (teal → amber inside 60 days → red inside 14), paired with a live-ticking HTML countdown; `CostReveal` — sticker-price-vs-net-price interactive on a light ground, income-band slider with a proportional grant/you bar; `template.tsx` page transitions (a template, not a layout, because only a template remounts per navigation) with a wipe panel and scroll-to-top; and the physics pit added to `/roadmap`. **⚠️ Both new content sections carry invented illustrative numbers and say so in the UI** — deadline dates are labelled "typical, not promises, confirm with the school" (the FAFSA open date has genuinely moved in recent cycles) and the cost figures are labelled illustrative with a pointer to each school's mandated net price calculator. These need the user's content review. Verified: clean build, scroll working, 5 canvases on home / 2 on roadmap, both new sections rendering, 4 accessible expandable rows, zero console errors.
- **Aug 11, 2026:** Deployed to Vercel for the first time so the app is checkable from any device, not just localhost — user explicitly wanted a way to verify GitHub/design changes visually without running the dev server themselves. Logged into Vercel via CLI device-auth flow (user completed the browser approval step), linked and deployed the project (initially auto-named `app` from the folder name), then renamed to `pathfinder`. Connecting to GitHub for auto-deploy required two separate permission grants on the user's end, not one — a Vercel *login connection* to GitHub (account identity) and, separately, installing/authorizing the *Vercel GitHub App* with actual repo access — the first `git connect` attempt failed until both were done. Once connected, the first git-triggered build failed (Root Directory defaulted to repo root instead of `app/`, breaking `@/...` path aliases) — fixed via `vercel project update --root-directory app`. After that succeeded, the deployment turned out to be silently gated behind a Vercel login page (SSO/Deployment Protection is on by default) — disabled via `vercel project protection disable pathfinder --sso` since the whole point is public access. Final working public URL: **https://pathfinder-atharv.vercel.app**, confirmed loading with no console errors and the correct design (true black, orbital SVG present).

---

## 15. Current Build Status

*(Update after every session — this is what you paste into a new AI tool to catch it up instantly.)*

**Where things stand (as of August 14, 2026):**
- **Motion/3D layer added (see the Aug 14 Decisions Log entry for the full rationale and the bugs it surfaced).** New dependencies in `app/`: `gsap` + `@gsap/react`, `lenis`, `three` + `@react-three/fiber` + `drei` + `postprocessing` + `rapier`. New components: `SmoothScroll`, `SplitReveal`, `CountUp`, `ScrollProgress`, `CustomCursor`, `Starfield`, `RoadmapPath`, `TruthSpotlight`, `hero/HeroScene` + `hero/HeroVisual`, plus `src/lib/gsap.ts` as the single plugin-registration point. Build passes clean. **Not yet visually verified in a real browser and not yet committed** — the preview pane cannot render any of it (see the verification caveat in the Aug 14 log entry). Everything animated has a reduced-motion path and a failsafe that leaves content visible rather than blank.
- Pre-existing `npm audit` high-severity findings (`nanoid`, `postcss`/`next`, `sharp`) predate this pass and were not introduced by the new dependencies.

**Previous state (as of August 11, 2026):**
- The Lovable → Bolt build path (Section 14) is abandoned. The real rebuild is live: **Next.js (App Router) + Tailwind v4, TypeScript**, at `app/` inside this repo, with `npm run dev` working and a full production build (`npm run build`) passing clean (TypeScript + ESLint both clean) as of the last commit.
- **Content:** the roadmap got a real depth + prose pass — `content/roadmap-content-v4.md` (source of truth, human-readable) parses into `app/src/data/roadmap.json`, 47 items across grades 6–12, with status-aware (immigration status) guidance woven into financial aid, testing, and family-conversation sections. All 6 parent guide articles were ported **unmodified** into `app/src/data/guide-articles.json`. Content has not been touched since — the deeper content pass (Next Steps Sequence step 3) has not started yet.
- **Design:** went through several real iterations before landing — see Section 5 for the full palette history and the contrast-bug lesson. Current state: true-black grounds, Instrument Serif display face, hairline `OrbitField` graphic, mono corner labels, monochrome numbered stat index — rebuilt directly from three reference videos the user supplied (frame-extracted with a portable ffmpeg and matched against, not worked from description). This is the first design pass that the user has not immediately rejected on sight; still not explicitly signed off as final.
- **Live pages:** `/` (home), `/roadmap` (grade picker), `/roadmap/[grade]` (all 7 grades, expandable items, localStorage "mark as done" — real, not mocked), `/guide` (article index), `/guide/[slug]` (all 6 articles, quick-answer box + glossary intact), `/ask-ai` (honest placeholder, no backend). All pages carry the current design system, not just the homepage.
- **Chatbot:** still not functional, by design — `/ask-ai` is a clearly-labeled placeholder. Real backend work is Next Steps Sequence step 6.
- **Supabase:** existing project, URL `https://kvnmydvsffjvrsndnawd.supabase.co`, contains real signups from earlier testing — do not recreate. Still not wired into the new Next.js build (deliberately deferred).
- **GitHub:** repo `atharv146/pathfinder` (public) is connected and up to date — local and `origin/master` are in sync as of the last push (Aug 3, 2026). Repo is flattened at the working-directory root (docs + `content/` + `app/` all in one repo, per the Aug 2 decision).
- **Deployment:** live on Vercel — **public URL: https://pathfinder-atharv.vercel.app** (this is the one to actually check the app from; the old `app-psi-vert-59.vercel.app` still works too but is a leftover from before the project rename). Project name `pathfinder`, connected to `atharv146/pathfinder` via the Vercel GitHub App, auto-deploys on every push to `master`. Two config issues found and fixed during first setup, worth knowing if deployment ever needs touching again: (1) the project's Root Directory setting defaulted to the repo root instead of `app/`, which broke the git-triggered build (path aliases like `@/components/...` failed to resolve, even though local `npm run build` from inside `app/` was clean) — fixed via `vercel project update pathfinder --root-directory app`; (2) SSO/Vercel-Authentication deployment protection was on by default, which silently redirected visitors to a Vercel login page instead of the app — disabled via `vercel project protection disable pathfinder --sso` since this is meant to be a public app, not an internal tool.
- **Platform note:** the user is moving primary development from this Windows machine to a MacBook. No project-side action needed — cloning the GitHub repo fresh on the new machine is sufficient; nothing machine-specific is checked in. `npm install` will need to re-run in `app/` on the new machine (`node_modules` is gitignored).
- Two smaller fixes carried over from Lovable-era testing, still not implemented: (1) immigration status field optional/separate from required onboarding, (2) show user's email (not just name) in the account/logout menu — both blocked on the accounts/backend step (Next Steps Sequence step 6), since there's no auth/profile UI yet.

**Known open issues (not yet fixed):**
1. Some facts in the ported content (state-by-state aid eligibility, org details) should still be spot-checked before public launch — flagged in the content itself, not silently assumed correct.
2. Chatbot is a placeholder, not functional — real backend needed (Next Steps Sequence step 6).
3. Not yet verified at mobile viewports — desktop-only so far; responsive pass still needed (Next Steps Sequence step 4).
4. No Supabase wiring, no auth, no deployment yet — all deliberately deferred to later steps, not bugs.
5. Design has not been explicitly signed off as final by the user — the current pass is the first one not immediately rejected, but "good enough to move on" hasn't been said outright. Confirm before treating Section 5's current-state description as settled.

**Immediate next action for whoever picks this up:** confirm with the user whether the current design is approved to move past, or needs another pass. If approved, the natural next moves are the deeper content pass (Next Steps Sequence step 3) and the mobile-responsive pass (step 4). Read Section 5 in full before touching any styling — it documents real bugs found and fixed (contrast, animation-verification false positives) that are easy to reintroduce by accident.

---

## 16. Next Steps Sequence

*(Added Aug 2, 2026, capturing the user's explicit build order. This is sequencing, not new scope — V1 scope is still exactly Section 2. Don't skip ahead or reorder without the user explicitly saying so.)*

1. **Fix/finish app content.** Review and correct the existing roadmap + parent guide content in `pathfinder-app.jsx` for accuracy and specificity (per the "known open issues" #1 above) before anything else.
2. **Fix the generic-AI-look design.** First design pass to move off the cream/terracotta/Fraunces placeholder (Section 5) — check for user-provided references first, don't default back to another AI cliché.
3. **Improve content further.** A second, deeper content pass once the design frame exists to build within.
4. **Full design pass.** Beyond the initial "un-AI-slop" fix — complete visual system, mobile-first layout, real responsive nav.
5. **More features + polish.** Includes shrinking/refining the AI chat UI (currently a full tab-width panel) plus additional design and content polish items surfaced along the way.
6. **Accounts, database, backend.** Wire Supabase auth, student/parent profile with account-type branching, and a real chatbot backend (server-side key, replacing the broken client-side call in Section 6).
7. **More complex features.** Once the above is solid — this is where V2/V3 items (Section 3B) get reconsidered, still not before V1 is validated with real users.

---

## 17. Handoff Notes for Any New Claude Session

If you're a new Claude session picking this up: read `CLAUDE.md` first (fast-load summary, current status, design warning), then Sections 1–9 here for full mission/scope context, Section 15 for exactly where the build stands, Section 16 for the build order, and the Decisions Log (Section 14) for reasoning behind past choices — don't re-litigate settled decisions without a real reason. Update Sections 14 and 15 (and 16 if the order changes) after every meaningful step — standing instruction from the user. `pathfinder-app.jsx` holds the final, ready-to-use V1 content (roadmap + parent guide articles) — don't regenerate or rewrite it, port it into the real app as-is.
