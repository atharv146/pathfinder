"use client";

/**
 * One hairline glyph per major family.
 *
 * Hand-drawn inline SVG rather than an icon set, for two reasons. First, every
 * icon library on the market ships the same rounded-corner Feather look, which
 * is precisely the "generic AI template" read this project has already spent
 * several design passes escaping. Second, these are *geometry*, matching the
 * OrbitField / WireCage / JourneyArc language the rest of the site is built
 * from — one stroke weight, no fills, no rounded friendliness.
 *
 * Each is deliberately built from a different construction so the set reads as
 * eight distinct things at thumbnail size rather than eight variations:
 * orthogonal traces, a curve with handles, crossing ellipses, straight diagonal
 * segments, stacked arcs, and so on.
 *
 * `active` drives the animation. The whole set uses CSS transitions rather than
 * GSAP: these mount and unmount as the user clicks between families, and a
 * tween library re-initialising on every switch is more machinery than a
 * stroke-dash change needs.
 */

const STROKE = 1.15;

export function MajorGlyph({
  id,
  active = false,
  className = "",
}: {
  id: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {GLYPHS[id]?.(active) ?? GLYPHS.fallback(active)}
    </svg>
  );
}

/** Shared: a dot that swells slightly when the family is selected. */
function Node({ x, y, active, r = 2 }: { x: number; y: number; active: boolean; r?: number }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={active ? r + 0.6 : r}
      fill="currentColor"
      stroke="none"
      className="transition-all duration-500"
    />
  );
}

const GLYPHS: Record<string, (active: boolean) => React.ReactNode> = {
  // Orthogonal traces — right angles only, nothing curved.
  "engineering-cs": (active) => (
    <>
      <path d="M8 14h10v10h12V14h10" />
      <path d="M8 34h14V24" />
      <path d="M30 34h10" />
      <Node x={8} y={14} active={active} />
      <Node x={40} y={14} active={active} />
      <Node x={8} y={34} active={active} />
      <Node x={40} y={34} active={active} />
      <rect
        x={20}
        y={20}
        width={8}
        height={8}
        className="origin-center transition-transform duration-700"
        style={{ transform: active ? "rotate(45deg)" : "rotate(0deg)" }}
      />
    </>
  ),

  // A trace that becomes a pulse — the only glyph with a sharp spike.
  "health-medicine": (active) => (
    <>
      <path d="M6 24h8l4-9 6 18 4-9h4" />
      <path d="M32 24h10" />
      <circle
        cx={24}
        cy={24}
        r={17}
        opacity={active ? 0.5 : 0.22}
        className="transition-opacity duration-500"
        strokeDasharray="3 6"
      />
      <Node x={42} y={24} active={active} />
    </>
  ),

  // A bezier with its control handles exposed — the pen tool, essentially.
  "arts-design": (active) => (
    <>
      <path d="M9 38C9 20 20 34 24 24S36 10 39 10" />
      <path d="M9 38 15 20" opacity={0.45} strokeDasharray="2 3" />
      <path d="M39 10 33 28" opacity={0.45} strokeDasharray="2 3" />
      <Node x={9} y={38} active={active} />
      <Node x={39} y={10} active={active} />
      <rect
        x={13}
        y={18}
        width={4}
        height={4}
        className="transition-opacity duration-500"
        opacity={active ? 1 : 0.5}
      />
      <rect
        x={31}
        y={26}
        width={4}
        height={4}
        className="transition-opacity duration-500"
        opacity={active ? 1 : 0.5}
      />
    </>
  ),

  // Stacked columns on an axis — the only glyph built from filled-ish blocks.
  business: (active) => (
    <>
      <path d="M8 38h32" />
      <rect x={12} y={28} width={6} height={10} />
      <rect
        x={21}
        y={active ? 18 : 22}
        width={6}
        height={active ? 20 : 16}
        className="transition-all duration-500"
      />
      <rect
        x={30}
        y={active ? 12 : 17}
        width={6}
        height={active ? 26 : 21}
        className="transition-all duration-500"
      />
      <path d="M10 18l8-6 8 4 10-9" opacity={0.4} />
      <Node x={38} y={7} active={active} r={1.6} />
    </>
  ),

  // Nested arcs meeting at a spine — pages, drawn as curves only.
  humanities: (active) => (
    <>
      <path d="M24 14v24" />
      <path d="M24 14C19 10 13 9 8 10v24c5-1 11 0 16 4" />
      <path d="M24 14c5-4 11-5 16-4v24c-5-1-11 0-16 4" />
      <path
        d="M12 18h7M12 24h7M29 18h7M29 24h7"
        opacity={active ? 0.6 : 0.25}
        className="transition-opacity duration-500"
      />
    </>
  ),

  // Straight diagonal segments between vertices — a graph, not a circuit.
  "social-sciences": (active) => (
    <>
      <path d="M24 9 10 20l5 17h18l5-17z" opacity={active ? 0.55 : 0.28} className="transition-opacity duration-500" />
      <path d="M24 9 15 37M24 9 33 37M10 20h28M10 20l23 17M38 20L15 37" opacity={0.5} />
      <Node x={24} y={9} active={active} />
      <Node x={10} y={20} active={active} />
      <Node x={38} y={20} active={active} />
      <Node x={15} y={37} active={active} />
      <Node x={33} y={37} active={active} />
    </>
  ),

  // Crossing ellipses — the only glyph made of rotated curves.
  "natural-sciences": (active) => (
    <>
      <g
        className="origin-center transition-transform duration-[1200ms] ease-out"
        style={{ transform: active ? "rotate(30deg)" : "rotate(0deg)" }}
      >
        <ellipse cx={24} cy={24} rx={16} ry={6.5} />
        <ellipse cx={24} cy={24} rx={16} ry={6.5} transform="rotate(60 24 24)" />
        <ellipse cx={24} cy={24} rx={16} ry={6.5} transform="rotate(120 24 24)" />
      </g>
      <Node x={24} y={24} active={active} r={2.4} />
    </>
  ),

  // A flat plane in perspective with an upright — board and desk.
  education: (active) => (
    <>
      <path d="M24 10 42 18 24 26 6 18z" />
      <path d="M12 21v9c0 3 5.5 5 12 5s12-2 12-5v-9" opacity={active ? 0.85 : 0.4} className="transition-opacity duration-500" />
      <path
        d="M40 19v10"
        className="transition-transform duration-700"
        style={{ transform: active ? "translateY(2px)" : "translateY(0)" }}
      />
      <Node x={40} y={30} active={active} r={1.8} />
    </>
  ),

  fallback: (active) => (
    <>
      <circle cx={24} cy={24} r={15} strokeDasharray="4 5" opacity={0.6} />
      <Node x={24} y={24} active={active} r={2.4} />
    </>
  ),
};
