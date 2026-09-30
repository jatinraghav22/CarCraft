import React, { useState } from 'react';

export default function ChartCard({
  title,
  subtitle,
  period,
  onPeriodChange,
  seriesData,
  chartType = 'area' // 'area' | 'bar'
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const labels = seriesData?.labels || [];
  const revenue = seriesData?.revenue || [];
  const expenses = seriesData?.expenses || [];
  const profit = seriesData?.profit || [];

  // Determine scaling for SVG
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(
    ...revenue,
    ...expenses,
    ...profit,
    100
  ) * 1.15;

  const getX = (index) => {
    if (labels.length <= 1) return width / 2;
    return paddingX + (index / (labels.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val) => {
    const usableHeight = height - paddingY * 2;
    return height - paddingY - (val / maxVal) * usableHeight;
  };

  // Generate SVG path strings
  const createPath = (data) => {
    if (!data.length) return '';
    return data
      .map((val, idx) => {
        const x = getX(idx);
        const y = getY(val);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const createAreaPath = (data) => {
    if (!data.length) return '';
    const linePath = createPath(data);
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottomY = height - paddingY;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const revenuePath = createPath(revenue);
  const revenueArea = createAreaPath(revenue);
  const expensePath = createPath(expenses);
  const expenseArea = createAreaPath(expenses);

  return (
    <div className="dealer-chart-card">
      <div className="dealer-chart-header">
        <div className="dealer-chart-title-area">
          <div className="dealer-chart-title">{title}</div>
          <div className="dealer-chart-subtitle">{subtitle}</div>
        </div>

        <div className="dealer-period-switcher">
          {['monthly', 'weekly', 'yearly', 'custom'].map((p) => (
            <button
              key={p}
              type="button"
              className={`dealer-period-btn ${period === p ? 'active' : ''}`}
              onClick={() => onPeriodChange(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="dealer-svg-chart-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="dealer-svg-canvas"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Lime Glow Gradient for Revenue */}
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bef264" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#bef264" stopOpacity="0.0" />
            </linearGradient>

            {/* Amber/Rose Gradient for Expenses */}
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingY + ratio * (height - paddingY * 2);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
            );
          })}

          {chartType === 'area' ? (
            <>
              {/* Expense Area & Line */}
              <path d={expenseArea} fill="url(#expenseGradient)" />
              <path
                d={expensePath}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Revenue Area & Line */}
              <path d={revenueArea} fill="url(#revenueGradient)" />
              <path
                d={revenuePath}
                fill="none"
                stroke="#bef264"
                strokeWidth="3"
                strokeLinecap="round"
                filter="drop-shadow(0px 2px 8px rgba(190, 242, 100, 0.4))"
              />

              {/* Data points */}
              {revenue.map((val, idx) => {
                const x = getX(idx);
                const yRev = getY(val);
                const isHovered = hoveredIndex === idx;

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isHovered && (
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={height - paddingY}
                        stroke="rgba(190, 242, 100, 0.4)"
                        strokeDasharray="2 2"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={yRev}
                      r={isHovered ? 6 : 4}
                      fill="#080a0e"
                      stroke="#bef264"
                      strokeWidth={isHovered ? 3 : 2}
                    />
                  </g>
                );
              })}
            </>
          ) : (
            /* Bar Chart for Profit visualization */
            labels.map((lbl, idx) => {
              const x = getX(idx) - 16;
              const pVal = profit[idx] || 0;
              const y = getY(pVal);
              const barHeight = Math.max(height - paddingY - y, 4);
              const isHovered = hoveredIndex === idx;

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={32}
                    height={barHeight}
                    rx={6}
                    fill={isHovered ? '#ccff00' : '#bef264'}
                    opacity={isHovered ? 1 : 0.85}
                  />
                </g>
              );
            })
          )}

          {/* X Axis Labels */}
          {labels.map((lbl, idx) => {
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - 8}
                fill={hoveredIndex === idx ? '#bef264' : '#64748b'}
                fontSize="11"
                fontFamily="'Space Grotesk', monospace"
                textAnchor="middle"
              >
                {lbl}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            className="dealer-chart-tooltip"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
              top: `${(getY(revenue[hoveredIndex] || 0) / height) * 100}%`
            }}
          >
            <div style={{ color: 'var(--dealer-lime)', fontWeight: 700, marginBottom: '2px' }}>
              {labels[hoveredIndex]} Telemetry
            </div>
            <div>Rev: ₹{revenue[hoveredIndex]}L</div>
            {expenses[hoveredIndex] && <div>Exp: ₹{expenses[hoveredIndex]}L</div>}
            {profit[hoveredIndex] && (
              <div style={{ color: 'var(--dealer-emerald)' }}>
                Net: ₹{profit[hoveredIndex]}L
              </div>
            )}
          </div>
        )}
      </div>

      <div className="dealer-chart-legend">
        <div className="dealer-legend-item">
          <div className="dealer-legend-indicator" style={{ background: '#bef264' }} />
          <span>Total Revenue</span>
        </div>
        <div className="dealer-legend-item">
          <div className="dealer-legend-indicator" style={{ background: '#fbbf24' }} />
          <span>Total Expenses</span>
        </div>
        <div className="dealer-legend-item">
          <div className="dealer-legend-indicator" style={{ background: '#34d399' }} />
          <span>Net Profit</span>
        </div>
      </div>
    </div>
  );
}
