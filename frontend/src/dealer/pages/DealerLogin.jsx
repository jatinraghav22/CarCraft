// ==========================================================================
// CARCRAFT DEALER SUITE - DEALER LOGIN & 2FA TOTP GATEWAY
// Restricted access portal for CARCRAFT Principal Dealership
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  KeyRound,
  Smartphone,
  Clock,
  Key
} from 'lucide-react';
import { useDealerAuth } from '../context/DealerAuthContext';

export default function DealerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyMFA, loading, rememberedEmail } = useDealerAuth();

  // Step state: 'credentials' | 'totp'
  const [step, setStep] = useState('credentials');

  // Step 1: Credentials
  const [email, setEmail] = useState(rememberedEmail || 'admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Step 2: MFA Challenge
  const [challengeToken, setChallengeToken] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [expiresIn, setExpiresIn] = useState(300);
  const [timeLeft, setTimeLeft] = useState(300);

  // Common error state
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dealer/dashboard';

  // Countdown timer for MFA challenge
  useEffect(() => {
    if (step !== 'totp') return;

    setTimeLeft(expiresIn);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, expiresIn]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Step 1 submission: Username & Password
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login({ email, password, rememberMe });
    if (res.success) {
      // Safe bootstrap case: 2FA not enrolled yet
      navigate(from, { replace: true });
    } else if (res.mfaRequired) {
      // 2FA is required: transition to Step 2
      setChallengeToken(res.challengeToken);
      setExpiresIn(res.expiresIn || 300);
      setStep('totp');
      setOtpCode('');
      setError('');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  // Step 2 submission: 6-digit TOTP or Recovery Code
  const handleMFASubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (timeLeft <= 0) {
      setError('Challenge expired. Please return to step 1 to sign in again.');
      return;
    }

    const cleanCode = otpCode.trim();
    if (!cleanCode) {
      setError(isRecoveryMode ? 'Please enter a recovery code.' : 'Please enter the 6-digit authenticator code.');
      return;
    }

    const res = await verifyMFA({
      challengeToken,
      code: cleanCode,
      rememberMe,
      email,
    });

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Invalid verification code. Please check your authenticator application.');
    }
  };

  const handleCancelChallenge = () => {
    setStep('credentials');
    setChallengeToken('');
    setOtpCode('');
    setIsRecoveryMode(false);
    setError('');
  };

  const handleQuickDemoFill = () => {
    setEmail('admin');
    setPassword('admin123');
    setError('');
  };

  const handleOtpChange = (e) => {
    const val = e.target.value;
    if (isRecoveryMode) {
      setOtpCode(val.toUpperCase());
    } else {
      // Numbers only, max 6 digits
      const digitsOnly = val.replace(/\D/g, '').slice(0, 6);
      setOtpCode(digitsOnly);
    }
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
          {step === 'credentials' ? (
            /* ==========================================================
               STEP 1: USERNAME & PASSWORD
               ========================================================== */
            <>
              <div className="dealer-login-header">
                <div className="dealer-login-icon-box">
                  <Lock size={22} />
                </div>

                <div className="dealer-login-title-wrap">
                  <span className="dealer-login-overline">CARCRAFT ATELIER • STEP 1 OF 2</span>
                  <h1 className="dealer-login-title">DEALER ACCESS</h1>
                  <p className="dealer-login-subtitle">
                    Restricted administrative gateway for the verified CARCRAFT principal dealer.
                  </p>
                </div>
              </div>

              {error && (
                <div className="dealer-login-error" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="dealer-login-form">
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
                      <span>Authenticating Credentials...</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span>CONTINUE TO 2FA</span>
                      <ArrowRight size={16} />
                    </div>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* ==========================================================
               STEP 2: AUTHENTICATOR APP TOTP / RECOVERY CODE
               ========================================================== */
            <>
              <div className="dealer-login-header">
                <div
                  className="dealer-login-icon-box"
                  style={{ background: 'rgba(190, 242, 100, 0.1)', borderColor: 'rgba(190, 242, 100, 0.3)' }}
                >
                  {isRecoveryMode ? (
                    <Key size={22} color="var(--dealer-lime)" />
                  ) : (
                    <Smartphone size={22} color="var(--dealer-lime)" />
                  )}
                </div>

                <div className="dealer-login-title-wrap">
                  <span className="dealer-login-overline" style={{ color: 'var(--dealer-lime)' }}>
                    SECURITY PROTOCOL • STEP 2 OF 2
                  </span>
                  <h1 className="dealer-login-title">
                    {isRecoveryMode ? 'RECOVERY CODE' : 'AUTHENTICATOR OTP'}
                  </h1>
                  <p className="dealer-login-subtitle">
                    {isRecoveryMode
                      ? 'Enter one of your 12-character one-time emergency backup recovery codes.'
                      : 'Enter the 6-digit code generated by Google Authenticator, Microsoft Authenticator, or compatible TOTP app.'}
                  </p>
                </div>
              </div>

              {/* Countdown timer badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dealer-text-secondary)' }}>
                  <Clock size={15} color={timeLeft < 60 ? '#f87171' : 'var(--dealer-lime)'} />
                  <span>Challenge Validity</span>
                </div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: timeLeft < 60 ? '#f87171' : 'var(--dealer-lime)',
                    letterSpacing: '0.05em'
                  }}
                >
                  {timeLeft > 0 ? formatTimer(timeLeft) : 'EXPIRED'}
                </span>
              </div>

              {error && (
                <div className="dealer-login-error" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleMFASubmit} className="dealer-login-form">
                <div className="dealer-form-group">
                  <label className="dealer-form-label" htmlFor="mfa-code-input">
                    {isRecoveryMode ? 'Emergency Recovery Code' : '6-Digit Authenticator Code'}
                  </label>
                  <div className="dealer-input-wrap">
                    {isRecoveryMode ? (
                      <Key size={17} className="dealer-input-icon" />
                    ) : (
                      <Smartphone size={17} className="dealer-input-icon" />
                    )}
                    <input
                      id="mfa-code-input"
                      type="text"
                      className="dealer-form-input"
                      style={{
                        letterSpacing: isRecoveryMode ? '0.12em' : '0.35em',
                        fontFamily: 'monospace',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        color: 'var(--dealer-lime)'
                      }}
                      placeholder={isRecoveryMode ? 'XXXX-XXXX-XXXX' : '000000'}
                      value={otpCode}
                      onChange={handleOtpChange}
                      autoComplete="one-time-code"
                      inputMode={isRecoveryMode ? 'text' : 'numeric'}
                      maxLength={isRecoveryMode ? 20 : 6}
                      autoFocus
                      required
                    />
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--dealer-text-muted)', marginTop: '4px' }}>
                    {isRecoveryMode
                      ? 'Format: 12 alphanumeric characters. Hyphens are optional.'
                      : 'Changes every 30 seconds in your Authenticator application.'}
                  </div>
                </div>

                {/* Switch between TOTP and Recovery Code */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px', marginBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode((prev) => !prev);
                      setOtpCode('');
                      setError('');
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--dealer-text-secondary)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--dealer-lime)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--dealer-text-secondary)')}
                  >
                    {isRecoveryMode
                      ? '← Use 6-Digit Authenticator App Code'
                      : 'Lost access to your device? Use an emergency recovery code'}
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="dealer-btn-primary"
                  style={{ width: '100%', padding: '14px', marginTop: '6px' }}
                  disabled={loading || timeLeft <= 0}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
                      <span>Verifying Two-Factor Code...</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <ShieldCheck size={18} />
                      <span>VERIFY & ACCESS ATELIER</span>
                    </div>
                  )}
                </button>

                {/* Back to Step 1 Button */}
                <button
                  type="button"
                  onClick={handleCancelChallenge}
                  className="dealer-btn-secondary"
                  style={{ width: '100%', padding: '10px', marginTop: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
                >
                  <ArrowLeft size={14} />
                  <span>Cancel / Back to Sign In</span>
                </button>
              </form>
            </>
          )}

          {/* Card Footer Security Badge */}
          <div className="dealer-login-footer-security">
            <ShieldCheck size={16} color="var(--dealer-lime)" />
            <span>
              RFC 6238 TOTP Standard • Zero-Knowledge Replay Prevention Active
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
              <strong>Admin Recovery Protocol:</strong>
              <div>
                Execute the Django server management command on your backend environment:
              </div>
              <code style={{ display: 'block', marginTop: '6px', color: 'var(--dealer-lime)', background: '#04050a', padding: '6px 10px', borderRadius: '6px' }}>
                python manage.py reset_admin_mfa --username=admin
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
