'use client';

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const PALETTE = [
  new THREE.Color("#e8c8a0"),
  new THREE.Color("#d9a77f"),
  new THREE.Color("#c98b6a"),
  new THREE.Color("#a3b48f"),
  new THREE.Color("#efdcc0"),
  new THREE.Color("#f3e6d3"),
];

function Orb({
  position,
  scale,
  speed,
  color,
  intensity,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: THREE.Color;
  intensity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.6;
      ref.current.position.x = position[0] + Math.cos(t * 0.4) * 0.5;
      ref.current.rotation.y = t * 0.2;
      ref.current.rotation.z = Math.sin(t * 0.3) * 0.2;
    }
    if (light.current) {
      light.current.intensity = 2 + Math.sin(t * 0.8) * 1;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0.35}
          flatShading
        />
      </mesh>
      <pointLight ref={light} position={position} color={color} intensity={intensity} distance={14} decay={2} />
    </group>
  );
}

function AnchorCore() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.12;
      group.current.position.y = Math.sin(t * 0.5) * 0.25;
    }
    if (inner.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.06;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh ref={inner}>
        <sphereGeometry args={[1.1, 48, 48]} />
        <meshStandardMaterial
          color="#f5d9b0"
          emissive="#e8985f"
          emissiveIntensity={1.6}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.78, 64]} />
        <meshBasicMaterial color="#f0d0aa" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.6, 0.3]}>
        <ringGeometry args={[2.1, 2.24, 64]} />
        <meshBasicMaterial color="#e8c9a8" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene() {
  const orbs = useMemo(() => {
    const data: {
      pos: [number, number, number];
      scale: number;
      speed: number;
      color: THREE.Color;
      intensity: number;
    }[] = [];
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 7;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 10;
      data.push({
        pos: [x, y, z],
        scale: 0.2 + Math.random() * 0.45,
        speed: 0.4 + Math.random() * 0.7,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)].clone(),
        intensity: 1.5 + Math.random() * 2,
      });
    }
    return data;
  }, []);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 6]} intensity={0.9} color="#fff4e6" />
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.1}>
        <AnchorCore />
      </Float>
      {orbs.map((o, i) => (
        <Orb
          key={i}
          position={o.pos}
          scale={o.scale}
          speed={o.speed}
          color={o.color}
          intensity={o.intensity}
        />
      ))}
      <Sparkles count={160} scale={[22, 14, 22]} size={3} speed={0.35} color="#e8c9a0" opacity={0.55} />
    </>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 13], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
