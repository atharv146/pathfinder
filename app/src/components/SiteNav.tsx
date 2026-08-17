"use client";

import Link from "next/link";
import { AuthNav } from "@/components/auth/AuthNav";
import { MobileNav } from "@/components/MobileNav";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const LINK_KEYS = [
  // Explicit Home link — relying on the wordmark alone hides the way back
  // from anyone who doesn't already know that convention.
  { href: "/", key: "navHome" },
  { href: "/roadmap", key: "navRoadmap" },
  { href: "/major", key: "navMajor" },
  { href: "/ask-ai", key: "navAskAi" },
  { href: "/guide", key: "navGuide" },
  { href: "/opportunities", key: "navScholarships" },
  { href: "/tools", key: "navTools" },
];

export function SiteNav() {
  const { t } = useLanguage();
  const links = LINK_KEYS.map((l) => ({ href: l.href, label: t(l.key) }));

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

      <div className="flex items-center gap-3">
        {/* Auth controls are desktop-only here; the mobile sheet carries its
            own copy so the header stays uncluttered on small screens. */}
        <div className="hidden sm:block">
          <AuthNav />
        </div>
        <MobileNav links={links} />
      </div>
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
