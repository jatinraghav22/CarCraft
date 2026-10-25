// ==========================================================================
// CARCRAFT DEALER SUITE - TWO-FACTOR AUTHENTICATOR ENROLLMENT & SECURITY
// Route: /dealer/security
// ==========================================================================

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  KeyRound,
  CheckCircle2,
  Copy,
  Download,
  AlertTriangle,
  Lock,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Key
} from 'lucide-react';
import { useDealerAuth } from '../context/DealerAuthContext';
import Toast from '../components/Toast';

export default function SecurityMFA() {
  const { setupMFA, confirmMFA, getMFAStatus, disableMFA, regenerateRecoveryCodes, dealer } = useDealerAuth();

  // Status state
  const [statusLoading, setStatusLoading] = useState(true);
  const [mfaStatus, setMfaStatus] = useState({
    isEnabled: false,
    enrolledAt: null,
    recoveryCodesRemaining: 0,
  });

  // Setup workflow state: 'idle' | 'password' | 'scan' | 'recovery_display'
  const [workflowState, setWorkflowState] = useState('idle');

  // Password confirmation input
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Setup credentials returned from backend
  const [setupData, setSetupData] = useState(null); // { secret, qr_code, provisioning_uri }
  const [confirmCode, setConfirmCode] = useState('');

  // Generated recovery codes to display once
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Disable modal state
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');

  // Toast notifications
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch MFA status on component mount
  const fetchStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await getMFAStatus();
      if (res?.success) {
        setMfaStatus({
          isEnabled: Boolean(res.is_mfa_enabled),
          enrolledAt: res.enrolled_at,
          recoveryCodesRemaining: res.recovery_codes_remaining || 0,
        });
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.response?.status === 401 ? 'Session expired. Please sign in again.' : '') ||
        (err.response?.status === 403 ? 'Access denied. Authorized dealer permissions required.' : '');
      if (errMsg) {
        setToast({ type: 'error', message: errMsg });
      }
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Step 1: Request password reauthentication to start setup
  const handleInitiateSetup = () => {
    setPassword('');
    setConfirmCode('');
    setWorkflowState('password');
  };

  // Step 2: Verify password and retrieve QR code & secret from backend
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setToast({ type: 'error', message: 'Please enter your current dealer password.' });
      return;
    }

    setActionLoading(true);
    try {
      const res = await setupMFA(password);
      if (res?.success) {
        setSetupData(res);
        setWorkflowState('scan');
        setPassword('');
        setToast({ type: 'success', message: 'Authenticator setup key generated. Scan QR code.' });
      } else {
        setToast({ type: 'error', message: res?.message || 'Password verification failed. Please try again.' });
      }
    } catch (err) {
      let errMsg = '';
      if (!err.response) {
        errMsg = 'Unable to connect to the server. Please check your network connection.';
      } else {
        const data = err.response.data;
        const statusCode = err.response.status;

        if (statusCode === 401) {
          errMsg = data?.detail || 'Session expired. Please sign in again to continue.';
        } else if (statusCode === 403) {
          errMsg = data?.detail || data?.message || 'Access denied. Only authorized dealer accounts can configure MFA.';
        } else if (statusCode >= 500) {
          errMsg = 'Internal server error while verifying credentials. Please try again later.';
        } else {
          errMsg =
            data?.errors?.password?.[0] ||
            data?.errors?.current_password?.[0] ||
            data?.errors?.detail ||
            data?.errors?.non_field_errors?.[0] ||
            data?.password?.[0] ||
            data?.current_password?.[0] ||
            data?.detail ||
            data?.message ||
            'Password verification failed. Please verify your dealer credentials and try again.';
        }
      }
      setToast({ type: 'error', message: errMsg });
    } finally {
      setActionLoading(false);
    }
  };

  // Step 3: Confirm TOTP code to finalize enrollment
  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    const cleanCode = confirmCode.trim().replace(/\s+/g, '');
    if (cleanCode.length !== 6) {
      setToast({ type: 'error', message: 'Please enter a valid 6-digit code.' });
      return;
    }

    setActionLoading(true);
    try {
      const res = await confirmMFA(cleanCode);
      if (res?.success) {
        setRecoveryCodes(res.recovery_codes || []);
        setWorkflowState('recovery_display');
        setConfirmCode('');
        setToast({ type: 'success', message: 'Two-Factor Authentication is now active!' });
        fetchStatus();
      } else {
        setToast({ type: 'error', message: res?.message || 'Failed to verify authenticator code.' });
      }
    } catch (err) {
      let errMsg = '';
      if (!err.response) {
        errMsg = 'Unable to connect to the server. Please check your network connection.';
      } else {
        const data = err.response.data;
        errMsg =
          data?.errors?.code?.[0] ||
          data?.errors?.detail ||
          data?.code?.[0] ||
          data?.detail ||
          data?.message ||
          'Invalid verification code. Please check your authenticator application.';
      }
      setToast({ type: 'error', message: errMsg });
    } finally {
      setActionLoading(false);
    }
  };

  // Finish setup flow after saving recovery codes
  const handleFinishSetup = () => {
    setWorkflowState('idle');
    setSetupData(null);
    setRecoveryCodes([]);
    setPassword('');
    setConfirmCode('');
  };

  // Copy secret key
  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2500);
      setToast({ type: 'success', message: 'Secret key copied to clipboard.' });
    }
  };

  // Copy all recovery codes
  const handleCopyRecoveryCodes = () => {
    if (recoveryCodes.length > 0) {
      const formatted = [
        '==================================================',
        'CARCRAFT PRINCIPAL DEALER - EMERGENCY RECOVERY CODES',
        `Account: ${dealer.username || 'admin'}`,
        `Generated: ${new Date().toISOString()}`,
        'Keep these codes safe. Each code can only be used once.',
        '==================================================',
        ...recoveryCodes.map((c, i) => `${i + 1}. ${c}`),
      ].join('\n');

      navigator.clipboard.writeText(formatted);
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 3000);
      setToast({ type: 'success', message: 'All 8 recovery codes copied to clipboard.' });
    }
  };

  // Download recovery codes as .txt
  const handleDownloadRecoveryCodes = () => {
    if (recoveryCodes.length === 0) return;

    const formatted = [
      '==================================================',
      'CARCRAFT PRINCIPAL DEALER - EMERGENCY RECOVERY CODES',
      `Account: ${dealer.username || 'admin'}`,
      `Generated: ${new Date().toISOString()}`,
      'Keep these codes safe. Each code can only be used once.',
      '==================================================',
      '',
      ...recoveryCodes.map((c, i) => `Code ${i + 1}: ${c}`),
      '',
      'NOTE: Once consumed, each code is permanently deactivated.',
    ].join('\n');

    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carcraft-admin-recovery-codes-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast({ type: 'success', message: 'Recovery codes downloaded.' });
  };

  // Disable MFA submission
  const handleDisableSubmit = async (e) => {
    e.preventDefault();
    if (!disablePassword || !disableCode) {
      setToast({ type: 'error', message: 'Both password and current authenticator code are required.' });
      return;
    }

    setActionLoading(true);
    try {
      const res = await disableMFA(disablePassword, disableCode);
      if (res?.success) {
        setToast({ type: 'success', message: 'Two-Factor Authentication has been disabled.' });
        setDisableModalOpen(false);
        setDisablePassword('');
        setDisableCode('');
        fetchStatus();
      } else {
        setToast({ type: 'error', message: res?.message || 'Failed to disable Two-Factor Authentication.' });
      }
    } catch (err) {
      let errMsg = '';
      if (!err.response) {
        errMsg = 'Unable to connect to the server. Please check your network connection.';
      } else {
        const data = err.response.data;
        errMsg =
          data?.errors?.password?.[0] ||
          data?.errors?.current_password?.[0] ||
          data?.errors?.code?.[0] ||
          data?.errors?.detail ||
          data?.password?.[0] ||
          data?.code?.[0] ||
          data?.detail ||
          data?.message ||
          'Failed to disable Two-Factor Authentication. Please verify credentials.';
      }
      setToast({ type: 'error', message: errMsg });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <ShieldCheck size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Two-Factor Authentication (TOTP)</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Configure RFC 6238 time-based one-time passcodes using Google Authenticator, Microsoft Authenticator, or 1Password.
          </p>
        </div>

        <div>
          <span
            className="dealer-category-badge"
            style={{
              padding: '8px 16px',
              fontSize: '0.82rem',
              color: mfaStatus.isEnabled ? 'var(--dealer-lime)' : 'var(--dealer-amber)',
              borderColor: mfaStatus.isEnabled ? 'rgba(190, 242, 100, 0.4)' : 'rgba(245, 158, 11, 0.4)',
              background: mfaStatus.isEnabled ? 'rgba(190, 242, 100, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {mfaStatus.isEnabled ? (
              <>
                <CheckCircle2 size={16} />
                <span>2FA STATUS: ENFORCED & ACTIVE</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                <span>2FA STATUS: NOT CONFIGURED</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Status Card */}
        <div className="dealer-form-section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                className="dealer-login-icon-box"
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  background: mfaStatus.isEnabled ? 'rgba(190, 242, 100, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: mfaStatus.isEnabled ? 'rgba(190, 242, 100, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {mfaStatus.isEnabled ? (
                  <ShieldCheck size={26} color="var(--dealer-lime)" />
                ) : (
                  <ShieldAlert size={26} color="var(--dealer-amber)" />
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--dealer-font-heading)' }}>
                  {mfaStatus.isEnabled
                    ? 'Administrator Enclave is Protected'
                    : 'Enhance Atelier Security with TOTP MFA'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--dealer-text-secondary)', marginTop: '4px' }}>
                  {mfaStatus.isEnabled
                    ? `Enrolled on ${new Date(mfaStatus.enrolledAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Requires 6-digit passcode on every sign-in.`
                    : 'Protect administrative dealership assets and inventory from credential compromise.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              {mfaStatus.isEnabled ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setDisableModalOpen(true)}
                    className="dealer-btn-danger"
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    Disable 2FA
                  </button>
                  <button
                    type="button"
                    onClick={handleInitiateSetup}
                    className="dealer-btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    Reconfigure App
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInitiateSetup}
                  className="dealer-btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  <Smartphone size={16} />
                  <span>CONFIGURE AUTHENTICATOR APP</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          {mfaStatus.isEnabled && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div className="dealer-spec-pill" style={{ borderLeft: '3px solid var(--dealer-lime)' }}>
                <span className="label">Protocol Algorithm</span>
                <span className="val" style={{ color: 'var(--dealer-lime)' }}>RFC 6238 TOTP (SHA-1, 30s)</span>
              </div>
              <div className="dealer-spec-pill" style={{ borderLeft: '3px solid var(--dealer-cyan)' }}>
                <span className="label">Active Backup Codes</span>
                <span className="val" style={{ color: 'var(--dealer-cyan)' }}>
                  {mfaStatus.recoveryCodesRemaining} Available
                </span>
              </div>
              <div className="dealer-spec-pill" style={{ borderLeft: '3px solid var(--dealer-purple)' }}>
                <span className="label">Replay Window</span>
                <span className="val" style={{ color: 'var(--dealer-purple)' }}>Zero Replay / Single Step</span>
              </div>
            </div>
          )}
        </div>

        {/* ==========================================================
            WORKFLOW 1: PASSWORD CONFIRMATION (REAUTHENTICATION)
            ========================================================== */}
        {workflowState === 'password' && (
          <div className="dealer-form-section-card" style={{ border: '1px solid var(--dealer-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Lock size={20} color="var(--dealer-lime)" />
              <h3 style={{ color: '#fff', fontSize: '1.15rem' }}>Step 1: Reauthenticate Master Password</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--dealer-text-secondary)', marginBottom: '16px' }}>
              For your protection, confirm your current private dealer password before generating authenticator keys.
            </p>

            <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '440px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label" htmlFor="reauth-password">
                  Current Dealer Password
                </label>
                <div className="dealer-input-wrap">
                  <KeyRound size={17} className="dealer-input-icon" />
                  <input
                    id="reauth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="dealer-form-input"
                    placeholder="Enter private dealer passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    className="dealer-pwd-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button
                  type="submit"
                  className="dealer-btn-primary"
                  disabled={actionLoading || !password}
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  {actionLoading ? 'Verifying Password...' : 'PROCEED TO SCAN QR CODE'}
                </button>
                <button
                  type="button"
                  onClick={() => setWorkflowState('idle')}
                  className="dealer-btn-secondary"
                  style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================================
            WORKFLOW 2: QR CODE SCAN & 6-DIGIT CODE CONFIRMATION
            ========================================================== */}
        {workflowState === 'scan' && setupData && (
          <div className="dealer-form-section-card" style={{ border: '1px solid rgba(190, 242, 100, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Smartphone size={20} color="var(--dealer-lime)" />
              <h3 style={{ color: '#fff', fontSize: '1.15rem' }}>Step 2: Connect Authenticator Application</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--dealer-text-secondary)', marginBottom: '20px' }}>
              Open your authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy), scan this QR code, and enter the 6-digit confirmation code below.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'center' }}>
              {/* QR Code Container */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
                }}
              >
                <img
                  src={setupData.qr_code}
                  alt="CarCraft Admin TOTP QR Code"
                  style={{ width: '220px', height: '220px', display: 'block' }}
                />
                <span style={{ color: '#000', fontSize: '0.72rem', fontWeight: 600, marginTop: '8px', letterSpacing: '0.05em' }}>
                  CARCRAFT ADMIN MFA
                </span>
              </div>

              {/* Manual Entry Key & Confirmation Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span className="dealer-form-label" style={{ color: 'var(--dealer-text-secondary)' }}>
                    Can't scan? Enter setup key manually:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <code
                      style={{
                        padding: '10px 14px',
                        background: '#04050a',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: 'var(--dealer-lime)',
                        fontFamily: 'monospace',
                        fontSize: '0.92rem',
                        letterSpacing: '0.12em',
                        flex: 1,
                        overflowX: 'auto'
                      }}
                    >
                      {setupData.secret}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="dealer-btn-secondary"
                      style={{ padding: '8px 14px', gap: '6px', fontSize: '0.78rem' }}
                      title="Copy setup key"
                    >
                      {copiedSecret ? <Check size={14} color="var(--dealer-lime)" /> : <Copy size={14} />}
                      <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--dealer-text-muted)', display: 'block', marginTop: '4px' }}>
                    Account: {dealer.username || 'admin'} • Issuer: CarCraft Admin • Type: Time-based
                  </span>
                </div>

                {/* Form to submit 6-digit confirmation code */}
                <form onSubmit={handleConfirmSubmit} style={{ marginTop: '8px' }}>
                  <div className="dealer-form-group">
                    <label className="dealer-form-label" htmlFor="confirm-code-input">
                      Enter 6-Digit Authenticator Code to Confirm:
                    </label>
                    <div className="dealer-input-wrap" style={{ maxWidth: '280px' }}>
                      <Smartphone size={17} className="dealer-input-icon" />
                      <input
                        id="confirm-code-input"
                        type="text"
                        className="dealer-form-input"
                        style={{
                          letterSpacing: '0.3em',
                          fontFamily: 'monospace',
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          textAlign: 'center',
                          color: 'var(--dealer-lime)'
                        }}
                        placeholder="000000"
                        value={confirmCode}
                        onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        maxLength={6}
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button
                      type="submit"
                      className="dealer-btn-primary"
                      disabled={actionLoading || confirmCode.length !== 6}
                      style={{ padding: '10px 22px', fontSize: '0.85rem' }}
                    >
                      {actionLoading ? 'Activating 2FA...' : 'CONFIRM & ACTIVATE 2FA'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkflowState('idle')}
                      className="dealer-btn-secondary"
                      style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            WORKFLOW 3: ONE-TIME RECOVERY CODES DISPLAY
            ========================================================== */}
        {workflowState === 'recovery_display' && recoveryCodes.length > 0 && (
          <div
            className="dealer-form-section-card"
            style={{
              border: '2px solid var(--dealer-lime)',
              background: 'rgba(190, 242, 100, 0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(190, 242, 100, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle2 size={22} color="var(--dealer-lime)" />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', fontFamily: 'var(--dealer-font-heading)' }}>
                  Two-Factor Authentication is Active!
                </h3>
                <span style={{ color: 'var(--dealer-lime)', fontSize: '0.82rem', fontWeight: 600 }}>
                  STEP 3 OF 3: SAVE EMERGENCY BACKUP RECOVERY CODES
                </span>
              </div>
            </div>

            {/* Warning Callout */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '14px 16px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                margin: '16px 0',
                fontSize: '0.84rem',
                color: '#fef3c7',
                lineHeight: 1.5
              }}
            >
              <AlertTriangle size={20} color="var(--dealer-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>IMPORTANT SECURITY NOTICE:</strong> These recovery codes will be shown <u>only once</u>.
                If you ever lose access to your authenticator application or device, you can enter any unused code to sign into the atelier. Store them in a password manager or safe physical location.
              </div>
            </div>

            {/* Recovery Codes Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                margin: '18px 0'
              }}
            >
              {recoveryCodes.map((code, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: '#04050a',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#fff',
                    textAlign: 'center',
                    userSelect: 'all'
                  }}
                >
                  <span style={{ color: 'var(--dealer-text-muted)', fontSize: '0.72rem', marginRight: '6px' }}>
                    #{idx + 1}
                  </span>
                  {code}
                </div>
              ))}
            </div>

            {/* Recovery Code Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleCopyRecoveryCodes}
                  className="dealer-btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.82rem', gap: '8px' }}
                >
                  {copiedCodes ? <Check size={16} color="var(--dealer-lime)" /> : <Copy size={16} />}
                  <span>{copiedCodes ? 'COPIED TO CLIPBOARD' : 'COPY ALL CODES'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadRecoveryCodes}
                  className="dealer-btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.82rem', gap: '8px' }}
                >
                  <Download size={16} />
                  <span>DOWNLOAD (.TXT)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleFinishSetup}
                className="dealer-btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.85rem' }}
              >
                <span>I HAVE SAVED MY CODES SAFELY</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Disable 2FA Modal */}
      {disableModalOpen && (
        <div className="dealer-modal-backdrop" onClick={() => setDisableModalOpen(false)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <AlertTriangle size={22} color="#f87171" />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Disable Two-Factor Authentication</h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--dealer-text-secondary)', marginTop: '14px', lineHeight: 1.5 }}>
              Disabling Two-Factor Authentication reduces the security of your principal dealership account. To confirm, enter your current password and a valid 6-digit authenticator code or recovery code.
            </p>

            <form onSubmit={handleDisableSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label" htmlFor="disable-password-input">
                  Private Dealer Password
                </label>
                <div className="dealer-input-wrap">
                  <KeyRound size={17} className="dealer-input-icon" />
                  <input
                    id="disable-password-input"
                    type="password"
                    className="dealer-form-input"
                    placeholder="Enter password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label" htmlFor="disable-code-input">
                  Authenticator Code or Recovery Code
                </label>
                <div className="dealer-input-wrap">
                  <Smartphone size={17} className="dealer-input-icon" />
                  <input
                    id="disable-code-input"
                    type="text"
                    className="dealer-form-input"
                    placeholder="000000 or recovery code"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value.trim())}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="dealer-btn-danger"
                  style={{ flex: 1, padding: '12px' }}
                  disabled={actionLoading || !disablePassword || !disableCode}
                >
                  {actionLoading ? 'Disabling...' : 'CONFIRM DISABLE 2FA'}
                </button>
                <button
                  type="button"
                  onClick={() => setDisableModalOpen(false)}
                  className="dealer-btn-secondary"
                  style={{ padding: '12px 18px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
