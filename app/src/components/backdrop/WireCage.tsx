"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Morphing wireframe cage — the shape behind Intrepid's closing headline.
 *
 * It's a hyperboloid built from *straight* lines: every segment connects a
 * point on the top circle to a point on the bottom circle, offset by a twist
 * angle. Animating that twist makes the whole form appear to inflate, pinch to
 * a waist, and open out again — a genuine morph with no vertex math and no
 * morph targets, just one number changing.
 *
 * Rendered as a single LineSegments (one draw call) so it stays cheap enough
 * to sit behind type.
 */
function Cage({ color, lines = 96 }: { color: string; lines?: number }) {
  const ref = useRef<THREE.LineSegments>(null);
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const positions = useMemo(() => new Float32Array(lines * 2 * 3), [lines]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Twist oscillates; at 0 it's a cylinder, near PI it pinches to a point.
    const twist = Math.sin(t * 0.22) * 1.5 + 1.5;
    const R = 2.6;
    const H = 3.4;

    for (let i = 0; i < lines; i++) {
      const a = (i / lines) * Math.PI * 2;
      const b = a + twist;

      positions[i * 6 + 0] = Math.cos(a) * R;
      positions[i * 6 + 1] = H;
      positions[i * 6 + 2] = Math.sin(a) * R;

      positions[i * 6 + 3] = Math.cos(b) * R;
      positions[i * 6 + 4] = -H;
      positions[i * 6 + 5] = Math.sin(b) * R;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.attributes.position.needsUpdate = true;

    if (ref.current) ref.current.rotation.y = t * 0.12;
  });

  return (
    <lineSegments ref={ref} geometry={geom}>
      <lineBasicMaterial color={color} transparent opacity={0.42} />
    </lineSegments>
  );
}

export default function WireCage({ color = "#f4f3f0" }: { color?: string }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 9.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Cage color={color} />
    </Canvas>
  );
}
