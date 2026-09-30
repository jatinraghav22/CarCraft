import React from 'react';

export default function LoadingState({ message = 'Retrieving Telemetry...' }) {
  return (
    <div className="dealer-table-loading" style={{ minHeight: '320px' }}>
      <div className="dealer-spinner" />
      <span style={{ fontFamily: 'var(--dealer-font-mono)', fontSize: '0.85rem', color: 'var(--dealer-lime)' }}>
        {message}
      </span>
    </div>
  );
}
