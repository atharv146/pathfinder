"use client";

import { useEffect, useRef } from "react";

/**
 * A generative dot-grid canvas — replaces the blurred gradient-blob glow,
 * which reads as a generic AI-hero cliché on its own. Dots drift and pulse
 * subtly, giving real technical/digital texture (closer to what shows up on
 * higher-craft studio sites) instead of a soft blur. Static single frame if
 * prefers-reduced-motion is set.
 */
export function DotField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; r: number; phase: number; hue: "amber" | "signal" }[] = [];

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.scale(dpr, dpr);

      const gap = 34;
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      dots = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Sparse — not every grid point gets a dot, so it reads as a
          // scattered field rather than a rigid grid.
          if (Math.random() > 0.55) continue;
          dots.push({
            x: i * gap + (Math.random() - 0.5) * 10,
            y: j * gap + (Math.random() - 0.5) * 10,
            r: Math.random() * 1.2 + 0.4,
            phase: Math.random() * Math.PI * 2,
            hue: Math.random() > 0.85 ? "signal" : "amber",
          });
        }
      }
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const d of dots) {
        const pulse = reduceMotion ? 0.5 : 0.4 + 0.3 * Math.sin(t / 1800 + d.phase);
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fillStyle =
          d.hue === "signal"
            ? `rgba(94, 224, 208, ${pulse * 0.55})`
            : `rgba(245, 166, 35, ${pulse * 0.5})`;
        ctx!.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      draw(0);
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    function loop(t: number) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
