// ==========================================================================
// CARCRAFT DEALER SUITE - INVENTORY MANAGEMENT DASHBOARD
// Route: /dealer/inventory
// Sections: Inventory Valuation, Low Stock Alerts, Transactions Ledger
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Car,
  Package,
  AlertTriangle,
  Lock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Clock,
  History,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

import { inventoryApi } from '../services/inventoryApi';
import { formatDealerINR } from '../data/dealerVehiclesMock';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';

export default function Inventory() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [txFilter, setTxFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sumRes, txRes] = await Promise.all([
        inventoryApi.getInventorySummary(),
        inventoryApi.getTransactions({ type: typeFilter, transaction: txFilter })
      ]);
      if (sumRes.success) setSummary(sumRes.summary);
      if (txRes.success) setTransactions(txRes.transactions);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load inventory matrix' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [typeFilter, txFilter]);

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <Boxes size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Capital Inventory & Asset Valuation</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Consolidated vehicle fleet and component stock ledger, acquisition costs, inventory turns, and transaction audits.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="dealer-btn-secondary" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Inventory</span>
          </button>
          <Link to="/dealer/vehicles" className="dealer-btn-secondary">
            <Car size={15} />
            <span>Fleet Fleet</span>
          </Link>
          <Link to="/dealer/parts" className="dealer-btn-primary">
            <Package size={15} />
            <span>Parts Catalog</span>
          </Link>
        </div>
      </div>

      {/* Top Inventory Metric Cards */}
      <div className="dealer-fleet-summary-bar">
        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Total Inventory Items</span>
          <span className="dealer-fleet-kpi-val">{loading ? '—' : `${summary?.totalItems ?? 0} Units`}</span>
        </div>

        <div className="dealer-fleet-kpi private">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} color="var(--dealer-lime)" />
            <span className="dealer-fleet-kpi-label" style={{ color: 'var(--dealer-lime)' }}>
              Capital Inventory Cost
            </span>
          </div>
          <span className="dealer-fleet-kpi-val text-lime">
            {summary ? formatDealerINR(summary.inventoryCost) : '₹0'}
          </span>
        </div>

        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Current Selling Value</span>
          <span className="dealer-fleet-kpi-val">
            {summary ? formatDealerINR(summary.currentSellingValue) : '₹0'}
          </span>
        </div>

        <div className="dealer-fleet-kpi" style={{ borderLeft: '3px solid var(--dealer-emerald)' }}>
          <span className="dealer-fleet-kpi-label">Potential Gross Margin</span>
          <span className="dealer-fleet-kpi-val" style={{ color: 'var(--dealer-emerald)' }}>
            {summary ? formatDealerINR(summary.potentialMargin) : '₹0'}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--dealer-text-muted)' }}>
            *Potential margin if all stock sold at list price
          </span>
        </div>

        <div className="dealer-fleet-kpi" style={{ borderColor: 'rgba(251, 191, 36, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={13} color="var(--dealer-amber)" />
            <span className="dealer-fleet-kpi-label" style={{ color: 'var(--dealer-amber)' }}>
              Low / Zero Stock
            </span>
          </div>
          <span className="dealer-fleet-kpi-val" style={{ color: 'var(--dealer-amber)' }}>
            {(summary?.lowStockItemsCount || 0) + (summary?.outOfStockCount || 0)} SKUs
          </span>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="dealer-form-section-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dealer-lime)', fontWeight: 700, fontSize: '0.9rem' }}>
              <Car size={18} />
              <span>Vehicle Fleet Inventory</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--dealer-text-secondary)', marginTop: '4px' }}>
              8 Allocations registered • 5 Showroom Ready • 2 Reserved
            </p>
          </div>
          <Link to="/dealer/vehicles" className="dealer-btn-secondary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
            <span>Manage Fleet</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="dealer-form-section-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dealer-cyan)', fontWeight: 700, fontSize: '0.9rem' }}>
              <Package size={18} />
              <span>Performance Components Inventory</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--dealer-text-secondary)', marginTop: '4px' }}>
              64 Units in workshop bays • 2 Low Stock SKUs require re-order
            </p>
          </div>
          <Link to="/dealer/parts" className="dealer-btn-secondary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
            <span>Manage Parts</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Inventory Transactions Filter Bar */}
      <div className="dealer-controls-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto' }}>
          <History size={18} color="var(--dealer-lime)" />
          <span style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>
            Inventory Ledger & Transactions
          </span>
        </div>

        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Category</label>
          <select className="dealer-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Parts">Parts</option>
          </select>
        </div>

        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Transaction</label>
          <select className="dealer-select" value={txFilter} onChange={(e) => setTxFilter(e.target.value)}>
            <option value="All">All Transactions</option>
            <option value="Purchase">Purchase</option>
            <option value="Sale">Sale</option>
            <option value="Return">Return</option>
            <option value="Adjustment">Adjustment</option>
            <option value="Damage">Damage</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="dealer-table-container">
        <table className="dealer-table">
          <thead>
            <tr>
              <th>Item / Product</th>
              <th>Asset Type</th>
              <th>Transaction Action</th>
              <th>Quantity</th>
              <th>Unit / Asset Cost</th>
              <th>Date</th>
              <th>Reference / Ledger Ref</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <strong style={{ color: '#fff' }}>{tx.product}</strong>
                </td>
                <td>
                  <span className="dealer-font-mono" style={{ fontSize: '0.78rem' }}>
                    {tx.type}
                  </span>
                </td>
                <td>
                  <span
                    className="dealer-status-badge"
                    style={{
                      background:
                        tx.transaction === 'Purchase'
                          ? 'rgba(56, 189, 248, 0.12)'
                          : tx.transaction === 'Sale'
                          ? 'rgba(190, 242, 100, 0.12)'
                          : tx.transaction === 'Return'
                          ? 'rgba(192, 132, 252, 0.12)'
                          : tx.transaction === 'Damage'
                          ? 'rgba(244, 63, 94, 0.12)'
                          : 'rgba(251, 191, 36, 0.12)',
                      color:
                        tx.transaction === 'Purchase'
                          ? 'var(--dealer-cyan)'
                          : tx.transaction === 'Sale'
                          ? 'var(--dealer-lime)'
                          : tx.transaction === 'Return'
                          ? 'var(--dealer-purple)'
                          : tx.transaction === 'Damage'
                          ? 'var(--dealer-rose)'
                          : 'var(--dealer-amber)',
                      borderColor: 'transparent'
                    }}
                  >
                    {tx.transaction}
                  </span>
                </td>
                <td>
                  <span className="dealer-font-mono" style={{ fontWeight: 700, color: tx.quantity > 0 ? 'var(--dealer-emerald)' : 'var(--dealer-rose)' }}>
                    {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                  </span>
                </td>
                <td>
                  <span className="dealer-font-mono">{tx.cost}</span>
                </td>
                <td>
                  <span className="dealer-date-cell">{tx.date}</span>
                </td>
                <td>
                  <code className="dealer-vin-tag">{tx.reference}</code>
                  {tx.note && <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--dealer-text-muted)' }}>{tx.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
