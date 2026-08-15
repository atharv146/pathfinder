import { PageFrame } from "@/components/PageFrame";
import { KineticText } from "@/components/KineticText";
import { AccountPanel } from "@/components/account/AccountPanel";

export const metadata = { title: "Your account — PathFinder" };

export default function AccountPage() {
  return (
    <PageFrame accent="violet" label="Account" index="A09">
      <section className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-20">
        <div className="relative mx-auto max-w-2xl">
          <p className="micro mb-4 text-accent">(09) &nbsp;Your account</p>
          <KineticText
            as="h1"
            immediate
            className="display mb-4 text-[2.5rem] leading-[1.05] text-chalk sm:text-6xl"
          >
            Settings.
          </KineticText>
          <p className="mb-12 max-w-lg text-[0.95rem] leading-relaxed text-ash">
            Your data belongs to you. Change what you like, or remove all of it.
          </p>

          <AccountPanel />
        </div>
      </section>
    </PageFrame>
  );
}
