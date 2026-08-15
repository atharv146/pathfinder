import { PageFrame } from "@/components/PageFrame";
import { KineticText } from "@/components/KineticText";
import { ActivitiesBuilder } from "@/components/activities/ActivitiesBuilder";
import { ShapeField } from "@/components/backdrop/ShapeField";

export const metadata = { title: "Your activities — PathFinder" };

export default function ActivitiesPage() {
  return (
    <PageFrame accent="lime" label="Activities" index="A08">
      <section className="relative overflow-hidden px-6 py-20 sm:px-10">
        <ShapeField color="#d4ff4f" />

        <div className="relative mx-auto max-w-3xl">
          <p className="micro mb-4 text-accent">(08) &nbsp;What you&rsquo;ve actually done</p>
          <KineticText as="h1" immediate className="display mb-4 text-4xl text-chalk sm:text-6xl">
            Your activities list.
          </KineticText>
          <p className="mb-14 max-w-xl text-[0.95rem] leading-relaxed text-ash">
            Colleges ask for this. Most students have more to put here than they think —
            a job, caring for family, translating, teaching yourself something. Write it
            down plainly now; wording gets fixed later.
          </p>

          <ActivitiesBuilder />
        </div>
      </section>
    </PageFrame>
  );
}
