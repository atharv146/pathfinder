"use client";

/**
 * The seven-year arc, with "you are here" marked.
 *
 * ⚠️ THIS IS NOT A PROGRESS BAR, and the distinction is the whole design.
 * A progress bar answers "how much of this have you completed", which for a
 * student who joined in 11th grade is a number that says *you are failing at
 * something you found out about yesterday*. This answers "where are you in the
 * journey", which has no wrong answer — a 6th grader at the start and a senior
 * near the end are both exactly where they should be.
 *
 * So: no percentage, no fill proportional to completion, no colour-coding of
 * "behind". Grades already passed are dimmed as history, the current grade is
 * marked, and what's ahead is drawn the same weight as what's behind.
 *
 * Plain inline SVG rather than WebGL — this sits above the fold on the main
 * roadmap page for every signed-in student, including on budget phones and
 * metered data, and it must never be the thing that fails to load.
 */

const GRADES = [6, 7, 8, 9, 10, 11, 12];

export function JourneyArc({
  grade,
  doneThisYear,
  totalThisYear,
}: {
  grade: number;
  doneThisYear: number;
  totalThisYear: number;
}) {
  const W = 640;
  const H = 96;
  const padX = 26;
  const span = W - padX * 2;

  // A shallow arc — enough to read as a path rather than a ruler, not so much
  // that the endpoints feel like a climb.
  const y = (i: number) => {
    const t = i / (GRADES.length - 1);
    return 62 - Math.sin(t * Math.PI) * 22;
  };
  const x = (i: number) => padX + (span * i) / (GRADES.length - 1);

  const path = GRADES.map(
    (_, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(i).toFixed(1)}`
  ).join(" ");

  const currentIndex = Math.max(0, GRADES.indexOf(grade));

  return (
    <figure className="mt-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Grade ${grade} of the 6 to 12 roadmap. ${doneThisYear} of ${totalThisYear} items marked done this year.`}
      >
        {/* The whole arc, drawn at one weight — the future is not lesser. */}
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          className="text-line-bright"
          strokeWidth={1.25}
          strokeLinecap="round"
        />

        {GRADES.map((g, i) => {
          const isCurrent = g === grade;
          const isPast = i < currentIndex;
          return (
            <g key={g}>
              <circle
                cx={x(i)}
                cy={y(i)}
                r={isCurrent ? 7 : 3.5}
                className={
                  isCurrent
                    ? "fill-accent"
                    : isPast
                      ? "fill-smoke"
                      : "fill-line-bright"
                }
              />
              {isCurrent && (
                <circle
                  cx={x(i)}
                  cy={y(i)}
                  r={13}
                  fill="none"
                  className="stroke-accent"
                  strokeWidth={1}
                  opacity={0.5}
                />
              )}
              <text
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                className={`fill-current text-[13px] ${
                  isCurrent ? "text-chalk" : isPast ? "text-smoke" : "text-ash"
                }`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {g}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-1 text-[0.82rem] leading-relaxed text-smoke">
        You&rsquo;re in grade {grade}.{" "}
        {totalThisYear > 0 && (
          <>
            {doneThisYear} of {totalThisYear} things ticked off this year.{" "}
          </>
        )}
        Starting later isn&rsquo;t starting behind — the roadmap is built to be
        picked up at any point.
      </figcaption>
    </figure>
  );
}
