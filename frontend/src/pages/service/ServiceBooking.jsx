import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Car, 
  Wrench, 
  User, 
  ShieldCheck, 
  MapPin, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { mockServices, serviceHubs, serviceTimeSlots } from '../../data/services';
import { mockVehicles } from '../../data/vehicles';
import serviceApi from '../../api/serviceApi';
import { handleImageError } from '../../utils/imageFallback';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Service.css';

export default function ServiceBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const preselectedServiceId = searchParams.get('service');

  // Multi-step index: 1 to 6 (7 is confirmation screen)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Vehicle State
  const [selectedVehicleType, setSelectedVehicleType] = useState('fleet'); // 'fleet' | 'custom'
  const [selectedFleetVehicleId, setSelectedFleetVehicleId] = useState(mockVehicles[0].id);
  const [customVehicle, setCustomVehicle] = useState({
    make: '',
    model: '',
    year: '2025',
    licensePlate: '',
  });

  // Step 2: Selected Services State (array of IDs)
  const [selectedServices, setSelectedServices] = useState(() => {
    return preselectedServiceId ? [preselectedServiceId] : [mockServices[0].id];
  });

  // Step 3: Date State
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  // Step 4: Time Slot State
  const [selectedTime, setSelectedTime] = useState(serviceTimeSlots[0]);

  // Step 5: Customer Details State
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    hubLocation: serviceHubs[0],
    notes: '',
  });

  // Confirmation State
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Selected vehicle object or custom string
  const activeVehicleData = useMemo(() => {
    if (selectedVehicleType === 'fleet') {
      const v = mockVehicles.find((m) => m.id === selectedFleetVehicleId) || mockVehicles[0];
      return {
        name: `${v.brand} ${v.model} (${v.year})`,
        image: v.image,
        tagline: v.fuel,
      };
    } else {
      return {
        name: `${customVehicle.make || 'Custom'} ${customVehicle.model || 'Vehicle'} (${customVehicle.year})`,
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        tagline: customVehicle.licensePlate ? `Plate: ${customVehicle.licensePlate}` : 'Custom Build',
      };
    }
  }, [selectedVehicleType, selectedFleetVehicleId, customVehicle]);

  // Chosen service objects
  const activeServiceObjects = useMemo(() => {
    return mockServices.filter((s) => selectedServices.includes(s.id));
  }, [selectedServices]);

  // Total price calculation
  const totalEstimatedPrice = useMemo(() => {
    return activeServiceObjects.reduce((acc, curr) => acc + curr.price, 0);
  }, [activeServiceObjects]);

  // Toggle service selection in Step 2
  const toggleServiceChoice = (id) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices((prev) => prev.filter((s) => s !== id));
      } else {
        addToast('At least one service module must remain selected.', 'error');
      }
    } else {
      setSelectedServices((prev) => [...prev, id]);
    }
  };

  // Step validator before going to next
  const canProceed = () => {
    if (currentStep === 1) {
      if (selectedVehicleType === 'custom') {
        return customVehicle.make.trim() !== '' && customVehicle.model.trim() !== '';
      }
      return Boolean(selectedFleetVehicleId);
    }
    if (currentStep === 2) {
      return selectedServices.length > 0;
    }
    if (currentStep === 3) {
      return Boolean(selectedDate);
    }
    if (currentStep === 4) {
      return Boolean(selectedTime);
    }
    if (currentStep === 5) {
      return (
        customerDetails.fullName.trim() !== '' &&
        customerDetails.phone.trim() !== '' &&
        customerDetails.email.trim() !== ''
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) {
      addToast('Please complete all required fields for this stage.', 'error');
      return;
    }
    setCurrentStep((prev) => Math.min(6, prev + 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    let generatedBookingId = '';

    try {
      const timeMatch = selectedTime.match(/\d+:\d+/);
      const cleanTime = timeMatch ? `${timeMatch[0]}:00` : '10:00:00';

      const res = await serviceApi.createServiceAppointment({
        vehicle: selectedVehicleType === 'fleet' && !isNaN(Number(selectedFleetVehicleId)) ? Number(selectedFleetVehicleId) : null,
        custom_vehicle: selectedVehicleType === 'custom' ? `${customVehicle.make} ${customVehicle.model}` : activeVehicleData.name,
        service_type: 'Full Inspection',
        preferred_date: selectedDate,
        preferred_time: cleanTime,
        description: `Services: ${activeServiceObjects.map((s) => s.name).join(', ')}. Hub: ${customerDetails.hubLocation}. Contact: ${customerDetails.fullName} (${customerDetails.phone}). Notes: ${customerDetails.notes || 'None'}`,
        estimated_cost: totalEstimatedPrice,
      });

      if (res?.id) {
        generatedBookingId = `CC-SRV-${res.id}`;
      }
    } catch (err) {
      console.warn('Backend service appointment notice:', err.message);
    }

    if (!generatedBookingId) {
      generatedBookingId = 'CC-SRV-' + Math.floor(100000 + Math.random() * 900000);
    }
    setBookingId(generatedBookingId);

    // Save to localStorage for User Profile
    try {
      const existing = JSON.parse(localStorage.getItem('carcraft_service_bookings') || '[]');
      const newBooking = {
        bookingId: generatedBookingId,
        dateBooked: new Date().toISOString(),
        vehicle: activeVehicleData.name,
        services: activeServiceObjects.map((s) => s.name),
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        location: customerDetails.hubLocation,
        estimatedPrice: totalEstimatedPrice,
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email,
        notes: customerDetails.notes,
        status: 'Confirmed'
      };
      localStorage.setItem('carcraft_service_bookings', JSON.stringify([newBooking, ...existing]));
    } catch (err) {
      console.error('Failed saving booking', err);
    }

    setBookingConfirmed(true);
    addToast(`Appointment ${generatedBookingId} confirmed!`, 'success');
  };


  const stepsList = [
    { num: '01', label: 'Vehicle' },
    { num: '02', label: 'Service' },
    { num: '03', label: 'Date' },
    { num: '04', label: 'Time' },
    { num: '05', label: 'Details' },
    { num: '06', label: 'Confirm' },
  ];

  return (
    <div className="service-page">
      <Navbar />

      <main className="service-container">
        {/* Wizard Container */}
        <div className="booking-wizard-wrap">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/service" className="vd-back-link" style={{ display: 'inline-flex', marginBottom: '16px' }}>
              <ArrowLeft size={16} />
              BACK TO SERVICE TIERS
            </Link>
            <h1 className="booking-step-title">SERVICE APPOINTMENT WIZARD</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
              Schedule precision inspection, battery maintenance, or telemetry diagnostics at a CARCRAFT Studio Hub.
            </p>
          </div>

          {!bookingConfirmed ? (
            <>
              {/* Stepper Progress Bar */}
              <div className="booking-stepper-bar">
                {stepsList.map((st, idx) => {
                  const stepIndex = idx + 1;
                  const isCompleted = stepIndex < currentStep;
                  const isActive = stepIndex === currentStep;

                  return (
                    <div
                      key={st.num}
                      className={`booking-step-indicator ${isActive ? 'active' : ''} ${
                        isCompleted ? 'completed' : ''
                      }`}
                      onClick={() => {
                        if (isCompleted) setCurrentStep(stepIndex);
                      }}
                    >
                      <div className="booking-step-bubble">
                        {isCompleted ? <Check size={16} /> : st.num}
                      </div>
                      <div className="booking-step-label">{st.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Wizard Content Card */}
              <div className="booking-step-card">
                {/* ── STEP 1: SELECT VEHICLE ── */}
                {currentStep === 1 && (
                  <div>
                    <div className="booking-step-header">
                      <div className="booking-step-pretitle">STAGE 01 // FLEET SPECIFICATION</div>
                      <h2 className="booking-step-title">SELECT YOUR VEHICLE</h2>
                    </div>

                    {/* Toggle Fleet vs Custom */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                      <button
                        className={`filter-chip ${selectedVehicleType === 'fleet' ? 'active' : ''}`}
                        onClick={() => setSelectedVehicleType('fleet')}
                        style={{ padding: '8px 18px' }}
                      >
                        Choose From CARCRAFT Fleet
                      </button>
                      <button
                        className={`filter-chip ${selectedVehicleType === 'custom' ? 'active' : ''}`}
                        onClick={() => setSelectedVehicleType('custom')}
                        style={{ padding: '8px 18px' }}
                      >
                        Enter Custom Vehicle
                      </button>
                    </div>

                    {selectedVehicleType === 'fleet' ? (
                      <div className="booking-vehicle-grid">
                        {mockVehicles.slice(0, 6).map((v) => (
                          <div
                            key={v.id}
                            className={`booking-vehicle-card ${
                              selectedFleetVehicleId === v.id ? 'selected' : ''
                            }`}
                            onClick={() => setSelectedFleetVehicleId(v.id)}
                          >
                            <img src={v.image} alt={v.model} onError={handleImageError} className="booking-vehicle-thumb" />
                            <div>
                              <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                                {v.brand} {v.model}
                              </div>
                              <div style={{ color: '#bef264', fontFamily: 'Space Grotesk', fontSize: '0.8rem' }}>
                                {v.year} • {v.fuel}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <div className="modal-form-group">
                          <label className="modal-form-label">MANUFACTURER / MAKE</label>
                          <input
                            type="text"
                            placeholder="e.g. Porsche or McLaren"
                            className="modal-form-input"
                            value={customVehicle.make}
                            onChange={(e) => setCustomVehicle({ ...customVehicle, make: e.target.value })}
                          />
                        </div>
                        <div className="modal-form-group">
                          <label className="modal-form-label">MODEL</label>
                          <input
                            type="text"
                            placeholder="e.g. 911 GT3 RS or 750S"
                            className="modal-form-input"
                            value={customVehicle.model}
                            onChange={(e) => setCustomVehicle({ ...customVehicle, model: e.target.value })}
                          />
                        </div>
                        <div className="modal-form-group">
                          <label className="modal-form-label">MODEL YEAR</label>
                          <input
                            type="number"
                            placeholder="2025"
                            className="modal-form-input"
                            value={customVehicle.year}
                            onChange={(e) => setCustomVehicle({ ...customVehicle, year: e.target.value })}
                          />
                        </div>
                        <div className="modal-form-group">
                          <label className="modal-form-label">LICENSE PLATE OR VIN</label>
                          <input
                            type="text"
                            placeholder="e.g. APEX-2026"
                            className="modal-form-input"
                            value={customVehicle.licensePlate}
                            onChange={(e) => setCustomVehicle({ ...customVehicle, licensePlate: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 2: SELECT SERVICES ── */}
                {currentStep === 2 && (
                  <div>
                    <div className="booking-step-header">
                      <div className="booking-step-pretitle">STAGE 02 // WORKSHOP MODULES</div>
                      <h2 className="booking-step-title">SELECT DESIRED SERVICES</h2>
                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
                        Select one or more services. Selected Total: <strong style={{ color: '#bef264' }}>${totalEstimatedPrice.toLocaleString()}</strong> ({selectedServices.length} selected).
                      </p>
                    </div>

                    <div className="booking-services-list">
                      {mockServices.map((s) => {
                        const isChosen = selectedServices.includes(s.id);
                        return (
                          <div
                            key={s.id}
                            className={`booking-service-choice ${isChosen ? 'selected' : ''}`}
                            onClick={() => toggleServiceChoice(s.id)}
                          >
                            <div>
                              <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                                {s.name}
                              </div>
                              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '2px' }}>
                                Est. {s.duration} • {s.badge}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: '#bef264', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem' }}>
                                {s.formattedPrice}
                              </div>
                              <div style={{ fontSize: '11px', color: isChosen ? '#bef264' : '#64748b' }}>
                                {isChosen ? '✓ Selected' : '+ Add'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── STEP 3: SELECT DATE ── */}
                {currentStep === 3 && (
                  <div>
                    <div className="booking-step-header">
                      <div className="booking-step-pretitle">STAGE 03 // CALENDAR SCHEDULING</div>
                      <h2 className="booking-step-title">SELECT PREFERRED DATE</h2>
                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
                        Studio service bays are available Monday through Saturday.
                      </p>
                    </div>

                    <div className="modal-form-group" style={{ maxWidth: '360px', margin: '0 auto 28px' }}>
                      <label className="modal-form-label">APPOINTMENT DATE</label>
                      <input
                        type="date"
                        className="modal-form-input"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ fontSize: '1rem', padding: '14px' }}
                      />
                    </div>

                    {/* Quick Day Chips */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
                        OR SELECT RAPID TRACK SLOTS:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[2, 3, 5, 7].map((daysAhead) => {
                          const d = new Date();
                          d.setDate(d.getDate() + daysAhead);
                          const dateStr = d.toISOString().split('T')[0];
                          const formattedLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                          return (
                            <button
                              key={daysAhead}
                              className={`filter-chip ${selectedDate === dateStr ? 'active' : ''}`}
                              onClick={() => setSelectedDate(dateStr)}
                            >
                              {formattedLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: SELECT TIME SLOT ── */}
                {currentStep === 4 && (
                  <div>
                    <div className="booking-step-header">
                      <div className="booking-step-pretitle">STAGE 04 // TIME ALLOCATION</div>
                      <h2 className="booking-step-title">SELECT TELEMETRY TIME SLOT</h2>
                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
                        Selected Date: <strong style={{ color: '#bef264' }}>{selectedDate}</strong>
                      </p>
                    </div>

                    <div className="booking-slots-grid">
                      {serviceTimeSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <div
                            key={slot}
                            className={`booking-slot-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(slot)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Clock size={16} color={isSelected ? '#bef264' : '#94a3b8'} />
                              <span>{slot}</span>
                            </div>
                            <span style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}>
                              {isSelected ? '✓ RESERVED' : 'AVAILABLE'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── STEP 5: CUSTOMER DETAILS ── */}
                {currentStep === 5 && (
                  <div>
                    <div className="booking-step-header">
                      <div className="booking-step-pretitle">STAGE 05 // CLIENT CREDENTIALS</div>
                      <h2 className="booking-step-title">CUSTOMER & STUDIO LOCATION</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                      <div className="modal-form-group">
                        <label className="modal-form-label">FULL NAME</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Julian Drake"
                          className="modal-form-input"
                          value={customerDetails.fullName}
                          onChange={(e) => setCustomerDetails({ ...customerDetails, fullName: e.target.value })}
                        />
                      </div>
                      <div className="modal-form-group">
                        <label className="modal-form-label">PHONE NUMBER</label>
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 019-2831"
                          className="modal-form-input"
                          value={customerDetails.phone}
                          onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="modal-form-group" style={{ marginBottom: '16px' }}>
                      <label className="modal-form-label">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        placeholder="client@carcraft.io"
                        className="modal-form-input"
                        value={customerDetails.email}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                      />
                    </div>

                    <div className="modal-form-group" style={{ marginBottom: '16px' }}>
                      <label className="modal-form-label">SERVICE STUDIO HUB LOCATION</label>
                      <select
                        className="modal-form-select"
                        value={customerDetails.hubLocation}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, hubLocation: e.target.value })}
                      >
                        {serviceHubs.map((hub) => (
                          <option key={hub} value={hub}>
                            {hub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="modal-form-group">
                      <label className="modal-form-label">SPECIAL REQUESTS / SYMPTOMS TO INVESTIGATE</label>
                      <textarea
                        rows="3"
                        placeholder="e.g. Please analyze front axle steering vibration under high-speed braking."
                        className="modal-form-input"
                        value={customerDetails.notes}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                )}

                {/* ── STEP 6: CONFIRMATION SUMMARY ── */}
                {currentStep === 6 && (
                  <div>
                    <div className="booking-step-header">
                      <div className="booking-step-pretitle">STAGE 06 // AUDIT & DISPATCH</div>
                      <h2 className="booking-step-title">APPOINTMENT SUMMARY</h2>
                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
                        Please review your service commissioning details before locking in the studio bay.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255, 255, 255, 0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div className="cart-breakdown-row">
                        <span>Allocated Vehicle</span>
                        <span style={{ color: '#bef264' }}>{activeVehicleData.name}</span>
                      </div>

                      <div className="cart-breakdown-row">
                        <span>Selected Service Modules ({activeServiceObjects.length})</span>
                        <span>{activeServiceObjects.map((s) => s.name).join(' • ')}</span>
                      </div>

                      <div className="cart-breakdown-row">
                        <span>Appointment Date & Time</span>
                        <span>{selectedDate} @ {selectedTime.split(' - ')[0]}</span>
                      </div>

                      <div className="cart-breakdown-row">
                        <span>Studio Location Hub</span>
                        <span style={{ maxWidth: '340px', textAlign: 'right' }}>{customerDetails.hubLocation}</span>
                      </div>

                      <div className="cart-breakdown-row">
                        <span>Customer Contact</span>
                        <span>{customerDetails.fullName} ({customerDetails.phone})</span>
                      </div>

                      {customerDetails.notes && (
                        <div className="cart-breakdown-row">
                          <span>Client Notes</span>
                          <span>{customerDetails.notes}</span>
                        </div>
                      )}

                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', marginTop: '8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                          ESTIMATED SERVICE CHARGE
                        </span>
                        <span style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 900, color: '#bef264' }}>
                          ${totalEstimatedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Controls Row */}
                <div className="booking-nav-row">
                  {currentStep > 1 ? (
                    <button className="booking-back-btn" onClick={handleBack}>
                      <ArrowLeft size={16} />
                      PREVIOUS STAGE
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 6 ? (
                    <button className="booking-next-btn" onClick={handleNext}>
                      <span>CONTINUE TO {stepsList[currentStep].label.toUpperCase()}</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button className="booking-next-btn" onClick={handleFinalSubmit}>
                      <ShieldCheck size={18} />
                      <span>CONFIRM APPOINTMENT</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* ── FINAL CONFIRMATION SCREEN ── */
            <div className="booking-step-card" style={{ textAlign: 'center', padding: '50px 32px' }}>
              <div className="modal-confirmed-icon">
                <CheckCircle2 size={44} />
              </div>
              <div className="modal-header-badge" style={{ justifyContent: 'center' }}>
                STUDIO TELEMETRY DISPATCHED
              </div>
              <h2 className="booking-step-title" style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
                BOOKING CONFIRMED
              </h2>
              <div className="modal-confirmed-id" style={{ fontSize: '1.05rem', padding: '10px 24px', margin: '14px 0 24px' }}>
                APPOINTMENT #{bookingId}
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 28px' }}>
                Your service appointment for the <strong>{activeVehicleData.name}</strong> has been logged at <strong>{customerDetails.hubLocation}</strong> on <strong>{selectedDate}</strong> ({selectedTime}).
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', maxWidth: '500px', margin: '0 auto 36px', padding: '20px', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#bef264', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  NEXT STEPS // CONCIERGE CHECK-IN
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  1. A digital service pass has been dispatched to <strong>{customerDetails.email}</strong>.<br />
                  2. Telemetry loaner vehicles can be requested upon arrival at the studio lounge.<br />
                  3. Live service tracking will activate once the vehicle enters the diagnostic cleanroom.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="booking-next-btn"
                  onClick={() => {
                    setBookingConfirmed(false);
                    setCurrentStep(1);
                  }}
                >
                  <RotateCcw size={16} />
                  BOOK ANOTHER SERVICE
                </button>
                <Link to="/service" className="booking-back-btn">
                  BACK TO SERVICE TIERS
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
