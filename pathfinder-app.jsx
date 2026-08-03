import { useState, useRef, useEffect } from "react";
import {
  Route,
  MessageCircle,
  BookOpen,
  Send,
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  GraduationCap,
  Users,
  PiggyBank,
  Home,
  Sun,
  FileText,
  Flag,
  Star,
  Lightbulb,
  ListChecks,
} from "lucide-react";

// ── Design tokens ──
// Kept as-is at the user's explicit request (approved through iteration).
// Note: this palette (warm cream + terracotta) is a known "default AI look" —
// flagged in the design skill — but the user has explicitly approved it twice
// now, so the brief's own word wins here. Documented in master doc.
const colors = {
  bg: "#FAF7EF",
  surface: "#FFFFFF",
  accent: "#C2603C",
  text: "#2B2620",
  textSoft: "#8C8272",
  border: "#E6DECB",
  chipBg: "#F0E4D6",
  calloutBg: "#EEF3EA",
  calloutBorder: "#CFE0C6",
  calloutText: "#3F5A38",
};

const categoryMeta = {
  Academics: { color: "#C2603C", icon: GraduationCap },
  Extracurriculars: { color: "#6E8B6B", icon: Users },
  "Financial Literacy Awareness": { color: "#B8923D", icon: PiggyBank },
  "Financial Aid": { color: "#B8923D", icon: PiggyBank },
  "Family/Mindset": { color: "#8B6B8F", icon: Home },
  Applications: { color: "#5B7A93", icon: FileText },
  Decision: { color: "#A8574B", icon: Flag },
  Summer: { color: "#5B8C93", icon: Sun },
};

const categoryOrder = [
  "Academics",
  "Extracurriculars",
  "Financial Literacy Awareness",
  "Family/Mindset",
  "Applications",
  "Financial Aid",
  "Decision",
  "Summer",
];

const SYSTEM_PROMPT =
  "You are a warm, knowledgeable guide helping immigrant and first-generation students and their families navigate the U.S. college process. Explain things in plain language, assuming no prior familiarity with the U.S. education system. Never give legal immigration advice — for status-specific or legal questions, direct the user to consult a school counselor, immigration attorney, or a vetted nonprofit resource. Be encouraging but realistic. Ask clarifying questions when a request is ambiguous. Keep responses fairly short and conversational.";

