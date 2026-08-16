#!/usr/bin/env python3
"""
Deepen grades 6-8 in roadmap.json.

WHY: measured depth before this ran — grades 6/7/8 averaged 44-70 words per
item against 140-225 for grades 9-12, and several middle-school titles were
soft ("start noticing what you actually enjoy"). Middle school is exactly
where this app claims to be different, so thin content there undercuts the
whole premise.

CONTENT RULE FOLLOWED: everything added is structural and checkable — how
course sequences work, what a fee waiver is, which middle-school courses can
land on a high-school transcript. No statistics, no admissions odds, no named
programs. Where practice varies by district or state, the copy says so and
tells the student what to ask rather than asserting a national rule.
"""

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "app" / "src" / "data" / "roadmap.json"

NEW_ITEMS = {
    "6": [
        {
            "id": "g6-math-placement",
            "category": "Academics",
            "title": "Ask how your school decides math placement — this is the quiet decision that shapes everything",
            "sections": [
                {
                    "heading": "",
                    "paragraphs": [
                        "Almost nothing in 6th grade affects college. Math placement is the exception, and it is the single most under-explained thing in middle school.",
                        "Here is the mechanism. Most high schools run math as a fixed ladder: Algebra 1, then Geometry, then Algebra 2, then Precalculus, then Calculus. That is five courses. If you start Algebra 1 in 9th grade, you finish Precalculus as a senior and never reach Calculus. If you start Algebra 1 in 8th grade, Calculus fits.",
                        "This matters because engineering and computer science programs often expect calculus on a transcript. The decision that makes it possible is usually made two or three years earlier, by a placement test or a teacher recommendation you may never hear about.",
                        "So ask, this year: how does our district decide who takes Algebra 1 in 8th grade? Is there a test? Who recommends students? Can a family request a review? None of these questions require you to be ahead — they just require knowing the ladder exists. Families who already know the system ask by default, which is precisely why asking is worth so much here."
                    ]
                }
            ]
        }
    ],
    "7": [
        {
            "id": "g7-hs-credit-courses",
            "category": "Academics",
            "title": "Find out whether any middle school class will appear on your high school transcript",
            "sections": [
                {
                    "heading": "",
                    "paragraphs": [
                        "Some middle schools offer courses that carry actual high school credit — most often Algebra 1, sometimes Geometry or a world language. In some districts those grades appear on the high school transcript and count toward high school GPA. In others they only satisfy the prerequisite and are not graded on the transcript at all.",
                        "That difference is worth knowing before you are in the class, not after. If the grade counts, an 8th-grade course is a real transcript entry that colleges will see. If it does not count, it still moves you up the sequence, which is usually the more valuable part anyway.",
                        "Ask a counselor directly: does this class appear on the high school transcript, and does it affect high school GPA? Both answers are common and neither is bad. What hurts is assuming one and finding out it was the other.",
                        "If it does count and a class goes badly, ask what your options are — many districts allow retaking, and some let a middle-school grade be excluded from the high school GPA on request."
                    ]
                }
            ]
        },
        {
            "id": "g7-fee-waiver-awareness",
            "category": "Financial Literacy Awareness",
            "title": "If your family qualifies for free or reduced lunch, that status unlocks things later",
            "sections": [
                {
                    "heading": "",
                    "paragraphs": [
                        "Nothing to act on yet. This is one to file away, because it saves real money in four or five years and almost nobody explains the connection.",
                        "Students from lower-income families can get fee waivers for college admissions tests and, separately, for college application fees themselves. Applications commonly cost money per school, and testing costs money per sitting, so waivers can be worth hundreds of dollars across a senior year.",
                        "Qualifying for free or reduced-price lunch is one of the common indicators used to establish eligibility, though it is not the only route and the exact rules differ between programs. The practical thing now is simply to know the link exists.",
                        "If your family qualifies and has not enrolled because of paperwork, language, or discomfort about applying, it is worth revisiting. The benefit is not only the meals; it is the documentation trail that makes later waivers straightforward instead of a scramble in 12th grade."
                    ]
                }
            ]
        }
    ],
    "8": [
        {
            "id": "g8-world-language-sequence",
            "category": "Academics",
            "title": "World language runs on a sequence too, and starting now changes where you finish",
            "sections": [
                {
                    "heading": "",
                    "paragraphs": [
                        "Language works like math: each level is a prerequisite for the next, so where you finish is decided by where you start. A student beginning in 9th grade typically reaches level 4 by senior year. Beginning in 8th grade puts level 5, or an AP language course, within reach.",
                        "This matters for humanities-leaning students in particular, where several years of the same language is commonly expected and occasionally a stated requirement. It matters less for other paths, so it is worth weighing rather than treating as mandatory.",
                        "One specific note for multilingual families: if you already speak a language at home, ask whether your school offers a placement test or a credit-by-exam route for it. Some districts grant credit for demonstrated proficiency, and some colleges do too. Students who grew up speaking a language sometimes sit through beginner classes in it because nobody told them testing out was an option.",
                        "Speaking a language at home is an academic asset. It is worth having on the transcript rather than only in your head."
                    ]
                }
            ]
        }
    ]
}

