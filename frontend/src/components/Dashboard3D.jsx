import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animateDashboardEntrance } from '../animations/dashboardAnimations';
import DashboardCard from './DashboardCard';
import { ArrowDown, Sparkles, Disc, Shield, Wrench, Eye } from 'lucide-react';
import vehiclesImg from '../assets/images/vehicles.jpg';
import partsImg from '../assets/images/parts.jpg';
import serviceImg from '../assets/images/service.jpg';
import showroomImg from '../assets/images/showroom.jpg';

/**
 * Three.js 3D Automotive Showroom Stage Component
 * Renders an illuminated dark automotive showroom with reflective grid and wireframe hypercar halo
 */
function Showroom3DBackdrop({ mousePos }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const particlesRef = useRef();

  // Subtle floating particle field
  const particleCount = 70;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = Math.random() * 8 - 2;
      pos[i + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.15;
    }
    if (groupRef.current) {
      // Subtle 3D camera responder to mouse position
      const targetX = mousePos.current.x * 0.4;
      const targetY = mousePos.current.y * 0.2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.04);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient and Directional Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
      <spotLight 
        position={[0, 8, 2]} 
        intensity={2.5} 
        color="#bef264" 
        angle={0.6} 
        penumbra={0.8} 
      />

      {/* Holographic Wireframe Showcase Halo */}
      <group ref={ringRef} position={[0, -0.5, -4]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.8, 3.95, 64]} />
          <meshBasicMaterial color="#bef264" opacity={0.35} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.2, 4.25, 48]} />
          <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={THREE.DoubleSide} />
        </mesh>

        {/* Abstract Stylized Automotive Silhouette Prism */}
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[1.8, 0.8, 4, 1, true]} />
          <meshStandardMaterial 
            color="#1e2430" 
            metalness={0.9} 
            roughness={0.2} 
            wireframe 
            emissive="#bef264" 
            emissiveIntensity={0.25}
          />
        </mesh>
      </group>

      {/* Floating Volumetric Specular Particles */}
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
          size={0.06}
          color="#bef264"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dark Reflective Grid Floor */}
      <gridHelper 
        args={[30, 30, '#bef264', '#151921']} 
        position={[0, -2, -2]} 
      />
    </group>
  );
}

export default function Dashboard3D({ onNavigateSection }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);

  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Run GSAP entrance animation for dashboard elements
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current].filter(Boolean);
    const anim = animateDashboardEntrance(titleRef.current, subtitleRef.current, cards);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (anim) anim.kill();
    };
  }, []);

  const handleCardClick = (sectionId) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="carcraft-dashboard"
      ref={containerRef}
      className="relative w-full min-h-screen py-24 md:py-32 px-6 md:px-12 bg-[#08090b] flex flex-col items-center justify-center overflow-hidden perspective-container"
    >
      {/* 3D WebGL Canvas Layer (Three.js / React Three Fiber) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
        <Canvas 
          camera={{ position: [0, 1, 6], fov: 50 }} 
          gl={{ antialias: true, alpha: true }}
        >
          <Showroom3DBackdrop mousePos={mousePos} />
        </Canvas>
      </div>

      {/* Dark Ambient Gradient Layer to Blend with Surrounding Sections */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(190, 242, 100, 0.08) 0%, rgba(8, 10, 14, 0.6) 60%, #08090b 100%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Top Status & Telemetry Strip */}
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs font-mono text-[#bef264] uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
          CARCRAFT DIGITAL COMMAND // SHOWROOM DOCKED
        </div>

        {/* Dashboard Hero Header */}
        <div className="text-center mb-14 md:mb-18 max-w-3xl">
          <h2 
            ref={titleRef}
            className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase leading-none drop-shadow-2xl"
          >
            CARCRAFT
          </h2>
          <p 
            ref={subtitleRef}
            className="mt-3 text-lg sm:text-2xl md:text-3xl font-light font-display tracking-widest text-[#cbd5e1] uppercase"
          >
            YOUR AUTOMOTIVE EXPERIENCE.
          </p>
          <p className="mt-3 text-sm md:text-base font-body text-[#94a3b8] max-w-xl mx-auto">
            Everything your vehicle needs, in one place.
          </p>
        </div>

        {/* Asymmetrical 3D Dashboard Service Grid */}
        <div className="w-full flex flex-col gap-6 md:gap-8">
          
          {/* CARD 1: VEHICLES (Hero Large Card) */}
          <div className="w-full">
            <DashboardCard
              cardRef={card1Ref}
              layout="hero"
              badge="Flagship Inventory"
              tagline="Hypercars & Electric GTs"
              title="EXPLORE VEHICLES"
              subtitle="Discover hand-crafted hypercars, high-performance EVs, and track weapons engineered for the future of motion."
              buttonText="EXPLORE VEHICLES"
              image={vehiclesImg}
              metrics={[
                { label: 'QUICKEST', value: '1.88s (0-60)' },
                { label: 'IN STOCK', value: '148 UNITS' },
                { label: 'TOP SPEED', value: '236 MPH' }
              ]}
              onClick={() => handleCardClick('vehicles-section')}
            />
          </div>

          {/* 2-Column Middle Row: PARTS & SERVICE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
            {/* CARD 2: PARTS & ACCESSORIES */}
            <DashboardCard
              cardRef={card2Ref}
              layout="medium"
              badge="OEM & Performance"
              tagline="Pre-Preg Carbon & Forged Alloys"
              title="PARTS & ACCESSORIES"
              subtitle="Upgrade, maintain and personalize your vehicle with carbon-ceramic brakes, twin-scroll turbos, and aerodynamic splitters."
              buttonText="SHOP PARTS"
              image={partsImg}
              metrics={[
                { label: 'CATALOG', value: '420+ ITEMS' },
                { label: 'WARRANTY', value: 'LIFETIME OEM' }
              ]}
              onClick={() => handleCardClick('parts-section')}
            />

            {/* CARD 3: SERVICE */}
            <DashboardCard
              cardRef={card3Ref}
              layout="medium"
              badge="Certified Bay"
              tagline="800V EV & Dyno Tuning"
              title="BOOK A SERVICE"
              subtitle="Professional automotive service whenever you need it. 120-point digital telemetry diagnostics and master technician care."
              buttonText="BOOK SERVICE"
              image={serviceImg}
              metrics={[
                { label: 'DIAGNOSTICS', value: '120-POINT' },
                { label: 'BAY STATUS', value: 'AVAILABLE NOW' }
              ]}
              onClick={() => handleCardClick('service-section')}
            />
          </div>

          {/* CARD 4: SHOWROOM (Wide Bottom Card) */}
          <div className="w-full">
            <DashboardCard
              cardRef={card4Ref}
              layout="wide"
              badge="Interactive 3D Virtual Tour"
              tagline="Real-Time 360° Studio"
              title="CARCRAFT SHOWROOM"
              subtitle="Explore the CARCRAFT showroom experience. Walk the virtual gallery, customize lighting, and inspect aerodynamic chassis."
              buttonText="EXPLORE SHOWROOM"
              image={showroomImg}
              metrics={[
                { label: 'STUDIO', value: '360° REALTIME 3D' },
                { label: 'LOCATIONS', value: 'GLOBAL FLAGSHIPS' }
              ]}
              onClick={() => handleCardClick('showroom-section')}
            />
          </div>

        </div>

        {/* Scroll Continuation Indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-[#94a3b8] text-xs font-mono tracking-widest uppercase">
          <span>CONTINUE TO MARKETPLACE</span>
          <ArrowDown size={16} className="text-[#bef264] animate-bounce" />
        </div>

      </div>
    </section>
  );
}
