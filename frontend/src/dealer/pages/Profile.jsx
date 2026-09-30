// ==========================================================================
// CARCRAFT DEALER SUITE - DEALER IDENTITY & SECURITY
// Route: /dealer/profile
// ==========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  LogOut,
  Edit,
  KeyRound,
  CheckCircle2,
  X
} from 'lucide-react';

import { dealerInfoMock } from '../data/dealerMock';
import { useDealerAuth } from '../context/DealerAuthContext';
import Toast from '../components/Toast';

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useDealerAuth();

  const [dealer, setDealer] = useState(dealerInfoMock);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Edit State
  const [editForm, setEditForm] = useState({
    name: dealer.name,
    email: dealer.email,
    phone: dealer.phone,
    businessAddress: dealer.businessAddress
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setDealer({ ...dealer, ...editForm });
    setToast({ type: 'success', message: 'Dealer profile updated successfully.' });
    setEditModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/dealer/login');
  };

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <UserCheck size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Dealer Identity & Atelier Security</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Verified principal dealer credentials, business registry, lifetime franchise performance, and access keys.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="dealer-btn-secondary" onClick={() => setPasswordModalOpen(true)}>
            <KeyRound size={15} />
            <span>CHANGE PASSWORD</span>
          </button>
          <button type="button" className="dealer-btn-primary" onClick={() => setEditModalOpen(true)}>
            <Edit size={15} />
            <span>EDIT PROFILE</span>
          </button>
          <button type="button" className="dealer-btn-danger" onClick={handleLogout}>
            <LogOut size={15} />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px' }}>
        {/* Identity Dossier Card */}
        <div className="dealer-form-section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="dealer-avatar-circle" style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}>
              AS
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.35rem', color: '#fff' }}>
                {dealer.name}
              </h3>
              <span className="dealer-category-badge" style={{ color: 'var(--dealer-lime)', marginTop: '4px' }}>
                {dealer.tier}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
            <div>
              <span className="dealer-form-label" style={{ color: 'var(--dealer-text-muted)' }}>Dealer ID Code</span>
              <code className="dealer-vin-tag" style={{ display: 'block', marginTop: '3px', width: 'fit-content' }}>
                {dealer.dealerId}
              </code>
            </div>

            <div>
              <span className="dealer-form-label" style={{ color: 'var(--dealer-text-muted)' }}>Registered Email</span>
              <span style={{ color: '#fff', display: 'block', marginTop: '2px' }}>{dealer.email}</span>
            </div>

            <div>
              <span className="dealer-form-label" style={{ color: 'var(--dealer-text-muted)' }}>Direct Telephone</span>
              <span style={{ color: '#fff', display: 'block', marginTop: '2px' }}>{dealer.phone}</span>
            </div>

            <div>
              <span className="dealer-form-label" style={{ color: 'var(--dealer-text-muted)' }}>Franchise Atelier</span>
              <span style={{ color: '#fff', display: 'block', marginTop: '2px' }}>{dealer.businessName}</span>
            </div>

            <div>
              <span className="dealer-form-label" style={{ color: 'var(--dealer-text-muted)' }}>Physical Atelier Address</span>
              <span style={{ color: 'var(--dealer-text-secondary)', display: 'block', marginTop: '2px', lineHeight: 1.4 }}>
                {dealer.businessAddress}
              </span>
            </div>

            <div>
              <span className="dealer-form-label" style={{ color: 'var(--dealer-text-muted)' }}>Account Established</span>
              <span style={{ color: '#fff', display: 'block', marginTop: '2px' }}>{dealer.accountCreated}</span>
            </div>
          </div>

          <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(190, 242, 100, 0.04)', borderRadius: '10px', border: '1px solid rgba(190, 242, 100, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
            <ShieldCheck size={18} color="var(--dealer-lime)" />
            <span style={{ color: 'var(--dealer-lime)' }}>Principal Master Account • Single Tenant Secure Enclave</span>
          </div>
        </div>

        {/* Lifetime Franchise Analytics Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="dealer-form-section-card">
            <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.15rem', color: '#fff', marginBottom: '4px' }}>
              Lifetime Dealership Velocity
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--dealer-text-muted)' }}>
              Cumulative operational output and realized profit since dealer atelier launch.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginTop: '14px' }}>
              <div className="dealer-spec-pill">
                <span className="label">Vehicles Sold</span>
                <span className="val" style={{ color: 'var(--dealer-lime)' }}>38 Units</span>
              </div>
              <div className="dealer-spec-pill">
                <span className="label">Parts Dispatched</span>
                <span className="val" style={{ color: 'var(--dealer-cyan)' }}>412 Units</span>
              </div>
              <div className="dealer-spec-pill">
                <span className="label">Services Completed</span>
                <span className="val" style={{ color: 'var(--dealer-purple)' }}>194 Bays</span>
              </div>
              <div className="dealer-spec-pill">
                <span className="label">Orders Executed</span>
                <span className="val" style={{ color: '#fff' }}>894 Orders</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginTop: '14px' }}>
              <div className="dealer-spec-pill" style={{ borderLeft: '3px solid var(--dealer-lime)' }}>
                <span className="label">Total Inflow Revenue</span>
                <span className="val text-lime">₹2.84 Cr</span>
              </div>
              <div className="dealer-spec-pill" style={{ borderLeft: '3px solid var(--dealer-amber)' }}>
                <span className="label">Total Expenditure</span>
                <span className="val" style={{ color: 'var(--dealer-amber)' }}>₹1.91 Cr</span>
              </div>
              <div className="dealer-spec-pill" style={{ borderLeft: '3px solid var(--dealer-emerald)' }}>
                <span className="label">Net Realized Profit</span>
                <span className="val" style={{ color: 'var(--dealer-emerald)' }}>₹93 Lakh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="dealer-modal-backdrop" onClick={() => setEditModalOpen(false)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '12px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Edit Principal Profile</h3>
              <button type="button" className="dealer-header-btn" onClick={() => setEditModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Dealer Principal Name</label>
                <input
                  type="text"
                  className="dealer-form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Email Address</label>
                <input
                  type="email"
                  className="dealer-form-input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Direct Phone</label>
                <input
                  type="text"
                  className="dealer-form-input"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Atelier Address</label>
                <textarea
                  rows="3"
                  className="dealer-form-textarea"
                  value={editForm.businessAddress}
                  onChange={(e) => setEditForm({ ...editForm, businessAddress: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="dealer-btn-secondary" style={{ flex: 1 }} onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dealer-btn-primary" style={{ flex: 1 }}>
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="dealer-modal-backdrop" onClick={() => setPasswordModalOpen(false)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '12px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Change Security Passcode</h3>
              <button type="button" className="dealer-header-btn" onClick={() => setPasswordModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Current Passcode</label>
                <input type="password" className="dealer-form-input" placeholder="••••••••••••" />
              </div>
              <div className="dealer-form-group">
                <label className="dealer-form-label">New Security Passcode</label>
                <input type="password" className="dealer-form-input" placeholder="Minimum 12 characters" />
              </div>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Confirm New Passcode</label>
                <input type="password" className="dealer-form-input" placeholder="Repeat new passcode" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="dealer-btn-secondary" style={{ flex: 1 }} onClick={() => setPasswordModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="dealer-btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setToast({ type: 'success', message: 'Security passcode updated successfully.' });
                  setPasswordModalOpen(false);
                }}
              >
                Update Passcode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
