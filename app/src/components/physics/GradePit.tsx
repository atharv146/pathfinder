"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";

/**
 * Grades 6–12 as physical objects you can shove around.
 *
 * Numbers are drawn to a canvas and used as textures rather than rendered with
 * a 3D text helper — troika/Text3D want a font file fetched at runtime, and a
 * blocked or slow font request would leave blank blocks. A canvas texture has
 * no network dependency and always renders.
 */

const GRADES = [6, 7, 8, 9, 10, 11, 12];

function useNumberTextures() {
  return useMemo(() => {
    return GRADES.map((n) => {
      const size = 256;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d")!;

      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, size, size);

      // Emissive edge, matching the site's hairline-plus-glow language.
      ctx.strokeStyle = "rgba(127,212,198,0.85)";
      ctx.lineWidth = 5;
      ctx.strokeRect(10, 10, size - 20, size - 20);

      ctx.fillStyle = "#f4f3f0";
      ctx.font = "500 128px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(n), size / 2, size / 2 + 6);

      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "500 22px monospace";
      ctx.fillText("GRADE", size / 2, 48);

      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      return tex;
    });
  }, []);
}

/** Invisible sphere riding the pointer, shoving blocks out of the way. */
function Cursor() {
  const ref = useRef<RapierRigidBody>(null);
  const { viewport } = useThree();

  useFrame(({ pointer }) => {
    ref.current?.setNextKinematicTranslation({
      x: (pointer.x * viewport.width) / 2,
      y: (pointer.y * viewport.height) / 2,
      z: 0,
    });
  });

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders="ball" restitution={1.1}>
      <mesh visible={false}>
        <sphereGeometry args={[0.75, 16, 16]} />
      </mesh>
    </RigidBody>
  );
}

function Blocks({ shake }: { shake: number }) {
  const textures = useNumberTextures();
  const bodies = useRef<(RapierRigidBody | null)[]>([]);

  // Every bump of `shake` throws everything back up in the air.
  useEffect(() => {
    if (!shake) return;
    bodies.current.forEach((b) => {
      if (!b) return;
      b.applyImpulse(
        {
          x: (Math.random() - 0.5) * 14,
          y: 9 + Math.random() * 9,
          z: (Math.random() - 0.5) * 3,
        },
        true
      );
      b.applyTorqueImpulse(
        {
          x: (Math.random() - 0.5) * 1.6,
          y: (Math.random() - 0.5) * 1.6,
          z: (Math.random() - 0.5) * 1.6,
        },
        true
      );
    });
  }, [shake]);

  return (
    <>
      {GRADES.map((g, i) => (
        <RigidBody
          key={g}
          ref={(el) => {
            bodies.current[i] = el;
          }}
          colliders="cuboid"
          restitution={0.42}
          friction={0.7}
          linearDamping={0.12}
          angularDamping={0.22}
          position={[(i - 3) * 1.25, 3.5 + i * 1.4, (Math.random() - 0.5) * 0.6]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <mesh castShadow>
            <boxGeometry args={[1.1, 1.1, 0.28]} />
            {/* Face textures on front/back, dark sides. */}
            {[0, 1, 2, 3].map((k) => (
              <meshStandardMaterial
                key={k}
                attach={`material-${k}`}
                color="#0d0d10"
                roughness={0.6}
                metalness={0.1}
              />
            ))}
            <meshStandardMaterial
              attach="material-4"
              map={textures[i]}
              roughness={0.45}
              metalness={0.15}
            />
            <meshStandardMaterial
              attach="material-5"
              map={textures[i]}
              roughness={0.45}
              metalness={0.15}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

function Walls() {
  const { viewport } = useThree();
  const w = viewport.width / 2;
  const h = viewport.height / 2;

  return (
    <>
      {/* floor */}
      <CuboidCollider position={[0, -h - 0.5, 0]} args={[w + 4, 0.5, 6]} />
      {/* sides */}
      <CuboidCollider position={[-w - 0.5, 0, 0]} args={[0.5, h + 8, 6]} />
      <CuboidCollider position={[w + 0.5, 0, 0]} args={[0.5, h + 8, 6]} />
      {/* front/back, so blocks stay in a readable slab */}
      <CuboidCollider position={[0, 0, -1.2]} args={[w + 4, h + 8, 0.5]} />
      <CuboidCollider position={[0, 0, 1.2]} args={[w + 4, h + 8, 0.5]} />
    </>
  );
}

export default function GradePit({ shake }: { shake: number }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 12], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 8, 6]} intensity={2.2} />
      <pointLight position={[-6, -2, 4]} intensity={30} color="#7fd4c6" distance={20} />
      <pointLight position={[6, 2, 4]} intensity={22} color="#d46438" distance={20} />

      <Physics gravity={[0, -16, 0]}>
        <Blocks shake={shake} />
        <Walls />
        <Cursor />
      </Physics>
    </Canvas>
  );
}
