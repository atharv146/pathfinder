import { AuthForm } from "@/components/auth/AuthForm";
import { PageFrame } from "@/components/PageFrame";

export const metadata = { title: "Create account — PathFinder" };

export default function SignupPage() {
  return (
    <PageFrame accent="teal" label="Create account" index="A06">
      <section className="relative flex min-h-[80vh] items-center justify-center px-6 py-20 sm:px-10">
        <div className="w-full max-w-md">
          <p className="micro mb-4 text-accent">(06) &nbsp;Free, always</p>
          <h1 className="display mb-3 text-4xl text-chalk sm:text-5xl">Create your account.</h1>
          <p className="mb-10 text-[0.95rem] leading-relaxed text-ash">
            Save your progress across devices. No cost, no upsell, nothing sold to anyone.
          </p>
          <AuthForm mode="signup" />
        </div>
      </section>
    </PageFrame>
  );
}
