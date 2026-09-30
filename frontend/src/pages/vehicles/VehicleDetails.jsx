import { formatINR } from '../../utils/currency';
import { handleImageError } from '../../utils/imageFallback';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Layers, 
  Calendar, 
  PhoneCall, 
  CheckCircle2, 
  Zap, 
  Gauge, 
  ShieldCheck, 
  Compass, 
  Fuel, 
  X, 
  Sparkles,
  Share2,
  Clock,
  MapPin,
  Send,
  ArrowRight
} from 'lucide-react';
import { mockVehicles } from '../../data/vehicles';
import vehicleApi from '../../api/vehicleApi';
import testDriveApi from '../../api/testDriveApi';
import { normalizeVehicle } from '../../api/normalizers';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './VehicleDetails.css';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dbVehicle, setDbVehicle] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      vehicleApi.getVehicleById(id)
        .then((data) => {
          if (isMounted && data) {
            setDbVehicle(normalizeVehicle(data));
          }
        })
        .catch(() => {
          // If not in database, fallback to mock vehicle
          const fallback = mockVehicles.find((v) => String(v.id) === String(id));
          if (isMounted && fallback) {
            setDbVehicle(normalizeVehicle(fallback));
          }
        });
    }
    return () => { isMounted = false; };
  }, [id]);

  // Find current vehicle
  const vehicle = useMemo(() => {
    if (dbVehicle) return dbVehicle;
    const matched = mockVehicles.find((v) => String(v.id) === String(id));
    return normalizeVehicle(matched || mockVehicles[0]);
  }, [id, dbVehicle]);

  const [activeImage, setActiveImage] = useState(vehicle?.image || '');
  const [activeColor, setActiveColor] = useState(vehicle?.colors?.[0]?.name || vehicle?.color);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'features' | 'overview'

  // Modals state
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [testDriveConfirmed, setTestDriveConfirmed] = useState(false);
  const [testDriveId, setTestDriveId] = useState('');
  const [testDriveForm, setTestDriveForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: 'Morning (10:00 AM)',
    location: 'CARCRAFT Studio - Silicon Valley Hub',
  });

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactConfirmed, setContactConfirmed] = useState(false);
  const [contactId, setContactId] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in ordering the ${vehicle?.brand} ${vehicle?.model}. Please provide delivery allocations and custom bespoke options.`,
  });

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();
  const { addToast } = useToast();

  const isSaved = isInWishlist(vehicle?.id);
  const isCompared = isInCompare(vehicle?.id);

  // Gallery items including main image
  const galleryImages = useMemo(() => {
    if (!vehicle) return [];
    const set = new Set([vehicle.image, ...(vehicle.gallery || [])]);
    return Array.from(set);
  }, [vehicle]);

  // Similar vehicles (same category or body type, excluding current)
  const similarVehicles = useMemo(() => {
    return mockVehicles
      .filter((v) => String(v.id) !== String(vehicle?.id))
      .slice(0, 3)
      .map(normalizeVehicle);
  }, [vehicle]);

  // Reset active image when vehicle changes
  React.useEffect(() => {
    if (vehicle) {
      setActiveImage(vehicle.image);
      setActiveColor(vehicle?.colors?.[0]?.name || vehicle?.color);
      window.scrollTo(0, 0);
    }
  }, [vehicle]);

  if (!vehicle) {
    return (
      <div className="vehicle-details-page">
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Vehicle Not Found</h2>
          <Link to="/vehicles" className="vd-primary-cta" style={{ display: 'inline-flex', marginTop: '20px' }}>
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleWishlistToggle = () => {
    const added = toggleWishlist(vehicle);
    addToast(
      added ? `${vehicle.model} added to your wishlist` : `${vehicle.model} removed from your wishlist`,
      'success'
    );
  };

  const handleCompareToggle = () => {
    const result = addToCompare(vehicle);
    if (!result.success && result.action === 'limit') {
      addToast(result.message, 'error');
    } else {
      addToast(result.message, 'info');
    }
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    try {
      const vId = vehicle.rawId || (!isNaN(Number(vehicle.id)) ? Number(vehicle.id) : null);
      if (vId) {
        await testDriveApi.createTestDrive({
          vehicle: vId,
          preferred_date: testDriveForm.date || new Date().toISOString().split('T')[0],
          preferred_time: '10:00:00',
          phone: testDriveForm.phone || '9999999999',
          notes: `Hub: ${testDriveForm.location}. Pilot: ${testDriveForm.name} (${testDriveForm.email})`,
        });
      }
    } catch (err) {
      console.warn('Backend test drive registration notice:', err.message);
    }

    const randomId = 'CC-TD-' + Math.floor(100000 + Math.random() * 900000);
    setTestDriveId(randomId);
    setTestDriveConfirmed(true);
    addToast(`Test drive scheduled for ${vehicle.model}!`, 'success');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const randomId = 'CC-CN-' + Math.floor(100000 + Math.random() * 900000);
    setContactId(randomId);
    setContactConfirmed(true);
    addToast('Concierge inquiry submitted successfully', 'success');
  };


  return (
    <div className="vehicle-details-page">
      <Navbar />

      <main className="vehicle-details-container">
        {/* Top Navigation Row */}
        <div className="vd-top-nav">
          <Link to="/vehicles" className="vd-back-link">
            <ArrowLeft size={16} />
            BACK TO VEHICLES MARKETPLACE
          </Link>

          <div className="vd-top-actions">
            <button
              className={`vd-action-icon-btn ${isCompared ? 'active' : ''}`}
              onClick={handleCompareToggle}
              title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
            >
              <Layers size={16} />
              {isCompared ? 'COMPARED' : 'COMPARE'}
            </button>

            <button
              className={`vd-action-icon-btn ${isSaved ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart size={16} fill={isSaved ? '#bef264' : 'none'} color={isSaved ? '#bef264' : 'currentColor'} />
              {isSaved ? 'SAVED' : 'SAVE'}
            </button>
          </div>
        </div>

        {/* Main Grid: Gallery Left, Details Right */}
        <div className="vd-main-grid">
          {/* Gallery Column */}
          <div className="vd-gallery-col">
            <div className="vd-gallery-main">
              <img
                src={activeImage}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="vd-gallery-main-img"
              />
              {vehicle.badge && (
                <div className="vd-gallery-badge">
                  {vehicle.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="vd-thumbnails-strip">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`vd-thumbnail-btn ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`Thumb ${idx}`} onError={handleImageError} className="vd-thumbnail-img" />
                </button>
              ))}
            </div>
          </div>

          {/* Overview Column */}
          <div className="vd-overview-col">
            <div className="vd-brand-badge">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bef264' }} />
              {vehicle.brand} // {vehicle.year} SPECIFICATION
            </div>

            <h1 className="vd-title">{vehicle.model}</h1>
            <p className="vd-tagline">{vehicle.tagline || vehicle.category}</p>

            {/* Price Box */}
            <div className="vd-price-box">
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'Space Grotesk, monospace', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
                  VEHICLE BASE ACQUISITION
                </div>
                <div className="vd-price-amount">{vehicle.formattedPrice}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="vd-financing-note">
                  EST. {formatINR(Math.round(vehicle.price / 60))} / MO
                </div>
                <div style={{ fontSize: '11px', color: '#bef264', fontFamily: 'Space Grotesk, monospace', marginTop: '4px' }}>
                  {vehicle.inStock > 0 ? `${vehicle.inStock} ALLOCATIONS REMAINING` : 'RESERVE PRODUCTION'}
                </div>
              </div>
            </div>

            {/* Quick Telemetry Grid */}
            <div className="vd-telemetry-grid">
              <div className="vd-telemetry-card">
                <span className="vd-telemetry-label">HORSEPOWER</span>
                <span className="vd-telemetry-val">{vehicle.power}</span>
              </div>
              <div className="vd-telemetry-card">
                <span className="vd-telemetry-label">0-60 MPH</span>
                <span className="vd-telemetry-val">{vehicle.acceleration}</span>
              </div>
              <div className="vd-telemetry-card">
                <span className="vd-telemetry-label">TOP SPEED</span>
                <span className="vd-telemetry-val">{vehicle.topSpeed}</span>
              </div>
              <div className="vd-telemetry-card">
                <span className="vd-telemetry-label">RANGE / MILEAGE</span>
                <span className="vd-telemetry-val" style={{ color: '#ffffff' }}>{vehicle.mileage}</span>
              </div>
              <div className="vd-telemetry-card">
                <span className="vd-telemetry-label">POWERTRAIN</span>
                <span className="vd-telemetry-val" style={{ color: '#ffffff', fontSize: '1.05rem' }}>{vehicle.fuel}</span>
              </div>
              <div className="vd-telemetry-card">
                <span className="vd-telemetry-label">TRANSMISSION</span>
                <span className="vd-telemetry-val" style={{ color: '#ffffff', fontSize: '1.05rem' }}>{vehicle.transmission}</span>
              </div>
            </div>

            {/* Color Swatch Picker */}
            {vehicle.colors && vehicle.colors.length > 0 && (
              <div className="vd-color-section">
                <div className="vd-section-label">
                  EXTERIOR LIVERY: <span style={{ color: '#bef264' }}>{activeColor}</span>
                </div>
                <div className="vd-color-swatches">
                  {vehicle.colors.map((c) => (
                    <button
                      key={c.name}
                      className={`vd-swatch-btn ${activeColor === c.name ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setActiveColor(c.name)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="vd-cta-buttons">
              <button
                className="vd-primary-cta"
                onClick={() => {
                  setTestDriveConfirmed(false);
                  setShowTestDriveModal(true);
                }}
              >
                <Calendar size={18} />
                BOOK TEST DRIVE
              </button>

              <button
                className="vd-secondary-cta"
                onClick={() => {
                  setContactConfirmed(false);
                  setShowContactModal(true);
                }}
              >
                <PhoneCall size={17} />
                CONTACT DEALER / CONCIERGE
              </button>
            </div>
          </div>
        </div>

        {/* Deep Dive Tabs: Specifications, Features, Overview */}
        <section className="vd-deep-dive">
          <div className="vd-tabs-header">
            <button
              className={`vd-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              TECHNICAL SPECIFICATIONS
            </button>
            <button
              className={`vd-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              KEY ENGINEERING FEATURES
            </button>
            <button
              className={`vd-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              VEHICLE NARRATIVE
            </button>
          </div>

          <div className="vd-tab-content">
            {activeTab === 'specs' && (
              <table className="vd-specs-table">
                <tbody>
                  <tr>
                    <td>Engine / Powertrain</td>
                    <td>{vehicle.engine || vehicle.fuel}</td>
                  </tr>
                  <tr>
                    <td>Power Output</td>
                    <td>{vehicle.power} ({vehicle.torque})</td>
                  </tr>
                  <tr>
                    <td>Acceleration (0-60 mph)</td>
                    <td>{vehicle.acceleration}</td>
                  </tr>
                  <tr>
                    <td>Maximum Top Speed</td>
                    <td>{vehicle.topSpeed}</td>
                  </tr>
                  <tr>
                    <td>Drivetrain Configuration</td>
                    <td>{vehicle.drivetrain || 'All-Wheel Drive'}</td>
                  </tr>
                  <tr>
                    <td>Transmission</td>
                    <td>{vehicle.transmission}</td>
                  </tr>
                  <tr>
                    <td>Seating Capacity</td>
                    <td>{vehicle.seats} Passengers</td>
                  </tr>
                  {vehicle.specifications &&
                    Object.entries(vehicle.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{val}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {activeTab === 'features' && (
              <div className="vd-features-grid">
                {(vehicle.features || [
                  'High-Performance Carbon Monocoque Chassis',
                  'Active Aerodynamic Telemetry Package',
                  'Liquid-Cooled Fast-Charging Battery Platform',
                  'Spatial OLED Telemetry Instrument Cockpit',
                  'Brembo High-Performance Braking Calipers',
                  'Real-Time Connected Telematics via 5G eSIM'
                ]).map((feat, idx) => (
                  <div key={idx} className="vd-feature-card">
                    <div className="vd-feature-icon">
                      <Sparkles size={16} />
                    </div>
                    <div className="vd-feature-text">{feat}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'overview' && (
              <div style={{ maxWidth: '850px', lineHeight: 1.8, color: '#cbd5e1', fontSize: '1.05rem', fontFamily: 'Inter, sans-serif' }}>
                <p style={{ marginBottom: '16px' }}>{vehicle.description}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                  Every vehicle commissioned through CARCRAFT undergoes our rigorous 120-point diagnostic inspection, chassis laser alignment calibration, and factory-backed powertrain warranty certification. Bespoke delivery options are available worldwide.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Similar Vehicles Section */}
        <section className="vd-similar-section">
          <div className="vd-similar-header">
            <div className="vd-similar-badge">SIMILAR VEHICLES</div>
            <h2 className="vd-similar-title">EXPLORE RELATED MODELS</h2>
          </div>

          <div className="vd-similar-grid">
            {similarVehicles.map((sim) => (
              <div key={sim.id} className="vehicle-card" style={{ height: 'auto' }}>
                <div className="vehicle-card-media" style={{ height: '180px' }}>
                  <img src={sim.image} alt={sim.model} onError={handleImageError} className="vehicle-card-img" />
                  {sim.badge && <div className="vehicle-card-badge">{sim.badge}</div>}
                </div>
                <div className="vehicle-card-body" style={{ padding: '18px' }}>
                  <div className="vehicle-card-brand-row">
                    <span className="vehicle-card-brand">{sim.brand}</span>
                    <span className="vehicle-card-year">{sim.year}</span>
                  </div>
                  <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#fff', marginBottom: '8px' }}>
                    {sim.model}
                  </h4>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
                    {sim.formattedPrice}
                  </div>
                  <Link to={`/vehicles/${sim.id}`} className="vehicle-card-cta" style={{ padding: '10px' }}>
                    <span>VIEW DETAILS</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Book Test Drive Modal */}
      {showTestDriveModal && (
        <div className="modal-overlay" onClick={() => setShowTestDriveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowTestDriveModal(false)}>
              <X size={18} />
            </button>

            {!testDriveConfirmed ? (
              <>
                <div className="modal-header-badge">TEST DRIVE REQUEST // CARCRAFT PRIVATE ACCESS</div>
                <h3 className="modal-title">SCHEDULE TEST DRIVE</h3>
                <p className="modal-subtitle">
                  Experience the exhilarating response of the <strong>{vehicle.brand} {vehicle.model}</strong>. Quick book below or launch the{' '}
                  <Link to={`/test-drive?vehicle=${vehicle.id}`} style={{ color: '#bef264', textDecoration: 'underline', fontWeight: 600 }}>
                    Global Studio & Circuit Reservation Suite →
                  </Link>
                </p>

                <form className="modal-form" onSubmit={handleTestDriveSubmit}>
                  <div className="modal-form-group">
                    <label className="modal-form-label">FULL NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      className="modal-form-input"
                      value={testDriveForm.name}
                      onChange={(e) => setTestDriveForm({ ...testDriveForm, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="modal-form-group">
                      <label className="modal-form-label">PHONE NUMBER</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        className="modal-form-input"
                        value={testDriveForm.phone}
                        onChange={(e) => setTestDriveForm({ ...testDriveForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="modal-form-group">
                      <label className="modal-form-label">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        className="modal-form-input"
                        value={testDriveForm.email}
                        onChange={(e) => setTestDriveForm({ ...testDriveForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="modal-form-group">
                      <label className="modal-form-label">PREFERRED DATE</label>
                      <input
                        type="date"
                        required
                        className="modal-form-input"
                        value={testDriveForm.date}
                        onChange={(e) => setTestDriveForm({ ...testDriveForm, date: e.target.value })}
                      />
                    </div>
                    <div className="modal-form-group">
                      <label className="modal-form-label">PREFERRED TIME</label>
                      <select
                        className="modal-form-select"
                        value={testDriveForm.time}
                        onChange={(e) => setTestDriveForm({ ...testDriveForm, time: e.target.value })}
                      >
                        <option>Morning (10:00 AM)</option>
                        <option>Midday (01:00 PM)</option>
                        <option>Afternoon (03:30 PM)</option>
                        <option>Sunset Session (05:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-form-label">STUDIO LOCATION</label>
                    <select
                      className="modal-form-select"
                      value={testDriveForm.location}
                      onChange={(e) => setTestDriveForm({ ...testDriveForm, location: e.target.value })}
                    >
                      <option>CARCRAFT Studio - Silicon Valley Hub</option>
                      <option>CARCRAFT Studio - Manhattan Private Lounge</option>
                      <option>CARCRAFT Studio - Miami Speed Corridor</option>
                      <option>CARCRAFT Studio - Beverly Hills Gallery</option>
                    </select>
                  </div>

                  <button type="submit" className="modal-submit-btn">
                    CONFIRM TEST DRIVE BOOKING
                  </button>
                </form>
              </>
            ) : (
              <div className="modal-confirmed">
                <div className="modal-confirmed-icon">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="modal-title">TEST DRIVE REQUEST RECEIVED</h3>
                <div className="modal-confirmed-id">CONFIRMATION #{testDriveId}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Thank you, <strong>{testDriveForm.name}</strong>. Your test drive for the <strong>{vehicle.brand} {vehicle.model}</strong> on <strong>{testDriveForm.date || 'selected date'}</strong> at <strong>{testDriveForm.time}</strong> has been logged. Our concierge will contact you at <strong>{testDriveForm.phone}</strong> to finalize preparation.
                </p>
                <button className="modal-submit-btn" onClick={() => setShowTestDriveModal(false)}>
                  CLOSE CONFIRMATION
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Dealer / Concierge Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowContactModal(false)}>
              <X size={18} />
            </button>

            {!contactConfirmed ? (
              <>
                <div className="modal-header-badge">CLIENT CONCIERGE // VEHICLE ACQUISITION</div>
                <h3 className="modal-title">INQUIRE ABOUT THIS VEHICLE</h3>
                <p className="modal-subtitle">
                  Connect with a certified CARCRAFT specialist for bespoke configurations, international shipping, and delivery timelines for the <strong>{vehicle.brand} {vehicle.model}</strong>.
                </p>

                <form className="modal-form" onSubmit={handleContactSubmit}>
                  <div className="modal-form-group">
                    <label className="modal-form-label">FULL NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Drake"
                      className="modal-form-input"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="modal-form-group">
                      <label className="modal-form-label">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        className="modal-form-input"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                    <div className="modal-form-group">
                      <label className="modal-form-label">PHONE NUMBER</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        className="modal-form-input"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-form-label">MESSAGE / SPECIFIC REQUIREMENTS</label>
                    <textarea
                      rows="4"
                      className="modal-form-input"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="modal-submit-btn">
                    <Send size={16} style={{ display: 'inline', marginRight: '6px' }} />
                    SUBMIT INQUIRY TO CONCIERGE
                  </button>
                </form>
              </>
            ) : (
              <div className="modal-confirmed">
                <div className="modal-confirmed-icon">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="modal-title">INQUIRY DISPATCHED</h3>
                <div className="modal-confirmed-id">TICKET #{contactId}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Our senior automotive advisor has received your request regarding the <strong>{vehicle.brand} {vehicle.model}</strong>. We will contact you via email at <strong>{contactForm.email}</strong> within 2 hours.
                </p>
                <button className="modal-submit-btn" onClick={() => setShowContactModal(false)}>
                  RETURN TO VEHICLE
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
