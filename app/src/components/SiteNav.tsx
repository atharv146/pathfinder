import Link from "next/link";

const links = [
  { href: "/roadmap", label: "Roadmap", index: "01" },
  { href: "/ask-ai", label: "Ask AI", index: "02" },
  { href: "/guide", label: "Guide", index: "03" },
];

export function SiteNav() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-glow-amber to-glow-ember">
          <span className="h-2 w-2 rounded-full bg-void" />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">
          PathFinder
        </span>
      </Link>
      <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest text-text-soft sm:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="transition-colors hover:text-text">
            {l.index} · {l.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/roadmap"
        className="rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-text transition-colors hover:border-signal hover:text-signal"
      >
        Get Started
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-text-faint sm:flex-row">
        <span>PathFinder — free, always</span>
        <span>Built for students, by design</span>
      </div>
    </footer>
  );
}
