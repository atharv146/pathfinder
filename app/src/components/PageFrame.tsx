"use client";

import type { ReactNode } from "react";

export type Accent = "teal" | "lime" | "coral" | "violet";

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
      <div aria-hidden>
        <span className="corner-bracket left-5 top-20 border-l border-t" />
        <span className="corner-bracket right-5 top-20 border-r border-t" />
        <span className="corner-bracket bottom-5 left-5 border-b border-l" />
        <span className="corner-bracket bottom-5 right-5 border-b border-r" />
      </div>

      {(label || index) && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-24 z-30 flex justify-between px-10"
        >
          <span className="micro text-accent/70">{label}</span>
          <span className="micro text-smoke">{index}</span>
        </div>
      )}

      {children}
    </div>
  );
}
