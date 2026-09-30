// ==========================================================================
// CARCRAFT DEALER SUITE - SALES & INVOICE LEDGER
// Route: /dealer/sales
// ==========================================================================

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Lock,
  DollarSign,
  Download,
  Calendar,
  Receipt,
  Eye,
  X
} from 'lucide-react';

import { salesApi } from '../services/salesApi';
import { formatDealerINR } from '../data/dealerVehiclesMock';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saleType, setSaleType] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const [selectedSale, setSelectedSale] = useState(null);
  const [toast, setToast] = useState(null);

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await salesApi.getSales({ search, saleType, paymentStatus });
      if (res.success) {
        setSales(res.sales);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load sales ledger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [search, saleType, paymentStatus]);

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <TrendingUp size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Dealership Sales & Invoice Ledger</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Audited transaction records, acquisition cost deductions, GST computations, and net realized profits.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="dealer-fleet-summary-bar">
        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Sales Invoices</span>
          <span className="dealer-fleet-kpi-val">{summary?.totalSalesCount || 0} Invoices</span>
        </div>

        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Gross Revenue</span>
          <span className="dealer-fleet-kpi-val text-lime">
            {summary ? formatDealerINR(summary.totalRevenue) : '₹0'}
          </span>
        </div>

        <div className="dealer-fleet-kpi" style={{ borderLeft: '3px solid var(--dealer-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} color="var(--dealer-emerald)" />
            <span className="dealer-fleet-kpi-label" style={{ color: 'var(--dealer-emerald)' }}>
              Net Realized Profit
            </span>
          </div>
          <span className="dealer-fleet-kpi-val" style={{ color: 'var(--dealer-emerald)' }}>
            {summary ? formatDealerINR(summary.totalProfit) : '₹0'}
          </span>
        </div>
      </div>

      <div className="dealer-controls-bar">
        <div className="dealer-search-box">
          <Search size={16} className="dealer-search-icon" />
          <input
            type="text"
            className="dealer-search-input"
            placeholder="Search invoice number, client, vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Sale Type</label>
          <select className="dealer-select" value={saleType} onChange={(e) => setSaleType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Parts">Parts</option>
            <option value="Service">Service</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Payment</label>
          <select className="dealer-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="All">All Payments</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      <div className="dealer-table-container">
        <table className="dealer-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Product / Service</th>
              <th>Selling Price</th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--dealer-lime)' }}>
                  <Lock size={13} />
                  <span>Cost</span>
                </div>
              </th>
              <th>Net Amount (Incl. Tax)</th>
              <th>Realized Profit</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Dossier</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td><code className="dealer-vin-tag">{s.invoiceNumber}</code></td>
                <td><strong style={{ color: '#fff' }}>{s.customer}</strong></td>
                <td><span className="dealer-font-mono" style={{ fontSize: '0.78rem' }}>{s.saleType}</span></td>
                <td><span style={{ fontSize: '0.8rem', color: 'var(--dealer-text-secondary)' }}>{s.product}</span></td>
                <td><span className="dealer-font-mono">{formatDealerINR(s.sellingPrice)}</span></td>
                <td>
                  <div className="dealer-private-cost-cell">
                    <span>{formatDealerINR(s.purchaseCost)}</span>
                  </div>
                </td>
                <td><span className="dealer-table-price">{formatDealerINR(s.netAmount)}</span></td>
                <td>
                  <span className="dealer-font-mono" style={{ color: 'var(--dealer-emerald)', fontWeight: 700 }}>
                    +{formatDealerINR(s.profit)}
                  </span>
                </td>
                <td><span className="dealer-date-cell">{s.saleDate}</span></td>
                <td>
                  <span className={`dealer-status-badge ${s.paymentStatus === 'PAID' ? 'available' : 'pending'}`}>
                    {s.paymentStatus}
                  </span>
                </td>
                <td>
                  <div className="dealer-table-actions">
                    <button type="button" className="dealer-action-btn view" onClick={() => setSelectedSale(s)} title="View Invoice Audit">
                      <Eye size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSale && (
        <div className="dealer-modal-backdrop" onClick={() => setSelectedSale(null)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span className="dealer-brand-tag" style={{ color: 'var(--dealer-lime)' }}>{selectedSale.invoiceNumber}</span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '2px' }}>{selectedSale.customer}</h3>
              </div>
              <StatusBadge status={selectedSale.paymentStatus} />
            </div>

            <div style={{ margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Product / Deliverable:</strong> <span style={{ color: '#fff' }}>{selectedSale.product}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Payment Instrument:</strong> <span style={{ color: 'var(--dealer-cyan)' }}>{selectedSale.paymentMethod}</span></div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dealer-text-muted)' }}>Selling Base:</span>
                <span style={{ color: '#fff' }}>{formatDealerINR(selectedSale.sellingPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dealer-lime)' }}>Direct Procurement Cost:</span>
                <span style={{ color: 'var(--dealer-lime)' }}>- {formatDealerINR(selectedSale.purchaseCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dealer-text-muted)' }}>Other Direct Costs:</span>
                <span style={{ color: 'var(--dealer-amber)' }}>- {formatDealerINR(selectedSale.otherCosts)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dealer-text-muted)' }}>Applicable GST:</span>
                <span style={{ color: '#fff' }}>+ {formatDealerINR(selectedSale.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, marginTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
                <span style={{ color: 'var(--dealer-emerald)' }}>Realized Net Profit:</span>
                <span style={{ color: 'var(--dealer-emerald)' }}>{formatDealerINR(selectedSale.profit)}</span>
              </div>
            </div>

            <button type="button" className="dealer-btn-primary" onClick={() => setSelectedSale(null)} style={{ alignSelf: 'flex-end' }}>
              Close Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
