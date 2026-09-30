import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX, FastForward, ArrowUpRight, Sparkles, ChevronDown, Gauge } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';
import { apply3DTilt, reset3DTilt } from '../animations/dashboardAnimations';
import vehiclesImg from '../assets/images/vehicles.jpg';
import partsImg from '../assets/images/parts.jpg';
import serviceImg from '../assets/images/service.jpg';
import showroomImg from '../assets/images/showroom.jpg';

export default function ShowroomHeroScene({ onVideoFinished, onCardAction }) {
  const containerRef = useRef(null);
  const showroomBgRef = useRef(null);
  const videoRef = useRef(null);
  const lightSweepRef = useRef(null);
  const headerContentRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mouse parallax state
  const mouseOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    };

    // Strict HTML5 ended event listener
    const handleEnded = () => {
      console.log('CARCRAFT video journey reached final frame inside showroom.');
      handleTransition();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    video.play().catch(err => {
      console.warn('Autoplay waiting for user gesture:', err);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Parallax on mouse move inside the showroom scene
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!showroomBgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseOffset.current = { x, y };

      // Gentle parallax shift on the permanent showroom background
      gsap.to(showroomBgRef.current, {
        x: x * 15,
        y: y * 10,
        duration: 1.2,
        ease: 'power1.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleTransition = () => {
    if (videoEnded) return;
    setVideoEnded(true);
    if (onVideoFinished) onVideoFinished();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Step 1: Video gradually fades out, revealing the permanent showroom background underneath
    if (videoRef.current) {
      tl.to(videoRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut'
      }, 0);
    }

    // Step 2: Subtle camera push-in on the showroom background
    if (showroomBgRef.current) {
      tl.to(showroomBgRef.current, {
        scale: 1.05,
        filter: 'brightness(0.9) contrast(1.1)',
        duration: 1.6,
        ease: 'power2.out'
      }, 0);
    }

    // Step 3: Lime-green CARCRAFT light sweep
    if (lightSweepRef.current) {
      tl.fromTo(lightSweepRef.current,
        { xPercent: -120, opacity: 0 },
        { xPercent: 120, opacity: 1, duration: 0.9, ease: 'power4.inOut' },
        0.3
      ).to(lightSweepRef.current, { opacity: 0, duration: 0.3 }, '-=0.2');
    }

    // Step 4: Hero Title & Subtitle emerge
    if (headerContentRef.current) {
      tl.fromTo(headerContentRef.current,
        { opacity: 0, y: 35, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9 },
        0.6
      );
    }

    // Step 5: Cards animate one by one into the showroom
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current].filter(Boolean);
    if (cards.length > 0) {
      tl.fromTo(cards,
        {
          opacity: 0,
          y: 45,
          scale: 0.92,
          rotationX: 12,
          transformOrigin: '50% 100%'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.85,
          stagger: 0.16,
          ease: 'power3.out'
        },
        0.85
      );
    }
  };

  const toggleAudio = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleCardClick = (sectionId) => {
    if (onCardAction) {
      onCardAction(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#07090c] flex flex-col items-center justify-center select-none"
    >
      
      {/* ============================================================== */}
      {/* 1. PERMANENT SHOWROOM ENVIRONMENT BACKGROUND (LAYER 0)        */}
      {/* This showroom remains permanently behind the video and UI.   */}
      {/* ============================================================== */}
      <div 
        ref={showroomBgRef}
        className="absolute inset-0 w-[108%] h-[108%] -left-[4%] -top-[4%] pointer-events-none z-0 transform-gpu will-change-transform"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 30%, rgba(190, 242, 100, 0.08) 0%, transparent 65%),
            linear-gradient(180deg, rgba(8, 10, 14, 0.5) 0%, rgba(8, 10, 14, 0.85) 60%, #07090c 100%),
            url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'brightness(0.8) contrast(1.15)'
        }}
      />

      {/* Volumetric Dark Vignette & Showroom Lighting Lines */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#07090c] via-black/40 to-[#07090c]/70" />
      <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

      {/* ============================================================== */}
      {/* 2. CINEMATIC OPENING VIDEO (LAYER 1)                          */}
      {/* Plays /videos/video.mp4 directly on top of the showroom.      */}
      {/* ============================================================== */}
      <video
        ref={videoRef}
        src="/videos/video.mp4"
        autoPlay
        muted={isMuted}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-2 transition-opacity duration-1000 ease-out"
        style={{
          opacity: videoEnded ? 0 : 1,
          pointerEvents: videoEnded ? 'none' : 'auto'
        }}
      />

      {/* ============================================================== */}
      {/* 3. LIME-GREEN LIGHT SWEEP TRANSITION BEAM                     */}
      {/* ============================================================== */}
      <div 
        ref={lightSweepRef}
        className="absolute inset-y-0 w-64 -left-64 z-10 pointer-events-none opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(190, 242, 100, 0.85), rgba(204, 255, 0, 1), transparent)',
          filter: 'blur(16px)',
          boxShadow: '0 0 80px 25px rgba(190, 242, 100, 0.7)'
        }}
      />

      {/* ============================================================== */}
      {/* 4. DISCREET INTRO TELEMETRY (Only while video is playing)    */}
      {/* ============================================================== */}
      {!videoEnded && (
        <div className="absolute bottom-6 inset-x-0 z-20 px-8 flex items-center justify-between text-xs font-mono text-white/70">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
            <span>CARCRAFT SHOWROOM INGRESS: {videoProgress.toFixed(0)}%</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white cursor-pointer transition-all flex items-center gap-1.5"
              title={isMuted ? "Unmute Engine Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#bef264]" />}
              <span className="text-[11px] hidden sm:inline">{isMuted ? "MUTE" : "AUDIO ON"}</span>
            </button>

            <button
              onClick={handleTransition}
              className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-[#bef264]/20 backdrop-blur-md border border-white/15 hover:border-[#bef264]/50 text-white text-[11px] font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
              title="Skip directly to Showroom Dashboard"
            >
              <FastForward size={13} className="text-[#bef264]" />
              <span>ENTER SHOWROOM</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. CARCRAFT DASHBOARD INSIDE THE SHOWROOM (LAYER 3)           */}
      {/* Appears smoothly after video ends                              */}
      {/* ============================================================== */}
      <div 
        className={`relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-16 flex flex-col items-center justify-center transition-all duration-700 ${
          videoEnded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        
        {/* Dashboard Hero Text */}
        <div ref={headerContentRef} className="text-center mb-12 max-w-3xl opacity-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs font-mono text-[#bef264] uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />
            CARCRAFT DIGITAL SHOWROOM
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase leading-none drop-shadow-2xl">
            CARCRAFT
          </h1>

          <p className="mt-2 text-lg sm:text-2xl md:text-3xl font-light font-display tracking-[0.18em] text-[#cbd5e1] uppercase">
            YOUR AUTOMOTIVE EXPERIENCE
          </p>

          <p className="mt-2 text-xs sm:text-sm md:text-base font-body text-[#94a3b8] max-w-lg mx-auto">
            Everything your vehicle needs, in one place.
          </p>
        </div>

        {/* ============================================================== */}
        {/* 6. 3D FLOATING FUNCTION CARDS INSIDE SHOWROOM                  */}
        {/* Asymmetrical composition: 1 Top Hero, 2 Middle, 1 Bottom Wide */}
        {/* ============================================================== */}
        <div className="w-full flex flex-col gap-6 md:gap-7">
          
          {/* CARD 1: EXPLORE VEHICLES (Hero) */}
          <div 
            ref={card1Ref}
            onClick={() => handleCardClick('vehicles-section')}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative w-full min-h-[300px] sm:min-h-[340px] md:min-h-[380px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform-gpu opacity-0"
            style={{
              background: 'rgba(12, 16, 23, 0.72)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: hoveredCard === 1 ? '1px solid rgba(190, 242, 100, 0.65)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: hoveredCard === 1 
                ? '0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 0 30px rgba(190, 242, 100, 0.2)' 
                : '0 15px 40px -10px rgba(0, 0, 0, 0.65)'
            }}
          >
            {/* Background Visual */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={vehiclesImg}
                alt="Explore Vehicles"
                onError={handleImageError}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080a0e]/95 via-[#080a0e]/75 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest bg-white/10 text-[#bef264] border border-[#bef264]/30">
                  FLAGSHIP MARKETPLACE
                </span>
                <span className="text-[11px] font-mono text-slate-400">148 VEHICLES AVAILABLE</span>
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-white leading-none">
                  EXPLORE VEHICLES
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-body">
                  Discover premium vehicles and find your perfect drive. Hand-crafted hypercars, high-performance EVs, and track weapons.
                </p>
                
                <div className="pt-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-display font-bold tracking-widest uppercase transition-all duration-300 bg-[#bef264] text-black shadow-[0_0_20px_rgba(190,242,100,0.4)] group-hover:bg-[#ccff00]">
                    EXPLORE VEHICLES
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column Middle Row: PARTS & ACCESSORIES + BOOK A SERVICE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 w-full">
            
            {/* CARD 2: PARTS & ACCESSORIES */}
            <div 
              ref={card2Ref}
              onClick={() => handleCardClick('parts-section')}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative w-full min-h-[260px] sm:min-h-[300px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform-gpu opacity-0"
              style={{
                background: 'rgba(12, 16, 23, 0.72)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: hoveredCard === 2 ? '1px solid rgba(190, 242, 100, 0.65)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: hoveredCard === 2 
                  ? '0 20px 50px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(190, 242, 100, 0.18)' 
                  : '0 15px 40px -10px rgba(0, 0, 0, 0.65)'
              }}
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={partsImg}
                  alt="Parts & Accessories"
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e]/95 via-[#080a0e]/60 to-transparent" />
              </div>

              <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-between h-full">
                <span className="self-start px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-white/10 text-white border border-white/15">
                  PERFORMANCE HARDWARE
                </span>

                <div className="mt-6 space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white leading-tight">
                    PARTS & ACCESSORIES
                  </h3>
                  <p className="text-xs text-slate-300 font-body">
                    Upgrade and personalize your vehicle. Carbon-ceramic brakes, forged aero wheels, and twin-scroll turbos.
                  </p>
                  
                  <div className="pt-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-bold tracking-widest uppercase transition-all bg-white/10 group-hover:bg-[#bef264] text-white group-hover:text-black border border-white/15">
                      SHOP PARTS
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: BOOK A SERVICE */}
            <div 
              ref={card3Ref}
              onClick={() => handleCardClick('service-section')}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative w-full min-h-[260px] sm:min-h-[300px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform-gpu opacity-0"
              style={{
                background: 'rgba(12, 16, 23, 0.72)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: hoveredCard === 3 ? '1px solid rgba(190, 242, 100, 0.65)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: hoveredCard === 3 
                  ? '0 20px 50px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(190, 242, 100, 0.18)' 
                  : '0 15px 40px -10px rgba(0, 0, 0, 0.65)'
              }}
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={serviceImg}
                  alt="Book a Service"
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e]/95 via-[#080a0e]/60 to-transparent" />
              </div>

              <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-between h-full">
                <span className="self-start px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-white/10 text-white border border-white/15">
                  MASTER TECHNICIAN BAY
                </span>

                <div className="mt-6 space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white leading-tight">
                    BOOK A SERVICE
                  </h3>
                  <p className="text-xs text-slate-300 font-body">
                    Professional automotive service whenever you need it. 120-point digital telemetry diagnostics and dyno tuning.
                  </p>
                  
                  <div className="pt-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-bold tracking-widest uppercase transition-all bg-white/10 group-hover:bg-[#bef264] text-white group-hover:text-black border border-white/15">
                      BOOK SERVICE
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CARD 4: SHOWROOM (Wide Bottom Card) */}
          <div 
            ref={card4Ref}
            onClick={() => handleCardClick('showroom-section')}
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative w-full min-h-[220px] sm:min-h-[260px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform-gpu opacity-0"
            style={{
              background: 'rgba(12, 16, 23, 0.72)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: hoveredCard === 4 ? '1px solid rgba(190, 242, 100, 0.65)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: hoveredCard === 4 
                ? '0 20px 50px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(190, 242, 100, 0.18)' 
                : '0 15px 40px -10px rgba(0, 0, 0, 0.65)'
            }}
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={showroomImg}
                alt="CARCRAFT Showroom"
                onError={handleImageError}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080a0e]/95 via-[#080a0e]/75 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full max-w-xl">
              <span className="self-start px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-white/10 text-[#bef264] border border-[#bef264]/30">
                REALTIME 3D TOUR
              </span>

              <div className="mt-4 space-y-1.5">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-white leading-none">
                  CARCRAFT SHOWROOM
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-body">
                  Explore the CARCRAFT showroom experience. Manipulate studio lighting, inspect aerodynamic carbon monocoques, and walk the virtual floor.
                </p>
                
                <div className="pt-3">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-display font-bold tracking-widest uppercase transition-all bg-[#bef264] text-black shadow-[0_0_20px_rgba(190,242,100,0.4)] group-hover:bg-[#ccff00]">
                    EXPLORE SHOWROOM
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Down Scroll Indicator */}
        <div className="mt-14 flex flex-col items-center gap-1.5 text-slate-400 text-xs font-mono tracking-widest uppercase opacity-70">
          <span>SCROLL FOR COMPLETE MARKETPLACE</span>
          <ChevronDown size={16} className="text-[#bef264] animate-bounce" />
        </div>

      </div>

    </div>
  );
}
