// ==========================================================================
// CARCRAFT DEALER SUITE - MASTER WORKSHOP APPOINTMENTS
// Route: /dealer/service-appointments
// Actions: Approve, Reject, Start Service, Complete, Cancel
// ==========================================================================

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Play,
  XCircle,
  Eye,
  Search,
  Check,
  Calendar,
  Layers,
  X
} from 'lucide-react';

import { serviceApi } from '../services/serviceApi';
import { useDealerCounts } from '../context/DealerCountsContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function ServiceAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { refreshCounts } = useDealerCounts();

  const [actionTarget, setActionTarget] = useState(null); // { id, action, appt }
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [toast, setToast] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await serviceApi.getAppointments({ search, status: statusFilter });
      if (res.success) setAppointments(res.appointments);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load service appointments' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [search, statusFilter]);

  const handleActionConfirm = async () => {
    if (!actionTarget) return;
    try {
      setActionLoading(true);
      const res = await serviceApi.updateStatus(actionTarget.id, actionTarget.action);
      if (res.success) {
        setToast({ type: 'success', message: `Service appointment marked as ${actionTarget.action}.` });
        setActionTarget(null);
        loadAppointments();
        refreshCounts();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Status could not be updated' });
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
            <Wrench size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Master Atelier Workshop Service Bays</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Diagnostics telemetry, factory master technician assignments, cleanroom bay scheduling, and repair orders.
          </p>
        </div>
      </div>

      <div className="dealer-controls-bar">
        <div className="dealer-search-box">
          <Search size={16} className="dealer-search-icon" />
          <input
            type="text"
            className="dealer-search-input"
            placeholder="Search by customer, vehicle, appointment ID..."
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
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="dealer-table-container">
        <table className="dealer-table">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Service Required</th>
              <th>Scheduled Time</th>
              <th>Est. Price</th>
              <th>Bay & Tech</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>
                  <code className="dealer-vin-tag">{a.id}</code>
                </td>
                <td>
                  <strong style={{ color: '#fff' }}>{a.customer}</strong>
                </td>
                <td>
                  <span style={{ color: 'var(--dealer-lime)', fontWeight: 600 }}>{a.vehicle}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dealer-text-secondary)' }}>{a.service}</span>
                </td>
                <td>
                  <div className="dealer-font-mono" style={{ fontSize: '0.78rem' }}>
                    <span style={{ color: '#fff' }}>{a.date}</span>
                    <span style={{ display: 'block', color: 'var(--dealer-text-muted)' }}>{a.time}</span>
                  </div>
                </td>
                <td>
                  <span className="dealer-font-mono" style={{ fontWeight: 700, color: '#fff' }}>{a.estimatedPrice}</span>
                </td>
                <td>
                  <div style={{ fontSize: '0.76rem' }}>
                    <span style={{ color: 'var(--dealer-cyan)', display: 'block' }}>{a.bay}</span>
                    <span style={{ color: 'var(--dealer-text-muted)' }}>{a.technician}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={a.status} />
                </td>
                <td>
                  <div className="dealer-table-actions">
                    <button
                      type="button"
                      className="dealer-action-btn view"
                      onClick={() => setSelectedAppt(a)}
                      title="View Service Order"
                    >
                      <Eye size={15} />
                    </button>

                    {a.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          className="dealer-action-btn edit"
                          onClick={() => setActionTarget({ id: a.id, action: 'APPROVED', appt: a })}
                          title="Approve Appointment"
                        >
                          <Check size={15} />
                        </button>
                        <button
                          type="button"
                          className="dealer-action-btn delete"
                          onClick={() => setActionTarget({ id: a.id, action: 'REJECTED', appt: a })}
                          title="Reject"
                        >
                          <XCircle size={15} />
                        </button>
                      </>
                    )}

                    {a.status === 'APPROVED' && (
                      <button
                        type="button"
                        className="dealer-action-btn edit"
                        style={{ color: 'var(--dealer-cyan)', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                        onClick={() => setActionTarget({ id: a.id, action: 'IN_PROGRESS', appt: a })}
                        title="Start Service"
                      >
                        <Play size={13} />
                      </button>
                    )}

                    {a.status === 'IN_PROGRESS' && (
                      <button
                        type="button"
                        className="dealer-action-btn edit"
                        onClick={() => setActionTarget({ id: a.id, action: 'COMPLETED', appt: a })}
                        title="Mark Complete"
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

      <ConfirmModal
        isOpen={Boolean(actionTarget)}
        title={`Update Appointment #${actionTarget?.id}`}
        message={`Confirm transition of ${actionTarget?.appt?.vehicle} service order to status: ${actionTarget?.action}?`}
        confirmText={`Mark ${actionTarget?.action}`}
        confirmVariant={actionTarget?.action === 'REJECTED' || actionTarget?.action === 'CANCELLED' ? 'danger' : 'primary'}
        loading={actionLoading}
        onConfirm={handleActionConfirm}
        onCancel={() => setActionTarget(null)}
      />

      {/* View Detail Modal */}
      {selectedAppt && (
        <div className="dealer-modal-backdrop" onClick={() => setSelectedAppt(null)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span className="dealer-brand-tag" style={{ color: 'var(--dealer-lime)' }}>Work Order #{selectedAppt.id}</span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '2px' }}>{selectedAppt.customer}</h3>
              </div>
              <StatusBadge status={selectedAppt.status} />
            </div>

            <div style={{ margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Vehicle:</strong> <span style={{ color: '#fff' }}>{selectedAppt.vehicle}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Work Requested:</strong> <span style={{ color: '#fff' }}>{selectedAppt.service}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Estimated Price:</strong> <span style={{ color: 'var(--dealer-lime)', fontWeight: 700 }}>{selectedAppt.estimatedPrice}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Workshop Bay:</strong> <span style={{ color: 'var(--dealer-cyan)' }}>{selectedAppt.bay}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Master Technician:</strong> <span style={{ color: '#fff' }}>{selectedAppt.technician}</span></div>
            </div>

            <button type="button" className="dealer-btn-primary" onClick={() => setSelectedAppt(null)} style={{ alignSelf: 'flex-end' }}>
              Close Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
