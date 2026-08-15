"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/**
 * The hero's orbital object, rebuilt in real 3D.
 *
 * This is the same motif as the flat SVG `OrbitField` — a wireframe core
 * inside hairline orbit rings — but with real depth, perspective and a
 * pointer-driven tilt, so it reads as an object in space rather than a
 * decal on the background. Palette is deliberately held to the existing
 * monochrome + single `signal` accent; the bloom is kept low so the
 * hairlines glow rather than blow out.
 */

const WHITE = "#f4f3f0";
const SIGNAL = "#7fd4c6";

function OrbitRing({
  radius,
  rotation,
  opacity,
  speed,
}: {
  radius: number;
  rotation: [number, number, number];
  opacity: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.013, 10, 220]} />
      <meshBasicMaterial color={WHITE} transparent opacity={opacity} />
    </mesh>
  );
}

function Node({
  radius,
  speed,
  size,
  color,
  tilt,
  offset,
}: {
  radius: number;
  speed: number;
  size: number;
  color: string;
  tilt: [number, number, number];
  offset: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });

  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

function Core() {
  const ref = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);

  // A live, deforming geometry — not EdgesGeometry, which is baked once and
  // can never move. Base vertex positions are kept so each frame can displace
  // them along their own direction, which is what actually makes the solid
  // change shape rather than just spin.
  const { geo, base } = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.72, 2);
    return { geo: g, base: Float32Array.from(g.attributes.position.array) };
  }, []);

  useFrame(({ clock }, delta) => {
    if (ref.current) {
      // Fast enough to read as motion at a glance. The previous 0.14 rad/s was
      // ~8°/sec, which is genuinely hard to perceive.
      ref.current.rotation.y += delta * 0.55;
      ref.current.rotation.x += delta * 0.24;
    }

    const g = wire.current?.geometry as THREE.BufferGeometry | undefined;
    if (!g) return;
    const pos = g.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;

    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i], y = base[i + 1], z = base[i + 2];
      // Three offset waves keyed to the vertex's own position — the surface
      // ripples and bulges instead of pulsing uniformly.
      const n =
        Math.sin(x * 3.1 + t * 1.1) * 0.5 +
        Math.sin(y * 2.7 - t * 0.9) * 0.5 +
        Math.sin(z * 3.4 + t * 1.3) * 0.5;
      const k = 1 + n * 0.16;
      pos[i] = x * k;
      pos[i + 1] = y * k;
      pos[i + 2] = z * k;
    }
    g.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={ref}>
      <mesh ref={wire} geometry={geo}>
        <meshBasicMaterial color={WHITE} wireframe transparent opacity={0.85} />
      </mesh>
      {/* Inner occluder, kept well inside the wireframe's minimum radius.
          At 0.94 it was ABOVE the deformed surface's troughs — the wireframe
          contracts up to 16% — so the black shell kept punching through the
          lines and the whole core read as a dark blob mid-rotation. 0.72 sits
          below the trough, so it only ever hides the far side. */}
      <mesh scale={0.72}>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshBasicMaterial color="#050506" />
      </mesh>
    </group>
  );
}

function Rig() {
  const ref = useRef<THREE.Group>(null);

  // Pointer parallax, damped — the object leans toward the cursor instead of
  // snapping, which is what separates "reactive" from "twitchy".
  useFrame(({ pointer }, delta) => {
    if (!ref.current) return;
    const targetY = pointer.x * 0.34;
    const targetX = -pointer.y * 0.24;
    const k = 1 - Math.pow(0.0015, delta);
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * k;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * k;
  });

  return (
    <group ref={ref}>
      <group rotation={[0.42, 0, 0.12]}>
        <Core />
        <OrbitRing radius={1.5} rotation={[Math.PI / 2, 0, 0]} opacity={0.75} speed={0.22} />
        <OrbitRing radius={1.5} rotation={[Math.PI / 2, 0.95, 0]} opacity={0.62} speed={-0.19} />
        <OrbitRing radius={1.12} rotation={[Math.PI / 2.6, 0.4, 0.5]} opacity={0.55} speed={0.28} />
        <OrbitRing radius={1.92} rotation={[Math.PI / 2.2, -0.5, 0]} opacity={0.45} speed={-0.15} />

        <Node radius={1.5} speed={0.36} size={0.032} color={WHITE} tilt={[0, 0, 0]} offset={0} />
        <Node radius={1.5} speed={0.3} size={0.026} color={SIGNAL} tilt={[0, 0.95, 0]} offset={2.1} />
        <Node radius={1.92} speed={0.22} size={0.02} color={WHITE} tilt={[0.35, -0.5, 0]} offset={4.2} />
      </group>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      // Cap DPR — retina at full resolution is the single biggest cost here and
      // is not visually necessary for hairline geometry.
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Rig />
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.18} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
