import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  Sparkles,
  Zap,
  Printer,
  Download
} from 'lucide-react';
import { mockVehicles } from '../../data/vehicles';
import vehicleApi from '../../api/vehicleApi';
import { normalizeVehicle } from '../../api/normalizers';
import testDriveApi from '../../api/testDriveApi';
import { dealershipHubs, experienceTiers, conciergeInstructors } from '../../data/dealerships';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { handleImageError } from '../../utils/imageFallback';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './TestDrive.css';

const TIME_SLOTS = [
  '09:30 AM (Morning Telemetry)',
  '11:30 AM (Peak Sunlight Track)',
  '02:30 PM (Afternoon Circuit)',
  '04:30 PM (Golden Hour Highway)',
  '06:30 PM (Twilight Runway Session)'
];


export default function TestDrive() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const preselectedVehicleId = searchParams.get('vehicle');

  // Step state: 1 (Vehicle), 2 (Hub & Tier), 3 (Schedule & Instructor), 4 (Pilot Details), 5 (Confirmed)
  const [step, setStep] = useState(preselectedVehicleId ? 2 : 1);

  // Live vehicles from database with mock fallback
  const [liveVehicles, setLiveVehicles] = useState(mockVehicles);

  useEffect(() => {
    vehicleApi.getVehicles()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length > 0) {
          const mapped = list.map(normalizeVehicle);
          setLiveVehicles(mapped);
          if (preselectedVehicleId) {
            const match = mapped.find(
              (v) => String(v.id) === String(preselectedVehicleId) || String(v.rawId) === String(preselectedVehicleId)
            );
            if (match) setSelectedVehicleId(match.id);
          } else {
            setSelectedVehicleId(mapped[0].id);
          }
        }
      })
      .catch((err) => {
        console.warn('Vehicle live fetch fallback:', err.message);
      });
  }, [preselectedVehicleId]);

  // Form selections
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    preselectedVehicleId || mockVehicles[0].id
  );
  const [selectedHubId, setSelectedHubId] = useState(dealershipHubs[0].id);
  const [selectedTierId, setSelectedTierId] = useState(experienceTiers[0].id);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [selectedInstructorId, setSelectedInstructorId] = useState(conciergeInstructors[0].id);

  // Pilot Credentials
  const [pilotName, setPilotName] = useState(user?.name || '');
  const [pilotEmail, setPilotEmail] = useState(user?.email || '');
  const [pilotPhone, setPilotPhone] = useState('+91 98765 43210');
  const [licenseNumber, setLicenseNumber] = useState('DL-9082410-X');
  const [specialNotes, setSpecialNotes] = useState('Request helmet size L and carbon paddle adjustment.');

  // Confirmed state
  const [reservation, setReservation] = useState(null);

  // Resolved entities
  const selectedVehicle = useMemo(() => {
    return liveVehicles.find((v) => String(v.id) === String(selectedVehicleId) || String(v.rawId) === String(selectedVehicleId)) || liveVehicles[0];
  }, [selectedVehicleId, liveVehicles]);

  const selectedHub = useMemo(() => {
    return dealershipHubs.find((h) => h.id === selectedHubId) || dealershipHubs[0];
  }, [selectedHubId]);

  const selectedTier = useMemo(() => {
    return experienceTiers.find((t) => t.id === selectedTierId) || experienceTiers[0];
  }, [selectedTierId]);

  const selectedInstructor = useMemo(() => {
    return conciergeInstructors.find((i) => i.id === selectedInstructorId) || conciergeInstructors[0];
  }, [selectedInstructorId]);

  const handleCompleteReservation = async (e) => {
    e.preventDefault();
    if (!pilotName || !pilotEmail || !pilotPhone) {
      addToast('Please complete all required pilot credentials', 'error');
      return;
    }

    // Convert time to standard 24h HH:MM:00 for Django TimeField
    let cleanTime = '11:00:00';
    const timeMatch = selectedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const mins = timeMatch[2];
      const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      cleanTime = `${String(hours).padStart(2, '0')}:${mins}:00`;
    }

    let bookingRef = '';
    let dbRecord = null;
    try {
      let vId = selectedVehicle?.rawId || (!isNaN(Number(selectedVehicle?.id)) ? Number(selectedVehicle.id) : null);
      if (!vId && liveVehicles.length > 0) {
        const foundDb = liveVehicles.find((v) => v.rawId || !isNaN(Number(v.id)));
        if (foundDb) vId = foundDb.rawId || Number(foundDb.id);
      }
      if (!vId) vId = 1; // Default to first database vehicle ID

      const res = await testDriveApi.createTestDrive({
        vehicle: vId,
        preferred_date: selectedDate,
        preferred_time: cleanTime,
        phone: pilotPhone,
        notes: `Hub: ${selectedHub.name}, Tier: ${selectedTier.name}, Instructor: ${selectedInstructor.name}, Pilot: ${pilotName} (${pilotEmail}), License: ${licenseNumber}. Notes: ${specialNotes || 'None'}`
      });
      if (res?.id) {
        bookingRef = `CC-TD-${res.id}`;
        dbRecord = res;
        addToast(`Test Drive #${res.id} booked and sent to Dealer Concierge!`, 'success');
      }
    } catch (err) {
      console.warn('Backend test drive notice:', err.message);
    }

    if (!bookingRef) {
      bookingRef = 'CC-TD-' + Math.floor(100000 + Math.random() * 900000);
    }

    const confirmedData = {
      id: dbRecord?.id || undefined,
      refNumber: bookingRef,
      vehicle: selectedVehicle,
      hub: selectedHub,
      tier: selectedTier,
      date: selectedDate,
      time: selectedTime,
      status: 'PENDING',
      instructor: selectedInstructor,
      pilot: {
        name: pilotName,
        email: pilotEmail,
        phone: pilotPhone,
        license: licenseNumber,
        notes: specialNotes
      },
      createdAt: new Date().toLocaleDateString()
    };

    setReservation(confirmedData);
    setStep(5);

    // Save to localStorage under carcraft_testdrives
    try {
      const existing = JSON.parse(localStorage.getItem('carcraft_testdrives') || '[]');
      existing.unshift(confirmedData);
      localStorage.setItem('carcraft_testdrives', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    addToast(`Test drive confirmed! Reservation code: ${bookingRef}`, 'success');
  };


  return (
    <div className="testdrive-page">
      <div className="testdrive-ambient" />
      <Navbar />

      <main className="testdrive-container">
        {/* Header */}
        <div className="testdrive-header">
          <div className="testdrive-badge">
            <ShieldCheck size={13} />
            CARCRAFT GLOBAL CONCIERGE ACCESS
          </div>
          <h1 className="testdrive-title">Book A Test Drive</h1>
          <p className="testdrive-subtitle">
            Take command of our flagship inventory at iconic circuits and private global ateliers under pro instructor guidance.
          </p>
        </div>

        {/* Stepper Navigation */}
        {step < 5 && (
          <div className="testdrive-stepper">
            <button
              className={`testdrive-step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}
              onClick={() => setStep(1)}
            >
              <span className="testdrive-step-num">1</span>
              <span>Vehicle Selection</span>
            </button>
            <button
              className={`testdrive-step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}
              onClick={() => setStep(2)}
            >
              <span className="testdrive-step-num">2</span>
              <span>Hub & Experience</span>
            </button>
            <button
              className={`testdrive-step-item ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}
              onClick={() => setStep(3)}
            >
              <span className="testdrive-step-num">3</span>
              <span>Date & Instructor</span>
            </button>
            <button
              className={`testdrive-step-item ${step === 4 ? 'active' : ''}`}
              onClick={() => setStep(4)}
            >
              <span className="testdrive-step-num">4</span>
              <span>Pilot Credentials</span>
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 1: VEHICLE SELECTION
        ════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="testdrive-card">
            <h2 className="testdrive-section-title">
              <Car size={20} color="#bef264" />
              Step 1: Choose Your Test Pilot Vehicle
            </h2>
            <div className="testdrive-car-selector-grid">
              {mockVehicles.map((car) => (
                <div
                  key={car.id}
                  className={`testdrive-car-card ${selectedVehicleId === car.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVehicleId(car.id)}
                >
                  <img src={car.image} alt={car.model} onError={handleImageError} className="testdrive-car-thumb" />
                  <div className="testdrive-car-meta">
                    <div>
                      <span style={{ fontSize: '10px', fontFamily: 'Space Grotesk', color: '#64748b' }}>
                        {car.brand}
                      </span>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                        {car.model}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#bef264', fontSize: '0.85rem' }}>
                      {car.power}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="testdrive-actions-row">
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Selected: <strong style={{ color: '#bef264' }}>{selectedVehicle.brand} {selectedVehicle.model}</strong>
              </span>
              <button className="testdrive-primary-btn" onClick={() => setStep(2)}>
                <span>PROCEED TO HUB & TIER</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 2: HUB & EXPERIENCE TIER
        ════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="testdrive-card">
            <h2 className="testdrive-section-title">
              <MapPin size={20} color="#bef264" />
              Step 2: Select Global Studio Hub & Experience Tier
            </h2>

            {/* Hubs Grid */}
            <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.78rem', color: '#cbd5e1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
              CHOOSE DESTINATION ATELIER:
            </label>
            <div className="testdrive-hubs-grid">
              {dealershipHubs.map((hub) => (
                <div
                  key={hub.id}
                  className={`testdrive-hub-card ${selectedHubId === hub.id ? 'selected' : ''}`}
                  onClick={() => setSelectedHubId(hub.id)}
                >
                  <div className="testdrive-hub-img-wrap">
                    <img src={hub.image} alt={hub.name} onError={handleImageError} className="testdrive-hub-img" />
                    <span className="testdrive-hub-badge">{hub.badge}</span>
                  </div>
                  <div className="testdrive-hub-body">
                    <h3 className="testdrive-hub-title">{hub.name}</h3>
                    <span className="testdrive-hub-city">
                      <MapPin size={13} color="#bef264" />
                      {hub.city}
                    </span>
                    {hub.hasTrackAccess && (
                      <span className="testdrive-hub-track-tag">
                        ⚡ {hub.trackName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Tiers */}
            <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.78rem', color: '#cbd5e1', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '24px 0 12px', display: 'block' }}>
              CHOOSE EXPERIENCE TIER:
            </label>
            <div className="testdrive-tiers-grid">
              {experienceTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`testdrive-tier-card ${selectedTierId === tier.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTierId(tier.id)}
                >
                  <div>
                    <span className="testdrive-tier-badge">{tier.badge}</span>
                    <h3 className="testdrive-tier-name">{tier.name}</h3>
                    <div className="testdrive-tier-duration">{tier.duration}</div>
                    <div className="testdrive-tier-cost">{tier.cost}</div>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, margin: '8px 0 0' }}>
                      {tier.description}
                    </p>
                  </div>
                  <div className="testdrive-tier-features">
                    {tier.features.map((feat, i) => (
                      <div key={i} className="testdrive-tier-feat-item">
                        <CheckCircle2 size={12} color="#bef264" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="testdrive-actions-row">
              <button className="testdrive-secondary-btn" onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                <span>BACK</span>
              </button>
              <button className="testdrive-primary-btn" onClick={() => setStep(3)}>
                <span>PROCEED TO SCHEDULE</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 3: SCHEDULE & INSTRUCTOR
        ════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="testdrive-card">
            <h2 className="testdrive-section-title">
              <Calendar size={20} color="#bef264" />
              Step 3: Schedule Date & Assigned Pro Instructor
            </h2>

            <div className="testdrive-schedule-row">
              {/* Date Input */}
              <div>
                <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.76rem', color: '#cbd5e1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  RESERVATION DATE:
                </label>
                <input
                  type="date"
                  className="testdrive-date-input"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Time Slots */}
              <div>
                <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.76rem', color: '#cbd5e1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  SESSION WINDOW:
                </label>
                <div className="testdrive-slots-grid">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`testdrive-slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Concierge Instructors */}
            <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.78rem', color: '#cbd5e1', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '20px 0 12px', display: 'block' }}>
              SELECT CERTIFIED MASTER INSTRUCTOR:
            </label>
            <div className="testdrive-instructors-grid">
              {conciergeInstructors.map((inst) => (
                <div
                  key={inst.id}
                  className={`testdrive-inst-card ${selectedInstructorId === inst.id ? 'selected' : ''}`}
                  onClick={() => setSelectedInstructorId(inst.id)}
                >
                  <img src={inst.avatar} alt={inst.name} onError={handleImageError} className="testdrive-inst-avatar" />
                  <div>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                      {inst.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#bef264', fontFamily: 'Space Grotesk' }}>
                      {inst.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px' }}>
                      {inst.specialty}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="testdrive-actions-row">
              <button className="testdrive-secondary-btn" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                <span>BACK</span>
              </button>
              <button className="testdrive-primary-btn" onClick={() => setStep(4)}>
                <span>PROCEED TO PILOT DETAILS</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 4: PILOT CREDENTIALS
        ════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="testdrive-card">
            <h2 className="testdrive-section-title">
              <User size={20} color="#bef264" />
              Step 4: Pilot Credentials & Confirmation
            </h2>

            <form onSubmit={handleCompleteReservation}>
              <div className="testdrive-fields-grid">
                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    FULL PILOT NAME *
                  </label>
                  <input
                    type="text"
                    className="testdrive-input"
                    value={pilotName}
                    onChange={(e) => setPilotName(e.target.value)}
                    placeholder="Marcus Sterling"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    CONFIDENTIAL EMAIL *
                  </label>
                  <input
                    type="email"
                    className="testdrive-input"
                    value={pilotEmail}
                    onChange={(e) => setPilotEmail(e.target.value)}
                    placeholder="pilot@carcraft.io"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    DIRECT TELEPHONE *
                  </label>
                  <input
                    type="tel"
                    className="testdrive-input"
                    value={pilotPhone}
                    onChange={(e) => setPilotPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    DRIVER'S LICENSE / FIA PERMIT NUMBER
                  </label>
                  <input
                    type="text"
                    className="testdrive-input"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="DL-72019-CA"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  CUSTOM CONCIERGE SPECIFICATIONS / INSTRUCTOR NOTES
                </label>
                <textarea
                  className="testdrive-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Seat lumbar adjustment, track camera preferences, etc."
                />
              </div>

              {/* Summary Strip */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#64748b' }}>COMMISSIONING SUMMARY</span>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                    {selectedVehicle.model} • {selectedHub.city}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#bef264' }}>
                    {selectedDate} at {selectedTime} with {selectedInstructor.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#64748b' }}>EXPERIENCE TIER</span>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', color: '#bef264' }}>
                    {selectedTier.cost}
                  </div>
                </div>
              </div>

              <div className="testdrive-actions-row">
                <button
                  type="button"
                  className="testdrive-secondary-btn"
                  onClick={() => setStep(3)}
                >
                  <ArrowLeft size={16} />
                  <span>BACK</span>
                </button>
                <button type="submit" className="testdrive-primary-btn">
                  <CheckCircle2 size={16} />
                  <span>CONFIRM PILOT RESERVATION</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 5: CONFIRMED BOARDING PASS
        ════════════════════════════════════════════════════ */}
        {step === 5 && reservation && (
          <div className="testdrive-pass-card">
            <div className="testdrive-pass-header">
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'Space Grotesk', color: '#080a08', background: '#bef264', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  CONFIRMED FLIGHT PASS
                </span>
                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: '#fff', marginTop: '6px' }}>
                  CarCraft Dynamic Telemetry Pass
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="testdrive-pass-lbl">PASS CODE</span>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.25rem', color: '#bef264' }}>
                  {reservation.refNumber}
                </div>
              </div>
            </div>

            <div className="testdrive-pass-body">
              <div className="testdrive-pass-grid">
                <div className="testdrive-pass-field">
                  <span className="testdrive-pass-lbl">VEHICLE ASSIGNMENT</span>
                  <span className="testdrive-pass-val">{reservation.vehicle.brand} {reservation.vehicle.model}</span>
                  <span style={{ fontSize: '0.78rem', color: '#bef264' }}>{reservation.vehicle.power} • {reservation.vehicle.acceleration}</span>
                </div>

                <div className="testdrive-pass-field">
                  <span className="testdrive-pass-lbl">DEALERSHIP ATELIER</span>
                  <span className="testdrive-pass-val">{reservation.hub.name}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{reservation.hub.address}, {reservation.hub.city}</span>
                </div>

                <div className="testdrive-pass-field">
                  <span className="testdrive-pass-lbl">DATE & WINDOW</span>
                  <span className="testdrive-pass-val">{reservation.date}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{reservation.time}</span>
                </div>

                <div className="testdrive-pass-field">
                  <span className="testdrive-pass-lbl">ASSIGNED PRO INSTRUCTOR</span>
                  <span className="testdrive-pass-val">{reservation.instructor.name}</span>
                  <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{reservation.instructor.title}</span>
                </div>

                <div className="testdrive-pass-field">
                  <span className="testdrive-pass-lbl">PILOT IN COMMAND</span>
                  <span className="testdrive-pass-val">{reservation.pilot.name}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{reservation.pilot.email}</span>
                </div>

                <div className="testdrive-pass-field">
                  <span className="testdrive-pass-lbl">EXPERIENCE PROGRAM</span>
                  <span className="testdrive-pass-val">{reservation.tier.name}</span>
                  <span style={{ fontSize: '0.78rem', color: '#bef264' }}>{reservation.tier.duration}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="testdrive-secondary-btn"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                  <span>PRINT PASS</span>
                </button>

                <Link
                  to="/profile"
                  className="testdrive-primary-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <span>VIEW IN MEMBER GARAGE</span>
                  <ArrowRight size={16} />
                </Link>

                <button
                  type="button"
                  className="testdrive-secondary-btn"
                  onClick={() => setStep(1)}
                >
                  <span>BOOK ANOTHER DRIVE</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
