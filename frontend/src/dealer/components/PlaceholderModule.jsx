import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction, ShieldCheck } from 'lucide-react';

export default function PlaceholderModule({ title, phase, description }) {
  return (
    <div
      style={{
        padding: '60px 40px',
        background: 'var(--dealer-bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--dealer-border-subtle)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        minHeight: '400px'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(190, 242, 100, 0.1)',
          border: '1px solid var(--dealer-border-lime)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--dealer-lime)'
        }}
      >
        <Construction size={28} />
      </div>

      <div style={{ fontFamily: 'var(--dealer-font-mono)', fontSize: '0.8rem', color: 'var(--dealer-lime)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {phase || 'Upcoming Phase'}
      </div>

      <h2 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
        {title} Module
      </h2>

      <p style={{ maxWidth: '520px', color: 'var(--dealer-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
        {description || 'This administrative module is scheduled for implementation in upcoming development phases according to the roadmap.'}
      </p>

      <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
        <Link to="/dealer/dashboard" className="dealer-btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--dealer-text-muted)' }}>
        <ShieldCheck size={14} color="var(--dealer-lime)" />
        <span>Private Dealer Enclave • CARCRAFT Automotive Suite</span>
      </div>
    </div>
  );
}
