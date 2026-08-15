"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export type BackdropVariant = "grid" | "sheets" | "swarm";

/**
 * Per-route 3D background.
 *
 * Deliberately three genuinely different geometries rather than one scene in
 * three colours — the brief was that each page should feel like its own place.
 *
 *   grid   — a digital terrain of instanced blocks rolling on a sine field
 *   sheets — drifting planes, like pages caught mid-air
 *   swarm  — a particle field that leans toward the cursor
 *
 * All three use InstancedMesh: one draw call for hundreds of objects, which is
 * what makes this affordable as a *background* rather than the main event.
 * Everything sits far back with low bloom so type stays the focus.
 */

const dummy = new THREE.Object3D();

function Grid({ color }: { color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const COLS = 26;
  const ROWS = 16;
  const count = COLS * ROWS;

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime;

    let i = 0;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        const px = (x - COLS / 2) * 0.85;
        const pz = (z - ROWS / 2) * 0.85;
        // Two offset waves so the field never looks like it's on a single beat.
        const h =
          Math.sin(px * 0.4 + t * 0.6) * 0.5 + Math.cos(pz * 0.5 - t * 0.45) * 0.5;
        dummy.position.set(px, h * 0.9 - 2.5, pz);
        dummy.scale.set(0.16, 0.16 + Math.abs(h) * 0.5, 0.16);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} rotation={[0.42, 0.5, 0]}>
      <boxGeometry />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </instancedMesh>
  );
}

function Sheets({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);

  const sheets = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        pos: [
          (Math.sin(i * 2.4) * 4.5),
          (Math.cos(i * 1.7) * 2.8),
          -i * 1.1,
        ] as [number, number, number],
        rot: [Math.sin(i) * 0.5, Math.cos(i) * 0.6, Math.sin(i * 3) * 0.25] as [
          number,
          number,
          number,
        ],
        speed: 0.1 + (i % 4) * 0.045,
      })),
    []
  );

  useFrame(({ clock, pointer }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.children.forEach((child, i) => {
      child.rotation.y = sheets[i].rot[1] + Math.sin(t * sheets[i].speed) * 0.4;
      child.rotation.x = sheets[i].rot[0] + Math.cos(t * sheets[i].speed * 0.8) * 0.2;
      child.position.y = sheets[i].pos[1] + Math.sin(t * sheets[i].speed + i) * 0.35;
    });
    g.rotation.y += (pointer.x * 0.18 - g.rotation.y) * 0.03;
    g.rotation.x += (-pointer.y * 0.12 - g.rotation.x) * 0.03;
  });

  return (
    <group ref={group}>
      {sheets.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <planeGeometry args={[2.6, 3.4]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.09}
            side={THREE.DoubleSide}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Swarm({ color }: { color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 340;

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 22,
        y: (Math.random() - 0.5) * 13,
        z: (Math.random() - 0.5) * 9,
        s: 0.02 + Math.random() * 0.055,
        drift: 0.2 + Math.random() * 0.7,
      })),
    []
  );

  useFrame(({ clock, pointer, viewport }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    const mx = (pointer.x * viewport.width) / 2;
    const my = (pointer.y * viewport.height) / 2;

    seeds.forEach((p, i) => {
      const bobY = p.y + Math.sin(t * p.drift + i) * 0.35;
      // Gentle lean toward the cursor — proximity-weighted so distant motes
      // stay put and the field doesn't move as one rigid sheet.
      const dx = mx - p.x;
      const dy = my - bobY;
      const d = Math.max(Math.hypot(dx, dy), 0.001);
      const pull = Math.min(1.6 / d, 0.55);

      dummy.position.set(p.x + dx * pull * 0.16, bobY + dy * pull * 0.16, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} transparent opacity={0.75} />
    </instancedMesh>
  );
}

export default function SceneBackdrop({
  variant,
  color,
}: {
  variant: BackdropVariant;
  color: string;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 11], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {variant === "grid" && <Grid color={color} />}
      {variant === "sheets" && <Sheets color={color} />}
      {variant === "swarm" && <Swarm color={color} />}
      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