# Existing items whose text was too thin to be useful, rewritten with the
# mechanism spelled out rather than the sentiment.
REPLACEMENTS = {
    "Extracurriculars — \"If a small leadership chance comes up, try it, but don't force it\"": None,
}

EXPANDED = {
    "7": {
        "Start noticing what you actually enjoy": [
            "By now you have probably tried a handful of things. Notice which ones you look forward to and which feel like a chore. You do not have to commit yet.",
            "There is a practical reason this matters beyond self-knowledge. Applications years from now ask you to describe a small number of activities in depth, not to list twenty. Depth is easier to build when you started early on something you actually liked, and much harder to manufacture in 11th grade.",
            "So the useful move in 7th grade is subtraction, not addition: narrow from everything down to the one or two things you would keep doing if nobody were watching."
        ]
    },
    "8": {
        "Choose your 9th grade classes carefully. This is where your real transcript starts.": [
            "This is the first genuinely consequential academic decision in this roadmap. Ninth-grade grades appear on the transcript colleges read.",
            "Go to the course-selection night if your school holds one, and bring a parent or guardian if you can. This is often where track decisions get made quietly, and it is far easier to start on a track than to move onto it later.",
            "Two things to ask about specifically. First, honors or accelerated options: which are available, what do they require, and can you request one if you were not recommended? Second, the math sequence — confirm which course you are placed into and what that means for what you can reach by senior year.",
            "If you are placed lower than you expected, ask what the path back up looks like. Some districts allow a summer course or a placement test to move over. That option usually exists but is rarely advertised."
        ]
    }
}


def main() -> None:
    data = json.loads(JSON_PATH.read_text())

    added = 0
    for grade, items in NEW_ITEMS.items():
        existing_ids = {i["id"] for i in data[grade]}
        for item in items:
            if item["id"] in existing_ids:
                continue
            data[grade].append(item)
            added += 1

    expanded = 0
    for grade, titles in EXPANDED.items():
        for item in data[grade]:
            if item["title"] in titles:
                item["sections"] = [{"heading": "", "paragraphs": titles[item["title"]]}]
                expanded += 1

    JSON_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")

    total = sum(len(v) for v in data.values())
    print(f"added {added} items, expanded {expanded} items, total now {total}")
    for g in ["6", "7", "8"]:
        words = sum(
            len(p.split())
            for i in data[g]
            for s in i["sections"]
            for p in s.get("paragraphs", [])
        )
        print(f"  grade {g}: {len(data[g])} items, {words // len(data[g])} avg words/item")


if __name__ == "__main__":
    main()
