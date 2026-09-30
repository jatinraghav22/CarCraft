import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Droplets, 
  Disc, 
  CircleDashed, 
  Zap, 
  Wind, 
  Activity, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Gauge,
  X,
  Car,
  User,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { mockServices } from '../../data/services';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Service.css';

// Icon Map for dynamic lookup
const serviceIconMap = {
  Wrench: Wrench,
  Droplets: Droplets,
  Disc: Disc,
  CircleDashed: CircleDashed,
  Zap: Zap,
  Wind: Wind,
  Activity: Activity,
  Compass: Compass,
  Sparkles: Sparkles,
  ShieldCheck: ShieldCheck
};

export default function Service() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Booking Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(mockServices[0]);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    serviceId: mockServices[0].id,
    customerName: '',
    email: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '2026',
    licensePlate: '',
    preferredDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      return d.toISOString().split('T')[0];
    })(),
    preferredTime: '10:00 AM - 12:00 PM',
    additionalNotes: ''
  });

  const categories = ['All', 'Diagnostics', 'Powertrain', 'Brakes & Chassis', 'Electrical & Battery', 'Detailing & Track'];

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'All') return mockServices;
    return mockServices.filter((s) => {
      const name = s.name.toLowerCase();
      const cat = s.category?.toLowerCase() || '';
      const query = selectedCategory.toLowerCase();
      if (query.includes('diagnostic')) return name.includes('diagnostic') || cat.includes('diagnostic');
      if (query.includes('powertrain')) return name.includes('powertrain') || name.includes('engine') || name.includes('fluid') || name.includes('spark');
      if (query.includes('brakes')) return name.includes('brake') || name.includes('alignment') || name.includes('suspension');
      if (query.includes('electrical')) return name.includes('battery') || name.includes('voltage') || name.includes('electric') || name.includes('ecu');
      if (query.includes('detailing')) return name.includes('detail') || name.includes('track') || name.includes('ceramic') || name.includes('concours');
      return true;
    });
  }, [selectedCategory]);

  const handleOpenBooking = (service) => {
    setSelectedService(service);
    setBookingForm((prev) => ({
      ...prev,
      serviceId: service.id
    }));
    setConfirmedBooking(null);
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (e) => {
    const sId = e.target.value;
    const found = mockServices.find((s) => s.id === sId);
    if (found) {
      setSelectedService(found);
      setBookingForm((prev) => ({ ...prev, serviceId: found.id }));
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const refCode = `CC-SRV-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedBooking({
      reference: refCode,
      serviceName: selectedService.name,
      estimatedPrice: selectedService.formattedPrice,
      duration: selectedService.duration,
      ...bookingForm
    });
  };

  return (
    <div className="service-page">
      <Navbar />

      <main className="service-container">
        {/* Hero Section */}
        <section className="service-hero">
          <div className="service-hero-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bef264' }} />
            FACTORY CERTIFIED TELEMETRY // 120-POINT AUDIT
          </div>
          <h1 className="service-hero-title">
            PRECISION SERVICE.<br />ENGINEERED FOR YOUR DRIVE.
          </h1>
          <p className="service-hero-subtitle">
            Factory-trained master technicians, non-contact wheel balancing, high-voltage battery diagnostic suites, and laser optical chassis alignment engineered to keep your hypercar operating at peak factory tolerance.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleOpenBooking(mockServices[0])}
              className="service-card-btn"
              style={{ background: '#bef264', color: '#080a08', padding: '14px 28px', fontSize: '0.9rem', cursor: 'pointer', border: 'none' }}
            >
              <Calendar size={18} />
              <span>BOOK A SERVICE NOW</span>
            </button>

            <Link
              to="/service/book"
              className="service-card-btn"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', padding: '14px 24px', fontSize: '0.9rem' }}
            >
              <span>6-STEP WIZARD</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Telemetry Metrics Row */}
        <div className="service-metrics-grid">
          <div className="service-metric-card">
            <div className="service-metric-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="service-metric-val">120-Point</div>
              <div className="service-metric-lbl">Full Diagnostic Scan</div>
            </div>
          </div>

          <div className="service-metric-card">
            <div className="service-metric-icon">
              <Gauge size={22} />
            </div>
            <div>
              <div className="service-metric-val">1,000 Hz</div>
              <div className="service-metric-lbl">CAN-bus Sensor Sampling</div>
            </div>
          </div>

          <div className="service-metric-card">
            <div className="service-metric-icon">
              <Wrench size={22} />
            </div>
            <div>
              <div className="service-metric-val">100% OEM</div>
              <div className="service-metric-lbl">Bespoke Hardware Only</div>
            </div>
          </div>

          <div className="service-metric-card">
            <div className="service-metric-icon">
              <Clock size={22} />
            </div>
            <div>
              <div className="service-metric-val">Same-Day</div>
              <div className="service-metric-lbl">Express Track Readiness</div>
            </div>
          </div>
        </div>

        {/* Service Categories Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#bef264', textTransform: 'uppercase', marginBottom: '8px' }}>
            SERVICE CATEGORIES
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  border: selectedCategory === cat ? '1px solid #bef264' : '1px solid rgba(255,255,255,0.1)',
                  background: selectedCategory === cat ? 'rgba(190, 242, 100, 0.14)' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === cat ? '#bef264' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section Title */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#bef264', textTransform: 'uppercase', marginBottom: '6px' }}>
            OFFICIAL WORKSHOP TIERS
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
            AVAILABLE SERVICE MODULES ({filteredServices.length})
          </h2>
        </div>

        {/* Services Cards Grid */}
        <div className="services-catalog-grid">
          {filteredServices.map((service) => {
            const IconComponent = serviceIconMap[service.iconName] || Wrench;

            return (
              <div key={service.id} className="service-card">
                <div className="service-card-top">
                  <div className="service-card-icon-box">
                    <IconComponent size={24} />
                  </div>
                  <span className="service-card-badge">{service.badge}</span>
                </div>

                <h3 className="service-card-title">{service.name}</h3>
                <p className="service-card-desc">{service.description}</p>

                {/* Features List */}
                <div className="service-card-features-list">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="service-feature-row">
                      <CheckCircle2 size={14} color="#bef264" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="service-card-footer">
                  <div className="service-card-pricing">
                    <span className="service-price-label">STARTING AT</span>
                    <span className="service-price-amount">{service.formattedPrice}</span>
                    <span className="service-duration-badge">
                      <Clock size={11} /> Est. {service.duration}
                    </span>
                  </div>

                  <button
                    className="service-card-btn"
                    onClick={() => handleOpenBooking(service)}
                  >
                    <span>BOOK SERVICE</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div style={{ marginTop: '48px', padding: '36px', borderRadius: '20px', background: 'rgba(13, 17, 24, 0.7)', border: '1px solid rgba(190, 242, 100, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: 700, color: '#bef264', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '6px' }}>
              NEED A BESPOKE CALIBRATION OR TRACK PREP?
            </div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
              CONTACT OUR MASTER TECHNICIAN CONCIERGE
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '600px', marginTop: '4px' }}>
              Our senior engineering directors provide tailored dyno tuning sessions, high-voltage battery refurbishment, and corner-weight chassis optimization.
            </p>
          </div>

          <button
            onClick={() => handleOpenBooking(mockServices[0])}
            className="service-card-btn"
            style={{ background: '#bef264', color: '#080a08', padding: '14px 28px', fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}
          >
            <span>BOOK ATELIER SERVICE</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          CUSTOMER SERVICE BOOKING MODAL & CONFIRMATION UI
          ══════════════════════════════════════════════════════════════════ */}
      {modalOpen && (
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
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              background: 'rgba(12, 16, 26, 0.96)',
              border: '1px solid rgba(190, 242, 100, 0.35)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(190, 242, 100, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
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

            {!confirmedBooking ? (
              /* Booking Form */
              <form onSubmit={handleBookingSubmit}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(190, 242, 100, 0.1)', padding: '4px 10px', borderRadius: '6px', color: '#bef264', fontSize: '11px', fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Wrench size={12} />
                  OFFICIAL WORKSHOP APPOINTMENT
                </div>

                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: '6px' }}>
                  BOOK A SERVICE
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '24px' }}>
                  Schedule your precision appointment with CARCRAFT certified master technicians.
                </p>

                {/* Section 1: Service Type Selection */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Selected Service Tier
                  </label>
                  <select
                    value={bookingForm.serviceId}
                    onChange={handleServiceSelect}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontFamily: 'Inter',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    {mockServices.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: '#0a0d14', color: '#fff' }}>
                        {s.name} ({s.formattedPrice} • Est. {s.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section 2: Customer Vehicle Information */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Customer Vehicle Information
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    <input
                      type="text"
                      name="vehicleMake"
                      placeholder="Make (e.g. Porsche)"
                      required
                      value={bookingForm.vehicleMake}
                      onChange={handleFormChange}
                      style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      name="vehicleModel"
                      placeholder="Model (e.g. 911 GT3)"
                      required
                      value={bookingForm.vehicleModel}
                      onChange={handleFormChange}
                      style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      name="vehicleYear"
                      placeholder="Year (e.g. 2026)"
                      required
                      value={bookingForm.vehicleYear}
                      onChange={handleFormChange}
                      style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      name="licensePlate"
                      placeholder="VIN / Plate #"
                      required
                      value={bookingForm.licensePlate}
                      onChange={handleFormChange}
                      style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Section 3: Preferred Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      required
                      value={bookingForm.preferredDate}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Preferred Time Slot
                    </label>
                    <select
                      name="preferredTime"
                      value={bookingForm.preferredTime}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="09:00 AM - 11:00 AM" style={{ background: '#0a0d14' }}>09:00 AM - 11:00 AM</option>
                      <option value="11:30 AM - 01:30 PM" style={{ background: '#0a0d14' }}>11:30 AM - 01:30 PM</option>
                      <option value="02:00 PM - 04:00 PM" style={{ background: '#0a0d14' }}>02:00 PM - 04:00 PM</option>
                      <option value="04:30 PM - 06:30 PM" style={{ background: '#0a0d14' }}>04:30 PM - 06:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Section 4: Customer Contact */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Alexander Vance"
                      required
                      value={bookingForm.customerName}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="client@domain.com"
                      required
                      value={bookingForm.email}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 019-2831"
                      required
                      value={bookingForm.phone}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Section 5: Additional Notes */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Additional Diagnostic Notes / Symptoms
                  </label>
                  <textarea
                    name="additionalNotes"
                    rows={3}
                    placeholder="Specify any unusual telemetry notifications, brake noise, or track prep requirements..."
                    value={bookingForm.additionalNotes}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      resize: 'none',
                      fontFamily: 'Inter'
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontFamily: 'Outfit',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 28px',
                      borderRadius: '8px',
                      background: '#bef264',
                      border: 'none',
                      color: '#080a08',
                      cursor: 'pointer',
                      fontFamily: 'Outfit',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>CONFIRM APPOINTMENT REQUEST</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Booking Confirmation UI */
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'rgba(190, 242, 100, 0.12)',
                    border: '2px solid #bef264',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    color: '#bef264'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <div style={{ fontFamily: 'Space Grotesk', fontSize: '11px', color: '#bef264', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  RESERVATION DOCKED IN MASTER WORKSHOP
                </div>

                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: '8px' }}>
                  SERVICE APPOINTMENT CONFIRMED
                </h3>

                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
                  Thank you, <strong style={{ color: '#fff' }}>{confirmedBooking.customerName}</strong>. Your workshop slot has been secured. A confirmation email and calendar invite have been dispatched.
                </p>

                {/* Summary Card */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '20px', textAlign: 'left', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'Space Grotesk' }}>BOOKING REFERENCE</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#bef264', fontFamily: 'Space Grotesk' }}>
                        {confirmedBooking.reference}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'Space Grotesk' }}>ESTIMATED FEE</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>
                        {confirmedBooking.estimatedPrice}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Service Module: </span>
                      <strong style={{ color: '#fff' }}>{confirmedBooking.serviceName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Vehicle: </span>
                      <strong style={{ color: '#fff' }}>
                        {confirmedBooking.vehicleYear} {confirmedBooking.vehicleMake} {confirmedBooking.vehicleModel}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Slot Date: </span>
                      <strong style={{ color: '#fff' }}>{confirmedBooking.preferredDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Slot Time: </span>
                      <strong style={{ color: '#fff' }}>{confirmedBooking.preferredTime}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      padding: '12px 28px',
                      borderRadius: '8px',
                      background: '#bef264',
                      border: 'none',
                      color: '#080a08',
                      cursor: 'pointer',
                      fontFamily: 'Outfit',
                      fontWeight: 700,
                      fontSize: '0.88rem'
                    }}
                  >
                    RETURN TO SERVICES
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
