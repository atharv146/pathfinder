# PathFinder

**Live: [pathfinder-atharv.vercel.app](https://pathfinder-atharv.vercel.app)**

A free, student-owned college prep app for immigrant and first-generation students, grades 6–12 — built because the advice that actually matters (how financial aid really works, why a "regular" course load at one school is the most rigorous one available at another, what a deadline that isn't senior year still costs you) rarely reaches the students who need it most, and the version that does reach them is usually generic, gated behind a consultant's fee, or wrong.

No paywall, no waitlist, nothing sold. Built and maintained by one high school student.

## What it actually does

- **A 7-year roadmap**, grade 6 through decision day — 51 items, each one specific rather than generic, with a gap-analysis view that shows what's still open without ever scoring or ranking a student against anyone else.
- **9 in-depth guide articles** covering the U.S. college system, financial aid, supporting a child's application, GPA and course rigor (including the UC honors-point rules and the real difference between AP, dual enrollment, and just enrolling at a community college yourself), extracurriculars, immigrant-family-specific resources, community college transfer pathways, what happens after decisions arrive, and how to actually get research experience in high school. Every fact is checked against a primary source and stamped with when it was last verified.
- **`/opportunities`** — 49 scholarships, internships, summer programs and competitions, each individually checked on its own official site, with a 12-month deadline timeline showing where they cluster and a save/star feature for building a shortlist.
- **`/tools/profile-analysis`** — reads a student's real courses and activities, matches course rigor against their own school's ceiling (never a national average), rewrites activities into application-ready language under a strict never-inflate rule, and never produces a score or an admissions chance.
- **Ask AI** — a chat interview that pulls real, describable activities (caregiving, translating, a job) out of students who say "I don't do anything," running behind a guardrail that never reassures anyone about immigration enforcement risk and never states state-level aid policy as settled fact.
- **A counselor share link**, student-initiated and student-revocable only — the only way data leaves an account.
- **Parent accounts**, fully standalone — a parent is never shown their child's progress and vice versa, stated to them plainly at signup.
- Spanish UI chrome, with guide content explained rather than machine-translated, since bulk-translating financial aid and immigration content without a bilingual reviewer is a real risk, not a nicety to skip.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind v4** — `app/`, the real production app.
- **Supabase** — Postgres, Row-Level-Security on every table, real email/password + Google OAuth.
- **Vercel** — auto-deploys on every push to `master`. No staging environment, no review gate — `scripts/ship.sh` (verify → commit → push) is what makes that safe.
- **Gemini**, with an OpenRouter free-tier fallback scoped to the resume-rewrite call only — the crisis/immigration-adjacent surfaces (chat, the activities interview) stay on the primary provider on purpose.

## Running it locally

```bash
cd app
npm install
npm run dev
```

Copy `app/.env.local.example` to `app/.env.local` and fill in your own Supabase project + a Gemini API key. `OPENROUTER_API_KEY` is optional — unset, the resume-rewrite route just falls back to Gemini.

## Shipping

```bash
./scripts/ship.sh "what you changed"
```

Runs `typecheck → lint → test → build` and refuses to push if any step fails. `npm run verify` inside `app/` runs the same checks without pushing. CI runs the same four checks again on every push as a second line of defence.

## The rule everything else follows from

Nothing here is invented. Every statistic, scholarship, deadline, and eligibility rule is checked against a primary source before it ships — see the header comments in `app/src/data/scholarships.ts` and `app/src/data/major-opportunities.ts` for exactly what that discipline looks like in practice. A wrong deadline isn't a typo; for this audience, it can be money a student was entitled to and never got.

## Project docs

- [`CLAUDE.md`](CLAUDE.md) — fast-load context and standing rules for AI-assisted development on this repo.
- [`master-spec-doc.md`](master-spec-doc.md) — full mission, scope, and decision history.
