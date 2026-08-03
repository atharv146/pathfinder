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
- **Current state (as of the Next.js rebuild, `pathfinder-app.jsx`):** warm cream background (`#FAF7EF`) + terracotta accent (`#C2603C`) + Fraunces serif for headings/Inter for body, top nav bar with pill-style tab buttons (Roadmap / Ask AI / Guide), desktop-leaning padding (not yet mobile-first in practice).
- **This is explicitly flagged as a known "generic AI" default pattern** — cream+serif+terracotta and near-black+neon-accent are both call-out examples in our own design guidelines of the clichés AI tools reach for by default. It was approved for the functional/content-building phase only, not as final visual direction. A real design pass is planned (see "Next Steps Sequence" below) — do not treat this palette/font/nav as settled.
- The earlier "sky blue + emerald green, Plus Jakarta Sans, bottom tab nav, Notion/Headspace-inspired spacing" direction from the original Lovable-era planning was **never actually built** and is superseded by the above — removed from this doc so it stops being cited as current.
- Before doing major visual work: check if the user has provided specific reference sites/screenshots (real brief beats defaults), and ask explicitly what's changing (palette? layout? both?) if it's not specified.
- Tone of voice: warm, plain-language, never condescending, avoids jargon or explains it immediately when used
- Mobile-first is the target — assume most users will access via phone, not desktop. Current build does not yet reflect this (top bar uses fixed desktop padding, no responsive bottom-nav pattern) — a known gap to fix in the design pass.

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
- **Aug 2, 2026 (same session, build):** Executed Next Steps Sequence steps 1 and 2 for the first time. Content: rewrote the user-authored roadmap-content-v3 draft into `content/roadmap-content-v4.md` — cut the dash-heavy AI-sounding prose the user flagged, kept all the real research (brag sheets, essay brainstorming, waitlist/LOCI mechanics, senioritis risk, the Cost-of-Attendance-minus-grants comparison method, scholarship strategy, Decision Day mechanics), and added status-aware texture (financial aid eligibility by immigration status, test registration friction for international/no-SSN students, family conversations about status) into the sections where it actually changes the guidance — this was identified as PathFinder's real competitive differentiator in the prior session's competitor analysis, so it's now load-bearing content, not a deferred idea. Design: researched real reference sites the user named (zypsy.com — near-black, Aspekta grotesk, restrained motion; igloo.inc — muted interactive/WebGL studio, IBM Plex Mono; ethicallifeworld.com — bold Sora display type; plus a WLT Design screenshot — dark canvas, warm glow, floating geometric "asteroid" shapes, scroll-driven feel) rather than guessing at "futuristic and bright." Scaffolded the real Next.js app at `app/` and built the new design system into it directly: near-black canvas, amber/ember glow + signal-teal accents, Space Grotesk/IBM Plex Mono/Inter, with reading surfaces (guide articles, roadmap item detail) deliberately calmer than hero/nav chrome. Ported both content sets into working pages (`/roadmap/[grade]`, `/guide/[slug]`) with real interactivity (expand, localStorage mark-as-done). Verified with a live dev server: clean build, clean lint, no console/server errors, manually tested expand + mark-as-done. Left deliberately undone and flagged for explicit confirmation: connecting to the `atharv146/pathfinder` GitHub remote (a nested git repo now exists inside `app/` from the scaffolding tool, needs a flatten-vs-keep decision first), Supabase wiring, and any deployment — all irreversible/shared-state actions on a project tied to a Supabase instance with real signups.

---

## 15. Current Build Status

*(Update after every session — this is what you paste into a new AI tool to catch it up instantly.)*

