import guideJson from "./guide-articles.json";

export type GuideSection = { heading?: string; paragraphs: string[] };

export type GuideArticle = {
  title: string;
  teaser: string;
  quickAnswer: string[];
  sections: GuideSection[];
  keyTerms?: { term: string; definition: string }[];
  badge?: string;
};

export const guideArticles = guideJson as GuideArticle[];

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getGuideArticleBySlug(slug: string): GuideArticle | undefined {
  return guideArticles.find((a) => slugify(a.title) === slug);
}
