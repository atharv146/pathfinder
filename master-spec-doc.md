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

- **Aug 16, 2026 (later session) — built §16K step 1: the `/major` page.** First item off the §16K extension queue, and the first one that was unblocked. Route `/major`, gated by the existing proxy rules with no change needed there (it isn't on the public list, so it inherits the gate — verified signed-out lands on `/signup?next=/major`). What shipped, and the decisions inside it:
  - **New content layer, `src/data/major-pathways.ts`** — per family: course ladders, a 4-stage grade-by-grade breakdown (courses / outside-class / narrative angle), and structural facts for the comparison grid. Written in the same register `majors.ts` already establishes — "commonly true of this field", never "this is what got someone in" — and the file header lists what is *banned* in it (odds, rankings, statistics, claims about what admissions readers think, named programs with deadlines). Named programs stay in `major-opportunities.ts`, which has the dated `verifiedOn` discipline; nothing was moved across that line.
  - **Activity lists lead with what's free**, same rule as `major-opportunities.ts` rule 3, and paid work / family caregiving / family-business work are named as real experience — consistent with the activities interview's refusal to treat them as lesser.
  - **`MajorLens` was cut from ~195 lines to a one-line pointer.** It used to carry every piece of major content inside an expandable card above the grade roadmap. That shape could only ever render the student's *own* major, which is useless to the many students still deciding, and it couldn't grow without crowding the roadmap. Per §16K the roadmap now keeps a slim link out and `/major` is the one home. The component's header says this explicitly so a future session doesn't re-grow it.
  - **Opportunities moved to `/major`, and the grade≥9 gate was deliberately lifted there.** On the roadmap that gate was right (a rising-senior deadline is noise inside a 7th grader's checklist); on a page the student navigated to *on purpose*, knowing these exist years early is the advantage the app is for.
  - **New page identity:** accent `azure` (#5ab8ff, the open slot on the hue wheel — teal ~170°, lime ~75°, coral ~15°, violet ~260°), and a new `orbits` backdrop variant, per the standing rule that a new page gets its own geometry rather than a recolour.
  - **⚠️ REAL BUG FOUND AND FIXED IN VERIFICATION, worth knowing about generally: `<AnimatePresence mode="wait">` can strand the wrong content on screen.** `mode="wait"` holds the OUTGOING child mounted until its exit animation finishes, and exit animations run on requestAnimationFrame. Anywhere rAF is frozen — a backgrounded tab, and the preview pane where this was caught — the exit never completes, so the incoming child never mounts. The observed symptom was not a missing animation: the page rendered **Engineering / CS courses and narrative underneath the "Arts & Design" heading**, confidently mislabelled, which is precisely the failure this app exists to not commit. Replaced with a CSS `.swap-in` keyframe plus a React `key` (same reasoning as IntroLoader being CSS at all). **Standing rule to add to the existing "never author reveal-dependent content with inline opacity: 0" one: don't use `AnimatePresence mode="wait"` for content swaps either.**
  - **Related, and the reason `.swap-in` starts at opacity 0.55 rather than 0:** Chrome throttles CSS animations in a hidden document too, so a hidden tab freezes the animation on its FIRST keyframe. `from { opacity: 0 }` would park the panel at invisible. 0.55 measures ~6.3:1 on the black sections and ~4.9:1 on the bone section, so even the frozen state clears WCAG AA. Same family of bug as the Aug 3 contrast finding — check the computed number, don't eyeball it.
  - **Also fixed in the same pass:** the counselor-question list was written as `motion.li` with `initial={{opacity:0}}` + `whileInView`, i.e. real text behind a scroll trigger with no failsafe. Swapped to `FadeIn`, which already owns the documented force-reveal timer.
  - **Verified:** `npm run build` and `tsc --noEmit` both clean; family switching, stage switching, and compare-row→switcher sync all confirmed programmatically; mobile at 375px has no horizontal overflow and every touch target measures well above 44px; the compare grid drops to cards below `md` rather than horizontally scrolling.

- **Aug 16, 2026 (same day, follow-up pass) — added Radix, fixed a bug it exposed, and a local-dev auth bypass.**
  - **`@radix-ui/react-tabs` and `@radix-ui/react-tooltip` installed — first Radix use in the project.** Both are headless behaviour primitives with zero visual opinion, so they slot into the existing look instead of imposing one. `MajorSwitcher` and `PathwayTimeline`'s stage buttons were hand-rolled `role="radiogroup"`/`aria-pressed` controls with manual keyboard handlers; both are now `Tabs.List`/`Tabs.Trigger`, relying on an ancestor `Tabs.Root` owned by `MajorView` (which also renders the matching `Tabs.Content`). Gets roving-tabindex arrow-key navigation, Home/End, and correct ARIA for free — verified programmatically: arrow-right cycles through all 8 family tabs in DOM order, all 4 stage tabs switch and update the gist/courses/narrative correctly, and the compare-table row click still drives the same underlying `selectedId` state.
  - **New `src/components/ui/Tooltip.tsx`**, a house-styled Radix Tooltip wrapper. Used once so far — on the "Locked in early" column header in `MajorCompare` — to put the "this rates the field, not you" caveat right where a reader might misread the meter, not just in the paragraph below the whole table. **Found and fixed a real a11y bug while wiring it up:** the trigger was a bare `<span>`, which isn't focusable, so Radix's keyboard-accessible `onFocus` reveal path had nothing to attach to — a keyboard user could never see the tooltip at all. Fixed with `tabIndex={0}` on the trigger; verified via `dispatchEvent(focus)` that the tooltip now opens on keyboard focus, not just mouse hover.
  - **⚠️ Verification note for future sessions, not a code bug:** while testing the Radix refactor, a scripted click using cached element coordinates from an earlier `read_page` call appeared to fail to switch tabs. Root cause was the coordinates going stale after the page re-rendered, not Radix or the app — re-reading live coordinates via `getBoundingClientRect()` immediately before clicking fixed it. Worth remembering: this preview tool's `computer` click coordinates are in the *screenshot's* pixel space, not the raw CSS viewport's, so converting via the screenshot/viewport size ratio matters when clicking by raw coordinate rather than by `ref`.
  - **New local-dev auth bypass in `src/proxy.ts`.** Google sign-in on localhost bounces to the production Site URL because Supabase's allowed redirect list and the Google Cloud OAuth client are configured for the production origin only — a dashboard setting, not a code fix (would need `http://localhost:3000/auth/callback` added on both sides to resolve properly). Rather than block local UI review on that, the proxy now skips its auth gate entirely when `process.env.NODE_ENV === "development"` — which `next dev` sets automatically and a Vercel deployment (always a production build, for both Production and Preview) can never produce, so there's no env var to leak and nothing to remember to unset. Client components still correctly see no user, so this shows pages in their signed-out/no-profile state; reviewing a personalized view locally still needs a real session.

---

- **Aug 17, 2026 — built §16K step 3: `/stats` and the per-course schema.** Full detail in **Section 16P**; the decisions worth having in this log rather than only there:
  - **The "what's offered" side is student-reported, and that was the open design question §16K left.** Resolved by asking the student four questions (AP count banded, IB yes/no, dual enrollment yes/no, and a free-text box for the rules their school places on what they may take) rather than building or scraping a per-school course catalog. Catalogs go stale, cover a fraction of U.S. high schools, and would produce confident wrong answers about a student's own school — the exact failure this app exists to avoid. A student knows whether their school has IB; asking is both more accurate and more honest than a database we don't have.
  - **The whole feature's justification, stated because it's easy to lose:** a course list means nothing without the ceiling it sits under. Two AP classes is a thin schedule at a school offering twenty-five and the most rigorous schedule available at a school offering three. PathFinder's students are disproportionately at the second kind of school and every generic tool reads them as the first. `school_course_limits` (schools that cap APs, gate honors behind teacher recommendation, or lock the math track in 8th grade) is the highest-value field in the migration for that reason.
  - **`profiles.course_rigor` was kept, not replaced.** The coarse bucket is the one-click answer for students who won't enumerate twenty-four classes; the detailed list must stay optional or "N/A is okay" isn't real.
  - **The data is already wired into the AI, with the instruction that has to travel with it.** `buildContextBlock()` emits courses grouped by grade plus the school context, and explicitly tells the model to describe rather than rank, to ask about the ceiling rather than assume one, and to treat school rules as real constraints. A model handed a transcript will rank it against an imagined national average unless told not to — the instruction is as load-bearing as the data.
  - **Migration 0008 is written but NOT applied** — the user applies migrations by hand in the Supabase dashboard. Until then the course list renders an explicit "run migration 0008" panel and the chat's profile select falls back to the pre-0008 column list via `tolerateMissingColumn` (naming a missing column fails the *entire* select, which would have dropped all chat context, not just the new fields).
  - **Dead link fixed:** `/major`'s "Change your major" pointed at `/account`, which has never had a major control. It now points at `/stats`, which does.

- **Aug 17, 2026 (second session) — perf pass, a real text-clipping bug, the scholarships directory, and Profile Analysis. Full detail in Section 16Q.** The decisions that belong in this log:
  - **"Text cut off at the bottom of the words" was a genuine defect, not a taste note.** GSAP `SplitText`'s `mask: "lines"` clips at the padding box, and `.display`'s `line-height: 0.95` puts descenders outside the line box — measured at 12.5px of ink lost on a 100px heading. The pre-existing `.split-line` padding was a no-op because it sat on the inner element; the padding has to be on the mask. `KineticText` also had no `linesClass`, so no CSS could reach its masks at all. **Standing rule: any component using `mask: "lines"` must pass `linesClass: "split-line"`.**
  - **The site's biggest performance cost was a CSS blur, not WebGL.** A ~2.5×-viewport layer under `blur(90px)` animated with `scale()` re-rasterises every frame on every page. Removing the `scale()` from the keyframes is the single highest-value change; blur radius and inset came second. Canvases now also stop rendering when off-screen or in a hidden tab (`lib/useCanvasActive.ts`), which matters most on the homepage's five.
  - **Scholarships doubled to 12, and two verified-but-unlistable awards were deliberately left out** with the reason recorded in the data file. Golden Door in particular is status-dependent, and a third-party summary is not an acceptable source for eligibility on an award whose entire audience is undocumented students. This is rule 1 of that file working as intended rather than a gap.
  - **Profile Analysis ships with no score of any kind**, per the §16N resolution. Course-path matching is deterministic and checkable; the only model call rewrites the student's own activity text under the never-inflate rule; the college section teaches the Common Data Set and the net price calculator instead of printing a statistic we haven't verified.
  - **A false-positive course match was caught in verification** ("Algebra I" satisfying the "Algebra 2" step) and is now guarded with a comment explaining why digits are disqualifying. Marking a class complete that a student hasn't taken is precisely the confidently-wrong behaviour this app exists to avoid, and it would have shipped silently.

- **Aug 17, 2026 (third session) — merged scholarships into a real opportunities directory, per direct user feedback that the page was wrongly scoped and wrongly labelled. Full detail in Section 16R.** `/opportunities` now unifies scholarships (`data/scholarships.ts`) with the internships/programs/competitions that already existed in `data/major-opportunities.ts` but were stranded inside `/major`. Nav renamed from "Money" to "Opportunities". `/scholarships` redirects rather than 404s. **A duplicate-key bug was caught live in verification** — RSI and NIH SIP are each intentionally listed under two major families, and the naive `opportunity:${name}` id silently dropped one copy via a React key collision; fixed by keying on name+family together. Lesson for this file specifically: a name shared across two families needs a family-qualified key.

- **Aug 17, 2026 (fourth session) — automation, tests, and the parent signup path. Full detail in Section 16S.** The decisions worth keeping:
  - **The "pushes need the user" claim in both docs was stale and is now corrected.** The macOS keychain holds a working token; `git push` succeeds from this machine. The one real limit is that the token lacks the **`workflow` scope**, so any push touching `.github/workflows/**` is rejected *in full* — commit workflow files separately.
  - **`./scripts/ship.sh` is now the way to ship**: typecheck → lint → test → build → commit → push, refusing to push on any failure. Master auto-deploys to production with no staging and no review, so the full check has to be the default path rather than something to remember.
  - **First tests in the project's history — 30, scoped to pure logic and data integrity only.** Both bugs that shipped earlier the same day have regression tests. The freshness tests deliberately fail on their own once content data passes a year old; the fix is always to re-verify, never to bump the date.
  - **Vercel Analytics/Speed Insights added, and deliberately scoped to "do pages load".** Not product analytics: per Section 7 this audience is right to be wary of measurement, so nothing records identity, entered data, or AI questions.
  - **React Compiler lint rules downgraded to warnings, with the reasoning written into `eslint.config.mjs` rather than silently ignored.** They fire inside working WebGL code, don't affect what ships, and are their own session to fix. Every other rule still fails the build.
  - **Parent accounts finally have a signup path.** The July 21 "parent accounts are standalone" decision had been real in the schema and unreachable in the product since migration 0001 — every account created was silently a student. Onboarding now asks the role first, states the standalone-account decision on screen the moment "parent" is chosen, never asks a parent to identify their child, and routes parents to `/guide` after one fewer question rather than to a student's roadmap.

## 15. Current Build Status

*(Update after every session — this is what you paste into a new AI tool to catch it up instantly. This section was found significantly stale on Aug 15, 2026 and again needed a full rewrite on Aug 16 — see the Decisions Log — so treat any gap between this section and `git log` as a signal to re-audit, not as "nothing happened.")*

**Rewritten in full Aug 16, 2026, end of session, at the user's explicit request before clearing the session. Everything below is accurate as of the last push. Read the "What's next" block first — that's the actual handoff.**

### What's live (all of V1 + V2 steps 1–4, 6–10, and 5A are shipped and pushed)

- **Accounts/auth/backend** — email/password + Google OAuth, session refresh, route gating, `profiles`/`roadmap_progress`/`activities`/`chat_messages`/`share_links` schema, all RLS-enabled, correctly-scoped account deletion. **All migrations 0003–0007 confirmed applied** (checked directly against the live database this session, not assumed).
- **Content** — 51 roadmap items, 6 guide articles, the two FAFSA-cycle dating errors from the Aug 15 audit fixed, freshness stamps on every guide article.
- **AI, three surfaces, one shared guard** — Ask AI, the activities interview (the differentiator — pulls real activities like caregiving/translating out of students who say "I don't do anything"), and extraction. All on Gemini free tier via `lib/ai/guard.ts`.
- **⚠️ AI reliability hardened Aug 16, 2026 (this was broken in production earlier today, now fixed and verified):**
  - **`MODEL_CHAIN`** in `lib/ai/guard.ts` falls `gemini-3.7-flash` → `gemini-3.5-flash` → `gemini-3.1-flash-lite`. Reproduced both real failure modes against the live key this session — 503 "high demand" and 429 quota-exceeded — and confirmed 3.5 answers within seconds when 3.7 is saturated on the same key. Falling across models rescues far more requests than retrying one model harder.
  - `thinkingConfig` dropped to `0` for chat and the interview (was `-1`/adaptive) — quota is the real binding constraint in practice, thinking tokens cost against every message's output budget, and answer quality was indistinguishable in testing. History trimmed 20→10 turns, same reason.
  - 429 and 503 now surface different user-facing text — one means "come back tomorrow" (daily quota), the other "try again in a few seconds" (transient). Telling a student to retry against an exhausted daily cap just wastes their evening.
  - **Root cause of "the migration didn't work" bugs, twice now:** migrations are applied by hand in the Supabase dashboard, so a missed one is a normal operating state, not exceptional, and it silently killed working features both times (0004 crashed the account page, 0005 broke Ask AI's insert/read entirely). `lib/db/resilient.ts` now retries once without the newer column on a Postgres `42703`/undefined-column error, so a missing migration degrades a feature instead of killing it. Applied to all three AI routes.
- **Real scroll bug found and fixed Aug 16, 2026:** Lenis (the smooth-scroll library) caches the page's scrollable height at mount and clamps the mouse wheel to it. Any content that grows *after* mount — "Show all 24," an expanding roadmap item, a chat reply streaming in — left that cached limit stale, so the wheel died partway down the page while the scrollbar (which bypasses Lenis) kept working. That wheel-dead/scrollbar-fine asymmetry was the tell. Fixed with a debounced `ResizeObserver` on `document.documentElement` in `SmoothScroll.tsx` that recalculates on any height change, rather than requiring every expandable component to remember to call `.resize()`.
- **Major-family lens (5A) + de-boxed Aug 16:** structural grade-phased pathways, `askCounselor` questions (not answers), `verify` lists. The card's outline was changed to a left accent rule at the user's request — same content, no box.
- **5B — researched opportunities, 4 of 8 families done:** engineering-cs, health-medicine, humanities, natural-sciences, plus a cross-cutting LEDA Scholars entry shown to every major. All verified against official sites on 2026-08-16, dated. arts-design/business/social-sciences/education explicitly say "not yet researched" rather than showing an empty list.
- **Gap analysis, journey arc, tools (fee waivers + essay brainstorm, gated + surfaced from roadmap items), freshness stamps, parent mode + Spanish UI chrome, counselor share link** — all built, all pushed. See CLAUDE.md's Current Status bullets for the file-level detail on each; not re-duplicated here.
- **Design:** true-black grounds, Figtree display face, per-page accent + 3D backdrop system. Not yet explicitly signed off as final by the user.
- **Deployment:** `origin/master` and local are fully synced as of the last commit this session — confirmed via `git log origin/master..master` returning empty. Auto-deploys to **https://pathfinder-atharv.vercel.app** on every push.

### What's planned but NOT built — this is the actual next work

**Section 16K in full** (a long section — read it, this is just the index). *Updated Aug 17, 2026: steps 1–3 are now BUILT — this list was stale as written on Aug 16.*

1. ~~**`/major` — a dedicated page.**~~ **BUILT Aug 16 — Section 16L.**
2. ~~**Tools become individual pages.**~~ **BUILT Aug 16 — Section 16M.** (The scholarships hub also shipped that day — Section 16N.)
3. ~~**Settings/stats page + the per-course-list schema.**~~ **BUILT Aug 17 — Section 16P.** `/stats` exists, migration 0008 is written **but not yet applied to the live database**. Course data is already wired into the AI's context block.
4. **Structural "what's offered/expected" comparison logic** — the *data* half of this landed with step 3 (student-reported school context in migration 0008); what's still unbuilt is the reasoning that compares a student's courses against a major's structural expectations from `major-pathways.ts`. Nothing blocks it.
5. **Two new AI provider paths, confirmed but not built:** OpenRouter (free-model rotation, resume-text generation only) and Claude Sonnet (Profile Analysis specifically — needs `ANTHROPIC_API_KEY` added to `.env.local` and Vercel; `@anthropic-ai/sdk` is already installed).
6. **The flagship "Profile Analysis" tool** — resume reframing from real activities (same never-inflate rule as the interview), major-based recommendations, gap-based content suggestions, dream-college comparison. **Fully unblocked** (see below). Its prerequisites — the course list and the school ceiling — now exist. Remember to add `/tools/profile-analysis` to the `TOOLS` array in `src/data/tools.ts` when it ships.
7. **Homepage promotion of Profile Analysis**, per the user's explicit ask.

### The ML-model question — RESOLVED Aug 16, 2026, do not re-open

*(This block previously read "not resolved" and was left stale after the decision was made — corrected Aug 17.)*

The user decided explicitly: **the trained model stays the brother's side project and never ships into PathFinder.** The dream-college comparison is therefore **unblocked**, and is built on **published NCES / Common Data Set aggregate ranges** — descriptive facts about a school's last admitted class, never a probability or a verdict about this student. See §16N for the framing rules (especially the test-optional caveat most sites get wrong) and §16O for the full build plan for the project itself. Don't re-litigate either.

### Known smaller open items

1. Onboarding still only collects grade + major-family (both skippable) — doesn't capture the fuller Section 4 profile model, and there's no UI path to register as a parent account despite `LanguageAndRole` existing (it's a settings toggle, not part of signup). Deliberate-light-onboarding vs. expand is still an open call.
2. Mobile has real fixes, not a full documented responsive audit.
3. Design not explicitly signed off as final.
4. Guide articles haven't had the deeper content pass that the roadmap already got (middle-school depth pass, Ivy-testing update, FAFSA dating fixes) — still the original Aug 11 port apart from those specific corrections.

**Immediate next action (rewritten Aug 17, 2026, later session — §16K items 1–7 are now ALL BUILT; see §16L, §16M, §16N, §16P, §16Q):** there is no queued §16K work left. The open items are the ones under "Known smaller open items" below, plus: re-check **Golden Door Scholars** and **Ron Brown** for the scholarships directory (both were verified-but-unlistable on Aug 17 — see the note at the foot of `data/scholarships.ts`), the guide-articles depth pass, and adding `ANTHROPIC_API_KEY` / `OPENROUTER_API_KEY` if the AI paths should stop running on the Gemini free tier. *(Historic note, kept because it was the previous instruction:* run migration 0008 in the Supabase dashboard — `/stats` ships with a visible "run migration 0008" panel until they do, — **the user confirmed on Aug 17, 2026 that this has been run**, so `/stats` is live.)*

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

## 16K. V2 Extension — Major Page, Restructured Tools, Profile Analysis (PLANNED Aug 16, 2026, NOT BUILT)

*This entire section is a plan captured at the user's explicit request — "understand everything first, don't build anything yet." Nothing in this section exists in code. Before building any of it, confirm the plan still matches what the user wants; a lot of detail below is this session's understanding, not a locked spec.*

### Why this section exists

The user laid out a substantial expansion in one message: a dedicated major page, tools becoming real pages, a separate stats-editing page, and a new flagship "Profile Analysis" tool. Rather than build immediately, the instruction was to understand it fully, write it back for confirmation, and document it for handoff — this section is that documentation. Migration 0005 was confirmed applied (`chat_messages.kind` exists) in the same session, so the AI resilience/fallback work from the previous entries is fully live.

### 1. `/major` — a dedicated page, not a roadmap card

**Problem being solved:** major-specific guidance currently lives inside `MajorLens`, a card bolted onto the shared `/roadmap/[grade]` page. The user correctly identified this as "mixed together" — it doesn't feel like its own thing, and it can't grow without crowding the general roadmap.

**Plan:** a new route, `/major` (or `/major/[grade]` if grade-scoped routing reads better once built — decide at build time). Contents:
- Major switcher at the top, backed by the same 8 `MAJOR_FAMILIES` in `majors.ts`.
- A **specialized, grade-by-grade breakdown** — more detailed than the current `phases` field — covering, per grade: common courses, common extracurriculars, and common **narrative angles** (the story/theme an application in that field often tells — e.g., a sustained personal project for CS, patient-facing volunteer work for health/medicine). All three must stay in the register the file header already establishes: "commonly true of this field," never "this is what got someone in." No past-admit claims, ever — that's explicitly out of scope per Section 3B and the existing `majors.ts` header.
- The 5B researched opportunities (`major-opportunities.ts` / `Opportunities.tsx`) **move here** from their current home inside `MajorLens`. `/major` becomes the one real home for all major-specific content; the grade roadmap should carry only a slim one-line link out to it (something like "Health & Medicine · what changes for grade 9 →"), not a duplicate card.

**Content cost:** the grade-phased structural data (course/EC/narrative patterns) is Part A-style work — checkable, no per-program research needed, safe to build without new web research. This is distinct from 5B's named-program research, which stays sourced and dated as it already is.

### 2. Tools become real pages

**Plan:** `/tools` becomes an index/gallery rather than a single page with sections. Each tool gets its own route:
- `/tools/fee-waivers` (currently a section on `/tools`)
- `/tools/essay-brainstorm` (currently a section on `/tools`)
- `/tools/profile-analysis` (new — see below)

Existing deep links from roadmap items (`src/data/item-tools.ts`, e.g. `/tools#fee-waivers`) will need updating to real routes (`/tools/fee-waivers`) once this ships — that file is the single place those links are defined, so it's a contained change.

### 3. A dedicated settings/stats page

**Problem being solved:** the user doesn't want profile-stat editing living inside the same area as account/email management — wants it separated so profile analysis has an obvious, discoverable place to edit the inputs it reads.

**Plan:** relocates the existing `ProfileDetails.tsx` fields (GPA, GPA scale, SAT/ACT, target colleges, first-gen, home language, status) to their own page/route (e.g. `/account/stats` or a top-level `/stats`) rather than a second copy of the same fields.

**RESOLVED Aug 16, 2026 — this is new schema, not a relocation of `course_rigor`.** The user was explicit: *"i want like exactly the per course list, just enough rigour is not enough — i want users to describe classes they're taking compared to what's offered, so the AI can analyze their course rigor."* This means:
- A new structure — most naturally a `courses` table (`user_id`, `grade`, `course_name`, free text or a light autocomplete) rather than reusing the `course_rigor` enum bucket, which stays as a coarse fallback for students who skip the fuller list (per the standing "N/A is okay" rule — the detailed list must stay optional).
- Also needs a per-school **"what's offered/expected"** side to compare against — this doesn't exist yet anywhere in the schema and needs its own design pass (likely keyed off the structural, Part-A-style patterns already in `majors.ts`, e.g. "engineering commonly expects calculus by senior year," rather than per-school scraped course catalogs, which would be a much larger and staler undertaking).
- Feeds directly into the Profile Analysis comparison in section 4 below — this is genuinely a prerequisite for that feature doing anything beyond guessing, not an optional nice-to-have.

### 4. The flagship tool — Profile Analysis / Resume Builder

The centerpiece of this whole plan. Reads the student's full profile and:

- **Builds/reframes a resume from their activities** — takes what's already in the `activities` table (populated by the step-3 AI interview or manual entry) and writes it up clearly. **Same hard rule as the activities interview: reframe, never invent.** "Watched siblings after school" can become a well-written, honest sentence; it can never become a fabricated title or an exaggerated scope. This is a real risk surface — the user's own words were "reframe what they have to make it sound better," which is the right instinct done carefully, but is one prompt-writing mistake away from crossing into the inflation the interview extraction prompt explicitly forbids. Whichever prompt drives this needs the same "never inflate" rule stated as explicitly as `interview-prompt.ts`'s `EXTRACT_PROMPT` does.
- **Recommends internships/projects/programs** by major — surfaces 5B's researched opportunities (and/or Part A's structural patterns) relevant to the student's specific profile, not just their major in the abstract.
- **Surfaces relevant guide/roadmap content** based on gaps in their profile — framed positively ("here's what might help"), explicitly not as a deficiency report. This directly echoes the existing non-negotiable rule from `WhereYouAre`/gap analysis: **never score the student.**
- **Compares against their "dream colleges"** (the `target_colleges` field already in the schema) — reach/target/safety framing, flagging **structural** gaps only (a required course not on their transcript per the new courses list in section 3, a language sequence not far enough along, a testing requirement they haven't planned for).
  - **⚠️ STILL UNRESOLVED — see the full Aug 16 discussion below.** The structural-fact-checking-yes / odds-framing-no boundary from the original plan still stands as the design rule for *this specific feature* (§4's comparison), and reach/target/safety here should stay the student's own categorization or published non-probabilistic context, not a model estimate. What's newly in play is a **separate, adjacent idea** — an actual trained prediction model — which is documented on its own below because it's a bigger and different decision than this bullet point.
  - **Reach/target/safety definitions**, if built, should reuse language already established in the roadmap content itself (`11-2`, "Build a real range: reach, target, and safety") rather than inventing new definitions.
- **Takes current courses + planned future-grade path as input** — RESOLVED, see section 3 above: a real per-course list, new schema.

#### ⚠️ Aug 16, 2026 addendum — a proposed admissions-chancing ML model, flagged as an OPEN DECISION, not settled

**RESOLVED Aug 16, 2026, later that day — kept here unedited as the historical record of the reasoning, but this is no longer open.** The user chose the side-project-only path explicitly: the model never ships into PathFinder, and the NCES/Common Data Set aggregate approach is the real product feature instead. See §16N for the resolution and §16O for the full, research-verified build plan for the project itself (real dataset findings, methodology, limitations-section content, and resume framing) — read those two before saying anything about this project.

The user separately proposed something bigger than the structural comparison above: training an actual machine-learning admissions-prediction model — floated partly as a CS learning project for the user's brother — using public datasets (Kaggle's "Graduate Admission 2" / "College Admission Dataset", NCES College Navigator aggregates) plus, later, self-reported outcome data crowdsourced from PathFinder's own users once it has real traffic, explicitly citing this as how CollegeVine and Scoir built their chancing calculators. Also mentioned in the same message, as later/bigger ideas rather than scoped asks: AI-analyzed essay feedback, and a scholarship/internship finder trained on public data.

**Recording the user's proposal accurately, and my pushback alongside it, so neither gets lost:**

- **The CS project itself, as a learning exercise for the brother — no objection.** Training a model on Kaggle data end-to-end is a legitimate, well-scoped way to learn ML. Nothing about that part needs to touch PathFinder at all, and it's worth doing on its own merits.
- **RESOLVED Aug 16, 2026 — the project's resume/GitHub/college-application value does NOT depend on the deployment question above, and doesn't need that question settled to be worth building.** The user asked directly whether it's worth building if it "doesn't do anything" (i.e. never ships into PathFinder). It is — and the version that's actually strongest for a resume is the honestly-scoped one, not a deployed one:
  - Reviewers of a student ML project (admissions readers who code, recruiters, CS faculty) don't expect production-grade accuracy. What signals real understanding: a rigorous evaluation section (accuracy/precision/recall, cross-validation, comparing model types), and — the part most student projects skip — an honest limitations write-up.
  - **The domain-mismatch and self-report-bias problems flagged above are the best material for that write-up, not a reason to abandon the project.** Explicitly researching and writing up *why* the Acharya-style dataset doesn't generalize to U.S. undergrad admissions, and *why* self-reported outcome data carries survivorship bias, turns the critique into the project's actual intellectual content — more sophisticated than a project that just reports a number and stops.
  - **Concrete fix that resolves the framing tension entirely: title and scope the project honestly** — "Predicting graduate admission likelihood from [dataset], and why this doesn't generalize to U.S. undergrad" rather than "College chancing predictor." Same code, same learning, same repo, but now accurate about what it does — which is the difference between a project that survives a technical reviewer's questions and one that doesn't.
  - This is fully independent of whether it's ever wired into PathFinder. Build and ship the GitHub repo on its own timeline regardless of how the production-deployment question below eventually gets decided.
- **Deploying it into PathFinder as a chancing calculator — flagged as a real concern, not a style preference.** Two specific, checkable problems raised in-session (verify these independently before deciding, per this project's own "never state a stat without checking it" rule):
  1. **Domain mismatch.** The "Graduate Admission 2" dataset commonly found on Kaggle (Mohan Acharya's) is GRE/CGPA data for international students applying to graduate school — a different country, different applicants, and a different admissions process from a U.S. high schooler applying to undergrad. A model trained on it would be learning the wrong population's patterns, not just a small sample of the right one. "College Admission Dataset" is a generic, commonly-reused Kaggle name shared by datasets of varying and often unclear quality/scope — which specific one is meant needs to be pinned down and scrutinized before any of this is built, not assumed usable because the name sounds relevant.
  2. **Self-reported outcome data is famously biased even at real scale**, let alone PathFinder's current scale of zero users — students who got in report more than students who didn't (survivorship bias), a known-hard problem that CollegeVine's own data science team, with far more data and years head start, hasn't fully solved.
  - **The actual risk isn't "the model might be a little rough."** It's a confident-sounding percentage handed to a nervous first-gen student, from a tool whose entire premise (Section 1, and the explicit rejection of a chancing calculator in §16B) is *not being another confidently-wrong college site* — and a homegrown model can read as more authoritative than a generic one ("PathFinder's own AI says..."), which makes a bad number more dangerous, not less.
- **Suggested middle path — this is the one the user chose; see the resolution note above:** keep the NCES/Common Data Set aggregate approach (published, real, citable ranges — "this school's admitted-class SAT range is X–Y") as the actual product feature, since it's genuinely differentiated from CollegeVine and carries none of the fabrication risk. Keep the predictive model as the brother's separate project, worth building for what it teaches, and treat wiring it into user-facing predictions as a much later conversation requiring real validation — not something to fold into this build queue now.
- **Essay feedback (AI reading a student's own draft and giving notes) is a materially different feature from `EssayBrainstorm`'s hard "writes nothing, ever" rule** — giving feedback on existing text isn't the same as generating it, and could be built consistent with that rule (questions/notes only, never a rewrite handed back) — but needs the same explicit care taken with `EXTRACT_PROMPT`'s never-inflate rule elsewhere in this doc. Not scoped or built.
- **Scholarship/internship finder trained on public data** — named by the user as "a much bigger project," later, not scoped. If built, the same 5B verification discipline applies: real, checked, dated entries, not model-generated ones.

~~**This entire addendum needs an explicit user decision...**~~ **RESOLVED — see the note at the top of this addendum, §16N, and §16O.** Do not treat the CS-project enthusiasm as approval to wire predictions into the live product; the decision was specifically for the side-project-only path.

**Advertise from the homepage once built** — per the user's explicit ask, this becomes a named, promoted feature once it exists, intended to be the thing that pulls people into checking out the rest of the tools.

**Design bar:** the user was explicit this needs to be visually excellent ("really important tool... looks super cool... has to be built well to be visually appealing"), consistent with the project's existing per-page 3D/accent-system standard (`PageFrame`, `SceneBackdrop`, `KineticText`) rather than a plain form-and-results page.

### 5. Two AI providers, chosen per-feature by stakes

A real architecture decision, not an implementation detail — worth its own heading so it isn't lost in a future diff.

- **Profile Analysis (the flagship): upgrade to Claude Sonnet.** `@anthropic-ai/sdk` is already installed (kept installed specifically for this eventuality — see the PROVIDER note in `api/chat/route.ts`), and `ANTHROPIC_API_KEY` needs to be added to `.env.local` and Vercel. This is the highest-stakes AI feature in the app (touches the college-comparison boundary above, writes resume content that goes to real applications) and the user explicitly wants to spend real money here rather than stay on the free tier.
- **Resume-building generation ("the building"): OpenRouter, multi-model fallback. CONFIRMED Aug 16, 2026.** The user asked specifically for an OpenRouter-backed chain that "keeps defaulting to other AIs if one is down" — the same *shape* as the `MODEL_CHAIN` fallback already built for Gemini in `lib/ai/guard.ts` (`callWithFallback`, `withRetry`), but spanning **providers** via OpenRouter rather than falling across models within one provider. **Explicitly free-tier models, rotated** — the user's own framing: "just routes to multiple AI models, never running out of usage for now since we can just keep switching between free models." This is the same cost posture as the Gemini decision (no billing until there are real users), just spread across more free capacity via OpenRouter rather than betting on one provider's free tier alone. This needs a new `OPENROUTER_API_KEY` and a parallel guard/fallback module (or an extension of the existing one) that speaks OpenRouter's API shape rather than `@google/genai`'s. **Scope stays resume-text generation only** — not chat, not the crisis/immigration-adjacent surfaces, per the risk-scoping reasoning in the next bullet.
- **Note the earlier OpenRouter decision this doesn't overturn:** `master-spec-doc.md`'s Aug 15 entry deferred OpenRouter for the *main chat* specifically because of the crisis/immigration-enforcement guardrail risk on a genuinely free/unvetted model tier. That reasoning was scoped to chat's crisis-adjacent paths, not to every AI feature in the app — resume-text rewriting is a different risk profile (no crisis/immigration content), so using OpenRouter there is a distinct decision, not a reversal. Keep both entries; don't let a future session read this as contradicting the earlier one.
- **Practical implication:** three model configurations will exist side by side once this ships — Gemini chain (Ask AI, activities interview), OpenRouter chain (resume building), Claude Sonnet (profile analysis). Each AI route should keep stating its provider choice and reasoning in its own header comment, the way `api/chat/route.ts` already does — do not let a future session quietly collapse them onto one provider "for consistency" without re-deciding the stakes tradeoff above.

### Build order, if/when this proceeds

Updated Aug 16, 2026 (later session) — **step 1 is now BUILT and shipped**; see the Decisions Log entry for that date and Section 16L. Steps 2–8 remain as proposed:
1. ~~`/major` page (contained, no new schema, reuses 5B data)~~ — **DONE.** Shipped with a new content layer (`major-pathways.ts`), a course-ladder diagram, an interactive grade timeline, an eight-family comparison grid, the `azure` accent and the `orbits` backdrop. `MajorLens` is now a one-line pointer; Opportunities moved here. See Section 16L.
2. Tools-as-pages restructure (mechanical, low risk)
3. Settings/stats page relocation **+ the new courses-list schema** (real scope now, per the resolution above — this is a prerequisite for step 6, not just a page move)
4. Structural "what's offered/expected" comparison data per school/major (needed for step 6's course-gap flagging; likely extends `majors.ts`'s existing structural-pattern approach rather than per-school scraping)
5. OpenRouter provider module + Claude Sonnet wiring (plumbing, no user-facing surface yet)
6. Profile Analysis tool itself — **fully unblocked as of Aug 16, 2026 (see §16N).** The dream-college comparison should be built on NCES/Common Data Set aggregate ranges, per the framing rules in §16N. No part of this step is waiting on a decision anymore.
7. Homepage promotion of Profile Analysis
8. (Later, unscoped) AI essay feedback, scholarship/internship finder — see addendum

---

## 16L. V2 §16K Step 1 — The `/major` Page (BUILT Aug 16, 2026)

*Step 1 of the §16K build order. Everything below exists in code and is verified. Steps 2–8 of that order are still unbuilt.*

### Files

| File | What it is |
| --- | --- |
| `src/app/major/page.tsx` | Route. Server-rendered hero, accent `azure`, index `A06`. |
| `src/data/major-pathways.ts` | **New content layer.** Ladders, 4 grade stages, structure facts, per family. |
| `src/components/major/MajorView.tsx` | Client orchestrator — owns the two pieces of shared state (family, stage). |
| `src/components/major/MajorSwitcher.tsx` | The 8-family board. A `radiogroup` with roving tabindex, not a `<select>`. |
| `src/components/major/MajorGlyph.tsx` | 8 hand-drawn hairline SVG glyphs, one construction each. |
| `src/components/major/PathwayTimeline.tsx` | Grades 6–12 spine + proportionally-sized stage buttons. |
| `src/components/major/CourseLadder.tsx` | The course sequence drawn as a connected chain. |
| `src/components/major/MajorCompare.tsx` | All 8 families side by side. Table on desktop, cards below `md`. |

Also touched: `PageFrame` (new `azure` accent), `globals.css` (`azure` tokens, `.swap-in`), `SceneBackdrop` + `Backdrop` (new `orbits` variant), `SiteNav` + `i18n/strings.ts` (nav entry, `navMajor` / "Carrera"), `roadmap/MajorLens.tsx` (cut to a pointer).

### The rules these components are built around

These are the things most likely to get "cleaned up" by a future session that doesn't know why they're there:

1. **Nothing on this page may read as a score.** `PathwayTimeline` is not a progress bar and `CourseLadder` is not a checklist — no fill proportional to completion, no step styled as missing or red, no "behind". A student who joins in 11th grade sees earlier stages as *history*, not *debt*. Same rule as `JourneyArc` and `WhereYouAre`, and a timeline is the easiest place on the site to break it by accident.
2. **The `LockedMeter` in the comparison grid measures the FIELD, not the student.** It says how sequence-dependent a subject is. It has nothing to do with how the student is doing, and every value ships with a one-line reason so the bar is never the whole claim.
3. **Course ladders are the common U.S. sequence, not a universal one.** The caveat renders as part of the diagram, not as fine print under it, and no step is stated as a requirement. A school that stops at Algebra 2 is a context-section note, not a failure.
4. **Browsing other fields is the feature.** The switcher defaults to the student's own major but never locks to it — most of this audience is deciding, not decided.
5. **Don't re-grow `MajorLens`.** If something needs saying about a major, it goes on `/major`.

### Known-good verification commands

`npm run build` and `npx tsc --noEmit` both pass. Note that `/major` is gated, so verifying it in the preview pane requires either a real session or temporarily moving `app/.env.local` aside (which makes `proxy.ts` return early and skips gating — `MajorView` renders fine without Supabase). If you do that, **restore the file immediately.**

---

## 16M. V2 §16K Step 2 — Tools as Pages (BUILT Aug 16, 2026)

Step 2 of the §16K build order. `/tools` was one page with both tools stacked on it, deep-linked from roadmap items via hash fragments. Now:

| Route | What |
| --- | --- |
| `/tools` | Index/gallery, maps over the registry |
| `/tools/fee-waivers` | Fee-waiver checker |
| `/tools/essay-brainstorm` | Essay brainstorming |

- **`src/data/tools.ts` is the registry and the single source of truth for tool URLs.** `item-tools.ts` now builds its roadmap deep links with `toolHref(slug)` instead of hardcoding `/tools#fee-waivers`, which is what stops the two drifting apart the next time a tool moves. No hash links remain anywhere in `src/`.
- **Each tool's `promise` — what it refuses to do — renders ABOVE the tool, not below it.** That's the reason these are separate pages rather than sections: a student arriving from a money-related roadmap item needs to know *before* answering questions that the checker will never tell them they don't qualify, and a student about to write about family hardship needs to know *before* typing that nothing is uploaded and nothing is written for them. Both facts change behaviour only if read first.
- Section keeps the coral accent (tools read as one place); each page takes its own `Backdrop` variant (`sheets` / `grid` / `swarm`) per the standing rule that a new page gets its own geometry.
- `/tools/profile-analysis` is deliberately NOT listed yet — it isn't built, and an index entry linking to nothing is a dead end. Add it to `TOOLS` when it ships.
- Verified: `tsc --noEmit` and `npm run build` clean; all three routes return 200 with correct titles; the checker mounts; no horizontal overflow at 375px.

---

## 16N. V2 §16K Step 3 — Scholarships Hub + the ML Decision (Aug 16, 2026)

### The ML chancing model — RESOLVED

**User decision, explicit: the model stays a side project and does NOT ship into PathFinder.** The dream-college comparison in Profile Analysis is therefore unblocked, and should be built on the **NCES / Common Data Set aggregate middle path** that was proposed in the §16K addendum. The brother's ML project remains worth building on its own terms (see that addendum for why the honest framing is the resume-stronger one) — it simply never feeds a user-facing number.

**Framing rules for when the NCES comparison is built.** These are the whole reason the aggregate path is safe where a model isn't:

1. A published range is a **description of a school's last admitted class**, not a prediction about this student. Render it as "the middle 50% of admitted students scored X–Y", never as a verdict, a percentage, a colour-coded match, or anything a nervous 17-year-old could read as a probability.
2. **The test-optional caveat is mandatory and most sites omit it.** Since testing went optional, published score ranges generally reflect only the applicants who chose to submit scores — which skews them upward. A student comparing themselves against a range that already excludes non-submitters is comparing against the wrong population. Say so wherever a range appears.
3. Reach / target / safety, if used, stays the **student's own categorisation** or published non-probabilistic context — reuse the language already in roadmap item `11-2` rather than inventing new definitions.
4. Flag **structural** gaps only (a required course missing, a language sequence too short, an unplanned testing requirement). Never a holistic judgement.

### The scholarships hub — BUILT

New gated route `/scholarships`, accent `lime`, backdrop `swarm`, nav entry `navScholarships` ("Money" / "Becas"). Data in `src/data/scholarships.ts`, all five entries verified on official sites on 2026-08-16.

- **Verified and live:** The Gates Scholarship, Cooke College Scholarship Program (Jack Kent Cooke), QuestBridge College Prep Scholars, Dell Scholars, TheDream.US National Scholarship.
- **Open-right-now sorts to the top**, via `cycleStatus()`. For a student with twenty minutes, a five-item list where two are open is really a two-item list, and ordering by what is actionable today is what turns a reference page into an application.
- **`cycleStatus()` is deliberately conservative** — it never invents a date, only labels stored ISO dates, and the UI always renders the written `cycle` text plus "confirm on the site" beside it. A computed badge must never be the only thing a student relies on.
- **`sensitive: true` on TheDream.US** renders a note that states no assurance in either direction about immigration risk, pointing to the organisation's own policies and to an immigration attorney. This follows `system-prompt.ts`'s standing rule to the letter: listing awards for undocumented students is correct and high-value, but **reassuring anyone about enforcement risk is never ours to do.**
- Notable verification catch: Dell and TheDream.US cycles had already closed at the time of writing, and both say so explicitly rather than showing a stale deadline as if live.

---

## 16O. The Brother's ML Project — How to Build It for Maximum Resume Impact (Aug 17, 2026)

*This section is guidance for a project OUTSIDE PathFinder — nothing here ships into the app, per the RESOLVED decision at the top of §16N and in `CLAUDE.md`. It exists because the user asked directly for a complete, concrete plan to make this "the most impressive way for a resume," not just the go/no-go decision already recorded. Everything below was verified by real web research on Aug 17, 2026 — the same discipline this whole project applies to its own content — because recommending a dataset that turns out not to exist, or that isn't what it claims to be, would be exactly the kind of unverified claim this app exists to avoid making.*

### The core finding that shapes everything below

**There is no clean, individual-level, real-outcome, publicly available dataset for U.S. undergraduate admissions — and that absence is itself real, checkable, and the best material in the whole project.** Confirmed three ways in this session:

1. The commonly-used Kaggle "Graduate Admission 2" dataset (Mohan S Acharya) is confirmed row-per-applicant with GRE, TOEFL, University Rating, SOP, LOR, CGPA, Research and a continuous "Chance of Admit" — but it is graduate-school data for an international-applicant population, not U.S. undergrad. Already correctly flagged in §16K; nothing new here except confirming it's real and usable as data.
2. The U.S. Department of Education's own College Scorecard API — the most authoritative public source there is — was checked directly: it "provides aggregate data, not individual student-level records," explicitly limited to institution- and field-of-study-level rows. No accept/reject label exists at the applicant level, by design (privacy).
3. The best-regarded academic dataset in this space, Raj Chetty's team's **"Mobility Report Cards"** (Opportunity Insights, Harvard/NBER), links IRS tax records and Department of Education data for over 30 million students from 1999–2013 — real, rigorous, peer-reviewed research. Even this, with resources no side project can match, publishes results at the **college × parental-income-bracket level**, not the individual applicant level. The version packaged on Kaggle (`samsonqian/college-admissions`) confirms this concretely: 1,946 rows, each one a college-by-income-decile cell, not a student.

The honest conclusion, and the one the project's write-up should state directly: **if a team with IRS-linked records on 30 million students still can't publish individual-level admissions data, a hobby project built on a Kaggle CSV cannot either.** That's not a weakness to hide — stated plainly, with these three citations, it's a more sophisticated and better-evidenced argument than most professional chancing tools ever make about their own data.

### Recommended structure — two datasets, two different jobs

**1. The modeling dataset — Kaggle "Graduate Admission 2" (Acharya).** Use this for the actual machine learning. It's real, clean, appropriately small for a learning project (~500 rows, 7 features, a continuous target), and lets the project demonstrate genuine technique without pretending to be bigger than it is:
- Multiple model types compared head-to-head: linear/logistic regression as a baseline, a random forest, a gradient-boosted model (XGBoost or LightGBM), optionally a small neural net. The comparison itself — not any single model's score — is the demonstration of understanding.
- Proper methodology: a held-out test set, k-fold cross-validation, and metrics that match the target (RMSE/MAE/R² if predicting the continuous "Chance of Admit"; accuracy/precision/recall/F1/ROC-AUC if binarized at a threshold).
- **Feature importance via SHAP values.** This is the single highest-leverage addition available: it's a current, respected technique, produces an immediately readable plot, and turns "here's a number" into "here's what's driving the number and whether that makes sense" — which is exactly the kind of check the actual product avoids skipping.
- **A calibration check.** If the model says "70% chance," do roughly 70% of students at that prediction actually get admitted in the held-out data? Calibration curves are a genuinely sophisticated, correct thing to run, and they connect directly to the real-world critique this whole project is built around — a miscalibrated chancing tool is precisely how a confidently-wrong number reaches a nervous applicant.

**2. The evidence dataset — Opportunity Insights' Mobility Report Cards.** Use this NOT for prediction, but as the sourced evidence behind the limitations section — see the core finding above. A student can even run a small legitimate secondary analysis on it (e.g., relating a college's test-score range to its income-access and mobility rates) without ever pretending it substitutes for individual-applicant data. Real, citable, Harvard-caliber data used correctly is worth more here than a bigger dataset used to overclaim.

### The limitations section — the project's actual intellectual content

Per the existing §16K reasoning, this section is not an apology tacked onto the end — it is the most sophisticated part of the project, and should be written and weighted that way:
1. **Domain mismatch, stated with specifics.** Different country, different population (international grad applicants vs. U.S. high schoolers), different scoring scales (GRE/CGPA vs. SAT/GPA), and a different admissions process (numbers-driven graduate admissions vs. holistic U.S. undergraduate review, where files with identical stats routinely get different outcomes).
2. **Self-report and survivorship bias**, with the honest note that CollegeVine's and Scoir's own data science teams — with years of head start and far more data than this project will ever have — haven't fully solved it either.
3. **The data-availability argument above**, with all three citations. This is the part most comparable student projects skip entirely, and it's the part that survives a technical interviewer's follow-up questions rather than folding under them.
4. **What would actually be required to do this responsibly** — a large individual-level dataset with genuine (not self-reported) outcomes, regular retraining as admissions criteria shift year to year, and a lot more validation than any side project can provide. Naming the real bar, and stating plainly that this project doesn't clear it, is the move that separates a research-minded student from one who's only trying to ship a demo.

### Naming it honestly

Per the already-RESOLVED framing fix in §16K: **"Predicting Graduate Admission Likelihood, and Why It Doesn't Generalize to U.S. Undergraduate Admissions"** (or equivalent) — not "College Chancing Predictor." Same code, same models, same learning; the only change is that the title now matches what the project actually demonstrates, which is the difference between surviving a technical reviewer's first question and not.

### Repo presentation — what actually reads as polished

Content is most of the value, but a scrappy repo undersells real work. Cheap to get right:
- A README with, in order: an honest one-line problem statement, links to both data sources with attribution, the modeling approach, a results table comparing every model tried (not just the best one — showing the comparison is the point), the SHAP and calibration findings, and the limitations section given equal visual weight to the results — not buried at the bottom in six-point font.
- One command to reproduce the whole thing (`requirements.txt` or a `conda`/`uv` environment file, a single notebook or script that runs end to end).
- Visualizations worth the five minutes they take: a model-comparison bar chart, a SHAP summary plot, a calibration curve, a correlation heatmap of the input features. These are the images a recruiter or reader actually looks at before reading a word of text.
- **Optional stretch, genuinely high-value if there's time: a small Streamlit or Gradio demo** where a visitor enters GRE/CGPA-style inputs and sees the model's output — with a large, un-missable banner stating it's a grad-school/international model being shown for demonstration, not a college chancing tool. A live, clickable demo is one of the highest-impact things a student project can have, specifically because almost no other student project bothers to ship one.

### How this reads on an actual resume

A single strong bullet, built from everything above, reads roughly like: *"Built and evaluated four ML models (logistic regression, random forest, XGBoost, neural network) predicting graduate admission likelihood on a public Kaggle dataset; performed SHAP-based feature-importance and calibration analysis; authored a sourced case study — citing Opportunity Insights' Mobility Report Cards and the U.S. Department of Education's College Scorecard — explaining why individual-applicant prediction doesn't generalize to U.S. undergraduate admissions, and why no public dataset currently allows it to."* That sentence signals real technical range (four model types, SHAP, calibration — not a single `.fit()` call) and real research judgment (a sourced, checkable argument, not an assumption) in one line, which is what separates this from the large number of "predict admission with ML" tutorial-clone projects that already exist.

---

## 16P. V2 §16K Step 3 — `/stats` and the Per-Course Schema (BUILT Aug 17, 2026)

*Step 3 of the §16K build order (numbered 4 in CLAUDE.md's handoff queue — same item). Everything below exists in code. **Migration 0008 has NOT been applied to the live database** — the user runs migrations by hand in the Supabase dashboard, and until they do, the course list shows an explicit "run migration 0008" panel instead of silently failing.*

### What shipped

**`supabase/migrations/0008_courses.sql`** — a real `courses` table (`user_id`, `grade`, `title`, `level`, `subject`, `status`, `sort_order`), owner-only RLS, reusing the existing `touch_updated_at` trigger. Plus four student-reported school-context columns on `profiles`: `school_ap_offered` (banded), `school_offers_ib`, `school_offers_dual_enrollment`, `school_course_limits` (free text).

**`/stats`** — a new gated route (inherits the `proxy.ts` gate, no change needed there). Carries grade, major, three count tiles, the course list, the school-context block, and the existing `ProfileDetails`. Keeps `/account`'s violet — these are one place in a student's head, the same reasoning that keeps `/tools/fee-waivers` coral — but takes a new `strata` backdrop variant per the standing one-geometry-per-page rule.

**`/account` shrank to what it actually is:** email, language/role, share link, deletion. Grade, major and every profile field moved out. §16K was explicit that this is a relocation, not a second copy — do not re-add profile fields there.

### The decisions inside it

- **`course_rigor` stays.** The four-bucket answer from migration 0004 is the one-click path for a student who won't type out twenty-four classes, and "N/A is okay" means the detailed list can never be the price of admission to anything. Both live on the same page; neither is required.
- **The school's ceiling is asked, and it is the entire point.** A course list alone can't answer "is this rigorous?" — two APs is a thin schedule at a school offering twenty-five and the most rigorous one available at a school offering three, and PathFinder's students are disproportionately at the second kind of school. Every generic admissions tool reads them as the first. `SchoolContext.tsx` exists to prevent PathFinder joining them.
- **Student-reported, not scraped.** §16K left the "what's offered" side needing a design pass; this is the resolution. No maintainable public catalog of U.S. high school course offerings exists, and inventing one from partial scrapes would produce confident wrong answers about a student's own school. A student knows whether their school has IB.
- **`school_course_limits` is the most under-asked field in the schema.** Real schools cap AP enrolment, gate honors behind a teacher recommendation, or lock the math track in 8th grade. Without that, a capped schedule reads as an unambitious one — which is false, and is precisely the misreading this app exists to correct.
- **Free-text course titles**, because "Algebra II", "Algebra 2 CP" and "Integrated Math III" are often the same class and a fixed picker would make students mislabel their own transcript.
- **Never a score.** The counts are counts — no target, no denominator, no progress bar, same rule as `WhereYouAre` and the `/major` timeline. The `strata` backdrop drifts sideways rather than rising or filling, deliberately, so the page's own decoration can't read as a meter.
- **Courses are NOT in `get_shared_progress`** (migration 0007's counselor link). They stay owner-only. Adding them there later is a privacy decision, not a feature one.

### It already does something — the AI reads it

`buildContextBlock()` now emits the course list grouped by grade, the school's ceiling, and the school's rules, each with an instruction attached: describe, never rank; if the ceiling isn't known, ask rather than assume; treat the school's rules as real constraints and never suggest a course they block. The instruction matters as much as the data — a model handed a transcript will rank it against an imagined national average unless told not to, which is exactly the failure mode above. This makes step 3 useful before Profile Analysis exists, rather than schema sitting idle.

The chat route's profile `select` names explicit columns, so it wraps the 0008 columns in `tolerateMissingColumn` — naming a column that doesn't exist fails the *whole* select, which would have dropped every piece of chat context rather than just the new fields.

### Also fixed in passing

`/major`'s "Change your major" link pointed at `/account`, where no major control has ever existed — a dead end. It now points at `/stats`, which has one.

### Verified

`tsc --noEmit` and `npm run build` clean, `/stats` in the route manifest. Page renders with correct copy and no console errors. Every control renders with a real label; the missing-migration panel renders and names 0008 explicitly; `SchoolContext`'s `undefined`-vs-`null` normalisation confirmed against a seeded profile (an unanswered yes/no stays "Not sure" rather than rendering as "No" — the migration-0004 bug that shipped once already). `strata` geometry checked numerically (143 instances, positions finite, wrap correct). **Not verified by eye:** the signed-in view — localhost can't hold a session (the documented dev bypass shows the signed-out state) — and the 3D backdrop, since the preview pane reports a zero-width viewport and the ambient-3D gate requires ≥640px. The user should look at `/stats` in a real browser after applying migration 0008.

---

## 16Q. Perf, the Text-Clipping Bug, the Scholarships Directory, and Profile Analysis (BUILT Aug 17, 2026)

*Second build session that day. Closes §16K items 4–7 — the queue from §16K is now complete.*

### 1. The text-cutting bug — real, found, measured

The user reported text "being hidden or ingrained into the background and being cut off especially at the bottom of the words." Two separate defects, both confirmed with numbers rather than by eye:

**Descenders were being sliced off every animated heading.** `.display` runs `line-height: 0.95`, tighter than the font's glyph box, so descenders (g, y, p, j) legitimately overflow the line box. Fine on its own — until GSAP `SplitText`'s `mask: "lines"` wraps each line in an element with `overflow: clip`. Measured at a 100px font: **12.5px of ink below the clip edge**, gone.

The existing `.split-line` padding rule was a **no-op** against this. It put the padding on the inner line element with a matching negative margin, so the mask sized itself to the same box and the extra padding landed outside the clip edge. `overflow: clip` clips at the **padding box**, so the padding has to be on the *mask*. Fixed by adding `.split-line-mask` (GSAP names the wrapper `<linesClass>-mask`), and by giving `KineticText` a `linesClass` at all — it had none, so no CSS could reach its masks, which is why every page heading clipped. After: the clip edge sits **7.5px below** the ink. Reveal offsets moved 108%→140% so the extra room doesn't reveal the incoming line early.

**`--color-smoke` was under AA on panels.** #78777f measures 4.74:1 on pure black but **4.43:1 on `--color-panel`** (#0b0b0d) — below the 4.5:1 minimum — and it's used for `.micro`, the ~11px labels. Raised to #8b8a92 (5.7:1 on panel, 6.0:1 on black). Third time this class of bug has surfaced; the rule stands: compute the ratio, don't look at it.

### 2. Performance — the site really was slow, and mostly not because of WebGL

The user reported lag "even on my type of laptop". In order of what each change bought:

- **`.aurora` / `.aurora-accent` were the biggest cost, on every page, with no 3D involved.** `inset: -30%` (a surface ~2.5× the viewport) under `filter: blur(90px)`, animated with a `scale()` in the keyframes. A *scaled* blurred layer can't be reused by the compositor, so the browser re-rasterises the whole blurred surface every frame forever. Fixed: `scale()` removed from the keyframes (translate-only is a pure GPU composite), blur 90px→48px, inset −30%→−14%.
- **Every WebGL canvas now stops when it can't be seen.** `lib/useCanvasActive.ts` drives R3F's `frameloop` from an IntersectionObserver plus `visibilitychange`. The homepage carries five canvases; previously all five rendered every frame regardless of scroll position, and a backgrounded tab kept drawing.
- **`EffectComposer multisampling={0}`** on all three post-processed scenes. The composer defaults to 8× MSAA on its render target — a large per-frame cost for backgrounds that are bloomed and blurred anyway.
- **DPR caps lowered** (backdrops 1.5→1.25, hero 1.75→1.5, others 1.6→1.3). Cost scales with the square of the ratio, and these are hairline geometry behind text.
- **Film grain layer** `inset: -50%` → `-8%`. It only ever shifts ±1.5%, so three viewports of noise were being composited per frame to be seen by nobody.
- **Lenis tuned snappier** (duration 1.05→0.85, lerp 0.1→0.14). Inertia that takes too long to settle reads as *lag*, which is the exact word used.

### 3. Scholarships became a real directory (5 → 12 awards)

Seven new entries, each verified by opening the organisation's own page on Aug 17, 2026: **Coca-Cola Scholars** ($20k, open now, closes Sept 30 2026), **QuestBridge National College Match** (full four-year, closes Oct 1 2026), **Elks Most Valuable Student** (closes Nov 12 2026 — and it states plainly that permanent residents do *not* qualify, which matters here), **HSF Scholar Program** (explicitly lists DACA), **APIA Scholars**, **Cooke Young Scholars** (7th graders — the earliest thing on the site, and the only entry that serves the middle-school half of the roadmap), and the **Hispanic Heritage Youth Awards** (listed with its cycle explicitly marked as not-yet-posted).

**Two were deliberately left out and the reason is written into the data file**: Golden Door Scholars (site had moved, showed no eligibility criteria and no next cycle — and it is a status-dependent award, where a third-party summary is not an acceptable source) and Ron Brown (official page showed contradictory cycle status on the same screen). Both are the highest-value re-checks for a future session.

The page is now a filterable directory: full-text search across eligibility (students search their own situation — "DACA", "Pell", "junior"), an "open now" filter, grade filter, and five facet tags. Open-right-now still sorts to the top inside any filter. The empty state says the list has nothing *listed* — never "you don't qualify" — and points at counselors, state agencies and community foundations, which run less competitive awards than any of these.

### 4. Profile Analysis — the flagship (§16K items 4, 5, 6, 7)

`/tools/profile-analysis`, own accent (`rose`) and own geometry (`lattice`), promoted from the homepage.

- **`lib/analysis/structure.ts` — deterministic, no model.** Matches the student's course list against their field's ladders from `major-pathways.ts`. Normalised matching (Roman numerals folded, "AP"/"Honors"/"CP" stripped) because district course names disagree. **A real bug was caught in verification and is now a guard with a comment**: "Algebra I" matched the "Algebra 2" step, because the word-overlap fallback drops short tokens and both reduce to `["algebra"]`. Telling a student they've completed a class they haven't is the worst thing this file could do, so a digit mismatch is now disqualifying before anything else runs.
- **School context caveats every reading.** "None" AP offered, or a written course limit, is attached to the output rather than left for the reader to remember.
- **No score, ever.** Not a percentage, not reach/target/safety, not a verdict. A ladder step is "you listed this" or "not listed yet", and the latter is stated as a fact about the *list*.
- **The dream-college section prints no statistic we haven't verified** — per §16N. It teaches the two documents every U.S. college publishes: the **Common Data Set** (section C describes the admitted class) and the federally-required **net price calculator**, with the test-optional caveat most sites get wrong stated explicitly (a score range covers only admitted students who *submitted* scores — a self-selected group, not the class).
- **The AI does exactly one job**: rewriting the student's own activity entries into ~150-character application descriptions. `lib/ai/resume-prompt.ts` carries the never-inflate rule as bluntly as `EXTRACT_PROMPT` does, plus explicit instruction not to corporate-ise family caregiving or translating work. Nothing is saved automatically; ids are validated against the student's real activities so a hallucinated id can't attach text to anything.
- **§16K step 5 shipped as the provider layer**: `lib/ai/openrouter.ts` rotates free models, used by the resume route first when `OPENROUTER_API_KEY` is set, falling back to the Gemini chain otherwise *and* on any OpenRouter failure. The key is unset today, so every request currently takes the Gemini path — a working state, not a broken one. Scope stays resume text only, per the Aug 15 reasoning about crisis/immigration paths.

### Verified

`tsc --noEmit`, `npm run build` and `eslint` all clean. Descender clipping measured before/after. Course matching verified against a fixture (the Algebra bug was found this way). Directory filtering verified live (12 of 12 → 2 of 12 on "Before senior year"). No horizontal overflow at 375px on either new page; filter chips measured 38px and were raised to 44px. **Not verified: the signed-in view** (localhost holds no session) and the 3D backdrops (the preview pane reports a zero-width viewport, so the ≥640px ambient gate never opens).

---

## 16R. Scholarships Merged Into a Real Opportunities Directory (BUILT Aug 17, 2026)

*Third build session that day, direct user feedback: "the scholarship was supposed to be an entire directory for internships, scholarships, programs — not in money, it should be a entire section just for that, not in fucking money."*

### What was actually wrong

Two real problems, not a style complaint:

1. **The nav link to the scholarships page was literally labelled "Money"** (`navScholarships: { en: "Money" }` in `lib/i18n/strings.ts`). That undersold the page even when it was scholarships-only, and became actively misleading once it needed to also cover internships and programs.
2. **Internships and summer programs already existed** — 15 real, verified entries in `data/major-opportunities.ts` — but lived only inside `/major`, gated behind picking a specific field first. A student who wanted to browse money and opportunities in general, not majors, had no single page for it. Scholarships and programs were two disconnected systems.

### What shipped

- **`lib/opportunities.ts`** — a merge layer, not a rewrite. `data/scholarships.ts` and `data/major-opportunities.ts` keep their own headers, verification disciplines and dating rules exactly as they were; this module only combines both into one `UnifiedEntry[]` for display. Splitting the merge from the sources means neither file's verification contract gets diluted by the other.
- **`Opportunity` (major-opportunities.ts) gained a `kind` field** — `"program" | "internship" | "competition"` — tagged by hand per entry (RSI and the NIH programs are internships; MITES, CS4CS, BWSI, TASS etc. are programs; YoungArts and the Wharton competition are competitions). This is what makes the directory's kind filter real rather than guessed at render time.
- **`/opportunities`** — new route, `OpportunityDirectory.tsx`. Search, a kind filter (Scholarship / Internship / Program / Competition), the existing grade and open-now filters, scholarship facet tags rendered as chips on scholarship cards. 28 entries total (12 scholarships + 15 major-opportunities entries + 1 cross-cutting).
- **`/scholarships` is now a permanent redirect to `/opportunities`** (`redirect()` in a server component) rather than deleted, so an old link or bookmark still lands somewhere real.
- **Nav label renamed** `"Money"` → `"Opportunities"` (`"Becas"` → `"Oportunidades"` in Spanish).
- **`/major`'s per-family Opportunities section is UNCHANGED.** It's still the right surface for a student already reading about their field — `/opportunities` is the browse-everything alternative, not a replacement.

### A real bug caught in verification

RSI (Research Science Institute) and the NIH Summer Internship Program are each deliberately listed under **two** major families in the source data (a genuine crossover — RSI matters to both engineering-cs and natural-sciences students, NIH SIP to both health-medicine and natural-sciences). The unified entry's id was originally just `opportunity:${name}`, which collided as a React list key across the two copies — confirmed via a live console key-collision warning during verification, and it silently dropped one of the two rows from the rendered list. Fixed by keying on `name + familyLabel` together. Worth remembering if this file is extended: **any name that appears under two families needs a key that includes which family**, not just the name.

### Verified

`tsc --noEmit`, `eslint`, `npm run build` all clean. Confirmed live: 28/28 entries render, the Internship filter returns exactly the 6 correct rows (both RSI and both NIH SIP copies present, not deduped), the redirect from `/scholarships` lands on `/opportunities`, nav shows "Opportunities" in both the desktop links and the mobile sheet, zero console errors on a fresh tab.

---

## 16S. Automation, Tests, and the Parent Signup Path (BUILT Aug 17, 2026)

*Fourth session that day. Focus: stop doing by hand what a script should do, and close the gaps that block a public launch.*

### The push-credentials finding — the docs were wrong

Both this doc and CLAUDE.md said pushes needed the user because there was "no `gh` CLI and no stored git credentials." **That has been false for some time.** `credential.helper = osxkeychain` holds a working token; `git fetch` and `git push` both succeed unprompted. `gh` genuinely isn't installed, but nothing needs it.

**One real limit, discovered by hitting it:** the stored token lacks the **`workflow` scope**, so any push touching `.github/workflows/**` is rejected — and it rejects the *entire push*, not just that file. The CI workflow is therefore committed separately and sits local until the token is updated. Commit workflow changes on their own so one blocked file can't hold back a session's work.

### `scripts/ship.sh` — verify, commit, push, in one command

```bash
./scripts/ship.sh "what you changed"
```

Runs `typecheck → lint → test → build` and **refuses to push if any step fails**. Every push to `master` auto-deploys to production with no staging environment and no review gate, so a broken master is a live outage on a site students may be using against a real deadline. Making the full check the default path is the entire point. `npm run verify` in `app/` does the same without pushing.

### Tests — 30 of them, and the two bugs that shipped today are covered

Vitest, deliberately narrow scope: **pure logic and data integrity only**. No DOM, no render tests. This project's UI is verified in a real browser, and a wall of brittle render tests costs more than it catches. What earns a test is anything where being wrong is *silent*.

- **`structure.test.ts`** — the false-positive cases are the point. `Algebra I` must not satisfy the `Algebra 2` step; that exact bug shipped this morning and would have told a student they'd completed a class they hadn't. Also covers Roman-numeral folding, honors/AP prefix stripping, school-context caveats, and the forward-only rule for unplanned grades.
- **`opportunities.test.ts`** — unique ids across the unified directory (the duplicate-React-key bug that silently dropped real programmes), plus data integrity the content files previously only asserted in prose: https-only URLs, no duplicate ids, every field the UI reads being present, `opensOn` before `closesOn`, and **never a month without a year** (with an explicit carve-out for entries that honestly state no date at all — QuestBridge CPS is exactly that case).
- **Freshness tests fail on their own** once scholarship or opportunity data passes a year old. That is the enforcement mechanism for rule 5 in both data files, and the fix is always to re-verify the data — never to bump the date.

### CI, and production visibility

`.github/workflows/verify.yml` runs the same four checks on every push and PR — second line of defence behind the local script. It builds with placeholder Supabase env vars so CI can never touch production data.

**Vercel Analytics + Speed Insights added.** Until now there was no way to know whether anything worked in production; a broken page was discoverable only if a student thought to report it, which for this audience means never. Both are cookieless, need no API key, and don't run in local dev. **Deliberately not product analytics** — per Section 7 this audience is right to be wary of being measured, and the only thing we need is whether pages load and how fast. Nothing records who a student is, what they entered, or what they asked the AI.

### Lint debt, recorded rather than hidden

The React Compiler rules in `eslint-config-next` 16 fire ~26 times, almost entirely inside the imperative WebGL layer where the flagged patterns are how the libraries are meant to be used (mutating `dummy.position` inside `useFrame`, reading localStorage on mount). They don't affect what ships — `next build` doesn't run them — and fixing them means reworking verified 3D code. They are **downgraded to warnings with the full reasoning in `eslint.config.mjs`**, so they stay visible and countable while every other rule still fails the build. Genuinely dead imports were removed.

### The parent signup path — a decision that was real in the schema and unreachable in the product

`account_type` has existed since migration 0001 with **no signup path**. It could only be changed from a settings toggle afterwards, which meant every account ever created was silently a student, including every parent's. Section 14's "parent accounts are standalone" decision existed only as a schema comment and a toggle nobody would find.

Onboarding now opens with a role question, and branches:

- **The standalone-account decision is stated on screen the moment a parent selects "parent"** — before the account exists, not buried in settings after. A parent is told plainly that this is their own account, that we won't show them their child's progress or their child theirs, and that PathFinder is deliberately not a monitoring tool.
- **A parent is never asked to identify their child.** The grade question is reworded ("What grade are they in?") with copy stating it only picks which content opens and does not connect the accounts.
- **Parents answer one fewer question and land on `/guide`.** The major question is about the student's own interests, and asking a parent to answer it for their child is exactly the instinct this app shouldn't encourage. The guide is the parent-facing content and the honest destination for an account that deliberately doesn't show a student's roadmap.
- Skipping still defaults to `student`, matching the column default and the common case.

### Verified

`npm run verify` green (typecheck, lint, 30 tests, build). Both onboarding paths walked in a real browser: student shows 1/3 → "What grade are you in?" → 3/3 "Any idea what you want to study?"; parent shows 1/2, renders the standalone-account note, reaches "What grade are they in?" and terminates with "Open the guide".

---

## 17. Handoff Notes for Any New Claude Session

If you're a new Claude session picking this up: read `CLAUDE.md` first (fast-load summary, current status, design warning), then Sections 1–9 here for full mission/scope context, Section 15 for exactly where the build stands, Section 16 for the build order, and the Decisions Log (Section 14) for reasoning behind past choices — don't re-litigate settled decisions without a real reason. Update Sections 14 and 15 (and 16 if the order changes) after every meaningful step — standing instruction from the user. `pathfinder-app.jsx` holds the final, ready-to-use V1 content (roadmap + parent guide articles) — don't regenerate or rewrite it, port it into the real app as-is. If the user asks about the brother's ML project, its full build plan (verified datasets, methodology, limitations-section content, repo presentation, resume framing) is Section 16O — read it before improvising any of that, the dataset claims in it were verified by live web research and shouldn't be re-guessed from training data.
