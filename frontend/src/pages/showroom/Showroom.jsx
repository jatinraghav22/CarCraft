import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Sparkles, 
  Zap, 
  Gauge, 
  ArrowRight, 
  Sun, 
  Moon, 
  Compass, 
  Fuel, 
  ShieldCheck, 
  Maximize2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Phone,
  Mail,
  Car,
  KeyRound,
  RotateCcw,
  Volume2,
  Sliders,
  CheckCircle2,
  X,
  Radio,
  Share2
} from 'lucide-react';
import { mockVehicles } from '../../data/vehicles';
import { showroomZones, studioLightingThemes, showroomSpotlight } from '../../data/showroom';
import ShowroomStage3D from './ShowroomStage3D';
import { playEngineRevSound } from './engineAudio';
import { handleImageError } from '../../utils/imageFallback';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Showroom.css';

export default function Showroom() {
  const navigate = useNavigate();

  // Active zone tab
  const [activeZoneId, setActiveZoneId] = useState('featured');

  // Studio lighting theme
  const [activeThemeId, setActiveThemeId] = useState('neon');

  // Active spotlight vehicle on the 3D stage
  const [spotlightCar, setSpotlightCar] = useState(showroomSpotlight);
  const [spotlightImgIndex, setSpotlightImgIndex] = useState(0);

  // 3D Podium Auto-Rotate & Audio Rev State
  const [isRotating, setIsRotating] = useState(true);
  const [isRevving, setIsRevving] = useState(false);
  const [rpmValue, setRpmValue] = useState(900); // 900 idle -> 9200 peak

  // Active Paint Color
  const [activeColor, setActiveColor] = useState(
    spotlightCar.colors?.[0]?.hex || '#bef264'
  );

  // VIP Test Drive Modal State
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [testDriveVehicle, setTestDriveVehicle] = useState(spotlightCar);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Beverly Hills Flagship Atelier',
    date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      return d.toISOString().split('T')[0];
    })(),
    time: '11:00 AM - 01:00 PM',
    notes: ''
  });

  const currentTheme = useMemo(() => {
    return studioLightingThemes.find((t) => t.id === activeThemeId) || studioLightingThemes[0];
  }, [activeThemeId]);

  const activeZone = useMemo(() => {
    return showroomZones.find((z) => z.id === activeZoneId) || showroomZones[0];
  }, [activeZoneId]);

  // Resolve vehicles for the active zone
  const zoneVehicles = useMemo(() => {
    return activeZone.vehicleIds
      .map((id) => mockVehicles.find((v) => v.id === id))
      .filter(Boolean);
  }, [activeZone]);

  const spotlightGallery = useMemo(() => {
    return [spotlightCar.image, ...(spotlightCar.gallery || [])];
  }, [spotlightCar]);

  // Update color and reset angle when spotlight car changes
  useEffect(() => {
    setSpotlightImgIndex(0);
    setActiveColor(spotlightCar.colors?.[0]?.hex || '#bef264');
  }, [spotlightCar]);

  // Engine Rev Action
  const handleEngineRev = () => {
    if (isRevving) return;
    setIsRevving(true);
    playEngineRevSound();

    // Animate Tachometer to redline
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= 8) {
        setRpmValue((prev) => Math.min(9200, prev + 1050));
      } else if (step <= 18) {
        setRpmValue((prev) => Math.max(900, prev - 850));
      } else {
        clearInterval(interval);
        setRpmValue(900);
        setIsRevving(false);
      }
    }, 90);
  };

  const handleOpenTestDrive = (car) => {
    setTestDriveVehicle(car);
    setConfirmedReservation(null);
    setTestDriveModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const refCode = `VIP-SHW-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedReservation({
      reference: refCode,
      vehicle: `${testDriveVehicle.brand} ${testDriveVehicle.model}`,
      ...bookingForm
    });
  };

  // Studio Atelier Locations
  const studioLocations = [
    {
      name: 'CARCRAFT Beverly Hills Flagship',
      address: '9600 Wilshire Boulevard, Beverly Hills, CA 90212',
      hours: 'Mon – Sat: 09:00 AM – 08:00 PM | Sun: By Private Appointment',
      phone: '+1 (310) 849-2001',
      email: 'beverlyhills@carcraft.com',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      badge: 'Flagship Studio'
    },
    {
      name: 'CARCRAFT London Mayfair Atelier',
      address: '14 Berkeley Square, Mayfair, London W1J 6BL',
      hours: 'Mon – Sat: 10:00 AM – 07:00 PM | Sun: VIP Concierge Only',
      phone: '+44 20 7946 0912',
      email: 'mayfair@carcraft.com',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      badge: 'Bespoke Atelier'
    },
    {
      name: 'CARCRAFT Dubai Marina Cleanroom Studio',
      address: 'Tower 4, Marina Promenade, Dubai Marina, UAE',
      hours: 'Sun – Thu: 10:00 AM – 10:00 PM | Fri – Sat: 12:00 PM – 10:00 PM',
      phone: '+971 4 812 9000',
      email: 'dubai@carcraft.com',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      badge: 'High-Tech Studio'
    }
  ];

  return (
    <div className="showroom-page">
      {/* Studio Lighting Background Glow */}
      <div
        className="showroom-atmosphere-layer"
        style={{ background: currentTheme.bgGradient }}
      />

      <Navbar />

      <main className="showroom-container">
        {/* Top Controls Bar */}
        <div className="showroom-top-controls">
          <div className="showroom-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentTheme.accentColor }} />
            CARCRAFT 360° DIGITAL STUDIO // SHOWROOM DOCKED
          </div>

          {/* Studio Lighting Switcher */}
          <div className="showroom-theme-switcher">
            <span style={{ fontSize: '10px', fontFamily: 'Space Grotesk', color: '#64748b', padding: '0 8px', letterSpacing: '0.1em' }}>
              LIGHTING:
            </span>
            {studioLightingThemes.map((th) => (
              <button
                key={th.id}
                className={`showroom-theme-btn ${activeThemeId === th.id ? 'active' : ''}`}
                onClick={() => setActiveThemeId(th.id)}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: th.accentColor }} />
                {th.name}
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            CENTER STAGE: 3D TURNTABLE SPOTLIGHT PLATFORM
            ════════════════════════════════════════════════════ */}
        <section className="showroom-spotlight-stage">
          <div className="showroom-stage-grid">
            {/* Stage Media Column with Three.js WebGL Turntable */}
            <div className="showroom-stage-media">
              {/* Three.js 3D WebGL Canvas Layer */}
              <ShowroomStage3D
                accentColor={activeColor || currentTheme.accentColor}
                isRotating={isRotating}
              />

              {/* Vehicle Floating Stage Image */}
              <div className="showroom-stage-vehicle-wrap">
                <img
                  src={spotlightGallery[spotlightImgIndex] || spotlightCar.image}
                  alt={spotlightCar.model}
                  onError={handleImageError}
                  className="showroom-stage-hero-img"
                  style={{
                    filter: `drop-shadow(0 25px 35px rgba(0,0,0,0.95)) drop-shadow(0 0 25px ${activeColor}33)`
                  }}
                />
              </div>

              {/* Telemetry Floating HUD Chips */}
              <div className="showroom-stage-telemetry-overlay">
                <div className="showroom-telemetry-chip">
                  <span className="showroom-telemetry-label">0-60 MPH</span>
                  <span className="showroom-telemetry-value" style={{ color: activeColor }}>
                    {spotlightCar.acceleration}
                  </span>
                </div>

                <div className="showroom-telemetry-chip">
                  <span className="showroom-telemetry-label">HORSEPOWER</span>
                  <span className="showroom-telemetry-value" style={{ color: activeColor }}>
                    {spotlightCar.power}
                  </span>
                </div>

                <div className="showroom-telemetry-chip">
                  <span className="showroom-telemetry-label">TOP SPEED</span>
                  <span className="showroom-telemetry-value" style={{ color: activeColor }}>
                    {spotlightCar.topSpeed}
                  </span>
                </div>

                {/* Tachometer / Sound Rev Button */}
                <div
                  className="showroom-telemetry-chip"
                  onClick={handleEngineRev}
                  style={{
                    cursor: 'pointer',
                    background: isRevving ? 'rgba(190, 242, 100, 0.15)' : 'rgba(6, 8, 12, 0.85)',
                    border: isRevving ? `1px solid ${activeColor}` : '1px solid rgba(255,255,255,0.12)',
                    transition: 'all 0.2s'
                  }}
                  title="Click to rev engine sound simulator"
                >
                  <span className="showroom-telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Volume2 size={11} color={activeColor} />
                    {isRevving ? 'REVVIING...' : 'REV ENGINE'}
                  </span>
                  <span className="showroom-telemetry-value" style={{ color: isRevving ? '#ef4444' : activeColor, fontSize: '0.95rem' }}>
                    {rpmValue.toLocaleString()} RPM
                  </span>
                </div>
              </div>

              {/* View Angles Selector (Front, Side, Rear, Cockpit) */}
              {spotlightGallery.length > 1 && (
                <div className="showroom-stage-angles-bar">
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['FRONT 3/4', 'PROFILE', 'REAR QUARTER', 'COCKPIT'].slice(0, spotlightGallery.length).map((label, idx) => (
                      <button
                        key={idx}
                        className={`showroom-angle-pill ${spotlightImgIndex === idx ? 'active' : ''}`}
                        onClick={() => setSpotlightImgIndex(idx)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Auto-Spin Toggle */}
                  <button
                    className={`showroom-auto-spin-btn ${isRotating ? 'active' : ''}`}
                    onClick={() => setIsRotating(!isRotating)}
                    title="Toggle Turntable Rotation"
                  >
                    <RotateCcw size={13} style={{ animation: isRotating ? 'spin 4s linear infinite' : 'none' }} />
                    <span>{isRotating ? 'ROTATING' : 'PAUSED'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Stage Info Column */}
            <div className="showroom-stage-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="showroom-stage-brand">{spotlightCar.brand}</span>
                <span className="showroom-stage-badge">{spotlightCar.badge || 'ATELIER ALLOCATION'}</span>
              </div>

              <h1 className="showroom-stage-title">{spotlightCar.model}</h1>
              <p className="showroom-stage-desc">{spotlightCar.description}</p>

              {/* Interactive Paint Customizer Swatches */}
              {spotlightCar.colors && spotlightCar.colors.length > 0 && (
                <div style={{ margin: '18px 0 22px' }}>
                  <div style={{ fontSize: '10px', fontFamily: 'Space Grotesk', color: '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    BESPOKE EXTERIOR FINISH
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {spotlightCar.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveColor(c.hex)}
                        title={c.name}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: c.hex,
                          border: activeColor === c.hex ? '2px solid #fff' : '2px solid rgba(255,255,255,0.15)',
                          boxShadow: activeColor === c.hex ? `0 0 14px ${c.hex}` : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          transform: activeColor === c.hex ? 'scale(1.15)' : 'scale(1)'
                        }}
                      />
                    ))}
                    <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginLeft: '6px' }}>
                      {spotlightCar.colors.find((c) => c.hex === activeColor)?.name || 'Custom Finish'}
                    </span>
                  </div>
                </div>
              )}

              {/* Specifications Matrix */}
              <div className="showroom-specs-box-grid">
                <div className="showroom-spec-item">
                  <Zap size={16} color={activeColor} />
                  <div>
                    <div className="showroom-spec-sub">DRIVETRAIN</div>
                    <div className="showroom-spec-main">{spotlightCar.drivetrain || 'Torque Vectoring'}</div>
                  </div>
                </div>

                <div className="showroom-spec-item">
                  <Compass size={16} color={activeColor} />
                  <div>
                    <div className="showroom-spec-sub">POWERTRAIN</div>
                    <div className="showroom-spec-main">{spotlightCar.fuelType || spotlightCar.fuel}</div>
                  </div>
                </div>

                <div className="showroom-spec-item">
                  <ShieldCheck size={16} color={activeColor} />
                  <div>
                    <div className="showroom-spec-sub">CHASSIS</div>
                    <div className="showroom-spec-main">Carbon Monocoque</div>
                  </div>
                </div>

                <div className="showroom-spec-item">
                  <Gauge size={16} color={activeColor} />
                  <div>
                    <div className="showroom-spec-sub">TORQUE</div>
                    <div className="showroom-spec-main">{spotlightCar.torque || '1,420 Nm'}</div>
                  </div>
                </div>
              </div>

              {/* Valuation & Action CTAs */}
              <div className="showroom-stage-cta-footer">
                <div>
                  <div style={{ fontSize: '10px', fontFamily: 'Space Grotesk', color: '#64748b', letterSpacing: '0.12em' }}>
                    STARTING ESTIMATE
                  </div>
                  <div className="showroom-stage-price">{spotlightCar.formattedPrice}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link
                    to={`/vehicles/${spotlightCar.id}`}
                    className="showroom-cta-btn primary"
                    style={{ background: activeColor, color: '#080a08' }}
                  >
                    <span>VIEW 3D VEHICLE</span>
                    <ArrowRight size={15} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleOpenTestDrive(spotlightCar)}
                    className="showroom-cta-btn secondary"
                  >
                    <KeyRound size={15} />
                    <span>BOOK TEST DRIVE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Turntable Dock (Switch Cars directly on Stage) */}
          <div className="showroom-stage-dock">
            <span className="showroom-stage-dock-lbl">DOCK ON TURNTABLE:</span>
            <div className="showroom-stage-dock-list">
              {mockVehicles.slice(0, 6).map((car) => (
                <button
                  key={car.id}
                  className={`showroom-dock-card ${spotlightCar.id === car.id ? 'active' : ''}`}
                  onClick={() => {
                    setSpotlightCar(car);
                  }}
                >
                  <img src={car.image} alt={car.model} onError={handleImageError} />
                  <div className="showroom-dock-info">
                    <span className="showroom-dock-name">{car.model}</span>
                    <span className="showroom-dock-hp">{car.power}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SHOWROOM ZONES / CATEGORY TABS
            ════════════════════════════════════════════════════ */}
        <section className="showroom-zones-nav">
          {showroomZones.map((zone) => (
            <button
              key={zone.id}
              className={`showroom-zone-tab ${activeZoneId === zone.id ? 'active' : ''}`}
              onClick={() => setActiveZoneId(zone.id)}
            >
              <span className="showroom-zone-tab-badge">{zone.badge}</span>
              <span className="showroom-zone-tab-title">{zone.title}</span>
            </button>
          ))}
        </section>

        {/* Active Zone Description Header */}
        <div className="showroom-zone-info">
          <div className="showroom-zone-badge">{activeZone.badge}</div>
          <h2 className="showroom-zone-title">{activeZone.title}</h2>
          <p className="showroom-zone-desc">{activeZone.subtitle}</p>
        </div>

        {/* 3D-Perspective Showroom Cards Grid */}
        <div className="showroom-cards-grid">
          {zoneVehicles.map((car) => (
            <div
              key={car.id}
              className="showroom-3d-card"
              onClick={() => {
                setSpotlightCar(car);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            >
              {/* Media */}
              <div className="showroom-3d-card-media">
                <img src={car.image} alt={car.model} onError={handleImageError} className="showroom-3d-card-img" />
                {car.badge && (
                  <div className="showroom-3d-card-badge">{car.badge}</div>
                )}
                <button
                  type="button"
                  className="showroom-card-dock-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSpotlightCar(car);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  title="Load onto 3D Turntable"
                >
                  <RotateCcw size={12} />
                  <span>DOCK ON STAGE</span>
                </button>
              </div>

              {/* Body */}
              <div className="showroom-3d-card-body">
                <div className="showroom-3d-card-brand-row">
                  <span className="showroom-3d-card-brand">{car.brand}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#64748b' }}>
                    {car.year}
                  </span>
                </div>

                <h3 className="showroom-3d-card-title">{car.model}</h3>

                {/* Specs Strip */}
                <div className="showroom-3d-card-specs">
                  <div className="showroom-card-spec-item">
                    <span className="showroom-card-spec-lbl">OUTPUT</span>
                    <span className="showroom-card-spec-val">{car.power}</span>
                  </div>
                  <div className="showroom-card-spec-item">
                    <span className="showroom-card-spec-lbl">0-60 MPH</span>
                    <span className="showroom-card-spec-val">{car.acceleration}</span>
                  </div>
                  <div className="showroom-card-spec-item">
                    <span className="showroom-card-spec-lbl">TOP SPEED</span>
                    <span className="showroom-card-spec-val">{car.topSpeed}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="showroom-3d-card-footer">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="showroom-3d-card-price">{car.formattedPrice}</span>
                    <span style={{ fontSize: '11px', color: '#bef264', fontFamily: 'Space Grotesk' }}>
                      IN STOCK: {car.inStock || 2}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Link
                      to={`/vehicles/${car.id}`}
                      className="showroom-3d-card-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>VIEW VEHICLE</span>
                      <ArrowRight size={13} />
                    </Link>

                    <button
                      type="button"
                      className="showroom-3d-card-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTestDrive(car);
                      }}
                      style={{
                        background: 'rgba(190, 242, 100, 0.1)',
                        border: '1px solid rgba(190, 242, 100, 0.3)',
                        color: '#bef264'
                      }}
                    >
                      <KeyRound size={13} />
                      <span>TEST DRIVE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            SHOWROOM ATELIER LOCATIONS & OPENING HOURS
            ════════════════════════════════════════════════════ */}
        <section style={{ marginTop: '72px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#bef264', textTransform: 'uppercase', marginBottom: '8px' }}>
              GLOBAL ATELIER NETWORK
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
              SHOWROOM LOCATIONS & OPENING HOURS
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '640px' }}>
              Experience the pinnacle of automotive craftsmanship in person. Each CARCRAFT Atelier features cleanroom delivery suites, private VIP lounges, and dedicated private track slots.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {studioLocations.map((loc, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(14, 18, 28, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={loc.image}
                    alt={loc.name}
                    onError={handleImageError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(14, 18, 28, 0.95) 100%)' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      fontSize: '10px',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 700,
                      color: '#bef264',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {loc.badge}
                  </span>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
                      {loc.name}
                    </h3>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px', fontSize: '0.84rem', color: '#94a3b8' }}>
                      <MapPin size={16} color="#bef264" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{loc.address}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px', fontSize: '0.84rem', color: '#94a3b8' }}>
                      <Clock size={16} color="#bef264" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{loc.hours}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', fontSize: '0.84rem', color: '#94a3b8' }}>
                      <Phone size={15} color="#bef264" />
                      <span>{loc.phone}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.84rem', color: '#94a3b8' }}>
                      <Mail size={15} color="#bef264" />
                      <span>{loc.email}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link
                      to="/dealerships"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 700,
                        color: '#bef264',
                        textDecoration: 'none',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}
                    >
                      <span>VIEW ATELIER DETAILS</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Showroom Concierge CTA Strip */}
          <div
            style={{
              marginTop: '40px',
              padding: '36px',
              borderRadius: '20px',
              background: 'rgba(14, 18, 28, 0.85)',
              border: '1px solid rgba(190, 242, 100, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px'
            }}
          >
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: 700, color: '#bef264', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '6px' }}>
                PRIVATE VEHICLE COMMISSIONING & TRACK SLOTS
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
                SCHEDULE A PRIVATE VIP SHOWROOM VIEWING
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '640px', marginTop: '6px' }}>
                Receive full white-glove concierge access, personal consultation with our automotive design leads, and an uninterrupted private track inspection.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleOpenTestDrive(spotlightCar)}
                style={{
                  padding: '14px 26px',
                  borderRadius: '10px',
                  background: '#bef264',
                  color: '#080a08',
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <KeyRound size={16} />
                <span>BOOK VIP TEST DRIVE</span>
              </button>

              <Link
                to="/vehicles"
                style={{
                  padding: '14px 24px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Car size={16} />
                <span>EXPLORE ALL VEHICLES</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════════
          VIP TEST DRIVE & SHOWROOM RESERVATION MODAL
          ════════════════════════════════════════════════════ */}
      {testDriveModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 5, 10, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setTestDriveModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '620px',
              background: 'rgba(12, 16, 26, 0.96)',
              border: '1px solid rgba(190, 242, 100, 0.35)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.85)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setTestDriveModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {!confirmedReservation ? (
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(190, 242, 100, 0.1)', padding: '4px 10px', borderRadius: '6px', color: '#bef264', fontSize: '11px', fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <KeyRound size={12} />
                  VIP CONCIERGE TRACK ALLOCATION
                </div>

                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: '6px' }}>
                  BOOK PRIVATE TEST DRIVE
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
                  Experience the <strong style={{ color: '#fff' }}>{testDriveVehicle.brand} {testDriveVehicle.model}</strong> under full telemetry guidance.
                </p>

                {/* Form fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alexander Vance"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@domain.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2831"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Preferred Atelier
                    </label>
                    <select
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="Beverly Hills Flagship Atelier" style={{ background: '#0a0d14' }}>Beverly Hills Flagship</option>
                      <option value="London Mayfair Atelier" style={{ background: '#0a0d14' }}>London Mayfair Atelier</option>
                      <option value="Dubai Marina Cleanroom Studio" style={{ background: '#0a0d14' }}>Dubai Marina Studio</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Time Window
                    </label>
                    <select
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="09:00 AM - 11:00 AM" style={{ background: '#0a0d14' }}>09:00 AM - 11:00 AM (Morning)</option>
                      <option value="11:30 AM - 01:30 PM" style={{ background: '#0a0d14' }}>11:30 AM - 01:30 PM (Midday)</option>
                      <option value="02:30 PM - 04:30 PM" style={{ background: '#0a0d14' }}>02:30 PM - 04:30 PM (Afternoon)</option>
                      <option value="05:00 PM - 07:00 PM" style={{ background: '#0a0d14' }}>05:00 PM - 07:00 PM (Sunset Track)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setTestDriveModalOpen(false)}
                    style={{ padding: '12px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '12px 28px', borderRadius: '8px', background: '#bef264', border: 'none', color: '#080a08', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <CheckCircle2 size={16} />
                    <span>CONFIRM VIP RESERVATION</span>
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(190, 242, 100, 0.12)', border: '2px solid #bef264', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#bef264' }}>
                  <CheckCircle2 size={32} />
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '11px', color: '#bef264', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  RESERVATION RECORD SECURED
                </div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: '8px' }}>
                  VIP TEST DRIVE CONFIRMED
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                  A personal concierge liaison has been assigned to prepare the <strong style={{ color: '#fff' }}>{confirmedReservation.vehicle}</strong> for your arrival.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px', textAlign: 'left', marginBottom: '22px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span style={{ color: '#64748b' }}>PASSCODE REF:</span>
                    <strong style={{ color: '#bef264', fontFamily: 'Space Grotesk' }}>{confirmedReservation.reference}</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><span style={{ color: '#64748b' }}>Guest: </span><strong style={{ color: '#fff' }}>{confirmedReservation.name}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Atelier: </span><strong style={{ color: '#fff' }}>{confirmedReservation.location}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Date: </span><strong style={{ color: '#fff' }}>{confirmedReservation.date}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Window: </span><strong style={{ color: '#fff' }}>{confirmedReservation.time}</strong></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTestDriveModalOpen(false)}
                  style={{ padding: '12px 28px', borderRadius: '8px', background: '#bef264', border: 'none', color: '#080a08', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 700 }}
                >
                  RETURN TO SHOWROOM
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
