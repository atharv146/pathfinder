import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoadmapItems } from "@/data/roadmap";
import { RoadmapGradeView } from "./RoadmapGradeView";
import { MajorLens } from "@/components/roadmap/MajorLens";
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
      <div className="texture-dots h-10 border-b border-line" aria-hidden />
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/roadmap"
            className="font-mono text-xs uppercase tracking-widest text-smoke hover:text-ash"
          >
            ← All grades
          </Link>
          <RevealText
            as="h1"
            text={`Grade ${grade}`}
            className="mt-4 display text-4xl font-semibold"
          />
          <MajorLens grade={grade} />

          <RoadmapGradeView grade={grade} items={items} />
        </div>
      </section>
    </>
  );
}
