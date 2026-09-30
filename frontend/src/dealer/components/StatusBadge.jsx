import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');

  const getStatusClass = () => {
    switch (normalized) {
      case 'available':
      case 'in_stock':
      case 'active':
      case 'completed':
        return 'available';
      case 'reserved':
      case 'pending':
      case 'in_progress':
        return 'pending';
      case 'sold':
        return 'completed';
      case 'unavailable':
      case 'out_of_stock':
      case 'rejected':
      case 'cancelled':
        return 'cancelled';
      default:
        return 'neutral';
    }
  };

  return (
    <span className={`dealer-status-badge ${getStatusClass()}`}>
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: 'currentColor'
        }}
      />
      {status}
    </span>
  );
}
