// ==========================================================================
// CARCRAFT DEALER SUITE - TEST DRIVE REQUESTS CONCIERGE DESK
// Route: /dealer/test-drives
// Actions: Approve, Reject, Complete with Confirmation Modals & Toasts
// ==========================================================================

import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  Check,
  Calendar,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';

import { testDriveApi } from '../services/testDriveApi';
import { useDealerCounts } from '../context/DealerCountsContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function TestDrives() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { refreshCounts } = useDealerCounts();

  // Confirmation Action State
  const [actionTarget, setActionTarget] = useState(null); // { id, action: 'APPROVE' | 'REJECT' | 'COMPLETED', req }
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [toast, setToast] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await testDriveApi.getRequests({ search, status: statusFilter });
      if (res.success) setRequests(res.requests);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load test drive requests' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [search, statusFilter]);

  const handleActionConfirm = async () => {
    if (!actionTarget) return;
    try {
      setActionLoading(true);
      const res = await testDriveApi.updateStatus(actionTarget.id, actionTarget.action);
      if (res.success) {
        const msg =
          actionTarget.action === 'APPROVED'
            ? 'Test drive approved'
            : actionTarget.action === 'REJECTED'
            ? 'Test drive rejected'
            : 'Test drive marked as completed';
        setToast({ type: 'success', message: msg });
        setActionTarget(null);
        loadRequests();
        refreshCounts();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Action could not be completed' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <KeyRound size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Test Drive & Concierge Reservations</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Private circuit sessions, customer license verifications, vehicle allocation, and feedback telemetry.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="dealer-controls-bar">
        <div className="dealer-search-box">
          <Search size={16} className="dealer-search-icon" />
          <input
            type="text"
            className="dealer-search-input"
            placeholder="Search by customer, vehicle, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Status</label>
          <select className="dealer-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="dealer-table-container">
        <table className="dealer-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Customer</th>
              <th>Allocated Vehicle</th>
              <th>Preferred Date & Time</th>
              <th>Track / Location</th>
              <th>Status</th>
              <th>Created</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>
                  <code className="dealer-vin-tag">{r.id}</code>
                </td>
                <td>
                  <div>
                    <strong style={{ color: '#fff' }}>{r.customer}</strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--dealer-text-muted)' }}>
                      {r.phone}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ color: 'var(--dealer-lime)', fontWeight: 600 }}>{r.vehicle}</span>
                </td>
                <td>
                  <div>
                    <span className="dealer-font-mono" style={{ color: '#fff' }}>{r.preferredDate}</span>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--dealer-text-muted)' }}>
                      {r.preferredTime}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dealer-text-secondary)' }}>{r.location}</span>
                </td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
                <td>
                  <span className="dealer-date-cell">{r.createdAt}</span>
                </td>
                <td>
                  <div className="dealer-table-actions">
                    <button
                      type="button"
                      className="dealer-action-btn view"
                      onClick={() => setSelectedReq(r)}
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>

                    {r.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          className="dealer-action-btn edit"
                          onClick={() => setActionTarget({ id: r.id, action: 'APPROVED', req: r })}
                          title="Approve Test Drive"
                        >
                          <Check size={15} />
                        </button>
                        <button
                          type="button"
                          className="dealer-action-btn delete"
                          onClick={() => setActionTarget({ id: r.id, action: 'REJECTED', req: r })}
                          title="Reject Test Drive"
                        >
                          <XCircle size={15} />
                        </button>
                      </>
                    )}

                    {r.status === 'APPROVED' && (
                      <button
                        type="button"
                        className="dealer-action-btn edit"
                        onClick={() => setActionTarget({ id: r.id, action: 'COMPLETED', req: r })}
                        title="Mark Completed"
                      >
                        <CheckCircle2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(actionTarget)}
        title={
          actionTarget?.action === 'APPROVED'
            ? 'Approve Test Drive Reservation'
            : actionTarget?.action === 'REJECTED'
            ? 'Reject Test Drive Request'
            : 'Mark Test Drive as Completed'
        }
        message={`Are you sure you want to mark reservation ${actionTarget?.id} for ${actionTarget?.req?.customer} (${actionTarget?.req?.vehicle}) as ${actionTarget?.action}?`}
        confirmText={
          actionTarget?.action === 'APPROVED'
            ? 'Approve Reservation'
            : actionTarget?.action === 'REJECTED'
            ? 'Confirm Rejection'
            : 'Mark as Completed'
        }
        confirmVariant={actionTarget?.action === 'REJECTED' ? 'danger' : 'primary'}
        loading={actionLoading}
        onConfirm={handleActionConfirm}
        onCancel={() => setActionTarget(null)}
      />

      {/* View Detail Modal */}
      {selectedReq && (
        <div className="dealer-modal-backdrop" onClick={() => setSelectedReq(null)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span className="dealer-brand-tag" style={{ color: 'var(--dealer-lime)' }}>Reservation #{selectedReq.id}</span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '2px' }}>{selectedReq.customer}</h3>
              </div>
              <StatusBadge status={selectedReq.status} />
            </div>

            <div style={{ margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Vehicle Requested:</strong> <span style={{ color: '#fff' }}>{selectedReq.vehicle}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Phone:</strong> <span style={{ color: '#fff' }}>{selectedReq.phone}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Email:</strong> <span style={{ color: '#fff' }}>{selectedReq.email}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Scheduled Slot:</strong> <span style={{ color: 'var(--dealer-lime)' }}>{selectedReq.preferredDate} at {selectedReq.preferredTime}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Location:</strong> <span style={{ color: '#fff' }}>{selectedReq.location}</span></div>
              {selectedReq.notes && <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '8px', border: '1px solid var(--dealer-border-subtle)' }}><strong style={{ color: 'var(--dealer-lime)' }}>Concierge Note:</strong> {selectedReq.notes}</div>}
            </div>

            <button type="button" className="dealer-btn-primary" onClick={() => setSelectedReq(null)} style={{ alignSelf: 'flex-end' }}>
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
