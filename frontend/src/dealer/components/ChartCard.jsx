import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  TrendingUp,
  Receipt,
  Scale,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { generateCustomChartSeries } from '../services/dealerApi';

/**
 * Format amounts cleanly for automotive dealership telemetry.
 * Automatically adapts between Lakhs/Crores and standard Rupee notation.
 */
function formatFinancialAmount(val, isLakhs = true) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Number(val);
  const inr = isLakhs ? num * 100000 : num;
  const abs = Math.abs(inr);

  if (abs >= 10000000) {
    const cr = (inr / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  }
  if (abs >= 100000) {
    const lk = (inr / 100000).toFixed(1);
    return `₹${lk} Lakh`;
  }
  return `₹${Math.round(inr).toLocaleString('en-IN')}`;
}

/**
 * Compact formatting for Y-axis ticks.
 */
function formatYTick(val, isLakhs = true) {
  if (val === 0) return '₹0';
  const inr = isLakhs ? val * 100000 : val;
  const abs = Math.abs(inr);

  if (abs >= 10000000) {
    const cr = inr / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    const lk = inr / 100000;
    return `₹${lk % 1 === 0 ? lk : lk.toFixed(0)}L`;
  }
  return `₹${Math.round(inr)}`;
}

/**
 * Generate smooth Catmull-Rom cubic bezier spline path string.
 */
function generateSplinePath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
 * Generate closed spline area path for under-the-curve gradients.
 */
function generateSplineArea(points, bottomY) {
  if (!points || points.length === 0) return '';
  const linePath = generateSplinePath(points);
  const firstX = points[0].x.toFixed(1);
  const lastX = points[points.length - 1].x.toFixed(1);
  return `${linePath} L ${lastX} ${bottomY.toFixed(1)} L ${firstX} ${bottomY.toFixed(1)} Z`;
}

