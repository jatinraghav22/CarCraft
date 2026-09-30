import React, { useRef, useState } from 'react';
import { ArrowUpRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';
import { apply3DTilt, reset3DTilt } from '../animations/dashboardAnimations';

export default function DashboardCard({
  title,
  subtitle,
  buttonText,
  image,
  badge,
  tagline,
  metrics = [],
  layout = 'medium', // 'hero' | 'medium' | 'wide'
  onClick,
  cardRef
}) {
  const [isHovered, setIsHovered] = useState(false);
  const internalRef = useRef(null);
  const targetRef = cardRef || internalRef;

  const handleMouseMove = (e) => {
    // Only apply 3D tilt on desktops / devices with hover pointer
    if (window.matchMedia('(pointer: fine)').matches && targetRef.current) {
      apply3DTilt(targetRef.current, e.clientX, e.clientY, layout === 'hero' ? 6 : 9);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (targetRef.current) {
      reset3DTilt(targetRef.current);
    }
  };

  // Height and structure variants
  const isHero = layout === 'hero';
  const isWide = layout === 'wide';

  return (
    <div
      ref={targetRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform-gpu select-none ${
        isHero 
          ? 'w-full min-h-[380px] md:min-h-[440px]' 
          : isWide 
          ? 'w-full min-h-[280px] md:min-h-[320px]' 
          : 'w-full min-h-[300px] md:min-h-[360px]'
      }`}
      style={{
        background: 'rgba(14, 18, 25, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isHovered 
          ? '1px solid rgba(190, 242, 100, 0.6)' 
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered
          ? '0 24px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(190, 242, 100, 0.25)'
          : '0 16px 40px -12px rgba(0, 0, 0, 0.65)'
      }}
    >
      {/* Background Image Layer with Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: isHovered ? 'scale(1.06)' : 'scale(1.0)'
          }}
          loading="lazy"
        />
        {/* Layered Gradient Overlays for Cinematic Depth */}
        <div 
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: isHero
              ? 'linear-gradient(90deg, rgba(8,10,14,0.92) 0%, rgba(8,10,14,0.7) 45%, rgba(8,10,14,0.3) 100%)'
              : 'linear-gradient(180deg, rgba(8,10,14,0.3) 0%, rgba(8,10,14,0.85) 65%, rgba(8,10,14,0.96) 100%)'
          }}
        />
        {/* Subtle lime-green ambient glow wash on hover */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle at 75% 30%, rgba(190, 242, 100, 0.12) 0%, transparent 60%)',
            opacity: isHovered ? 1 : 0
          }}
        />
      </div>

      {/* Light Sweep Passing Sheen */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 overflow-hidden"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <div 
          className="w-32 h-[200%] absolute -top-1/2 -left-32 rotate-12 transition-transform duration-1000 ease-out"
          style={{
            transform: isHovered ? 'translateX(900px)' : 'translateX(0)',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), rgba(190, 242, 100, 0.25), transparent)'
          }}
        />
      </div>

      {/* Card Content Hierarchy */}
      <div className={`relative z-10 p-6 md:p-8 flex flex-col justify-between h-full ${
        isHero ? 'max-w-2xl' : ''
      }`}>
        
        {/* Top Badges & Tags */}
        <div className="flex items-center justify-between gap-3">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/10 text-white backdrop-blur-md border border-white/15">
              <Sparkles size={11} className="text-[#bef264]" />
              {badge}
            </span>
          )}
          {tagline && (
            <span className="text-[11px] font-mono tracking-widest text-[#94a3b8] uppercase">
              {tagline}
            </span>
          )}
        </div>

        {/* Center / Bottom Info */}
        <div className="mt-8 flex flex-col gap-2">
          <h3 className={`font-display font-extrabold uppercase text-white tracking-tight leading-none group-hover:text-white transition-colors ${
            isHero ? 'text-3xl sm:text-4xl md:text-5xl' : isWide ? 'text-2xl sm:text-3xl' : 'text-2xl sm:text-3xl'
          }`}>
            {title}
          </h3>

          <p className="text-sm md:text-base text-slate-300/80 font-body max-w-lg leading-relaxed">
            {subtitle}
          </p>

          {/* Quick Metrics (e.g. 0-100, Top Speed, or Parts Count) */}
          {metrics && metrics.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-[10px] font-mono text-[#94a3b8] uppercase">{m.label}</span>
                  <span className="text-xs font-mono font-bold text-white">{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Trigger Button with Animated Arrow */}
          <div className="mt-6 flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-display font-bold tracking-widest uppercase transition-all duration-300 ${
              isHovered
                ? 'bg-[#bef264] text-black shadow-[0_0_20px_rgba(190,242,100,0.5)] translate-x-1'
                : 'bg-white/10 text-white border border-white/15 backdrop-blur-sm'
            }`}>
              {buttonText}
              <ArrowUpRight 
                size={15} 
                className={`transition-transform duration-300 ${
                  isHovered ? 'translate-x-0.5 -translate-y-0.5 text-black' : 'text-[#bef264]'
                }`}
              />
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
