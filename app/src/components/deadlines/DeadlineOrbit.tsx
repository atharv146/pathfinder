"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/**
 * Orrery clock. Each deadline is a ring, and a marker rides that ring at the
 * fraction of the year already elapsed toward it — so the whole thing reads as
 * one instrument where you can see how close each date is at a glance.
 *
 * Ring colour is driven by urgency rather than being decorative: teal when
 * there's time, amber inside ~60 days, red inside ~14. That means the object
 * is showing real data, not just spinning.
 */

const URGENT = new THREE.Color("#ff4d4d");
const SOON = new THREE.Color("#ffb02e");
const CALM = new THREE.Color("#7fd4c6");

function urgencyColor(days: number) {
  if (days <= 14) return URGENT;
  if (days <= 60) return SOON;
  return CALM;
}

function Ring({
  radius,
  progress,
  days,
  speed,
}: {
  radius: number;
  progress: number;
  days: number;
  speed: number;
}) {
  const marker = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const color = useMemo(() => urgencyColor(days), [days]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = t * speed;
      // Slow breathing tilt — the ring plane itself shifts, so the assembly
      // keeps changing silhouette instead of spinning as a rigid object.
      group.current.rotation.x = Math.sin(t * 0.18 + radius) * 0.45;
      group.current.rotation.y = Math.cos(t * 0.13 + radius) * 0.38;
    }
    if (marker.current) {
      // Marker sits at the elapsed fraction, measured from 12 o'clock.
      const a = -Math.PI / 2 + progress * Math.PI * 2;
      marker.current.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    }
  });

  return (
    <group ref={group}>
      {/* Full track, dim */}
      <mesh>
        <torusGeometry args={[radius, 0.011, 8, 180]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} />
      </mesh>
      {/* Elapsed arc, bright — thetaLength maps directly to progress */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[radius, 0.024, 8, 180, Math.max(progress, 0.001) * Math.PI * 2]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      <mesh ref={marker}>
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function Hub() {
  const ref = useRef<THREE.LineSegments>(null);
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 0)),
    []
  );
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.3;
      ref.current.rotation.x += d * 0.16;
    }
  });
  return (
    <lineSegments ref={ref} geometry={edges}>
      <lineBasicMaterial color="#f4f3f0" transparent opacity={0.6} />
    </lineSegments>
  );
}

/**
 * The rings used to sit coplanar on a slight tilt, which read as a flat 2D
 * dial — correct criticism. Now each ring is tipped onto its own axis like a
 * gyroscope, and the whole assembly rotates and leans toward the pointer, so
 * the depth is real and legible from any angle.
 */
function Gyro({ rings }: { rings: { progress: number; days: number }[] }) {
  const g = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }, delta) => {
    if (!g.current) return;
    g.current.rotation.y = clock.elapsedTime * 0.16;
    // Damped lean toward the cursor, on top of the constant spin.
    const targetX = 0.28 - pointer.y * 0.3;
    const k = 1 - Math.pow(0.002, delta);
    g.current.rotation.x += (targetX - g.current.rotation.x) * k;
  });

  return (
    <group ref={g}>
      <Hub />
      {rings.map((r, i) => (
        // Each ring gets a distinct tilt — this is what makes it read as a
        // three-dimensional armillary rather than concentric circles.
        <group
          key={i}
          rotation={[
            (i % 2 === 0 ? 1 : -1) * (0.34 + i * 0.22),
            i * 0.5,
            (i % 3) * 0.28,
          ]}
        >
          <Ring
            radius={1.15 + i * 0.58}
            progress={r.progress}
            days={r.days}
            speed={0.05 + i * 0.018}
          />
        </group>
      ))}
    </group>
  );
}

export default function DeadlineOrbit({
  rings,
}: {
  rings: { progress: number; days: number }[];
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5.6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Gyro rings={rings} />
      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
