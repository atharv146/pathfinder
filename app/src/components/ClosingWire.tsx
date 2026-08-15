"use client";

import { shouldRender3D } from "@/lib/motion";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { KineticText } from "@/components/KineticText";
import { Magnetic } from "@/components/Magnetic";

const WireCage = dynamic(() => import("./backdrop/WireCage"), { ssr: false });

/**
 * Closing statement over the morphing wire cage — huge type sitting *inside*
 * the 3D form rather than beside it, which is what gives the Intrepid closer
 * its scale.
 */
export function ClosingWire() {
  const [can3D, setCan3D] = useState(false);

  useEffect(() => {
    if (!shouldRender3D()) return;
    try {
      const c = document.createElement("canvas");
      setCan3D(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setCan3D(false);
    }
  }, []);

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden border-t border-line px-6 sm:px-10">
      {can3D && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
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
