"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Small wireframe solids drifting through otherwise-empty space.
 *
 * Deliberately a *family* of shapes rather than one repeated form — an
 * icosahedron, an octahedron, a torus and a tetrahedron — so the site reads as
 * having a cast of recurring objects instead of one clip-art element pasted
 * around. Each one tumbles on its own axes at its own rate and bobs on its own
 * sine, so no two are ever in sync.
 *
 * Wireframe + low opacity keeps them clearly behind the type. They are pure
 * decoration: aria-hidden and pointer-transparent.
 */

type ShapeKind = "ico" | "octa" | "torus" | "tetra";

function Shape({
  kind,
  position,
  scale,
  spin,
  bob,
  color,
}: {
  kind: ShapeKind;
  position: [number, number, number];
  scale: number;
  spin: [number, number, number];
  bob: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.x += delta * spin[0];
    m.rotation.y += delta * spin[1];
    m.rotation.z += delta * spin[2];
    m.position.y = position[1] + Math.sin(clock.elapsedTime * bob + position[0]) * 0.45;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {kind === "ico" && <icosahedronGeometry args={[1, 0]} />}
      {kind === "octa" && <octahedronGeometry args={[1, 0]} />}
      {kind === "torus" && <torusGeometry args={[0.7, 0.26, 8, 24]} />}
      {kind === "tetra" && <tetrahedronGeometry args={[1.1, 0]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.34} />
    </mesh>
  );
}

// Fixed layout rather than Math.random() at render: a random scatter would
// differ between server and client and trip hydration, and would also reshuffle
// on every navigation.
const SHAPES: {
  kind: ShapeKind;
  position: [number, number, number];
  scale: number;
  spin: [number, number, number];
  bob: number;
}[] = [
  { kind: "ico", position: [-5.4, 1.8, -2], scale: 0.62, spin: [0.18, 0.26, 0], bob: 0.5 },
  { kind: "octa", position: [5.1, -1.4, -1.5], scale: 0.55, spin: [0.24, -0.2, 0.1], bob: 0.62 },
  { kind: "torus", position: [-3.8, -2.6, -3], scale: 0.5, spin: [-0.3, 0.22, 0.14], bob: 0.44 },
  { kind: "tetra", position: [4.2, 2.5, -2.6], scale: 0.6, spin: [0.2, 0.3, -0.16], bob: 0.55 },
  { kind: "ico", position: [0.6, 3.1, -4], scale: 0.4, spin: [-0.22, 0.18, 0.2], bob: 0.7 },
  { kind: "octa", position: [-1.4, -3.2, -3.4], scale: 0.44, spin: [0.26, 0.14, -0.22], bob: 0.5 },
];

function Field({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);

  // Whole field leans with the pointer, which gives the scattered shapes a
  // shared parallax and stops them feeling like unrelated stickers.
  useFrame(({ pointer }, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.pow(0.004, delta);
    g.rotation.y += (pointer.x * 0.16 - g.rotation.y) * k;
    g.rotation.x += (-pointer.y * 0.12 - g.rotation.x) * k;
  });

  return (
    <group ref={group}>
      {SHAPES.map((s, i) => (
        <Shape key={i} {...s} color={color} />
      ))}
    </group>
  );
}

export default function FloatingShapes({ color = "#f4f3f0" }: { color?: string }) {
  const dpr = useMemo<[number, number]>(() => [1, 1.4], []);
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Field color={color} />
    </Canvas>
  );
}
