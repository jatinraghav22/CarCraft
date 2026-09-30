import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  Volume2, VolumeX, FastForward, Gauge,
  ArrowUpRight, Sparkles, Car, Wrench, Eye, Disc
} from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import vehiclesImg from '../assets/images/vehicles.jpg';
import partsImg from '../assets/images/parts.jpg';
import serviceImg from '../assets/images/service.jpg';
import showroomImg from '../assets/images/showroom.jpg';

/* ─────────────────────────────────────────────
   3D PARTICLE FIELD — Three.js WebGL layer
───────────────────────────────────────────── */
function ShowroomParticles({ mousePos }) {
  const particlesRef = useRef();
  const ringRef = useRef();
  const count = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 22;
      pos[i + 1] = Math.random() * 10 - 3;
      pos[i + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.018;
      particlesRef.current.position.x = THREE.MathUtils.lerp(
        particlesRef.current.position.x,
        mousePos.current.x * 0.6,
        0.04
      );
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight position={[0, 8, 3]} intensity={2.8} color="#bef264" angle={0.55} penumbra={0.9} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} color="#ffffff" />

      <group ref={ringRef} position={[0, -2.2, -5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.2, 4.38, 72]} />
          <meshBasicMaterial color="#bef264" opacity={0.28} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 4.86, 56]} />
          <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>

      <gridHelper args={[40, 40, '#bef264', '#0f1318']} position={[0, -2.5, -3]} />

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#bef264"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

/* ─────────────────────────────────────────────
   GLASS DASHBOARD CARD
───────────────────────────────────────────── */
function ShowCard({ title, subtitle, badge, image, icon: Icon, cardRef, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 0,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        background: hovered ? 'rgba(16,21,30,0.88)' : 'rgba(10,14,20,0.72)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        border: hovered ? '1px solid rgba(190,242,100,0.55)' : '1px solid rgba(255,255,255,0.09)',
        boxShadow: hovered
          ? '0 28px 70px -12px rgba(0,0,0,0.9), 0 0 40px -8px rgba(190,242,100,0.22)'
          : '0 16px 44px -10px rgba(0,0,0,0.7)',
        transition: 'background 0.35s, border 0.35s, box-shadow 0.35s',
        minHeight: '190px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', borderRadius: '16px' }}>
        <img
          src={image}
          alt={title}
          onError={handleImageError}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.7s ease',
            transform: hovered ? 'scale(1.07)' : 'scale(1.0)',
          }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(5,7,12,0.22) 0%, rgba(5,7,12,0.88) 65%, rgba(5,7,12,0.97) 100%)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, transition: 'opacity 0.5s',
          opacity: hovered ? 1 : 0,
          background: 'radial-gradient(circle at 70% 20%, rgba(190,242,100,0.14) 0%, transparent 55%)'
        }} />
        {/* Light sweep */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s' }}>
          <div style={{
            width: '70px', height: '200%', position: 'absolute', top: '-50%', left: '-80px',
            transform: hovered ? 'translateX(700px) rotate(10deg)' : 'translateX(0) rotate(10deg)',
            transition: 'transform 0.85s ease-out',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), rgba(190,242,100,0.18), transparent)',
          }} />
        </div>
      </div>

      {/* Top badge */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {badge && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '3px 9px', borderRadius: '5px', fontSize: '10px',
            fontFamily: 'Space Grotesk, monospace', fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', backdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={9} color="#bef264" />
            {badge}
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {Icon && (
          <div style={{
            width: '38px', height: '38px', borderRadius: '9px',
            background: hovered ? 'rgba(190,242,100,0.15)' : 'rgba(255,255,255,0.07)',
            border: hovered ? '1px solid rgba(190,242,100,0.38)' : '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '10px', transition: 'all 0.3s'
          }}>
            <Icon size={17} color={hovered ? '#bef264' : '#94a3b8'} />
          </div>
        )}
        <h3 style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 800,
          fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
          color: '#fff', textTransform: 'uppercase',
          letterSpacing: '-0.01em', lineHeight: 1.1, margin: '0 0 6px'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '0.73rem', color: 'rgba(148,163,184,0.82)',
          fontFamily: 'Inter, sans-serif', lineHeight: 1.5, margin: '0 0 14px'
        }}>
          {subtitle}
        </p>
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '6px 14px', borderRadius: '7px', fontSize: '10px',
            fontFamily: 'Outfit, sans-serif', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            background: hovered ? '#bef264' : 'rgba(255,255,255,0.07)',
            color: hovered ? '#080a08' : '#fff',
            border: hovered ? 'none' : '1px solid rgba(255,255,255,0.12)',
            boxShadow: hovered ? '0 0 16px rgba(190,242,100,0.38)' : 'none',
            transition: 'all 0.3s',
          }}>
          EXPLORE
          <ArrowUpRight size={12} color={hovered ? '#080a08' : '#bef264'} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT: SHOWROOM HOMEPAGE
   Single 100vh scene — video then dashboard
