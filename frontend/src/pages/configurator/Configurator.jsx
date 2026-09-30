import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sliders, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Bookmark, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Calendar,
  CheckCircle2,
  Car
} from 'lucide-react';
import { mockVehicles } from '../../data/vehicles';
import { 
  paintFinishes, 
  wheelOptions, 
  caliperColors, 
  interiorThemes, 
  carbonPacks 
} from '../../data/configuratorOptions';
import { formatINR } from '../../utils/currency';
import { handleImageError } from '../../utils/imageFallback';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Configurator.css';

export default function Configurator() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Active baseline car
  const [selectedVehicleId, setSelectedVehicleId] = useState(mockVehicles[0].id);

  // Active configuration options
  const [selectedPaintId, setSelectedPaintId] = useState(paintFinishes[0].id);
  const [selectedWheelId, setSelectedWheelId] = useState(wheelOptions[0].id);
  const [selectedCaliperId, setSelectedCaliperId] = useState(caliperColors[0].id);
  const [selectedInteriorId, setSelectedInteriorId] = useState(interiorThemes[0].id);
  const [selectedCarbonPacks, setSelectedCarbonPacks] = useState([carbonPacks[0].id]);

  // Active studio category tab ('paint' | 'wheels' | 'interior' | 'packages')
  const [activeTab, setActiveTab] = useState('paint');

  // Resolved entities
  const vehicle = useMemo(() => {
    return mockVehicles.find((v) => v.id === selectedVehicleId) || mockVehicles[0];
  }, [selectedVehicleId]);

  const paint = useMemo(() => {
    return paintFinishes.find((p) => p.id === selectedPaintId) || paintFinishes[0];
  }, [selectedPaintId]);

  const wheel = useMemo(() => {
    return wheelOptions.find((w) => w.id === selectedWheelId) || wheelOptions[0];
  }, [selectedWheelId]);

  const caliper = useMemo(() => {
    return caliperColors.find((c) => c.id === selectedCaliperId) || caliperColors[0];
  }, [selectedCaliperId]);

  const interior = useMemo(() => {
    return interiorThemes.find((i) => i.id === selectedInteriorId) || interiorThemes[0];
  }, [selectedInteriorId]);

  // Carbon pack toggle
  const toggleCarbonPack = (id) => {
    setSelectedCarbonPacks((prev) => 
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Live total price computation
  const totalPrice = useMemo(() => {
    const base = vehicle.price || 250000;
    const paintCost = paint.price || 0;
    const wheelCost = wheel.price || 0;
    const caliperCost = caliper.price || 0;
    const intCost = interior.price || 0;
    const packCost = selectedCarbonPacks.reduce((acc, packId) => {
      const p = carbonPacks.find((item) => item.id === packId);
      return acc + (p?.price || 0);
    }, 0);
    return base + paintCost + wheelCost + caliperCost + intCost + packCost;
  }, [vehicle, paint, wheel, caliper, interior, selectedCarbonPacks]);

  // Save custom build to localStorage
  const handleSaveBuild = () => {
    const build = {
      id: `BUILD-${Date.now()}`,
      vehicleModel: vehicle.model,
      vehicleBrand: vehicle.brand,
      paintName: paint.name,
      wheelName: wheel.name,
      interiorName: interior.name,
      totalPrice,
      date: new Date().toLocaleDateString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('carcraft_saved_builds') || '[]');
      existing.unshift(build);
      localStorage.setItem('carcraft_saved_builds', JSON.stringify(existing));
      addToast(`Bespoke ${vehicle.model} saved to your Garage!`, 'success');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="config-page">
      <div className="config-ambient" />
      <Navbar />

      <main className="config-container">
        {/* Header */}
        <div className="config-header-row">
          <div>
            <div className="config-badge">
              <Sparkles size={13} />
              CARCRAFT ATELIER // BESPOKE 3D CONFIGURATOR
            </div>
            <h1 className="config-title">Tailor Your Commission</h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="config-cta-secondary" onClick={handleSaveBuild}>
              <Bookmark size={15} />
              <span>SAVE BUILD</span>
            </button>
            <Link to={`/test-drive?vehicle=${vehicle.id}`} className="config-cta-primary">
              <Calendar size={15} />
              <span>COMMISSION ALLOCATION</span>
            </Link>
          </div>
        </div>

        {/* Model Switcher Bar */}
        <div className="config-model-switcher">
          {mockVehicles.slice(0, 6).map((car) => (
            <button
              key={car.id}
              className={`config-model-btn ${selectedVehicleId === car.id ? 'active' : ''}`}
              onClick={() => setSelectedVehicleId(car.id)}
            >
              {car.model}
            </button>
          ))}
        </div>

        {/* Studio Layout */}
        <div className="config-studio-grid">
          {/* Left Stage Viewport */}
          <div className="config-stage-card">
            <div className="config-canvas-viewport">
              <img
                src={paint.previewImg || vehicle.image}
                alt={vehicle.model}
                onError={handleImageError}
                className="config-car-hero-img"
              />

              {/* Holographic Specification Overlay */}
              <div className="config-stage-overlay-tags">
                <span className="config-stage-tag">{vehicle.brand} {vehicle.model}</span>
                <span className="config-stage-tag" style={{ color: '#bef264' }}>
                  {paint.name} ({paint.category})
                </span>
                <span className="config-stage-tag">{wheel.name}</span>
                <span className="config-stage-tag">{interior.name}</span>
              </div>
            </div>

            {/* Price Summary Bar */}
            <div className="config-price-summary-bar">
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#94a3b8' }}>TOTAL BESPOKE COMMISSION</span>
                <div className="config-total-price">
                  {formatINR(totalPrice)}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Est. Finance {formatINR(Math.round(totalPrice / 60))} / mo
              </div>
            </div>
          </div>

          {/* Right Controls Deck */}
          <div className="config-controls-card">
            {/* Category Tabs */}
            <div className="config-section-tabs">
              <button
                className={`config-sec-tab ${activeTab === 'paint' ? 'active' : ''}`}
                onClick={() => setActiveTab('paint')}
              >
                Paint
              </button>
              <button
                className={`config-sec-tab ${activeTab === 'wheels' ? 'active' : ''}`}
                onClick={() => setActiveTab('wheels')}
              >
                Wheels
              </button>
              <button
                className={`config-sec-tab ${activeTab === 'interior' ? 'active' : ''}`}
                onClick={() => setActiveTab('interior')}
              >
                Interior
              </button>
              <button
                className={`config-sec-tab ${activeTab === 'packages' ? 'active' : ''}`}
                onClick={() => setActiveTab('packages')}
              >
                Packs
              </button>
            </div>

            {/* TAB 1: PAINT */}
            {activeTab === 'paint' && (
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', margin: '0 0 12px', color: '#fff' }}>
                  Atelier Exterior Colors
                </h3>
                <div className="config-swatches-grid">
                  {paintFinishes.map((p) => (
                    <div
                      key={p.id}
                      className={`config-swatch-card ${selectedPaintId === p.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPaintId(p.id)}
                    >
                      <div className="config-color-circle" style={{ background: p.hex }} />
                      <div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.84rem', color: '#fff' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: p.price === 0 ? '#bef264' : '#94a3b8' }}>
                          {p.price === 0 ? 'Standard' : `+${formatINR(p.price)}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', margin: '20px 0 12px', color: '#fff' }}>
                  Brake Caliper Finishes
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {caliperColors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCaliperId(c.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: selectedCaliperId === c.id ? '1px solid #bef264' : '1px solid rgba(255,255,255,0.1)',
                        background: selectedCaliperId === c.id ? 'rgba(190,242,100,0.1)' : 'rgba(255,255,255,0.02)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontFamily: 'Space Grotesk'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: WHEELS */}
            {activeTab === 'wheels' && (
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', margin: '0 0 12px', color: '#fff' }}>
                  Forged Aerodynamic Wheels
                </h3>
                {wheelOptions.map((w) => (
                  <div
                    key={w.id}
                    className={`config-option-item ${selectedWheelId === w.id ? 'selected' : ''}`}
                    onClick={() => setSelectedWheelId(w.id)}
                  >
                    <div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                        {w.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
                        {w.desc}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: w.price === 0 ? '#bef264' : '#fff', fontSize: '0.9rem' }}>
                      {w.price === 0 ? 'Standard' : `+${formatINR(w.price)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: INTERIOR */}
            {activeTab === 'interior' && (
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', margin: '0 0 12px', color: '#fff' }}>
                  Bespoke Cockpit Upholstery
                </h3>
                {interiorThemes.map((it) => (
                  <div
                    key={it.id}
                    className={`config-option-item ${selectedInteriorId === it.id ? 'selected' : ''}`}
                    onClick={() => setSelectedInteriorId(it.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: it.hex, border: '1px solid rgba(255,255,255,0.3)' }} />
                      <div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                          {it.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
                          {it.desc}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: it.price === 0 ? '#bef264' : '#fff', fontSize: '0.9rem' }}>
                      {it.price === 0 ? 'Standard' : `+${formatINR(it.price)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: CARBON PACKS */}
            {activeTab === 'packages' && (
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', margin: '0 0 12px', color: '#fff' }}>
                  Performance & Carbon Packages
                </h3>
                {carbonPacks.map((cp) => {
                  const isChecked = selectedCarbonPacks.includes(cp.id);
                  return (
                    <div
                      key={cp.id}
                      className={`config-option-item ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleCarbonPack(cp.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? '1px solid #bef264' : '1px solid rgba(255,255,255,0.2)',
                            background: isChecked ? '#bef264' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '2px'
                          }}
                        >
                          {isChecked && <Check size={12} color="#080a08" />}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                            {cp.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
                            {cp.desc}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#bef264', fontSize: '0.9rem' }}>
                        +{formatINR(cp.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
