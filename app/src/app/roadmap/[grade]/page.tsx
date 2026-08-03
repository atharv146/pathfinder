import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoadmapItems } from "@/data/roadmap";
import { RoadmapGradeView } from "./RoadmapGradeView";
import { RevealText } from "@/components/RevealText";

export function generateStaticParams() {
  return [6, 7, 8, 9, 10, 11, 12].map((grade) => ({ grade: String(grade) }));
}

export default async function RoadmapGradePage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade: gradeParam } = await params;
  const grade = parseInt(gradeParam, 10);
  const items = getRoadmapItems(grade);

  if (!Number.isInteger(grade) || grade < 6 || grade > 12 || items.length === 0) {
    notFound();
  }

  return (
    <>
      <div className="texture-dots h-10 border-b border-border" aria-hidden />
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/roadmap"
            className="font-mono text-xs uppercase tracking-widest text-text-faint hover:text-text-soft"
          >
            ← All grades
          </Link>
          <RevealText
            as="h1"
            text={`Grade ${grade}`}
            className="mt-4 font-display text-4xl font-semibold"
          />
          <RoadmapGradeView grade={grade} items={items} />
        </div>
      </section>
    </>
  );
}
