import { Suspense } from "react";
import { PageFrame } from "@/components/PageFrame";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata = { title: "Set up — PathFinder" };

export default function OnboardingPage() {
  return (
    <PageFrame accent="teal" label="Setup" index="A07">
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-20 sm:px-10">
        <Suspense fallback={<div className="h-[30rem]" />}>
          <OnboardingFlow />
        </Suspense>
      </section>
    </PageFrame>
  );
}