export default function ChartCard({
  title = 'Financial Trajectory & Inflow',
  subtitle = 'Inflow (Revenue) vs Expenditure (Expenses)',
  period = 'monthly',
  onPeriodChange,
  seriesData,
}) {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Custom date range state
  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  }, []);

  const defaultStartStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  }, []);

  const [startDate, setStartDate] = useState(defaultStartStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [dateError, setDateError] = useState('');

  // Interactive line visibility toggles for the legend
  const [visibleSeries, setVisibleSeries] = useState({
    revenue: true,
    expenses: true,
    profit: true,
  });

  const toggleSeries = (key) => {
    setVisibleSeries((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (activeCount === 1 && prev[key]) {
        // Prevent turning off all series
        return prev;
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  // Derive series points
  const activeSeries = useMemo(() => {
    if (period === 'custom') {
      if (startDate && endDate && startDate <= endDate) {
        return generateCustomChartSeries(startDate, endDate);
      }
    }
    if (seriesData?.labels && seriesData?.revenue && seriesData?.expenses) {
      const profit = seriesData.profit || seriesData.revenue.map((r, i) => r - (seriesData.expenses[i] || 0));
      return {
        labels: seriesData.labels,
        revenue: seriesData.revenue,
        expenses: seriesData.expenses,
        profit,
      };
    }
    return {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      revenue: [180, 210, 245, 220, 260, 284],
      expenses: [130, 150, 168, 155, 175, 191],
      profit: [50, 60, 77, 65, 85, 93],
    };
  }, [period, seriesData, startDate, endDate]);

  const labels = activeSeries.labels || [];
  const revenue = activeSeries.revenue || [];
  const expenses = activeSeries.expenses || [];
  // Ensure profit = revenue - expenses dynamically
  const profit = useMemo(() => {
    return revenue.map((r, i) => r - (expenses[i] || 0));
  }, [revenue, expenses]);

  // Summary card dynamic calculations
  const totalRevenue = useMemo(() => {
    return revenue.reduce((acc, val) => acc + (Number(val) || 0), 0);
  }, [revenue]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, val) => acc + (Number(val) || 0), 0);
  }, [expenses]);

  const netProfit = useMemo(() => {
    return totalRevenue - totalExpenses;
  }, [totalRevenue, totalExpenses]);

  const netMarginPercent = useMemo(() => {
    if (totalRevenue <= 0) return '0.0';
    return ((netProfit / totalRevenue) * 100).toFixed(1);
  }, [totalRevenue, netProfit]);

  // Handle custom date updates
  const handleDateChange = (newStart, newEnd) => {
    if (!newStart || !newEnd) {
      setDateError('Please select both start and end dates.');
      return;
    }
    if (newEnd < newStart) {
      setDateError('End date cannot be earlier than start date.');
      return;
    }
    setDateError('');
    setStartDate(newStart);
    setEndDate(newEnd);
    if (onPeriodChange) {
      onPeriodChange('custom', { startDate: newStart, endDate: newEnd });
    }
  };

  const applyPreset = (presetKey) => {
    const end = new Date();
    let start = new Date();

    if (presetKey === '30d') {
      start.setDate(end.getDate() - 30);
    } else if (presetKey === '90d') {
      start.setDate(end.getDate() - 90);
    } else if (presetKey === 'ytd') {
      start = new Date(end.getFullYear(), 0, 1);
    }

    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);
    handleDateChange(startStr, endStr);
  };

  // SVG dimensions & scaling
  const width = 760;
  const height = 280;
  const paddingLeft = 58;
  const paddingRight = 32;
  const paddingTop = 24;
  const paddingBottom = 42;

  const usableWidth = width - paddingLeft - paddingRight;
  const usableHeight = height - paddingTop - paddingBottom;
  const bottomAxisY = height - paddingBottom;

  // Compute maximum and minimum values for scale
  const allValues = useMemo(() => {
    return [...revenue, ...expenses, ...profit];
  }, [revenue, expenses, profit]);

  const rawMax = Math.max(...allValues, 100);
  const rawMin = Math.min(0, ...allValues);

  // Round maxVal up to nearest clean interval
  const maxVal = Math.ceil((rawMax * 1.15) / 25) * 25;
  const minVal = rawMin < 0 ? Math.floor(rawMin / 25) * 25 : 0;
  const range = Math.max(maxVal - minVal, 1);

  const getX = (index) => {
    if (labels.length <= 1) return paddingLeft + usableWidth / 2;
    return paddingLeft + (index / (labels.length - 1)) * usableWidth;
  };

  const getY = (val) => {
    const ratio = (val - minVal) / range;
    return bottomAxisY - ratio * usableHeight;
  };

  // Convert data arrays to coordinate points
  const revenuePoints = useMemo(() => {
    return revenue.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
  }, [revenue, minVal, range, labels.length]);

  const expensePoints = useMemo(() => {
    return expenses.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
  }, [expenses, minVal, range, labels.length]);

  const profitPoints = useMemo(() => {
    return profit.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
  }, [profit, minVal, range, labels.length]);

  const revenuePath = generateSplinePath(revenuePoints);
  const revenueArea = generateSplineArea(revenuePoints, bottomAxisY);

  const expensePath = generateSplinePath(expensePoints);
  const expenseArea = generateSplineArea(expensePoints, bottomAxisY);

  const profitPath = generateSplinePath(profitPoints);
  const profitArea = generateSplineArea(profitPoints, bottomAxisY);

  // SVG Mouse event tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current || labels.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * width;

    // Find closest data point index
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < labels.length; i++) {
      const diff = Math.abs(getX(i) - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    setHoveredIndex(closestIdx);
  };

  return (
    <div className="dealer-chart-card financial-trajectory-card">
      {/* ── 1. HEADER & SEGMENTED TIME RANGE CONTROLS ── */}
      <div className="dealer-chart-header">
        <div className="dealer-chart-title-area">
          <div className="dealer-chart-title-badge-row">
            <span className="dealer-chart-title">{title}</span>
            <span className="financial-status-pill">
              <Sparkles size={11} className="financial-sparkle-icon" />
              Real-time Inflow
            </span>
          </div>
          <div className="dealer-chart-subtitle">{subtitle}</div>
        </div>

        {/* Clean Segmented Time-Range Control */}
        <div className="financial-segmented-controls-wrapper">
          <div className="dealer-period-switcher" role="tablist" aria-label="Time period selection">
            {['monthly', 'weekly', 'yearly', 'custom'].map((p) => {
              const isActive = period === p;
              const label = p.charAt(0).toUpperCase() + p.slice(1);
              return (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`dealer-period-btn financial-segment-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (onPeriodChange) {
                      onPeriodChange(p, p === 'custom' ? { startDate, endDate } : null);
                    }
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 2. CUSTOM DATE RANGE SELECTOR (EXPANDS WHEN CUSTOM IS ACTIVE) ── */}
      {period === 'custom' && (
        <div className="financial-custom-range-bar" role="region" aria-label="Custom Date Range Selector">
          <div className="financial-custom-inputs-row">
            <div className="financial-date-group">
              <label htmlFor="financial-start-date" className="financial-date-label">
                <Calendar size={13} />
                <span>Start Date</span>
              </label>
              <input
                id="financial-start-date"
                type="date"
                className="financial-date-input"
                value={startDate}
                onChange={(e) => handleDateChange(e.target.value, endDate)}
                max={endDate}
              />
            </div>

            <span className="financial-date-separator">to</span>

            <div className="financial-date-group">
              <label htmlFor="financial-end-date" className="financial-date-label">
                <Calendar size={13} />
                <span>End Date</span>
              </label>
              <input
                id="financial-end-date"
                type="date"
                className="financial-date-input"
                value={endDate}
                onChange={(e) => handleDateChange(startDate, e.target.value)}
                min={startDate}
                max={todayStr}
              />
            </div>

            {/* Quick Presets */}
            <div className="financial-preset-buttons">
              <button
                type="button"
                className="financial-preset-chip"
                onClick={() => applyPreset('30d')}
              >
                Last 30D
              </button>
              <button
                type="button"
                className="financial-preset-chip"
                onClick={() => applyPreset('90d')}
              >
                Last 90D
              </button>
              <button
                type="button"
                className="financial-preset-chip"
                onClick={() => applyPreset('ytd')}
              >
                YTD
              </button>
            </div>
          </div>

          {dateError && (
            <div className="financial-date-error-row" role="alert">
              <AlertCircle size={14} />
              <span>{dateError}</span>
            </div>
          )}
        </div>
      )}

      {/* ── 3. THREE COMPACT FINANCIAL SUMMARY CARDS ── */}
      <div className="financial-summary-cards-grid">
        {/* Card 1: Total Revenue */}
        <div className="financial-summary-card financial-card-revenue">
          <div className="financial-summary-header">
            <div className="financial-summary-icon-wrap rev-icon">
              <TrendingUp size={16} />
            </div>
            <span className="financial-summary-label">Total Revenue</span>
            <span className="financial-summary-badge rev-badge">Gross Inflow</span>
          </div>
          <div className="financial-summary-amount rev-amount">
            {formatFinancialAmount(totalRevenue)}
          </div>
          <div className="financial-summary-subtext">
            <span>Period Inflow</span>
            <span className="financial-summary-dot" />
            <span className="financial-summary-stat">100% Volume</span>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="financial-summary-card financial-card-expenses">
          <div className="financial-summary-header">
            <div className="financial-summary-icon-wrap exp-icon">
              <Receipt size={16} />
            </div>
            <span className="financial-summary-label">Total Expenses</span>
            <span className="financial-summary-badge exp-badge">Expenditure</span>
          </div>
          <div className="financial-summary-amount exp-amount">
            {formatFinancialAmount(totalExpenses)}
          </div>
          <div className="financial-summary-subtext">
            <span>Procurement & OpEx</span>
            <span className="financial-summary-dot" />
            <span className="financial-summary-stat">
              {totalRevenue > 0 ? `${((totalExpenses / totalRevenue) * 100).toFixed(1)}% Ratio` : '—'}
            </span>
          </div>
        </div>

        {/* Card 3: Net Profit (Dynamically Calculated: Total Revenue - Total Expenses) */}
        <div className={`financial-summary-card financial-card-profit ${netProfit >= 0 ? 'profit-positive' : 'profit-negative'}`}>
          <div className="financial-summary-header">
            <div className="financial-summary-icon-wrap profit-icon">
              <Scale size={16} />
            </div>
            <span className="financial-summary-label">Net Profit</span>
            <span className="financial-summary-badge profit-badge">
              {netProfit >= 0 ? `+${netMarginPercent}% Margin` : `${netMarginPercent}% Margin`}
            </span>
          </div>
          <div className="financial-summary-amount profit-amount">
            {formatFinancialAmount(netProfit)}
          </div>
          <div className="financial-summary-subtext">
            <span>Revenue − Expenses</span>
            <span className="financial-summary-dot" />
            <span className="financial-summary-stat">Operational Yield</span>
          </div>
        </div>
      </div>

      {/* ── 4. INTERACTIVE SVG LINE CHART ── */}
      <div
        className="dealer-svg-chart-container financial-svg-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="dealer-svg-canvas financial-svg-canvas"
          preserveAspectRatio="none"
          aria-label="Financial Trajectory and Inflow line chart"
        >
          <defs>
            {/* Revenue Gradient */}
            <linearGradient id="finRevenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-rev-color, #bef264)" stopOpacity="0.32" />
              <stop offset="70%" stopColor="var(--chart-rev-color, #bef264)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--chart-rev-color, #bef264)" stopOpacity="0.0" />
            </linearGradient>

            {/* Expenses Gradient */}
            <linearGradient id="finExpenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-exp-color, #fb7185)" stopOpacity="0.28" />
              <stop offset="70%" stopColor="var(--chart-exp-color, #fb7185)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="var(--chart-exp-color, #fb7185)" stopOpacity="0.0" />
            </linearGradient>

            {/* Net Profit Gradient */}
            <linearGradient id="finProfitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-profit-color, #38bdf8)" stopOpacity="0.3" />
              <stop offset="70%" stopColor="var(--chart-profit-color, #38bdf8)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--chart-profit-color, #38bdf8)" stopOpacity="0.0" />
            </linearGradient>

            {/* Subtle glow filters */}
            <filter id="finRevGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="var(--chart-rev-glow, rgba(190, 242, 100, 0.4))" />
            </filter>
            <filter id="finExpGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="var(--chart-exp-glow, rgba(251, 113, 133, 0.4))" />
            </filter>
            <filter id="finProfitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="var(--chart-profit-glow, rgba(56, 189, 248, 0.4))" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {[1.0, 0.75, 0.5, 0.25, 0.0].map((ratio, idx) => {
            const y = paddingTop + (1 - ratio) * usableHeight;
            const tickVal = minVal + ratio * range;
            return (
              <g key={`grid-${idx}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--chart-grid-color, rgba(255, 255, 255, 0.07))"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="var(--chart-axis-color, #94a3b8)"
                  fontSize="11"
                  fontFamily="var(--dealer-font-mono)"
                  textAnchor="end"
                >
                  {formatYTick(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Area Fills for active lines */}
          {visibleSeries.expenses && (
            <path
              d={expenseArea}
              fill="url(#finExpenseGradient)"
              className="financial-chart-area"
            />
          )}

          {visibleSeries.revenue && (
            <path
              d={revenueArea}
              fill="url(#finRevenueGradient)"
              className="financial-chart-area"
            />
          )}

          {visibleSeries.profit && (
            <path
              d={profitArea}
              fill="url(#finProfitGradient)"
              className="financial-chart-area"
            />
          )}

          {/* Distinct Spline Lines */}
          {visibleSeries.expenses && (
            <path
              d={expensePath}
              fill="none"
              stroke="var(--chart-exp-color, #fb7185)"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#finExpGlow)"
              className="financial-chart-line"
            />
          )}

          {visibleSeries.revenue && (
            <path
              d={revenuePath}
              fill="none"
              stroke="var(--chart-rev-color, #bef264)"
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#finRevGlow)"
              className="financial-chart-line"
            />
          )}

          {visibleSeries.profit && (
            <path
              d={profitPath}
              fill="none"
              stroke="var(--chart-profit-color, #38bdf8)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#finProfitGlow)"
              className="financial-chart-line"
            />
          )}

          {/* X Axis Period Labels */}
          {labels.map((lbl, idx) => {
            const x = getX(idx);
            const isHovered = hoveredIndex === idx;
            return (
              <text
                key={`label-${idx}`}
                x={x}
                y={height - 12}
                fill={isHovered ? 'var(--chart-rev-color, #bef264)' : 'var(--chart-axis-color, #94a3b8)'}
                fontWeight={isHovered ? '700' : '500'}
                fontSize="11.5"
                fontFamily="var(--dealer-font-mono)"
                textAnchor="middle"
                className="financial-x-label"
              >
                {lbl}
              </text>
            );
          })}

          {/* Interactive Hover Crosshair & Data Points */}
          {hoveredIndex !== null && hoveredIndex < labels.length && (
            <g className="financial-chart-hover-group">
              {/* Vertical Guide */}
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop - 6}
                x2={getX(hoveredIndex)}
                y2={bottomAxisY}
                stroke="var(--chart-crosshair, rgba(255, 255, 255, 0.35))"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />

              {/* Expenses Data Point */}
              {visibleSeries.expenses && expenses[hoveredIndex] !== undefined && (
                <g>
                  <circle
                    cx={getX(hoveredIndex)}
                    cy={getY(expenses[hoveredIndex])}
                    r={8}
                    fill="var(--chart-exp-glow, rgba(251, 113, 133, 0.4))"
                    opacity="0.8"
                  />
                  <circle
                    cx={getX(hoveredIndex)}
                    cy={getY(expenses[hoveredIndex])}
                    r={4.5}
                    fill="var(--dealer-bg-surface, #080a0e)"
                    stroke="var(--chart-exp-color, #fb7185)"
                    strokeWidth="2.5"
                  />
                </g>
              )}

              {/* Net Profit Data Point */}
              {visibleSeries.profit && profit[hoveredIndex] !== undefined && (
                <g>
                  <circle
                    cx={getX(hoveredIndex)}
                    cy={getY(profit[hoveredIndex])}
                    r={8.5}
                    fill="var(--chart-profit-glow, rgba(56, 189, 248, 0.4))"
                    opacity="0.8"
                  />
                  <circle
                    cx={getX(hoveredIndex)}
                    cy={getY(profit[hoveredIndex])}
                    r={5}
                    fill="var(--dealer-bg-surface, #080a0e)"
                    stroke="var(--chart-profit-color, #38bdf8)"
                    strokeWidth="2.5"
                  />
                </g>
              )}

              {/* Revenue Data Point */}
              {visibleSeries.revenue && revenue[hoveredIndex] !== undefined && (
                <g>
                  <circle
                    cx={getX(hoveredIndex)}
                    cy={getY(revenue[hoveredIndex])}
                    r={9}
                    fill="var(--chart-rev-glow, rgba(190, 242, 100, 0.45))"
                    opacity="0.8"
                  />
                  <circle
                    cx={getX(hoveredIndex)}
                    cy={getY(revenue[hoveredIndex])}
                    r={5.5}
                    fill="var(--dealer-bg-surface, #080a0e)"
                    stroke="var(--chart-rev-color, #bef264)"
                    strokeWidth="3"
                  />
                </g>
              )}
            </g>
          )}
        </svg>

        {/* ── 5. INTERACTIVE HOVER TOOLTIP OVERLAY ── */}
        {hoveredIndex !== null && hoveredIndex < labels.length && (
          <div
            className="dealer-chart-tooltip financial-chart-tooltip"
            style={{
              left: `${Math.min(Math.max((getX(hoveredIndex) / width) * 100, 16), 84)}%`,
              top: '18%',
            }}
          >
            <div className="financial-tooltip-header">
              <span className="financial-tooltip-period">{labels[hoveredIndex]} Telemetry</span>
              <span className="financial-tooltip-badge">Audited</span>
            </div>

            <div className="financial-tooltip-body">
              <div className="financial-tooltip-row">
                <span className="financial-tooltip-indicator rev-dot" />
                <span className="financial-tooltip-name">Total Revenue:</span>
                <span className="financial-tooltip-val rev-val">
                  {formatFinancialAmount(revenue[hoveredIndex])}
                </span>
              </div>

              <div className="financial-tooltip-row">
                <span className="financial-tooltip-indicator exp-dot" />
                <span className="financial-tooltip-name">Total Expenses:</span>
                <span className="financial-tooltip-val exp-val">
                  {formatFinancialAmount(expenses[hoveredIndex])}
                </span>
              </div>

              <div className="financial-tooltip-divider" />

              <div className="financial-tooltip-row profit-row">
                <span className="financial-tooltip-indicator profit-dot" />
                <span className="financial-tooltip-name">Net Profit:</span>
                <span className="financial-tooltip-val profit-val">
                  {formatFinancialAmount(profit[hoveredIndex])}
                </span>
              </div>

              {revenue[hoveredIndex] > 0 && (
                <div className="financial-tooltip-margin">
                  Margin: {((profit[hoveredIndex] / revenue[hoveredIndex]) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 6. INTERACTIVE LEGEND (TOGGLE LINES ON/OFF) ── */}
      <div className="dealer-chart-legend financial-chart-legend">
        <button
          type="button"
          className={`financial-legend-btn ${visibleSeries.revenue ? 'active' : 'dimmed'}`}
          onClick={() => toggleSeries('revenue')}
          title="Toggle Total Revenue line"
        >
          <span className="dealer-legend-indicator" style={{ background: 'var(--chart-rev-color, #bef264)' }} />
          <span>Total Revenue</span>
          {visibleSeries.revenue ? <Eye size={12} className="financial-legend-eye" /> : <EyeOff size={12} className="financial-legend-eye" />}
        </button>

        <button
          type="button"
          className={`financial-legend-btn ${visibleSeries.expenses ? 'active' : 'dimmed'}`}
          onClick={() => toggleSeries('expenses')}
          title="Toggle Total Expenses line"
        >
          <span className="dealer-legend-indicator" style={{ background: 'var(--chart-exp-color, #fb7185)' }} />
          <span>Total Expenses</span>
          {visibleSeries.expenses ? <Eye size={12} className="financial-legend-eye" /> : <EyeOff size={12} className="financial-legend-eye" />}
        </button>

        <button
          type="button"
          className={`financial-legend-btn ${visibleSeries.profit ? 'active' : 'dimmed'}`}
          onClick={() => toggleSeries('profit')}
          title="Toggle Net Profit line"
        >
          <span className="dealer-legend-indicator" style={{ background: 'var(--chart-profit-color, #38bdf8)' }} />
          <span>Net Profit</span>
          {visibleSeries.profit ? <Eye size={12} className="financial-legend-eye" /> : <EyeOff size={12} className="financial-legend-eye" />}
        </button>

        <span className="financial-legend-hint">Click series to toggle visibility</span>
      </div>
    </div>
  );
}
