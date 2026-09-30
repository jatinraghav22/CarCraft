import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend = 'positive',
  subtext
}) {
  return (
    <div className="dealer-stat-card">
      <div className="dealer-stat-card-top">
        <div className="dealer-stat-icon-wrap">
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>
        {change && (
          <div className={`dealer-stat-trend ${trend}`}>
            {trend === 'positive' && <ArrowUpRight size={13} />}
            {trend === 'negative' && <ArrowDownRight size={13} />}
            {trend === 'neutral' && <Minus size={13} />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="dealer-stat-body">
        <div className="dealer-stat-value">{value}</div>
        <div className="dealer-stat-label">{label}</div>
      </div>

      {subtext && <div className="dealer-stat-footer">{subtext}</div>}
    </div>
  );
}
