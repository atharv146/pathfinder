/**
 * Visual blocks for guide articles.
 *
 * WHY THESE EXIST: several of these articles explain things that are genuinely
 * comparative or procedural — AP versus dual enrollment versus a community
 * college class, what a cold email to a professor actually looks like, the gap
 * between two tuition figures. Those are all things prose describes poorly and
 * a table, a bar, or a worked example shows instantly.
 *
 * ── THE RULE THAT MATTERS ────────────────────────────────────────────────
 * A visual here may only show something the article already establishes and
 * that was verified against a primary source. These are a rendering of
 * existing verified content, never a place to introduce a new figure that
 * skipped the article's own fact-checking. A chart makes a number look more
 * authoritative, which is exactly why an unverified one would do more damage
 * here than in a paragraph.
 *
 * Every variant is server-rendered and static — no client JS, no motion, no
 * canvas. These sit inside long-form reading, where the design system's calm
 * register applies.
 */

export type GuideVisualData =
  | {
      kind: "table";
      title?: string;
      note?: string;
      columns: string[];
      rows: { label: string; cells: string[] }[];
    }
  | {
      kind: "bars";
      title?: string;
      note?: string;
      unit?: string;
      items: { label: string; value: number; display: string; emphasis?: boolean }[];
    }
  | {
      kind: "steps";
      title?: string;
      note?: string;
      steps: { title: string; body: string }[];
    }
  | {
      kind: "example";
      title?: string;
      note?: string;
      /** Rendered as a document-ish block — an email, a note, a snippet. */
      lines: { text: string; muted?: boolean }[];
      /** Why each part is there. The annotations are the teaching, not the sample. */
      annotations?: string[];
    };

export function GuideVisual({ data }: { data: GuideVisualData }) {
  return (
    // Breaks out modestly wider than the prose column on large screens.
    // Body text is set narrow for readability; a six-column comparison table
    // constrained to that same measure is unreadable for the opposite reason.
    // The negative margins are clamped so this never reaches the viewport
    // edge, and are absent below `lg` where there is no room to give.
    <figure className="my-8 lg:-mx-20">
      {data.title && (
        <figcaption className="micro mb-3 text-accent">{data.title}</figcaption>
      )}

      {data.kind === "table" && <VisualTable data={data} />}
      {data.kind === "bars" && <VisualBars data={data} />}
      {data.kind === "steps" && <VisualSteps data={data} />}
      {data.kind === "example" && <VisualExample data={data} />}

      {data.note && (
        <p className="mt-3 text-[0.8rem] leading-relaxed text-smoke">
          {data.note}
        </p>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------------ */

function VisualTable({
  data,
}: {
  data: Extract<GuideVisualData, { kind: "table" }>;
}) {
  return (
    // Wide tables scroll inside their own container — the page body must never
    // scroll horizontally. Standing rule in this codebase.
    <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="px-4 py-3" />
            {data.columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-chalk"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r) => (
            <tr key={r.label} className="border-b border-line last:border-0">
              <th
                scope="row"
                className="whitespace-pre-line px-4 py-3.5 align-top text-[0.8rem] font-medium leading-relaxed text-smoke"
              >
                {r.label}
              </th>
              {r.cells.map((cell, i) => (
                <td
                  key={i}
                  className="px-4 py-3.5 align-top text-[0.85rem] leading-relaxed text-ash"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function VisualBars({
  data,
}: {
  data: Extract<GuideVisualData, { kind: "bars" }>;
}) {
  const max = Math.max(...data.items.map((i) => i.value), 1);

  return (
    <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <ul className="flex flex-col gap-4">
        {data.items.map((item) => {
          const pct = Math.max((item.value / max) * 100, 2);
          return (
            <li key={item.label}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="text-[0.85rem] leading-snug text-chalk">
                  {item.label}
                </span>
                <span
                  className={`font-mono text-[0.82rem] ${
                    item.emphasis ? "text-accent" : "text-ash"
                  }`}
                >
                  {item.display}
                </span>
              </div>
              {/* Width is the only encoding, and it's proportional to the real
                  value — no truncated axis, which is the usual way a bar chart
                  quietly lies. */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink-2">
                <div
                  className={`h-full rounded-full ${
                    item.emphasis ? "bg-accent" : "bg-line-bright"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {data.unit && (
        <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-widest text-smoke">
          {data.unit}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function VisualSteps({
  data,
}: {
  data: Extract<GuideVisualData, { kind: "steps" }>;
}) {
  return (
    <ol className="flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
      {data.steps.map((s, i) => (
        <li key={s.title} className="bg-panel p-5">
          <div className="flex gap-4">
            <span className="mt-0.5 font-mono text-[0.72rem] text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h4 className="display-md text-[1rem] text-chalk">{s.title}</h4>
              <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ash">
                {s.body}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------------ */

function VisualExample({
  data,
}: {
  data: Extract<GuideVisualData, { kind: "example" }>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="border-b border-line bg-ink-2 px-5 py-2.5">
        <span className="font-mono text-[0.68rem] uppercase tracking-widest text-smoke">
          Example
        </span>
      </div>
      <div className="bg-panel px-5 py-5">
        {data.lines.map((l, i) =>
          l.text === "" ? (
            <div key={i} className="h-3" />
          ) : (
            <p
              key={i}
              className={`text-[0.86rem] leading-relaxed ${
                l.muted ? "font-mono text-[0.76rem] text-smoke" : "text-chalk"
              }`}
            >
              {l.text}
            </p>
          )
        )}
      </div>
      {data.annotations && data.annotations.length > 0 && (
        <div className="border-t border-line bg-ink-2 px-5 py-4">
          <p className="micro mb-2.5 text-smoke">Why it works</p>
          <ul className="flex flex-col gap-2">
            {data.annotations.map((a) => (
              <li key={a} className="flex items-start gap-2.5">
                <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span className="text-[0.82rem] leading-relaxed text-ash">
                  {a}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
