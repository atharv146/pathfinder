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
- **Aug 15, 2026 (seventh pass — crash fix, stacking fix, first commit of the design work):** **Removed the Rapier grade pit.** It was rendering as a white box with the Chrome renderer-crash glyph — a genuine GPU/renderer crash, not a styling issue — and the user reported it was also confusing ("can't click, don't get the vision"). Cut rather than patched: it was the heaviest dependency on the site, the least connected to the product, and the same grade-picking job is already done well by the roadmap index. `@react-three/rapier` is still installed if it's ever revisited. **Fixed the recurring "text sinks behind the background" bug properly.** Root cause was stacking, not colour: decorative layers (auroras, WebGL backdrops, wire cages) are absolutely positioned, so any *non*-positioned content later in the DOM painted underneath them. Rather than chase it per-section, `globals.css` now pins decoration to `z-index: 0` (via `.aurora`, `.aurora-accent`, `[data-decor]`) and lifts every non-decorative direct child of a `section` to `position: relative; z-index: 1`. Verified with a DOM sweep across every heading and paragraph on the homepage: **0 buried elements**. **Deadline clock made genuinely 3D** — the user correctly called out that coplanar rings on a slight tilt read as a flat 2D dial; each ring is now tipped onto its own gyroscope axis with the assembly spinning and leaning toward the pointer. **Intro sequence extended to a three-act ~5s "approach"** (rings rush the camera → wordmark resolves from blur → the field scales *through* the viewer as panels clear), built from CSS circles rather than WebGL so the opening can never be the thing that fails to load; failsafe raised to 8.5s to match. Also: `LightWire` made full-bleed (it was parked in the right margin, making the light section look lopsided), explicit **Home** link added to the nav, and "No account required" removed from the marquee since accounts are now a wanted feature. **First commit of all design/motion work** (`76ea006`) — 45 files, secret-scanned clean before staging. **Push blocked: no `gh` CLI and no stored git credentials on this machine**, so the user must push themselves. **Accounts/auth (Next Steps step 6) is now formally requested by the user** but NOT started — it needs the Supabase anon key in `app/.env.local`, which only the user can supply, and it deserves its own focused pass rather than being tacked onto a design session.
- **Aug 11, 2026:** Deployed to Vercel for the first time so the app is checkable from any device, not just localhost — user explicitly wanted a way to verify GitHub/design changes visually without running the dev server themselves. Logged into Vercel via CLI device-auth flow (user completed the browser approval step), linked and deployed the project (initially auto-named `app` from the folder name), then renamed to `pathfinder`. Connecting to GitHub for auto-deploy required two separate permission grants on the user's end, not one — a Vercel *login connection* to GitHub (account identity) and, separately, installing/authorizing the *Vercel GitHub App* with actual repo access — the first `git connect` attempt failed until both were done. Once connected, the first git-triggered build failed (Root Directory defaulted to repo root instead of `app/`, breaking `@/...` path aliases) — fixed via `vercel project update --root-directory app`. After that succeeded, the deployment turned out to be silently gated behind a Vercel login page (SSO/Deployment Protection is on by default) — disabled via `vercel project protection disable pathfinder --sso` since the whole point is public access. Final working public URL: **https://pathfinder-atharv.vercel.app**, confirmed loading with no console errors and the correct design (true black, orbital SVG present).
- **Aug 15, 2026 (eighth pass — content/currency audit, and closing a real documentation-drift gap):** Between the Aug 15 seventh pass (design/motion, ends with accounts "formally requested but NOT started") and this session, **19 commits happened that this doc never captured** — full Supabase auth (email/password + Google OAuth, real session refresh via `src/proxy.ts`), route gating, a `profiles`/`roadmap_progress`/`activities` schema with RLS, onboarding, a real account-deletion flow, a major-family content lens, three rounds of mobile fixes, and a middle-school roadmap depth pass (47 → 51 items). CLAUDE.md and this doc still described accounts as entirely unbuilt. Lesson: the standing "update the doc after every session" instruction was followed for the design passes but silently dropped once account/backend work started — worth an explicit gut-check at the start of future sessions (`git log` against this doc's last-known commit) rather than trusting the doc's own "current status" claim at face value. Both docs corrected this session (see CLAUDE.md's Current Status section for the full detail); this entry covers what changed and what was verified.
  - **The user supplied the real Supabase anon + service_role keys into `app/.env.local` this session** (file mtime confirms: after the auth/account commits, before the middle-school content commit) — this is what "just finished adding the keys into supabase" refers to. Confirmed working: signup/login pages load with zero console errors and no missing-env-var crash. Did not submit a real signup, since that would create a live row in the production Supabase table for no reason.
  - **Content audit (the actual ask this session):** read `roadmap.json` (51 items) and `guide-articles.json` (6 articles) in full. Verdict: genuinely premium, not generic-AI filler — specific named policies, dated changes, and honest hedges throughout, with real recurring attention to the immigrant-family angle (FAFSA's no-SSN parent path, DACA/state aid by state, notario warnings, credential evaluation, translation gaps) rather than that content being bolted on separately. This is the differentiated content the mission (Section 1) actually calls for.
  - **Two verified, real dating errors found via web search** (not guessed — see chat for sources): (1) the Financial Aid guide article and roadmap items `12-2`/`12-6` frame several facts as "genuinely new for the 2026–27 cycle," but as of today the 2026–27 FAFSA cycle already ran its course (that cohort's May 1 decision day already passed) — the live/upcoming cycle is **2027–28, opening Oct 1, 2026** (beta testing already started Aug 5, 2026). (2) The "no more multi-child/sibling discount" fact is misdated to 2026–27 — it actually took effect with the **2024–25 FAFSA**, two cycles ago; the fact itself is still true, just mislabeled as recent. Both need a copy fix — not a regeneration, a dating correction — flagged to the user rather than silently changed, per this doc's standing content rule (Section 8 / CLAUDE.md "Do NOT regenerate content without being asked").
  - **Confirmed accurate and still forward-relevant:** the Parent PLUS loan caps ($20,000/year, $65,000 lifetime per student) — real, effective July 1, 2026 for new borrowers, correctly stated.
  - **One genuinely new, verified fact worth adding, not yet in the content:** Princeton and Columbia are the last two Ivy League schools still test-optional, and per current reporting both will require SAT/ACT scores starting the **2027–28** cycle — meaning by the time today's sophomores/juniors apply, all 8 Ivies will require testing. Directly actionable for the target reader; not yet written into the guide or roadmap.
  - **Major-family lens scope-checked against Section 3B and cleared:** `src/data/majors.ts` / `MajorLens.tsx` is a filter over the one shared roadmap (8 hardcoded buckets, structurally-safe notes only — no admissions odds, rankings, or per-major sequences), not a V3 multi-year-pathway build. The file's own header comment already names this boundary. No correction needed here, just confirmed.
  - **Real gap surfaced, not yet a decision:** onboarding (`OnboardingFlow.tsx`) only collects grade + major-family, both skippable — it does not collect target college, GPA, test scores, immigration status, first-gen flag, or home language from Section 4's data model, and `account_type` always defaults to `student` with no UI path to register as a parent account despite Section 14's "parent accounts are standalone" decision. This may be an intentional "keep onboarding light" choice (consistent with the Lovable-era "N/A is okay" lesson) rather than an oversight, but it hasn't been decided out loud — worth a deliberate call before building more account-dependent features on top of it.

---

## 15. Current Build Status

*(Update after every session — this is what you paste into a new AI tool to catch it up instantly. This section was found significantly stale on Aug 15, 2026 — see that date's Decisions Log entry — so treat any gap between this section and `git log` as a signal to re-audit, not as "nothing happened.")*

**Where things stand (as of August 15, 2026):**
- **Accounts/auth/backend (Next Steps step 6) is substantially built and now live with real keys.** Real email/password + Google OAuth, real session refresh (`src/proxy.ts`), route gating (public: `/`, `/login`, `/signup`, `/guide`+; gated: `/roadmap`, `/onboarding`, `/account`, `/ask-ai`), a `profiles`/`roadmap_progress`/`activities` schema in Supabase (RLS-enabled, owner-only policies), onboarding, and a correctly-scoped account-deletion flow (deletes app data + the actual auth user, session-verified, not client-trusted). Roadmap "mark as done" is DB-backed now, with old localStorage progress migrated in rather than discarded. **Gap:** onboarding only collects grade + major-family, not the fuller Section 4 model (target college, GPA, test scores, immigration status, first-gen flag, home language), and there's no UI path to register as a parent account yet. Chatbot backend specifically is still not built.
- **Content:** roadmap is 51 items (grades 6–12) — middle school (6–8) got a real depth pass this session's predecessor commits (`g6-math-placement`, `g7-hs-credit-courses`, `g7-fee-waiver-awareness`, `g8-world-language-sequence` + 2 rewrites). Guide articles are still the original unmodified Aug 11 port. **Content audit (Aug 15, 2026):** overall genuinely specific and non-generic, real strength on the immigrant-family angle throughout — but two dating errors confirmed via web search need a copy fix (FAFSA cycle references reading one cycle stale; the "no sibling discount" fact mis-dated to 2026-27 instead of 2024-25), and one new verified fact is worth adding (Princeton/Columbia are the last test-optional Ivies, both requiring scores starting 2027-28). Full detail in this date's Decisions Log entry — not yet applied to the JSON files, pending the user's go-ahead per the standing "don't regenerate content without being asked" rule.
- **Major-family lens:** a filter over the shared roadmap (8 buckets, structurally-safe notes only), scope-checked against Section 3B and confirmed to stay V1/V2-side of the line, not a V3 build.
- **Design:** true-black grounds, Figtree display face (not Instrument Serif — see CLAUDE.md's typography callout), per-page accent + 3D backdrop system, light-section inversion, intro sequence. Not yet explicitly signed off as final by the user.
- **Mobile:** real fixes landed (iOS input zoom, touch targets, a full mobile nav sheet that didn't exist before, WebGL/lag fixes, Google sign-in timeout) across three symptom-driven commits — meaningful progress on Next Steps step 4, but not yet the documented full responsive audit that step implies.
- **Deployment:** live on Vercel, **https://pathfinder-atharv.vercel.app**, auto-deploys on push to `master` — see the Aug 11 entry for the Root Directory / SSO-protection setup details if this ever needs revisiting. **As of Aug 15, 2026, local `master` is 4 commits ahead of `origin/master`** (account page, mobile chrome/lag fix, account deletion + major lens, middle-school content depth pass) — so Vercel is currently serving an older build missing all of that. Unlike the Aug 15 seventh-pass note, git push now works from this machine (`osxkeychain` has valid credentials, confirmed via `git push --dry-run`) — just needs the user's go-ahead to actually push, since pushing to `master` auto-deploys to the public production URL.
- **GitHub:** repo `atharv146/pathfinder` (public), local ahead of remote as noted above.
- **Chatbot:** still not functional, by design — `/ask-ai` is a clearly-labeled placeholder.
- **Supabase:** project URL `https://kvnmydvsffjvrsndnawd.supabase.co`, contains real signups from earlier testing plus whatever real signups now accumulate through the live auth flow — do not recreate.

**Known open issues (not yet fixed):**
1. The two content dating errors and one missing-fact addition from the Aug 15 content audit (see Decisions Log) — needs the user's go-ahead to apply.
2. Chatbot is a placeholder, not functional — real backend needed (part of Next Steps step 6, distinct from the auth/DB work already done).
3. Mobile has real fixes but not a full documented responsive audit (step 4).
4. Onboarding doesn't collect the fuller Section 4 profile fields, and there's no parent-account UI path — needs a deliberate decision, not silent drift.
5. Design has not been explicitly signed off as final by the user.
6. Local `master` is 4 commits ahead of `origin/master` — Vercel is serving a stale build. Push works from this machine now (confirmed via dry-run); just needs the user's go-ahead since it auto-deploys.

**Immediate next action for whoever picks this up:** confirm with the user (a) whether to apply the two content dating fixes + the new Ivy-testing fact now, (b) whether to push the 4 pending commits so Vercel catches up, and (c) whether to expand onboarding's data model or deliberately keep it light. Read Section 5 before touching styling, and read the Aug 15 Decisions Log entry before assuming this doc's "current status" is actually current — that was the whole finding this session.

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

## 16B. V2 Build Sequence — Personalization & Resume Builder

*(Added Aug 15, 2026, at the user's explicit direction. This supersedes Section 16 as the active build order — Section 16's steps 1–6 are done or substantially done. This promotes most of Section 3B from "deferred" to "building now," which is a real scope decision the user made deliberately.)*

**Three strategic calls this order is built on:**
1. **Content volume is the binding constraint, not engineering.** See the Aug 15 Decisions Log entry — two dating errors were found in only 51 roadmap items + 6 articles that had already been revised multiple times. Major-specific pathways multiply that surface area enormously, and every fact goes stale each admissions cycle. Therefore: **8 major *families* deep, not 50 majors shallow.**
2. **Most personalization needs no new content.** "Start where you are" is a diff between a student's profile and the existing 51 items — pure logic, high perceived personalization, zero research cost. It ships before the content-heavy work.
3. **Never score or rank the student.** The "AI evaluates how far along you are" idea is reframed as gap analysis: the student self-reports, the app shows *what's still available to them*, never a judgment or a "you're behind." For this audience a behind-ness score is actively harmful, and the app genuinely cannot see a student's personal circumstances.

**Parallel track, not a numbered step: get 5–10 real students using the app.** Section 3B originally deferred all of this until V1 was "validated with real users," and there are currently zero. Everything below is being built on assumption until that changes. Section 10's distribution plan already names the first move (local counselors / community orgs).

**The order:**

| # | Item | Why here | Content cost |
|---|---|---|---|
| 1 | ~~**AI backend** — server-side route holding the key~~ **DONE Aug 15, 2026** — see the Decisions Log entry for that date | Blocks every AI feature below. Nothing else in this list works without it. | None |
| 2 | ~~**Profile expansion**~~ **DONE Aug 15, 2026** — migration `0004_profile_details.sql` + `ProfileDetails` on `/account`. GPA (+scale), SAT/ACT, course rigor, target colleges, first-gen, home language, and an optional status field. Every column nullable; "leaving something blank is completely fine" is stated on screen, not just implied. Status sits last, visually separated, and explains why it's asked and that it's never shared *before* asking — per Section 7 and the July 21 decision. All fields feed the chat's context block, so the AI actually uses them. | Blocks personalization, gap analysis, and the fee-waiver checker. | None |
| 3 | **AI activities interview + "does this count?" translator** — AI asks questions to surface what a student actually does, then turns it into Common App-shaped entries (~150 chars). Explicitly catches caregiving, translating, family business, and paid work, which this audience systematically undersells. Payoff visual: their real entries develop onto the existing `ResumePaper` sheet. | **The single strongest feature in the plan.** Zero content cost, directly serves the mission, hard to get free anywhere else, and `activities` table + `ActivitiesBuilder` already exist. | None |
| 4 | ~~**Gap analysis / "start where you are"**~~ **DONE Aug 15, 2026** — `WhereYouAre` on `/roadmap`, `lib/roadmap/gaps.ts`, `data/roadmap-timing.ts`. No score, no percentage, no "behind" anywhere. | Huge perceived personalization built entirely from content that already exists. | None |
| 5 | **Major-family pathways** — **PART A DONE Aug 15, 2026** (structural pathways: grade-phased sequencing, counselor questions, per-school verify lists). **PART B NOT STARTED** — named programs, competitions, summer opportunities, typical activity profiles. Part B needs real per-family web research and must not be improvised. | The expensive one. Part A was safe to ship immediately; Part B is the actual bottleneck. **Only researched specifics — no invented program names.** | **A: none · B: high** |
| 6 | ~~**Essay brainstorm tool**~~ **DONE Aug 15, 2026** — `/tools`, `EssayBrainstorm`, `data/essay-brainstorm.ts`. Writes nothing; notes stay in localStorage. — the method is already written in the 11th-grade content: five moments, values-then-memory, tell-it-out-loud, narrative vs. montage. Make it interactive. | ⚠️ Must never draft essays for students — an integrity problem that would also blacklist the app with counselors, who are distribution priority #1. | Low (method already written) |
| 7 | ~~**Fee waiver checker**~~ **DONE Aug 15, 2026** — `/tools`, `FeeWaiverChecker`, `data/fee-waivers.ts`. Never returns "you don't qualify". (Net price comparison still open — `CostReveal` exists but isn't wired to a real multi-school compare.) — "based on what you've told us, you likely qualify for X, here's how to ask." Net price via the existing `CostReveal`, using the COA-minus-gift-aid method already documented in the 12th-grade content. | Saves families real money, builds real trust, cheap to build. Can jump earlier if a quick win is wanted. | Low |
| 8 | ~~**Policy freshness system**~~ **DONE Aug 15, 2026** — `data/freshness.ts` + `FreshnessStamp` on every guide article. — visible "verified [date]" stamps on time-sensitive claims. | Directly solves the staleness problem found Aug 15, and doubles as a trust signal no competitor offers. | Low |
| 9 | ~~**Counselor / mentor share link**~~ **DONE Aug 15, 2026** — migration `0007`, `ShareLink`, public `/s/[token]`. See §16I. — student-initiated and revocable, per the July 21 decision protecting student autonomy. | The distribution unlock: counselors are Section 10's #1 channel, and this puts the app in front of them via students. | None |
| 10 | ~~**Parent mode / in-language**~~ **DONE Aug 15, 2026** — account-type UI + Spanish. See §16H. — parent-side view, translation of core content. | Promotes Section 3's deferred translation item. Highest reach-per-effort for this specific audience. | Medium–High |

**Explicitly recommended AGAINST (do not build without revisiting):**
- **Chancing / admissions-odds calculator** — CollegeVine owns this, it needs real admissions data, it's frequently wrong, and it's demoralizing for exactly this audience.
- **Past-admit example profiles** (from Section 3B) — cannot be fabricated without violating the project's own "never invent statistics" rule, and real ones require data not currently available. Cut or source properly.
- **AI-written essays** — see item 6.
- **50 individual majors** — see strategic call #1.

**Design thread (runs through every item, not a separate step):** the user's standing requirement is that new features carry the same visual quality bar. Prefer reuse of existing proven components — `ResumePaper` (item 3), `RoadmapPath` (item 4), `DeadlineOrbit`, `CostReveal` (item 7) — with genuinely new 3D reserved for item 5 (a path that forks by major) and item 6 (memory points connecting into a throughline). All WebGL stays behind the `src/lib/motion.ts` capability gate with a real fallback, per the standing rule.

---

---

## 16C. V2 Step 1 — AI Backend (built Aug 15, 2026)

**Shipped.** `/api/chat` (`app/src/app/api/chat/route.ts`) — the server-side model call that unblocks steps 3, 4, and 6 of Section 16B, and closes the last open piece of Section 16's step 6.

- **Why it's a server route at all:** the original `pathfinder-app.jsx` called `api.anthropic.com` directly from the browser. An API key shipped to the client is a public API key. `ANTHROPIC_API_KEY` now lives server-side only (no `NEXT_PUBLIC_` prefix), and the browser only talks to this route.
- **Model:** `claude-opus-5`, streaming, adaptive thinking at `effort: "medium"`. Effort is the tuning knob if responses feel slow — `low` is still strong on this model. Thinking is deliberately left on: financial-aid and status-aware questions have real nuance, and disabling thinking on this model can leak internal tags into the visible answer.
- **Cost controls, in order:** signed-in only → 30 messages per user per rolling 24h → 4,000-char input cap. The system prompt is prompt-cached (it is byte-identical across all users, so it's a stable prefix); per-user context is passed in the message turn precisely so it doesn't invalidate that cache.
- **Content:** the system prompt is in `src/lib/ai/system-prompt.ts` and is treated as content, not code — it encodes the Section 6 draft plus the honesty rules (never invent a statistic, org, scholarship, or policy specific; flag facts that move year-to-year and send people to the school's own page), the hard limit on immigration legal advice, and the "a job/caregiving/translating counts as a real activity" point this audience systematically misses.
- **Escalation (Section 6's rule):** `src/lib/ai/flags.ts` flags messages touching immigration status, mental-health crisis, or safety, stores the flags on the message row, and the UI shows a real human resource (988, school counselor, licensed attorney, notario warning) **alongside** the answer — never instead of it, and never as a refusal. It is a keyword heuristic and says so in its own header comment; the response quality comes from the system prompt, not from it.
- **Storage:** migration `0003_chat.sql` adds `chat_messages` — the Section 4 "Chat Message" model including `flagged_topics` — with RLS, select+insert only (no update/delete: a student rewriting the transcript would defeat the escalation flags; full erasure still happens via the account-deletion cascade), plus a `SECURITY DEFINER` counter for the rate limit that returns only a number.
- **⚠️ Two things gate this working in production:** (1) `ANTHROPIC_API_KEY` must be set locally *and* in Vercel's env vars — the route returns a clean 501 explaining it isn't the user's fault until then; (2) **migration `0003` must be run in the Supabase SQL editor.** Until it is, the chat still answers but has no memory and — the part that matters — **no spend cap**.
- **Real bug found and fixed while verifying:** `src/proxy.ts` was redirecting API routes to `/signup` (307 → HTML), so a `fetch()` caller got an unparseable HTML body and surfaced a generic error instead of the real 401. `/api/` is now exempt from the redirect; each route verifies the session itself and returns JSON. This also silently affected the pre-existing `/api/account/delete`. **Standing rule: never redirect an API route — status codes are for APIs, redirects are for pages.**
- **Not verified by execution:** no Anthropic API key was available in this session, so the model call itself has never run. Verified instead: clean `npm run build`, clean `tsc --noEmit`, the `fallbacks: 'default'` and `effort` params confirmed against the installed SDK's own type definitions (`@anthropic-ai/sdk` 0.117.1), and both API routes confirmed returning JSON 401s via curl. **First real call is the actual test** — if the `server-side-fallback-2026-07-01` beta ever 400s, dropping the two `betas`/`fallbacks` lines in `route.ts` is the one-line fix.

---

## 16D. V2 Step 2 — Profile Expansion (built Aug 15, 2026)

**Shipped.** Migration `0004_profile_details.sql` + `src/components/account/ProfileDetails.tsx`, rendered inside `AccountPanel` on `/account`.

Adds the rest of the Section 4 student model: GPA and GPA scale, SAT/ACT, course rigor (coarse buckets, not a course list — the roadmap branches on "are you on the most rigorous track available to you", which a student can answer, and enumerating courses is data entry that buys nothing), target colleges, first-gen, home language, and an optional immigration-status category.

**Every column is nullable and the UI says so out loud.** The Lovable-era "N/A is okay" lesson is implemented as visible copy — a 9th grader with no test scores, or a student who doesn't know their GPA scale, must not feel behind. Nothing in the app gates on any of these.

**The status field follows Section 7 and the July 21 decision precisely:** it is last, visually separated in its own bordered block, and states *before asking* why it's collected (aid rules genuinely differ, and generic advice is often flat-out wrong for immigrant families), that it is never shared or sold, and that it can be cleared or deleted at any time. It also restates that PathFinder can't give legal advice. "Skip this" is the default option, not an afterthought.

All fields flow into `buildContextBlock()` in `src/lib/ai/system-prompt.ts`, so the chat uses them immediately rather than collecting data nothing reads — with an explicit instruction not to raise a student's status unless it's relevant to what they actually asked.

**Model changed this session at the user's direction:** `claude-sonnet-5` at `effort: "low"` (was Opus 5 at medium). Correct call for a free app answering explanatory questions. The escalation of last resort if quality drops is `effort: "medium"` *before* a model change.

**Superseded Aug 15, 2026 (later the same day): moved to Gemini 3.7 Flash on the free tier**, at the user's explicit direction — they don't want to enable billing until the app has users, and intend to move to Sonnet "when it matters." Reasonable call, and the route was written provider-agnostically so the swap touched only the model call. Four things learned doing it, all worth knowing before the next provider change:

1. **`gemini-2.5-flash` (what was asked for) is retired for new API keys** — it returns a 404 telling you to migrate, *even though it still appears in the models list endpoint*. The list endpoint is more permissive than generation. Always test a model string, never trust the listing or training-data memory.
2. **Pinned `gemini-3.7-flash` rather than the `gemini-flash-latest` alias.** An alias silently changes the model under a running app; for a product giving advice to minors, a behaviour change should be a deliberate commit. Cost: this string will eventually retire too, exactly like 2.5 did.
3. **The free tier returns transient 503s** ("high demand") — hit on the first real call. The route surfaces this as a clean JSON 502 with an honest "the daily free quota may be used up" message rather than a broken stream.
4. **The real find — a safety bug caught by testing, not by reading code.** Asked a representative high-stakes question ("we're undocumented, I'm scared filling out forms will get us in trouble"), Gemini volunteered that financial-aid data is *not* used to report families to immigration enforcement, citing FERPA — and confidently listed specific states offering aid to undocumented students. Both are precisely what this app must never do: it cannot know a family's situation, enforcement practice changes, and a false reassurance that a family acts on is the worst outcome this product can produce. `system-prompt.ts` gained an explicit **"never reassure anyone about immigration enforcement risk"** block (marked as the most important line in the prompt: acknowledge the fear, state factually what a form asks, refer to a licensed attorney or established nonprofit — comfort is not the job, accuracy and a real referral are) plus a rule against stating state-level policy as settled fact. Re-tested after the change: the model now explicitly declines to characterise enforcement risk and stopped enumerating states. **This check should be re-run after any system-prompt or model change** — a model swap can silently reintroduce it.

**Also deferred, with reasoning — routing to free/open models (OpenRouter).** The user asked for this to cut cost further. Not done, because the saving is small relative to the risk on this specific product: Sonnet 5 at low with a cached system prompt already puts a typical exchange in fractions of a cent, and the paths where a weaker model does real damage are exactly the ones this app is built for — a nervous first-gen student asking about aid eligibility, or the crisis/safety/immigration escalations where the wrong answer isn't a bad answer but a harmful one, given to a minor. Revisit if volume makes the bill real; the model string is one line in `route.ts`.

---

## 16E. V2 Steps 3–4 — Activities Interview & Gap Analysis (built Aug 15, 2026)

**Step 3 — the activities AI interview (the differentiator). Shipped.**
`api/activities/interview` (streaming) + `api/activities/extract` (JSON), `lib/ai/interview-prompt.ts`, `components/activities/ActivityInterview.tsx`, migration `0005_chat_kind.sql`.

A separate system prompt from Ask AI, because interviewing is a different job from answering: one question at a time, never accepting "I don't do anything", and treating caregiving/translating/family-business work as real activities — the entire premise of the feature.

**Verified against a simulated student** who opened with *"honestly nothing. i dont do any clubs or sports"*. The interview didn't argue and didn't accept it — it asked "who is usually at home with you?" and surfaced 20 hrs/week of childcare plus a Saturday restaurant job. Extraction wrote it as **"Family Caregiving"**, not "Founded a childcare initiative". That restraint is load-bearing and the prompt states it as a hard rule: the student is the one who would have to defend an inflated entry.

Drafts are always reviewed before saving — the model never writes to the activities list unsupervised.

Two supporting pieces: `lib/ai/guard.ts` centralises signed-in → key → daily-cap across all three AI routes (three hand-copied guards is where one quietly loses the rate limit), and `withRetry` adds bounded exponential backoff. The retry is **measured, not speculative** — the Gemini free tier returned 429/503 often enough during testing that single-shot calls failed roughly half the time, three consecutively at worst. It retries only transient statuses, so a 404 on a retired model still fails fast.

**Step 4 — gap analysis / "start where you are". Shipped.**
`components/roadmap/WhereYouAre.tsx`, `lib/roadmap/gaps.ts`, `data/roadmap-timing.ts`. Zero new content — pure logic over the existing 51 items, which is exactly why it sat ahead of the expensive major-pathway work.

The governing rule, restated because it is easy to undo: **never score the student.** No percentage, no completion bar, no "behind". A first-gen 11th grader who signs up and sees "12% complete" learns they are failing at something they only just discovered. What they see instead is what is still *open* to them: this year's list, earlier items that genuinely still transfer, and a look at next year.

`roadmap-timing.ts` splits items into **evergreen** (still worth doing whenever — "start a running list of your activities") and **windowed** (genuinely tied to a passed moment — "choose your 9th grade classes carefully"). Windowed items are filtered out of catch-up entirely; there is deliberately **no "missed" bucket**, because no version of showing someone a list of closed doors helps them. They remain readable on their own grade pages. It lives outside `roadmap.json` because that file is generated from `content/roadmap-content-v4.md` and anything added to it is lost on regeneration.

**A real design bug found by testing the logic against actual data:** catch-up was originally walked oldest-grade-first, so the four items shown by default to an 11th grader were all grade-6 habits ("read something you actually chose, most days") while the genuinely useful grade-10 items — net price calculators, scholarship search, what target schools require — sat twenty rows down. Now walked newest-first. A senior joining cold now sees "lock in your testing plan" and "ask for recommendation letters" first. Verified across grades 9/11/12 plus both edges (a 6th grader has an empty catch-up list, a 12th grader has an empty coming-up list).

---

## 16F. V2 Step 5 Part A — Structural Major Pathways (built Aug 15, 2026)

**Shipped: Part A only, deliberately.** `src/data/majors.ts` extended from a flat notes list into a grade-phased pathway; `MajorLens` renders only the phase covering the student's current grade.

The split exists because step 5 is the content bottleneck this whole plan is paced around:

- **Part A (done)** — things structurally true of a major family and checkable in minutes on any admissions page: course ladders have prerequisites, portfolio deadlines land before application deadlines, direct-admit majors close later transfers, teaching licences are issued per state. 26 phases across 8 families.
- **Part B (not started)** — named programs, competitions, summer research opportunities, typical activity profiles per major. This needs real per-family web research with verification. **Do not improvise it**; that is the exact "generic, low-trust content" failure §3B warns about, and it would be the single fastest way to destroy the app's differentiator.

Two design choices worth keeping:

**`askCounselor` gives questions, not answers.** The answers are school-specific and we would be guessing at them. The *question* is the thing a better-resourced classmate already knows to ask — handing that over is real value with zero fabrication risk. Same principle behind `verify`, which explicitly names what the app does not know for the student.

**`phaseForGrade` returns null rather than a nearest match.** A 7th grader interested in Business sees no business phase, because there genuinely isn't middle-school business guidance worth giving — only Engineering/CS and Natural Sciences carry grade 6–8 phases, both about math placement, which is the one early decision that actually constrains later options. Showing 9th-grade advice relabelled as a 7th grader's would be worse than showing nothing. Verified: phase coverage checked across grades 6–12 for all 8 families.

**Budget note from this session:** the user asked whether Opus 5 at high effort with ~50% usage remaining could carry Part B. Assessment given: no — web research is input-heavy, 8 families × several searches each plus verification would likely exhaust it, and a half-finished Part B (four researched families, four stubs) is worse than not starting. Recommended Sonnet 5 or Opus at medium, 2–3 families per session, reserving higher effort for the final verification pass.

---

## 16G. V2 Steps 6–8 — Tools & Freshness (built Aug 15, 2026)

Three cheap, high-value items shipped together, all on the new public `/tools` page plus the guide articles.

**Step 7 — fee-waiver checker.** `data/fee-waivers.ts`, `components/money/FeeWaiverChecker.tsx`. **It never returns "you don't qualify",** and that is the entire design. Exact income thresholds are set per program and revised annually; a confident negative from this app could cost a family hundreds of dollars they were entitled to. So it lists the commonly-used indicators, and whether you tick all of them or none it shows the four waivers (SAT/ACT, application fees, CSS Profile, AP exams) with the specific person to ask for each. No dollar figures anywhere — verified in the browser. Also states plainly that the FAFSA is always free, because sites charge for it.

**Step 6 — essay brainstorm.** `data/essay-brainstorm.ts`, `components/essay/EssayBrainstorm.tsx`. Not new content: it's the method already written into the 11th-grade roadmap item (five moments / values-then-memory / tell-it-out-loud, plus narrative vs montage), turned into something a student can sit down and do. **It writes nothing, and must not be made to** — an AI-drafted personal statement is an integrity problem the student carries, and counselors are this app's primary distribution channel (§10); a tool that drafts essays gets the product blacklisted with exactly the people it needs. Notes live in localStorage rather than the database on purpose: this is unedited thinking, some of it about family hardship or immigration, and it should not sit on a server. The UI says so.

**Step 8 — policy freshness stamps.** `data/freshness.ts`, `components/FreshnessStamp.tsx`, rendered on every guide article. Exists because of the real Aug 15 incident, not as decoration: an audit of already-revised content found two plausible-sounding dating errors. **The stamp renders in both states** — a verified article shows the date, what was checked, and a watch-list of claims most likely to have moved; an unverified article says "not recently re-checked" rather than looking identical to a verified one, because a missing stamp indistinguishable from a present one is exactly how stale content hides. Only the two articles genuinely re-verified this session carry dates. **Never bump a date without actually re-verifying against a primary source** — doing so makes this worse than no stamp at all.

**Revised the same day, at the user's direction: `/tools` is sign-in required.** Their reasoning is sound and worth recording — most students come for the roadmap, not to think about fees or essays, and those two tools serve a narrower slice (fee waivers matter most to lower-income families; essay work only applies in grades 11–12). They are support for the roadmap, not the front door.

Two consequences: the public surface is now just the landing page, `/guide`, and the auth pages — everything that *is* the app sits behind an account, which makes the funnel consistent. And rather than leaving the tools to be discovered in the nav, `src/data/item-tools.ts` surfaces them **from inside the relevant roadmap items** — the fee-waiver checker appears at the items where the roadmap raises cost (grades 7, 10, 11, 12), the essay exercises at the two items that call for them (11-5, 12-4), and nowhere else. A student reading "what do I do this year" now meets the tool at the moment it's useful instead of hunting for it.

---

## 16H. V2 Step 10 — Parent Mode & Spanish (built Aug 15, 2026)

Migration `0006_language_preference.sql` (run it), `lib/i18n/*`, `LanguageAndRole`, `ExplainInSpanish`.

**Parent mode.** `account_type` has existed since migration 0001 and had **no UI**, so every account has silently been a student account. There is now a selector on `/account`. It carries the July 21, 2026 decision as visible copy rather than only a schema comment: parent accounts are standalone and deliberately not linked to a student's progress. A parent reading it should understand they get their own guidance, not a dashboard of their child — this app is not a monitoring tool. The chat already branched on `account_type`; it now actually receives a value other than the default.

**Spanish — and the deliberate refusal at the centre of it.**

Translated: navigation, buttons, labels, settings copy. Short, bounded, safe.

**NOT translated: the roadmap items and guide articles.** That is a refusal, not an unfinished task. Those pages carry researched claims about aid eligibility and immigration status, and a machine translation that quietly shifts "may qualify" into "qualifies", or softens a hedge about enforcement risk, would produce exactly the harm this app is built to prevent — in the language of the families most exposed to it. Bulk-translating verified content with no bilingual reviewer who knows U.S. admissions would be worse than leaving it in English.

What was built instead: **`ExplainInSpanish`** on every guide article, which hands the reader to the AI with a pre-filled request to explain that article in Spanish. The model already speaks Spanish natively, it can take follow-up questions, and the UI says plainly that this is *an explanation, not an official translation* — a parent making a financial decision deserves to know which one they have. The chat honours the language preference via `buildContextBlock`, with an instruction to keep U.S. proper nouns (FAFSA, Common App, community college) in English with a Spanish gloss, because those are the names that appear on the actual forms.

**Verified with a real call**, a parent-account context in Spanish asking what the FAFSA is: replied in natural, non-machine-translated Spanish, kept FAFSA/Pell Grant/work-study in English with glosses, correctly told them grade 11 is too early to file, and **the enforcement-reassurance guardrail held in Spanish** — worth re-testing in both languages after any prompt change, since a safety rule verified in English is not automatically verified in Spanish.

**Real bug found and fixed in the same pass:** `ChatPanel`'s client-side history query had no `kind` filter, so the activities-interview turns would have appeared in the Ask AI transcript — precisely what migration 0005's `kind` column exists to prevent. The server route filtered correctly; the client did not. Fixed, and the two filters must stay in sync.

**When real translated content happens** it needs a human bilingual pass and its own freshness stamps (`data/freshness.ts`), not a bulk model run.

---

## 16I. V2 Step 9 — Counselor Share Link (built Aug 15, 2026)

Migration `0007_share_links.sql` (run it), `components/account/ShareLink.tsx`, public route `/s/[token]`.

Implements the July 21, 2026 decision literally: **student-initiated and student-revocable.** Nobody else can generate a link — not parents, not the app. That is why the feature took this shape instead of "link a parent account to a student", and the distinction is the difference between a sharing tool and a monitoring tool.

**This is the only place in the app where data leaves an account**, so the exposed surface is deliberate and narrow. The `get_shared_progress` SECURITY DEFINER function returns exactly: grade, major interest, completed roadmap item ids, and the activities list. It **never** returns immigration status, GPA, test scores, first-gen flag, home language, target colleges, or any chat/interview transcript. Because the caller is anonymous and has no rights to those tables, the function's return list *is* the security boundary — it is written out field by field rather than selecting `*`, and adding anything to it is a privacy decision rather than a feature decision.

Other protections: the token is 32 bytes from the platform CSPRNG (never derived from user id or timestamp, since the token is the only credential), revocation is a timestamp rather than a delete so the student can see a link is dead, and there is a hard 180-day expiry so a link handed over in 11th grade isn't still live after graduation.

**Informed consent is in the UI, not just the schema.** Before creating a link the student sees two columns — "they will see" (grade, roadmap progress, activities) and "they will not see" (immigration status, GPA/test scores, anything asked the AI). Someone about to hand a URL to an adult should know the contents before sending it.

The `/s/[token]` page is written for a reader who has never heard of PathFinder: it explains what the app is, states that the student chose to share and can revoke, leads with the activities list (the part a counselor can actually act on, and the part students most undersell in person), and closes by saying explicitly that none of it is a grade or an evaluation.

Verified: `/s/` is public, an invalid token renders the "this link isn't active" page rather than erroring, and `/account` remains gated.

---

## 16J. V2 Step 5 Part B — Researched Opportunities (started Aug 16, 2026)

`src/data/major-opportunities.ts`, `components/roadmap/Opportunities.tsx`, surfaced inside `MajorLens` for grades 9+.

**4 of 8 families researched and shipped:** engineering-cs, health-medicine, humanities, natural-sciences. Every program was verified against its official site by live web search on 2026-08-16 and carries a `verifiedOn` stamp. Programs included: MITES Summer, RSI, CS4CS, MIT BWSI, Stanford SIMR, NIH SIP, Telluride TASS, Princeton Summer Journalism Program.

**4 families deliberately left undone** — arts-design, business, social-sciences, education — and listed by name in `UNRESEARCHED_FAMILIES`. The UI renders "we haven't researched this yet, and we'd rather say that than list things we haven't checked" instead of an empty section. An empty list reads as *there is nothing out there for you*, which is both false and discouraging for exactly the students this app exists for.

**The rules this file is built on, written into its header because this is where fabrication does the most damage:**
1. Never add a program without checking its official site *now*. A student who builds a summer around a program that doesn't exist has lost something they can't get back.
2. Never state a deadline without the year, and always pair it with "confirm on the site" — these move every cycle.
3. **Free and funded only.** Filling this with pay-to-attend programs would quietly tell a family who can't spend $6,000 on a summer that they aren't the audience. Cost is the first line rendered on every card, not a footnote.
4. Selective programs are framed as worth *applying* to, never as things to plan around. Most applicants don't get in, and RSI takes ~100 students worldwide.
5. Re-verify or remove when `verifiedOn` passes a year.

Deliberately absent: competition rankings, "students like you got in", admissions odds, or any claim about what a program does for someone's chances.

---

## 17. Handoff Notes for Any New Claude Session

If you're a new Claude session picking this up: read `CLAUDE.md` first (fast-load summary, current status, design warning), then Sections 1–9 here for full mission/scope context, Section 15 for exactly where the build stands, Section 16 for the build order, and the Decisions Log (Section 14) for reasoning behind past choices — don't re-litigate settled decisions without a real reason. Update Sections 14 and 15 (and 16 if the order changes) after every meaningful step — standing instruction from the user. `pathfinder-app.jsx` holds the final, ready-to-use V1 content (roadmap + parent guide articles) — don't regenerate or rewrite it, port it into the real app as-is.
