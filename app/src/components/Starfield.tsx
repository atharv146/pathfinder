"use client";

/**
 * Fixed starfield layer behind the whole site. Positions/delays are a fixed
 * seeded list (not Math.random() at render time) so server and client markup
 * match — a real Next.js hydration mismatch otherwise.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1337);

const STARS = Array.from({ length: 140 }, (_, i) => {
  const size = rand() < 0.82 ? 1 : rand() < 0.7 ? 1.5 : 2;
  return {
    id: i,
    x: rand() * 100,
    y: rand() * 100,
    size,
    baseOpacity: 0.15 + rand() * 0.35,
    twinkle: rand() < 0.22,
    duration: 3 + rand() * 5,
    delay: rand() * 6,
  };
});

export function Starfield() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {STARS.map((s) => (
          <circle
            key={s.id}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.size}
            fill="#fff"
            opacity={s.baseOpacity}
            className={s.twinkle ? "star-twinkle" : undefined}
            style={
              s.twinkle
                ? ({
                    "--star-base": s.baseOpacity,
                    "--star-peak": Math.min(s.baseOpacity + 0.45, 0.9),
                    animationDuration: `${s.duration}s`,
                    animationDelay: `${s.delay}s`,
                  } as React.CSSProperties)
                : undefined
            }
          />
        ))}
      </svg>
    </div>
  );
}