/* ============================================================
   ROADMAP CONTENT — v3 (Aug 1, 2026 revision)
   Changes from v2 in this pass:
   - 8th grade summer rewritten: was pure "rest," now "position, don't
     pressure" — checking math placement is the one high-leverage move,
     per counselor/college-prep-site consensus (Ivy Strides, US News,
     Elite Prep, Aralia, KD College Prep — all converge on math placement
     as the single highest-leverage summer action before 9th grade).
   - New standalone item added in 9th grade: course-rigor philosophy,
     since it was implied before but never given its own real treatment.
   - 10th and 11th grade testing items expanded with an explicit
     risk/hedging discussion — several selective schools reinstated
     testing requirements starting 2024 after going test-optional, so
     "testing isn't required right now" is not the same as "testing will
     never matter," and that nuance is spelled out directly now.
   Each item now uses a `sections` array (real NYT/CollegeAdvisor-style
   structure) instead of a flat body[] of paragraphs, plus an optional
   `callout` (boxed takeaway) and `quickAnswer` (bulleted TL;DR) for the
   longer high-school items.
============================================================ */
const roadmapData = {
  6: [
    {
      id: "6-1",
      category: "Extracurriculars",
      title: "Try lots of things — you don't need to pick one",
      sections: [
        {
          paragraphs: [
            `Join a club, try a sport, pick up an instrument, sign up for something at the library — say yes to invitations. The goal isn't finding "the thing" yet, it's finding out what you like and don't like.`,
            `Nothing in 6th grade goes on any future application. If you try something and hate it, that's useful too — drop it and try the next thing.`,
          ],
        },
      ],
    },
    {
      id: "6-2",
      category: "Academics",
      title: "Read something you actually chose, most days",
      sections: [
        {
          paragraphs: [
            `About 20 minutes a day, on anything genuinely interesting to you — comics, sports stats, fantasy novels, whatever. This is the one 6th-grade habit that quietly compounds for years: it shows up later in reading comprehension, in how standardized tests feel, and eventually in how easily a college essay comes together.`,
            `It matters far more that you picked the book than what the book is.`,
          ],
        },
      ],
    },
    {
      id: "6-3",
      category: "Academics",
      title: "If a subject grabs you, go a little deeper — but only if you want to",
      sections: [
        {
          paragraphs: [
            `Some 6th graders discover they love math, or a particular science, or want to read everything about one topic. If that's you, it's fine to ask a teacher for a harder problem or look for material beyond grade level.`,
            `This is entirely optional. Just as many students don't know what they're into yet at 11 or 12 — that's just as normal.`,
          ],
        },
      ],
    },
    {
      id: "6-4",
      category: "Family/Mindset",
      title: `Talk with a parent or guardian about the future — not necessarily "college"`,
      sections: [
        {
          paragraphs: [
            `This doesn't need to be a college conversation specifically. It can just be about what your family hopes for you, what kind of work or life feels meaningful, what your parents' own path looked like, wherever that was.`,
            `Starting this conversation now — casually, more than once, not as a single Big Talk — makes it far less loaded later, and it lets parents share their own goals for you too.`,
          ],
        },
      ],
    },
    {
      id: "6-5",
      category: "Summer",
      title: "Have a good summer — that's genuinely the assignment",
      sections: [
        {
          paragraphs: [
            `Skip the "summer program" pressure entirely. A great 6th-grade summer looks like: seeing friends, being outside, reading whatever you want, and — only if something sounds fun — a free or low-cost class through the library or a rec center.`,
            `If you're one of the kids who loves math or another subject, downtime is a fine time to get a little ahead on your own terms, not because it's expected. There is no real disadvantage to a summer that's just a normal, good summer.`,
          ],
        },
      ],
    },
  ],
  7: [
    {
      id: "7-1",
      category: "Extracurriculars",
      title: "Start noticing what you actually enjoy",
      sections: [
        {
          paragraphs: [
            `By now you've probably tried a handful of things. Notice which ones you look forward to versus which feel like a chore.`,
            `You don't have to commit to one activity yet, but this is a good year to narrow from "everything" down to the one or two things you actually like.`,
          ],
        },
      ],
    },
    {
      id: "7-2",
      category: "Academics",
      title: "Keep reading, and start noticing what subjects pull you in",
      sections: [
        {
          paragraphs: [
            `Keep the daily-reading habit going. Start paying attention to which classes you find yourself curious about, even outside of homework — not to choose a future major, nowhere close to that yet, just to notice.`,
            `It'll make choosing electives in 8th and 9th grade easier.`,
          ],
        },
      ],
    },
    {
      id: "7-3",
      category: "Extracurriculars",
      title: "If a small leadership chance comes up, try it — but don't force it",
      sections: [
        {
          paragraphs: [
            `Something like a club role or a small team responsibility. Early leadership experience is genuinely hard to fabricate later, but this is a "try it if it comes up" note, not a requirement — plenty of strong students find leadership later, in high school.`,
          ],
        },
      ],
    },
    {
      id: "7-4",
      category: "Financial Literacy Awareness",
      title: `Just learn the words "financial aid" and "scholarship" exist`,
      sections: [
        {
          paragraphs: [
            `No action needed yet — just knowing these exist matters more than it sounds like. Families who don't know financial aid is a thing sometimes rule out colleges based on the listed price alone, years before it would actually matter.`,
          ],
        },
      ],
    },
    {
      id: "7-5",
      category: "Summer",
      title: "Keep it low-pressure — reading, friends, maybe a first small job",
      sections: [
        {
          paragraphs: [
            `Same spirit as 6th grade summer: no formal program required. If you're old enough and interested, a first small job or volunteer role (babysitting, yard work, helping at a family business) is a nice, age-appropriate way to build habits — but it's an option, not an expectation.`,
          ],
        },
      ],
    },
  ],
  8: [
    {
      id: "8-1",
      category: "Academics",
      title: "Choose your 9th grade classes carefully — this is where your real transcript starts",
      sections: [
        {
          paragraphs: [
            `This is the first genuinely consequential academic decision in this whole roadmap. Talk to a counselor about which classes — especially any Honors-level options — make sense for you.`,
            `If your school holds a course-selection night for incoming freshmen, go, and bring a parent if you can; this is often where course-track decisions quietly get made, and it's much easier to start on the right track than to switch onto it later.`,
          ],
        },
      ],
    },
    {
      id: "8-2",
      category: "Extracurriculars",
      title: "Pick 1–2 activities to carry with you into high school",
      sections: [
        {
          paragraphs: [
            `Consistency reads as genuine interest rather than resume-building — and it's just easier to keep momentum on something you already know you like.`,
          ],
        },
      ],
    },
    {
      id: "8-3",
      category: "Family/Mindset",
      title: "If a parent didn't attend a U.S. high school, walk through what 9th grade will look like together",
      sections: [
        {
          paragraphs: [
            `Demystify the "invisible knowledge" — GPA, electives, how grading actually works — before it starts, so it doesn't all land in the first month of 9th grade.`,
          ],
        },
      ],
    },
    {
      id: "8-4",
      category: "Summer",
      title: "Position yourself for 9th grade — without turning summer into more school",
      badge: "The one thing worth 20 minutes: check math placement",
      quickAnswer: [
        "Confirm your 9th grade math placement — this quietly sets the ceiling for your whole transcript",
        "If a placement test or short bridge course could move you up a level, this is the window to take it",
        "Optional: lightly preview a subject you're nervous about, using free resources",
        "Keep reading. Talk to older students about what to expect socially. Rest matters too.",
      ],
      sections: [
        {
          paragraphs: [
            `Most advice about this summer says one of two extremes: "relax completely" or "get ahead academically." Neither is quite right. The honest version is closer to positioning, not pressure — there's one genuinely high-leverage thing worth doing, and everything else can stay optional.`,
          ],
        },
        {
          heading: "The one thing that actually matters: your math placement",
          paragraphs: [
            `Here's why this is worth real attention: high schools sequence math in a fixed order (typically Algebra 1, Geometry, Algebra 2, Precalculus, then Calculus), and which level a student starts 9th grade in determines whether reaching AP Calculus — or any advanced math — by senior year is even mathematically possible in the time available.`,
            `Practically, that means: find out what math class you're placed into for 9th grade, and work backward from the most advanced math course your school offers senior year to see whether that placement gets you there on schedule. If it doesn't and you want it to, ask now whether a placement test or a short bridge course over the summer could move you up a level — these windows tend to close once the school year starts and schedules lock in.`,
            `If your placement already gets you where you want to go, or you're simply not sure yet what level of math you want to aim for, there's nothing else to do here — this is genuinely a "check once and move on" task, not a project.`,
          ],
        },
        {
          heading: "Everything else is optional",
          paragraphs: [
            `If a subject feels shaky and you'd rather not walk in cold, a little light review using a free resource works fine — there's no need for a paid course. Keep the daily reading habit going if you've built one; it's still the cheapest, highest-return thing a student can do with unstructured time.`,
            `Talking to an older student or sibling about what 9th grade is actually like socially is more useful than most people expect — the adjustment to high school tends to be bigger socially than academically, and knowing roughly what to expect takes some of the edge off.`,
            `And genuinely: rest is part of this too. A student who starts 9th grade well-rested and mentally ready generally does better than one who spent the summer cramming ahead academically.`,
          ],
        },
      ],
    },
  ],
  9: [
    {
      id: "9-1",
      category: "Academics",
      title: "This is the first year that counts, so build the habits now",
      sections: [
        {
          paragraphs: [
            `Every grade from 9th grade on appears on the transcript colleges eventually see. That doesn't mean panic — it means this is the right time to build the study habits, organization, and help-seeking behavior that make the next three years easier, rather than trying to build them under pressure junior year.`,
            `GPA (Grade Point Average) is the single number, usually on a 4.0 scale, that summarizes grades across every class — an A is generally worth 4.0, a B a 3.0, and so on, averaged across every semester. Colleges look at both the number and the difficulty of the classes behind it; a solid GPA in a rigorous course load is generally viewed more favorably than a perfect GPA in the easiest available classes. (More in the "Choosing your course load" guide below, and in the full GPA article in the Parent Guide.)`,
            `Just as important this year: meet your school counselor at least once, even just to introduce yourself. Counselors write recommendation letters and flag opportunities later — but generally only for students they actually know, and 9th grade is a low-stakes, no-pressure time to start that relationship.`,
          ],
        },
      ],
    },
    {
      id: "9-1b",
      category: "Academics",
      title: "Choosing your course load: how hard is too hard?",
      quickAnswer: [
        "The goal is the most rigorous schedule you can handle while still doing reasonably well — not the hardest possible schedule",
        "Add challenge gradually, one Honors or AP class at a time, rather than all at once",
        "A rigorous B beats an easy A in how colleges read a transcript — but a transcript full of collapsed grades helps no one",
        "Revisit this every year, not just once — the right level of challenge can change as you find your footing",
      ],
      sections: [
        {
          paragraphs: [
            `This question comes up every single year from here on, so it's worth understanding the underlying logic once, rather than re-deciding from scratch each spring.`,
          ],
        },
        {
          heading: "Why rigor matters alongside grades",
          paragraphs: [
            `Colleges generally read a transcript two ways at once: what classes were taken, and how the student did in them. A student who took the hardest classes available and earned mostly B's is often viewed more favorably than one who took the easiest classes and earned straight A's — because the first transcript shows a student who sought out challenge and handled it reasonably well, while the second shows less about how the student performs under real academic pressure.`,
          ],
        },
        {
          heading: "But more rigor is not automatically better",
          paragraphs: [
            `The other half of this, which gets said far less often: a schedule so difficult that grades collapse across multiple classes tends to work against a student, not for them — both because the grades themselves suffer, and because it can crowd out the extracurricular depth and rest that also matter. The goal isn't "the hardest possible schedule," it's the most rigorous schedule a specific student can handle while still doing reasonably well.`,
          ],
        },
        {
          heading: "A practical way to decide",
          paragraphs: [
            `A reasonable approach: add one level of challenge at a time rather than jumping straight to the hardest option in every subject at once. If you're not sure whether you're ready for an Honors or AP class, ask the current teacher in that subject — they generally have a realistic sense of whether a student is ready, and most are glad to be asked directly. It's also completely normal to be more rigorous in subjects you're strong in or genuinely enjoy, and less rigorous in ones you're not — colleges don't expect uniform difficulty across every subject.`,
            `This isn't a one-time decision. Revisit it every year: a schedule that felt right in 9th grade might be too light — or too heavy — by 11th, once you have a better sense of your own pace.`,
          ],
        },
      ],
    },
    {
      id: "9-2",
      category: "Extracurriculars",
      title: `Join with intention — and start noticing your own "spike"`,
      sections: [
        {
          paragraphs: [
            `This is the year to move from "trying everything" (middle school) to genuinely investing in one or two things. Depth matters more than a long list of one-semester activities — a student who stuck with two things and grew within them almost always presents better than one with ten shallow entries.`,
            `If a job, family caregiving responsibility, or translating for parents already takes up real time, that counts as a real activity, not something to hide because it isn't a formal school club — it often demonstrates more maturity and responsibility than a typical extracurricular does.`,
            `This is also the year to start loosely noticing what your "spike" might be — the one thing you keep coming back to, whether that's a subject, a skill, a cause, or a craft. Nothing needs to be decided yet; the only job in 9th grade is paying attention to the pattern.`,
          ],
        },
      ],
    },
    {
      id: "9-3",
      category: "Academics",
      title: "Start a running list of grades, activities, and awards now",
      sections: [
        {
          paragraphs: [
            `A simple notes app works fine. This single habit saves hours of stressful reconstruction junior year, when students are often asked to remember four years of activities from memory while also drafting essays and filling out applications.`,
          ],
        },
      ],
    },
    {
      id: "9-4",
      category: "Summer",
      title: "Low-stakes exploration — try something new",
      sections: [
        {
          paragraphs: [
            `A new activity, a first summer job, or simply more time with the interest you noticed during the school year. Nothing here needs to be impressive yet; this is genuinely the lowest-stakes summer of high school.`,
          ],
        },
      ],
    },
  ],
  10: [
    {
      id: "10-1",
      category: "Academics",
      title: "Find out what your target schools actually require — and why it's worth testing anyway for many students",
      quickAnswer: [
        "Over 90% of four-year colleges remain test-optional or test-free as of 2026 — but this isn't universal",
        "A specific group of very selective schools (most Ivies, MIT, Caltech, Stanford, Georgetown, and others) reinstated testing requirements starting in 2024",
        "Policy can change again before you apply — a strong score is a hedge against that, even at schools that don't currently require one",
        "The UC system is test-blind: it won't consider scores at all, even if submitted — testing does nothing there",
      ],
      sections: [
        {
          paragraphs: [
            `This is one of the most misunderstood parts of the whole process, and it changed a lot in the past couple of years, so it's worth being precise rather than relying on what an older sibling or an outdated article said.`,
          ],
        },
        {
          heading: "The current landscape",
          paragraphs: [
            `As of 2026, the large majority of four-year colleges and universities in the country — over 90%, by most tracking organizations' counts — remain test-optional (a score can be submitted but isn't required) or test-free (scores aren't considered at all, even if submitted). But a specific, high-profile group of very selective schools reversed course starting in 2024: most of the Ivy League, MIT, Caltech, Stanford, and Georgetown, among others, now require scores again. Meanwhile, the University of California system remains test-blind — it won't consider scores even if submitted, no matter how selective the individual UC campus is.`,
          ],
        },
        {
          heading: "Why it's often worth testing even when it's not required",
          paragraphs: [
            `Here's the part that doesn't get said enough: "not required right now" is not the same guarantee as "will never matter." Several of the schools that now require testing again were themselves test-optional just a couple of years earlier — policy at this level has proven genuinely capable of reversing, sometimes with only a few months' notice before an application cycle. A student who decides in 10th grade not to test at all, based on a school's current policy, can find that policy has changed by the time they actually apply junior or senior year.`,
            `Because of that, there's a real strategic argument for at least preparing for and taking the SAT or ACT once — even for students whose current target schools don't require it — simply to remove that risk. A good score can also help at genuinely test-optional schools, where submitting a strong score is generally viewed as a plus (it just isn't required as a floor). The one place testing truly does nothing is at test-blind schools like the UC system, where scores aren't considered under any circumstances, so if every school on a student's list is test-blind, skipping testing entirely is a completely reasonable, low-risk choice.`,
          ],
        },
        {
          heading: "What to actually do this year",
          paragraphs: [
            `Whatever a friend, an older sibling, or an old article says about a specific school's policy should be double-checked directly on that school's admissions site — this is genuinely not one-size-fits-all, and it can shift from one cycle to the next even at the same school. For most students, the reasonable default in 10th grade is: assume you'll likely take the SAT or ACT at least once, and revisit that decision in 11th grade once your college list is more real and each school's current policy is confirmed.`,
          ],
        },
      ],
    },
    {
      id: "10-2",
      category: "Academics",
      title: "Start looking around, with zero pressure to decide anything",
      sections: [
        {
          paragraphs: [
            `Look at 5–10 schools across a real range of selectivity — not to build a final list yet, just to get a feel for size, location, campus type, and vibe.`,
            `This is also a good year to notice which schools consistently show up on "affordable for families like mine" lists versus which don't, without committing to anything.`,
          ],
        },
      ],
    },
    {
      id: "10-3",
      category: "Extracurriculars",
      title: "Go deeper on the thing you noticed last year",
      sections: [
        {
          paragraphs: [
            `If 9th grade was about noticing a pattern, 10th grade is about doing something real with it. A passion project — a self-directed piece of work connected to that interest, sustained over months rather than a single weekend — is one of the most credible ways to show genuine depth, and it doesn't require money or a prestigious program to be real.`,
            `Examples that count: teaching yourself a skill and documenting the process, starting a small tutoring effort for younger students, organizing something in a cultural or religious community group, building something (an app, a piece of art, a small business), or doing sustained independent research on a question that actually interests you.`,
            `What makes a passion project credible isn't prestige — it's that it's sustained, it produces something real, and it's genuinely yours, not something a parent or consultant built for you to present. If a formal summer program or internship also interests you, genuine engagement with a free or low-cost option is valued just as much as an expensive "prestige" program — ask about fee waivers if cost is the only thing in the way.`,
          ],
        },
      ],
    },
    {
      id: "10-4",
      category: "Financial Literacy Awareness",
      title: "Look up the Net Price Calculator on 2–3 schools you're curious about",
      sections: [
        {
          paragraphs: [
            `Every college is required by law to have one on its website. It takes a few minutes and gives a realistic estimate of what your specific family would actually pay after aid — which is often dramatically different from the sticker price, and is a far more useful number to know this early than the listed tuition figure.`,
          ],
        },
      ],
    },
    {
      id: "10-5",
      category: "Summer",
      title: "Pursue something real",
      badge: "Most important summer for exploration",
      sections: [
        {
          paragraphs: [
            `A job, an internship, a summer program, or continued work on a self-directed project. Genuine engagement with what's actually available to you matters more than prestige — a real, sustained commitment to a free program beats passive attendance at an expensive one.`,
            `If a paid program is the right fit but cost is the barrier, ask directly about fee waivers before ruling it out.`,
          ],
        },
      ],
    },
  ],
  11: [
    {
      id: "11-1",
      category: "Academics",
      title: "Lock in your testing plan, or your no-testing plan",
      sections: [
        {
          paragraphs: [
            `If any target schools require or recommend testing, plan for a first attempt by spring of junior year, leaving room for a retake in the fall of senior year if needed. Given how much testing policy has shifted in the last couple of years (see the 10th grade guide), a strong score is worth having in hand even for schools that don't currently require one — it's a hedge that costs one test date and keeps every option open, including schools whose policy might change before application season.`,
            `If every school on your list is genuinely test-blind (like the UC system) and you'd rather not test, that's a completely legitimate path — testing does nothing at a test-blind school no matter how strong the score.`,
            `Either way, this is also the year course rigor really starts to matter for the transcript colleges will eventually see in full: continuing to take the most challenging classes you can handle well — not classes so hard that grades collapse across the board — remains the single best academic move available. (See the "Choosing your course load" guide in 9th grade for the full reasoning.)`,
          ],
        },
      ],
    },
    {
      id: "11-2",
      category: "Academics",
      title: "Build a real range: reach, target, and safety",
      sections: [
        {
          paragraphs: [
            `A reach school is one where admission is a stretch given your profile; a target is a realistic, competitive fit; a safety should be a school you're confident you'd get into and — this is the part people skip — one you'd genuinely be happy to attend, not just a backup you'd resent.`,
            `A list that's all reaches isn't a real list.`,
          ],
        },
      ],
    },
    {
      id: "11-3",
      category: "Applications",
      title: "Start drafting your Common App essay this summer, not during senior fall",
      sections: [
        {
          paragraphs: [
            `The personal essay (250–650 words, answering one of several prompts) is not a formal writing test — colleges already have a sense of writing ability from the transcript. Its real job is showing personality and how a student actually thinks, in their own voice.`,
            `Starting a rough draft the summer before senior year, while there's no application deadline pressure yet, is the single biggest stress-reducer available for the fall. A parent's most useful role is protecting the time and quiet needed to write an honest draft — not suggesting the topic or rewriting the substance; admissions readers can usually tell when an adult's voice replaced a student's.`,
          ],
        },
      ],
    },
    {
      id: "11-4",
      category: "Financial Aid",
      title: "Research your family's specific situation now, before application season adds pressure",
      sections: [
        {
          paragraphs: [
            `This includes any special circumstances — mixed-status families, non-citizen parents, self-employment income, and so on. Understanding your actual situation now, while there's time to ask a counselor or a nonprofit a question and wait for a real answer, avoids discovering a complication in the middle of application season when everything else is also due. (See the Financial Aid and Immigrant Families guides for the current rules on exactly this.)`,
          ],
        },
      ],
    },
    {
      id: "11-5",
      category: "Summer",
      title: "Draft the essay, finalize the list",
      badge: "Most important summer overall",
      sections: [
        {
          paragraphs: [
            `This is when the Common App essay gets drafted and the college list gets finalized — the single biggest stress-reducer for the fall of senior year, when everything else (supplemental essays, recommendation letter requests, financial aid forms) piles up at once.`,
          ],
        },
      ],
    },
  ],
  12: [
    {
      id: "12-1",
      category: "Applications",
      title: "Submit the FAFSA — and CSS Profile if required — as early as your family reasonably can",
      sections: [
        {
          paragraphs: [
            `The FAFSA (Free Application for Federal Student Aid — the form that unlocks federal financial aid; see the Financial Aid guide for the full walkthrough) generally opens each fall, and some aid is awarded first-come, first-served, so earlier is better once your family has what it needs to file accurately. As of the 2026–27 cycle, the process itself is faster than it's been in years: the form now shows your Student Aid Index and Pell Grant eligibility in real time right after submission, instead of families waiting weeks to find out.`,
            `Track every school's specific requirements and deadlines in one place — a missing smaller form can leave an otherwise complete application incomplete.`,
          ],
        },
      ],
    },
    {
      id: "12-2",
      category: "Financial Aid",
      title: "Read every offer for what's actually in it, not just the total number",
      sections: [
        {
          paragraphs: [
            `Two schools can list the "same" total aid amount while one is mostly grants (free money) and the other is mostly loans (money repaid later, with interest) — those are very different offers in real terms.`,
            `As of the 2026–27 award year, a few federal rules changed that are worth knowing before comparing offers: Parent PLUS loans now carry a $20,000 annual cap and a $65,000 lifetime cap per student, and having multiple children in college at the same time no longer reduces your calculated Student Aid Index the way it used to under the old formula.`,
            `Both changes can shift what a family is actually expected to pay compared to what an older sibling's experience might suggest — worth a direct conversation with a financial aid office rather than assuming the old rules still apply.`,
          ],
        },
      ],
    },
    {
      id: "12-3",
      category: "Decision",
      title: "If an offer feels insufficient, know that appealing is normal — not a last resort",
      sections: [
        {
          paragraphs: [
            `Colleges expect and accommodate appeals, especially with a specific, documented change in circumstances (job loss, a new medical expense, a sibling starting college) or a meaningfully better offer from a comparable school.`,
            `Contact the financial aid office directly and ask about their appeal or reconsideration process — most have a real one, even when it isn't advertised prominently.`,
          ],
        },
      ],
    },
  ],
};

