import React from 'react';
import { ArrowUpRight, ShieldCheck, Info } from 'lucide-react';

export default function FinancialCard({
  variant = 'revenue', // 'revenue' | 'expenses' | 'gross-profit' | 'net-profit'
  title,
  amount,
  change,
  subtitle,
  formula,
  margin
}) {
  const getAmountColorClass = () => {
    switch (variant) {
      case 'revenue':
        return 'lime';
      case 'net-profit':
        return 'emerald';
      case 'expenses':
        return 'amber';
      case 'gross-profit':
        return 'cyan';
      default:
        return '';
    }
  };

  return (
    <div className={`dealer-financial-card ${variant}`}>
      <div className="dealer-financial-header">
        <span className="dealer-financial-tag">{title}</span>
        {margin && (
          <span className="dealer-financial-badge text-lime" style={{ background: 'rgba(190, 242, 100, 0.08)' }}>
            {margin}
          </span>
        )}
      </div>

      <div className="dealer-financial-value-wrap">
        <div className={`dealer-financial-amount ${getAmountColorClass()}`}>{amount}</div>
        {subtitle && <div className="dealer-stat-label">{subtitle}</div>}
      </div>

      {formula && (
        <div className="dealer-financial-formula" title="Accounting Standard Formula">
          <span style={{ color: 'var(--dealer-lime)', marginRight: '4px' }}>ƒ</span>
          {formula}
        </div>
      )}

      {change && (
        <div className="dealer-financial-meta">
          <span style={{ color: 'var(--dealer-text-muted)' }}>Comparison</span>
          <span style={{ color: 'var(--dealer-emerald)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <ArrowUpRight size={13} /> {change}
          </span>
        </div>
      )}
    </div>
  );
}
