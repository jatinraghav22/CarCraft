// ==========================================================================
// CARCRAFT DEALER SUITE - DEALER LOGIN GATEWAY
// Restricted access portal for CARCRAFT Principal Dealership
// ==========================================================================

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useDealerAuth } from '../context/DealerAuthContext';

export default function DealerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isDealerAuthenticated, rememberedEmail } = useDealerAuth();

  const [email, setEmail] = useState(rememberedEmail || 'admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // If already authenticated, redirect to dashboard or requested page
  const from = location.state?.from?.pathname || '/dealer/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login({ email, password, rememberMe });
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="dealer-login-container">
      {/* Background Ambience */}
      <div className="dealer-ambient-glow" />

      {/* Top Bar with Customer Site Link */}
      <header className="dealer-login-topbar">
        <Link to="/" className="dealer-brand-link" style={{ textDecoration: 'none' }}>
          <div className="dealer-brand-badge">
            <Sparkles size={18} />
          </div>
          <div className="dealer-brand-text">
            <span className="dealer-brand-title">CARCRAFT</span>
            <span className="dealer-brand-tag">Autonomous Dealership</span>
          </div>
        </Link>

        <Link to="/" className="dealer-btn-secondary" style={{ padding: '8px 16px', fontSize: '0.78rem', gap: '8px' }}>
          <ExternalLink size={14} />
          <span>Exit to Customer Showroom</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="dealer-login-main">
        <div className="dealer-login-card">
          {/* Card Top / Header */}
          <div className="dealer-login-header">
            <div className="dealer-login-icon-box">
              <Lock size={22} />
            </div>

            <div className="dealer-login-title-wrap">
              <span className="dealer-login-overline">CARCRAFT ATELIER</span>
              <h1 className="dealer-login-title">DEALER ACCESS</h1>
              <p className="dealer-login-subtitle">
                Restricted administrative gateway for the verified CARCRAFT principal dealer.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="dealer-login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="dealer-login-form">
            {/* Email / Username */}
            <div className="dealer-form-group">
              <label className="dealer-form-label" htmlFor="dealer-email">
                Email / Dealer Username
              </label>
              <div className="dealer-input-wrap">
                <Mail size={17} className="dealer-input-icon" />
                <input
                  id="dealer-email"
                  type="text"
                  className="dealer-form-input"
                  placeholder="name@carcraft.atelier.internal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="dealer-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="dealer-form-label" htmlFor="dealer-password">
                  Security Passcode
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="dealer-forgot-link"
                >
                  Forgot password?
                </button>
              </div>

              <div className="dealer-input-wrap">
                <KeyRound size={17} className="dealer-input-icon" />
                <input
                  id="dealer-password"
                  type={showPassword ? 'text' : 'password'}
                  className="dealer-form-input"
                  placeholder="Enter private dealer passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="dealer-pwd-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox & Quick Demo Fill */}
            <div className="dealer-login-options">
              <label className="dealer-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="dealer-custom-checkbox"
                />
                <span>Remember identifier</span>
              </label>

              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="dealer-demo-fill-btn"
                title="Populate test dealer credentials"
              >
                Auto-fill Account
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="dealer-btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '6px' }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(0, 0, 0, 0.3)',
                      borderTopColor: '#000',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }}
                  />
                  <span>Authenticating Session...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span>LOGIN TO ATELIER</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </button>
          </form>

          {/* Card Footer Security Badge */}
          <div className="dealer-login-footer-security">
            <ShieldCheck size={16} color="var(--dealer-lime)" />
            <span>
              End-to-End Encrypted Gateway • Single Principal Account Protocol
            </span>
          </div>
        </div>
      </main>

      {/* Forgot Password Security Modal */}
      {forgotModalOpen && (
        <div className="dealer-modal-backdrop" onClick={() => setForgotModalOpen(false)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dealer-modal-icon">
              <ShieldCheck size={28} />
            </div>

            <h3 className="dealer-modal-title">Dealer Credential Recovery</h3>
            <p className="dealer-modal-text">
              For security compliance, CARCRAFT utilizes a dedicated private dealer account. Passwords cannot be reset via public email channels.
            </p>

            <div className="dealer-modal-callout">
              <strong>Recovery Protocol:</strong>
              <div>
                Execute the Django server management command on your backend environment:
              </div>
              <code style={{ display: 'block', marginTop: '6px', color: 'var(--dealer-lime)', background: '#04050a', padding: '6px 10px', borderRadius: '6px' }}>
                python manage.py reset_dealer_passcode --dealer-id=DLR-IN-9082
              </code>
            </div>

            <button
              type="button"
              className="dealer-btn-primary"
              style={{ width: '100%', marginTop: '14px' }}
              onClick={() => setForgotModalOpen(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
