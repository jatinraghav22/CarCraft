import React, { useState } from 'react';
import { 
  BadgePercent, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Car, 
  DollarSign, 
  Lock 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Sell.css';

const CONDITIONS = [
  { id: 'mint', label: 'Collector Mint', factor: 1.12, desc: 'Flawless paint, sub-2,000 miles, climate garage kept' },
  { id: 'excellent', label: 'Excellent', factor: 1.0, desc: 'Complete service history, minor surface patina' },
  { id: 'good', label: 'Good', factor: 0.88, desc: 'Regularly driven, clean title, scheduled maintenance' },
  { id: 'track', label: 'Track Spec', factor: 0.92, desc: 'Upgraded telemetry, race pads, active telemetry logs' },
];

export default function Sell() {
  const { addToast } = useToast();

  const [brand, setBrand] = useState('Porsche');
  const [model, setModel] = useState('911 GT3 RS');
  const [year, setYear] = useState('2024');
  const [mileage, setMileage] = useState('4200');
  const [condition, setCondition] = useState('mint');
  const [vin, setVin] = useState('WP0AC2A98RS00192');

  const [valuation, setValuation] = useState(null);
  const [offerLocked, setOfferLocked] = useState(false);

  const calculateValuation = (e) => {
    e.preventDefault();
    const condObj = CONDITIONS.find((c) => c.id === condition) || CONDITIONS[0];
    const baseValue = 240000;
    const mileageDeduction = Math.min(40000, Number(mileage) * 2.5);
    const calculated = Math.round((baseValue - mileageDeduction) * condObj.factor);

    setValuation(calculated);
    setOfferLocked(false);
    addToast('Valuation computed with real-time auction algorithms', 'success');
  };

  const handleLockOffer = () => {
    setOfferLocked(true);
    addToast('Offer locked for 7 calendar days. Reference: CC-VAL-' + Math.floor(100000 + Math.random() * 900000), 'success');
  };

  return (
    <div className="sell-page">
      <Navbar />

      <main className="sell-container">
        {/* Header */}
        <div className="sell-header">
          <div className="sell-badge">
            <BadgePercent size={13} />
            PRIVATE ACQUISITION DESK
          </div>
          <h1 className="sell-title">Sell Or Trade Your Vehicle</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Instant algorithmic appraisals backed by CarCraft Treasury funds. White-glove enclosed transporter pickup worldwide.
          </p>
        </div>

        {/* Wizard Card */}
        <div className="sell-wizard-card">
          <form onSubmit={calculateValuation}>
            <div className="sell-form-grid">
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '8px' }}>
                  VEHICLE MARQUE / BRAND *
                </label>
                <input
                  type="text"
                  required
                  className="sell-input"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Ferrari, McLaren, Porsche"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '8px' }}>
                  MODEL & SPECIFICATION *
                </label>
                <input
                  type="text"
                  required
                  className="sell-input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 765LT Spider"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '8px' }}>
                  PRODUCTION YEAR *
                </label>
                <input
                  type="number"
                  required
                  className="sell-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '8px' }}>
                  CURRENT ODOMETER MILEAGE *
                </label>
                <input
                  type="number"
                  required
                  className="sell-input"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                />
              </div>
            </div>

            {/* Condition Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '10px' }}>
                VEHICLE CONDITION GRADE:
              </label>
              <div className="sell-condition-grid">
                {CONDITIONS.map((c) => (
                  <div
                    key={c.id}
                    className={`sell-cond-btn ${condition === c.id ? 'active' : ''}`}
                    onClick={() => setCondition(c.id)}
                  >
                    <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                      {c.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                background: '#bef264',
                color: '#080a08',
                fontFamily: 'Outfit',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              GENERATE INSTANT TREASURY VALUATION
            </button>
          </form>

          {/* Valuation Result */}
          {valuation && (
            <div className="sell-offer-result">
              <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#bef264', letterSpacing: '0.14em' }}>
                GUARANTEED CARCRAFT CASH OFFER
              </span>
              <div className="sell-offer-num">
                ${valuation.toLocaleString()}
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                Modeled for {year} {brand} {model} • Condition: {condition.toUpperCase()}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
                {!offerLocked ? (
                  <button
                    type="button"
                    onClick={handleLockOffer}
                    style={{
                      background: '#bef264',
                      color: '#080a08',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontFamily: 'Outfit',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Lock size={15} />
                    LOCK THIS 7-DAY OFFER
                  </button>
                ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#bef264', background: 'rgba(190,242,100,0.1)', padding: '10px 18px', borderRadius: '8px' }}>
                    <CheckCircle2 size={16} />
                    <span>OFFER LOCKED FOR 7 DAYS • CONCIERGE DISPATCHED</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
