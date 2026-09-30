import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  Gauge, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Auth.css';

const TIERS = [
  {
    id: 'Apex VIP',
    name: 'Apex VIP',
    badge: 'CONCIERGE ACCESS',
    desc: 'Unrestricted hypercar allocation access & studio bookings',
  },
  {
    id: 'Circuit Pilot',
    name: 'Circuit Pilot',
    badge: 'TRACK CERTIFIED',
    desc: 'Telemetry diagnostics, race tuning & track reservations',
  },
  {
    id: 'Heritage Collector',
    name: 'Collector',
    badge: 'PRIVATE GARAGE',
    desc: 'Private acquisition vault & bespoke restoration access',
  },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState('Apex VIP');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Please complete all credential fields');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Passcode must be at least 6 characters long');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please confirm agreement to the CarCraft Client Accord');
      return;
    }

    try {
      await register({ name, email, password, tier });
      navigate('/profile', { replace: true });
    } catch (err) {
      setErrorMsg('Registration failed. Please try a different email address.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-ambient-glow" />
      <div className="auth-grid-pattern" />

      <Navbar />

      <main className="auth-main">
        <div className="auth-card-wrapper">
          <div className="auth-card">
            {/* Header */}
            <div className="auth-header">
              <div className="auth-badge">
                <Crown size={13} />
                EXCLUSIVE MEMBERSHIP APPLICATION
              </div>
              <h1 className="auth-title">Join CarCraft</h1>
              <p className="auth-subtitle">
                Acquire bespoke concierge status, reserve allocations, and track builds.
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="auth-tabs">
              <Link to="/login" className="auth-tab-btn" style={{ textDecoration: 'none' }}>
                <Lock size={14} />
                Sign In
              </Link>
              <button className="auth-tab-btn active" type="button">
                <Sparkles size={14} />
                Register
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                  fontFamily: 'Inter',
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Registration Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="register-name">
                  Full Name / Title
                </label>
                <div className="auth-input-container">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="register-name"
                    type="text"
                    className="auth-input"
                    placeholder="Lord Alexander Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="register-email">
                  Private Email
                </label>
                <div className="auth-input-container">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="register-email"
                    type="email"
                    className="auth-input"
                    placeholder="vance@prestige.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Passcode */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="register-password">
                  Security Passcode
                </label>
                <div className="auth-input-container">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-toggle-pwd-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Membership Tier Selector */}
              <div className="auth-field">
                <label className="auth-label">
                  Select Membership Tier
                </label>
                <div className="auth-tier-grid">
                  {TIERS.map((t) => (
                    <div
                      key={t.id}
                      className={`auth-tier-card ${tier === t.id ? 'selected' : ''}`}
                      onClick={() => setTier(t.id)}
                    >
                      <span className="auth-tier-name">{t.name}</span>
                      <span className="auth-tier-badge">{t.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms accord */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  marginTop: '4px',
                }}
              >
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: '#bef264', cursor: 'pointer', marginTop: '2px' }}
                />
                <label htmlFor="agreeTerms" style={{ cursor: 'pointer', lineHeight: '1.4' }}>
                  I accept the CarCraft Concierge Accord and Private Allocation Protocol.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span>COMMISSIONING CREDENTIALS...</span>
                ) : (
                  <>
                    <span>COMMISSION MEMBERSHIP</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer Notice */}
            <div className="auth-security-footer">
              <Zap size={13} color="#bef264" />
              <span>CARCRAFT DEALERSHIP PROTOCOL ENFORCED</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
