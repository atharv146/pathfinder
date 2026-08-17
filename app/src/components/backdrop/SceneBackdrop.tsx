"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export type BackdropVariant =
  | "grid"
  | "sheets"
  | "swarm"
  | "orbits"
  | "strata";

/**
 * Per-route 3D background.
 *
 * Deliberately four genuinely different geometries rather than one scene in
 * four colours — the brief was that each page should feel like its own place.
 *
 *   grid   — a digital terrain of instanced blocks rolling on a sine field
 *   sheets — drifting planes, like pages caught mid-air
 *   swarm  — a particle field that leans toward the cursor
 *   orbits — nested tilted rings turning at different rates (/major)
 *   strata — stacked drifting rows, like years of a transcript (/stats)
 *
 * All of them use InstancedMesh: one draw call for hundreds of objects, which
 * is what makes this affordable as a *background* rather than the main event.
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

/**
 * Nested rings, each tilted differently and turning at its own rate.
 *
 * Chosen for /major specifically: the page is about one shared roadmap seen
 * through eight different lenses, and concentric rings around a common centre
 * is that idea as geometry — separate paths, same origin. It also reads as
 * distinct from the other three at a glance, which is the actual requirement.
 *
 * One InstancedMesh for every dot across every ring, so the whole thing is a
 * single draw call regardless of ring count.
 */
function Orbits({ color }: { color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const RINGS = 5;
  const PER_RING = 64;
  const count = RINGS * PER_RING;

  const rings = useMemo(
    () =>
      Array.from({ length: RINGS }, (_, i) => ({
        radius: 2.4 + i * 1.35,
        // Alternating tilt direction stops the set reading as one solid dome.
        tilt: 0.5 + i * 0.16 * (i % 2 === 0 ? 1 : -1),
        yaw: i * 0.42,
        // Outer rings turn slower — the parallax that makes it read as depth.
        speed: 0.16 - i * 0.022,
        size: 0.075 - i * 0.007,
      })),
    []
  );

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime;

    let i = 0;
    for (let r = 0; r < RINGS; r++) {
      const ring = rings[r];
      const cosT = Math.cos(ring.tilt);
      const sinT = Math.sin(ring.tilt);
      const cosY = Math.cos(ring.yaw);
      const sinY = Math.sin(ring.yaw);

      for (let p = 0; p < PER_RING; p++) {
        const a = (p / PER_RING) * Math.PI * 2 + t * ring.speed;
        const x0 = Math.cos(a) * ring.radius;
        const z0 = Math.sin(a) * ring.radius;

        // Tilt about X, then yaw about Y. Written out rather than using
        // Object3D.rotation so the ring can stay a flat circle in its own
        // frame while the instance itself needs no orientation at all.
        const y1 = -z0 * sinT;
        const z1 = z0 * cosT;

        dummy.position.set(x0 * cosY + z1 * sinY, y1, -x0 * sinY + z1 * cosY);
        dummy.scale.setScalar(ring.size);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} rotation={[0.22, 0, 0.1]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </instancedMesh>
  );
}

/**
 * Horizontal rows of dashes, stacked in depth, each row sliding at its own
 * rate and wrapping when it runs off the edge.
 *
 * Chosen for /stats: the page is a transcript — years stacked on years, each
 * one a row of separate pieces. Rows of segmented lines is that shape, and it
 * reads as clearly distinct from the other four at a glance, which is the
 * actual requirement for a per-page backdrop.
 *
 * Deliberately NOT a rising or filling motion. Nothing on this page may imply
 * a level being reached — the rows drift sideways and go nowhere, because the
 * one thing this component must never do is look like a progress meter for a
 * student's schedule.
 */
function Strata({ color }: { color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const ROWS = 11;
  const PER_ROW = 13;
  const count = ROWS * PER_ROW;
  const SPAN = 26; // wrap width, comfortably wider than the visible frame

  const segments = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const row = Math.floor(i / PER_ROW);
        return {
          row,
          // Uneven starting offsets and widths so rows never line up into a
          // grid — a transcript year isn't a tidy set of equal blocks.
          x0: ((i % PER_ROW) / PER_ROW) * SPAN + Math.sin(i * 3.7) * 0.8,
          width: 0.5 + Math.abs(Math.sin(i * 1.9)) * 1.5,
          // Alternating direction per row, slower toward the back.
          speed: (0.35 + (row % 4) * 0.13) * (row % 2 === 0 ? 1 : -1),
        };
      }),
    [count]
  );

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime;

    segments.forEach((s, i) => {
      // Positive modulo — JS `%` keeps the sign, which would teleport the
      // reversed rows off-screen instead of wrapping them.
      const x = (((s.x0 + t * s.speed) % SPAN) + SPAN) % SPAN - SPAN / 2;
      const y = (s.row - ROWS / 2) * 0.78;
      dummy.position.set(x, y, -s.row * 0.4);
      dummy.scale.set(s.width, 0.045, 0.045);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, count]}
      rotation={[0.16, -0.3, 0.05]}
    >
      <boxGeometry />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
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
      {variant === "orbits" && <Orbits color={color} />}
      {variant === "strata" && <Strata color={color} />}
      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
