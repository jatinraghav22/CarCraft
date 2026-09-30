import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Sliders, Layers, Compass, Shield } from 'lucide-react';

function InteractiveCarModel({ colorScheme, isRotating, wireframe }) {
  const carGroup = useRef();
  const wheelsRef = useRef();

  useFrame((state, delta) => {
    if (isRotating && carGroup.current) {
      carGroup.current.rotation.y += delta * 0.4;
    }
  });

  const getAccentColor = () => {
    switch (colorScheme) {
      case 'lime': return '#bef264';
      case 'cyber': return '#38bdf8';
      case 'amber': return '#f59e0b';
      case 'platinum': return '#e2e8f0';
      default: return '#bef264';
    }
  };

  const accentColor = getAccentColor();

  return (
    <group ref={carGroup} position={[0, -0.2, 0]}>
      
      {/* Sleek Aerodynamic Lower Body Chassis */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[4.2, 0.55, 1.9]} />
        <meshStandardMaterial 
          color="#0f131a" 
          metalness={0.95} 
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Aerodynamic Cockpit Canopy */}
      <mesh position={[-0.2, 0.85, 0]}>
        <boxGeometry args={[2.2, 0.5, 1.4]} />
        <meshPhysicalMaterial 
          color="#080a0f" 
          metalness={0.9} 
          roughness={0.1}
          transmission={0.4}
          thickness={0.5}
          wireframe={wireframe}
        />
      </mesh>

      {/* Front Splitter Nose Cone */}
      <mesh position={[2.1, 0.25, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <boxGeometry args={[0.6, 0.15, 1.8]} />
        <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Active Rear Wing */}
      <group position={[-1.9, 0.95, 0]}>
        {/* Wing Blades */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.4, 0.06, 1.9]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.2} />
        </mesh>
        {/* Wing Pylons */}
        <mesh position={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#2d3748" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#2d3748" metalness={0.9} />
        </mesh>
      </group>

      {/* Headlights (Accent LED Strips) */}
      <mesh position={[2.1, 0.45, 0.65]}>
        <boxGeometry args={[0.08, 0.06, 0.4]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      <mesh position={[2.1, 0.45, -0.65]}>
        <boxGeometry args={[0.08, 0.06, 0.4]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Rear Taillight Continuous LED Strip */}
      <mesh position={[-2.12, 0.5, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.7]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* 4 Wheels and Brake Calipers */}
      <group ref={wheelsRef}>
        {[
          [1.3, 0.25, 0.95],
          [1.3, 0.25, -0.95],
          [-1.3, 0.25, 0.95],
          [-1.3, 0.25, -0.95]
        ].map((pos, idx) => (
          <group key={idx} position={pos}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.38, 0.38, 0.26, 24]} />
              <meshStandardMaterial color="#0a0c10" roughness={0.6} />
            </mesh>
            {/* Brake Caliper in Accent Color */}
            <mesh position={[0.1, 0.1, 0]}>
              <boxGeometry args={[0.12, 0.18, 0.08]} />
              <meshBasicMaterial color={accentColor} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Underglow Neon Lighting */}
      <pointLight position={[0, 0.1, 0]} intensity={3} distance={4} color={accentColor} />

      {/* Turntable Pedestal */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[3.2, 3.4, 0.2, 48]} />
        <meshStandardMaterial color="#11151e" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Pedestal Outer Glow Ring */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.28, 48]} />
        <meshBasicMaterial color={accentColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function ShowroomSection() {
  const [colorScheme, setColorScheme] = useState('lime');
  const [isRotating, setIsRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState('wing');

  const themes = [
    { id: 'lime', name: 'CARCRAFT Lime', hex: '#bef264' },
    { id: 'cyber', name: 'Cyber Cyan', hex: '#38bdf8' },
    { id: 'amber', name: 'Solar Amber', hex: '#f59e0b' },
    { id: 'platinum', name: 'Pure Platinum', hex: '#e2e8f0' }
  ];

  const hotspots = {
    wing: {
      title: 'ACTIVE DUAL-ELEMENT CARBON WING',
      desc: 'Generates up to 850 kg of downforce with integrated airbrake deployment.'
    },
    chassis: {
      title: 'FULL CARBON FIBER MONOCOQUE',
      desc: 'Torsional rigidity of 65,000 Nm/deg with crash safety honeycomb core.'
    },
    battery: {
      title: '800V DIRECT-COOLED ARCHITECTURE',
      desc: 'Quad-motor 1,280 HP all-wheel drive with continuous torque vectoring.'
    }
  };

  return (
    <section id="showroom-section" className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-[#08090b] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#bef264] uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />
              INTERACTIVE 3D STUDIO // VIRTUAL SHOWROOM
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display uppercase tracking-tight text-white leading-none">
              3D SHOWROOM
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400 font-body max-w-xl">
              Inspect the prototype CARCRAFT Apex GT-R in a real-time 3D WebGL showroom. Manipulate studio lighting, rotate 360°, and toggle CAD wireframe modes.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Rotation Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                isRotating 
                  ? 'bg-[#bef264] text-black border-[#bef264] font-bold' 
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              <RotateCw size={13} className={isRotating ? 'animate-spin' : ''} />
              <span>360° ROTATION {isRotating ? 'ON' : 'OFF'}</span>
            </button>

            {/* Wireframe Mode */}
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                wireframe 
                  ? 'bg-[#bef264] text-black border-[#bef264] font-bold' 
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              <Layers size={13} />
              <span>CAD WIREFRAME</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas Stage Container */}
        <div className="relative w-full h-[450px] sm:h-[540px] md:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#0f131a] via-[#090b0e] to-black border border-white/15 shadow-2xl">
          
          <Canvas
            camera={{ position: [4, 2.5, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 5]} intensity={1.5} />
            <spotLight position={[-5, 8, -5]} intensity={1.2} />
            <InteractiveCarModel 
              colorScheme={colorScheme} 
              isRotating={isRotating} 
              wireframe={wireframe} 
            />
          </Canvas>

          {/* Theme Color Picker Overlay */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              LIGHTING THEME
            </span>
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setColorScheme(t.id)}
                  title={t.name}
                  className={`w-7 h-7 rounded-lg transition-transform duration-200 cursor-pointer ${
                    colorScheme === t.id ? 'scale-110 ring-2 ring-white shadow-lg' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: t.hex }}
                />
              ))}
            </div>
          </div>

          {/* Hotspot Info Panel Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/75 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#bef264]/20 border border-[#bef264]/40 flex items-center justify-center text-[#bef264]">
                <Shield size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#bef264] uppercase tracking-wider block">
                  SELECTED SUBSYSTEM INSPECTOR
                </span>
                <h4 className="text-sm sm:text-base font-display font-extrabold text-white uppercase">
                  {hotspots[activeHotspot].title}
                </h4>
                <p className="text-xs text-slate-400 font-body">
                  {hotspots[activeHotspot].desc}
                </p>
              </div>
            </div>

            {/* Subsystem Switcher Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveHotspot('wing')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase transition-all ${
                  activeHotspot === 'wing' ? 'bg-[#bef264] text-black font-bold' : 'bg-white/10 text-white'
                }`}
              >
                AERO WING
              </button>
              <button
                onClick={() => setActiveHotspot('chassis')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase transition-all ${
                  activeHotspot === 'chassis' ? 'bg-[#bef264] text-black font-bold' : 'bg-white/10 text-white'
                }`}
              >
                MONOCOQUE
              </button>
              <button
                onClick={() => setActiveHotspot('battery')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase transition-all ${
                  activeHotspot === 'battery' ? 'bg-[#bef264] text-black font-bold' : 'bg-white/10 text-white'
                }`}
              >
                800V EV
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
