import React from 'react';
import { Inbox, RefreshCw } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No Records Found',
  message = 'There are no active records matching your criteria.',
  actionLabel,
  onAction
}) {
  return (
    <div className="dealer-table-empty">
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--dealer-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--dealer-text-muted)'
        }}
      >
        <Icon size={26} />
      </div>
      <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.2rem', color: '#fff', marginTop: '6px' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--dealer-text-secondary)', fontSize: '0.86rem', maxWidth: '440px', lineHeight: 1.5 }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="dealer-btn-secondary"
          onClick={onAction}
          style={{ marginTop: '8px' }}
        >
          <RefreshCw size={14} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
