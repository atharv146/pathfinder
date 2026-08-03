import Link from "next/link";
import { notFound } from "next/navigation";
import { guideArticles, getGuideArticleBySlug, slugify } from "@/data/guide";
import { ArticleView } from "@/components/ArticleView";

export function generateStaticParams() {
  return guideArticles.map((a) => ({ slug: slugify(a.title) }));
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getGuideArticleBySlug(slug);

  if (!article) notFound();

  return (
    <>
      <div className="texture-dots h-10 border-b border-line" aria-hidden />
      <section className="px-6 py-4 sm:px-10">
        <div className="mx-auto max-w-2xl pt-8">
          <Link
            href="/guide"
            className="font-mono text-xs uppercase tracking-widest text-smoke hover:text-ash"
          >
            ← All guide articles
          </Link>
        </div>
        <ArticleView
          eyebrow="Parent & student guide"
          title={article.title}
          quickAnswer={article.quickAnswer}
          sections={article.sections}
          keyTerms={article.keyTerms}
        />
      </section>
    </>
  );
}
