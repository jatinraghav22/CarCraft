import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Receipt,
  Scale,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Wrench,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  RefreshCw,
  Layers,
  SlidersHorizontal
} from 'lucide-react';

import StatCard from '../components/StatCard';
import FinancialCard from '../components/FinancialCard';
import ChartCard from '../components/ChartCard';
import { dealerApi } from '../services/dealerApi';

export default function Dashboard() {
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [seriesData, setSeriesData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeChartTab, setActiveChartTab] = useState('revenue_expense'); // 'revenue_expense' | 'profit' | 'volume'

  // Fetch telemetry and dashboard metrics through API service layer
  const loadDashboardData = async (selectedPeriod, customDates = null) => {
    try {
      setLoading(true);
      const [metricsRes, chartRes, activityRes] = await Promise.all([
        dealerApi.getDashboardMetrics(selectedPeriod, customDates),
        dealerApi.getChartData(selectedPeriod, customDates),
        dealerApi.getRecentActivity()
      ]);

      if (metricsRes.success) setMetrics(metricsRes.data);
      if (chartRes.success) setSeriesData(chartRes.series);
      if (activityRes.success) setActivities(activityRes.activities);
    } catch (err) {
      console.error('Failed to load dealer dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(period);
  }, [period]);

  const handlePeriodChange = (newPeriod, customDates = null) => {
    setPeriod(newPeriod);
    loadDashboardData(newPeriod, customDates);
  };

  const topStats = metrics?.topStats;
  const secondaryStats = metrics?.secondaryStats;
  const financialStats = metrics?.financialStats;
  const revenueBreakdown = metrics?.revenueBreakdown || [];

  return (
    <div className="dealer-dashboard-page">
      {/* ══════════════════════════════════════════════════════════════════════
          1. WELCOME & TELEMETRY HEADER
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="dealer-welcome-banner">
        <div className="dealer-welcome-left">
          <div className="dealer-welcome-greeting">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Flagship Atelier Command Console
          </div>
          <h2 className="dealer-welcome-title">
            Dealership Performance & Inventory Telemetry
          </h2>
          <p className="dealer-welcome-subtitle">
            Consolidated executive metrics, live inventory valuation, margin analysis, and client service operations.
          </p>
        </div>

        <div className="dealer-welcome-actions">
          <button
            type="button"
            className="dealer-btn-secondary"
            onClick={() => loadDashboardData(period)}
            title="Refresh live telemetry"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Live</span>
          </button>
          <Link to="/dealer/vehicles" className="dealer-btn-primary">
            <PlusCircle size={15} />
            <span>Manage Fleet</span>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. TOP STATISTICS (Fleet, Components, Clientele, Orders)
          ══════════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="dealer-section-header">
          <div className="dealer-section-title-wrap">
            <Layers size={18} />
            <h3 className="dealer-section-title">Core Operations Telemetry</h3>
          </div>
          <span className="dealer-section-subtitle">Auto-updated in real-time</span>
        </div>

        <div className="dealer-top-stats-grid">
          <StatCard
            icon={Car}
            label={topStats?.totalVehicles?.label || 'Total Vehicles'}
            value={loading ? '—' : (topStats?.totalVehicles?.display || '0')}
            change={topStats?.totalVehicles?.change}
            trend={topStats?.totalVehicles?.trend}
            subtext={topStats?.totalVehicles?.subtext}
          />
          <StatCard
            icon={Package}
            label={topStats?.totalParts?.label || 'Total Parts'}
            value={loading ? '—' : (topStats?.totalParts?.display || '0')}
            change={topStats?.totalParts?.change}
            trend={topStats?.totalParts?.trend}
            subtext={topStats?.totalParts?.subtext}
          />
          <StatCard
            icon={Users}
            label={topStats?.totalCustomers?.label || 'Total Customers'}
            value={loading ? '—' : (topStats?.totalCustomers?.display || '0')}
            change={topStats?.totalCustomers?.change}
            trend={topStats?.totalCustomers?.trend}
            subtext={topStats?.totalCustomers?.subtext}
          />
          <StatCard
            icon={ShoppingBag}
            label={topStats?.totalOrders?.label || 'Total Orders'}
            value={loading ? '—' : (topStats?.totalOrders?.display || '0')}
            change={topStats?.totalOrders?.change}
            trend={topStats?.totalOrders?.trend}
            subtext={topStats?.totalOrders?.subtext}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. FINANCIAL STATISTICS & MARGIN AUDIT
          ══════════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="dealer-section-header">
          <div className="dealer-section-title-wrap">
            <Scale size={18} />
            <h3 className="dealer-section-title">Financial Performance & Margins</h3>
          </div>
          <span className="dealer-section-subtitle">
            Accounting Standard: Direct Costs & OpEx Segregation
          </span>
        </div>

        <div className="dealer-financial-grid">
          <FinancialCard
            variant="revenue"
            title="Total Revenue"
            amount={loading ? '—' : (financialStats?.totalRevenue?.display || '₹0')}
            subtitle={financialStats?.totalRevenue?.subtitle}
            change={financialStats?.totalRevenue?.change}
            margin="100% Inflow"
          />
          <FinancialCard
            variant="expenses"
            title="Total Expenses"
            amount={loading ? '—' : (financialStats?.totalExpenses?.display || '₹0')}
            subtitle={financialStats?.totalExpenses?.subtitle}
            change={financialStats?.totalExpenses?.change}
            margin="Direct + OpEx"
          />
          <FinancialCard
            variant="gross-profit"
            title="Gross Profit"
            amount={loading ? '—' : (financialStats?.grossProfit?.display || '₹0')}
            formula={financialStats?.grossProfit?.formula || 'Revenue - Direct Costs'}
            change={financialStats?.grossProfit?.change}
            margin={financialStats?.grossProfit?.margin}
          />
          <FinancialCard
            variant="net-profit"
            title="Net Profit"
            amount={loading ? '—' : (financialStats?.netProfit?.display || '₹0')}
            formula={financialStats?.netProfit?.formula || 'Gross Profit - Operating Expenses'}
            change={financialStats?.netProfit?.change}
            margin={financialStats?.netProfit?.margin}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. DASHBOARD CHARTS & REVENUE BREAKDOWN
          ══════════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="dealer-charts-row">
          {/* Main Financial Analytics Chart */}
          <ChartCard
            title="Financial Trajectory & Inflow"
            subtitle="Inflow (Revenue) vs Expenditure (Expenses)"
            period={period}
            onPeriodChange={handlePeriodChange}
            seriesData={seriesData}
          />

          {/* Revenue Stream Breakdown Card */}
          <div className="dealer-chart-card">
            <div className="dealer-chart-header">
              <div className="dealer-chart-title-area">
                <div className="dealer-chart-title">Revenue Distribution</div>
                <div className="dealer-chart-subtitle">Allocation across business units</div>
              </div>
            </div>

            <div className="dealer-breakdown-list">
              {revenueBreakdown.map((item, idx) => (
                <div key={idx} className="dealer-breakdown-item">
                  <div className="dealer-breakdown-top">
                    <span className="dealer-breakdown-name">
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: item.color,
                          display: 'inline-block'
                        }}
                      />
                      {item.label}
                    </span>
                    <span className="dealer-breakdown-val">
                      {item.amount} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="dealer-breakdown-bar-bg">
                    <div
                      className="dealer-breakdown-bar-fill"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  border: '1px solid var(--dealer-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--dealer-font-mono)',
                  fontSize: '0.75rem'
                }}
              >
                <span style={{ color: 'var(--dealer-text-muted)' }}>Net Realized Margin</span>
                <span style={{ color: 'var(--dealer-lime)', fontWeight: 700 }}>
                  32.7% Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. SECONDARY STATISTICS (Sales Units, Workshop deliveries, Queues)
          ══════════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="dealer-section-header">
          <div className="dealer-section-title-wrap">
            <SlidersHorizontal size={18} />
            <h3 className="dealer-section-title">Operational Velocity & Queues</h3>
          </div>
          <span className="dealer-section-subtitle">Real-time unit throughput</span>
        </div>

        <div className="dealer-secondary-stats-grid">
          <div className="dealer-mini-stat-card">
            <div className="dealer-mini-stat-top">
              <span>{secondaryStats?.vehiclesSold?.label}</span>
              <Car size={16} />
            </div>
            <div className="dealer-mini-stat-value">{secondaryStats?.vehiclesSold?.display}</div>
            <div className="dealer-mini-stat-label text-lime">{secondaryStats?.vehiclesSold?.change}</div>
          </div>

          <div className="dealer-mini-stat-card">
            <div className="dealer-mini-stat-top">
              <span>{secondaryStats?.partsSold?.label}</span>
              <Package size={16} />
            </div>
            <div className="dealer-mini-stat-value">{secondaryStats?.partsSold?.display}</div>
            <div className="dealer-mini-stat-label text-lime">{secondaryStats?.partsSold?.change}</div>
          </div>

          <div className="dealer-mini-stat-card">
            <div className="dealer-mini-stat-top">
              <span>{secondaryStats?.servicesCompleted?.label}</span>
              <CheckCircle2 size={16} />
            </div>
            <div className="dealer-mini-stat-value">{secondaryStats?.servicesCompleted?.display}</div>
            <div className="dealer-mini-stat-label" style={{ color: 'var(--dealer-cyan)' }}>
              {secondaryStats?.servicesCompleted?.change}
            </div>
          </div>

          <div className="dealer-mini-stat-card" style={{ borderColor: 'rgba(251, 191, 36, 0.25)' }}>
            <div className="dealer-mini-stat-top">
              <span>{secondaryStats?.pendingTestDrives?.label}</span>
              <Clock size={16} color="var(--dealer-amber)" />
            </div>
            <div className="dealer-mini-stat-value" style={{ color: 'var(--dealer-amber)' }}>
              {secondaryStats?.pendingTestDrives?.display}
            </div>
            <div className="dealer-mini-stat-label" style={{ color: 'var(--dealer-amber)' }}>
              {secondaryStats?.pendingTestDrives?.badge}
            </div>
          </div>

          <div className="dealer-mini-stat-card" style={{ borderColor: 'rgba(56, 189, 248, 0.25)' }}>
            <div className="dealer-mini-stat-top">
              <span>{secondaryStats?.pendingServices?.label}</span>
              <Wrench size={16} color="var(--dealer-cyan)" />
            </div>
            <div className="dealer-mini-stat-value" style={{ color: 'var(--dealer-cyan)' }}>
              {secondaryStats?.pendingServices?.display}
            </div>
            <div className="dealer-mini-stat-label" style={{ color: 'var(--dealer-cyan)' }}>
              {secondaryStats?.pendingServices?.badge}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. RECENT ACTIVITY & QUICK DISPATCH ACTIONS
          ══════════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="dealer-bottom-grid">
          {/* Recent Activity Log */}
          <div className="dealer-activity-card">
            <div className="dealer-section-header" style={{ marginBottom: 0 }}>
              <div className="dealer-section-title-wrap">
                <Clock size={18} />
                <h3 className="dealer-section-title">Recent Transactions & Dispatches</h3>
              </div>
              <span className="dealer-section-subtitle">Live Stream</span>
            </div>

            <div className="dealer-activity-list">
              {activities.map((act) => (
                <div key={act.id} className="dealer-activity-row">
                  <div className="dealer-activity-left">
                    <div className={`dealer-activity-icon ${act.type}`}>
                      {act.type === 'sale' && <Car size={18} />}
                      {act.type === 'order' && <ShoppingBag size={18} />}
                      {act.type === 'test_drive' && <Clock size={18} />}
                      {act.type === 'service' && <Wrench size={18} />}
                      {act.type === 'expense' && <Receipt size={18} />}
                    </div>

                    <div className="dealer-activity-meta">
                      <div className="dealer-activity-title">{act.title}</div>
                      <div className="dealer-activity-sub">{act.subtitle}</div>
                    </div>
                  </div>

                  <div className="dealer-activity-right">
                    <div className={`dealer-activity-amount ${act.isPositive ? 'positive' : 'negative'}`}>
                      {act.amount}
                    </div>
                    <div className="dealer-activity-sub">
                      <span className={`dealer-status-badge ${act.status.toLowerCase()}`}>
                        {act.status}
                      </span>{' '}
                      • {act.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="dealer-quick-actions-card">
            <div className="dealer-section-header" style={{ marginBottom: 0 }}>
              <div className="dealer-section-title-wrap">
                <Sparkles size={18} />
                <h3 className="dealer-section-title">Operations Console</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/dealer/vehicles" className="dealer-quick-action-btn">
                <div className="dealer-quick-action-btn-left">
                  <Car size={18} />
                  <span>Fleet Catalog & Add Vehicle</span>
                </div>
                <ArrowRight size={16} />
              </Link>

              <Link to="/dealer/parts" className="dealer-quick-action-btn">
                <div className="dealer-quick-action-btn-left">
                  <Package size={18} />
                  <span>Performance Parts & Stock</span>
                </div>
                <ArrowRight size={16} />
              </Link>

              <Link to="/dealer/test-drives" className="dealer-quick-action-btn">
                <div className="dealer-quick-action-btn-left">
                  <Clock size={18} />
                  <span>Review Test Drive Requests</span>
                </div>
                <ArrowRight size={16} />
              </Link>

              <Link to="/dealer/service-appointments" className="dealer-quick-action-btn">
                <div className="dealer-quick-action-btn-left">
                  <Wrench size={18} />
                  <span>Master Workshop Appointments</span>
                </div>
                <ArrowRight size={16} />
              </Link>

              <Link to="/dealer/profit-loss" className="dealer-quick-action-btn">
                <div className="dealer-quick-action-btn-left">
                  <Scale size={18} />
                  <span>Profit & Loss Statement</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div
              style={{
                marginTop: '10px',
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(190, 242, 100, 0.05)',
                border: '1px solid rgba(190, 242, 100, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dealer-lime)', fontWeight: 700, fontSize: '0.8rem' }}>
                <ShieldCheck size={16} />
                <span>Private Dealer Enclave</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--dealer-text-secondary)', lineHeight: 1.4 }}>
                Purchase costs, internal margins, and ledger values are strictly private to this dealership console.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
