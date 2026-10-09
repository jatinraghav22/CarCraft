import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogIn, X, Lock } from 'lucide-react';
import './LoginRequiredModal.css';

/**
 * LoginRequiredModal
 * Renders a full-screen overlay when a guest attempts a protected action.
 *
 * Props:
 *   isOpen    {boolean}  Whether the modal is visible
 *   onClose   {fn}       Called when user dismisses without logging in
 *   message   {string}   Optional custom message (defaults to generic login prompt)
 */
export default function LoginRequiredModal({ isOpen, onClose, message }) {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose?.();
    navigate('/login', { state: { from: location } });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div
      className="lrm-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lrm-title"
    >
      <div className="lrm-card">
        {/* Dismiss */}
        <button
          className="lrm-close"
          onClick={onClose}
          aria-label="Close"
          id="lrm-close-btn"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="lrm-icon-wrapper">
          <div className="lrm-icon-ring">
            <Lock size={28} className="lrm-lock-icon" />
          </div>
          <div className="lrm-icon-glow" />
        </div>

        {/* Badge */}
        <div className="lrm-badge">
          <ShieldCheck size={11} />
          SECURE MEMBER GATEWAY
        </div>

        {/* Title */}
        <h2 className="lrm-title" id="lrm-title">Login Required</h2>

        {/* Message */}
        <p className="lrm-message">
          {message || 'Login required to continue.'}
        </p>

        {/* CTA Buttons */}
        <div className="lrm-actions">
          <button
            className="lrm-login-btn"
            onClick={handleLogin}
            id="lrm-login-btn"
          >
            <LogIn size={16} />
            <span>Sign In to Continue</span>
          </button>
          <button
            className="lrm-cancel-btn"
            onClick={onClose}
            id="lrm-cancel-btn"
          >
            Continue Browsing
          </button>
        </div>

        {/* Footer note */}
        <p className="lrm-footer-note">
          New to CarCraft?{' '}
          <button
            className="lrm-register-link"
            onClick={() => { onClose?.(); navigate('/register', { state: { from: location } }); }}
            id="lrm-register-link"
          >
            Create a free account
          </button>
        </p>
      </div>
    </div>
  );
}
