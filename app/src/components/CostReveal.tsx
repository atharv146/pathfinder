"use client";

import { useState } from "react";
import { KineticText } from "@/components/KineticText";

/**
 * Sticker price vs. what families actually pay.
 *
 * ⚠️ CONTENT NOTE: the numbers here are ILLUSTRATIVE and the UI says so
 * plainly. They demonstrate the *mechanic* — that published price and net
 * price are different numbers, and that aid is usually income-scaled — without
 * claiming any specific school's figures. Anything school-specific has to come
 * from that school's own net price calculator, which the copy points to.
 *
 * This exists because "I saw the price and assumed it was impossible" is one
 * of the most common and most costly misreadings for this audience.
 */

const BANDS = [
  { label: "Under $50k", grantPct: 0.92 },
  { label: "$50k – $75k", grantPct: 0.8 },
  { label: "$75k – $110k", grantPct: 0.6 },
  { label: "$110k – $150k", grantPct: 0.38 },
  { label: "Over $150k", grantPct: 0.12 },
];

const STICKER = 82000;

export function CostReveal() {
  const [i, setI] = useState(0);
  const band = BANDS[i];
  const grant = Math.round(STICKER * band.grantPct);
  const net = STICKER - grant;
  const paidPct = 1 - band.grantPct;

  const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <section className="bone-surface relative overflow-hidden px-6 py-32 text-ink sm:px-10">
      <div className="relative mx-auto max-w-5xl">
        <p className="micro mb-4 text-ink/45">(09) &nbsp;The number that scares everyone</p>
        <KineticText as="h2" className="display mb-4 max-w-3xl text-4xl text-ink sm:text-6xl">
          The price on the website is almost never the price.
        </KineticText>
        <p className="mb-14 max-w-xl text-[0.95rem] leading-relaxed text-ink/70">
          Drag through the income bands. Aid at well-funded schools is scaled to what a family
          can pay — which is why the published number tells you very little on its own.
        </p>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <label className="micro mb-4 block text-ink/50" htmlFor="income-band">
              Household income
            </label>
            <input
              id="income-band"
              type="range"
              min={0}
              max={BANDS.length - 1}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              className="cost-range w-full"
            />
            <div className="mt-3 flex justify-between">
              {BANDS.map((b, idx) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setI(idx)}
                  className={`micro transition-colors ${
                    idx === i ? "text-ink" : "text-ink/35 hover:text-ink/70"
                  }`}
                >
                  {idx === i ? b.label : "·"}
                </button>
              ))}
            </div>

            {/* Proportional bar: grant vs. what the family actually pays. */}
            <div className="mt-12 h-14 w-full overflow-hidden rounded-sm border border-ink/15">
              <div className="flex h-full w-full">
                <div
                  className="flex items-center justify-end bg-ink/85 pr-3 transition-all duration-500 ease-out"
                  style={{ width: `${band.grantPct * 100}%` }}
                >
                  <span className="micro text-bone">grant</span>
                </div>
                <div
                  className="flex items-center pl-3 transition-all duration-500 ease-out"
                  style={{ width: `${paidPct * 100}%`, backgroundColor: "#ff7a4d" }}
                >
                  <span className="micro text-ink">you</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="micro text-ink/45">Published sticker price</p>
              <p className="display text-4xl text-ink/35 line-through sm:text-5xl">
                {fmt(STICKER)}
              </p>
            </div>
            <div>
              <p className="micro text-ink/45">Estimated grant aid (not a loan)</p>
              <p className="display text-4xl text-ink sm:text-5xl">{fmt(grant)}</p>
            </div>
            <div className="border-t border-ink/15 pt-8">
              <p className="micro text-ink/45">What this family would actually pay</p>
              <p className="display text-6xl tabular-nums text-ink sm:text-7xl">{fmt(net)}</p>
            </div>
          </div>
        </div>

        <p className="micro mt-14 max-w-2xl leading-relaxed text-ink/50">
          Illustrative only — these figures demonstrate how net price works, not any real
          school&rsquo;s aid. Every college is legally required to publish a net price calculator;
          that is the number that matters for your family.
        </p>
      </div>
    </section>
  );
}
