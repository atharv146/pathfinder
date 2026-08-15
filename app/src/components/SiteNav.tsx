import Link from "next/link";
import { AuthNav } from "@/components/auth/AuthNav";

const links = [
  // Explicit Home link — relying on the wordmark alone hides the way back
  // from anyone who doesn't already know that convention.
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/ask-ai", label: "Ask AI" },
  { href: "/guide", label: "Guide" },
];

export function SiteNav() {
  return (
    <header className="relative z-20 flex items-center justify-between border-b border-line px-6 py-5 sm:px-10">
      <Link href="/" className="flex items-baseline gap-2">
        <span className="display text-xl leading-none tracking-tight text-chalk">
          PathFinder
        </span>
        <span className="micro text-smoke">®</span>
      </Link>

      <nav className="hidden items-center gap-9 sm:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="micro text-ash transition-colors hover:text-chalk"
          >
            :{l.label}
          </Link>
        ))}
      </nav>

      <AuthNav />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="micro text-smoke">PathFinder — free, always</span>
        <span className="micro text-smoke">Built for students, by design</span>
      </div>
    </footer>
  );
}
