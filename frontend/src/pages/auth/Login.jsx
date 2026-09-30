import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, quickDemoLogin, demoProfiles, loading, authLoading, isAuthenticated, user } = useAuth();

  const customerIsLoggedIn = Boolean(
    isAuthenticated &&
    user &&
    (!user.role || user.role === 'CUSTOMER' || user.role !== 'DEALER')
  );

  // If already authenticated customer opens /login, redirect to homepage
  useEffect(() => {
    if (!authLoading && customerIsLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [customerIsLoggedIn, authLoading, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Destination after login: redirect to homepage "/" per requirement
  const from = location.state?.from?.pathname || '/';

  // Do not render login page if already authenticated or while restoring session
  if (!authLoading && customerIsLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (authLoading) {
    return (
      <div className="auth-page" style={{ minHeight: '100vh', background: '#040508' }}>
        <Navbar />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your member email and password');
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg('Authentication failed. Please verify your credentials.');
    }
  };

  const handleDemoSelect = (idx) => {
    quickDemoLogin(idx);
    navigate(from, { replace: true });
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
                <ShieldCheck size={13} />
                SECURE CONCIERGE GATEWAY
              </div>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">
                Access your CarCraft vehicle allocations, telemetry & private garage.
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="auth-tabs">
              <button className="auth-tab-btn active" type="button">
                <Lock size={14} />
                Sign In
              </button>
              <Link to="/register" className="auth-tab-btn" style={{ textDecoration: 'none' }}>
                <Sparkles size={14} />
                Register
              </Link>
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

            {/* Login Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="login-email">
                  Member Email
                </label>
                <div className="auth-input-container">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="auth-input"
                    placeholder="pilot@carcraft.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-field">
                <div className="auth-label-row">
                  <label className="auth-label" htmlFor="login-password">
                    Passcode / Key
                  </label>
                  <span className="auth-forgot-link" style={{ cursor: 'pointer' }}>
                    Forgot Key?
                  </span>
                </div>
                <div className="auth-input-container">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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

              {/* Remember Me */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#bef264', cursor: 'pointer' }}
                  />
                  Keep terminal session docked
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span>AUTHENTICATING TELEMETRY...</span>
                ) : (
                  <>
                    <span>AUTHENTICATE ACCESS</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Instant Demo Credentials */}
            <div className="auth-demo-divider">
              <span>OR 1-CLICK INSTANT DEMO ACCESS</span>
            </div>

            <div className="auth-demo-profiles">
              {demoProfiles.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  className="auth-demo-pill"
                  onClick={() => handleDemoSelect(idx)}
                >
                  <div className="auth-demo-pill-left">
                    <img src={p.avatar} alt={p.name} className="auth-demo-avatar" />
                    <div>
                      <span className="auth-demo-name">{p.name}</span>
                      <span className="auth-demo-email">{p.email}</span>
                    </div>
                  </div>
                  <span className="auth-demo-badge">{p.tier}</span>
                </button>
              ))}
            </div>

            {/* Footer Notice */}
            <div className="auth-security-footer">
              <Zap size={13} color="#bef264" />
              <span>256-BIT ENCRYPTED AUTOMOTIVE SUITE</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
