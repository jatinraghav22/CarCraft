import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'System Telemetry Error',
  message = 'Unable to establish connection with internal records.',
  onRetry
}) {
  return (
    <div className="dealer-table-empty">
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--dealer-rose)'
        }}
      >
        <AlertCircle size={26} />
      </div>
      <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.2rem', color: '#fff', marginTop: '6px' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--dealer-text-secondary)', fontSize: '0.86rem', maxWidth: '440px', lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          className="dealer-btn-primary"
          onClick={onRetry}
          style={{ marginTop: '8px' }}
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
