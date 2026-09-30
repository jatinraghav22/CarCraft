import React from 'react';

export function ShimmerBlock({ width = '100%', height = '18px', borderRadius = '6px', style = {} }) {
  return (
    <div
      className="dealer-shimmer-block"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="dealer-table-skeleton-wrap">
      <div className="dealer-table-skeleton-header">
        {Array.from({ length: cols }).map((_, i) => (
          <ShimmerBlock key={i} height="14px" width={i === 0 ? '120px' : '75%'} />
        ))}
      </div>
      <div className="dealer-table-skeleton-body">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="dealer-table-skeleton-row">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="dealer-table-skeleton-cell">
                <ShimmerBlock
                  height={cIdx === 0 ? '24px' : '16px'}
                  width={cIdx === 0 ? '85%' : `${50 + ((rIdx + cIdx) % 4) * 12}%`}
                  borderRadius={cIdx === 0 ? '8px' : '4px'}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatSkeletonGrid({ count = 4 }) {
  return (
    <div className="dealer-kpi-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="dealer-stat-card skeleton">
          <div className="dealer-stat-header" style={{ marginBottom: '12px' }}>
            <ShimmerBlock width="90px" height="14px" />
            <ShimmerBlock width="38px" height="38px" borderRadius="10px" />
          </div>
          <ShimmerBlock width="60%" height="32px" style={{ marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <ShimmerBlock width="50px" height="18px" borderRadius="999px" />
            <ShimmerBlock width="110px" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeletonGrid({ count = 3 }) {
  return (
    <div className="dealer-card-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="dealer-panel skeleton-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <ShimmerBlock width="40%" height="20px" />
            <ShimmerBlock width="20%" height="16px" borderRadius="999px" />
          </div>
          <ShimmerBlock width="100%" height="140px" borderRadius="12px" style={{ marginBottom: '16px' }} />
          <ShimmerBlock width="70%" height="18px" style={{ marginBottom: '10px' }} />
          <ShimmerBlock width="90%" height="14px" style={{ marginBottom: '16px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <ShimmerBlock width="50%" height="38px" borderRadius="8px" />
            <ShimmerBlock width="50%" height="38px" borderRadius="8px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default {
  ShimmerBlock,
  TableSkeleton,
  StatSkeletonGrid,
  CardSkeletonGrid
};
