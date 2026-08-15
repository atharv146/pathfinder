import { AuthForm } from "@/components/auth/AuthForm";
import { PageFrame } from "@/components/PageFrame";

export const metadata = { title: "Sign in — PathFinder" };

export default function LoginPage() {
  return (
    <PageFrame accent="teal" label="Sign in" index="A05">
      <section className="relative flex min-h-[80vh] items-center justify-center px-6 py-20 sm:px-10">
        <div className="w-full max-w-md">
          <p className="micro mb-4 text-accent">(05) &nbsp;Welcome back</p>
          <h1 className="display mb-3 text-4xl text-chalk sm:text-5xl">Sign in.</h1>
          <p className="mb-10 text-[0.95rem] leading-relaxed text-ash">
            Your roadmap progress, saved where you left it.
          </p>
          <AuthForm mode="signin" />
        </div>
      </section>
    </PageFrame>
  );
}
