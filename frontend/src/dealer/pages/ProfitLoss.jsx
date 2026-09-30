import React, { useState, useEffect } from 'react';
import {
  Scale,
  Calendar,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

import { profitLossPeriodsMock } from '../data/analyticsMock';
import { formatDealerINR } from '../data/dealerVehiclesMock';
import FinancialCard from '../components/FinancialCard';
import dealerApi from '../services/dealerApi';

export default function ProfitLoss() {
  const [period, setPeriod] = useState('this_month');
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    dealerApi.getProfitLoss({ period })
      .then((res) => {
        if (res?.revenue_breakdown && res?.cost_breakdown) {
          const rev = res.revenue_breakdown;
          const cost = res.cost_breakdown;
          const bot = res.bottom_line;
          setLiveData({
            revenue: {
              total: Number(rev.total_revenue || 0),
              vehicles: Number(rev.vehicle_revenue || 0),
              parts: Number(rev.parts_revenue || 0),
              service: Number(rev.service_revenue || 0),
            },
            costOfGoods: {
              total: Number(cost.direct_costs || 0),
              vehiclesProcurement: Number(cost.direct_costs || 0),
              partsWholesale: 0,
              workshopSupplies: 0,
            },
            grossProfit: {
              amount: Number(cost.gross_profit || 0),
              marginPercent: Number(rev.total_revenue) > 0 ? ((Number(cost.gross_profit) / Number(rev.total_revenue)) * 100).toFixed(1) : 0,
            },
            operatingExpenses: {
              total: Number(cost.operating_expenses || 0),
              facilityLease: 0,
              staffPayroll: 0,
              marketing: 0,
              logistics: 0,
              itSoftware: 0,
            },
            netProfit: {
              amount: Number(bot.net_profit || 0),
              marginPercent: Number(rev.total_revenue) > 0 ? ((Number(bot.net_profit) / Number(rev.total_revenue)) * 100).toFixed(1) : 0,
              isNegative: Number(bot.net_profit) < 0 || Number(bot.net_loss) > 0,
            }
          });
        }
      })
      .catch(() => {});
  }, [period]);

  const pData = liveData || profitLossPeriodsMock[period] || profitLossPeriodsMock.this_month;


  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
    { id: 'this_year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="dealer-vehicles-page">
      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <Scale size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Audited Profit & Loss Statement</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Accounting Standard: Realized Inflow vs Direct Procurement Costs vs Operational Expenditure.
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="dealer-period-switcher" style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '4px' }}>
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`dealer-period-btn ${period === p.id ? 'active' : ''}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accounting Formula Banner */}
      <div
        style={{
          background: 'rgba(190, 242, 100, 0.04)',
          border: '1px solid rgba(190, 242, 100, 0.2)',
          borderRadius: '14px',
          padding: '16px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={18} color="var(--dealer-lime)" />
          <span style={{ fontSize: '0.86rem', color: '#fff' }}>
            <strong style={{ color: 'var(--dealer-lime)' }}>Accounting Compliance Standard:</strong> Realized margins strictly separate Cost of Goods Sold (Direct Costs) from Dealership Operational Overheads (OpEx).
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--dealer-font-mono)', fontSize: '0.78rem' }}>
          <span style={{ color: 'var(--dealer-cyan)' }}>ƒ Gross Profit = Revenue - Direct Costs</span>
          <span style={{ color: 'var(--dealer-emerald)' }}>ƒ Net Profit = Gross Profit - Operating Expenses</span>
        </div>
      </div>

      {/* Financial Core Cards */}
      <div className="dealer-financial-grid">
        <FinancialCard
          variant="revenue"
          title="Revenue (Inflow)"
          amount={formatDealerINR(pData.revenue)}
          subtitle={pData.periodLabel}
          margin="100% Topline"
        />
        <FinancialCard
          variant="expenses"
          title="Direct Costs (COGS)"
          amount={formatDealerINR(pData.directCosts)}
          subtitle="Acquisition & Consumables"
          margin={`${(((pData.directCosts) / (pData.revenue || 1)) * 100).toFixed(1)}% of Rev`}
        />
        <FinancialCard
          variant="gross-profit"
          title="Gross Profit"
          amount={formatDealerINR(pData.grossProfit)}
          formula="Revenue - Direct Costs"
          margin={pData.grossMargin}
        />
        <FinancialCard
          variant="net-profit"
          title="Net Profit"
          amount={formatDealerINR(pData.netProfit)}
          formula="Gross Profit - OpEx"
          margin={pData.netMargin}
        />
      </div>

      {/* Revenue vs Costs Breakdown Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Revenue Breakdown */}
        <div className="dealer-form-section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.1rem', color: '#fff' }}>
              Revenue Allocation Stream
            </h3>
            <span className="text-lime" style={{ fontWeight: 800, fontFamily: 'var(--dealer-font-mono)' }}>
              {formatDealerINR(pData.revenue)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--dealer-text-secondary)' }}>Vehicle Sales Revenue</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{formatDealerINR(pData.revenueBreakdown.vehicleRevenue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--dealer-text-secondary)' }}>Performance Parts Revenue</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{formatDealerINR(pData.revenueBreakdown.partsRevenue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--dealer-text-secondary)' }}>Master Workshop Service Revenue</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{formatDealerINR(pData.revenueBreakdown.serviceRevenue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--dealer-text-secondary)' }}>Other Commissions & Deliveries</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{formatDealerINR(pData.revenueBreakdown.otherRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Costs & Expenditure Breakdown */}
        <div className="dealer-form-section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.1rem', color: '#fff' }}>
              Cost Structure & Overheads
            </h3>
            <span style={{ color: 'var(--dealer-amber)', fontWeight: 800, fontFamily: 'var(--dealer-font-mono)' }}>
              {formatDealerINR(pData.directCosts + pData.operatingExpenses)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--dealer-text-secondary)' }}>Vehicle Procurement (Direct)</span>
              <span style={{ fontWeight: 700, color: 'var(--dealer-amber)' }}>{formatDealerINR(pData.costsBreakdown.vehicleCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--dealer-text-secondary)' }}>Parts Wholesale Cost (Direct)</span>
              <span style={{ fontWeight: 700, color: 'var(--dealer-amber)' }}>{formatDealerINR(pData.costsBreakdown.partsCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--dealer-text-secondary)' }}>Service Consumables Cost (Direct)</span>
              <span style={{ fontWeight: 700, color: 'var(--dealer-amber)' }}>{formatDealerINR(pData.costsBreakdown.serviceCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--dealer-text-secondary)' }}>Operating Expenses (Rent, Payroll, Power)</span>
              <span style={{ fontWeight: 700, color: 'var(--dealer-rose)' }}>{formatDealerINR(pData.costsBreakdown.operatingExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue vs Expenses Financial Audit Table */}
      <div className="dealer-table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--dealer-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--dealer-font-heading)', fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
            Fiscal Interval Breakdown: Revenue vs Expenses
          </span>
          <span className="dealer-font-mono" style={{ fontSize: '0.75rem', color: 'var(--dealer-text-muted)' }}>
            Audited Ledger
          </span>
        </div>

        <table className="dealer-table">
          <thead>
            <tr>
              <th>Fiscal Date / Interval</th>
              <th>Topline Revenue</th>
              <th>Direct Cost (COGS)</th>
              <th>Operating Overhead</th>
              <th>Net Profit / Deficit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pData.financialTable.map((row, idx) => (
              <tr key={idx}>
                <td><strong style={{ color: '#fff' }}>{row.date}</strong></td>
                <td><span className="dealer-font-mono text-lime">+{formatDealerINR(row.revenue)}</span></td>
                <td><span className="dealer-font-mono" style={{ color: 'var(--dealer-amber)' }}>-{formatDealerINR(row.directCost)}</span></td>
                <td><span className="dealer-font-mono" style={{ color: 'var(--dealer-rose)' }}>-{formatDealerINR(row.operatingExpense)}</span></td>
                <td>
                  <span className="dealer-font-mono" style={{ fontWeight: 800, color: row.isProfit ? 'var(--dealer-emerald)' : 'var(--dealer-rose)' }}>
                    {row.isProfit ? `+${formatDealerINR(row.profitLoss)}` : `-${formatDealerINR(Math.abs(row.profitLoss))}`}
                  </span>
                </td>
                <td>
                  <span className={`dealer-status-badge ${row.isProfit ? 'available' : 'cancelled'}`}>
                    {row.isProfit ? 'Surplus' : 'Deficit'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
