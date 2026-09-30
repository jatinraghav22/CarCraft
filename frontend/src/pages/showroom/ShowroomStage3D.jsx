import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function TurntableScene({ accentColor = '#bef264', isRotating = true, speed = 0.5 }) {
  const podiumRef = useRef();
  const ringRef = useRef();
  const particlesRef = useRef();

  const particleCount = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3.5 + Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      pos[i] = Math.cos(angle) * radius;
      pos[i + 1] = (Math.random() - 0.2) * 4.5;
      pos[i + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (isRotating && podiumRef.current) {
      podiumRef.current.rotation.y += delta * 0.12 * speed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <>
      {/* Dynamic Studio Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-5, 4, -5]} intensity={0.8} color="#94a3b8" />
      <spotLight
        position={[0, 9, 2]}
        intensity={3.5}
        color={accentColor}
        angle={0.65}
        penumbra={0.85}
        distance={22}
      />

      {/* Floating Sparkles Vortex */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color={accentColor}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Ground Podium & Halos */}
      <group ref={podiumRef} position={[0, -1.8, 0]}>
        {/* Main Turntable Disk */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.8, 64]} />
          <meshStandardMaterial
            color="#090c12"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>

        {/* Outer Glowing Neon Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[4.75, 4.88, 64]} />
          <meshBasicMaterial
            color={accentColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Inner Tech Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[3.4, 3.48, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Rotating Tech Reticle */}
        <group ref={ringRef} position={[0, 0.04, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.25, 32]} />
            <meshBasicMaterial
              color={accentColor}
              side={THREE.DoubleSide}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      </group>

      {/* Studio Floor Grid */}
      <gridHelper
        args={[36, 36, accentColor, '#131822']}
        position={[0, -1.82, 0]}
      />
    </>
  );
}

export default function ShowroomStage3D({ accentColor = '#bef264', isRotating = true }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 2.4, 7.8], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <TurntableScene accentColor={accentColor} isRotating={isRotating} />
      </Canvas>
    </div>
  );
}
