"use client";

/**
 * Boxed kinetic band, in the Zypsy mould: small dark cards riding a seamless
 * loop rather than oversized bare text. Smaller and tighter than the previous
 * version, which was reading as a giant word-salad stripe.
 *
 * The list is rendered twice and the track translates exactly -50%, which is
 * what makes the loop seamless — any other distance jumps visibly at the wrap.
 * The duplicate is aria-hidden so screen readers don't hear it twice.
 */
export function Marquee({
  items,
  duration = 34,
  reverse = false,
  pingpong = false,
  className = "",
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  /** Sweep left and back rather than wrapping — keeps every item readable. */
  pingpong?: boolean;
  className?: string;
}) {
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center gap-2.5 pr-2.5" aria-hidden={hidden}>
      {items.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="flex h-[5.5rem] min-w-[13.5rem] items-center justify-center whitespace-nowrap rounded-sm bg-panel px-10 text-[0.95rem] font-semibold tracking-tight text-chalk"
        >
          {t}
        </span>
      ))}
    </div>
  );

  return (
    // Full-bleed: escapes any parent max-width so the band runs edge to edge
    // the way the Zypsy logo strip does.
    <div
      className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-5 ${
        reverse ? "marquee-reverse" : ""
      } ${pingpong ? "marquee-pingpong" : ""} ${className}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >

      {/* Ping-pong doesn't wrap, so it needs a single row — a duplicate would
          just be dead space it sweeps across. */}
      <div className="marquee-track">
        <Row />
        {!pingpong && <Row hidden />}
      </div>
    </div>
  );
}
