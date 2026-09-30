import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Calculator, 
  ShieldCheck, 
  ArrowRight, 
  Percent, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  Car 
} from 'lucide-react';
import { mockVehicles } from '../../data/vehicles';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Financing.css';

export default function Financing() {
  const { addToast } = useToast();

  const [mode, setMode] = useState('loan'); // 'loan' | 'lease'
  const [vehiclePrice, setVehiclePrice] = useState(285000);
  const [downPayment, setDownPayment] = useState(50000);
  const [tradeInValue, setTradeInValue] = useState(25000);
  const [termMonths, setTermMonths] = useState(48);
  const [creditTier, setCreditTier] = useState('super-prime'); // 'super-prime' (4.9%), 'prime' (6.4%), 'custom' (8.2%)

  const apr = useMemo(() => {
    if (creditTier === 'super-prime') return 4.9;
    if (creditTier === 'prime') return 6.4;
    return 8.2;
  }, [creditTier]);

  // Compute Loan Monthly Payment
  const netLoanAmount = Math.max(0, vehiclePrice - downPayment - tradeInValue);

  const monthlyPayment = useMemo(() => {
    if (mode === 'loan') {
      const monthlyRate = apr / 100 / 12;
      if (monthlyRate === 0) return netLoanAmount / termMonths;
      const payment = (netLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
      return Math.round(payment);
    } else {
      // Lease calculation (residual value ~55% after 36-48 months, money factor)
      const residual = vehiclePrice * 0.52;
      const depreciation = (vehiclePrice - downPayment - tradeInValue - residual) / termMonths;
      const financeFee = (vehiclePrice + residual) * (apr / 2400);
      return Math.round(Math.max(450, depreciation + financeFee));
    }
  }, [mode, netLoanAmount, termMonths, apr, vehiclePrice, downPayment, tradeInValue]);

  const totalFinancedCost = Math.round(monthlyPayment * termMonths + downPayment + tradeInValue);
  const estimatedInterest = Math.max(0, totalFinancedCost - vehiclePrice);

  const handlePreApproval = (e) => {
    e.preventDefault();
    addToast('Concierge credit pre-approval application logged. Our treasury officer will contact you within 2 hours.', 'success');
  };

  return (
    <div className="financing-page">
      <Navbar />

      <main className="financing-container">
        {/* Header */}
        <div className="financing-header">
          <div className="financing-badge">
            <Calculator size={13} />
            CARCRAFT FINANCIAL TREASURY
          </div>
          <h1 className="financing-title">Financing & Lease Calculator</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Customize your acquisition structure. Model bespoke private banking terms, high-equity trade-in allowances, and competitive lease programs.
          </p>
        </div>

        <div className="financing-grid">
          {/* Controls Card */}
          <div className="financing-card">
            {/* Mode Switcher */}
            <div className="financing-tabs">
              <button
                className={`financing-tab-btn ${mode === 'loan' ? 'active' : ''}`}
                onClick={() => setMode('loan')}
              >
                Structured Loan Purchase
              </button>
              <button
                className={`financing-tab-btn ${mode === 'lease' ? 'active' : ''}`}
                onClick={() => setMode('lease')}
              >
                Private Atelier Lease
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label className="financing-control-label" style={{ display: 'block', marginBottom: '8px' }}>
                SELECT BASELINE VEHICLE ALLOCATION:
              </label>
              <select
                style={{
                  width: '100%',
                  background: 'rgba(15,20,30,0.8)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontFamily: 'Outfit',
                  outline: 'none',
                }}
                onChange={(e) => {
                  const found = mockVehicles.find((v) => v.id === e.target.value);
                  if (found) {
                    setVehiclePrice(found.price);
                    setDownPayment(Math.round(found.price * 0.2));
                  }
                }}
              >
                {mockVehicles.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model} — {car.formattedPrice}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="financing-control-group">
              <div className="financing-control-header">
                <span className="financing-control-label">Vehicle Acquisition Price</span>
                <span className="financing-control-val">${vehiclePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="financing-slider"
                min="60000"
                max="2500000"
                step="5000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
              />
            </div>

            {/* Down Payment Slider */}
            <div className="financing-control-group">
              <div className="financing-control-header">
                <span className="financing-control-label">Down Payment Amount</span>
                <span className="financing-control-val">
                  ${downPayment.toLocaleString()} ({Math.round((downPayment / vehiclePrice) * 100)}%)
                </span>
              </div>
              <input
                type="range"
                className="financing-slider"
                min="0"
                max={vehiclePrice * 0.6}
                step="2500"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
              />
            </div>

            {/* Trade In Allowance */}
            <div className="financing-control-group">
              <div className="financing-control-header">
                <span className="financing-control-label">Trade-In Vehicle Equity</span>
                <span className="financing-control-val">${tradeInValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="financing-slider"
                min="0"
                max="300000"
                step="2500"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(Number(e.target.value))}
              />
            </div>

            {/* Term Months */}
            <div className="financing-control-group">
              <span className="financing-control-label">Financing Term Length</span>
              <div className="financing-terms-grid">
                {[24, 36, 48, 60].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`financing-term-btn ${termMonths === t ? 'active' : ''}`}
                    onClick={() => setTermMonths(t)}
                  >
                    {t} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Tier Selector */}
            <div className="financing-control-group">
              <span className="financing-control-label">Credit Rating Tier</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  className={`financing-term-btn ${creditTier === 'super-prime' ? 'active' : ''}`}
                  onClick={() => setCreditTier('super-prime')}
                >
                  Super Prime (4.9%)
                </button>
                <button
                  type="button"
                  className={`financing-term-btn ${creditTier === 'prime' ? 'active' : ''}`}
                  onClick={() => setCreditTier('prime')}
                >
                  Prime (6.4%)
                </button>
                <button
                  type="button"
                  className={`financing-term-btn ${creditTier === 'custom' ? 'active' : ''}`}
                  onClick={() => setCreditTier('custom')}
                >
                  Bespoke (8.2%)
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="financing-results-panel">
            <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              ESTIMATED CONCIERGE PAYMENT
            </span>
            <div className="financing-payment-big">
              ${monthlyPayment.toLocaleString()}
              <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}> / month</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Modeled for {termMonths} months at {apr}% APR
            </p>

            <div className="financing-breakdown-list">
              <div className="financing-breakdown-row">
                <span style={{ color: '#94a3b8' }}>Net Financed Principal</span>
                <strong style={{ color: '#fff' }}>${netLoanAmount.toLocaleString()}</strong>
              </div>
              <div className="financing-breakdown-row">
                <span style={{ color: '#94a3b8' }}>Down Payment Applied</span>
                <strong style={{ color: '#bef264' }}>-${downPayment.toLocaleString()}</strong>
              </div>
              <div className="financing-breakdown-row">
                <span style={{ color: '#94a3b8' }}>Trade-In Credit</span>
                <strong style={{ color: '#38bdf8' }}>-${tradeInValue.toLocaleString()}</strong>
              </div>
              <div className="financing-breakdown-row">
                <span style={{ color: '#94a3b8' }}>Est. Total Finance Charges</span>
                <strong style={{ color: '#fff' }}>${estimatedInterest.toLocaleString()}</strong>
              </div>
              <div className="financing-breakdown-row" style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Total Loan Cost</span>
                <strong style={{ color: '#bef264', fontSize: '1.05rem' }}>${totalFinancedCost.toLocaleString()}</strong>
              </div>
            </div>

            <form onSubmit={handlePreApproval} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="submit"
                style={{
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <ShieldCheck size={16} />
                REQUEST PRE-APPROVAL
              </button>

              <Link
                to="/vehicles"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                Browse Matching Fleet
              </Link>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
