// ==========================================================================
// CARCRAFT DEALER SUITE - VERIFIED CLIENTELE & GARAGE DOSSIER
// Route: /dealer/customers
// Strict compliance: Passwords and credentials NEVER exposed
// ==========================================================================

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Eye,
  Car,
  ShoppingBag,
  Wrench,
  KeyRound,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';

import { customerApi } from '../services/customerApi';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [toast, setToast] = useState(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getCustomers({ search });
      if (res.success) setCustomers(res.customers);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load customer registry' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <Users size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Verified Private Clientele Registry</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Collector relationship portfolios, garage asset collections, lifetime spending metrics, and concierge notes.
          </p>
        </div>
      </div>

      <div className="dealer-controls-bar">
        <div className="dealer-search-box">
          <Search size={16} className="dealer-search-icon" />
          <input
            type="text"
            className="dealer-search-input"
            placeholder="Search by client name, email, or telephone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="dealer-table-container">
        <table className="dealer-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Details</th>
              <th>Registered</th>
              <th>Orders</th>
              <th>Service Visits</th>
              <th>Test Drives</th>
              <th>Lifetime Spend</th>
              <th>Tier Status</th>
              <th style={{ textAlign: 'right' }}>Portfolio</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="dealer-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <strong style={{ color: '#fff', display: 'block' }}>{c.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--dealer-text-muted)' }}>{c.city}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.78rem' }}>
                    <span style={{ color: '#fff', display: 'block' }}>{c.phone}</span>
                    <span style={{ color: 'var(--dealer-text-muted)' }}>{c.email}</span>
                  </div>
                </td>
                <td><span className="dealer-date-cell">{c.registrationDate}</span></td>
                <td><span className="dealer-font-mono">{c.orders}</span></td>
                <td><span className="dealer-font-mono">{c.serviceAppointments}</span></td>
                <td><span className="dealer-font-mono">{c.testDrives}</span></td>
                <td><span className="dealer-table-price">{c.totalSpending}</span></td>
                <td>
                  <span className="dealer-category-badge" style={{ color: 'var(--dealer-lime)', borderColor: 'rgba(190, 242, 100, 0.3)' }}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <div className="dealer-table-actions">
                    <button type="button" className="dealer-action-btn view" onClick={() => setSelectedCustomer(c)} title="View Client Portfolio">
                      <Eye size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Portfolio Modal */}
      {selectedCustomer && (
        <div className="dealer-modal-backdrop" onClick={() => setSelectedCustomer(null)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span className="dealer-brand-tag" style={{ color: 'var(--dealer-lime)' }}>{selectedCustomer.status}</span>
                <h3 style={{ color: '#fff', fontSize: '1.35rem', marginTop: '2px' }}>{selectedCustomer.name}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--dealer-text-muted)' }}>Member since {selectedCustomer.registrationDate} • {selectedCustomer.city}</span>
              </div>
              <button type="button" className="dealer-header-btn" onClick={() => setSelectedCustomer(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
              {/* Contact Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="dealer-spec-pill">
                  <span className="label">Primary Phone</span>
                  <span className="val">{selectedCustomer.phone}</span>
                </div>
                <div className="dealer-spec-pill">
                  <span className="label">Registered Email</span>
                  <span className="val">{selectedCustomer.email}</span>
                </div>
              </div>

              {/* Verified Garage Collection */}
              <div>
                <h4 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '0.92rem', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Car size={16} color="var(--dealer-lime)" />
                  <span>Client Garage Assets ({selectedCustomer.garage.length})</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedCustomer.garage.map((g, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--dealer-border-subtle)' }}>
                      <strong style={{ color: '#fff' }}>{g.model} ({g.year})</strong>
                      <code className="dealer-vin-tag">{g.plate}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div className="dealer-spec-pill">
                  <span className="label">Orders Executed</span>
                  <span className="val" style={{ color: 'var(--dealer-cyan)' }}>{selectedCustomer.orders}</span>
                </div>
                <div className="dealer-spec-pill">
                  <span className="label">Service Visits</span>
                  <span className="val" style={{ color: 'var(--dealer-purple)' }}>{selectedCustomer.serviceAppointments}</span>
                </div>
                <div className="dealer-spec-pill">
                  <span className="label">Total Inflow Spend</span>
                  <span className="val" style={{ color: 'var(--dealer-lime)' }}>{selectedCustomer.totalSpending}</span>
                </div>
              </div>

              {/* Concierge Notes */}
              {selectedCustomer.notes && (
                <div style={{ background: 'rgba(190, 242, 100, 0.04)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(190, 242, 100, 0.2)' }}>
                  <strong style={{ color: 'var(--dealer-lime)', display: 'block', marginBottom: '2px', fontSize: '0.78rem' }}>
                    Private Concierge Notes:
                  </strong>
                  <span style={{ color: 'var(--dealer-text-secondary)', fontSize: '0.8rem' }}>{selectedCustomer.notes}</span>
                </div>
              )}
            </div>

            <button type="button" className="dealer-btn-primary" onClick={() => setSelectedCustomer(null)} style={{ alignSelf: 'flex-end' }}>
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