const gradeGroups = [
  { label: "Middle School", grades: [6, 7, 8] },
  { label: "High School", grades: [9, 10, 11, 12] },
];

/* ============================================================
   PARENT GUIDE ARTICLES — v3 (Aug 1, 2026 revision)
   Rewritten with much more foundational depth: every term (FAFSA,
   SAI, Common App, GPA, etc.) is explained plainly the first time it's
   used, written for a parent with zero U.S. context, not just a
   condensed-and-complex version of the old copy. Restructured into
   real sections with headers, a "quick answer" bullet summary up top
   (CollegeAdvisor/NYT-style), and a Key Terms glossary box at the end
   of each article for at-a-glance reference.
============================================================ */
const guideArticles = [
  {
    title: "How the U.S. College System Works",
    teaser:
      "Public vs. private, 2-year vs. 4-year, sticker price vs. real price — and what \"applying\" actually involves, explained from zero.",
    quickAnswer: [
      "There's no single national exam — each college decides on its own, and students apply to several at once",
      "\"Sticker price\" is almost never the real price a family pays",
      "Community college is a genuinely respected, often smarter starting point — not a lesser option",
      "Whether a college requires the SAT/ACT now varies school by school, and that's changed a lot recently",
    ],
    sections: [
      {
        paragraphs: [
          `If this system feels confusing or backwards compared to what you knew growing up, that's completely normal. This isn't something anyone is expected to already know — this guide walks through the parts that trip up most families, starting from the very beginning.`,
        ],
      },
      {
        heading: "How applying actually works",
        paragraphs: [
          `In the U.S., "high school" runs grades 9 through 12, roughly ages 14 to 18. After that, a student doesn't take one big national exam that assigns them to a school — instead, they choose a list of colleges themselves (usually somewhere between 5 and 15) and apply to each one separately. Every college makes its own independent decision about that student, based on grades, activities, essays, and sometimes test scores. This is a genuinely different system from a centralized placement exam, and it surprises a lot of families the first time they encounter it.`,
          `One vocabulary note that trips people up: "college" and "university" mean the same thing in everyday American speech. In some countries these words mark different levels of education — here, they're used interchangeably for "the school you attend after high school."`,
        ],
      },
      {
        heading: "The different types of schools — and why none of them is \"lesser\"",
        paragraphs: [
          `Community college is a 2-year school with open enrollment, meaning there's no competitive application process to get in, and it costs significantly less than a 4-year school. A large number of students complete their first two years at a community college, then transfer into a 4-year university to finish their degree — the diploma at the end carries no disadvantage or mark of having started this way, and the money saved can be substantial. This is a genuinely respected, common path, not a fallback.`,
          `Public university means a school funded partly by a state government. It's generally cheaper for residents of that state ("in-state" students) than for students from other states or countries.`,
          `Private university means a school that isn't state-funded. These almost always have a higher listed price than public schools — but, confusingly, they often give out significantly more financial aid, which means the actual price a family pays can end up lower than a public school's. The listed price is frequently not the real price at all, which is the single most important idea in this whole article (more below).`,
        ],
      },
      {
        heading: "Degree levels, explained simply",
        paragraphs: [
          `An associate's degree takes about 2 years and usually comes from a community college. A bachelor's degree takes about 4 years — this is what most people mean by "a college degree" or "going to college," and it's what this app focuses on, since it's the most common goal. A master's degree or doctorate is optional further study after a bachelor's degree, pursued later for specific careers or advanced expertise — not something to think about yet.`,
        ],
      },
      {
        heading: "The price you see online is almost never the real price",
        paragraphs: [
          `This is worth slowing down on, because it changes how a family should even think about which schools are "affordable." Colleges publish a "sticker price" — the full listed cost of one year of tuition, housing, and fees, before any financial help is factored in. That number is often designed to look intimidating on a brochure, but very few families actually pay it in full.`,
          `Financial aid — money that reduces what a family actually pays — comes in a few different forms: grants and scholarships (money given to a student that never has to be paid back), work-study (a part-time job on campus, arranged through the financial aid office, that a student works to earn money during the school year), and loans (money borrowed now that must be paid back later, with interest, like any other loan).`,
          `Because of this, two schools with very different sticker prices can end up costing a specific family completely different amounts once aid is factored in — sometimes the opposite of what the sticker prices would suggest. A school listing $70,000 a year might genuinely cost one family $8,000 after aid, while a school listing $25,000 might cost that same family more, if it offers less aid. This is exactly why every college is legally required to have a "Net Price Calculator" on its website — a short online tool, usually taking just a few minutes, that gives a real estimate of what your specific family would pay after aid, based on your income and family situation. Using this tool before ruling any school out based on the sticker price is one of the single most useful things a family can do in this entire process.`,
        ],
      },
      {
        heading: "How grades actually get evaluated: GPA",
        paragraphs: [
          `GPA stands for Grade Point Average — it's a single number, usually somewhere on a 0-to-4.0 scale, that summarizes a student's grades across every class they've taken. Colleges look at both this number and how difficult the classes behind it were; doing solidly in hard classes is generally viewed more favorably than getting perfect grades in the easiest available ones. (The full mechanics of how this number is actually calculated, including a common source of confusion — why some students have GPAs above 4.0 — are explained fully in the "Understanding Grades and GPA" guide.)`,
        ],
      },
      {
        heading: "The application timeline — why it feels so early",
        paragraphs: [
          `Applications are submitted about a full year before a student actually starts college. A student hoping to begin in the fall of one year typically submits applications in the fall of the year before, during their final ("senior") year of high school — sometimes even earlier for certain deadlines. Decisions on whether a student is accepted usually arrive between December and April of that senior year.`,
          `There are also a few different timing options worth knowing, since colleges often offer more than one: Regular Decision is the standard, most common deadline, usually around January. Early Action means applying earlier (often November) and hearing back earlier, but it isn't binding — a student can still say no even if accepted. Early Decision also means applying earlier, but it is binding: if accepted, the student is committing to attend that school. This one is worth understanding fully before using it, since committing early removes the ability to compare financial aid offers from other schools. Rolling Admission means a school reviews and responds to applications continuously as they arrive, rather than on one fixed deadline.`,
        ],
      },
      {
        heading: "Standardized testing: a genuinely current, still-shifting picture",
        paragraphs: [
          `For years, "every college requires the SAT or ACT" was a safe assumption. That stopped being true a few years ago, and the picture has kept shifting since — so this is worth getting current on rather than relying on what an older sibling or an old article said. As of 2026, the large majority of four-year colleges — over 90% by most tracking counts — remain test-optional (a score can be submitted, but isn't required) or test-free (scores aren't considered at all, even if submitted — the entire University of California system works this way). But a specific, high-profile group of very selective schools reversed course starting in 2024, including most of the Ivy League, MIT, Caltech, Stanford, and Georgetown, now requiring scores again.`,
          `The practical takeaway: check each target school's current policy directly on its own admissions website before deciding whether to prepare for and take the SAT or ACT. This genuinely isn't one-size-fits-all, and because policy has already reversed once at several major schools, it's worth treating "not required today" as different from "will never matter" — a fuller discussion of that reasoning is in the student roadmap for 10th grade.`,
        ],
      },
      {
        heading: "What a \"major\" actually is",
        paragraphs: [
          `A major is a student's main field of academic focus — something like Biology, Business, or Computer Science. Most students formally declare their major by the end of their second year of college, not on day one, and a large number of students change their major at least once along the way. Applying as "undecided" is common and carries no disadvantage.`,
        ],
      },
      {
        heading: "Your role as a parent",
        paragraphs: [
          `You don't need to become an expert in this system to help meaningfully. What matters most: ask your child questions and stay engaged in the process, even when the details are unfamiliar to you. Use the Net Price Calculator together before ruling out any school based on the sticker price alone. Lean on your child's school counselor for school-specific guidance — that's a free resource that exists specifically to be used. And know that feeling confused at this stage is completely normal, not a sign that you or your family are behind.`,
        ],
      },
    ],
    keyTerms: [
      { term: "Sticker price", definition: "The full listed cost of a year at a college, before any financial aid is applied — almost never what a family actually pays." },
      { term: "Net Price Calculator", definition: "A free tool on every college's website that estimates what your specific family would actually pay after aid, in a few minutes." },
      { term: "GPA", definition: "Grade Point Average — a single number, usually on a 4.0 scale, summarizing a student's grades across all their classes." },
      { term: "Major", definition: "A student's primary field of academic study, usually declared by the end of their second year of college." },
      { term: "Early Decision", definition: "An earlier, binding application option — if accepted, the student commits to attending that school." },
    ],
  },
  {
    title: "Financial Aid: What You Need to Know",
    teaser:
      "FAFSA, grants, loans, and work-study explained from the ground up — including what changed for the 2026–27 award year.",
    quickAnswer: [
      "The FAFSA is the free federal form that unlocks most financial aid — filing it is almost always worth doing",
      "\"Financial aid\" isn't one thing — grants and scholarships are free, loans must be repaid, know the difference in every offer",
      "The FAFSA does not ask about a parent's immigration status",
      "Real 2026–27 changes: faster results, no more multi-child discount, and new caps on Parent PLUS loans",
    ],
    sections: [
      {
        paragraphs: [
          `Financial aid is often the single biggest source of stress and confusion in the entire college process — and also the area where good, current, plainly-explained information makes the biggest difference. This guide starts from zero and walks through the real mechanics, including rule changes that took effect for the 2026–27 award year.`,
        ],
      },
      {
        heading: "What \"financial aid\" actually means",
        paragraphs: [
          `Financial aid is money that reduces what a family pays for college. It comes in two broad categories. Need-based aid is awarded based on a family's financial situation — it includes grants, need-based scholarships, work-study, and certain loans, and is calculated using the forms described below. Merit-based aid is awarded based on a student's academic record, talents, or achievements, regardless of how much money the family has; some colleges give merit scholarships automatically the moment a student is admitted, while others require a separate application. Most students end up with some mix of both, plus any outside scholarships (money from an organization unrelated to the college itself) they apply for on their own.`,
        ],
      },
      {
        heading: "The forms that unlock aid",
        paragraphs: [
          `The FAFSA — Free Application for Federal Student Aid — is the central form nearly every student in the U.S. should fill out, regardless of how much or little the family expects to qualify for. It is genuinely free to submit; despite the name causing some confusion, there is never a legitimate reason anyone should ask you to pay to file it. Filing it is what determines eligibility for federal grants, federal loans, work-study, and it's also used by most states and many individual colleges to award their own aid on top of the federal amount.`,
          `The CSS Profile is a second, more detailed financial form required by roughly 200 colleges — mostly private, often more selective schools — in addition to the FAFSA. It asks more detailed questions than the FAFSA (including things like home equity) and usually has a small fee to submit, though fee waivers exist for lower-income families. Not every school requires it — check each target school's own website directly to find out which forms it asks for.`,
        ],
      },
      {
        heading: "What's genuinely new for the 2026–27 cycle",
        paragraphs: [
          `A few real changes are worth knowing before your family files or compares offers, since they can shift what you're actually expected to pay compared to what an older sibling's experience — or an outdated article — might suggest.`,
          `The form itself is faster now: the 2026–27 FAFSA launched on time, the earliest launch in several years, after the two prior cycles were slowed by delays and technical problems. Once a family submits it, they can now see their Student Aid Index and Pell Grant eligibility (explained just below) in real time, rather than waiting weeks for a summary.`,
          `There is no longer a benefit for having multiple children in college at the same time. Under the old formula, a family's expected contribution used to drop automatically if more than one child was enrolled simultaneously. That discount is gone under the new formula — worth knowing if an older sibling's experience is the reference point your family is mentally using.`,
          `Parent PLUS loans — a specific federal loan that parents, not students, can take out to help cover costs — are now capped at $20,000 per year and $65,000 total per student over their whole college career. Families who previously counted on this loan to cover whatever balance remained after other aid may hit that ceiling sooner than expected, especially at higher-cost schools.`,
          `A few new exclusions were also added: certain assets no longer count against a family when the government calculates aid eligibility, including a family-owned and family-run small business with fewer than 100 employees, the land under a family farm, and family-owned commercial fishing operations. And foreign earned income that a family already excludes from their taxable income is now added back in specifically when determining eligibility for the Pell Grant (a federal grant, explained below).`,
          `Because these are recent, real policy changes rather than settled-for-a-decade rules, it's worth verifying current specifics directly with a school's financial aid office rather than assuming last year's rules — or a friend's experience from a year or two ago — still apply exactly the same way.`,
        ],
      },
      {
        heading: "What actually gets calculated, and what \"SAI\" means",
        paragraphs: [
          `After a family submits the FAFSA, the government produces a number called the Student Aid Index, or SAI. This replaced an older term, "Expected Family Contribution" (EFC) — same basic idea, new name and formula. The SAI is an estimate of what the government calculates a family can reasonably contribute toward college costs, based on income, assets, and family size. Colleges then use this number, along with their own total cost of attendance, to build a financial aid offer meant to help cover the gap between the two.`,
          `It's important to understand what the SAI is not: it is not a bill, and it is not a guarantee of what a family will actually pay. It's an input used in a calculation — the real number that matters is what appears in the final financial aid offer letter from each individual college, since how well a school actually closes that gap varies a lot from one college to another.`,
        ],
      },
      {
        heading: "Reading a financial aid offer — the part that trips up most families",
        paragraphs: [
          `When offer letters arrive, they'll list one total dollar amount of "aid" — but that total is made up of very different pieces, and treating them as interchangeable is the single most common, costly mistake families make. Grants and scholarships are free money that never has to be repaid. Work-study is a part-time job on campus a student works during the school year to earn money — it is not money handed over automatically, and a student has to actually work the hours to receive it. Loans are borrowed money that must be repaid later, with interest, just like a car loan or a mortgage.`,
          `Two schools can offer the exact "same" total dollar amount of aid while one offer is mostly grants and the other is mostly loans — in real terms, those are very different offers, since one leaves the family with far more future debt than the other. Always read the breakdown by category, never just the single total number at the top of the letter.`,
        ],
      },
      {
        heading: "Special considerations for immigrant and mixed-status families",
        paragraphs: [
          `This is an area where a lot of scattered, sometimes inaccurate information circulates, so it's worth being precise. U.S. citizens and "eligible non-citizens" (a specific government category that includes green card holders and a few other statuses) can file the FAFSA and access federal financial aid.`,
          `The FAFSA form itself does not ask about a parent's immigration status. A parent who does not have a Social Security Number can still be listed as a contributor on the form — there is a specific way to indicate this on the FAFSA, and it does not require inventing or borrowing a number. This is a genuinely common point of confusion that sometimes causes eligible families to skip filing the FAFSA entirely out of fear, missing out on aid the student was actually eligible for. A student's own eligibility for federal aid depends on the student's own status, not the parent's — a U.S. citizen or eligible non-citizen student can generally file and receive federal aid even if a parent is undocumented.`,
          `Students who are themselves undocumented, including those with DACA (Deferred Action for Childhood Arrivals) status, are not eligible for federal financial aid and generally should not file a standard FAFSA. However, a number of individual states — roughly 20, plus Washington, D.C., as of recent counts, though this changes over time — offer their own state financial aid regardless of a student's federal immigration status. (The full picture, including which specific states have built separate application forms that don't require a Social Security number at all, is covered in the "Resources for Immigrant Families" guide.)`,
        ],
      },
      {
        heading: "Scholarships beyond the college itself",
        paragraphs: [
          `Outside scholarships — money awarded by a company, community organization, cultural foundation, or local business, unrelated to the college itself — are worth pursuing alongside financial aid. They generally don't reduce a family's need-based aid dollar-for-dollar in the way some families fear, and many go underused simply because fewer people apply for the smaller, less-publicized awards compared to a handful of famous, extremely competitive ones.`,
        ],
      },
      {
        heading: "If an offer isn't enough",
        paragraphs: [
          `Appealing a financial aid offer — formally asking a college to reconsider the amount — is a normal, expected part of the process, not a last resort reserved for extreme cases. If a family's circumstances have genuinely changed (a job loss, new medical expenses, a sibling starting college the same year) or a comparable school offered significantly more aid, contact the financial aid office directly and ask about their appeal or reconsideration process. Colleges expect this and most have a real, working process for it, even when it isn't advertised prominently on their website.`,
        ],
      },
      {
        heading: "The bottom line",
        paragraphs: [
          `Filing the FAFSA (and the CSS Profile, if a target school requires it) as early as your family reasonably can, understanding your family's specific eligibility under the current rules rather than assuming last year's rules still apply, and reading the difference between grants and loans in every single offer — these three habits alone prevent most of the costly mistakes families make in this part of the process.`,
        ],
      },
    ],
    keyTerms: [
      { term: "FAFSA", definition: "Free Application for Federal Student Aid — the central, free form that unlocks most financial aid. Nearly every student should file it." },
      { term: "SAI (Student Aid Index)", definition: "A number calculated from the FAFSA estimating what a family can contribute — an estimate for aid calculation, not a bill." },
      { term: "Grants / scholarships", definition: "Financial aid that never has to be repaid." },
      { term: "Work-study", definition: "A part-time campus job, arranged through financial aid, that a student works to earn money during the school year." },
      { term: "Parent PLUS loan", definition: "A federal loan parents (not students) can take out — now capped at $20,000/year and $65,000 total per student." },
      { term: "CSS Profile", definition: "A more detailed financial aid form required by roughly 200 colleges, in addition to the FAFSA." },
    ],
  },
  {
    title: "How to Support Your Child's Applications",
    teaser:
      "What a complete application actually includes, term by term, and what genuinely helps versus what gets in the way.",
    quickAnswer: [
      "A full application has several separate pieces, each with its own deadline — not one single document",
      "The personal essay isn't a writing test — its job is showing who the student is, in their own voice",
      "A job or caregiving responsibility counts as a real activity, just like a school club",
      "The most useful parent role is protecting time and handling logistics — not rewriting content",
    ],
    sections: [
      {
        paragraphs: [
          `The application process can feel overwhelming for both of you — this guide breaks down exactly what needs to happen, term by term, and what a parent's role realistically looks like at each stage.`,
        ],
      },
      {
        heading: "What a complete application actually includes",
        paragraphs: [
          `Most college applications in the U.S. go through the Common App, a single online platform that lets a student fill out shared information once and use it to apply to many different colleges, with each school adding its own specific extra questions on top. A complete application, through the Common App or otherwise, generally requires several separate pieces, each on its own timeline: the transcript (the official record of every grade a student has earned, sent directly by the school itself, not by the student); a personal essay (a required piece of writing, usually 250 to 650 words, answering one of several set prompts); supplemental essays (shorter essays specific to each individual school, often answering something like "why do you want to attend this college"); letters of recommendation (usually one or two, written by teachers, and sometimes one from a school counselor); an activities list (a structured summary of extracurriculars, jobs, and leadership roles); and test scores, only if a specific school requires or accepts them.`,
        ],
      },
      {
        heading: "The personal essay — what it's actually for",
        paragraphs: [
          `This is often the most stressful and most misunderstood part of the whole process. The essay is not a formal test of writing ability — admissions staff already get a sense of that from the transcript and, if submitted, test scores. Its real purpose is to show who a student is as a person: their personality, values, and how they actually think, in their own authentic voice, in a way grades and a list of activities can't capture on their own.`,
          `A parent's most useful role here is not suggesting a topic or editing the content — it's protecting the time and quiet space needed for a student to write an honest first draft, and helping catch small grammar or clarity issues only at the very end. Admissions readers who review thousands of essays a year can often tell when an adult's voice replaced a student's own, and that tends to work against a student rather than for them.`,
        ],
      },
      {
        heading: "Letters of recommendation — the part students often leave too late",
        paragraphs: [
          `A letter of recommendation is a short written statement from a teacher (or sometimes a counselor) describing what kind of student someone is, submitted directly to colleges as part of the application. Students should ask for these at the end of their junior year or the very start of senior year — not in the middle of application season, when the same teachers are often being asked by dozens of other students at once. A good request includes a specific, personal reason why that particular teacher was chosen, and at least a month of advance notice, so the teacher has real time to write something thoughtful rather than something rushed.`,
        ],
      },
      {
        heading: "Building the activities list — quality over quantity",
        paragraphs: [
          `Colleges reading an activities list generally aren't looking for the longest possible list — they're looking for genuine involvement and, ideally, some real depth or leadership shown over time. (This connects directly to the "spike" concept covered in the Extracurriculars guide: one area of real, sustained depth generally reads better than many shallow, unrelated entries.)`,
          `If a student worked a part-time job or carried significant family responsibilities — which is common in many immigrant households, whether that's caring for younger siblings, translating for parents, or contributing income to the family — that counts as a genuinely real activity and belongs on this list. It is not "less than" a formal school club; it often demonstrates real maturity and responsibility that stands out precisely because it's harder to fake than a resume-building club membership.`,
        ],
      },
      {
        heading: "A parent's role, realistically",
        paragraphs: [
          `You don't need to write anything, extensively edit essays, or fully understand every platform to help meaningfully. What genuinely helps: protecting time — applications take real, focused hours, so helping create quiet space at home for that matters, especially in a busy or multigenerational household. Asking about deadlines rather than content — "what's due this week?" is more useful and less pressuring than "what did you write about?" Helping gather logistics rather than prose — things like birth certificates or ID documents if a form asks for them, past home addresses, or family income documents needed for financial aid forms are exactly the kind of concrete, practical help a parent is often best positioned to provide. And normalizing the stress of this season without minimizing it — acknowledging that this is genuinely a lot, rather than adding pressure about outcomes, tends to help more than pushing harder.`,
        ],
      },
      {
        heading: "A note on translation and language",
        paragraphs: [
          `If English isn't the primary language spoken at home, a student may end up navigating parts of this process — financial aid forms, school communications, letters from colleges — with less family support in translating than peers who grew up in English-speaking households have. This is common, not unusual, and a school counselor or a nonprofit organization that serves immigrant families can often provide language support directly. Asking for this kind of help is expected, not something to feel embarrassed about.`,
        ],
      },
      {
        heading: "Common mistakes to avoid",
        paragraphs: [
          `Waiting until the week of a deadline to ask a teacher for a recommendation letter. A parent, with good intentions, heavily rewriting a student's essay — this is usually detectable to an experienced reader and can undermine the essay's authenticity rather than strengthen it. Applying only to "reach" schools without a genuine safety school the student would actually be happy attending. And missing smaller supplemental requirements — like a short extra question buried below the main essay prompt — that can leave an otherwise strong application technically incomplete.`,
        ],
      },
    ],
    keyTerms: [
      { term: "Common App", definition: "A single online platform that lets a student apply to many colleges using shared information, plus each school's own extra questions." },
      { term: "Personal essay", definition: "A required piece of writing (usually 250–650 words) meant to show a student's personality and voice — not a writing test." },
      { term: "Letter of recommendation", definition: "A written statement from a teacher or counselor about a student, submitted directly to colleges." },
      { term: "Activities list", definition: "A structured summary of a student's extracurriculars, jobs, and leadership roles submitted with the application." },
    ],
  },
  {
    title: "Understanding Grades and GPA",
    teaser:
      "How the 4.0 scale actually works, why a weighted GPA can go above 4.0, and why rigor matters as much as the grade.",
    quickAnswer: [
      "GPA is a single number summarizing every grade a student earns, averaged across all classes and semesters",
      "\"Weighted\" GPA can go above 4.0 — this is normal, not a mistake",
      "Course difficulty is read alongside the GPA number, not instead of it",
      "A rough semester can genuinely be recovered from — colleges see the whole transcript, not one moment",
    ],
    sections: [
      {
        paragraphs: [
          `GPA comes up constantly in the college process, but the mechanics behind it are rarely explained clearly to families encountering it for the first time. Here's exactly how it works, from the ground up.`,
        ],
      },
      {
        heading: "What GPA actually is",
        paragraphs: [
          `GPA stands for Grade Point Average. It works by converting each letter grade a student earns into a number, then averaging those numbers across every class taken. On the standard scale: an A is worth 4.0, a B is worth 3.0, a C is worth 2.0, a D is worth 1.0, and an F is worth 0.0. Many schools also use pluses and minuses — an A- might be worth 3.7, a B+ might be worth 3.3 — and the exact scale can vary slightly by school, so it's worth asking what scale your child's specific school uses. A student's GPA is the running average of every grade earned across every semester of high school; it updates continuously as new grades come in, rather than being based on a single test or a single year.`,
        ],
      },
      {
        heading: "Weighted vs. unweighted GPA — the part that confuses almost everyone",
        paragraphs: [
          `This is the single most misunderstood part of GPA, so it's worth slowing down here specifically. Unweighted GPA is the standard scale described above, where an A is worth 4.0 no matter how difficult the class was. Weighted GPA gives extra value to harder classes — specifically Honors, AP (Advanced Placement), or IB (International Baccalaureate) courses — so an A in one of those classes might count as 5.0 instead of 4.0, depending on the specific weighting scale a school uses.`,
          `Because of this, a student can genuinely have a weighted GPA above 4.0 — something like a 4.3 — which often confuses families who are used to thinking of 4.0 as an absolute maximum. This is completely normal and not a sign of an error. Colleges are well aware of this and account for it directly: they generally look at the GPA number alongside the actual difficulty of the classes behind it, and some colleges even recalculate a student's GPA their own way entirely, using only their own formula, regardless of what number appears on the transcript. A 3.7 GPA earned in the hardest classes a school offers is often viewed more favorably than a 4.0 earned entirely in the easiest available classes.`,
        ],
      },
      {
        heading: "Why course difficulty matters as much as the grade itself",
        paragraphs: [
          `This has become more important, not less, as testing requirements have grown inconsistent from school to school (see the "How the U.S. College System Works" guide) — with fewer colleges requiring a single common test score from every applicant, GPA and course rigor together end up carrying more of the weight in how an application gets read overall. Because of this, "take the most challenging classes you're genuinely prepared for" tends to be more useful advice than "just get all A's" — a transcript full of only the easiest available classes, even with perfect grades, can actually work against a student compared to a more rigorous course load with slightly lower grades. That said, this is a balance, not an extreme in either direction: a schedule so difficult that grades collapse across multiple classes isn't the goal either. (The full reasoning behind how to strike this balance is in the student roadmap's "Choosing your course load" guide, in 9th grade.)`,
        ],
      },
      {
        heading: "Class rank — related, but different",
        paragraphs: [
          `Some schools also calculate class rank — a number showing where a student stands compared to every other student in their grade, based on GPA. Not every school does this anymore, and many colleges don't weight it heavily even when a school does provide it — GPA and course rigor generally matter more to admissions offices than rank itself.`,
        ],
      },
      {
        heading: "Can a bad grade or a rough semester be recovered from?",
        paragraphs: [
          `Yes — genuinely, and this is worth saying clearly, because a lot of families worry unnecessarily about this. Colleges see a student's full, multi-year transcript, not a single isolated moment. An upward trend — grades that improve meaningfully over time — is generally viewed positively, and a single difficult semester, whether caused by illness, a family circumstance, or the adjustment to a harder class, rarely defines an entire application on its own, especially when a student's other semesters show real effort and improvement.`,
        ],
      },
      {
        heading: "A parent's role here",
        paragraphs: [
          `You don't need to track every individual assignment personally — building that habit is the student's own responsibility to develop. What genuinely helps: asking about the overall course schedule each year — is your child taking the most rigorous classes they're realistically ready for — rather than focusing only on each individual grade. If a grade does drop, asking what happened and whether extra help is available tends to be more useful than reacting to the number alone. And it's worth knowing that most schools now have an online parent portal where grades can be checked in real time throughout the semester — ask your child's school directly what that system is called and how to get access to it, since this isn't always obvious from the outside.`,
        ],
      },
    ],
    keyTerms: [
      { term: "GPA", definition: "Grade Point Average — letter grades converted to numbers and averaged across every class, usually on a 4.0 scale." },
      { term: "Weighted GPA", definition: "A GPA scale that gives extra value to harder classes (Honors, AP, IB) — can go above 4.0. This is normal." },
      { term: "AP (Advanced Placement)", definition: "College-level courses offered in high school; often weighted extra in GPA calculations." },
      { term: "Class rank", definition: "A student's position compared to their whole grade, based on GPA — used by some but not all schools." },
    ],
  },
  {
    title: `What Are Extracurricular Activities? (And What's a "Spike"?)`,
    teaser:
      "Why a job or caregiving counts as much as a school club, and the depth-over-breadth strategy admissions offices actually reward.",
    quickAnswer: [
      "An extracurricular is anything outside class that isn't required schoolwork — including jobs and family caregiving",
      "A \"spike\" means one area of real, sustained depth — not a scattered list of unrelated activities",
      "Leadership doesn't require an official title",
      "Cost is not the deciding factor — genuine engagement with what's actually available matters more than prestige",
    ],
    sections: [
      {
        paragraphs: [
          `"Extracurriculars" is one of the most common words in the college process, but it's rarely defined clearly — and the strategy around it has shifted in ways genuinely worth understanding, not just repeating as a vague buzzword.`,
        ],
      },
      {
        heading: "The simple definition",
        paragraphs: [
          `An extracurricular activity is anything a student does outside of regular class time that isn't required schoolwork — sports, school clubs, a paying job, volunteering, art, music, religious or cultural groups, and family responsibilities all fall under this umbrella. Colleges ask about these specifically because grades alone don't show who a student is as a person or what they genuinely care about.`,
        ],
      },
      {
        heading: `The most misunderstood part: it doesn't have to be a "school club"`,
        paragraphs: [
          `Many families assume this category only means official school-sponsored clubs or sports teams. It doesn't. All of the following genuinely count as real extracurricular activities: a part-time paying job (fast food, retail, a family business); caring for younger siblings or relatives while a parent works; translating for parents at appointments or handling family paperwork; involvement in a religious or cultural community group (a choir, a youth group, a cultural association); an informal self-directed project (teaching yourself a skill, running a small side project, organizing something in the community); and volunteering, whether formal or informal.`,
          `A part-time job or a real family caregiving responsibility is not "less than" a school club on an application — it often demonstrates a level of responsibility and maturity that stands out precisely because it's a genuine, unglamorous commitment. This matters specifically for many immigrant families, where students take on real household responsibilities that aren't traditionally thought of as "extracurriculars" but absolutely count and should be listed.`,
        ],
      },
      {
        heading: `Depth over breadth — and what a "spike" actually means`,
        paragraphs: [
          `Admissions readers generally respond better to a student who stuck with a small number of activities and genuinely grew within them — took on more responsibility, got better, eventually led something — than to a student with many activities done briefly and shallowly, sometimes called "resume padding" by counselors.`,
          `This pattern has a specific name in current admissions strategy: a "spike" — meaning one clearly identifiable area of real depth that shows up consistently across an application (in the activities list, in the essay, sometimes in a recommendation letter), rather than a scattered list of unrelated involvements. This term comes from data made public during a 2018 admissions lawsuit against Harvard, which found that applicants with one clear standout strength were admitted at meaningfully higher rates than "well-rounded" applicants who lacked one. The concept has become a common part of how selective admissions offices and independent counselors talk about a strong application since then.`,
          `A few things worth knowing, so this doesn't turn into unnecessary pressure: a spike does not have to be expensive or prestigious to be real — a sustained, self-directed project, a job held for years, or deep involvement in a community organization can be just as credible as a formal research program, and is often more credible, precisely because it's harder to fake or buy. It also doesn't mean abandoning every other interest a student has — most students genuinely have more than one — it means being able to tell a coherent, honest story about the one interest that runs deepest. And it's worth keeping in perspective: this concept matters far more at the most selective end of the process than it does for the typical four-year college in the country, where a well-rounded, genuinely engaged student remains a completely strong applicant with no "spike" required at all.`,
        ],
      },
      {
        heading: "Leadership doesn't require an official title",
        paragraphs: [
          `Many families assume "leadership" specifically means being elected club president or named team captain. It can mean that, but it can just as easily mean organizing something informally — a study group, a family or community event — mentoring a younger student or sibling, or taking initiative on a project without anyone ever assigning an official title. Colleges are generally reading for what a student actually did, not what title they happened to hold.`,
        ],
      },
      {
        heading: "If cost or access is a real barrier",
        paragraphs: [
          `Not every family can afford club fees, travel sports, instrument rentals, or unpaid "prestige" summer programs, and colleges broadly understand this. What matters more than access to expensive opportunities is what a student genuinely did with whatever was actually available to them. A free library reading program pursued with real seriousness can matter more in an application than an expensive program attended passively. If cost is the only thing standing between a student and something they want to try, it's worth asking the school or organization directly about fee waivers — they exist far more often than most families realize, but they're rarely advertised prominently.`,
        ],
      },
      {
        heading: "A parent's role here",
        paragraphs: [
          `Help your child notice responsibilities they might not think to "count" on their own — caregiving, translating, working — these are real and belong on the list, not hidden out of a sense that they aren't "official" enough. Support consistency in an activity over multiple years rather than encouraging a new one every semester. And if cost is a concern for something your child genuinely wants to try, ask directly about waivers before assuming it's simply out of reach.`,
        ],
      },
    ],
    keyTerms: [
      { term: "Extracurricular", definition: "Anything a student does outside class that isn't required schoolwork — including jobs and family caregiving, not just clubs." },
      { term: "\"Spike\"", definition: "One clear area of real, sustained depth that shows up consistently across an application — as opposed to many shallow activities." },
      { term: "Fee waiver", definition: "A way to reduce or eliminate the cost of a program, club, or application fee for families who need it — often under-advertised." },
    ],
  },
  {
    title: "Resources for Immigrant Families",
    teaser:
      "What the FAFSA actually asks (and doesn't), state aid for undocumented students, and where to find trustworthy help.",
    quickAnswer: [
      "The FAFSA does not ask about a parent's immigration status — this is one of the most common, avoidable fears",
      "Roughly 20 states plus D.C. offer state financial aid regardless of a student's federal immigration status",
      "A foreign degree or work experience often needs formal evaluation to \"translate\" for U.S. purposes",
      "For legal questions specifically, go to a licensed attorney or an established nonprofit — never an informal or unlicensed source",
    ],
    sections: [
      {
        paragraphs: [
          `Navigating college as an immigrant family often means doing everything every other family does, plus figuring out a set of additional questions that generic college advice simply doesn't address. This guide rounds up the areas most worth knowing about — with an honest note up front that specifics here change and vary by state, so always verify current details directly with a qualified professional or organization.`,
        ],
      },
      {
        heading: "Know that you're not alone in this",
        paragraphs: [
          `Every year, thousands of immigrant and first-generation students navigate this exact process. Organizations exist specifically because this is a common, well-understood set of challenges — not a unique obstacle your family is facing in isolation.`,
        ],
      },
      {
        heading: "Organizations that specifically support immigrant students",
        paragraphs: [
          `A few well-established, reputable places worth knowing about: Immigrants Rising, which offers resources specifically for undocumented students, including scholarship lists and know-your-rights information. TheDream.US, one of the largest scholarship providers specifically for undocumented students, including those with DACA status. College Board's BigFuture and the nonprofit Beyond12, both of which offer broader first-generation resources with some content addressing immigrant-specific questions. And local resettlement agencies and immigrant community centers — these are often overlooked, but frequently offer free, in-person help with paperwork and translation, sometimes in your family's native language. This isn't an exhaustive list, and new resources appear regularly — a school counselor or a local immigrant-serving nonprofit can often point to region-specific options not listed here.`,
        ],
      },
      {
        heading: "On the FAFSA specifically, for mixed-status families",
        paragraphs: [
          `This is one of the most common sources of fear and confusion for immigrant families, so it's worth being direct and precise about exactly what the form does and doesn't ask. The FAFSA does not ask about a parent's immigration status, at all. A parent who doesn't have a Social Security Number can still be listed as a "contributor" on the form — there is a specific, built-in way to indicate this, and it does not require inventing or borrowing a number from anyone.`,
          `What determines a student's own eligibility for federal aid is the student's own status, not the parent's. A U.S. citizen or "eligible non-citizen" student (a specific government category, explained in the Financial Aid guide) can file the FAFSA and access federal aid even if a parent is undocumented. Because concerns about data privacy and immigration enforcement are real and understandably front-of-mind for many families, and because policy and practice in this specific area can shift, this is a topic where getting current, direct guidance — from a school counselor, a college's own financial aid office, or an established immigration-focused nonprofit — genuinely matters more than in most other parts of this process. Secondhand information from friends, social media, or an outdated article is a poor substitute here.`,
        ],
      },
      {
        heading: "State aid for undocumented students, including DACA recipients",
        paragraphs: [
          `Students who are themselves undocumented, including those with DACA (Deferred Action for Childhood Arrivals) status, are not eligible for federal financial aid and generally should not submit a standard FAFSA. However, a meaningful number of individual states — roughly 20, plus Washington, D.C., as of recent counts, though this changes over time — offer their own state financial aid regardless of a student's federal immigration status. A few states, including Maryland and Massachusetts, have gone further and built entirely separate state aid application forms that don't require a Social Security number at all. Which states offer this, and under exactly what terms, changes over time, so it's always worth verifying your specific state's current policy directly, rather than relying on what was true even a year or two ago.`,
        ],
      },
      {
        heading: "On disclosing immigration status on college applications",
        paragraphs: [
          `Many colleges do not require a student to disclose their immigration status simply to apply, and policies about whether or how status might affect an admission decision vary by school. If a family is uncertain, contacting a school's admissions office directly, or a nonprofit that specializes in exactly this question, is a safer path than guessing based on general assumptions or something read online.`,
        ],
      },
      {
        heading: "Language support",
        paragraphs: [
          `If English isn't the primary language spoken at home: many schools have staff or counselors who can provide translated materials or interpretation during meetings. Some immigrant-serving nonprofits offer entirely in-language guidance throughout the whole college and financial aid process. And asking for this kind of support directly is common and genuinely expected — not something to feel any hesitation about.`,
        ],
      },
      {
        heading: "Credential and experience translation for parents",
        paragraphs: [
          `If a parent holds a degree or has professional experience from another country, it may not automatically translate into a recognized U.S. equivalent — and this can sometimes affect practical things like how income needs to be documented on financial aid forms, or a parent's own goals around further education in the U.S. Credential evaluation services exist specifically to formally assess and "translate" a foreign degree or credential into its U.S. equivalent, and a college's financial aid office can often advise on how to correctly document foreign income or credentials on aid forms.`,
        ],
      },
      {
        heading: "Mental health and belonging",
        paragraphs: [
          `The college process is genuinely stressful for every family, and immigrant students sometimes carry additional weight on top of that — navigating a system their parents never experienced firsthand, balancing cultural expectations, or acting as a translator and guide for their own family throughout the process. This is a common, valid experience, not a sign that anything is being done wrong. Many colleges have support offices specifically for first-generation and immigrant students once a student is actually enrolled, and it's worth asking directly whether one exists on any campus a family is considering.`,
        ],
      },
      {
        heading: "A note on legal questions specifically",
        paragraphs: [
          `This guide, and this app more broadly, can share general information — but specific legal questions about immigration status, DACA renewal, visas, or eligibility should always go to a qualified immigration attorney or a reputable, established immigration legal nonprofit. They should never go to informal advice, or to unlicensed "notario" services — a term for unofficial, unlicensed immigration consultants — some of which are predatory and specifically target immigrant families with inaccurate or harmful advice. A school counselor or local resettlement agency can usually point a family toward a trustworthy, often free or low-cost, legal resource.`,
        ],
      },
    ],
    keyTerms: [
      { term: "DACA", definition: "Deferred Action for Childhood Arrivals — a status for certain undocumented students; does not make a student eligible for federal aid, but may open some state aid." },
      { term: "Mixed-status family", definition: "A family where members hold different immigration statuses — e.g., a citizen student with an undocumented parent." },
      { term: "Credential evaluation", definition: "A formal service that assesses a foreign degree or work experience and translates it into its U.S. equivalent." },
      { term: "\"Notario\"", definition: "An unlicensed, informal immigration consultant — never a substitute for a licensed attorney; some are predatory." },
    ],
  },
];

