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
- **Aug 11, 2026:** Deployed to Vercel for the first time so the app is checkable from any device, not just localhost — user explicitly wanted a way to verify GitHub/design changes visually without running the dev server themselves. Logged into Vercel via CLI device-auth flow (user completed the browser approval step), linked and deployed the project (initially auto-named `app` from the folder name), then renamed to `pathfinder`. Connecting to GitHub for auto-deploy required two separate permission grants on the user's end, not one — a Vercel *login connection* to GitHub (account identity) and, separately, installing/authorizing the *Vercel GitHub App* with actual repo access — the first `git connect` attempt failed until both were done. Once connected, the first git-triggered build failed (Root Directory defaulted to repo root instead of `app/`, breaking `@/...` path aliases) — fixed via `vercel project update --root-directory app`. After that succeeded, the deployment turned out to be silently gated behind a Vercel login page (SSO/Deployment Protection is on by default) — disabled via `vercel project protection disable pathfinder --sso` since the whole point is public access. Final working public URL: **https://pathfinder-atharv.vercel.app**, confirmed loading with no console errors and the correct design (true black, orbital SVG present).

---

## 15. Current Build Status

*(Update after every session — this is what you paste into a new AI tool to catch it up instantly.)*

**Where things stand (as of August 11, 2026):**
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
