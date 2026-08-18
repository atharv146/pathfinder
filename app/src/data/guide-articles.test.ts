import { describe, expect, it } from "vitest";
import articles from "./guide-articles.json";

/**
 * Structural tests for the parent guide content.
 *
 * ⚠️ THE DUPLICATE-TERM TEST IS A REGRESSION TEST. The Aug 17, 2026 depth pass
 * added a "CSS Profile" key term to the financial aid article and a
 * "Credential evaluation" term to the immigrant families article — both of
 * which already existed. React rendered the list keyed by term, so the
 * duplicates produced console key collisions and one of each pair could be
 * silently dropped from the page.
 *
 * That is the same class of bug as the opportunities directory's duplicate
 * ids, found the same day, in a completely different file. Content that is
 * hand-edited will grow duplicates; the only reliable defence is a test.
 *
 * Scope is deliberately structural — shape, uniqueness, no empty fields. The
 * accuracy of the content itself is verified against primary sources by hand
 * and stamped in `data/freshness.ts`; no test can do that job.
 */

type Article = {
  title: string;
  teaser: string;
  quickAnswer: string[];
  sections: { heading?: string; paragraphs: string[] }[];
  keyTerms: { term: string; definition: string }[];
};

const ARTICLES = articles as Article[];

describe("guide articles", () => {
  it("has the eight articles the guide index expects", () => {
    expect(ARTICLES).toHaveLength(8);
  });

  it("gives every article the fields the page renders", () => {
    for (const a of ARTICLES) {
      expect(a.title, "title").toBeTruthy();
      expect(a.teaser, `${a.title} teaser`).toBeTruthy();
      expect(a.quickAnswer.length, `${a.title} quickAnswer`).toBeGreaterThan(0);
      expect(a.sections.length, `${a.title} sections`).toBeGreaterThan(0);
    }
  });

  it("has unique titles, since the slug is derived from the title", () => {
    const titles = ARTICLES.map((a) => a.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  /** The regression test — see the header. */
  it("never repeats a key term within an article", () => {
    for (const a of ARTICLES) {
      const terms = a.keyTerms.map((t) => t.term);
      const dupes = terms.filter((t, i) => terms.indexOf(t) !== i);
      expect(dupes, `${a.title} repeats key term(s): ${dupes.join(", ")}`).toEqual([]);
    }
  });

  it("never repeats a section heading within an article", () => {
    for (const a of ARTICLES) {
      const headings = a.sections.map((s) => s.heading).filter(Boolean) as string[];
      const dupes = headings.filter((h, i) => headings.indexOf(h) !== i);
      expect(dupes, `${a.title} repeats heading(s): ${dupes.join(", ")}`).toEqual([]);
    }
  });

  it("has no empty paragraphs or definitions", () => {
    for (const a of ARTICLES) {
      for (const s of a.sections) {
        for (const p of s.paragraphs) {
          expect(p.trim(), `${a.title} / ${s.heading ?? "intro"}`).not.toBe("");
        }
      }
      for (const t of a.keyTerms) {
        expect(t.definition.trim(), `${a.title} / ${t.term}`).not.toBe("");
      }
    }
  });

  /**
   * NOT TESTED, deliberately: apostrophe style. A first version of this file
   * asserted typographic apostrophes in body copy and failed against 83
   * paragraphs — the authored content uses straight quotes throughout, and has
   * since it was written. The test was inventing a convention rather than
   * enforcing one, and the honest fix was to delete the test, not to rewrite
   * six articles of real prose to satisfy it. Noted here so nobody adds it
   * back thinking it was an oversight.
   */
});
