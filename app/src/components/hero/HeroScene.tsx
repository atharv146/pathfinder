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
      <torusGeometry args={[radius, 0.0055, 8, 220]} />
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

  // Wireframe edges rather than a wireframe material — edges give clean single
  // hairlines instead of triangulation noise across every face.
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.62, 1)),
    []
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.14;
    ref.current.rotation.x += delta * 0.05;
  });

  return (
    <group ref={ref}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={WHITE} transparent opacity={0.55} />
      </lineSegments>
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.85} />
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
        <OrbitRing radius={1.5} rotation={[Math.PI / 2, 0, 0]} opacity={0.3} speed={0.05} />
        <OrbitRing radius={1.5} rotation={[Math.PI / 2, 0.95, 0]} opacity={0.2} speed={-0.04} />
        <OrbitRing radius={1.12} rotation={[Math.PI / 2.6, 0.4, 0.5]} opacity={0.16} speed={0.07} />
        <OrbitRing radius={1.92} rotation={[Math.PI / 2.2, -0.5, 0]} opacity={0.11} speed={-0.03} />

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