**Where things stand (as of August 2, 2026, end of session):**
- The Lovable → Bolt build path (Section 14) is abandoned. The real rebuild now exists: **Next.js (App Router) + Tailwind v4, TypeScript**, scaffolded at `app/` inside this repo, with `npm run dev` working and a full production build (`npm run build`) passing clean (TypeScript + ESLint both clean).
- **Content:** the roadmap got a real depth + prose pass this session — `content/roadmap-content-v4.md` (source of truth, human-readable) parses into `app/src/data/roadmap.json`, 47 items across grades 6–12. The v4 pass cut the dash-heavy "AI voice" from the user-authored v3 draft and wove status-aware (immigration status) guidance into the sections where it actually changes what a family should do — financial aid research, testing registration, the family-conversation items. Middle school (6–8) kept its v2/v3 substance with only a prose cleanup, per standing instruction. All 6 parent guide articles were ported **unmodified** (per the standing "don't touch parent guide content without separate direction" instruction) from `pathfinder-app.jsx` into `app/src/data/guide-articles.json` — same content, new home.
- **Design:** first real design pass is done, directed by user-supplied references (zypsy.com, ethicallifeworld.com, igloo.inc, plus a WLT Design screenshot) rather than a default — near-black canvas (`#08080c`), warm amber/ember glow accents, a cooler signal-teal accent, Space Grotesk (display) + IBM Plex Mono (labels/data) + Inter (body). Long-form reading (guide articles, roadmap item detail) deliberately stays calmer and higher-contrast than the hero/nav chrome — glow and motion are confined to chrome, not spread across reading surfaces. This directly answers Section 5's old cream/terracotta placeholder. Note: a dark-canvas-plus-glow direction sits close to the "near-black + neon accent" cliché this project's own guidelines warn against defaulting to — legitimate here because it's grounded in real references the user picked, not a lazy default, but worth remembering if it ever gets flattened into a generic look during later polish.
- **Live pages:** `/` (home), `/roadmap` (grade picker), `/roadmap/[grade]` (all 7 grades, expandable items with a localStorage-backed "mark as done" — real interactivity, not a mock), `/guide` (article index), `/guide/[slug]` (all 6 articles, quick-answer box + key-term glossary intact), `/ask-ai` (honest placeholder — explicitly says the backend isn't wired yet, does not repeat the old broken API call). All verified rendering with no console or server errors via a live dev-server check.
- **Chatbot:** still not functional, by design — the `/ask-ai` page is a clearly-labeled placeholder rather than a repeat of the old broken client-side Anthropic call. Real backend work is Next Steps Sequence step 6.
- **Supabase:** existing project, URL `https://kvnmydvsffjvrsndnawd.supabase.co`, contains real signups from earlier testing — do not recreate. Still not wired into the new Next.js build (deliberately deferred, not an oversight).
- **GitHub:** repo is `atharv146/pathfinder` (public, https://github.com/atharv146/pathfinder) — **connected and pushed.** User chose to flatten (option confirmed Aug 2, 2026): removed the nested `.git` that `create-next-app` had auto-created inside `app/`, initialized git at the working-directory root instead, so docs + `content/` + `app/` all live in one repo. Confirmed via `git ls-remote` that the GitHub repo was genuinely empty before pushing (no risk of overwriting anything). Initial commit pushed to `master`.
- Two smaller fixes carried over from Lovable-era testing, not yet implemented in the new build: (1) immigration status field optional/separate from required onboarding, (2) show user's email (not just name) in the account/logout menu — both blocked on the accounts/backend step (Next Steps Sequence step 6), since there's no auth/profile UI yet.

**Known open issues (not yet fixed):**
1. Some facts in the ported content (state-by-state aid eligibility, org details) should still be spot-checked before public launch, since they can change over time — flagged in the content itself, not silently assumed correct.
2. Chatbot is a placeholder, not functional — real backend needed (Next Steps Sequence step 6).
3. Not yet mobile-first in practice — built and checked at desktop viewport only this session; responsive/mobile pass still needed.
4. No Supabase wiring, no auth, no deployment yet — all deliberately deferred to later steps, not bugs.

**Immediate next action for whoever picks this up:** continue the "Next Steps Sequence" below — steps 1 (content) and roughly step 2 (design) both got real first passes this session; a second content depth pass (step 3) and a fuller design/responsive pass (step 4) are the natural next moves. Resolve the nested-git-repo question before touching GitHub.

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
