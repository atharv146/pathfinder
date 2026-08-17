"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { KineticText } from "@/components/KineticText";
import { Magnetic } from "@/components/Magnetic";
import { useWebglAllowed } from "@/lib/useWebglGate";

const WireCage = dynamic(() => import("./backdrop/WireCage"), { ssr: false });

/**
 * Closing statement over the morphing wire cage — huge type sitting *inside*
 * the 3D form rather than beside it, which is what gives the Intrepid closer
 * its scale.
 */
export function ClosingWire() {
  const can3D = useWebglAllowed("content");

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden border-t border-line px-6 sm:px-10">
      {/* Oversized on purpose: the cage should read as the environment the
          headline sits inside, not as a decorative object beside it. Scaled
          past the section bounds so its edges leave frame. */}
      {can3D && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[190%] w-[150%] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
          data-decor
        >
          <WireCage />
        </div>
      )}

      <div className="relative text-center">
        <KineticText as="h2" className="display text-6xl text-chalk sm:text-8xl">
          Ready when you are.
        </KineticText>

        <div className="mt-12">
          <Magnetic>
            <Link
              href="/roadmap"
              className="inline-block rounded-full bg-chalk px-10 py-4 text-sm font-semibold text-ink transition-colors hover:bg-white"
            >
              Start your roadmap
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
