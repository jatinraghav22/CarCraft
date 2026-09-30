import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Destructive Action',
  message = 'Are you sure you want to proceed? This change cannot be undone.',
  confirmText = 'Delete Record',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="dealer-modal-backdrop" onClick={onCancel}>
      <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          className="dealer-modal-icon"
          style={{
            background: confirmVariant === 'danger' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(190, 242, 100, 0.15)',
            borderColor: confirmVariant === 'danger' ? 'rgba(244, 63, 94, 0.4)' : 'var(--dealer-border-lime)',
            color: confirmVariant === 'danger' ? 'var(--dealer-rose)' : 'var(--dealer-lime)'
          }}
        >
          {confirmVariant === 'danger' ? <Trash2 size={26} /> : <AlertTriangle size={26} />}
        </div>

        <h3 className="dealer-modal-title">{title}</h3>
        <p className="dealer-modal-text">{message}</p>

        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '12px' }}>
          <button
            type="button"
            className="dealer-btn-secondary"
            style={{ flex: 1, padding: '12px' }}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={confirmVariant === 'danger' ? 'dealer-btn-danger' : 'dealer-btn-primary'}
            style={{ flex: 1, padding: '12px' }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
