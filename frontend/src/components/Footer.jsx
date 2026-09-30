import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, ArrowUpRight, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#040508',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 20,
        color: '#94a3b8',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '60px 28px 36px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand info */}
          <div style={{ maxWidth: '320px' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #bef264, #84cc16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(190, 242, 100, 0.35)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Space Grotesk, monospace',
                    fontWeight: 900,
                    fontSize: '14px',
                    color: '#080a08',
                  }}
                >
                  CC
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                CARCRAFT
              </div>
            </Link>
            <p
              style={{
                fontSize: '0.86rem',
                lineHeight: 1.6,
                color: '#64748b',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '20px',
              }}
            >
              Next-generation automotive inventory, bespoke performance engineering, and intelligent service management suite.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                {
                  label: 'Instagram',
                  href: 'https://instagram.com',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  ),
                },
                {
                  label: 'LinkedIn',
                  href: 'https://linkedin.com',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  ),
                },
                {
                  label: 'YouTube',
                  href: 'https://youtube.com',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  ),
                },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#bef264';
                    e.currentTarget.style.borderColor = 'rgba(190, 242, 100, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}
            >
              Fleet & Studio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/vehicles" style={linkStyle}>Vehicles Marketplace</Link>
              <Link to="/parts" style={linkStyle}>Parts & Aerokits</Link>
              <Link to="/showroom" style={linkStyle}>3D Virtual Showroom</Link>
              <Link to="/configurator" style={linkStyle}>3D Bespoke Configurator</Link>
              <Link to="/compare" style={linkStyle}>Vehicle Spec Matrix</Link>
              <Link to="/test-drive" style={linkStyle}>Test Drive & Circuit Pass</Link>
            </div>
          </div>

          {/* Concierge & Finance */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}
            >
              Services & Finance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/financing" style={linkStyle}>Financing & Lease Calculator</Link>
              <Link to="/sell" style={linkStyle}>Sell / Trade Valuation</Link>
              <Link to="/service" style={linkStyle}>Master Studio Service</Link>
              <Link to="/dealerships" style={linkStyle}>Global Atelier Locator</Link>
              <Link to="/orders" style={linkStyle}>Live Order & Build Tracker</Link>
              <Link to="/search" style={linkStyle}>Universal Omnibar Search</Link>
            </div>
          </div>

          {/* Member & Company */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}
            >
              Company & Member
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/profile" style={linkStyle}>Member Terminal / Garage</Link>
              <Link to="/about" style={linkStyle}>Heritage & Leadership</Link>
              <Link to="/journal" style={linkStyle}>Telemetry Engineering Journal</Link>
              <Link to="/reviews" style={linkStyle}>Verified Owner Testimonials</Link>
              <Link to="/support" style={linkStyle}>Support & FAQ Knowledge Base</Link>
              <Link to="/wishlist" style={linkStyle}>Saved Fleet Collection</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          <div>
            © 2026 CARCRAFT Automotive Technology Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/privacy" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/support" style={{ color: '#64748b', textDecoration: 'none' }}>Concierge Accord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const linkStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.86rem',
  fontFamily: 'Inter, sans-serif',
  transition: 'color 0.2s ease',
  display: 'inline-block',
  cursor: 'pointer',
};
