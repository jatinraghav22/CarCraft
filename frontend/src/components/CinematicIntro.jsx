import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, ChevronDown, Play, FastForward, Gauge, Compass } from 'lucide-react';
import { runCinematicTransition } from '../animations/introTransition';

export default function CinematicIntro({ onVideoEnd, onExploreVehicles, onBookService }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const lightStreakRef = useRef(null);
  const heroContentRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration || 10);
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        setProgress(pct);
      }
    };

    // Strict HTML5 ended event listener
    const handleEnded = () => {
      console.log('CARCRAFT video journey complete: car entered showroom.');
      setHasEnded(true);
      triggerCinematicSequence();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Initial safe play attempt (muted autoplay complies with browser policy)
    video.play().catch(err => {
      console.warn('Autoplay prevented, awaiting user interaction:', err);
    });

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const triggerCinematicSequence = () => {
    // Hide initial overlay text gracefully
    if (heroContentRef.current) {
      heroContentRef.current.style.opacity = '0';
      heroContentRef.current.style.transform = 'translateY(-30px)';
      heroContentRef.current.style.transition = 'all 0.6s ease';
    }

    // Run GSAP camera zoom push-in, dark glass expansion and lime-green light streak
    runCinematicTransition({
      videoElement: videoRef.current,
      overlayElement: overlayRef.current,
      lightStreakElement: lightStreakRef.current,
      onComplete: () => {
        onVideoEnd();
      }
    });
  };

  const toggleAudio = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Option to skip directly to showroom final frame
  const handleFastForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, (videoRef.current.duration || 10) - 0.2);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center select-none"
    >
      {/* Cinematic Video Layer */}
      <video
        ref={videoRef}
        src="/videos/video.mp4"
        autoPlay
        muted={isMuted}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 ease-out"
        style={{ transformOrigin: 'center center' }}
      />

      {/* Subtle Cinematic Vignette & Ambient Glow */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-10 pointer-events-none transition-all duration-700 bg-gradient-to-t from-black/90 via-black/20 to-black/60"
        style={{ opacity: 0.6 }}
      />

      {/* Dynamic Lime-Green Laser / Light Sweep Effect */}
      <div 
        ref={lightStreakRef}
        className="absolute inset-y-0 w-48 -left-48 z-20 pointer-events-none opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(190, 242, 100, 0.95), rgba(204, 255, 0, 1), transparent)',
          filter: 'blur(12px)',
          boxShadow: '0 0 60px 20px rgba(190, 242, 100, 0.8)'
        }}
      />

      {/* Initial Cinematic Overlay Content (Kept Clean & Non-Obtrusive) */}
      <div 
        ref={heroContentRef}
        className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center transition-all duration-700 pointer-events-auto mt-16 md:mt-0"
      >
        {/* Futuristic Sub-badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#bef264] text-xs font-mono font-medium tracking-[0.25em] uppercase mb-6 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#bef264] animate-ping" />
          CINEMATIC INGRESS // ROAD TO SHOWROOM
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white uppercase drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] leading-[0.95]">
          CARCRAFT
        </h1>

        <p className="mt-3 text-lg sm:text-2xl md:text-3xl font-light font-display tracking-[0.15em] text-[#cbd5e1] uppercase">
          THE FUTURE OF AUTOMOTIVE
        </p>

        <p className="text-sm sm:text-base md:text-lg font-mono tracking-widest text-[#bef264] font-semibold uppercase mt-1">
          DRIVE YOUR EXPERIENCE.
        </p>

        {/* Brief Narrative */}
        <p className="mt-4 max-w-xl text-xs sm:text-sm text-slate-300/80 font-body leading-relaxed drop-shadow">
          Discover vehicles, premium parts and professional automotive services.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={onExploreVehicles}
            className="btn-primary"
          >
            EXPLORE VEHICLES
          </button>
          <button 
            onClick={onBookService}
            className="btn-secondary"
          >
            BOOK A SERVICE
          </button>
        </div>
      </div>

      {/* Bottom Telemetry & Controls Overlay */}
      <div className="absolute bottom-6 inset-x-0 z-30 px-6 md:px-12 flex items-center justify-between text-xs font-mono text-white/70">
        
        {/* Left Telemetry */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
            <Gauge size={13} className="text-[#bef264]" />
            <span>JOURNEY: {progress.toFixed(0)}%</span>
          </div>
          <span className="text-white/40">|</span>
          <span className="text-white/60 tracking-wider">
            {progress < 40 ? 'HIGHWAY CRUISE' : progress < 85 ? 'APPROACHING SHOWROOM' : 'DOCKING INSIDE SHOWROOM'}
          </span>
        </div>

        {/* Center Progress Scrubber Line */}
        <div className="flex-1 max-w-xs md:max-w-md mx-4">
          <div className="w-full bg-white/15 h-[3px] rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-[#84cc16] to-[#bef264] transition-all duration-150 shadow-[0_0_12px_#bef264]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Right Audio & Jump Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-[#bef264]/40 text-white transition-all cursor-pointer flex items-center gap-1.5"
            title={isMuted ? "Unmute Cinematic Engine Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#bef264]" />}
            <span className="text-[11px] hidden md:inline">{isMuted ? "MUTE" : "AUDIO ON"}</span>
          </button>

          {/* Quick Skip to Showroom */}
          <button
            onClick={handleFastForward}
            className="px-2.5 py-2 rounded-lg bg-black/60 hover:bg-[#bef264]/20 backdrop-blur-md border border-white/10 hover:border-[#bef264]/50 text-white text-[11px] font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1"
            title="Fast forward to Showroom Arrival"
          >
            <FastForward size={13} className="text-[#bef264]" />
            <span className="hidden sm:inline">ENTER SHOWROOM</span>
          </button>
        </div>

      </div>

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center opacity-60">
        <span className="text-[9px] font-mono tracking-[0.25em] text-white/70 uppercase">
          {hasEnded ? 'ENTERED SHOWROOM' : 'JOURNEY IN PROGRESS'}
        </span>
        <ChevronDown size={14} className="text-[#bef264] animate-bounce mt-0.5" />
      </div>

    </div>
  );
}
