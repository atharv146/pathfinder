/**
 * Corner-pinned technical captions — the framing device used in the DOSS ARP
 * and SHAGA references, where small mono labels sit at the extreme edges of
 * the viewport and the centre is left almost empty. Purely typographic
 * chrome; carries no interactive behaviour.
 */
export function CornerLabels({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}: {
  topLeft?: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      {topLeft && (
        <span className="micro absolute left-8 top-6 text-smoke">{topLeft}</span>
      )}
      {topRight && (
        <span className="micro absolute right-8 top-6 text-smoke">{topRight}</span>
      )}
      {bottomLeft && (
        <span className="micro absolute bottom-6 left-8 text-smoke">{bottomLeft}</span>
      )}
      {bottomRight && (
        <span className="micro absolute bottom-6 right-8 text-smoke">{bottomRight}</span>
      )}
    </div>
  );
}