/* ============================================================
   Shared NYT / CollegeAdvisor-style article view
   Fixes: drop cap now uses native CSS ::first-letter (see injected
   <style> block below) instead of manually slicing the string into a
   separate <span> — that manual approach is exactly what caused the
   misalignment bug, since a hand-built float span doesn't share the
   font's real glyph metrics or kerning with the surrounding text.
   Native ::first-letter lets the browser handle that correctly.
============================================================ */
function ArticleView({ eyebrow, kicker, kickerColor, title, badge, quickAnswer, sections, keyTerms, onBack }) {
  return (
    <div className="w-full max-w-[700px] mx-auto">
      <button
        onClick={onBack}
        style={{ color: colors.textSoft }}
        className="flex items-center gap-1.5 text-sm font-medium mb-8 hover:opacity-70 transition-opacity"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {eyebrow && (
        <div style={{ color: colors.textSoft }} className="text-xs font-semibold tracking-[0.12em] uppercase mb-2">
          {eyebrow}
        </div>
      )}
      {kicker && (
        <div style={{ color: kickerColor || colors.accent }} className="text-xs font-bold tracking-[0.12em] uppercase mb-4">
          {kicker}
        </div>
      )}

      <h1
        style={{ fontFamily: "'Fraunces', serif", color: colors.text }}
        className="text-[32px] sm:text-4xl font-semibold leading-[1.15] mb-5"
      >
        {title}
      </h1>

      {badge && (
        <div className="flex items-center gap-1.5 mb-6">
          <Star size={13} color={colors.accent} fill={colors.accent} />
          <span style={{ color: colors.accent }} className="text-xs font-semibold tracking-wide">{badge}</span>
        </div>
      )}

      {quickAnswer && quickAnswer.length > 0 && (
        <div
          style={{ background: colors.chipBg, border: `1px solid ${colors.border}` }}
          className="rounded-2xl px-5 py-4 mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <ListChecks size={15} color={colors.accent} />
            <span style={{ color: colors.text }} className="text-sm font-semibold">In this guide</span>
          </div>
          <ul className="flex flex-col gap-2">
            {quickAnswer.map((q, i) => (
              <li key={i} style={{ color: colors.text }} className="text-sm leading-relaxed flex gap-2">
                <span style={{ color: colors.accent }} className="shrink-0">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ borderTop: `1px solid ${colors.border}` }} className="pt-7">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-8 last:mb-0">
            {section.heading && (
              <h2
                style={{ fontFamily: "'Fraunces', serif", color: colors.text }}
                className="text-xl font-semibold mb-3 mt-1"
              >
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((para, pIdx) => (
              <p
                key={pIdx}
                style={{ color: colors.text }}
                className={`text-[17px] leading-[1.85] mb-5 last:mb-0 ${
                  sIdx === 0 && pIdx === 0 ? "article-dropcap" : ""
                }`}
              >
                {para}
              </p>
            ))}
            {section.callout && (
              <div
                style={{ background: colors.calloutBg, border: `1px solid ${colors.calloutBorder}` }}
                className="rounded-xl px-5 py-4 mt-2 flex gap-3"
              >
                <Lightbulb size={17} color={colors.calloutText} className="shrink-0 mt-0.5" />
                <div>
                  {section.callout.label && (
                    <div style={{ color: colors.calloutText }} className="text-xs font-bold uppercase tracking-wide mb-1">
                      {section.callout.label}
                    </div>
                  )}
                  <div style={{ color: colors.calloutText }} className="text-sm leading-relaxed">
                    {section.callout.text}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {keyTerms && keyTerms.length > 0 && (
        <div
          style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
          className="rounded-2xl px-5 py-5 mt-10"
        >
          <div style={{ fontFamily: "'Fraunces', serif", color: colors.text }} className="text-base font-semibold mb-3">
            Key terms in this guide
          </div>
          <div className="flex flex-col gap-3">
            {keyTerms.map((kt, i) => (
              <div key={i}>
                <span style={{ color: colors.accent }} className="text-sm font-semibold">{kt.term}</span>
                <span style={{ color: colors.textSoft }} className="text-sm leading-relaxed"> — {kt.definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PathFinder() {
  const [tab, setTab] = useState("roadmap");
  const [grade, setGrade] = useState(9);
  const [openRoadmapItem, setOpenRoadmapItem] = useState(null);
  const [openGuideIndex, setOpenGuideIndex] = useState(null);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm here to help with college prep questions — for you or your family. What's on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const changeGrade = (g) => {
    setGrade(g);
    setOpenRoadmapItem(null);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply =
        (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("") ||
        "Sorry, I didn't catch that — could you try again?";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Hmm, I couldn't connect just now. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const items = roadmapData[grade];
  const categories = categoryOrder.filter((c) => items.some((i) => i.category === c));

  return (
    <div className="w-full min-h-screen" style={{ background: colors.bg, fontFamily: "'Inter', sans-serif", color: colors.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
        .article-dropcap::first-letter {
          float: left;
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 3.4em;
          line-height: 0.78;
          padding-right: 0.5rem;
          margin-top: 0.045em;
          color: ${colors.accent};
        }
      `}</style>

      {/* Top bar */}
      <div className="flex items-center justify-between px-10 py-5 flex-wrap gap-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="flex items-center gap-2.5">
          <div style={{ background: colors.accent }} className="w-9 h-9 rounded-full flex items-center justify-center">
            <Route size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold">PathFinder</span>
        </div>
        <div className="flex gap-1">
          {[
            { id: "roadmap", label: "Roadmap", icon: Route },
            { id: "chat", label: "Ask AI", icon: MessageCircle },
            { id: "guide", label: "Guide", icon: BookOpen },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setOpenGuideIndex(null); setOpenRoadmapItem(null); }}
              style={{ color: tab === id ? colors.accent : colors.textSoft, background: tab === id ? colors.chipBg : "transparent" }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "roadmap" && (
        <div className="flex w-full">
          <aside className="w-64 shrink-0 px-8 py-10 hidden md:block" style={{ borderRight: `1px solid ${colors.border}` }}>
            <div style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold mb-1">Your roadmap</div>
            <div style={{ color: colors.textSoft }} className="text-sm mb-8 leading-relaxed">A guide for every grade, 6th through 12th.</div>
            {gradeGroups.map((group) => (
              <div key={group.label} className="mb-7">
                <div style={{ color: colors.textSoft }} className="text-xs font-semibold tracking-wide uppercase mb-3">{group.label}</div>
                <div className="flex flex-col gap-1">
                  {group.grades.map((g) => (
                    <button
                      key={g}
                      onClick={() => changeGrade(g)}
                      className="text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      style={{
                        color: g === grade ? colors.text : colors.textSoft,
                        background: g === grade ? colors.surface : "transparent",
                        border: `1px solid ${g === grade ? colors.border : "transparent"}`,
                        boxShadow: g === grade ? "0 1px 3px rgba(43,38,32,0.06)" : "none",
                      }}
                    >
                      Grade {g}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <main className="flex-1 px-6 sm:px-10 lg:px-16 py-10 min-w-0">
            {openRoadmapItem ? (
              <ArticleView
                eyebrow={`Grade ${grade}`}
                kicker={openRoadmapItem.category}
                kickerColor={categoryMeta[openRoadmapItem.category]?.color}
                title={openRoadmapItem.title}
                badge={openRoadmapItem.badge}
                quickAnswer={openRoadmapItem.quickAnswer}
                sections={openRoadmapItem.sections}
                onBack={() => setOpenRoadmapItem(null)}
              />
            ) : (
              <>
                <div className="flex gap-2 mb-8 overflow-x-auto md:hidden" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  {gradeGroups.flatMap((g) => g.grades).map((g) => (
                    <button
                      key={g}
                      onClick={() => changeGrade(g)}
                      className="pb-3 px-1 text-sm font-medium shrink-0 relative"
                      style={{ color: g === grade ? colors.text : colors.textSoft }}
                    >
                      Grade {g}
                      {g === grade && <div style={{ background: colors.accent, height: 2, position: "absolute", left: 0, right: 0, bottom: -1 }} />}
                    </button>
                  ))}
                </div>

                <div className="mb-10">
                  <div style={{ fontFamily: "'Fraunces', serif" }} className="text-4xl font-semibold mb-2">Grade {grade}</div>
                  <div style={{ color: colors.textSoft }} className="text-base">What matters this year, organized by category. Tap any item to read the full guide.</div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8">
                  {categories.map((cat) => {
                    const meta = categoryMeta[cat];
                    const Icon = meta.icon;
                    const catItems = items.filter((i) => i.category === cat);
                    const isFullWidth = cat === "Summer";
                    return (
                      <div key={cat} className={`mb-10 ${isFullWidth ? "xl:col-span-2" : ""}`}>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div style={{ background: `${meta.color}1A` }} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                            <Icon size={16} color={meta.color} />
                          </div>
                          <span style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold">{cat}</span>
                        </div>

                        <div className="flex flex-col gap-3">
                          {catItems.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => setOpenRoadmapItem(item)}
                              style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderLeft: `3px solid ${meta.color}` }}
                              className="rounded-xl overflow-hidden cursor-pointer px-5 py-4 hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <div className="text-[15px] font-medium leading-snug mb-1.5">{item.title}</div>
                                  <div
                                    style={{
                                      color: colors.textSoft,
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                    className="text-[13px] leading-relaxed"
                                  >
                                    {item.sections[0].paragraphs[0]}
                                  </div>
                                  {item.badge && (
                                    <div className="flex items-center gap-1.5 mt-2.5">
                                      <Star size={12} color={meta.color} fill={meta.color} />
                                      <span style={{ color: meta.color }} className="text-xs font-semibold">{item.badge}</span>
                                    </div>
                                  )}
                                </div>
                                <ArrowUpRight size={16} style={{ color: colors.textSoft }} className="shrink-0 mt-0.5" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </main>
        </div>
      )}

      {tab === "chat" && (
        <div className="w-full px-6 py-10 flex justify-center">
          <div className="w-full max-w-3xl">
            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, height: 640 }} className="rounded-2xl flex flex-col overflow-hidden">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      style={{
                        background: m.role === "user" ? colors.accent : colors.bg,
                        color: m.role === "user" ? "#fff" : colors.text,
                        maxWidth: "80%",
                      }}
                      className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div style={{ background: colors.bg }} className="rounded-2xl px-4 py-3">
                      <Loader2 size={14} className="animate-spin" color={colors.textSoft} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 flex gap-3" style={{ borderTop: `1px solid ${colors.border}` }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about applications, aid, anything..."
                  style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
                  className="flex-1 rounded-full px-5 py-3 text-sm outline-none"
                />
                <button onClick={send} style={{ background: colors.accent }} className="w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                  <Send size={16} color="#fff" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "guide" && (
        <div className="w-full px-6 sm:px-10 py-10">
          {openGuideIndex !== null ? (
            <ArticleView
              eyebrow={`Parent Guide · ${String(openGuideIndex + 1).padStart(2, "0")} of ${guideArticles.length}`}
              title={guideArticles[openGuideIndex].title}
              quickAnswer={guideArticles[openGuideIndex].quickAnswer}
              sections={guideArticles[openGuideIndex].sections}
              keyTerms={guideArticles[openGuideIndex].keyTerms}
              onBack={() => setOpenGuideIndex(null)}
            />
          ) : (
            <>
              <div className="mb-10 max-w-2xl">
                <div style={{ fontFamily: "'Fraunces', serif" }} className="text-4xl font-semibold mb-2">Parent Guide</div>
                <div style={{ color: colors.textSoft }} className="text-base">Six full guides, meant to be read together — no prior knowledge of the U.S. college system needed.</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {guideArticles.map((a, i) => (
                  <div
                    key={i}
                    onClick={() => setOpenGuideIndex(i)}
                    style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
                    className="rounded-2xl overflow-hidden cursor-pointer p-5 hover:shadow-sm transition-shadow"
                  >
                    <div style={{ color: colors.textSoft }} className="text-xs font-semibold tracking-wide mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold mb-1.5 leading-snug">
                        {a.title}
                      </div>
                      <ArrowUpRight size={15} style={{ color: colors.textSoft }} className="shrink-0 mt-1" />
                    </div>
                    <div style={{ color: colors.textSoft }} className="text-sm leading-relaxed">
                      {a.teaser}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
