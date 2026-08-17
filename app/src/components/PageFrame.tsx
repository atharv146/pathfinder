"use client";

import type { ReactNode } from "react";

export type Accent = "teal" | "lime" | "coral" | "violet" | "azure";

/**
 * Per-page identity wrapper: sets the route's accent colour and draws the
 * fixed corner brackets from the Intrepid reference.
 *
 * The brackets are viewport-fixed rather than section-relative so they frame
 * the whole page like a viewfinder instead of sliding away on scroll. All
 * decorative, so the whole frame is aria-hidden and pointer-transparent.
 */
export function PageFrame({
  accent,
  label,
  index,
  children,
}: {
  accent: Accent;
  /** Mono label shown top-left, e.g. "ROADMAP". */
  label?: string;
  /** Mono index shown top-right, e.g. "A02". */
  index?: string;
  children: ReactNode;
}) {
  return (
    <div data-accent={accent} className="relative">
      {/* Desktop only. These are viewport-FIXED, so on a phone they float over
          whatever happens to be scrolling past — headings collided with the
          route label, and the brackets landed mid-content. There isn't enough
          margin on a 375px screen for chrome that sits outside the content, so
          they're dropped rather than crammed in. */}
      <div aria-hidden className="hidden sm:block">
        <span className="corner-bracket left-5 top-20 border-l border-t" />
        <span className="corner-bracket right-5 top-20 border-r border-t" />
        <span className="corner-bracket bottom-5 left-5 border-b border-l" />
        <span className="corner-bracket bottom-5 right-5 border-b border-r" />
      </div>

      {(label || index) && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-24 z-30 hidden justify-between px-10 sm:flex"
        >
          <span className="micro text-accent/70">{label}</span>
          <span className="micro text-smoke">{index}</span>
        </div>
      )}

      {children}
    </div>
  );
}