───────────────────────────────────────────── */
export default function ShowroomHomepage({
  onVideoEnd,
  onNavigateSection,
}) {
  const videoRef = useRef(null);
  const videoWrapRef = useRef(null);
  const lightRef = useRef(null);
  const dashRef = useRef(null);
  const headerRef = useRef(null);
  const heroCopyRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  const geminiCoverRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('video');
  const [showCanvas, setShowCanvas] = useState(false);
  const [videoBox, setVideoBox] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const customerIsLoggedIn = Boolean(
    isAuthenticated && user && (!user.role || user.role === 'CUSTOMER' || user.role !== 'DEALER')
  );

  const customerDisplayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.username ||
    'Client';

  /* Mouse parallax (dashboard phase only) */
  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
      if (phase === 'dashboard' && videoWrapRef.current) {
        gsap.to(videoWrapRef.current, {
          x: mousePos.current.x * 9,
          y: mousePos.current.y * 5,
          duration: 1.3, ease: 'power2.out', overwrite: 'auto'
        });
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [phase]);

  /* Track rendered 16:9 video frame for pixel-precise responsive masking of Gemini watermark */
  useEffect(() => {
    const updateBox = () => {
      const wrap = videoWrapRef.current;
      if (!wrap) return;
      const cw = wrap.clientWidth;
      const ch = wrap.clientHeight;
      if (!cw || !ch) return;

      const videoAspect = 16 / 9; // video.mp4 native aspect ratio (1280x720)
      const containerAspect = cw / ch;

      let rw, rh, left, top;
      if (containerAspect > videoAspect) {
        rw = cw;
        rh = cw / videoAspect;
        left = 0;
        top = (ch - rh) / 2;
      } else {
        rh = ch;
        rw = ch * videoAspect;
        left = (cw - rw) / 2;
        top = 0;
      }
      setVideoBox({ left, top, width: rw, height: rh });
    };

    updateBox();
    window.addEventListener('resize', updateBox);
    return () => window.removeEventListener('resize', updateBox);
  }, []);

  /* Video events */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onTime = () => {
      if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
    };
    const onEnded = () => {
      setPhase('transitioning');
      runReveal();
    };
    vid.addEventListener('timeupdate', onTime);
    vid.addEventListener('ended', onEnded);
    vid.play().catch(() => { });
    return () => {
      vid.removeEventListener('timeupdate', onTime);
      vid.removeEventListener('ended', onEnded);
    };
  }, []);

  /* GSAP cinematic reveal */
  const runReveal = useCallback(() => {
    const vid = videoRef.current;
    const light = lightRef.current;
    const dash = dashRef.current;
    const hdr = headerRef.current;
    const hero = heroCopyRef.current;
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current].filter(Boolean);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        setPhase('dashboard');
        if (onVideoEnd) onVideoEnd();
      }
    });

    // 0. Smoothly fade out Gemini logo cover immediately when video finishes
    if (geminiCoverRef.current) {
      tl.to(geminiCoverRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0);
    }

    // 1. Camera push-in
    if (vid) {
      tl.to(vid, { scale: 1.09, filter: 'brightness(1.18)', duration: 1.1, ease: 'power2.inOut' }, 0);
    }

    // 2. Lime light streak
    if (light) {
      tl.fromTo(light,
        { xPercent: -130, opacity: 0, scaleY: 0.6 },
        { xPercent: 130, opacity: 1, scaleY: 1.3, duration: 0.8, ease: 'power4.inOut' },
        0.25
      ).to(light, { opacity: 0, duration: 0.28 }, '-=0.12');
    }

    // 3. Video dims to showroom backdrop
    if (vid) {
      tl.to(vid, {
        opacity: 0.32, filter: 'brightness(0.42) saturate(0.65) blur(1px)',
        scale: 1.04, duration: 1.4, ease: 'power2.inOut'
      }, 0.55);
    }

    // 4. Mount canvas + fade in dashboard wrapper
    setShowCanvas(true);
    if (dash) tl.to(dash, { opacity: 1, duration: 0.4 }, 0.85);

    // 5. Header slides down
    if (hdr) tl.fromTo(hdr, { opacity: 0, y: -28 }, { opacity: 1, y: 0, duration: 0.65 }, 1.05);

    // 6. Hero copy fades up
    if (hero) tl.fromTo(hero, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.65 }, 1.3);

    // 7. Cards stagger in with 3D entrance
    if (cards.length) {
      tl.fromTo(cards,
        { opacity: 0, y: 50, rotateX: 12, scale: 0.9, transformOrigin: '50% 100%' },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.82, stagger: 0.13 },
        1.55
      );
    }
  }, [onVideoEnd]);

  const handleSkip = () => {
    const vid = videoRef.current;
    if (vid) vid.currentTime = Math.max(0, (vid.duration || 10) - 0.1);
  };

  const goto = (id) => {
    if (onNavigateSection) onNavigateSection(id);
    else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDash = phase !== 'video';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#04050a' }}>

      {/* ── VIDEO LAYER ── */}
      <div ref={videoWrapRef} style={{ position: 'absolute', inset: '-24px', zIndex: 0, overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src="/videos/video.mp4"
          autoPlay muted={isMuted} playsInline preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.05)', transformOrigin: 'center center' }}
        />

        {/* ── GEMINI LOGO MASK (ACTIVE ONLY DURING INTRO VIDEO) ── */}
        {videoBox.width > 0 && phase !== 'dashboard' && (
          <div
            ref={geminiCoverRef}
            style={{
              position: 'absolute',
              left: `${videoBox.left}px`,
              top: `${videoBox.top}px`,
              width: `${videoBox.width}px`,
              height: `${videoBox.height}px`,
              transform: 'scale(1.05)',
              transformOrigin: 'center center',
              pointerEvents: 'none',
              zIndex: 2,
              opacity: phase === 'video' ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '90.625%',
                top: '83.333%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(54px, 4.4vw, 68px)',
                height: 'clamp(54px, 4.4vw, 68px)',
                borderRadius: '14px',
                background: 'rgba(6, 9, 14, 0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(190, 242, 100, 0.45)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 16px rgba(190, 242, 100, 0.22)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #bef264, #84cc16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(190, 242, 100, 0.4)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Space Grotesk, monospace',
                    fontWeight: 900,
                    fontSize: '11px',
                    color: '#080a08',
                    lineHeight: 1,
                  }}
                >
                  CC
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: '7px',
                  color: '#bef264',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  marginTop: '2px',
                }}
              >
                CARCRAFT
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cinematic vignette always-on */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.7) 100%)'
      }} />

      {/* ── LIME LIGHT STREAK ── */}
      <div ref={lightRef} style={{
        position: 'absolute', top: 0, bottom: 0, left: '-220px', width: '220px',
        zIndex: 30, pointerEvents: 'none', opacity: 0,
        background: 'linear-gradient(90deg, transparent, rgba(190,242,100,0.88), rgba(204,255,0,1), transparent)',
        filter: 'blur(14px)', boxShadow: '0 0 70px 28px rgba(190,242,100,0.7)',
      }} />

      {/* ── VIDEO-PHASE OVERLAY TEXT ── */}
      {phase === 'video' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 16px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#bef264', fontSize: '10px',
            fontFamily: 'Space Grotesk, monospace', fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '18px',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#bef264', animation: 'cc-ping 1.4s infinite' }} />
            CINEMATIC INGRESS // ROAD TO SHOWROOM
          </div>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 900,
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            color: '#fff', textTransform: 'uppercase',
            letterSpacing: '-0.02em', lineHeight: 0.92,
            textShadow: '0 10px 50px rgba(0,0,0,0.9)', margin: 0,
          }}>
            CARCRAFT
          </h1>
          <p style={{
            marginTop: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: 300,
            fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
            color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.16em'
          }}>
            THE FUTURE OF AUTOMOTIVE
          </p>
          <p style={{
            marginTop: '6px', fontFamily: 'Space Grotesk, monospace', fontWeight: 600,
            fontSize: '0.72rem', color: '#bef264', letterSpacing: '0.28em', textTransform: 'uppercase'
          }}>
            DRIVE YOUR EXPERIENCE.
          </p>
        </div>
      )}

      {/* ── VIDEO CONTROLS BAR (video phase only) ── */}
      {phase === 'video' && (
        <div style={{
          position: 'absolute', bottom: '24px', left: 0, right: 0, zIndex: 40,
          padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(10px)',
              padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '11px', fontFamily: 'Space Grotesk, monospace', color: 'rgba(255,255,255,0.75)',
            }}>
              <Gauge size={12} color="#bef264" />
              JOURNEY: {progress.toFixed(0)}%
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>|</span>
            <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk, monospace', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em' }}>
              {progress < 40 ? 'HIGHWAY CRUISE' : progress < 82 ? 'APPROACHING SHOWROOM' : 'DOCKING…'}
            </span>
          </div>

          <div style={{ flex: 1, maxWidth: '400px', margin: '0 18px' }}>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.12)', height: '3px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg, #84cc16, #bef264)',
                boxShadow: '0 0 10px #bef264', transition: 'width 0.15s linear'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => {
              setIsMuted(m => {
                if (videoRef.current) videoRef.current.muted = !m;
                return !m;
              });
            }} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '7px 12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
              borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', cursor: 'pointer',
            }}>
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} color="#bef264" />}
            </button>
            <button onClick={handleSkip} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '7px 14px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
              borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', fontSize: '10px', fontFamily: 'Space Grotesk, monospace',
              cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              <FastForward size={13} color="#bef264" />
              ENTER SHOWROOM
            </button>
          </div>
        </div>
      )}

      {/* ── 3D CANVAS (shows after transition) ── */}
      {showCanvas && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', opacity: 0.6 }}>
          <Canvas camera={{ position: [0, 1.2, 7], fov: 48 }} gl={{ antialias: true, alpha: true }}>
            <ShowroomParticles mousePos={mousePos} />
          </Canvas>
        </div>
      )}

      {/* ── DASHBOARD OVERLAY (in the same 100vh scene) ── */}
      <div ref={dashRef} style={{
        position: 'absolute', inset: 0, zIndex: 20,
        opacity: 0,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}>
        {/* Readability gradient over dimmed video */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(4,5,10,0.75) 0%, rgba(4,5,10,0.35) 42%, rgba(4,5,10,0.8) 100%)'
        }} />

        {/* ── HEADER ── */}
        <header ref={headerRef} style={{
          opacity: 0, position: 'relative', zIndex: 10,
          padding: '18px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(4,6,12,0.62)', backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #bef264, #84cc16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px rgba(190,242,100,0.42)',
            }}>
              <span style={{ fontFamily: 'Space Grotesk, monospace', fontWeight: 900, fontSize: '14px', color: '#080a08' }}>CC</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                CARCRAFT
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#bef264', animation: 'cc-pulse 2s infinite' }} />
              </div>
              <div style={{ fontSize: '9px', fontFamily: 'Space Grotesk, monospace', color: '#64748b', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: '-2px' }}>
                Automotive Technology
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '28px' }}>
            <button
              onClick={() => navigate('/vehicles')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#bef264'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
            >
              VEHICLES
            </button>

            <button
              onClick={() => navigate('/parts')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#bef264'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
            >
              PARTS
            </button>

            <button
              onClick={() => navigate('/service')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#bef264'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
            >
              SERVICE
            </button>

            <button
              onClick={() => navigate('/showroom')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#bef264'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
            >
              SHOWROOM
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {customerIsLoggedIn ? (
              <button
                onClick={() => navigate('/profile')}
                title="Customer Profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '4px 16px 4px 5px',
                  borderRadius: '999px',
                  background: 'rgba(10, 15, 22, 0.75)',
                  border: '1.5px solid #bef264',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(190, 242, 100, 0.2)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(190, 242, 100, 0.14)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(190, 242, 100, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(10, 15, 22, 0.75)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(190, 242, 100, 0.2)';
                }}
              >
                <UserAvatar user={user} size={28} fontSize="0.75rem" />
                <span
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: '#bef264',
                    letterSpacing: '0.02em',
                  }}
                >
                  {customerDisplayName}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '7px 16px', borderRadius: '9px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                  fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                LOGIN
              </button>
            )}
            <button
              onClick={() => navigate('/vehicles')}
              title="Explore Inventory"
              style={{
                padding: '7px 12px', borderRadius: '9px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', cursor: 'pointer',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── HERO COPY ── */}
        <div ref={heroCopyRef} style={{
          opacity: 0, position: 'relative', zIndex: 10,
          padding: '28px 40px 16px', maxWidth: '650px', flexShrink: 0,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '999px',
            background: 'rgba(190,242,100,0.08)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(190,242,100,0.22)',
            color: '#bef264', fontSize: '9px',
            fontFamily: 'Space Grotesk, monospace', fontWeight: 600,
            letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#bef264', animation: 'cc-pulse 2s infinite' }} />
            CARCRAFT DIGITAL COMMAND // SHOWROOM DOCKED
          </div>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 900,
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            color: '#fff', textTransform: 'uppercase',
            letterSpacing: '-0.025em', lineHeight: 0.92,
            textShadow: '0 6px 30px rgba(0,0,0,0.8)', margin: 0,
          }}>
            CARCRAFT
          </h2>
          <p style={{
            marginTop: '10px', fontFamily: 'Outfit, sans-serif', fontWeight: 300,
            fontSize: 'clamp(0.9rem, 1.8vw, 1.45rem)',
            color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.14em',
          }}>
            YOUR AUTOMOTIVE EXPERIENCE.
          </p>
          <p style={{ marginTop: '7px', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#94a3b8' }}>
            Everything your vehicle needs, in one place.
          </p>
        </div>

        {/* ── 4 FUNCTION CARDS ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          flex: 1, padding: '0 32px 18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          perspective: '1100px',
          perspectiveOrigin: 'center center',
          minHeight: 0,
        }}>
          <ShowCard
            cardRef={card1Ref}
            title="EXPLORE VEHICLES"
            subtitle="Discover premium hypercars and high-performance EVs."
            badge="Flagship"
            image={vehiclesImg}
            icon={Car}
            onClick={() => {
              navigate('/vehicles');
            }}
          />
          <ShowCard
            cardRef={card2Ref}
            title="PARTS & ACCESSORIES"
            subtitle="Upgrade and personalize your vehicle with OEM parts."
            badge="Performance"
            image={partsImg}
            icon={Wrench}
            onClick={() => {
              navigate('/parts');
            }}
          />
          <ShowCard
            cardRef={card3Ref}
            title="BOOK A SERVICE"
            subtitle="Professional automotive service, 120-point telemetry."
            badge="Certified"
            image={serviceImg}
            icon={Disc}
            onClick={() => {
              navigate('/service');
            }}
          />
          <ShowCard
            cardRef={card4Ref}
            title="SHOWROOM"
            subtitle="Explore the CARCRAFT 3D virtual showroom experience."
            badge="360° Studio"
            image={showroomImg}
            icon={Eye}
            onClick={() => {
              navigate('/showroom');
            }}
          />
        </div>

        {/* No scroll indicator — homepage is a self-contained cinematic scene */}
      </div>

      {/* Injected keyframe animations */}
      <style>{`
        @keyframes cc-ping  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.6)} }
        @keyframes cc-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes cc-bounce{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        @media(max-width:900px){
          div[style*="grid-template-columns: repeat(4, 1fr)"]{grid-template-columns:repeat(2,1fr)!important}
          nav{display:none!important}
        }
        @media(max-width:560px){
          div[style*="grid-template-columns: repeat(4, 1fr)"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}
